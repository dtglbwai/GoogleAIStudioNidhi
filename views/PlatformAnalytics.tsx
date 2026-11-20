import React, { useMemo } from 'react';
// FIX: Import 'Legend' from recharts to resolve 'Cannot find name' error.
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { useAppContext } from '../AppContext';
import StatsCard from '../components/StatsCard';
import PlatformAnalyticsIcon from '../components/icons/PlatformAnalyticsIcon';
import { useBranding } from '../BrandingContext';

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

const PlatformAnalytics: React.FC = () => {
    const { users, moduleConfig } = useAppContext();
    const { primaryColor } = useBranding();

    const moduleUsageData = useMemo(() => {
        return Object.entries(moduleConfig).map(([name, enabled]) => ({ name, value: enabled ? 1 : 0 }));
    }, [moduleConfig]);

    const roleDistributionData = useMemo(() => {
        const roles = users.reduce((acc, user) => {
            if(user.role) acc[user.role] = (acc[user.role] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);
        return Object.entries(roles).map(([name, value]) => ({ name, value }));
    }, [users]);
    
    const signInData = [
        { day: 'Mon', users: 65 }, { day: 'Tue', users: 72 }, { day: 'Wed', users: 80 },
        { day: 'Thu', users: 75 }, { day: 'Fri', users: 85 }, { day: 'Sat', users: 30 },
        { day: 'Sun', users: 25 },
    ];

    const COLORS = ['#3b82f6', '#10b981', '#f97316', '#ef4444', '#8b5cf6', '#64748b'];

    return (
        <div className="animate-fade-in space-y-8">
             <div className="flex items-center space-x-3">
                <div className="bg-primary-light p-3 rounded-full text-primary">
                    <PlatformAnalyticsIcon />
                </div>
                <h2 className="text-3xl font-bold text-gray-800">SaaS Platform Analytics</h2>
            </div>
            
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard title="Active Tenants" value="1" change="" changeType="none" isChangeGood={true} icon={<PlatformAnalyticsIcon />} color="#3b82f6" />
                <StatsCard title="Total Users" value={users.length.toString()} change="+2 this month" changeType="increase" isChangeGood={true} icon={<PlatformAnalyticsIcon />} color="#10b981" />
                <StatsCard title="Daily Active Users" value="5" change="" changeType="none" isChangeGood={true} icon={<PlatformAnalyticsIcon />} color="#8b5cf6" />
                <StatsCard title="API Calls (24h)" value="1.2M" change="" changeType="none" isChangeGood={true} icon={<PlatformAnalyticsIcon />} color="#f97316" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <ChartCard title="User Sign-ins (Last 7 Days)">
                    <LineChart data={signInData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis />
                        <Tooltip />
                        {/* UX Improvement: Add Legend component to display line name for better chart readability. */}
                        <Legend />
                        <Line type="monotone" dataKey="users" name="Active Users" stroke={primaryColor} strokeWidth={2} />
                    </LineChart>
                </ChartCard>
                 <ChartCard title="User Roles Distribution">
                    <PieChart>
                        <Pie data={roleDistributionData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                            {roleDistributionData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </ChartCard>
            </div>
        </div>
    );
};

export default PlatformAnalytics;