import React, { useMemo, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { useAppContext } from '../AppContext';
import { useBranding } from '../BrandingContext';
import { formatCurrency } from '../utils/formatters';
import { AssetClass, TransactionType } from './types';
import SeverityBadge from '../components/SeverityBadge';

// Card for charts
const ChartCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-white p-6 rounded-xl shadow-md">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">{title}</h3>
        <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
                {children}
            </ResponsiveContainer>
        </div>
    </div>
);

// This section is from the original AiCenter.tsx
const AiTools: React.FC = () => {
    const { auditFindings, handleRunAudit } = useAppContext();
    const [query, setQuery] = useState('');
    const [isThinking, setIsThinking] = useState(false);
    const [queryResponse, setQueryResponse] = useState('');

    const handleQuerySubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!query) return;

        setIsThinking(true);
        setQueryResponse('');

        // Simulate AI response
        setTimeout(() => {
            let response = "I'm not sure how to answer that. Try asking about 'total active loans' or 'applications from Bangalore'.";
            if (query.toLowerCase().includes('total') && query.toLowerCase().includes('active loans')) {
                response = "The total value of all active loans across all categories is ₹17,00,000.";
            } else if (query.toLowerCase().includes('bangalore')) {
                response = "There is 1 application from Bangalore: Rohan Tech for ₹5,00,000."
            }
            setQueryResponse(response);
            setIsThinking(false);
        }, 1500);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Natural Language Analytics</h3>
                <p className="text-sm text-gray-500 mb-4">Ask a question about your data in plain English.</p>
                <form onSubmit={handleQuerySubmit}>
                    <input 
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="e.g., What is the total value of active MSME loans?"
                        className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        disabled={isThinking}
                    />
                    <button type="submit" disabled={isThinking} className="mt-3 w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors shadow-sm disabled:bg-gray-400">
                        {isThinking ? 'Thinking...' : 'Ask AI'}
                    </button>
                </form>
                { (isThinking || queryResponse) && (
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-semibold text-gray-700">AI Response:</h4>
                        {isThinking ? <p className="text-gray-500 italic animate-pulse">Analyzing data...</p> : <p className="text-gray-800 mt-2 whitespace-pre-wrap">{queryResponse}</p>}
                    </div>
                )}
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
                 <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold text-gray-800">Continuous Self-Auditing</h3>
                    <button onClick={handleRunAudit} className="px-3 py-1.5 bg-primary-light text-primary-dark text-sm font-semibold rounded-lg hover:bg-primary/20">Run Full Audit</button>
                 </div>
                 <p className="text-sm text-gray-500 mb-4">AI is constantly monitoring for anomalies and compliance issues.</p>
                 <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                    {auditFindings.map(finding => (
                        <div key={finding.id} className="p-3 bg-gray-50 border-l-4 rounded-r-lg" style={{ borderColor: finding.severity === 'Critical' ? '#ef4444' : finding.severity === 'High' ? '#f97316' : '#f59e0b' }}>
                            <div className="flex justify-between items-start">
                                <p className="font-semibold text-gray-800 text-sm">{finding.finding}</p>
                                <SeverityBadge severity={finding.severity} />
                            </div>
                            <p className="text-xs text-gray-600 mt-1">{finding.recommendation}</p>
                            <p className="text-xs text-gray-400 mt-2 text-right">{new Date(finding.timestamp).toLocaleString()}</p>
                        </div>
                    ))}
                 </div>
            </div>
        </div>
    );
}

