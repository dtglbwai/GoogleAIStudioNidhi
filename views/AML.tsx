
import React, { useState, useMemo } from 'react';
import DataTable, { Column } from '../components/DataTable';
import { useAppContext } from '../AppContext';
import type { Transaction } from './types';
import { AmlStatus } from './types';
import StatusBadge from '../components/StatusBadge';
import { formatCurrency } from '../utils/formatters';
import { InvestigateAmlTransactionModal } from '../components/ActionModals';
import AmlIcon from '../components/icons/AmlIcon';
import StatsCard from '../components/StatsCard';
import MoneyIcon from '../components/icons/MoneyIcon';
import ShieldIcon from '../components/icons/ShieldIcon';
import UserIcon from '../components/icons/UserIcon';

const AML: React.FC = () => {
    const { transactions, customers, currentUser } = useAppContext();
    const [investigatingTxn, setInvestigatingTxn] = useState<Transaction | null>(null);

    const flaggedTransactions = useMemo(() => {
        return transactions.filter(t => t.amlStatus && t.amlStatus !== AmlStatus.CLEAN);
    }, [transactions]);

    const amlStats = useMemo(() => {
        const scanned = transactions.length;
        const sars = transactions.filter(t => t.amlStatus === AmlStatus.REPORTED).length;
        const highRiskCustomers = customers.filter(c => c.riskRating === 'High').length;
        return { scanned, sars, highRiskCustomers };
    }, [transactions, customers]);

    const amlRules = [
        "Large single cash deposit > ₹5L",
        "Rapid movement of funds (large deposit followed by immediate large withdrawal)",
        "Transactions with high-risk jurisdictions (not simulated)",
        "Structuring deposits to stay below reporting thresholds (not simulated)",
    ];

    const columns: Column<Transaction>[] = [
        { header: 'Date', accessor: 'date' },
        { header: 'Description', accessor: 'description' },
        { header: 'Amount', accessor: 'amount', render: (row) => formatCurrency(row.amount) },
        { header: 'Rule Triggered', accessor: 'amlRuleTriggered', render: (row) => <span className="text-red-600 font-medium">{row.amlRuleTriggered}</span> },
        { header: 'Status', accessor: 'amlStatus', render: (row) => <StatusBadge status={row.amlStatus as any} /> },
        { header: 'Actions', accessor: 'id', render: (row) => {
            if (currentUser !== 'Auditor' && (row.amlStatus === AmlStatus.FLAGGED || row.amlStatus === AmlStatus.UNDER_INVESTIGATION)) {
                return <button onClick={() => setInvestigatingTxn(row)} className="font-semibold text-primary hover:text-primary-dark">Investigate</button>
            }
            return <span className="text-xs text-gray-400">No actions</span>
        }},
    ];

    return (
        <div className="animate-fade-in space-y-8">
            <div className="flex items-center space-x-3">
                <div className="bg-primary-light p-3 rounded-full text-primary">
                    <AmlIcon />
                </div>
                <h2 className="text-3xl font-bold text-gray-800">AML & Fraud Monitoring</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatsCard title="Transactions Scanned" value={amlStats.scanned.toLocaleString()} change="" changeType="none" isChangeGood={true} icon={<MoneyIcon />} color="#3b82f6" />
                <StatsCard title="Suspicious Activity Reports (SARs)" value={amlStats.sars.toString()} change="" changeType="none" isChangeGood={false} icon={<ShieldIcon />} color="#ef4444" />
                <StatsCard title="High-Risk Customers" value={amlStats.highRiskCustomers.toString()} change="" changeType="none" isChangeGood={false} icon={<UserIcon />} color="#f97316" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <DataTable
                        columns={columns}
                        data={flaggedTransactions}
                        title="Flagged Transactions for Review"
                    />
                </div>
                <div className="bg-white p-6 rounded-xl shadow-md">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Active Monitoring Rules</h3>
                    <ul className="space-y-3">
                        {amlRules.map((rule, index) => (
                            <li key={index} className="flex items-center text-sm">
                                <ShieldIcon />
                                <span className="ml-2 text-gray-700">{rule}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            
            <InvestigateAmlTransactionModal
                isOpen={!!investigatingTxn}
                onClose={() => setInvestigatingTxn(null)}
                transaction={investigatingTxn}
            />
        </div>
    );
};

export default AML;
