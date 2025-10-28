import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import StatsCard from '../components/StatsCard';
import { useBranding } from '../BrandingContext';
import MoneyIcon from '../components/icons/MoneyIcon';
import UserIcon from '../components/icons/UserIcon';
import FileIcon from '../components/icons/FileIcon';
import CarIcon from '../components/icons/CarIcon';

const chartData = [
  { name: 'Jan', Loans: 4000, Leases: 2400 },
  { name: 'Feb', Loans: 3000, Leases: 1398 },
  { name: 'Mar', Loans: 2000, Leases: 9800 },
  { name: 'Apr', Loans: 2780, Leases: 3908 },
  { name: 'May', Loans: 1890, Leases: 4800 },
  { name: 'Jun', Loans: 2390, Leases: 3800 },
  { name: 'Jul', Loans: 3490, Leases: 4300 },
];

const Dashboard: React.FC = () => {
  const { primaryColor } = useBranding();
  
  return (
    <div className="animate-fade-in">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Dashboard Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard title="Total Disbursed" value="₹1.2 Cr" change="12.5%" changeType="increase" icon={<MoneyIcon/>} color={primaryColor} />
        <StatsCard title="Active Customers" value="842" change="2.1%" changeType="increase" icon={<UserIcon />} color="#10b981" />
        <StatsCard title="Pending Applications" value="48" change="5.3%" changeType="decrease" icon={<FileIcon />} color="#f97316" />
        <StatsCard title="Active Leases" value="127" change="8.0%" changeType="increase" icon={<CarIcon/>} color="#8b5cf6" />
      </div>

      <div className="mt-8 bg-white p-6 rounded-xl shadow-md">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Monthly Activity</h3>
        <div style={{ width: '100%', height: 400 }}>
            <ResponsiveContainer>
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #ddd', borderRadius: '8px' }} />
                    <Legend />
                    <Bar dataKey="Loans" fill={primaryColor} name="Money Lending (in ₹ Lakhs)" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Leases" fill="#8b5cf6" name="Auto Leases (Units)" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;