
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import StatsCard from '../components/StatsCard';
import DataTable, { Column } from '../components/DataTable';
import ITMSIcon from '../components/icons/ITMSIcon';
import StatusBadge from '../components/StatusBadge';

type ServiceStatus = 'Operational' | 'Degraded Performance' | 'Outage';

interface MonitoredService {
    id: string;
    name: string;
    status: ServiceStatus;
    avgResponse: number; // in ms
}

const ITMS: React.FC = () => {
    const services: MonitoredService[] = [
        { id: '1', name: 'Core Banking API', status: 'Operational', avgResponse: 120 },
        { id: '2', name: 'Loan Origination Service', status: 'Operational', avgResponse: 250 },
        { id: '3', name: 'Authentication Service', status: 'Operational', avgResponse: 80 },
        { id: '4', name: 'Document Management API', status: 'Degraded Performance', avgResponse: 850 },
        { id: '5', name: 'Reporting Service', status: 'Outage', avgResponse: 0 },
    ];
    
    const apiData = [
        { time: '13:00', requests: 1200 }, { time: '13:05', requests: 1500 },
        { time: '13:10', requests: 1400 }, { time: '13:15', requests: 1800 },
        { time: '13:20', requests: 1700 }, { time: '13:25', requests: 2100 },
    ];

    const serviceColumns: Column<MonitoredService>[] = [
        { header: 'Service Name', accessor: 'name' },
        { header: 'Status', accessor: 'status', render: (row) => {
            const statusMap: Record<ServiceStatus, any> = {
                'Operational': 'Completed',
                'Degraded Performance': 'Pending',
                'Outage': 'Failed',
            };
            return <StatusBadge status={statusMap[row.status]} />
        }},
        { header: 'Avg. Response (ms)', accessor: 'avgResponse' },
    ];

    return (
        <div className="animate-fade-in space-y-8">
            <div className="flex items-center space-x-3">
                <div className="bg-primary-light p-3 rounded-full text-primary">
                    <ITMSIcon />
                </div>
                <h2 className="text-3xl font-bold text-gray-800">Infrastructure Technology Management</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard title="API Status" value="Healthy" change="" changeType="none" isChangeGood={true} icon={<ITMSIcon />} color="#10b981" />
                <StatsCard title="Server Uptime" value="99.99%" change="" changeType="none" isChangeGood={true} icon={<ITMSIcon />} color="#3b82f6" />
                <StatsCard title="Avg. Response Time" value="180 ms" change="+5ms" changeType="increase" isChangeGood={false} icon={<ITMSIcon />} color="#f97316" />
                <StatsCard title="Database Status" value="Connected" change="" changeType="none" isChangeGood={true} icon={<ITMSIcon />} color="#10b981" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                <div className="lg:col-span-3">
                    <DataTable
                        columns={serviceColumns}
                        data={services}
                        title="Monitored Services Status"
                    />
                </div>
                 <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-md">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">API Requests per Minute</h3>
                    <div style={{ height: 250 }}>
                        <ResponsiveContainer>
                            <LineChart data={apiData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="time" />
                                <YAxis />
                                <Tooltip />
                                <Line type="monotone" dataKey="requests" stroke="#0284c7" strokeWidth={2} dot={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ITMS;
