
import React, { useState, useMemo } from 'react';
import DataTable, { Column } from '../components/DataTable';
import type { Loan, Lease, CollectionLog } from './types';
import { LoanStatus, LeaseStatus } from './types';
import { formatCurrency } from '../utils/formatters';
import { useAppContext } from '../AppContext';
import StatusBadge from '../components/StatusBadge';
import { LogCollectionActionModal, NewLegalCaseModal } from '../components/ActionModals';

const Collections: React.FC = () => {
    const { loans, leases, collectionLogs, currentUser, handleInitiateVehicleSeizure } = useAppContext();
    const [loggingActionFor, setLoggingActionFor] = useState<{ id: string, type: 'Loan' | 'Lease' } | null>(null);
    const [filingCaseFor, setFilingCaseFor] = useState<{id: string, type: 'Loan' | 'Lease', name: string} | null>(null);

    const overdueLoans = useMemo(() => loans.filter(l => l.status === LoanStatus.OVERDUE || l.status === LoanStatus.DEFAULTED), [loans]);
    const overdueLeases = useMemo(() => leases.filter(l => l.paymentSchedule.some(p => p.status === 'Overdue')), [leases]);

    const getOverdueAmount = (entity: Loan | Lease) => {
        if ('repaymentSchedule' in entity) {
            return entity.repaymentSchedule.filter(p => p.status === 'Overdue').reduce((sum, p) => sum + p.totalAmount, 0);
        }
        if ('paymentSchedule' in entity) {
            return entity.paymentSchedule.filter(p => p.status === 'Overdue').reduce((sum, p) => sum + p.amount, 0);
        }
        return 0;
    };

    const loanColumns: Column<Loan>[] = [
        { header: 'Applicant', accessor: 'applicantName' },
        { header: 'Overdue Amount', accessor: 'id', render: (row: Loan) => formatCurrency(getOverdueAmount(row)) },
        { header: 'Days Past Due', accessor: 'daysPastDue', render: (row: Loan) => <span className="font-bold text-red-600">{row.daysPastDue}</span> },
        { header: 'Collection Status', accessor: 'collectionStatus', render: (row: Loan) => <StatusBadge status={row.collectionStatus as any} /> },
        { header: 'Actions', accessor: 'id', render: (row: Loan) => (
            <div className="space-x-2">
                <button onClick={() => setLoggingActionFor({id: row.id, type: 'Loan'})} className="font-semibold text-primary hover:text-primary-dark">Log Action</button>
                <button onClick={() => setFilingCaseFor({id: row.id, type: 'Loan', name: row.applicantName})} className="font-semibold text-red-600 hover:text-red-800">File Legal Case</button>
            </div>
        )},
    ];

    const leaseColumns: Column<Lease>[] = [
        { header: 'Applicant', accessor: 'applicantName' },
        { header: 'Overdue Amount', accessor: 'id', render: (row: Lease) => formatCurrency(getOverdueAmount(row)) },
        { header: 'Collection Status', accessor: 'collectionStatus', render: (row: Lease) => <StatusBadge status={row.collectionStatus as any} /> },
        { header: 'Actions', accessor: 'id', render: (row: Lease) => (
            <div className="space-x-2">
                <button onClick={() => setLoggingActionFor({id: row.id, type: 'Lease'})} className="font-semibold text-primary hover:text-primary-dark">Log Action</button>
                <button onClick={() => handleInitiateVehicleSeizure(row.id)} className="font-semibold text-orange-600 hover:text-orange-800">Initiate Seizure</button>
                <button onClick={() => setFilingCaseFor({id: row.id, type: 'Lease', name: row.applicantName})} className="font-semibold text-red-600 hover:text-red-800">File Legal Case</button>
            </div>
        )},
    ];


  return (
    <div className="animate-fade-in">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Collections & Recovery</h2>
        
        <div className="space-y-8">
             <DataTable
                columns={loanColumns}
                data={overdueLoans}
                title="Delinquent Loan Accounts"
            />
             <DataTable
                columns={leaseColumns}
                data={overdueLeases}
                title="Delinquent Lease Accounts"
            />
        </div>

        <LogCollectionActionModal 
            isOpen={!!loggingActionFor}
            onClose={() => setLoggingActionFor(null)}
            entityId={loggingActionFor?.id || null}
            entityType={loggingActionFor?.type || 'Loan'}
        />

        <NewLegalCaseModal
            isOpen={!!filingCaseFor}
            onClose={() => setFilingCaseFor(null)}
            entityId={filingCaseFor?.id}
            entityType={filingCaseFor?.type}
            applicantName={filingCaseFor?.name}
        />
    </div>
  );
};

export default Collections;
