

import React, { useMemo, useState } from 'react';
import DataTable, { Column } from '../components/DataTable';
import type { Customer, Loan, Lease, Application, InteractionLog } from './types';
import StatusBadge from '../components/StatusBadge';
import { formatCurrency } from '../utils/formatters';
import { useAppContext } from '../AppContext';

const CustomerDetailView: React.FC<{
  customer: Customer;
  onBack: () => void;
}> = ({ customer, onBack }) => {
  const { loans, leases, applications, interactionLogs, handleAddInteractionLog, currentUser, setState, groups } = useAppContext();
  const [activeTab, setActiveTab] = useState<'history' | 'interactions'>('history');
  
  const [newInteraction, setNewInteraction] = useState({ type: 'Call' as 'Call' | 'Email' | 'Meeting', summary: '', sentiment: 'Neutral' as 'Positive' | 'Neutral' | 'Negative' });

  const customerGroup = useMemo(() => {
    return groups.find(g => g.id === customer.groupId);
  }, [customer, groups]);

  const associatedData = useMemo(() => {
    const associatedLoans = loans.filter(l => l.customerId === customer.id);
    const associatedLeases = leases.filter(l => l.customerId === customer.id);
    const associatedApps = applications.filter(a => a.applicant.pan === customer.pan);
    const customerInteractions = interactionLogs.filter(i => i.customerId === customer.id);

    const totalExposure = associatedLoans.reduce((sum, l) => sum + l.principalAmount, 0);
    const totalLeaseValue = associatedLeases.reduce((sum, l) => {
        const app = applications.find(a => a.id === l.applicationId);
        return sum + (app?.amount || 0);
    }, 0);

    const relationshipHealth = Math.min(100, 50 + customerInteractions.filter(i => i.sentiment === 'Positive').length * 10 - customerInteractions.filter(i => i.sentiment === 'Negative').length * 15);

    return {
      loans: associatedLoans,
      leases: associatedLeases,
      applications: associatedApps,
      interactions: customerInteractions,
      totalExposure: totalExposure + totalLeaseValue,
      outstandingBalance: totalExposure, // Simplified for now
      relationshipHealth,
    }
  }, [customer, loans, leases, applications, interactionLogs]);

  const appColumns: Column<Application>[] = [
    { header: 'ID', accessor: 'id', render: (row: Application) => <>{row.id.slice(-6)}</> },
    { header: 'Type', accessor: 'type' },
    { header: 'Amount', accessor: 'amount', render: (row: Application) => formatCurrency(row.amount) },
    { header: 'Status', accessor: 'status', render: (row: Application) => <StatusBadge status={row.status} /> },
  ];

  const handleInteractionSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!newInteraction.summary) return;
      handleAddInteractionLog({
          ...newInteraction,
          customerId: customer.id,
          date: new Date().toISOString().split('T')[0],
      });
      setNewInteraction({ type: 'Call', summary: '', sentiment: 'Neutral' });
  }

  return (
    <div className="animate-fade-in">
        <button onClick={onBack} className="flex items-center text-sm font-semibold text-gray-600 hover:text-gray-900 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            Back to Customer List
        </button>
        <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">{customer.name}</h2>
                    <p className="text-sm font-mono text-gray-500">PAN: {customer.pan}</p>
                    {customerGroup && <p className="text-sm text-blue-600 font-semibold">Group: {customerGroup.name} ({customerGroup.center})</p>}
                     <button
                        onClick={() => {
                            setState(prev => ({ ...prev, selectedCustomerId: customer.id, currentView: 'portal' }));
                        }}
                        className="mt-2 text-sm font-semibold text-primary hover:text-primary-dark"
                    >
                        Login as Customer &rarr;
                    </button>
                </div>
                <StatusBadge status={customer.status} />
            </div>
             <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mt-6 border-t pt-6">
                <div><p className="text-sm text-gray-500">Total Exposure</p><p className="text-lg font-semibold text-gray-800">{formatCurrency(associatedData.totalExposure)}</p></div>
                <div><p className="text-sm text-gray-500">Outstanding Balance</p><p className="text-lg font-semibold text-gray-800">{formatCurrency(associatedData.outstandingBalance)}</p></div>
                <div><p className="text-sm text-gray-500">Active Loans</p><p className="text-lg font-semibold text-gray-800">{associatedData.loans.length}</p></div>
                <div><p className="text-sm text-gray-500">Active Leases</p><p className="text-lg font-semibold text-gray-800">{associatedData.leases.length}</p></div>
                 <div>
                    <p className="text-sm text-gray-500">Relationship Health</p>
                    <div className="flex items-center">
                        <p className="text-lg font-semibold text-gray-800">{associatedData.relationshipHealth}%</p>
                         <div className="w-full bg-gray-200 rounded-full h-2.5 ml-2">
                          <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${associatedData.relationshipHealth}%` }}></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div className="mt-8">
            <div className="mb-4 border-b border-gray-200">
                <nav className="-mb-px flex space-x-6">
                    <button onClick={() => setActiveTab('history')} className={`py-3 px-4 font-medium text-sm transition-colors rounded-t-lg ${activeTab === 'history' ? 'border-b-2 border-primary text-primary' : 'text-gray-500 hover:text-gray-700'}`}>
                        Contract History
                    </button>
                     <button onClick={() => setActiveTab('interactions')} className={`py-3 px-4 font-medium text-sm transition-colors rounded-t-lg ${activeTab === 'interactions' ? 'border-b-2 border-primary text-primary' : 'text-gray-500 hover:text-gray-700'}`}>
                        Interaction Log
                    </button>
                </nav>
            </div>

            {activeTab === 'history' && (
                 <DataTable
                    columns={appColumns}
                    data={associatedData.applications}
                    title="Application & Contract History"
                    itemsPerPage={5}
                />
            )}
            {activeTab === 'interactions' && (
                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-md">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">Interaction Timeline</h3>
                        <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                        {associatedData.interactions.map(log => (
                            <div key={log.id} className="p-3 bg-gray-50 rounded-lg">
                                <div className="flex justify-between items-center">
                                    <p className="font-semibold text-sm text-gray-700">{log.type} on {log.date}</p>
                                    <span className={`text-xs font-bold ${log.sentiment === 'Positive' ? 'text-green-600' : log.sentiment === 'Negative' ? 'text-red-600' : 'text-gray-500'}`}>{log.sentiment}</span>
                                </div>
                                <p className="text-sm text-gray-600 mt-1">{log.summary}</p>
                                <p className="text-xs text-gray-400 text-right mt-2">Logged by: {log.loggedBy}</p>
                            </div>
                        ))}
                        </div>
                    </div>
                    {currentUser !== 'Auditor' && (
                    <div className="bg-white p-6 rounded-xl shadow-md">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">Log New Interaction</h3>
                        <form onSubmit={handleInteractionSubmit} className="space-y-4">
                             <div>
                                <label className="block text-sm font-medium text-gray-700">Type</label>
                                <select value={newInteraction.type} onChange={e => setNewInteraction({...newInteraction, type: e.target.value as any})} className="mt-1 w-full p-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm">
                                    <option>Call</option><option>Email</option><option>Meeting</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Summary</label>
                                <textarea value={newInteraction.summary} onChange={e => setNewInteraction({...newInteraction, summary: e.target.value})} rows={4} className="mt-1 w-full p-2 border border-gray-300 rounded-md shadow-sm text-sm" required></textarea>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Sentiment</label>
                                 <select value={newInteraction.sentiment} onChange={e => setNewInteraction({...newInteraction, sentiment: e.target.value as any})} className="mt-1 w-full p-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm">
                                    <option>Positive</option><option>Neutral</option><option>Negative</option>
                                </select>
                            </div>
                            <button type="submit" className="w-full py-2 px-4 bg-primary text-white font-semibold rounded-lg shadow-sm hover:bg-primary-dark">Add Log</button>
                        </form>
                    </div>
                    )}
                </div>
            )}
        </div>
    </div>
  );
};

const CRM: React.FC = () => {
    const { customers, selectedCustomerId, setState } = useAppContext();
    
    const setSelectedCustomerId = (id: string | null) => {
        setState(prev => ({...prev, selectedCustomerId: id}));
    };

    const selectedCustomer = customers.find(a => a.id === selectedCustomerId);

    if (selectedCustomer) {
        return <CustomerDetailView customer={selectedCustomer} onBack={() => setSelectedCustomerId(null)} />;
    }

    const columns: Column<Customer>[] = [
        { header: 'Customer Name', accessor: 'name' },
        { header: 'Type', accessor: 'type' },
        { header: 'PAN', accessor: 'pan' },
        { header: 'Status', accessor: 'status', render: (row: Customer) => <StatusBadge status={row.status} /> },
        { header: 'Actions', accessor: 'id', render: (row: Customer) => <button onClick={() => setSelectedCustomerId(row.id)} className="font-semibold text-primary hover:text-primary-dark">View Details</button> },
    ];

    return (
        <div className="animate-fade-in">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Customer Relationship Management</h2>
            <DataTable
                columns={columns}
                data={customers}
                title="All Customers"
            />
        </div>
    );
};

export default CRM;