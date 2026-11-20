import React, { useState } from 'react';

const EodBodOperations: React.FC = () => {
    const [eodStatus, setEodStatus] = useState({ running: false, lastRun: '2023-10-26 22:00:15', lastStatus: 'Success' });
    const [bodStatus, setBodStatus] = useState({ running: false, lastRun: '2023-10-27 06:00:05', lastStatus: 'Success' });

    const handleRunEOD = () => {
        setEodStatus(prev => ({ ...prev, running: true }));
        setTimeout(() => {
            setEodStatus({ running: false, lastRun: new Date().toLocaleString(), lastStatus: 'Success' });
        }, 3000);
    };

    const handleRunBOD = () => {
        setBodStatus(prev => ({ ...prev, running: true }));
        setTimeout(() => {
            setBodStatus({ running: false, lastRun: new Date().toLocaleString(), lastStatus: 'Success' });
        }, 2000);
    };

    return (
        <div className="animate-fade-in">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">EOD/BOD Operations</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-xl shadow-md">
                    <h3 className="text-xl font-semibold text-gray-800">End of Day (EOD) Process</h3>
                    <p className="text-sm text-gray-500 mt-2">This process closes the business day, posts accruals, and generates reports. Run this after all transactions for the day are complete.</p>
                    <div className="mt-4 text-sm">
                        <p><strong>Last Run:</strong> {eodStatus.lastRun}</p>
                        <p><strong>Status:</strong> <span className={`font-semibold ${eodStatus.lastStatus === 'Success' ? 'text-green-600' : 'text-red-600'}`}>{eodStatus.lastStatus}</span></p>
                    </div>
                    <button onClick={handleRunEOD} disabled={eodStatus.running} className="mt-6 w-full py-2 px-4 bg-red-600 text-white font-bold rounded-lg shadow-md hover:bg-red-700 disabled:bg-gray-400">
                        {eodStatus.running ? 'Running EOD...' : 'Run EOD Process'}
                    </button>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-md">
                    <h3 className="text-xl font-semibold text-gray-800">Beginning of Day (BOD) Process</h3>
                    <p className="text-sm text-gray-500 mt-2">This process prepares the system for the new business day. Run this before starting any transactions for the day.</p>
                     <div className="mt-4 text-sm">
                        <p><strong>Last Run:</strong> {bodStatus.lastRun}</p>
                        <p><strong>Status:</strong> <span className={`font-semibold ${bodStatus.lastStatus === 'Success' ? 'text-green-600' : 'text-red-600'}`}>{bodStatus.lastStatus}</span></p>
                    </div>
                    <button onClick={handleRunBOD} disabled={bodStatus.running} className="mt-6 w-full py-2 px-4 bg-green-600 text-white font-bold rounded-lg shadow-md hover:bg-green-700 disabled:bg-gray-400">
                        {bodStatus.running ? 'Running BOD...' : 'Run BOD Process'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EodBodOperations;