import React, { useState } from 'react';
import DataTable from '../components/DataTable';
import type { Transaction } from '../types';
import { TransactionType, PaymentMode, TransactionStatus } from '../types';
import StatusBadge from '../components/StatusBadge';
import TransactionAmount from '../components/TransactionAmount';
import { RecordPaymentModal } from '../components/ActionModals';

const mockTransactionsData: Transaction[] = [
    { id: 'txn-1', applicationId: 'app-2', date: '2023-06-05', description: 'Loan Disbursement to Innovate Solutions', amount: 5000000, type: TransactionType.DEBIT, mode: PaymentMode.RTGS, status: TransactionStatus.COMPLETED, referenceNumber: 'RTGS12345' },
    { id: 'txn-2', applicationId: 'app-1', date: '2023-06-05', description: 'Lease Downpayment from Ramesh Kumar', amount: 200000, type: TransactionType.CREDIT, mode: PaymentMode.UPI, status: TransactionStatus.COMPLETED, referenceNumber: 'UPI67890' },
    { id: 'txn-3', applicationId: 'app-5', date: '2023-06-04', description: 'EMI Payment from A. Patel', amount: 25000, type: TransactionType.CREDIT, mode: PaymentMode.GATEWAY, status: TransactionStatus.COMPLETED, referenceNumber: 'GATEWAY54321' },
    { id: 'txn-4', applicationId: 'app-4', date: '2023-06-03', description: 'Cash handling charge', amount: 500, type: TransactionType.DEBIT, mode: PaymentMode.CASH, status: TransactionStatus.COMPLETED, referenceNumber: 'CASH9876' },
    { id: 'txn-5', applicationId: 'app-3', date: '2023-06-02', description: 'Vendor Payment - Car Dealer', amount: 750000, type: TransactionType.DEBIT, mode: PaymentMode.NEFT, status: TransactionStatus.PENDING, referenceNumber: 'NEFT55443' },
    { id: 'txn-6', applicationId: 'app-3', date: '2023-06-01', description: 'Processing Fee from S. Sharma', amount: 12000, type: TransactionType.CREDIT, mode: PaymentMode.IMPS, status: TransactionStatus.FAILED, referenceNumber: 'IMPS22110' },
];

const Transactions: React.FC = () => {
    const [transactions, setTransactions] = useState<Transaction[]>(mockTransactionsData);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const handleAddTransaction = (newTransactionData: Partial<Transaction>) => {
        const newTransaction: Transaction = {
            id: `txn-${Date.now()}`,
            applicationId: newTransactionData.applicationId || 'N/A',
            date: newTransactionData.date || new Date().toISOString().split('T')[0],
            description: newTransactionData.description || 'New Transaction',
            amount: newTransactionData.amount || 0,
            type: newTransactionData.type || TransactionType.CREDIT,
            mode: newTransactionData.mode || PaymentMode.UPI,
            status: TransactionStatus.COMPLETED,
            referenceNumber: `REF-${Date.now()}`,
        };
        setTransactions(prev => [newTransaction, ...prev]);
        setIsModalOpen(false);
    };

    const columns = [
        { header: 'Transaction ID', accessor: 'id' as keyof Transaction },
        { header: 'Date', accessor: 'date' as keyof Transaction },
        { header: 'Description', accessor: 'description' as keyof Transaction },
        { header: 'Payment Mode', accessor: 'mode' as keyof Transaction },
        { header: 'Amount', accessor: 'amount' as keyof Transaction, render: (row: Transaction) => <TransactionAmount amount={row.amount} type={row.type} /> },
        { header: 'Status', accessor: 'status' as keyof Transaction, render: (row: Transaction) => <StatusBadge status={row.status} /> },
    ];

    return (
        <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Payment Transactions</h2>
            <DataTable
                columns={columns}
                data={transactions}
                title="Transaction History"
                actionButton={
                    <div className="flex space-x-2">
                         <button onClick={() => setIsModalOpen(true)} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">Record Payment</button>
                         <button onClick={() => alert('Exporting to CSV... (Feature coming soon!)')} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition">Export CSV</button>
                    </div>
                }
            />
            <RecordPaymentModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAddTransaction={handleAddTransaction}
            />
        </div>
    );
};

export default Transactions;
