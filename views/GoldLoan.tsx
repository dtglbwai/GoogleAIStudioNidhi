
import React, { useMemo, useState } from 'react';
import DataTable, { Column } from '../components/DataTable';
import { useAppContext } from '../AppContext';
import type { GoldLoan } from './types';
import { LoanStatus, PdcStatus } from './types';
import StatusBadge from '../components/StatusBadge';
import { formatCurrency } from '../utils/formatters';
import StatsCard from '../components/StatsCard';
import GoldIcon from '../components/icons/GoldIcon';
import MoneyIcon from '../components/icons/MoneyIcon';
import ShieldIcon from '../components/icons/ShieldIcon';
import { NewGoldLoanModal } from '../components/ActionModals';

const GoldLoan: React.FC = () => {
    const { goldLoans, handleMoveToAuction, currentUser } = useAppContext();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const stats = useMemo(() => {
        const activeLoans = goldLoans.filter(p => p.status === LoanStatus.PLEDGED || p.status === LoanStatus.ACTIVE);
        const totalCollateralValue = activeLoans.reduce((sum, p) => sum + p.appraisedValue, 0);
        const nearingAuction = goldLoans.filter(p => p.status === LoanStatus.DEFAULTED).length;
        return { activeLoans: activeLoans.length, totalCollateralValue, nearingAuction };
    }, [goldLoans]);


    const columns: Column<GoldLoan>[] = [
        { header: 'Applicant', accessor: 'applicantName' },
        { header: 'Packet No.', accessor: 'pledgePacketNumber', render: (row) => <span className="font-mono">{row.pledgePacketNumber}</span> },
        { header: 'Loan Amount', accessor: 'principalAmount', render: (row) => formatCurrency(row.principalAmount) },
        { header: 'Appraised Value', accessor: 'appraisedValue', render: (row) => formatCurrency(row.appraisedValue) },
        { header: 'Net Weight (g)', accessor: 'jewelDetails', render: (row) => row.jewelDetails.reduce((sum, j) => sum + j.netWeight, 0).toFixed(2) },
        { header: 'Status', accessor: 'status', render: (row) => <StatusBadge status={row.status} /> },
        { header: 'Actions', accessor: 'id', render: (row) => {
            if (currentUser === 'Auditor') return <span className="text-xs text-gray-400">Read-only</span>;
            
            if (row.status === LoanStatus.DEFAULTED) {
                return <button onClick={() => handleMoveToAuction(row.id)} className="font-semibold text-red-600 hover:text-red-800">Move to Auction</button>
            }

            return <button className="font-semibold text-primary hover:text-primary-dark">View Details</button>
        }},
    ];


    return (
        <div className="animate-fade-in space-y-8">
            <div className="flex items-center space-x-3">
                <div className="bg-primary-light p-3 rounded-full text-primary">
                    <GoldIcon />
                </div>
                <h2 className="text-3xl font-bold text-gray-800">Gold Loan Management</h2>
            </div>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatsCard title="Active Gold Loans" value={stats.activeLoans.toString()} change="" changeType="none" isChangeGood={true} icon={<GoldIcon />} color="#f59e0b" />
                <StatsCard title="Total Gold Collateral Value" value={formatCurrency(stats.totalCollateralValue)} change="" changeType="none" isChangeGood={true} icon={<MoneyIcon />} color="#3b82f6" />
                <StatsCard title="Loans Nearing Auction" value={stats.nearingAuction.toString()} change="" changeType="none" isChangeGood={false} icon={<ShieldIcon />} color="#ef4444" />
            </div>

            <DataTable
                columns={columns}
                data={goldLoans}
                title="Gold Loan Portfolio"
                actionButton={currentUser !== 'Auditor' ? <button onClick={() => setIsModalOpen(true)} className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark">New Gold Pledge</button> : null}
            />

            <NewGoldLoanModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
};

export default GoldLoan;
