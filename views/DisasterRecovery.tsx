
import React from 'react';
import StatsCard from '../components/StatsCard';
import DisasterRecoveryIcon from '../components/icons/DisasterRecoveryIcon';
import StatusBadge from '../components/StatusBadge';

const DisasterRecovery: React.FC = () => {
    
    const replicationStatus = [
        { id: '1', service: 'Primary Database (PostgreSQL)', status: 'In Sync', lastSync: '2 seconds ago' },
        { id: '2', service: 'Document Store (MinIO)', status: 'In Sync', lastSync: '5 seconds ago' },
        { id: '3', service: 'Configuration Database (Redis)', status: 'Lagging', lastSync: '2 minutes ago' },
    ];

    return (
        <div className="animate-fade-in space-y-8">
            <div className="flex items-center space-x-3">
                <div className="bg-primary-light p-3 rounded-full text-primary">
                    <DisasterRecoveryIcon />
                </div>
                <h2 className="text-3xl font-bold text-gray-800">Disaster Recovery & Business Continuity</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatsCard title="RPO (Recovery Point)" value="< 5 mins" change="On Target" changeType="none" isChangeGood={true} icon={<DisasterRecoveryIcon />} color="#10b981" />
                <StatsCard title="RTO (Recovery Time)" value="< 4 hours" change="On Target" changeType="none" isChangeGood={true} icon={<DisasterRecoveryIcon />} color="#10b981" />
                <StatsCard title="Last DR Drill" value="2023-Q2" change="Success" changeType="none" isChangeGood={true} icon={<DisasterRecoveryIcon />} color="#3b82f6" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-xl shadow-md">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Failover Status</h3>
                    <div className="space-y-4">
                        <div className="p-4 bg-green-50 border-l-4 border-green-500 rounded-r-lg">
                            <p className="font-bold text-green-800">Primary Site (Mumbai DC)</p>
                            <p className="text-sm text-green-700">Status: Active & Serving Traffic</p>
                        </div>
                         <div className="p-4 bg-gray-50 border-l-4 border-gray-400 rounded-r-lg">
                            <p className="font-bold text-gray-800">Secondary Site (Chennai DC)</p>
                            <p className="text-sm text-gray-700">Status: Standby & In Sync</p>
                        </div>
                    </div>
                    <button 
                        onClick={() => alert('Warning: This is a simulation. In a real scenario, this would initiate a failover drill.')}
                        className="mt-6 w-full py-2 px-4 bg-yellow-500 text-white font-bold rounded-lg shadow-md hover:bg-yellow-600"
                    >
                        Initiate DR Drill (Simulate)
                    </button>
                </div>
                 <div className="bg-white p-6 rounded-xl shadow-md">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Replication Status</h3>
                    <div className="space-y-2">
                        {replicationStatus.map(item => (
                            <div key={item.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                                <div>
                                    <p className="font-semibold text-gray-700">{item.service}</p>
                                    <p className="text-xs text-gray-500">Last Sync: {item.lastSync}</p>
                                </div>
                                <StatusBadge status={item.status === 'In Sync' ? 'Completed' : 'Pending'} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DisasterRecovery;
