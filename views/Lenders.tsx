import React, { useState } from 'react';
import DataTable from '../components/DataTable';
import type { Lender } from '../types';
import { formatCurrency } from '../utils/formatters';
import { NewLenderModal } from '../components/ActionModals';

const mockLendersData: Lender[] = [
    { id: 'lender-1', name: 'Internal Capital Fund', type: 'Internal', totalLent: 25000000, activeLoans: 15 },
    { id: 'lender-2', name: 'Partner NBFC A', type: 'External Partner', totalLent: 15000000, activeLoans: 8, interestShare: 8.5 },
    { id: 'lender-3', name: 'Venture Debt Fund B', type: 'External Partner', totalLent: 50000000, activeLoans: 22, interestShare: 9.2 },
    { id: 'lender-4', name: 'Private Investor Group', type: 'External Partner', totalLent: 5000000, activeLoans: 3, interestShare: 12.0 },
];

const Lenders: React.FC = () => {
    const [lenders, setLenders] = useState<Lender[]>(mockLendersData);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleAddLender = (newLenderData: Omit<Lender, 'id' | 'totalLent' | 'activeLoans'>) => {
        const newLender: Lender = {
            ...newLenderData,
            id: `lender-${Date.now()}`,
            totalLent: 0,
            activeLoans: 0,
        };
        setLenders(prev => [newLender, ...prev]);
        setIsModalOpen(false);
    };

    const columns = [
        { header: 'Lender Name', accessor: 'name' as keyof Lender },
        { header: 'Type', accessor: 'type' as keyof Lender },
        { header: 'Total Lent', accessor: 'totalLent' as keyof Lender, render: (row: Lender) => formatCurrency(row.totalLent) },
        { header: 'Active Loans', accessor: 'activeLoans' as keyof Lender },
        { header: 'Interest Share', accessor: 'interestShare' as keyof Lender, render: (row: Lender) => row.interestShare ? `${row.interestShare.toFixed(2)}%` : 'N/A' },
        { header: 'Actions', accessor: 'id' as keyof Lender, render: (row: Lender) => <button onClick={() => alert(`Viewing details for ${row.name}`)} className="font-semibold text-primary hover:text-primary-dark">View Details</button> },
    ];

    return (
        <div className="animate-fade-in">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Lender Management</h2>
            <DataTable
                columns={columns}
                data={lenders}
                title="All Lenders & Funding Sources"
                actionButton={<button onClick={() => setIsModalOpen(true)} className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors shadow-sm">Add New Lender</button>}
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
