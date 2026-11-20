import React, { useState } from 'react';
import DataTable, { Column } from '../components/DataTable';
import type { Lender } from './types';
import { formatCurrency } from '../utils/formatters';
import { NewLenderModal } from '../components/ActionModals';
import { useAppContext } from '../AppContext';

const Lenders: React.FC = () => {
    const { lenders, handleAddLender, currentUser } = useAppContext();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const columns: Column<Lender>[] = [
        { header: 'Lender Name', accessor: 'name' },
        { header: 'Type', accessor: 'type' },
        { header: 'Total Lent', accessor: 'totalLent', render: (row: Lender) => formatCurrency(row.totalLent) },
        { header: 'Active Loans', accessor: 'activeLoans' },
        { header: 'Interest Share', accessor: 'interestShare', render: (row: Lender) => row.interestShare ? `${row.interestShare.toFixed(2)}%` : 'N/A' },
        { header: 'Actions', accessor: 'id', render: (row: Lender) => <button onClick={() => alert(`Viewing details for ${row.name}`)} className="font-semibold text-primary hover:text-primary-dark">View Details</button> },
    ];

    return (
        <div className="animate-fade-in">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Lender Management</h2>
            <DataTable
                columns={columns}
                data={lenders}
                title="All Lenders & Funding Sources"
                actionButton={currentUser !== 'Auditor' ? <button onClick={() => setIsModalOpen(true)} className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors shadow-sm">Add New Lender</button> : null}
            />
            <NewLenderModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAddLender={handleAddLender}
            />
        </div>
    );
};

export default Lenders;