

import React, { useState } from 'react';
import DataTable, { Column } from '../components/DataTable';
import type { Transaction } from './types';
import StatusBadge from '../components/StatusBadge';
import TransactionAmount from '../components/TransactionAmount';
import { RecordPaymentModal } from '../components/ActionModals';
import { useAppContext } from '../AppContext';

const Transactions: React.FC = () => {
    const { transactions, currentUser } = useAppContext();
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const columns: Column<Transaction>[] = [
        { header: 'Transaction ID', accessor: 'id' },
        { header: 'Date', accessor: 'date' },
        { header: 'Description', accessor: 'description' },
        { header: 'Payment Mode', accessor: 'mode' },
        { header: 'Amount', accessor: 'amount', render: (row: Transaction) => <TransactionAmount amount={row.amount} type={row.type} /> },
        { header: 'Status', accessor: 'status', render: (row: Transaction) => <StatusBadge status={row.status} /> },
    ];

    return (
        <div className="animate-fade-in">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Payment Transactions</h2>
            <DataTable
                columns={columns}
                data={transactions}
                title="Transaction History"
                actionButton={
                    currentUser !== 'Auditor' ? (
                    <div className="flex space-x-2">
                         <button onClick={() => setIsModalOpen(true)} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">Record Payment</button>
                         <button onClick={() => alert('Exporting to CSV... (Feature coming soon!)')} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition">Export CSV</button>
                    </div>
                    ) : null
                }
            />
            <RecordPaymentModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
};

export default Transactions;