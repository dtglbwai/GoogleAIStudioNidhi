
import React from 'react';
import DataTable, { Column } from '../components/DataTable';
import type { Application } from './types';
import { ApplicationStatus } from './types';
import StatusBadge from '../components/StatusBadge';
import { formatCurrency } from '../utils/formatters';
import { NewApplicantApplicationModal, GenerateAgreementModal } from '../components/ActionModals';
import { useAppContext } from '../AppContext';

const Applications: React.FC = () => {
    const { applications, setState, generatedAgreements, handleMarkAgreementSigned, agreementTemplates, currentUser, handleAdvanceApplicationState } = useAppContext();
    const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);
    const [generatingAgreement, setGeneratingAgreement] = React.useState<{app: Application, type: 'Sanction Letter' | 'Loan Agreement' | 'Lease Agreement'} | null>(null);

    const columns: Column<Application>[] = [
        { header: 'Applicant Name', accessor: 'applicant', render: (row: Application) => (
            <div>
                <div className="font-semibold text-gray-800">{row.applicant.name}</div>
                <div className="text-xs text-gray-500">{row.applicant.type}</div>
            </div>
        )},
        { header: 'Application Type', accessor: 'type' },
        { header: 'Amount', accessor: 'amount', render: (row: Application) => formatCurrency(row.amount) },
        { header: 'Date Submitted', accessor: 'submittedDate' },
        { header: 'Status', accessor: 'status', render: (row: Application) => <StatusBadge status={row.status} /> },
        { header: 'Actions', accessor: 'id', render: (row: Application) => {
            if (currentUser === 'Auditor') {
                return <span className="text-xs text-gray-400">Read-only</span>;
            }

            const agreementType = row.type === 'Auto Lease' ? 'Lease Agreement' : 'Loan Agreement';
            const generatedAgreement = generatedAgreements.find(a => a.applicationId === row.id && a.type === agreementType);

            switch (row.status) {
                case ApplicationStatus.SUBMITTED:
                case ApplicationStatus.PENDING_UNDERWRITING:
                    return <button onClick={() => setState(prev => ({...prev, selectedApplicationId: row.id, currentView: 'underwriting'}))} className="font-semibold text-primary hover:text-primary-dark">Underwrite</button>;
                case ApplicationStatus.UNDERWRITING_APPROVED:
                    return <button onClick={() => handleAdvanceApplicationState(row.id, ApplicationStatus.PENDING_LEGAL_REVIEW)} className="font-semibold text-blue-600 hover:text-blue-800">Send for Legal Review</button>;
                case ApplicationStatus.PENDING_LEGAL_REVIEW:
                case ApplicationStatus.PENDING_FINAL_APPROVAL:
                    return <button onClick={() => alert('Final approval...')} className="font-semibold text-primary hover:text-primary-dark">Final Approval</button>;
                case ApplicationStatus.SANCTIONED:
                    return <button onClick={() => setGeneratingAgreement({app: row, type: 'Sanction Letter'})} className="font-semibold text-blue-600 hover:text-blue-800">Generate Sanction</button>;
                case ApplicationStatus.AGREEMENT_PENDING:
                    return <button onClick={() => setGeneratingAgreement({app: row, type: agreementType})} className="font-semibold text-blue-600 hover:text-blue-800">Generate Agreement</button>;
                 case ApplicationStatus.AWAITING_DISBURSEMENT:
                    return generatedAgreement && generatedAgreement.status !== 'Signed' ? 
                           <button onClick={() => handleMarkAgreementSigned(generatedAgreement.id)} className="font-semibold text-green-600 hover:text-green-800">Mark as Signed</button> :
                           <span className="text-sm text-gray-500">Awaiting Disbursement</span>;
                default:
                    return <span className="text-sm text-gray-500">Processed</span>;
            }
        }},
    ];

    return (
        <div className="animate-fade-in">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Loan Application Management</h2>
            <DataTable
                columns={columns}
                data={applications}
                title="All Incoming Applications"
                actionButton={currentUser !== 'Auditor' ? <button onClick={() => setIsCreateModalOpen(true)} className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors shadow-sm">New Applicant Application</button> : null}
            />
            <NewApplicantApplicationModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
            />
            {generatingAgreement && (
                <GenerateAgreementModal
                    isOpen={!!generatingAgreement}
                    onClose={() => setGeneratingAgreement(null)}
                    application={generatingAgreement.app}
                    agreementType={generatingAgreement.type}
                />
            )}
        </div>
    );
};

export default Applications;