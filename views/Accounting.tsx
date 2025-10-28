import React, { useState, useMemo } from 'react';
import DataTable from '../components/DataTable';
import type { Account, JournalLine, Voucher } from '../types';
import { AccountType, VoucherType } from '../types';
import { formatCurrency } from '../utils/formatters';

// --- MOCK DATA ---
const mockAccounts: Account[] = [
    { id: 'acc-1', accountCode: '1010', accountName: 'Cash and Bank', accountType: AccountType.ASSET, balance: 1250000, isSubAccount: false },
    { id: 'acc-2', accountCode: '1210', accountName: 'Accounts Receivable', accountType: AccountType.ASSET, balance: 8500000, isSubAccount: false },
    { id: 'acc-3', accountCode: '2010', accountName: 'Accounts Payable', accountType: AccountType.LIABILITY, balance: 75000, isSubAccount: false },
    { id: 'acc-4', accountCode: '3010', accountName: 'Owner\'s Equity', accountType: AccountType.EQUITY, balance: 5000000, isSubAccount: false },
    { id: 'acc-5', accountCode: '4010', accountName: 'Interest Income', accountType: AccountType.REVENUE, balance: 850000, isSubAccount: false },
    { id: 'acc-6', accountCode: '5010', accountName: 'Salaries Expense', accountType: AccountType.EXPENSE, balance: 350000, isSubAccount: false },
    { id: 'acc-7', accountCode: '5020', accountName: 'Depreciation Expense', accountType: AccountType.EXPENSE, balance: 15000, isSubAccount: false },
    { id: 'acc-8', accountCode: '1511', accountName: 'Accumulated Depreciation', accountType: AccountType.ASSET, balance: -15000, isSubAccount: false },
];

const mockVouchers: Voucher[] = [
    { id: 'v-1', voucherNumber: 'RCPT-001', voucherType: VoucherType.RECEIPT, date: '2023-06-11', description: 'Received payment from Global Tech Inc.', lines: [
        { accountId: 'acc-1', accountName: 'Cash and Bank', debit: 177000, credit: 0 },
        { accountId: 'acc-2', accountName: 'Accounts Receivable', debit: 0, credit: 177000 },
    ]},
    { id: 'v-2', voucherNumber: 'PAY-001', voucherType: VoucherType.PAYMENT, date: '2023-06-12', description: 'Paid salaries for June', lines: [
        { accountId: 'acc-6', accountName: 'Salaries Expense', debit: 350000, credit: 0 },
        { accountId: 'acc-1', accountName: 'Cash and Bank', debit: 0, credit: 350000 },
    ]},
    { id: 'v-3', voucherNumber: 'CONT-001', voucherType: VoucherType.CONTRA, date: '2023-06-13', description: 'Cash deposited to bank', lines: [
        { accountId: 'acc-1', accountName: 'Cash and Bank', debit: 50000, credit: 0 },
        { accountId: 'acc-1', accountName: 'Cash and Bank', debit: 0, credit: 50000 },
    ]},
    { id: 'v-4', voucherNumber: 'JRNL-001', voucherType: VoucherType.JOURNAL, date: '2023-06-14', description: 'Depreciation on office equipment', lines: [
        { accountId: 'acc-7', accountName: 'Depreciation Expense', debit: 15000, credit: 0 },
        { accountId: 'acc-8', accountName: 'Accumulated Depreciation', debit: 0, credit: 15000 },
    ]},
];

// --- SUB-COMPONENTS ---
const ChartOfAccounts: React.FC = () => {
    const columns = [
        { header: 'Code', accessor: 'accountCode' as keyof Account },
        { header: 'Account Name', accessor: 'accountName' as keyof Account },
        { header: 'Account Type', accessor: 'accountType' as keyof Account },
        { header: 'Balance', accessor: 'balance' as keyof Account, render: (row: Account) => formatCurrency(row.balance) },
    ];
    return <DataTable columns={columns} data={mockAccounts} title="Chart of Accounts" />;
};

