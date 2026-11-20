
import React from 'react';
import StatsCard from '../components/StatsCard';
import DataTable, { Column } from '../components/DataTable';
import DataBackupIcon from '../components/icons/DataBackupIcon';
import StatusBadge from '../components/StatusBadge';

interface BackupLog {
    id: string;
    timestamp: string;
    type: 'Automated' | 'Manual';
    size: string;
    status: 'Success' | 'Failed';
}

const DataBackup: React.FC = () => {
    const backupHistory: BackupLog[] = [
        { id: '1', timestamp: '2023-10-28 02:00:00', type: 'Automated', size: '5.2 GB', status: 'Success' },
        { id: '2', timestamp: '2023-10-27 02:00:00', type: 'Automated', size: '5.1 GB', status: 'Success' },
        { id: '3', timestamp: '2023-10-26 11:30:00', type: 'Manual', size: '5.1 GB', status: 'Success' },
        { id: '4', timestamp: '2023-10-26 02:00:00', type: 'Automated', size: '5.0 GB', status: 'Failed' },
        { id: '5', timestamp: '2023-10-25 02:00:00', type: 'Automated', size: '5.0 GB', status: 'Success' },
    ];
    
    const backupColumns: Column<BackupLog>[] = [
        { header: 'Timestamp', accessor: 'timestamp' },
        { header: 'Type', accessor: 'type' },
        { header: 'Size', accessor: 'size' },
        { header: 'Status', accessor: 'status', render: (row) => <StatusBadge status={row.status === 'Success' ? 'Completed' : 'Failed'} /> },
        { header: 'Actions', accessor: 'id', render: (row) => <button disabled className="font-semibold text-gray-400 cursor-not-allowed">Restore</button> },
    ];

    return (
        <div className="animate-fade-in space-y-8">
            <div className="flex items-center space-x-3">
                <div className="bg-primary-light p-3 rounded-full text-primary">
                    <DataBackupIcon />
                </div>
                <h2 className="text-3xl font-bold text-gray-800">Data Backup & Restoration</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatsCard title="Last Backup Status" value="Success" change="28/10/2023 02:00" changeType="none" isChangeGood={true} icon={<DataBackupIcon />} color="#10b981" />
                <StatsCard title="Next Scheduled Backup" value="29/10/2023 02:00" change="" changeType="none" isChangeGood={true} icon={<DataBackupIcon />} color="#3b82f6" />
                <StatsCard title="Total Storage Used" value="150.5 GB" change="+5.2GB" changeType="increase" isChangeGood={true} icon={<DataBackupIcon />} color="#f97316" />
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md">
                 <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold text-gray-800">Manual Backup</h3>
                    <button 
                        onClick={() => alert('Starting a new manual backup...')}
                        className="px-4 py-2 bg-primary text-white font-bold rounded-lg shadow-md hover:bg-primary-dark"
                    >
                        Initiate Full Backup Now
                    </button>
                </div>
            </div>

            <DataTable
                columns={backupColumns}
                data={backupHistory}
                title="Recent Backup History"
            />
        </div>
    );
};

export default DataBackup;
