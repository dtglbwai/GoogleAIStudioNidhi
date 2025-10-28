import React, { useState } from 'react';
import DataTable from '../components/DataTable';
import type { Application, Loan, Lendee } from '../types';
import { ApplicationStatus, ApplicationType, LendeeStatus, LoanStatus } from '../types';
import StatusBadge from '../components/StatusBadge';
import { formatCurrency } from '../utils/formatters';
import { NewApplicantApplicationModal, ReviewApplicationModal } from '../components/ActionModals';

interface ApplicantsProps {
    applications: Application[];
    setApplications: React.Dispatch<React.SetStateAction<Application[]>>;
    setLoans: React.Dispatch<React.SetStateAction<Loan[]>>;
    setLendees: React.Dispatch<React.SetStateAction<Lendee[]>>;
}

const Applicants: React.FC<ApplicantsProps> = ({ applications, setApplications, setLoans, setLendees }) => {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [reviewingApp, setReviewingApp] = useState<Application | null>(null);

    const handleAddApplication = (newApplicationData: Omit<Application, 'id' | 'submittedDate' | 'status' | 'documents'>) => {
        const newApplication: Application = {
            ...newApplicationData,
            id: `app-${Date.now()}`,
            submittedDate: new Date().toISOString().split('T')[0],
            status: ApplicationStatus.PENDING,
            documents: [],
        };
        setApplications(prev => [newApplication, ...prev]);
        setIsCreateModalOpen(false);
    };

    const handleApprove = (appToApprove: Application) => {
        // 1. Update application status
        setApplications(prev => prev.map(app => 
            app.id === appToApprove.id ? { ...app, status: ApplicationStatus.APPROVED } : app
        ));

        // 2. Create new Lendee if not exists
        setLendees(prev => {
            const exists = prev.some(l => l.name === appToApprove.applicant.name);
            if (exists) {
                 // Optionally update existing lendee's borrowed amount
                 return prev.map(l => l.name === appToApprove.applicant.name ? {...l, totalBorrowed: l.totalBorrowed + appToApprove.amount, outstandingBalance: l.outstandingBalance + appToApprove.amount, activeLoans: l.activeLoans + 1} : l);
            }
            const newLendee: Lendee = {
                id: `lendee-${appToApprove.applicant.pan}`,
                name: appToApprove.applicant.name,
                type: appToApprove.applicant.type,
                totalBorrowed: appToApprove.amount,
                outstandingBalance: appToApprove.amount,
                activeLoans: 1,
                status: LendeeStatus.ACTIVE,
            };
            return [...prev, newLendee];
        });

        // 3. If it's a loan, create a new Loan record
        if (appToApprove.type === ApplicationType.MSME_LOAN) {
            const newLoan: Loan = {
                id: `loan-${appToApprove.id}`,
                applicantId: `lendee-${appToApprove.applicant.pan}`,
                applicantName: appToApprove.applicant.name,
                principalAmount: appToApprove.amount,
                disbursedDate: new Date().toISOString().split('T')[0],
                interestRate: appToApprove.interestRate || 12,
                tenureMonths: appToApprove.tenureMonths || 24,
                status: LoanStatus.ACTIVE,
                repaymentSchedule: [],
            };
            setLoans(prev => [...prev, newLoan]);
        }
        
        setReviewingApp(null);
    };

    const handleReject = (appToReject: Application) => {
        setApplications(prev => prev.map(app => 
            app.id === appToReject.id ? { ...app, status: ApplicationStatus.REJECTED } : app
        ));
        setReviewingApp(null);
    };

    const columns = [
        { header: 'Applicant Name', accessor: 'applicant' as keyof Application, render: (row: Application) => (
            <div>
                <div className="font-semibold text-gray-800">{row.applicant.name}</div>
                <div className="text-xs text-gray-500">{row.applicant.type}</div>
            </div>
        )},
        { header: 'Application Type', accessor: 'type' as keyof Application },
        { header: 'Amount', accessor: 'amount' as keyof Application, render: (row: Application) => formatCurrency(row.amount) },
        { header: 'Date Submitted', accessor: 'submittedDate' as keyof Application },
        { header: 'Status', accessor: 'status' as keyof Application, render: (row: Application) => <StatusBadge status={row.status} /> },
        { header: 'Actions', accessor: 'id' as keyof Application, render: (row: Application) => (
             row.status === ApplicationStatus.PENDING || row.status === ApplicationStatus.SUBMITTED || row.status === ApplicationStatus.IN_REVIEW ? (
                <button onClick={() => setReviewingApp(row)} className="font-semibold text-primary hover:text-primary-dark">Review Application</button>
             ) : (
                <span className="text-sm text-gray-500">Processed</span>
             )
        )},
    ];

    return (
        <div className="animate-fade-in">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Applicant Management</h2>
            <DataTable
                columns={columns}
                data={applications}
                title="All Incoming Applications"
                actionButton={<button onClick={() => setIsCreateModalOpen(true)} className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors shadow-sm">New Applicant Application</button>}
            />
            <NewApplicantApplicationModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onAddApplication={handleAddApplication}
            />
            {reviewingApp && (
                 <ReviewApplicationModal
                    isOpen={!!reviewingApp}
                    onClose={() => setReviewingApp(null)}
                    application={reviewingApp}
                    onApprove={handleApprove}
                    onReject={handleReject}
                />
            )}
        </div>
    );
};

export default Applicants;