const VoucherEntry: React.FC = () => {
    const [isCreating, setIsCreating] = useState(false);
    const [vouchers, setVouchers] = useState<Voucher[]>(mockVouchers);
    const [filter, setFilter] = useState<VoucherType | 'ALL'>('ALL');
    const [newVoucher, setNewVoucher] = useState<Omit<Voucher, 'id' | 'voucherNumber'>>({
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
            const selectedAccount = mockAccounts.find(acc => acc.id === value);
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
        const finalVoucher: Voucher = {
            ...newVoucher,
            id: `v-${vouchers.length + 1}`,
            voucherNumber: `${newVoucher.voucherType.slice(0,4).toUpperCase()}-00${vouchers.length + 1}`
        }
        setVouchers(prev => [finalVoucher, ...prev]);
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
                            {Object.values(VoucherType).map(v => <option key={v} value={v}>{v}</option>)}
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
                                    <td className="p-1"><select value={line.accountId} onChange={e => handleLineChange(index, 'accountId', e.target.value)} className="w-full p-2 border border-gray-300 rounded-md text-sm"><option value="">Select Account</option>{mockAccounts.map(a => <option key={a.id} value={a.id}>{a.accountName}</option>)}</select></td>
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
                        <button onClick={handleSubmit} disabled={!isBalanced} className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed">Save Voucher</button>
                    </div>
                 </div>
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center space-x-2">
                    <h3 className="text-xl font-semibold text-gray-800">Vouchers</h3>
                    <select value={filter} onChange={e => setFilter(e.target.value as any)} className="text-sm p-1.5 border-gray-200 border rounded-md focus:ring-primary focus:border-primary">
                        <option value="ALL">All Vouchers</option>
                        {Object.values(VoucherType).map(v => <option key={v} value={v}>{v}</option>)}
                    </select>
                </div>
                <button onClick={() => setIsCreating(true)} className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors shadow-sm">Create New Voucher</button>
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
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-left text-gray-600">
                                <th className="w-2/3 py-1">Account</th>
                                <th className="w-1/6 py-1 text-right">Debit</th>
                                <th className="w-1/6 py-1 text-right">Credit</th>
                            </tr>
                        </thead>
                        <tbody>
                            {entry.lines.map((line, index) => (
                                <tr key={index} className="border-t">
                                    <td className="py-2">{line.accountName}</td>
                                    <td className="py-2 text-right font-mono">{line.debit > 0 ? formatCurrency(line.debit) : '-'}</td>
                                    <td className="py-2 text-right font-mono">{line.credit > 0 ? formatCurrency(line.credit) : '-'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ))}
        </div>
    );
};

const FinancialStatement: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-white p-6 rounded-xl shadow-md">
        <h3 className="text-2xl font-bold text-center text-gray-800">{title}</h3>
        <p className="text-center text-gray-500 text-sm mb-6">As of June 30, 2023</p>
        <div className="max-w-2xl mx-auto">{children}</div>
    </div>
);

const StatementRow: React.FC<{ label: string; value: number; isTotal?: boolean; isSub?: boolean }> = ({ label, value, isTotal = false, isSub = false }) => (
    <div className={`flex justify-between py-2 ${isTotal ? 'font-bold border-t-2 mt-2 pt-2' : 'border-b'} ${isSub ? 'pl-6' : ''}`}>
        <span className={isTotal ? 'text-gray-800' : 'text-gray-600'}>{label}</span>
        <span className="font-mono">{formatCurrency(value)}</span>
    </div>
);

const ProfitAndLoss: React.FC = () => (
    <FinancialStatement title="Profit & Loss Statement">
        <h4 className="text-lg font-semibold mt-4 mb-2">Revenue</h4>
        <StatementRow label="Interest Income" value={850000} isSub />
        <StatementRow label="Processing Fees" value={120000} isSub />
        <StatementRow label="Total Revenue" value={970000} isTotal />
        <h4 className="text-lg font-semibold mt-6 mb-2">Expenses</h4>
        <StatementRow label="Salaries Expense" value={350000} isSub />
        <StatementRow label="Rent Expense" value={120000} isSub />
        <StatementRow label="Bad Debt Expense" value={50000} isSub />
        <StatementRow label="Total Expenses" value={520000} isTotal />
        <div className="flex justify-between py-3 font-extrabold text-lg bg-gray-50 my-4 px-2 rounded-md">
            <span>Net Income</span>
            <span className="font-mono">{formatCurrency(450000)}</span>
        </div>
    </FinancialStatement>
);

const BalanceSheet: React.FC = () => (
     <FinancialStatement title="Balance Sheet">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
                <h4 className="text-lg font-semibold mt-4 mb-2">Assets</h4>
                <StatementRow label="Cash and Bank" value={1250000} isSub />
                <StatementRow label="Accounts Receivable" value={8500000} isSub />
                <StatementRow label="Office Equipment" value={300000} isSub />
                <StatementRow label="Total Assets" value={10050000} isTotal />
            </div>
            <div>
                 <h4 className="text-lg font-semibold mt-4 mb-2">Liabilities</h4>
                 <StatementRow label="Accounts Payable" value={75000} isSub />
                 <StatementRow label="Bank Loan" value={4525000} isSub />
                 <StatementRow label="Total Liabilities" value={4600000} isTotal />
                 <h4 className="text-lg font-semibold mt-6 mb-2">Equity</h4>
                 <StatementRow label="Owner's Capital" value={5000000} isSub />
                 <StatementRow label="Retained Earnings" value={450000} isSub />
                 <StatementRow label="Total Equity" value={5450000} isTotal />
            </div>
        </div>
        <div className="flex justify-between py-3 font-extrabold text-lg bg-blue-50 my-4 px-2 rounded-md text-blue-800">
            <span>Total Liabilities + Equity</span>
            <span className="font-mono">{formatCurrency(10050000)}</span>
        </div>
    </FinancialStatement>
);


// --- MAIN COMPONENT ---
type AccountingView = 'chartOfAccounts' | 'vouchers' | 'pnl' | 'balanceSheet';

const Accounting: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AccountingView>('vouchers');
  
  const TabButton: React.FC<{ view: AccountingView, label: string }> = ({ view, label }) => (
    <button onClick={() => setActiveTab(view)} className={`py-3 px-4 font-medium text-sm transition-colors rounded-t-lg ${activeTab === view ? 'border-b-2 border-primary text-primary' : 'text-gray-500 hover:text-gray-700'}`}>
        {label}
    </button>
  );

  const renderContent = () => {
    switch(activeTab) {
        case 'chartOfAccounts': return <ChartOfAccounts />;
        case 'vouchers': return <VoucherEntry />;
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
            <TabButton view="vouchers" label="Voucher Entry" />
            <TabButton view="chartOfAccounts" label="Chart of Accounts" />
            <TabButton view="pnl" label="Profit & Loss" />
            <TabButton view="balanceSheet" label="Balance Sheet" />
        </nav>
      </div>
      <div>
        {renderContent()}
      </div>
    </div>
  );
};

export default Accounting;