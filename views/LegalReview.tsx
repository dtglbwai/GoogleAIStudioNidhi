import React, { useMemo } from 'react';
import DataTable, { Column } from '../components/DataTable';
import { useAppContext } from '../AppContext';
import type { Application } from './types';
import { ApplicationStatus } from './types';
import StatusBadge from '../components/StatusBadge';
import GavelIcon from '../components/icons/GavelIcon';
import { formatCurrency } from '../utils/formatters';

const LegalReview: React.FC = () => {
    const { applications, handleAdvanceApplicationState, currentUser } = useAppContext();

    const pendingLegalReviewApps = useMemo(() => {
        return applications.filter(app => app.status === ApplicationStatus.PENDING_LEGAL_REVIEW);
    }, [applications]);

    const columns: Column<Application>[] = [
        { header: 'Applicant', accessor: 'applicant', render: (row) => row.applicant.name },
        { header: 'Application Type', accessor: 'type' },
        { header: 'Amount', accessor: 'amount', render: (row) => formatCurrency(row.amount) },
        { header: 'Submitted', accessor: 'submittedDate' },
        { header: 'Status', accessor: 'status', render: (row) => <StatusBadge status={row.status} /> },
        {
            header: 'Actions', accessor: 'id', render: (row) => (
                <div className="space-x-4">
                    <button className="font-semibold text-gray-600 hover:text-gray-900">View Docs</button>
                    {currentUser === 'Legal' || currentUser === 'Super Admin' ? (
                        <>
                            <button onClick={() => handleAdvanceApplicationState(row.id, ApplicationStatus.PENDING_FINAL_APPROVAL)} className="font-semibold text-green-600 hover:text-green-800">Approve</button>
                            <button onClick={() => handleAdvanceApplicationState(row.id, ApplicationStatus.REJECTED)} className="font-semibold text-red-600 hover:text-red-800">Reject</button>
                        </>
                    ) : null}
                </div>
            )
        },
    ];

    return (
        <div className="animate-fade-in">
            <div className="flex items-center space-x-3 mb-6">
                <div className="bg-primary-light p-3 rounded-full text-primary">
                    <GavelIcon />
                </div>
                <h2 className="text-3xl font-bold text-gray-800">Legal Review Queue</h2>
            </div>
            <DataTable
                columns={columns}
                data={pendingLegalReviewApps}
                title="Applications Pending Legal Opinion"
            />
        </div>
    );
};

export default LegalReview;