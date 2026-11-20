import React, { useState, useMemo } from 'react';
import DataTable, { Column } from '../components/DataTable';
import { useAppContext } from '../AppContext';
import type { Grievance } from './types';
import { GrievanceStatus } from './types';
import StatusBadge from '../components/StatusBadge';
import { NewGrievanceModal, InvestigateGrievanceModal } from '../components/ActionModals';
import GrievanceIcon from '../components/icons/GrievanceIcon';
import StatsCard from '../components/StatsCard';
import ShieldIcon from '../components/icons/ShieldIcon';

const GrievanceRedressal: React.FC = () => {
    const { grievances, currentUser } = useAppContext();
    const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
    const [investigatingGrievance, setInvestigatingGrievance] = useState<Grievance | null>(null);

    const stats = useMemo(() => {
        const open = grievances.filter(g => g.status === GrievanceStatus.OPEN).length;
        const resolved = grievances.filter(g => g.status === GrievanceStatus.RESOLVED);
        const resolvedWithinSla = resolved.filter(g => new Date(g.resolvedAt!) <= new Date(g.dueDate)).length;
        const slaPercentage = resolved.length > 0 ? (resolvedWithinSla / resolved.length) * 100 : 100;
        return { open, slaPercentage: slaPercentage.toFixed(1) };
    }, [grievances]);
    
    const isOverdue = (dueDate: string) => {
        return new Date(dueDate) < new Date();
    }

    const columns: Column<Grievance>[] = [
        { header: 'Grievance ID', accessor: 'grievanceId', render: (row) => <span className="font-mono text-xs">{row.grievanceId}</span> },
        { header: 'Customer', accessor: 'customerName' },
        { header: 'Category', accessor: 'category' },
        { header: 'Raised On', accessor: 'createdAt' },
        { header: 'SLA Due Date', accessor: 'dueDate', render: (row) => (
            <span className={isOverdue(row.dueDate) && row.status !== GrievanceStatus.RESOLVED ? 'text-red-600 font-semibold' : ''}>
                {row.dueDate}
            </span>
        )},
        { header: 'Status', accessor: 'status', render: (row) => <StatusBadge status={row.status} /> },
        { header: 'Actions', accessor: 'id', render: (row) => (
            <button onClick={() => setInvestigatingGrievance(row)} className="font-semibold text-primary hover:text-primary-dark">Investigate</button>
        )},
    ];

    return (
        <div className="animate-fade-in space-y-8">
            <div className="flex items-center space-x-3">
                <div className="bg-primary-light p-3 rounded-full text-primary">
                    <GrievanceIcon />
                </div>
                <h2 className="text-3xl font-bold text-gray-800">Grievance Redressal</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <StatsCard title="Open Grievances" value={stats.open.toString()} change="" changeType="none" isChangeGood={false} icon={<GrievanceIcon />} color="#f97316" />
                 <StatsCard title="Resolved within SLA" value={`${stats.slaPercentage}%`} change="" changeType="none" isChangeGood={true} icon={<ShieldIcon />} color="#10b981" />
                 <StatsCard title="Avg. Resolution Time" value="2.5 Days" change="" changeType="none" isChangeGood={true} icon={<GrievanceIcon />} color="#3b82f6" />
            </div>

            <DataTable
                columns={columns}
                data={grievances}
                title="Customer Grievance Log"
                actionButton={currentUser !== 'Auditor' ? <button onClick={() => setIsRegisterModalOpen(true)} className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark">Register New Grievance</button> : null}
            />
            
            <NewGrievanceModal
                isOpen={isRegisterModalOpen}
                onClose={() => setIsRegisterModalOpen(false)}
            />
            
            <InvestigateGrievanceModal
                isOpen={!!investigatingGrievance}
                onClose={() => setInvestigatingGrievance(null)}
                grievance={investigatingGrievance}
            />
        </div>
    );
};

export default GrievanceRedressal;
