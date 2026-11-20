
import React, { useState } from 'react';
import DataTable, { Column } from '../components/DataTable';
import type { LegalCase } from './types';
import { useAppContext } from '../AppContext';
import StatusBadge from '../components/StatusBadge';
import { NewLegalCaseModal } from '../components/ActionModals';

const Litigation: React.FC = () => {
    const { legalCases, currentUser } = useAppContext();
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const columns: Column<LegalCase>[] = [
        { header: 'Case Number', accessor: 'caseNumber' },
        { header: 'Type', accessor: 'type' },
        { header: 'Applicant', accessor: 'applicantName' },
        { header: 'Filing Date', accessor: 'filingDate' },
        { header: 'Counsel', accessor: 'counsel' },
        { header: 'Status', accessor: 'status', render: (row: LegalCase) => <StatusBadge status={row.status as any} /> },
        { header: 'Actions', accessor: 'id', render: (row: LegalCase) => <button className="font-semibold text-primary hover:text-primary-dark">View Details</button> },
    ];
  
    return (
        <div className="animate-fade-in">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Litigation Management</h2>

            <DataTable
                columns={columns}
                data={legalCases}
                title="All Legal Cases"
                actionButton={
                    currentUser !== 'Auditor' ? 
                    <button onClick={() => setIsModalOpen(true)} className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors shadow-sm">File New Case</button> : null
                }
            />

            <NewLegalCaseModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
};

export default Litigation;
