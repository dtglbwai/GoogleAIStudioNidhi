import React from 'react';
import DataTable from '../components/DataTable';
import type { BankAccount, Transaction } from '../types';
import { formatCurrency } from '../utils/formatters';
import { TransactionType, PaymentMode, TransactionStatus } from '../types';
import StatusBadge from '../components/StatusBadge';
import TransactionAmount from '../components/TransactionAmount';

const mockAccounts: BankAccount[] = [
    { id: 'ba-1', bankName: 'HDFC Bank', accountNumber: '...XXXX 1234', ifsc: 'HDFC0001234', balance: 1850000, isPrimary: true },
    { id: 'ba-2', bankName: 'ICICI Bank', accountNumber: '...XXXX 5678', ifsc: 'ICIC0005678', balance: 725000, isPrimary: false },
    { id: 'ba-3', bankName: 'Cash in Hand', accountNumber: 'N/A', ifsc: 'N/A', balance: 85000, isPrimary: false },
];

const mockBankTransactions: Transaction[] = [
    { id: 'txn-1', applicationId: 'inv-1', date: '2023-06-11', description: 'Sale - Global Tech Inc.', amount: 177000, type: TransactionType.CREDIT, mode: PaymentMode.NEFT, status: TransactionStatus.COMPLETED, referenceNumber: 'NEFT11223' },
    { id: 'txn-2', applicationId: 'bill-1', date: '2023-06-10', description: 'Purchase - Raw Materials Co.', amount: 250000, type: TransactionType.DEBIT, mode: PaymentMode.RTGS, status: TransactionStatus.COMPLETED, referenceNumber: 'RTGS99887' },
    { id: 'txn-3', applicationId: '', date: '2023-06-09', description: 'Office Rent - June', amount: 50000, type: TransactionType.DEBIT, mode: PaymentMode.IMPS, status: TransactionStatus.COMPLETED, referenceNumber: 'IMPS44556' },
    { id: 'txn-4', applicationId: 'inv-3', date: '2023-06-12', description: 'Part Payment - Creative Designs', amount: 40000, type: TransactionType.CREDIT, mode: PaymentMode.UPI, status: TransactionStatus.COMPLETED, referenceNumber: 'UPI77889' },
];

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
                <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors shadow-sm">Add Bank Account</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {mockAccounts.map(acc => <BankAccountCard key={acc.id} account={acc} />)}
            </div>

            <DataTable
                columns={transactionColumns}
                data={mockBankTransactions}
                title="Recent Bank & Cash Transactions"
            />
        </div>
    );
};

export default CashAndBank;
