
import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useAppContext } from '../AppContext';
import { formatCurrency } from '../utils/formatters';
import type { Loan, Customer, OperationalRiskEvent } from './types';
import { AssetClass, CustomerStatus, ComplianceTaskStatus } from './types';
import StatsCard from '../components/StatsCard';
import DataTable, { Column } from '../components/DataTable';
import ShieldIcon from '../components/icons/ShieldIcon';
import UserIcon from '../components/icons/UserIcon';
import GavelIcon from '../components/icons/GavelIcon';
import StatusBadge from '../components/StatusBadge';

const ChartCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-white p-6 rounded-xl shadow-md">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">{title}</h3>
        <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>{children}</ResponsiveContainer>
        </div>
    </div>
);

const RiskDashboard: React.FC = () => {
    const { loans, homeLoans, businessLoans, industryLoans, customers, complianceTasks, operationalRiskEvents } = useAppContext();

    const allLoans = useMemo(() => [...loans, ...homeLoans, ...businessLoans, ...industryLoans], [loans, homeLoans, businessLoans, industryLoans]);

    const riskStats = useMemo(() => {
        const portfolioAtRisk = allLoans
            .filter(l => l.daysPastDue > 30)
            .reduce((sum, l) => sum + l.principalAmount, 0);

        const totalPortfolio = allLoans.reduce((sum, l) => sum + l.principalAmount, 0);
        
        const top5Borrowers = [...customers]
            .map(c => ({
                ...c,
                exposure: allLoans.filter(l => l.customerId === c.id).reduce((sum, l) => sum + l.principalAmount, 0)
            }))
            .sort((a, b) => b.exposure - a.exposure)
            .slice(0, 5);
            
        const top5Exposure = top5Borrowers.reduce((sum, c) => sum + c.exposure, 0);
        const concentrationRisk = totalPortfolio > 0 ? (top5Exposure / totalPortfolio) * 100 : 0;

        const openOpRiskEvents = operationalRiskEvents.filter(e => e.status !== 'Resolved').length;

        const completedTasks = complianceTasks.filter(t => t.status === ComplianceTaskStatus.COMPLETED).length;
        const complianceScore = complianceTasks.length > 0 ? (completedTasks / complianceTasks.length) * 100 : 100;

        return {
            portfolioAtRisk,
            concentrationRisk,
            openOpRiskEvents,
            complianceScore,
        };
    }, [allLoans, customers, complianceTasks, operationalRiskEvents]);

    const delinquencyData = useMemo(() => {
        const buckets: Record<string, number> = {
            '1-30 Days': 0,
            '31-60 Days': 0,
            '61-90 Days': 0,
            '90+ Days': 0,
        };
        allLoans.forEach(loan => {
            if (loan.daysPastDue > 90) {
                buckets['90+ Days'] += loan.principalAmount;
            } else if (loan.daysPastDue > 60) {
                buckets['61-90 Days'] += loan.principalAmount;
            } else if (loan.daysPastDue > 30) {
                buckets['31-60 Days'] += loan.principalAmount;
            } else if (loan.daysPastDue > 0) {
                buckets['1-30 Days'] += loan.principalAmount;
            }
        });
        return Object.entries(buckets).map(([name, value]) => ({ name, value }));
    }, [allLoans]);

    const riskRatingData = useMemo(() => {
        const ratings: Record<string, number> = {
            'Low': 0,
            'Medium': 0,
            'High': 0,
        };
        customers.forEach(c => {
            if (c.riskRating) {
                ratings[c.riskRating]++;
            }
        });
        return Object.entries(ratings).map(([name, value]) => ({ name, value }));
    }, [customers]);

    const highRiskCustomers = useMemo(() => {
        return customers
            .filter(c => c.riskRating === 'High' || c.status === CustomerStatus.DEFAULTED)
            .slice(0, 10);
    }, [customers]);
    
    const customerColumns: Column<Customer>[] = [
        { header: 'Customer Name', accessor: 'name' },
        { header: 'PAN', accessor: 'pan' },
        { header: 'Status', accessor: 'status', render: (row) => <StatusBadge status={row.status} /> },
        { header: 'Risk Rating', accessor: 'riskRating', render: (row) => <span className="font-semibold text-red-600">{row.riskRating}</span> },
    ];

    const RISK_RATING_COLORS: Record<string, string> = { 'Low': '#10b981', 'Medium': '#f59e0b', 'High': '#ef4444' };

    return (
        <div className="animate-fade-in space-y-8">
            <h2 className="text-3xl font-bold text-gray-800">Risk Management Dashboard</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard title="Portfolio at Risk (>30d)" value={formatCurrency(riskStats.portfolioAtRisk)} change="+1.2%" changeType="increase" isChangeGood={false} icon={<ShieldIcon />} color="#ef4444" />
                <StatsCard title="Credit Concentration (Top 5)" value={`${riskStats.concentrationRisk.toFixed(1)}%`} change="-0.5%" changeType="decrease" isChangeGood={true} icon={<UserIcon />} color="#f97316" />
                <StatsCard title="Open Operational Risks" value={riskStats.openOpRiskEvents.toString()} change="+1" changeType="increase" isChangeGood={false} icon={<GavelIcon />} color="#f59e0b" />
                <StatsCard title="Compliance Score" value={`${riskStats.complianceScore.toFixed(0)}%`} change="+5%" changeType="increase" isChangeGood={true} icon={<ShieldIcon />} color="#10b981" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <ChartCard title="Delinquency Aging (by Principal)">
                    <BarChart data={delinquencyData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                        <XAxis type="number" tickFormatter={(val) => `${(val / 100000).toFixed(0)}L`} />
                        <YAxis type="category" dataKey="name" width={80} />
                        <Tooltip formatter={(value) => formatCurrency(value as number)} />
                        <Bar dataKey="value" fill="#ef4444" radius={[0, 4, 4, 0]} barSize={25} />
                    </BarChart>
                </ChartCard>
                 <ChartCard title="Customer Distribution by Risk Rating">
                    <PieChart>
                        <Pie data={riskRatingData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                            {riskRatingData.map((entry) => <Cell key={`cell-${entry.name}`} fill={RISK_RATING_COLORS[entry.name]} />)}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </ChartCard>
            </div>

            <DataTable
                columns={customerColumns}
                data={highRiskCustomers}
                title="High-Risk Customer Watchlist"
                itemsPerPage={5}
            />
        </div>
    );
};
export default RiskDashboard;