// This section is from the original DataAnalytics.tsx
const DataDashboards: React.FC = () => {
    const { loans, homeLoans, businessLoans, industryLoans, leases, applications, transactions } = useAppContext();
    const { primaryColor } = useBranding();

    const allLoans = useMemo(() => [...loans, ...homeLoans, ...businessLoans, ...industryLoans], [loans, homeLoans, businessLoans, industryLoans]);

    const portfolioMixData = useMemo(() => {
        const totalLoanValue = allLoans.reduce((sum, loan) => sum + loan.principalAmount, 0);
        const totalLeaseValue = leases.reduce((sum, lease) => {
            const app = applications.find(a => a.id === lease.applicationId);
            return sum + (app?.amount || 0);
        }, 0);
        return [ { name: 'Total Loans', value: totalLoanValue }, { name: 'Total Leases', value: totalLeaseValue } ];
    }, [allLoans, leases, applications]);
    
    const assetQualityData = useMemo(() => {
       const qualityMap = allLoans.reduce((acc, loan) => {
           const simpleClass = loan.assetClass.startsWith('SMA') ? 'SMA' : loan.assetClass;
           acc[simpleClass] = (acc[simpleClass] || 0) + 1;
           return acc;
       }, {} as Record<string, number>);
       return Object.entries(qualityMap).map(([name, value]) => ({ name, value }));
    }, [allLoans]);
    
    const monthlyFlowData = useMemo(() => {
        const disbursements = allLoans.reduce((sum, l) => sum + l.principalAmount, 0);
        const collections = transactions.filter(t => t.type === TransactionType.CREDIT).reduce((sum, t) => sum + t.amount, 0);
        return [
            { name: 'June', Disbursements: disbursements, Collections: collections }, { name: 'July', Disbursements: disbursements * 0.8, Collections: collections * 1.1 }, { name: 'Aug', Disbursements: disbursements * 1.2, Collections: collections * 0.9 },
        ];
    }, [allLoans, transactions]);

    const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f97316', '#ef4444'];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <ChartCard title="Portfolio Mix (by Value)">
                <PieChart>
                    <Pie data={portfolioMixData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} labelLine={false} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                        {portfolioMixData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(value as number)} /> <Legend />
                </PieChart>
            </ChartCard>
            <ChartCard title="Asset Quality Breakdown (by Count)">
                <PieChart>
                    <Pie data={assetQualityData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                        {assetQualityData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                    </Pie>
                    <Tooltip /> <Legend />
                </PieChart>
            </ChartCard>
            <ChartCard title="Monthly Disbursements vs. Collections">
                 <BarChart data={monthlyFlowData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false}/> <XAxis dataKey="name" />
                    <YAxis tickFormatter={(val) => `${(val / 100000).toFixed(0)}L`} />
                    <Tooltip formatter={(value) => formatCurrency(value as number)} /> <Legend />
                    <Bar dataKey="Disbursements" fill={primaryColor} radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Collections" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ChartCard>
            <ChartCard title="NPA Trend (Quarterly)">
                <LineChart data={[ {name: 'Q1', NPA: 2.1}, {name: 'Q2', NPA: 2.5}, {name: 'Q3', NPA: 2.3}, {name: 'Q4', NPA: 2.8} ]}>
                    <CartesianGrid strokeDasharray="3 3" /> <XAxis dataKey="name" /> <YAxis unit="%" /> <Tooltip /> <Legend />
                    <Line type="monotone" dataKey="NPA" stroke={primaryColor} strokeWidth={2} activeDot={{ r: 8 }} />
                </LineChart>
            </ChartCard>
        </div>
    );
}

// Main component that combines both with a tabbed interface
const DataAnalytics: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'dashboards' | 'ai'>('dashboards');

    const TabButton: React.FC<{ view: 'dashboards' | 'ai', label: string }> = ({ view, label }) => (
        <button onClick={() => setActiveTab(view)} className={`py-3 px-4 font-medium text-sm transition-colors rounded-t-lg ${activeTab === view ? 'border-b-2 border-primary text-primary' : 'text-gray-500 hover:text-gray-700'}`}>
            {label}
        </button>
      );

    return (
        <div className="animate-fade-in">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Business Intelligence Center</h2>
            <div className="mb-6 border-b border-gray-200">
                <nav className="-mb-px flex space-x-6">
                    <TabButton view="dashboards" label="Data Dashboards" />
                    <TabButton view="ai" label="AI Analytics & Audit" />
                </nav>
            </div>
            {activeTab === 'dashboards' && <DataDashboards />}
            {activeTab === 'ai' && <AiTools />}
        </div>
    );
};

export default DataAnalytics;