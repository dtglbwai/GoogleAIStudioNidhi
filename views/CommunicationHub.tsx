import React, { useState, useMemo } from 'react';
import DataTable, { Column } from '../components/DataTable';
import { useAppContext } from '../AppContext';
import type { CommunicationLog } from './types';
import { CommunicationStatus } from './types';
import StatusBadge from '../components/StatusBadge';
import CommunicationIcon from '../components/icons/CommunicationIcon';

const CommunicationHub: React.FC = () => {
    const { communicationLogs } = useAppContext();
    const [filter, setFilter] = useState<'All' | 'Email' | 'SMS'>('All');

    const filteredLogs = useMemo(() => {
        if (filter === 'All') return communicationLogs;
        return communicationLogs.filter(log => log.channel === filter);
    }, [communicationLogs, filter]);
    
    const columns: Column<CommunicationLog>[] = [
        { header: 'Timestamp', accessor: 'timestamp', render: (row) => new Date(row.timestamp).toLocaleString() },
        { header: 'Customer', accessor: 'customerName' },
        { header: 'Channel', accessor: 'channel' },
        { header: 'Event', accessor: 'event' },
        { header: 'Content', accessor: 'content', render: (row) => <p className="text-xs truncate max-w-sm">{row.content}</p> },
        { header: 'Status', accessor: 'status', render: (row) => <StatusBadge status={row.status as any} /> },
    ];

    const FilterButton: React.FC<{ type: 'All' | 'Email' | 'SMS'; count: number }> = ({ type, count }) => (
        <button 
            onClick={() => setFilter(type)}
            className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${filter === type ? 'bg-primary text-white shadow' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
        >
            {type} <span className="ml-2 bg-gray-200 text-gray-700 text-xs px-2 py-0.5 rounded-full">{count}</span>
        </button>
    );

    return (
        <div className="animate-fade-in">
            <div className="flex items-center space-x-3 mb-6">
                <div className="bg-primary-light p-3 rounded-full text-primary">
                    <CommunicationIcon />
                </div>
                <h2 className="text-3xl font-bold text-gray-800">Communication Hub</h2>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-md mb-8">
                <div className="flex items-center space-x-2">
                    <FilterButton type="All" count={communicationLogs.length} />
                    <FilterButton type="Email" count={communicationLogs.filter(l => l.channel === 'Email').length} />
                    <FilterButton type="SMS" count={communicationLogs.filter(l => l.channel === 'SMS').length} />
                </div>
            </div>

            <DataTable
                columns={columns}
                data={filteredLogs}
                title="Automated Communication Log"
            />
        </div>
    );
};

export default CommunicationHub;
