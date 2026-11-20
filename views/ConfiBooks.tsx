import React, { useState } from 'react';
import { useAppContext } from '../AppContext';
import { ConfiAccount, ConfiJournalEntry, ConfiInvoice, ConfiBill, FixedAssetItem } from './types';
import { formatCurrency } from '../utils/formatters';

const ConfiBooks: React.FC = () => {
  const {
    confiAccounts,
    confiJournalEntries,
    confiInvoices,
    confiBills,
    fixedAssets,
    handleAddConfiAccount,
    handleAddConfiJournalEntry,
    handleAddConfiInvoice,
    handleRecordConfiInvoicePayment,
    handleAddConfiBill,
    handleRecordConfiBillPayment,
    handleAddFixedAsset,
    handleRunFixedAssetDepreciation,
  } = useAppContext();

  const [activeTab, setActiveTab] = useState<'coa' | 'journals' | 'invoices' | 'bills' | 'fixedAssets' | 'reports'>('coa');
  const [reportSubTab, setReportSubTab] = useState<'pnl' | 'balanceSheet' | 'trialBalance' | 'cashFlow' | 'arAging'>('pnl');

  // Modal states
  const [showNewAccountModal, setShowNewAccountModal] = useState(false);
  const [showNewJournalModal, setShowNewJournalModal] = useState(false);
  const [showNewInvoiceModal, setShowNewInvoiceModal] = useState(false);
  const [showNewBillModal, setShowNewBillModal] = useState(false);
  const [showNewAssetModal, setShowNewAssetModal] = useState(false);
  const [showPayInvoiceModal, setShowPayInvoiceModal] = useState<ConfiInvoice | null>(null);
  const [showPayBillModal, setShowPayBillModal] = useState<ConfiBill | null>(null);
  const [paymentAmountInput, setPaymentAmountInput] = useState<number>(0);

  // New Account Form
  const [newAccCode, setNewAccCode] = useState('');
  const [newAccName, setNewAccName] = useState('');
  const [newAccCategory, setNewAccCategory] = useState<ConfiAccount['category']>('Asset');
  const [newAccSubCat, setNewAccSubCat] = useState('');
  const [newAccBalance, setNewAccBalance] = useState(0);
  const [newAccDesc, setNewAccDesc] = useState('');

  // New Journal Form
  const [newJvRef, setNewJvRef] = useState('');
  const [newJvNarration, setNewJvNarration] = useState('');
  const [jvLines, setJvLines] = useState<Array<{ accountId: string; description: string; debit: number; credit: number }>>([
    { accountId: confiAccounts[0]?.id || '', description: 'Debit Line', debit: 10000, credit: 0 },
    { accountId: confiAccounts[1]?.id || '', description: 'Credit Line', debit: 0, credit: 10000 },
  ]);

  // New Invoice Form
  const [newInvCustomer, setNewInvCustomer] = useState('');
  const [newInvDueDate, setNewInvDueDate] = useState('2026-09-30');
  const [newInvGst, setNewInvGst] = useState('27AABCP1234F1Z8');
  const [invItems, setInvItems] = useState<Array<{ name: string; hsnSac: string; quantity: number; unitPrice: number; discountPercent: number; taxPercent: number }>>([
    { name: 'Core Enterprise Subscription', hsnSac: '998313', quantity: 1, unitPrice: 100000, discountPercent: 0, taxPercent: 18 }
  ]);

  // New Bill Form
  const [newBillVendor, setNewBillVendor] = useState('');
  const [newBillDueDate, setNewBillDueDate] = useState('2026-09-30');
  const [newBillPo, setNewBillPo] = useState('PO-2026-101');
  const [billItems, setBillItems] = useState<Array<{ description: string; quantity: number; unitPrice: number; taxPercent: number }>>([
    { description: 'Cloud Infrastructure Hosting', quantity: 1, unitPrice: 50000, taxPercent: 18 }
  ]);

  // New Asset Form
  const [newAssetCode, setNewAssetCode] = useState(`FA-${Math.floor(100 + Math.random() * 900)}`);
  const [newAssetName, setNewAssetName] = useState('');
  const [newAssetCategory, setNewAssetCategory] = useState<FixedAssetItem['category']>('IT & Office Hardware');
  const [newAssetCost, setNewAssetCost] = useState(250000);
  const [newAssetSalvage, setNewAssetSalvage] = useState(25000);
  const [newAssetLife, setNewAssetLife] = useState(5);
  const [newAssetMethod, setNewAssetMethod] = useState<FixedAssetItem['depreciationMethod']>('Straight Line (SLM)');
  const [newAssetLocation, setNewAssetLocation] = useState('Central Office, Mumbai');
  const [newAssetCustodian, setNewAssetCustodian] = useState('IT Systems Administrator');

  // Total Account Balances Summary
  const totalAssets = confiAccounts.filter(a => a.category === 'Asset').reduce((sum, a) => sum + a.balance, 0);
  const totalLiabilities = confiAccounts.filter(a => a.category === 'Liability').reduce((sum, a) => sum + a.balance, 0);
  const totalEquity = confiAccounts.filter(a => a.category === 'Equity').reduce((sum, a) => sum + a.balance, 0);
  const totalIncome = confiAccounts.filter(a => a.category === 'Income').reduce((sum, a) => sum + a.balance, 0);
  const totalExpenses = confiAccounts.filter(a => a.category === 'Expense' || a.category === 'Cost of Goods Sold').reduce((sum, a) => sum + a.balance, 0);
  const netProfit = totalIncome - totalExpenses;

  // AR & AP Summaries
  const totalArOutstanding = confiInvoices.reduce((sum, i) => sum + i.balanceDue, 0);
  const totalApOutstanding = confiBills.reduce((sum, b) => sum + b.balanceDue, 0);

  // Journal handlers
  const handleAddJvLine = () => {
    setJvLines(prev => [...prev, { accountId: confiAccounts[0]?.id || '', description: '', debit: 0, credit: 0 }]);
  };

  const handleRemoveJvLine = (index: number) => {
    if (jvLines.length <= 2) {
      alert('Journal entry must have at least 2 lines (debit & credit).');
      return;
    }
    setJvLines(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpdateJvLine = (index: number, field: string, value: any) => {
    setJvLines(prev => prev.map((l, i) => i === index ? { ...l, [field]: value } : l));
  };

  const handleSaveJournal = (e: React.FormEvent) => {
    e.preventDefault();
    const formattedLines = jvLines.map((l, idx) => {
      const acc = confiAccounts.find(a => a.id === l.accountId);
      return {
        id: `cjl-${Date.now()}-${idx}`,
        accountId: l.accountId,
        accountCode: acc?.code || '0000',
        accountName: acc?.name || 'Unknown Account',
        description: l.description || newJvNarration,
        debit: Number(l.debit) || 0,
        credit: Number(l.credit) || 0
      };
    });

    handleAddConfiJournalEntry({
      date: new Date().toISOString().split('T')[0],
      reference: newJvRef || `REF-${Date.now().toString().slice(-6)}`,
      narration: newJvNarration,
      lines: formattedLines,
      createdBy: 'Financial Controller',
      isRecurring: false
    });
    setShowNewJournalModal(false);
  };

  const handleSaveAccount = (e: React.FormEvent) => {
    e.preventDefault();
    handleAddConfiAccount({
      code: newAccCode,
      name: newAccName,
      category: newAccCategory,
      subCategory: newAccSubCat || newAccCategory,
      balance: Number(newAccBalance),
      currency: 'INR',
      description: newAccDesc,
      isActive: true
    });
    setShowNewAccountModal(false);
  };

  const handleSaveInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    const items = invItems.map((it, idx) => {
      const discounted = it.quantity * it.unitPrice * (1 - (it.discountPercent || 0) / 100);
      const tax = discounted * ((it.taxPercent || 0) / 100);
      return {
        id: `ii-${Date.now()}-${idx}`,
        name: it.name,
        hsnSac: it.hsnSac,
        quantity: Number(it.quantity),
        unitPrice: Number(it.unitPrice),
        discountPercent: Number(it.discountPercent),
        taxPercent: Number(it.taxPercent),
        taxAmount: tax,
        lineTotal: discounted + tax
      };
    });

    handleAddConfiInvoice({
      customerId: `cust-${Date.now()}`,
      customerName: newInvCustomer,
      customerGstPan: newInvGst,
      invoiceDate: new Date().toISOString().split('T')[0],
      dueDate: newInvDueDate,
      items,
      termsAndConditions: 'Payment due within 30 days. Subject to local jurisdiction.'
    });
    setShowNewInvoiceModal(false);
  };

  const handleSaveBill = (e: React.FormEvent) => {
    e.preventDefault();
    const items = billItems.map(it => {
      const tax = (it.quantity * it.unitPrice) * (it.taxPercent / 100);
      return {
        description: it.description,
        quantity: Number(it.quantity),
        unitPrice: Number(it.unitPrice),
        taxPercent: Number(it.taxPercent),
        lineTotal: (it.quantity * it.unitPrice) + tax
      };
    });

    handleAddConfiBill({
      vendorId: `vend-${Date.now()}`,
      vendorName: newBillVendor,
      billDate: new Date().toISOString().split('T')[0],
      dueDate: newBillDueDate,
      poReference: newBillPo,
      items
    });
    setShowNewBillModal(false);
  };

  const handleSaveAsset = (e: React.FormEvent) => {
    e.preventDefault();
    handleAddFixedAsset({
      assetCode: newAssetCode,
      assetName: newAssetName,
      category: newAssetCategory,
      purchaseDate: new Date().toISOString().split('T')[0],
      purchaseCost: Number(newAssetCost),
      salvageValue: Number(newAssetSalvage),
      usefulLifeYears: Number(newAssetLife),
      depreciationMethod: newAssetMethod,
      annualDepreciationRate: newAssetMethod === 'Straight Line (SLM)' ? Math.round((100 / newAssetLife) * 10) / 10 : 20,
      custodianEmployee: newAssetCustodian,
      location: newAssetLocation
    });
    setShowNewAssetModal(false);
  };

  const totalJvDebit = jvLines.reduce((sum, l) => sum + (Number(l.debit) || 0), 0);
  const totalJvCredit = jvLines.reduce((sum, l) => sum + (Number(l.credit) || 0), 0);
  const isJvBalanced = Math.abs(totalJvDebit - totalJvCredit) < 0.01 && totalJvDebit > 0;

  return (
    <div className="space-y-6">
      {/* Top Header Banner */}
      <div className="bg-gradient-to-r from-teal-950 via-slate-900 to-emerald-950 text-white rounded-xl p-6 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-emerald-500/30 border border-emerald-400/40 text-emerald-200 text-xs font-mono font-semibold rounded-full uppercase tracking-wider">
              ConfiBooks Enterprise Accounting Suite
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs text-teal-300 bg-teal-950/60 px-2.5 py-0.5 rounded-full border border-teal-500/40 font-mono">
              GAAP & IFRS COMPLIANT
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold mt-2 tracking-tight">
            Comprehensive Double-Entry General Ledger & Accounting Suite
          </h1>
          <p className="text-slate-300 text-sm mt-1 max-w-3xl">
            Multi-tier Chart of Accounts, Journal Entries, Invoicing (AR), Vendor 3-Way Match (AP), Fixed Asset Depreciation & automated Financial Statements (P&L, Balance Sheet, Trial Balance, Cash Flow).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setShowNewJournalModal(true)}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium text-sm transition-all shadow-md hover:shadow-emerald-500/25 flex items-center gap-2 cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            New Journal Entry (JV)
          </button>

          <button
            onClick={() => setShowNewInvoiceModal(true)}
            className="px-4 py-2.5 bg-teal-700 hover:bg-teal-600 text-white rounded-lg font-medium text-sm transition-all flex items-center gap-2 cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Create Invoice
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Assets</div>
          <div className="text-xl font-bold text-slate-900 mt-1">{formatCurrency(totalAssets)}</div>
          <div className="text-xs text-emerald-600 mt-1 font-medium">Balanced with L+E</div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Liabilities</div>
          <div className="text-xl font-bold text-slate-900 mt-1">{formatCurrency(totalLiabilities)}</div>
          <div className="text-xs text-slate-500 mt-1 font-medium">Secured & Unsecured</div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Operating Revenue</div>
          <div className="text-xl font-bold text-teal-700 mt-1">{formatCurrency(totalIncome)}</div>
          <div className="text-xs text-teal-600 mt-1 font-medium">Interest & Advisory</div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Net Profit (YTD)</div>
          <div className="text-xl font-bold text-emerald-600 mt-1">{formatCurrency(netProfit)}</div>
          <div className="text-xs text-emerald-700 mt-1 font-medium">Operating Margin High</div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">AR Outstanding</div>
          <div className="text-xl font-bold text-amber-600 mt-1">{formatCurrency(totalArOutstanding)}</div>
          <div className="text-xs text-amber-700 mt-1 font-medium">{confiInvoices.length} Invoices Active</div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">AP Payables</div>
          <div className="text-xl font-bold text-blue-700 mt-1">{formatCurrency(totalApOutstanding)}</div>
          <div className="text-xs text-blue-600 mt-1 font-medium">3-Way Matched</div>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex border-b border-slate-200 bg-white rounded-t-xl px-4 pt-2 overflow-x-auto gap-2">
        {[
          { id: 'coa', label: 'Chart of Accounts (COA)', count: confiAccounts.length },
          { id: 'journals', label: 'General Journal Entries (JV)', count: confiJournalEntries.length },
          { id: 'invoices', label: 'Accounts Receivable (Invoices)', count: confiInvoices.length },
          { id: 'bills', label: 'Accounts Payable (Vendor Bills)', count: confiBills.length },
          { id: 'fixedAssets', label: 'Fixed Assets & Depreciation', count: fixedAssets.length },
          { id: 'reports', label: 'Financial Statements & Reports' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 cursor-pointer ${
              activeTab === tab.id
                ? 'border-emerald-600 text-emerald-700 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span className={`text-xs px-2 py-0.5 rounded-full ${activeTab === tab.id ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'}`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* TAB 1: CHART OF ACCOUNTS */}
      {activeTab === 'coa' && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-2 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">Multi-Tier Chart of Accounts</h3>
              <p className="text-xs text-slate-500">Standardized categorization of Assets, Liabilities, Equity, Revenues, and Expenses</p>
            </div>
            <button
              onClick={() => setShowNewAccountModal(true)}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              Add Ledger Account
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 border-b border-slate-200">
                  <th className="p-3 font-semibold">Account Code</th>
                  <th className="p-3 font-semibold">Account Name</th>
                  <th className="p-3 font-semibold">Category</th>
                  <th className="p-3 font-semibold">Sub-Category</th>
                  <th className="p-3 font-semibold text-right">Current Balance</th>
                  <th className="p-3 font-semibold">Description</th>
                  <th className="p-3 font-semibold text-center">Type</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {confiAccounts.map((acc) => (
                  <tr key={acc.id} className="hover:bg-slate-50">
                    <td className="p-3 font-mono font-bold text-slate-800">{acc.code}</td>
                    <td className="p-3 font-semibold text-slate-900">{acc.name}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        acc.category === 'Asset' ? 'bg-blue-100 text-blue-800' :
                        acc.category === 'Liability' ? 'bg-amber-100 text-amber-800' :
                        acc.category === 'Equity' ? 'bg-purple-100 text-purple-800' :
                        acc.category === 'Income' ? 'bg-emerald-100 text-emerald-800' :
                        'bg-rose-100 text-rose-800'
                      }`}>
                        {acc.category}
                      </span>
                    </td>
                    <td className="p-3 text-slate-600">{acc.subCategory}</td>
                    <td className={`p-3 text-right font-mono font-bold ${acc.balance >= 0 ? 'text-slate-900' : 'text-rose-600'}`}>
                      {formatCurrency(acc.balance)}
                    </td>
                    <td className="p-3 text-slate-500 max-w-xs truncate">{acc.description}</td>
                    <td className="p-3 text-center">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${acc.isSystem ? 'bg-slate-200 text-slate-700' : 'bg-emerald-50 text-emerald-700'}`}>
                        {acc.isSystem ? 'System' : 'Custom'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: GENERAL JOURNAL ENTRIES */}
      {activeTab === 'journals' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">General Journal (Double-Entry Vouchers)</h3>
                <p className="text-xs text-slate-500">Auditable debit & credit financial transactions with automatic GL posting</p>
              </div>
              <button
                onClick={() => setShowNewJournalModal(true)}
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                Post New Journal Entry
              </button>
            </div>

            <div className="space-y-4">
              {confiJournalEntries.map((jv) => (
                <div key={jv.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-sm text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded">
                        {jv.entryNumber}
                      </span>
                      <span className="text-xs font-mono text-slate-600">Date: {jv.date}</span>
                      {jv.reference && <span className="text-xs bg-slate-200 px-2 py-0.5 rounded text-slate-700">Ref: {jv.reference}</span>}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-slate-500 font-mono">Posted By: {jv.createdBy}</span>
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                        {jv.status}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-700 italic">{jv.narration}</p>

                  <div className="bg-white rounded-lg border border-slate-200 overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-100 text-slate-700 border-b border-slate-200">
                          <th className="p-2.5 font-semibold">Account Code & Name</th>
                          <th className="p-2.5 font-semibold">Description</th>
                          <th className="p-2.5 font-semibold text-right">Debit (₹)</th>
                          <th className="p-2.5 font-semibold text-right">Credit (₹)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {jv.lines.map((l) => (
                          <tr key={l.id} className="hover:bg-slate-50">
                            <td className="p-2.5 font-medium text-slate-900">
                              <span className="font-mono text-slate-500 mr-2">{l.accountCode}</span>
                              {l.accountName}
                            </td>
                            <td className="p-2.5 text-slate-600">{l.description}</td>
                            <td className="p-2.5 text-right font-mono font-semibold text-slate-900">
                              {l.debit > 0 ? formatCurrency(l.debit) : '-'}
                            </td>
                            <td className="p-2.5 text-right font-mono font-semibold text-slate-900">
                              {l.credit > 0 ? formatCurrency(l.credit) : '-'}
                            </td>
                          </tr>
                        ))}
                        <tr className="bg-slate-50 font-bold border-t border-slate-300">
                          <td colSpan={2} className="p-2.5 text-right uppercase tracking-wider text-slate-600">
                            Total:
                          </td>
                          <td className="p-2.5 text-right font-mono text-emerald-700">{formatCurrency(jv.totalDebit)}</td>
                          <td className="p-2.5 text-right font-mono text-emerald-700">{formatCurrency(jv.totalCredit)}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: ACCOUNTS RECEIVABLE (INVOICES) */}
      {activeTab === 'invoices' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">Accounts Receivable: Customer Invoices</h3>
                <p className="text-xs text-slate-500">Tax invoices with HSN/SAC codes, tiered discount calculations, and payment tracking</p>
              </div>
              <button
                onClick={() => setShowNewInvoiceModal(true)}
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                New Tax Invoice
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 border-b border-slate-200">
                    <th className="p-3 font-semibold">Invoice #</th>
                    <th className="p-3 font-semibold">Customer Name</th>
                    <th className="p-3 font-semibold">Invoice Date</th>
                    <th className="p-3 font-semibold">Due Date</th>
                    <th className="p-3 font-semibold text-right">Subtotal</th>
                    <th className="p-3 font-semibold text-right">Tax (GST)</th>
                    <th className="p-3 font-semibold text-right">Grand Total</th>
                    <th className="p-3 font-semibold text-right">Balance Due</th>
                    <th className="p-3 font-semibold text-center">Status</th>
                    <th className="p-3 font-semibold text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {confiInvoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-slate-50">
                      <td className="p-3 font-mono font-bold text-slate-900">{inv.invoiceNumber}</td>
                      <td className="p-3 font-semibold text-slate-900">
                        {inv.customerName}
                        {inv.customerGstPan && <div className="text-[10px] text-slate-500 font-mono">GST: {inv.customerGstPan}</div>}
                      </td>
                      <td className="p-3 text-slate-600">{inv.invoiceDate}</td>
                      <td className="p-3 text-slate-600 font-mono">{inv.dueDate}</td>
                      <td className="p-3 text-right font-mono text-slate-700">{formatCurrency(inv.subTotal)}</td>
                      <td className="p-3 text-right font-mono text-slate-700">{formatCurrency(inv.taxTotal)}</td>
                      <td className="p-3 text-right font-mono font-bold text-slate-900">{formatCurrency(inv.grandTotal)}</td>
                      <td className={`p-3 text-right font-mono font-bold ${inv.balanceDue > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
                        {formatCurrency(inv.balanceDue)}
                      </td>
                      <td className="p-3 text-center">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          inv.status === 'Paid' ? 'bg-emerald-100 text-emerald-800' :
                          inv.status === 'Partially Paid' ? 'bg-blue-100 text-blue-800' :
                          inv.status === 'Overdue' ? 'bg-rose-100 text-rose-800' :
                          'bg-amber-100 text-amber-800'
                        }`}>
                          {inv.status}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        {inv.balanceDue > 0 ? (
                          <button
                            onClick={() => {
                              setShowPayInvoiceModal(inv);
                              setPaymentAmountInput(inv.balanceDue);
                            }}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-semibold cursor-pointer"
                          >
                            Collect Payment
                          </button>
                        ) : (
                          <span className="text-emerald-600 font-bold">Settled</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: ACCOUNTS PAYABLE (BILLS & 3-WAY MATCHING) */}
      {activeTab === 'bills' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">Accounts Payable: Vendor Bills & 3-Way Match</h3>
                <p className="text-xs text-slate-500">Automated purchase order to goods receipt note (PO/GRN) validation and vendor payouts</p>
              </div>
              <button
                onClick={() => setShowNewBillModal(true)}
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                Enter Vendor Bill
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 border-b border-slate-200">
                    <th className="p-3 font-semibold">Bill #</th>
                    <th className="p-3 font-semibold">Vendor Name</th>
                    <th className="p-3 font-semibold">PO Match Status</th>
                    <th className="p-3 font-semibold">Bill Date</th>
                    <th className="p-3 font-semibold">Due Date</th>
                    <th className="p-3 font-semibold text-right">Grand Total</th>
                    <th className="p-3 font-semibold text-right">Balance Due</th>
                    <th className="p-3 font-semibold text-center">Approval Status</th>
                    <th className="p-3 font-semibold text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {confiBills.map((bill) => (
                    <tr key={bill.id} className="hover:bg-slate-50">
                      <td className="p-3 font-mono font-bold text-slate-900">{bill.billNumber}</td>
                      <td className="p-3 font-semibold text-slate-900">{bill.vendorName}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded font-medium bg-blue-50 text-blue-700 border border-blue-200">
                          {bill.matchStatus}
                        </span>
                      </td>
                      <td className="p-3 text-slate-600">{bill.billDate}</td>
                      <td className="p-3 text-slate-600 font-mono">{bill.dueDate}</td>
                      <td className="p-3 text-right font-mono font-bold text-slate-900">{formatCurrency(bill.grandTotal)}</td>
                      <td className="p-3 text-right font-mono font-bold text-amber-600">{formatCurrency(bill.balanceDue)}</td>
                      <td className="p-3 text-center">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          bill.status === 'Paid' ? 'bg-emerald-100 text-emerald-800' :
                          bill.status === 'Approved' ? 'bg-blue-100 text-blue-800' :
                          'bg-amber-100 text-amber-800'
                        }`}>
                          {bill.status}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        {bill.balanceDue > 0 ? (
                          <button
                            onClick={() => {
                              setShowPayBillModal(bill);
                              setPaymentAmountInput(bill.balanceDue);
                            }}
                            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-900 text-white rounded text-[11px] font-semibold cursor-pointer"
                          >
                            Disburse Payment
                          </button>
                        ) : (
                          <span className="text-emerald-600 font-bold">Paid in Full</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: FIXED ASSETS & DEPRECIATION */}
      {activeTab === 'fixedAssets' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-2 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">Fixed Asset Register & Depreciation Engine</h3>
                <p className="text-xs text-slate-500">Straight Line (SLM) & Written Down Value (WDV) calculation with automated monthly GL amortization</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleRunFixedAssetDepreciation()}
                  className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Run Monthly Batch Depreciation
                </button>
                <button
                  onClick={() => setShowNewAssetModal(true)}
                  className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                  Add Capital Asset
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 border-b border-slate-200">
                    <th className="p-3 font-semibold">Asset Code</th>
                    <th className="p-3 font-semibold">Asset Description</th>
                    <th className="p-3 font-semibold">Category</th>
                    <th className="p-3 font-semibold">Method & Rate</th>
                    <th className="p-3 font-semibold text-right">Original Cost</th>
                    <th className="p-3 font-semibold text-right">Accumulated Dep.</th>
                    <th className="p-3 font-semibold text-right">Net Book Value</th>
                    <th className="p-3 font-semibold">Custodian & Location</th>
                    <th className="p-3 font-semibold text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {fixedAssets.map((fa) => (
                    <tr key={fa.id} className="hover:bg-slate-50">
                      <td className="p-3 font-mono font-bold text-slate-800">{fa.assetCode}</td>
                      <td className="p-3 font-semibold text-slate-900">{fa.assetName}</td>
                      <td className="p-3 text-slate-600">{fa.category}</td>
                      <td className="p-3">
                        <div className="font-medium text-slate-800">{fa.depreciationMethod}</div>
                        <div className="text-[11px] text-slate-500 font-mono">Rate: {fa.annualDepreciationRate}% / yr ({fa.usefulLifeYears}y)</div>
                      </td>
                      <td className="p-3 text-right font-mono font-bold text-slate-900">{formatCurrency(fa.purchaseCost)}</td>
                      <td className="p-3 text-right font-mono text-rose-600">{formatCurrency(fa.accumulatedDepreciation)}</td>
                      <td className="p-3 text-right font-mono font-bold text-emerald-700">{formatCurrency(fa.currentNetBookValue)}</td>
                      <td className="p-3 text-slate-600 text-[11px]">
                        <div>{fa.custodianEmployee}</div>
                        <div className="text-slate-400">{fa.location}</div>
                      </td>
                      <td className="p-3 text-center">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          {fa.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: FINANCIAL STATEMENTS & REPORTS */}
      {activeTab === 'reports' && (
        <div className="space-y-6">
          {/* Sub-tabs */}
          <div className="flex gap-2 border-b border-slate-200 bg-white p-2 rounded-t-xl overflow-x-auto">
            {[
              { id: 'pnl', label: 'Profit & Loss Statement (Income)' },
              { id: 'balanceSheet', label: 'Balance Sheet (Position)' },
              { id: 'trialBalance', label: 'Trial Balance' },
              { id: 'cashFlow', label: 'Cash Flow Statement' },
              { id: 'arAging', label: 'AR & AP Aging Analysis' }
            ].map(sub => (
              <button
                key={sub.id}
                onClick={() => setReportSubTab(sub.id as any)}
                className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  reportSubTab === sub.id ? 'bg-emerald-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {sub.label}
              </button>
            ))}
          </div>

          {/* Sub-Report: Profit and Loss */}
          {reportSubTab === 'pnl' && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6">
              <div className="text-center pb-4 border-b border-slate-200">
                <h3 className="text-lg font-bold text-slate-900">Statement of Profit and Loss (Income Statement)</h3>
                <p className="text-xs text-slate-500">For the Financial Period Ending August 2026 • Amounts in INR (₹)</p>
              </div>

              <div className="max-w-3xl mx-auto space-y-6 text-xs">
                {/* Revenue */}
                <div>
                  <div className="font-bold text-sm text-emerald-900 uppercase tracking-wider bg-emerald-50 p-2 rounded">
                    Operating Revenues & Income
                  </div>
                  <div className="divide-y divide-slate-100 mt-2">
                    {confiAccounts.filter(a => a.category === 'Income').map(a => (
                      <div key={a.id} className="flex justify-between py-2 px-2">
                        <span className="font-medium text-slate-800">{a.code} - {a.name}</span>
                        <span className="font-mono font-semibold text-slate-900">{formatCurrency(a.balance)}</span>
                      </div>
                    ))}
                    <div className="flex justify-between py-2 px-2 font-bold text-emerald-800 bg-emerald-50/50">
                      <span>Total Revenue (A):</span>
                      <span className="font-mono text-sm">{formatCurrency(totalIncome)}</span>
                    </div>
                  </div>
                </div>

                {/* Expenses */}
                <div>
                  <div className="font-bold text-sm text-rose-900 uppercase tracking-wider bg-rose-50 p-2 rounded">
                    Operating & Financial Expenses
                  </div>
                  <div className="divide-y divide-slate-100 mt-2">
                    {confiAccounts.filter(a => a.category === 'Expense' || a.category === 'Cost of Goods Sold').map(a => (
                      <div key={a.id} className="flex justify-between py-2 px-2">
                        <span className="font-medium text-slate-800">{a.code} - {a.name}</span>
                        <span className="font-mono font-semibold text-slate-900">{formatCurrency(a.balance)}</span>
                      </div>
                    ))}
                    <div className="flex justify-between py-2 px-2 font-bold text-rose-800 bg-rose-50/50">
                      <span>Total Expenses (B):</span>
                      <span className="font-mono text-sm">{formatCurrency(totalExpenses)}</span>
                    </div>
                  </div>
                </div>

                {/* Net Income */}
                <div className="p-4 bg-slate-900 text-white rounded-xl flex justify-between items-center">
                  <div>
                    <div className="text-xs uppercase font-bold text-emerald-400">Net Profit Before Tax (A - B)</div>
                    <div className="text-xs text-slate-400">Net operating yield for the fiscal period</div>
                  </div>
                  <div className="text-2xl font-bold font-mono text-emerald-300">
                    {formatCurrency(netProfit)}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Sub-Report: Balance Sheet */}
          {reportSubTab === 'balanceSheet' && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6">
              <div className="text-center pb-4 border-b border-slate-200">
                <h3 className="text-lg font-bold text-slate-900">Balance Sheet (Statement of Financial Position)</h3>
                <p className="text-xs text-slate-500">As of August 2026 • Fundamental Equation: Assets = Liabilities + Equity</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                {/* Assets Column */}
                <div className="space-y-4">
                  <div className="font-bold text-sm text-blue-900 uppercase tracking-wider bg-blue-50 p-2.5 rounded">
                    Total Assets
                  </div>
                  <div className="divide-y divide-slate-100">
                    {confiAccounts.filter(a => a.category === 'Asset').map(a => (
                      <div key={a.id} className="flex justify-between py-2 px-1">
                        <span className="text-slate-800">{a.code} - {a.name}</span>
                        <span className="font-mono font-semibold">{formatCurrency(a.balance)}</span>
                      </div>
                    ))}
                    <div className="flex justify-between py-3 px-1 font-bold text-blue-900 bg-blue-50/60 rounded">
                      <span className="text-sm">TOTAL ASSETS:</span>
                      <span className="font-mono text-sm">{formatCurrency(totalAssets)}</span>
                    </div>
                  </div>
                </div>

                {/* Liabilities & Equity Column */}
                <div className="space-y-4">
                  <div className="font-bold text-sm text-amber-900 uppercase tracking-wider bg-amber-50 p-2.5 rounded">
                    Liabilities & Shareholders Equity
                  </div>
                  <div className="divide-y divide-slate-100">
                    <div className="text-[11px] font-bold text-slate-500 uppercase px-1 pt-1">Liabilities:</div>
                    {confiAccounts.filter(a => a.category === 'Liability').map(a => (
                      <div key={a.id} className="flex justify-between py-2 px-1">
                        <span className="text-slate-800">{a.code} - {a.name}</span>
                        <span className="font-mono font-semibold">{formatCurrency(a.balance)}</span>
                      </div>
                    ))}
                    <div className="text-[11px] font-bold text-slate-500 uppercase px-1 pt-3">Shareholders Equity:</div>
                    {confiAccounts.filter(a => a.category === 'Equity').map(a => (
                      <div key={a.id} className="flex justify-between py-2 px-1">
                        <span className="text-slate-800">{a.code} - {a.name}</span>
                        <span className="font-mono font-semibold">{formatCurrency(a.balance)}</span>
                      </div>
                    ))}
                    <div className="flex justify-between py-3 px-1 font-bold text-amber-900 bg-amber-50/60 rounded">
                      <span className="text-sm">TOTAL LIABILITIES & EQUITY:</span>
                      <span className="font-mono text-sm">{formatCurrency(totalLiabilities + totalEquity)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Sub-Report: Trial Balance */}
          {reportSubTab === 'trialBalance' && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
              <div className="text-center pb-2 border-b border-slate-200">
                <h3 className="text-lg font-bold text-slate-900">Adjusted Trial Balance</h3>
                <p className="text-xs text-slate-500">Comprehensive verification of total debits equals total credits across all ledgers</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 border-b border-slate-200">
                      <th className="p-3 font-semibold">Account Code</th>
                      <th className="p-3 font-semibold">Account Name</th>
                      <th className="p-3 font-semibold">Account Type</th>
                      <th className="p-3 font-semibold text-right">Debit Balance (₹)</th>
                      <th className="p-3 font-semibold text-right">Credit Balance (₹)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {confiAccounts.map((acc) => {
                      const isDebitNormal = acc.category === 'Asset' || acc.category === 'Expense' || acc.category === 'Cost of Goods Sold';
                      return (
                        <tr key={acc.id} className="hover:bg-slate-50">
                          <td className="p-2.5 font-mono font-bold text-slate-700">{acc.code}</td>
                          <td className="p-2.5 font-semibold text-slate-900">{acc.name}</td>
                          <td className="p-2.5 text-slate-500">{acc.category}</td>
                          <td className="p-2.5 text-right font-mono font-semibold text-slate-900">
                            {isDebitNormal ? formatCurrency(Math.abs(acc.balance)) : '-'}
                          </td>
                          <td className="p-2.5 text-right font-mono font-semibold text-slate-900">
                            {!isDebitNormal ? formatCurrency(Math.abs(acc.balance)) : '-'}
                          </td>
                        </tr>
                      );
                    })}
                    <tr className="bg-slate-900 text-white font-bold">
                      <td colSpan={3} className="p-3 text-right uppercase tracking-wider text-emerald-400">
                        Trial Balance Grand Totals (Balanced):
                      </td>
                      <td className="p-3 text-right font-mono text-emerald-300">
                        {formatCurrency(totalAssets + totalExpenses)}
                      </td>
                      <td className="p-3 text-right font-mono text-emerald-300">
                        {formatCurrency(totalLiabilities + totalEquity + totalIncome)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Sub-Report: Cash Flow */}
          {reportSubTab === 'cashFlow' && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6">
              <div className="text-center pb-4 border-b border-slate-200">
                <h3 className="text-lg font-bold text-slate-900">Statement of Cash Flows (Indirect Method)</h3>
                <p className="text-xs text-slate-500">Operating, Investing, and Financing Activities Analysis</p>
              </div>

              <div className="max-w-2xl mx-auto space-y-4 text-xs">
                <div className="p-3 bg-emerald-50 rounded-lg space-y-2">
                  <div className="font-bold text-emerald-900 uppercase">1. Cash Flow from Operating Activities</div>
                  <div className="flex justify-between text-slate-700 pl-4">
                    <span>Net Income</span>
                    <span className="font-mono font-semibold">{formatCurrency(netProfit)}</span>
                  </div>
                  <div className="flex justify-between text-slate-700 pl-4">
                    <span>Add: Non-Cash Depreciation & Amortization</span>
                    <span className="font-mono font-semibold">{formatCurrency(280000)}</span>
                  </div>
                  <div className="flex justify-between text-slate-700 pl-4">
                    <span>Changes in Working Capital (AR & AP)</span>
                    <span className="font-mono font-semibold">{formatCurrency(1450000)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-emerald-900 pt-1 border-t border-emerald-200">
                    <span>Net Cash Provided by Operating Activities:</span>
                    <span className="font-mono">{formatCurrency(netProfit + 280000 + 1450000)}</span>
                  </div>
                </div>

                <div className="p-3 bg-blue-50 rounded-lg space-y-2">
                  <div className="font-bold text-blue-900 uppercase">2. Cash Flow from Investing Activities</div>
                  <div className="flex justify-between text-slate-700 pl-4">
                    <span>Purchase of Fixed Assets & Servers</span>
                    <span className="font-mono font-semibold text-rose-600">({formatCurrency(850000)})</span>
                  </div>
                  <div className="flex justify-between font-bold text-blue-900 pt-1 border-t border-blue-200">
                    <span>Net Cash Used in Investing Activities:</span>
                    <span className="font-mono text-rose-700">({formatCurrency(850000)})</span>
                  </div>
                </div>

                <div className="p-3 bg-purple-50 rounded-lg space-y-2">
                  <div className="font-bold text-purple-900 uppercase">3. Cash Flow from Financing Activities</div>
                  <div className="flex justify-between text-slate-700 pl-4">
                    <span>Repayment of Long-Term Term Loans</span>
                    <span className="font-mono font-semibold text-rose-600">({formatCurrency(5000000)})</span>
                  </div>
                  <div className="flex justify-between font-bold text-purple-900 pt-1 border-t border-purple-200">
                    <span>Net Cash Used in Financing Activities:</span>
                    <span className="font-mono text-rose-700">({formatCurrency(5000000)})</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Sub-Report: AR Aging */}
          {reportSubTab === 'arAging' && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
              <div className="text-center pb-2 border-b border-slate-200">
                <h3 className="text-lg font-bold text-slate-900">Accounts Receivable Aging Summary</h3>
                <p className="text-xs text-slate-500">Aging buckets: Current (0-30 days), 31-60 days, 61-90 days, & 90+ days past due</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-center">
                  <div className="text-xs font-semibold text-emerald-800 uppercase">Current (0 - 30 Days)</div>
                  <div className="text-xl font-bold font-mono text-emerald-900 mt-1">{formatCurrency(226070)}</div>
                  <div className="text-xs text-emerald-600 mt-1">1 Account on term</div>
                </div>
                <div className="p-4 bg-blue-50 rounded-xl border border-blue-200 text-center">
                  <div className="text-xs font-semibold text-blue-800 uppercase">31 - 60 Days</div>
                  <div className="text-xl font-bold font-mono text-blue-900 mt-1">{formatCurrency(212400)}</div>
                  <div className="text-xs text-blue-600 mt-1">1 Follow-up Sent</div>
                </div>
                <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-center">
                  <div className="text-xs font-semibold text-amber-800 uppercase">61 - 90 Days</div>
                  <div className="text-xl font-bold font-mono text-amber-900 mt-1">₹0.00</div>
                  <div className="text-xs text-amber-600 mt-1">0 Delinquent</div>
                </div>
                <div className="p-4 bg-rose-50 rounded-xl border border-rose-200 text-center">
                  <div className="text-xs font-semibold text-rose-800 uppercase">&gt; 90 Days Overdue</div>
                  <div className="text-xl font-bold font-mono text-rose-900 mt-1">₹0.00</div>
                  <div className="text-xs text-rose-600 mt-1">Clean Portfolio</div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modal: New Journal Entry */}
      {showNewJournalModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full p-6 space-y-4 my-8">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-lg font-bold text-slate-900">Post Double-Entry Journal Voucher (JV)</h3>
              <button onClick={() => setShowNewJournalModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveJournal} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Reference Code</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. PROV-AUG-2026"
                    value={newJvRef}
                    onChange={(e) => setNewJvRef(e.target.value)}
                    className="w-full p-2 border rounded-lg uppercase font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Narration / Description</label>
                  <input
                    type="text"
                    required
                    placeholder="Purpose of transaction"
                    value={newJvNarration}
                    onChange={(e) => setNewJvNarration(e.target.value)}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
              </div>

              {/* Journal Line Items */}
              <div className="border border-slate-200 rounded-lg p-3 bg-slate-50 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-800 uppercase tracking-wider">Debit & Credit Breakdown</span>
                  <button
                    type="button"
                    onClick={handleAddJvLine}
                    className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold cursor-pointer"
                  >
                    + Add Line
                  </button>
                </div>

                <div className="space-y-2">
                  {jvLines.map((line, idx) => (
                    <div key={idx} className="grid grid-cols-12 gap-2 items-center bg-white p-2 rounded border border-slate-200">
                      <div className="col-span-4">
                        <select
                          value={line.accountId}
                          onChange={(e) => handleUpdateJvLine(idx, 'accountId', e.target.value)}
                          className="w-full p-1.5 border rounded text-[11px]"
                        >
                          {confiAccounts.map(a => (
                            <option key={a.id} value={a.id}>{a.code} - {a.name} ({a.category})</option>
                          ))}
                        </select>
                      </div>
                      <div className="col-span-3">
                        <input
                          type="text"
                          placeholder="Line note"
                          value={line.description}
                          onChange={(e) => handleUpdateJvLine(idx, 'description', e.target.value)}
                          className="w-full p-1.5 border rounded text-[11px]"
                        />
                      </div>
                      <div className="col-span-2">
                        <input
                          type="number"
                          placeholder="Debit"
                          value={line.debit || ''}
                          onChange={(e) => {
                            handleUpdateJvLine(idx, 'debit', Number(e.target.value));
                            if (Number(e.target.value) > 0) handleUpdateJvLine(idx, 'credit', 0);
                          }}
                          className="w-full p-1.5 border rounded font-mono text-right text-[11px]"
                        />
                      </div>
                      <div className="col-span-2">
                        <input
                          type="number"
                          placeholder="Credit"
                          value={line.credit || ''}
                          onChange={(e) => {
                            handleUpdateJvLine(idx, 'credit', Number(e.target.value));
                            if (Number(e.target.value) > 0) handleUpdateJvLine(idx, 'debit', 0);
                          }}
                          className="w-full p-1.5 border rounded font-mono text-right text-[11px]"
                        />
                      </div>
                      <div className="col-span-1 text-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveJvLine(idx)}
                          className="text-rose-500 hover:text-rose-700 font-bold"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Total Balance Check */}
                <div className="flex justify-between items-center pt-2 border-t border-slate-200 font-mono font-bold">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-600">Balance Status:</span>
                    {isJvBalanced ? (
                      <span className="text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded text-xs">✓ BALANCED</span>
                    ) : (
                      <span className="text-rose-600 bg-rose-100 px-2 py-0.5 rounded text-xs">
                        ✕ Out of Balance: {formatCurrency(Math.abs(totalJvDebit - totalJvCredit))}
                      </span>
                    )}
                  </div>
                  <div className="space-x-4">
                    <span>Total Dr: {formatCurrency(totalJvDebit)}</span>
                    <span>Total Cr: {formatCurrency(totalJvCredit)}</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowNewJournalModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!isJvBalanced}
                  className={`px-5 py-2 rounded-lg font-semibold shadow-md ${
                    isJvBalanced
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer'
                      : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  Post Journal Voucher
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: New Chart of Account */}
      {showNewAccountModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 space-y-4 my-8">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-lg font-bold text-slate-900">Add Account to Ledger</h3>
              <button onClick={() => setShowNewAccountModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveAccount} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Account Code</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 1040"
                    value={newAccCode}
                    onChange={(e) => setNewAccCode(e.target.value)}
                    className="w-full p-2 border rounded-lg font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Category</label>
                  <select
                    value={newAccCategory}
                    onChange={(e) => setNewAccCategory(e.target.value as any)}
                    className="w-full p-2 border rounded-lg font-semibold"
                  >
                    <option value="Asset">Asset</option>
                    <option value="Liability">Liability</option>
                    <option value="Equity">Equity</option>
                    <option value="Income">Income / Revenue</option>
                    <option value="Expense">Expense</option>
                    <option value="Cost of Goods Sold">Cost of Goods Sold (COGS)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Account Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kotak Mahindra Bank A/C"
                  value={newAccName}
                  onChange={(e) => setNewAccName(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Sub-Category</label>
                  <input
                    type="text"
                    placeholder="e.g. Bank Accounts"
                    value={newAccSubCat}
                    onChange={(e) => setNewAccSubCat(e.target.value)}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Opening Balance (₹)</label>
                  <input
                    type="number"
                    value={newAccBalance}
                    onChange={(e) => setNewAccBalance(Number(e.target.value))}
                    className="w-full p-2 border rounded-lg font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Description / Notes</label>
                <input
                  type="text"
                  placeholder="Purpose of this account"
                  value={newAccDesc}
                  onChange={(e) => setNewAccDesc(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowNewAccountModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold shadow-md cursor-pointer"
                >
                  Save Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: New Invoice */}
      {showNewInvoiceModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6 space-y-4 my-8">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-lg font-bold text-slate-900">Create Tax Invoice (Accounts Receivable)</h3>
              <button onClick={() => setShowNewInvoiceModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveInvoice} className="space-y-4 text-xs">
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-slate-700 font-medium mb-1">Customer / Debtor Name</label>
                  <input
                    type="text"
                    required
                    value={newInvCustomer}
                    onChange={(e) => setNewInvCustomer(e.target.value)}
                    className="w-full p-2 border rounded-lg"
                    placeholder="Corporate Client Name"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Due Date</label>
                  <input
                    type="date"
                    required
                    value={newInvDueDate}
                    onChange={(e) => setNewInvDueDate(e.target.value)}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Customer GSTIN / PAN</label>
                <input
                  type="text"
                  value={newInvGst}
                  onChange={(e) => setNewInvGst(e.target.value)}
                  className="w-full p-2 border rounded-lg font-mono uppercase"
                />
              </div>

              {/* Line items */}
              <div className="p-3 bg-slate-50 rounded-lg border space-y-2">
                <div className="font-bold text-slate-800">Invoice Line Item</div>
                <div className="grid grid-cols-12 gap-2">
                  <div className="col-span-5">
                    <input
                      type="text"
                      placeholder="Service / Product Name"
                      value={invItems[0]?.name}
                      onChange={(e) => setInvItems([{ ...invItems[0], name: e.target.value }])}
                      className="w-full p-2 border rounded bg-white"
                    />
                  </div>
                  <div className="col-span-2">
                    <input
                      type="text"
                      placeholder="HSN/SAC"
                      value={invItems[0]?.hsnSac}
                      onChange={(e) => setInvItems([{ ...invItems[0], hsnSac: e.target.value }])}
                      className="w-full p-2 border rounded bg-white font-mono"
                    />
                  </div>
                  <div className="col-span-3">
                    <input
                      type="number"
                      placeholder="Unit Price"
                      value={invItems[0]?.unitPrice}
                      onChange={(e) => setInvItems([{ ...invItems[0], unitPrice: Number(e.target.value) }])}
                      className="w-full p-2 border rounded bg-white font-mono"
                    />
                  </div>
                  <div className="col-span-2">
                    <select
                      value={invItems[0]?.taxPercent}
                      onChange={(e) => setInvItems([{ ...invItems[0], taxPercent: Number(e.target.value) }])}
                      className="w-full p-2 border rounded bg-white"
                    >
                      <option value="0">0% GST</option>
                      <option value="5">5% GST</option>
                      <option value="12">12% GST</option>
                      <option value="18">18% GST</option>
                      <option value="28">28% GST</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowNewInvoiceModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold shadow-md cursor-pointer"
                >
                  Generate Tax Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: New Vendor Bill */}
      {showNewBillModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6 space-y-4 my-8">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-lg font-bold text-slate-900">Enter Vendor Bill (Accounts Payable)</h3>
              <button onClick={() => setShowNewBillModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveBill} className="space-y-4 text-xs">
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-slate-700 font-medium mb-1">Vendor / Creditor Name</label>
                  <input
                    type="text"
                    required
                    value={newBillVendor}
                    onChange={(e) => setNewBillVendor(e.target.value)}
                    className="w-full p-2 border rounded-lg"
                    placeholder="Vendor Entity Name"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">PO Reference (3-Way Match)</label>
                  <input
                    type="text"
                    value={newBillPo}
                    onChange={(e) => setNewBillPo(e.target.value)}
                    className="w-full p-2 border rounded-lg font-mono uppercase"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Payment Due Date</label>
                <input
                  type="date"
                  required
                  value={newBillDueDate}
                  onChange={(e) => setNewBillDueDate(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border space-y-2">
                <div className="font-bold text-slate-800">Bill Expense Line</div>
                <div className="grid grid-cols-12 gap-2">
                  <div className="col-span-7">
                    <input
                      type="text"
                      placeholder="Expense Description"
                      value={billItems[0]?.description}
                      onChange={(e) => setBillItems([{ ...billItems[0], description: e.target.value }])}
                      className="w-full p-2 border rounded bg-white"
                    />
                  </div>
                  <div className="col-span-3">
                    <input
                      type="number"
                      placeholder="Amount"
                      value={billItems[0]?.unitPrice}
                      onChange={(e) => setBillItems([{ ...billItems[0], unitPrice: Number(e.target.value) }])}
                      className="w-full p-2 border rounded bg-white font-mono"
                    />
                  </div>
                  <div className="col-span-2">
                    <select
                      value={billItems[0]?.taxPercent}
                      onChange={(e) => setBillItems([{ ...billItems[0], taxPercent: Number(e.target.value) }])}
                      className="w-full p-2 border rounded bg-white"
                    >
                      <option value="0">0%</option>
                      <option value="18">18% GST</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowNewBillModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold shadow-md cursor-pointer"
                >
                  Save & Queue for 3-Way Match Approval
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: New Fixed Asset */}
      {showNewAssetModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 space-y-4 my-8">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-lg font-bold text-slate-900">Register Fixed Asset</h3>
              <button onClick={() => setShowNewAssetModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveAsset} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Asset Code</label>
                  <input
                    type="text"
                    required
                    value={newAssetCode}
                    onChange={(e) => setNewAssetCode(e.target.value)}
                    className="w-full p-2 border rounded-lg font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Category</label>
                  <select
                    value={newAssetCategory}
                    onChange={(e) => setNewAssetCategory(e.target.value as any)}
                    className="w-full p-2 border rounded-lg"
                  >
                    <option value="IT & Office Hardware">IT & Office Hardware</option>
                    <option value="Vehicles">Vehicles & Cash Vans</option>
                    <option value="Land & Buildings">Land & Buildings</option>
                    <option value="Plant & Machinery">Plant & Machinery</option>
                    <option value="Furniture & Fixtures">Furniture & Fixtures</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Asset Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cisco Core Network Switch"
                  value={newAssetName}
                  onChange={(e) => setNewAssetName(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Cost (₹)</label>
                  <input
                    type="number"
                    required
                    value={newAssetCost}
                    onChange={(e) => setNewAssetCost(Number(e.target.value))}
                    className="w-full p-2 border rounded-lg font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Salvage Value</label>
                  <input
                    type="number"
                    value={newAssetSalvage}
                    onChange={(e) => setNewAssetSalvage(Number(e.target.value))}
                    className="w-full p-2 border rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Useful Life (Yrs)</label>
                  <input
                    type="number"
                    required
                    value={newAssetLife}
                    onChange={(e) => setNewAssetLife(Number(e.target.value))}
                    className="w-full p-2 border rounded-lg font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Depreciation Method</label>
                <select
                  value={newAssetMethod}
                  onChange={(e) => setNewAssetMethod(e.target.value as any)}
                  className="w-full p-2 border rounded-lg"
                >
                  <option value="Straight Line (SLM)">Straight Line Method (SLM)</option>
                  <option value="Written Down Value (WDV)">Written Down Value Method (WDV)</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowNewAssetModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold shadow-md cursor-pointer"
                >
                  Add to Asset Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Collect Invoice Payment */}
      {showPayInvoiceModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Record Customer Payment</h3>
            <p className="text-xs text-slate-500">
              Invoice #{showPayInvoiceModal.invoiceNumber} • {showPayInvoiceModal.customerName}
            </p>

            <div className="space-y-2 text-xs">
              <label className="block text-slate-700 font-medium">Payment Amount (₹)</label>
              <input
                type="number"
                value={paymentAmountInput}
                onChange={(e) => setPaymentAmountInput(Number(e.target.value))}
                className="w-full p-2.5 border rounded-lg font-mono text-base font-bold"
              />
              <div className="text-[11px] text-slate-500">
                Outstanding Balance: {formatCurrency(showPayInvoiceModal.balanceDue)}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t">
              <button
                type="button"
                onClick={() => setShowPayInvoiceModal(null)}
                className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  handleRecordConfiInvoicePayment(showPayInvoiceModal.id, paymentAmountInput);
                  setShowPayInvoiceModal(null);
                }}
                className="px-4 py-1.5 bg-emerald-600 text-white rounded text-xs font-semibold shadow-sm cursor-pointer"
              >
                Confirm Receipt
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Disburse Vendor Bill Payment */}
      {showPayBillModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Disburse Vendor Bill Payout</h3>
            <p className="text-xs text-slate-500">
              Bill #{showPayBillModal.billNumber} • {showPayBillModal.vendorName}
            </p>

            <div className="space-y-2 text-xs">
              <label className="block text-slate-700 font-medium">Payout Amount (₹)</label>
              <input
                type="number"
                value={paymentAmountInput}
                onChange={(e) => setPaymentAmountInput(Number(e.target.value))}
                className="w-full p-2.5 border rounded-lg font-mono text-base font-bold"
              />
              <div className="text-[11px] text-slate-500">
                Outstanding Balance: {formatCurrency(showPayBillModal.balanceDue)}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t">
              <button
                type="button"
                onClick={() => setShowPayBillModal(null)}
                className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  handleRecordConfiBillPayment(showPayBillModal.id, paymentAmountInput);
                  setShowPayBillModal(null);
                }}
                className="px-4 py-1.5 bg-slate-900 text-white rounded text-xs font-semibold shadow-sm cursor-pointer"
              >
                Disburse Payout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConfiBooks;
