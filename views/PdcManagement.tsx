
import React, { useMemo, useState } from 'react';
import DataTable, { Column } from '../components/DataTable';
import { useAppContext } from '../AppContext';
import type { PostDatedCheque } from './types';
import { PdcStatus } from './types';
import StatusBadge from '../components/StatusBadge';
import { formatCurrency } from '../utils/formatters';
import StatsCard from '../components/StatsCard';
import ChequeIcon from '../components/icons/ChequeIcon';
import MoneyIcon from '../components/icons/MoneyIcon';
import ShieldIcon from '../components/icons/ShieldIcon';

const PdcManagement: React.FC = () => {
    const { pdcs, handleUpdatePdcStatus, currentUser } = useAppContext();
    const [filter, setFilter] = useState<PdcStatus | 'All'>('All');

    const stats = useMemo(() => {
        const today = new Date().toISOString().split('T')[0];
        const pendingValue = pdcs.filter(p => p.status === PdcStatus.PENDING).reduce((sum, p) => sum + p.amount, 0);
        const dueToday = pdcs.filter(p => p.chequeDate === today && p.status === PdcStatus.PENDING).length;
        const bouncedThisMonth = pdcs.filter(p => p.status === PdcStatus.BOUNCED && p.chequeDate.startsWith(today.substring(0, 7))).length;
        return { pendingValue, dueToday, bouncedThisMonth };
    }, [pdcs]);

    const filteredPdcs = useMemo(() => {
        if (filter === 'All') return pdcs;
        return pdcs.filter(p => p.status === filter);
    }, [pdcs, filter]);

    const columns: Column<PostDatedCheque>[] = [
        { header: 'Cheque Date', accessor: 'chequeDate' },
        { header: 'Applicant', accessor: 'applicantName' },
        { header: 'Cheque #', accessor: 'chequeNumber', render: (row) => <span className="font-mono">{row.chequeNumber}</span> },
        { header: 'Bank', accessor: 'bankName' },
        { header: 'Amount', accessor: 'amount', render: (row) => formatCurrency(row.amount) },
        { header: 'Status', accessor: 'status', render: (row) => <StatusBadge status={row.status} /> },
        { header: 'Actions', accessor: 'id', render: (row) => {
            if (currentUser === 'Auditor') return <span className="text-xs text-gray-400">Read-only</span>;
            return (
                <div className="flex space-x-2">
                    {row.status === PdcStatus.PENDING && (
                        <button onClick={() => handleUpdatePdcStatus(row.id, PdcStatus.DEPOSITED)} className="text-xs font-semibold text-blue-600 hover:text-blue-800">Deposit</button>
                    )}
                     {row.status === PdcStatus.DEPOSITED && (
                        <>
                            <button onClick={() => handleUpdatePdcStatus(row.id, PdcStatus.CLEARED)} className="text-xs font-semibold text-green-600 hover:text-green-800">Clear</button>
                            <button onClick={() => handleUpdatePdcStatus(row.id, PdcStatus.BOUNCED)} className="text-xs font-semibold text-red-600 hover:text-red-800">Bounce</button>
                        </>
                    )}
                     {(row.status === PdcStatus.CLEARED || row.status === PdcStatus.BOUNCED) && (
                        <span className="text-xs text-gray-400">Processed</span>
                    )}
                </div>
            );
        }},
    ];

     const FilterButton: React.FC<{ type: PdcStatus | 'All'; count: number }> = ({ type, count }) => (
        <button 
            onClick={() => setFilter(type)}
            className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${filter === type ? 'bg-primary text-white shadow' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
        >
            {type} <span className="ml-2 bg-gray-200 text-gray-700 text-xs px-2 py-0.5 rounded-full">{count}</span>
        </button>
    );

    return (
        <div className="animate-fade-in space-y-8">
            <div className="flex items-center space-x-3">
                <div className="bg-primary-light p-3 rounded-full text-primary">
                    <ChequeIcon />
                </div>
                <h2 className="text-3xl font-bold text-gray-800">PDC Management</h2>
            </div>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatsCard title="Pending Cheques Value" value={formatCurrency(stats.pendingValue)} change="" changeType="none" isChangeGood={true} icon={<MoneyIcon />} color="#3b82f6" />
                <StatsCard title="Due for Deposit Today" value={stats.dueToday.toString()} change="" changeType="none" isChangeGood={true} icon={<ChequeIcon />} color="#f97316" />
                <StatsCard title="Bounced This Month" value={stats.bouncedThisMonth.toString()} change="" changeType="none" isChangeGood={false} icon={<ShieldIcon />} color="#ef4444" />
            </div>

            <div className="bg-white p-4 rounded-xl shadow-md">
                 <div className="flex items-center space-x-2">
                    <FilterButton type="All" count={pdcs.length} />
                    <FilterButton type={PdcStatus.PENDING} count={pdcs.filter(p=>p.status===PdcStatus.PENDING).length} />
                    <FilterButton type={PdcStatus.DEPOSITED} count={pdcs.filter(p=>p.status===PdcStatus.DEPOSITED).length} />
                    <FilterButton type={PdcStatus.CLEARED} count={pdcs.filter(p=>p.status===PdcStatus.CLEARED).length} />
                    <FilterButton type={PdcStatus.BOUNCED} count={pdcs.filter(p=>p.status===PdcStatus.BOUNCED).length} />
                </div>
            </div>

            <DataTable
                columns={columns}
                data={filteredPdcs}
                title="Post-Dated Cheque Ledger"
            />
        </div>
    );
};

export default PdcManagement;