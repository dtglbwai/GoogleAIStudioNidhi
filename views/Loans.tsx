import React from 'react';
import DataTable from '../components/DataTable';
import type { Loan } from '../types';
import StatusBadge from '../components/StatusBadge';
import { formatCurrency } from '../utils/formatters';

interface LoansProps {
    loans: Loan[];
}

const Loans: React.FC<LoansProps> = ({ loans }) => {

    const columns = [
        { header: 'Loan ID', accessor: 'id' as keyof Loan, render: (row: Loan) => <span className="font-mono text-xs">{row.id}</span> },
        { header: 'Applicant Name', accessor: 'applicantName' as keyof Loan },
        { header: 'Principal Amount', accessor: 'principalAmount' as keyof Loan, render: (row: Loan) => formatCurrency(row.principalAmount) },
        { header: 'Disbursed Date', accessor: 'disbursedDate' as keyof Loan },
        { header: 'Interest Rate', accessor: 'interestRate' as keyof Loan, render: (row: Loan) => `${row.interestRate.toFixed(2)}%` },
        { header: 'Tenure', accessor: 'tenureMonths' as keyof Loan, render: (row: Loan) => `${row.tenureMonths} months` },
        { header: 'Status', accessor: 'status' as keyof Loan, render: (row: Loan) => <StatusBadge status={row.status} /> },
        { header: 'Actions', accessor: 'id' as keyof Loan, render: (row: Loan) => <button onClick={() => alert(`Viewing details for loan ${row.id}`)} className="font-semibold text-primary hover:text-primary-dark">View Details</button> },
    ];

    return (
        <div className="animate-fade-in">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Loan Management</h2>
            <DataTable
                columns={columns}
                data={loans}
                title="All Active & Historic MSME Loans"
            />
        </div>
    );
};

export default Loans;