import React, { useMemo } from 'react';
import DataTable from '../components/DataTable';
import type { BankAccount, Transaction } from './types';
import { formatCurrency } from '../utils/formatters';
import { TransactionType, PaymentMode, TransactionStatus } from './types';
import StatusBadge from '../components/StatusBadge';
import TransactionAmount from '../components/TransactionAmount';
import { useAppContext } from '../AppContext';

const BankAccountCard: React.FC<{ account: BankAccount }> = ({ account }) => (
    <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-primary">
        <div className="flex justify-between items-start">
            <div>
                <p className="font-bold text-lg text-gray-800">{account.bankName}</p>
                <p className="text-sm text-gray-500">{account.accountNumber}</p>
            </div>
            {account.isPrimary && <span className="text-xs bg-primary-light text-primary-dark font-semibold px-2 py-1 rounded-full">Primary</span>}
        </div>
        <div className="mt-4">
            <p className="text-sm text-gray-500">Current Balance</p>
            <p className="text-3xl font-bold text-gray-900">{formatCurrency(account.balance)}</p>
        </div>
    </div>
);


const CashAndBank: React.FC = () => {
    const { bankAccounts, transactions, currentUser } = useAppContext();
    
    const bankAndCashTransactions = useMemo(() => {
        const accountIds = bankAccounts.map(a => a.id);
        return transactions.filter(t => accountIds.includes(t.accountId));
    }, [transactions, bankAccounts]);

    const transactionColumns = [
        { header: 'Date', accessor: 'date' as keyof Transaction },
        { header: 'Description', accessor: 'description' as keyof Transaction },
        { header: 'Mode', accessor: 'mode' as keyof Transaction },
        { header: 'Amount', accessor: 'amount' as keyof Transaction, render: (row: Transaction) => <TransactionAmount amount={row.amount} type={row.type} /> },
        { header: 'Status', accessor: 'status' as keyof Transaction, render: (row: Transaction) => <StatusBadge status={row.status} /> },
    ];
    
    return (
        <div className="animate-fade-in">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-gray-800">Cash & Bank</h2>
                {currentUser !== 'Auditor' && (
                    <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors shadow-sm">Add Bank Account</button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {bankAccounts.map(acc => <BankAccountCard key={acc.id} account={acc} />)}
            </div>

            <DataTable
                columns={transactionColumns}
                data={bankAndCashTransactions}
                title="Recent Bank & Cash Transactions"
            />
        </div>
    );
};

export default CashAndBank;