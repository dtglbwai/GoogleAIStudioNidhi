import React from 'react';
import DataTable from '../components/DataTable';
import type { Lendee } from '../types';
import StatusBadge from '../components/StatusBadge';
import { formatCurrency } from '../utils/formatters';

interface LendeesProps {
    lendees: Lendee[];
}

const Lendees: React.FC<LendeesProps> = ({ lendees }) => {

    const columns = [
        { header: 'Lendee Name', accessor: 'name' as keyof Lendee },
        { header: 'Type', accessor: 'type' as keyof Lendee },
        { header: 'Outstanding Balance', accessor: 'outstandingBalance' as keyof Lendee, render: (row: Lendee) => formatCurrency(row.outstandingBalance) },
        { header: 'Active Loans', accessor: 'activeLoans' as keyof Lendee },
        { header: 'Credit Score', accessor: 'creditScore' as keyof Lendee, render: (row: Lendee) => row.creditScore || 'N/A' },
        { header: 'Status', accessor: 'status' as keyof Lendee, render: (row: Lendee) => <StatusBadge status={row.status} /> },
        { header: 'Actions', accessor: 'id' as keyof Lendee, render: (row: Lendee) => <button onClick={() => alert(`Viewing details for ${row.name}`)} className="font-semibold text-primary hover:text-primary-dark">View Details</button> },
    ];

    return (
        <div className="animate-fade-in">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Lendee Management</h2>
            <DataTable
                columns={columns}
                data={lendees}
                title="All Lendees (Borrowers)"
            />
        </div>
    );
};

export default Lendees;