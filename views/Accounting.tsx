

import React, { useState, useMemo } from 'react';
import DataTable, { Column } from '../components/DataTable';
import type { Account, JournalLine, Voucher } from './types';
import { AccountType, VoucherType, VoucherStatus, UserRole } from './types';
import { formatCurrency } from '../utils/formatters';
import { useAppContext } from '../AppContext';
import StatusBadge from '../components/StatusBadge';
import { VoucherApprovalModal } from '../components/ActionModals';

// --- SUB-COMPONENTS ---
const ChartOfAccounts: React.FC = () => {
    const { accounts } = useAppContext();
    const columns: Column<Account>[] = [
        { header: 'Code', accessor: 'accountCode' },
        { header: 'Account Name', accessor: 'accountName' },
        { header: 'Account Type', accessor: 'accountType' },
        { header: 'Balance', accessor: 'balance', render: (row: Account) => formatCurrency(row.balance) },
    ];
    return <DataTable columns={columns} data={accounts} title="Chart of Accounts" />;
};

const VoucherEntry: React.FC<{
    setApprovingVoucher: (voucher: Voucher | null) => void;
}> = ({ setApprovingVoucher }) => {
    const { vouchers, accounts, handleAddVoucher, currentUser } = useAppContext();
    const [isCreating, setIsCreating] = useState(false);
    const [filter, setFilter] = useState<VoucherType | 'ALL'>('ALL');
    
    const [newVoucher, setNewVoucher] = useState<Omit<Voucher, 'id' | 'voucherNumber' | 'status' | 'createdBy' | 'approvedBy'>>({
        date: new Date().toISOString().split('T')[0],
        description: '',
        voucherType: VoucherType.JOURNAL,
        lines: [
            { accountId: '', accountName: '', debit: 0, credit: 0 },
            { accountId: '', accountName: '', debit: 0, credit: 0 },
        ]
    });

    const filteredVouchers = useMemo(() => {
        if (filter === 'ALL') return vouchers;
        return vouchers.filter(v => v.voucherType === filter);
    }, [vouchers, filter]);

    const { totalDebit, totalCredit } = useMemo(() => {
        return newVoucher.lines.reduce((acc, line) => {
            acc.totalDebit += line.debit;
            acc.totalCredit += line.credit;
            return acc;
        }, { totalDebit: 0, totalCredit: 0 });
    }, [newVoucher.lines]);

    const isBalanced = totalDebit === totalCredit && totalDebit > 0;

    const handleLineChange = (index: number, field: keyof JournalLine, value: string) => {
        const updatedLines = [...newVoucher.lines];
        if (field === 'accountId') {
            const selectedAccount = accounts.find(acc => acc.id === value);
            updatedLines[index].accountId = value;
            updatedLines[index].accountName = selectedAccount?.accountName || '';
        } else {
            (updatedLines[index] as any)[field] = parseFloat(value) || 0;
        }
        setNewVoucher(prev => ({ ...prev, lines: updatedLines }));
    };

    const addLine = () => {
        setNewVoucher(prev => ({ ...prev, lines: [...prev.lines, { accountId: '', accountName: '', debit: 0, credit: 0 }]}));
    };

    const removeLine = (index: number) => {
        setNewVoucher(prev => ({ ...prev, lines: prev.lines.filter((_, i) => i !== index)}));
    };

    const handleSubmit = () => {
        if (!isBalanced) {
            alert('Debit and Credit totals must match and be greater than zero.');
            return;
        }
        handleAddVoucher({
            ...newVoucher,
            status: VoucherStatus.PENDING_APPROVAL,
            createdBy: currentUser,
        });
        setIsCreating(false);
        // Reset form
        setNewVoucher({ date: new Date().toISOString().split('T')[0], description: '', voucherType: VoucherType.JOURNAL, lines: [ { accountId: '', accountName: '', debit: 0, credit: 0 }, { accountId: '', accountName: '', debit: 0, credit: 0 } ] });
    };

    const VoucherTypeBadge: React.FC<{type: VoucherType}> = ({type}) => {
        const colors: Record<VoucherType, string> = {
            [VoucherType.RECEIPT]: 'bg-green-100 text-green-800',
            [VoucherType.PAYMENT]: 'bg-red-100 text-red-800',
            [VoucherType.CONTRA]: 'bg-blue-100 text-blue-800',
            [VoucherType.JOURNAL]: 'bg-yellow-100 text-yellow-800',
            [VoucherType.SALES]: 'bg-purple-100 text-purple-800',
            [VoucherType.PURCHASE]: 'bg-indigo-100 text-indigo-800',
        };
        return <span className={`px-2 py-1 text-xs font-medium rounded-full ${colors[type]}`}>{type}</span>
    }
    
    if (isCreating) {
        return (
            <div className="bg-white p-6 rounded-xl shadow-md animate-fade-in">
                 <h3 className="text-xl font-semibold text-gray-800">Create New Voucher</h3>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Voucher Type</label>
                        <select value={newVoucher.voucherType} onChange={e => setNewVoucher(p => ({...p, voucherType: e.target.value as VoucherType}))} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm">
                            {(Object.values(VoucherType) as VoucherType[]).map(v => <option key={v} value={v}>{v}</option>)}
                        </select>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700">Date</label>
                        <input type="date" value={newVoucher.date} onChange={e => setNewVoucher(p => ({...p, date: e.target.value}))} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
                    </div>
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700">Description / Narration</label>
                    <textarea value={newVoucher.description} onChange={e => setNewVoucher(p => ({...p, description: e.target.value}))} rows={2} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"></textarea>
                 </div>
                 <div className="mt-6 overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="p-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-2/5">Account</th>
                                <th className="p-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">Debit</th>
                                <th className="p-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">Credit</th>
                                <th className="p-2 w-[50px]"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {newVoucher.lines.map((line, index) => (
                                <tr key={index}>
                                    <td className="p-1"><select value={line.accountId} onChange={e => handleLineChange(index, 'accountId', e.target.value)} className="w-full p-2 border border-gray-300 rounded-md text-sm"><option value="">Select Account</option>{accounts.map(a => <option key={a.id} value={a.id}>{a.accountName}</option>)}</select></td>
                                    <td className="p-1"><input type="number" value={line.debit || ''} onChange={e => handleLineChange(index, 'debit', e.target.value)} className="w-full p-2 border border-gray-300 rounded-md text-right text-sm font-mono" /></td>
                                    <td className="p-1"><input type="number" value={line.credit || ''} onChange={e => handleLineChange(index, 'credit', e.target.value)} className="w-full p-2 border border-gray-300 rounded-md text-right text-sm font-mono" /></td>
                                    <td className="p-1 text-center"><button onClick={() => removeLine(index)} className="text-red-500 hover:text-red-700">&times;</button></td>
                                </tr>
                            ))}
                        </tbody>
                         <tfoot>
                            <tr className="font-bold border-t-2">
                                <td className="p-2 text-right">Total</td>
                                <td className="p-2 text-right font-mono">{formatCurrency(totalDebit)}</td>
                                <td className="p-2 text-right font-mono">{formatCurrency(totalCredit)}</td>
                                <td></td>
                            </tr>
                        </tfoot>
                    </table>
                 </div>
                 <div className="flex justify-between items-center mt-4">
                    <button onClick={addLine} className="px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-50">+ Add Row</button>
                    <div className="flex items-center">
                        {!isBalanced && totalDebit !== totalCredit && <p className="text-red-600 text-sm mr-4">Totals do not match!</p>}
                        <button onClick={() => setIsCreating(false)} className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
                        <button onClick={handleSubmit} disabled={!isBalanced} className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed">Submit for Approval</button>
                    </div>
                 </div>
            </div>
        );
    }

    return (
        <>
            <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center space-x-2">
                        <h3 className="text-xl font-semibold text-gray-800">General Ledger</h3>
                        <select value={filter} onChange={e => setFilter(e.target.value as any)} className="text-sm p-1.5 border-gray-200 border rounded-md focus:ring-primary focus:border-primary">
                            <option value="ALL">All Vouchers</option>
                            {(Object.values(VoucherType) as VoucherType[]).map(v => <option key={v} value={v}>{v}</option>)}
                        </select>
                    </div>
                     {currentUser !== 'Auditor' && <button onClick={() => setIsCreating(true)} className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors shadow-sm">Create New Voucher</button>}
                </div>
                {filteredVouchers.map(entry => (
                    <div key={entry.id} className="border rounded-lg p-4 mb-4">
                        <div className="flex justify-between items-center border-b pb-2 mb-2">
                            <div>
                                <p className="font-bold">{entry.description}</p>
                                <p className="text-xs text-gray-500 font-mono">{entry.voucherNumber}</p>
                            </div>
                            <div className="text-right">
                               <VoucherTypeBadge type={entry.voucherType} />
                               <p className="text-sm text-gray-500 mt-1">{entry.date}</p>
                            </div>
                        </div>
                         <div className="flex justify-between items-center mt-2">
                            <StatusBadge status={entry.status} />
                            <div className="text-xs text-gray-500">
                                Created by: {entry.createdBy} {entry.approvedBy && `| Approved by: ${entry.approvedBy}`}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
};

const FinancialStatement: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-white p-6 rounded-xl shadow-md">
        <h3 className="text-2xl font-bold text-center text-gray-800">{title}</h3>
        <p className="text-center text-gray-500 text-sm mb-6">As of Today (Real-time)</p>
        <div className="max-w-2xl mx-auto">{children}</div>
    </div>
);

const StatementRow: React.FC<{ label: string; value: number; isTotal?: boolean; isSub?: boolean }> = ({ label, value, isTotal = false, isSub = false }) => (
    <div className={`flex justify-between py-2 ${isTotal ? 'font-bold border-t-2 mt-2 pt-2' : 'border-b'} ${isSub ? 'pl-6' : ''}`}>
        <span className={isTotal ? 'text-gray-800' : 'text-gray-600'}>{label}</span>
        <span className="font-mono">{formatCurrency(value)}</span>
    </div>
);

const ProfitAndLoss: React.FC = () => {
    const { accounts } = useAppContext();
    const revenues = accounts.filter(a => a.accountType === AccountType.REVENUE);
    const expenses = accounts.filter(a => a.accountType === AccountType.EXPENSE);
    const totalRevenue = revenues.reduce((sum, acc) => sum + acc.balance, 0);
    const totalExpense = expenses.reduce((sum, acc) => sum + acc.balance, 0);
    const netIncome = totalRevenue - totalExpense;

    return (
        <FinancialStatement title="Profit & Loss Statement">
            <h4 className="text-lg font-semibold mt-4 mb-2">Revenue</h4>
            {revenues.map(acc => <StatementRow key={acc.id} label={acc.accountName} value={acc.balance} isSub />)}
            <StatementRow label="Total Revenue" value={totalRevenue} isTotal />
            
            <h4 className="text-lg font-semibold mt-6 mb-2">Expenses</h4>
            {expenses.map(acc => <StatementRow key={acc.id} label={acc.accountName} value={acc.balance} isSub />)}
            <StatementRow label="Total Expenses" value={totalExpense} isTotal />
            
            <div className={`flex justify-between py-3 font-extrabold text-lg my-4 px-2 rounded-md ${netIncome >= 0 ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                <span>Net {netIncome >= 0 ? 'Income' : 'Loss'}</span>
                <span className="font-mono">{formatCurrency(netIncome)}</span>
            </div>
        </FinancialStatement>
    );
};

const BalanceSheet: React.FC = () => {
    const { accounts } = useAppContext();
    const assets = accounts.filter(a => a.accountType === AccountType.ASSET);
    const liabilities = accounts.filter(a => a.accountType === AccountType.LIABILITY);
    const equity = accounts.filter(a => a.accountType === AccountType.EQUITY);
    const totalAssets = assets.reduce((sum, acc) => sum + acc.balance, 0);
    const totalLiabilities = liabilities.reduce((sum, acc) => sum + acc.balance, 0);
    const totalEquity = equity.reduce((sum, acc) => sum + acc.balance, 0);
    const totalLiabilitiesAndEquity = totalLiabilities + totalEquity;

     return (
        <FinancialStatement title="Balance Sheet">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <h4 className="text-lg font-semibold mt-4 mb-2">Assets</h4>
                    {assets.map(acc => <StatementRow key={acc.id} label={acc.accountName} value={acc.balance} isSub />)}
                    <StatementRow label="Total Assets" value={totalAssets} isTotal />
                </div>
                <div>
                     <h4 className="text-lg font-semibold mt-4 mb-2">Liabilities</h4>
                     {liabilities.map(acc => <StatementRow key={acc.id} label={acc.accountName} value={acc.balance} isSub />)}
                     <StatementRow label="Total Liabilities" value={totalLiabilities} isTotal />
                     <h4 className="text-lg font-semibold mt-6 mb-2">Equity</h4>
                     {equity.map(acc => <StatementRow key={acc.id} label={acc.accountName} value={acc.balance} isSub />)}
                     <StatementRow label="Total Equity" value={totalEquity} isTotal />
                </div>
            </div>
            <div className="flex justify-between py-3 font-extrabold text-lg bg-blue-50 my-4 px-2 rounded-md text-blue-800">
                <span>Total Liabilities + Equity</span>
                <span className="font-mono">{formatCurrency(totalLiabilitiesAndEquity)}</span>
            </div>
            {Math.abs(totalAssets - totalLiabilitiesAndEquity) > 0.01 && (
                <p className="text-center text-red-600 font-bold">The balance sheet is out of balance!</p>
            )}
        </FinancialStatement>
    );
};


// --- MAIN COMPONENT ---
type AccountingView = 'generalLedger' | 'chartOfAccounts' | 'approvals' | 'pnl' | 'balanceSheet';

const Accounting: React.FC = () => {
  const { currentUser, vouchers } = useAppContext();
  const [activeTab, setActiveTab] = useState<AccountingView>('generalLedger');
  const [approvingVoucher, setApprovingVoucher] = useState<Voucher | null>(null);

  const pendingApprovalCount = useMemo(() => {
    return vouchers.filter(v => v.status === VoucherStatus.PENDING_APPROVAL).length;
  }, [vouchers]);

  const pendingApprovalVouchers = useMemo(() => {
    return vouchers.filter(v => v.status === VoucherStatus.PENDING_APPROVAL);
  }, [vouchers]);

  const approvalColumns: Column<Voucher>[] = [
    { header: 'Voucher #', accessor: 'voucherNumber' },
    { header: 'Date', accessor: 'date' },
    { header: 'Description', accessor: 'description' },
    { header: 'Created By', accessor: 'createdBy', render: (row: Voucher) => <StatusBadge status={row.createdBy as any} /> },
    { header: 'Actions', accessor: 'id', render: (row: Voucher) => (
        <div className="space-x-2">
            <button onClick={() => setApprovingVoucher(row)} className="font-semibold text-primary hover:text-primary-dark">Review</button>
        </div>
    )},
  ];
  
  const TabButton: React.FC<{ view: AccountingView, label: string, count?: number }> = ({ view, label, count }) => (
    <button onClick={() => setActiveTab(view)} className={`py-3 px-4 font-medium text-sm transition-colors rounded-t-lg flex items-center ${activeTab === view ? 'border-b-2 border-primary text-primary' : 'text-gray-500 hover:text-gray-700'}`}>
        {label}
        {count !== undefined && count > 0 && <span className="ml-2 bg-red-100 text-red-700 text-xs font-bold px-2 py-0.5 rounded-full">{count}</span>}
    </button>
  );

  const renderContent = () => {
    switch(activeTab) {
        case 'generalLedger': return <VoucherEntry setApprovingVoucher={setApprovingVoucher} />;
        case 'chartOfAccounts': return <ChartOfAccounts />;
        case 'approvals': return <DataTable data={pendingApprovalVouchers} columns={approvalColumns} title="Vouchers for Approval" />;
        case 'pnl': return <ProfitAndLoss />;
        case 'balanceSheet': return <BalanceSheet />;
        default: return null;
    }
  };

  return (
    <div className="animate-fade-in">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Accounting Management</h2>
       <div className="mb-4 border-b border-gray-200">
        <nav className="-mb-px flex space-x-6">
            <TabButton view="generalLedger" label="General Ledger" />
            <TabButton view="chartOfAccounts" label="Chart of Accounts" />
            {currentUser === 'Super Admin' && <TabButton view="approvals" label="Approvals" count={pendingApprovalCount} />}
            <TabButton view="pnl" label="Profit & Loss" />
            <TabButton view="balanceSheet" label="Balance Sheet" />
        </nav>
      </div>
      <div>
        {renderContent()}
      </div>
       {approvingVoucher && (
            <VoucherApprovalModal 
            isOpen={!!approvingVoucher}
            onClose={() => setApprovingVoucher(null)}
            voucher={approvingVoucher}
            />
        )}
    </div>
  );
};

export default Accounting;