
import React, { useMemo } from 'react';
import DataTable, { Column } from '../components/DataTable';
import { useAppContext } from '../AppContext';
import type { Loan } from './types';
import { formatCurrency } from '../utils/formatters';
import CoLendingIcon from '../components/icons/CoLendingIcon';
import StatsCard from '../components/StatsCard';
import MoneyIcon from '../components/icons/MoneyIcon';
import UserIcon from '../components/icons/UserIcon';
import StatusBadge from '../components/StatusBadge';

const CoLending: React.FC = () => {
    const { loans, homeLoans, businessLoans, industryLoans, lenders } = useAppContext();

    const coLentLoans = useMemo(() => {
        const allLoans = [...loans, ...homeLoans, ...businessLoans, ...industryLoans];
        return allLoans.filter(loan => loan.coLenders && loan.coLenders.length > 0);
    }, [loans, homeLoans, businessLoans, industryLoans]);

    const stats = useMemo(() => {
        const totalPortfolio = coLentLoans.reduce((sum, loan) => sum + loan.principalAmount, 0);
        const partnerShare = coLentLoans.reduce((sum, loan) => {
            const externalShare = loan.coLenders?.filter(c => c.lenderId !== 'lender-1').reduce((shareSum, c) => shareSum + (c.sharePercentage / 100), 0) || 0;
            return sum + (loan.principalAmount * externalShare);
        }, 0);
        const activePartners = new Set(coLentLoans.flatMap(l => l.coLenders?.map(c => c.lenderId)).filter(id => id !== 'lender-1')).size;
        
        return { totalPortfolio, partnerShare, activePartners };
    }, [coLentLoans]);

    const columns: Column<Loan>[] = [
        { header: 'Applicant', accessor: 'applicantName' },
        { header: 'Principal', accessor: 'principalAmount', render: (row) => formatCurrency(row.principalAmount) },
        { header: 'Co-lenders', accessor: 'coLenders', render: (row) => (
            <ul className="text-xs">
                {row.coLenders?.map(c => (
                    <li key={c.lenderId}><strong>{c.lenderName}:</strong> {c.sharePercentage}%</li>
                ))}
            </ul>
        )},
        { header: 'Status', accessor: 'status', render: (row) => <StatusBadge status={row.status} /> },
        { header: 'Actions', accessor: 'id', render: (row) => <button className="font-semibold text-primary hover:text-primary-dark">View Details</button> },
    ];

    return (
        <div className="animate-fade-in space-y-8">
            <div className="flex items-center space-x-3">
                <div className="bg-primary-light p-3 rounded-full text-primary">
                    <CoLendingIcon />
                </div>
                <h2 className="text-3xl font-bold text-gray-800">Co-lending Management</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatsCard title="Total Co-lent Portfolio" value={formatCurrency(stats.totalPortfolio)} change="" changeType="none" isChangeGood={true} icon={<MoneyIcon />} color="#3b82f6" />
                <StatsCard title="Total Principal Shared" value={formatCurrency(stats.partnerShare)} change="" changeType="none" isChangeGood={true} icon={<MoneyIcon />} color="#8b5cf6" />
                <StatsCard title="Active Co-lending Partners" value={stats.activePartners.toString()} change="" changeType="none" isChangeGood={true} icon={<UserIcon />} color="#10b981" />
            </div>

            <DataTable
                columns={columns}
                data={coLentLoans}
                title="Co-lent Loan Portfolio"
            />
        </div>
    );
};

export default CoLending;
