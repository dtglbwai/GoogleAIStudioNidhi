import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useAppContext } from '../AppContext';
import { useBranding } from '../BrandingContext';
import { formatCurrency } from '../utils/formatters';
import type { Investment, Borrowing } from './types';
import StatsCard from '../components/StatsCard';
import DataTable, { Column } from '../components/DataTable';
import MoneyIcon from '../components/icons/MoneyIcon';
import ShieldIcon from '../components/icons/ShieldIcon';
import AnalyticsIcon from '../components/icons/AnalyticsIcon';
import TreasuryIcon from '../components/icons/TreasuryIcon';

const ChartCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-white p-6 rounded-xl shadow-md">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">{title}</h3>
        <div style={{ width: '100%', height: 250 }}>
            <ResponsiveContainer>{children}</ResponsiveContainer>
        </div>
    </div>
);

const Treasury: React.FC = () => {
    const { investments, borrowings } = useAppContext();
    const { primaryColor } = useBranding();

    const stats = useMemo(() => {
        const totalInvestments = investments.reduce((sum, inv) => sum + inv.currentValue, 0);
        const totalBorrowings = borrowings.reduce((sum, bor) => sum + bor.outstandingAmount, 0);
        const netLiquidity = totalInvestments - totalBorrowings; // Simplified
        const weightedYield = investments.reduce((sum, inv) => sum + (inv.currentValue - inv.purchasePrice), 0);
        const totalPurchaseValue = investments.reduce((sum, inv) => sum + inv.purchasePrice, 0);
        const avgYield = totalPurchaseValue > 0 ? (weightedYield / totalPurchaseValue) * 100 : 0;
        
        return { totalInvestments, totalBorrowings, netLiquidity, avgYield };
    }, [investments, borrowings]);

    const investmentAllocationData = useMemo(() => {
        const allocation = investments.reduce((acc, inv) => {
            acc[inv.type] = (acc[inv.type] || 0) + inv.currentValue;
            return acc;
        }, {} as Record<string, number>);
        return Object.entries(allocation).map(([name, value]) => ({ name, value }));
    }, [investments]);

    const borrowingSourceData = useMemo(() => {
        return borrowings.map(bor => ({ name: bor.lenderName, value: bor.outstandingAmount }));
    }, [borrowings]);

    const investmentColumns: Column<Investment>[] = [
        { header: 'Name', accessor: 'name' },
        { header: 'Type', accessor: 'type' },
        { header: 'Purchase Value', accessor: 'purchasePrice', render: (row) => formatCurrency(row.purchasePrice) },
        { header: 'Current Value', accessor: 'currentValue', render: (row) => formatCurrency(row.currentValue) },
        { header: 'Maturity Date', accessor: 'maturityDate', render: (row) => row.maturityDate || 'N/A' },
    ];

    const borrowingColumns: Column<Borrowing>[] = [
        { header: 'Lender', accessor: 'lenderName' },
        { header: 'Facility Type', accessor: 'facilityType' },
        { header: 'Sanctioned Amount', accessor: 'sanctionedAmount', render: (row) => formatCurrency(row.sanctionedAmount) },
        { header: 'Outstanding', accessor: 'outstandingAmount', render: (row) => formatCurrency(row.outstandingAmount) },
        { header: 'Interest Rate', accessor: 'interestRate', render: (row) => `${row.interestRate.toFixed(2)}%` },
        { header: 'Maturity Date', accessor: 'maturityDate' },
    ];

    const COLORS = ['#3b82f6', '#10b981', '#f97316', '#ef4444', '#8b5cf6'];

    return (
        <div className="animate-fade-in space-y-8">
            <div className="flex items-center space-x-3">
                <div className="bg-primary-light p-3 rounded-full text-primary">
                    <TreasuryIcon />
                </div>
                <h2 className="text-3xl font-bold text-gray-800">Treasury Management</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard title="Total Investments" value={formatCurrency(stats.totalInvestments)} change="+1.2%" changeType="increase" isChangeGood={true} icon={<AnalyticsIcon />} color="#10b981" />
                <StatsCard title="Total Borrowings" value={formatCurrency(stats.totalBorrowings)} change="+2.5%" changeType="increase" isChangeGood={false} icon={<MoneyIcon />} color="#ef4444" />
                <StatsCard title="Net Liquidity Position" value={formatCurrency(stats.netLiquidity)} change="-0.8%" changeType="decrease" isChangeGood={false} icon={<ShieldIcon />} color="#f97316" />
                <StatsCard title="Average Portfolio Yield" value={`${stats.avgYield.toFixed(2)}%`} change="+0.1%" changeType="increase" isChangeGood={true} icon={<AnalyticsIcon />} color="#3b82f6" />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <ChartCard title="Investment Portfolio Allocation">
                    <PieChart>
                        <Pie data={investmentAllocationData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                             {investmentAllocationData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                        </Pie>
                        <Tooltip formatter={(value) => formatCurrency(value as number)} />
                        <Legend />
                    </PieChart>
                </ChartCard>
                 <ChartCard title="Sources of Funds (Borrowings)">
                     <BarChart data={borrowingSourceData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                        <XAxis type="number" tickFormatter={(val) => `${(val / 100000).toFixed(0)}L`} />
                        <YAxis type="category" dataKey="name" width={100} />
                        <Tooltip formatter={(value) => formatCurrency(value as number)} />
                        <Bar dataKey="value" fill={primaryColor} radius={[0, 4, 4, 0]} barSize={25} />
                    </BarChart>
                </ChartCard>
            </div>

            <DataTable
                columns={investmentColumns}
                data={investments}
                title="Investment Portfolio"
            />
            <DataTable
                columns={borrowingColumns}
                data={borrowings}
                title="Borrowing Facilities"
            />
        </div>
    );
};

export default Treasury;
