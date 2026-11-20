import React, { useMemo, useState } from 'react';
import { useAppContext } from '../AppContext';
import { Application, ApplicationStatus } from './types';
import { formatCurrency } from '../utils/formatters';
import UnderwritingIcon from '../components/icons/UnderwritingIcon';

const DetailItem: React.FC<{ label: string; value: React.ReactNode; fullWidth?: boolean }> = ({ label, value, fullWidth = false }) => (
    <div className={fullWidth ? 'col-span-2' : ''}>
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <p className="text-lg font-semibold text-gray-800">{value || 'N/A'}</p>
    </div>
);

const Underwriting: React.FC = () => {
    const { applications, selectedApplicationId, setState, handleRunCreditCheck, handleUnderwritingDecision, currentUser } = useAppContext();
    const [notes, setNotes] = useState('');

    const underwritingQueue = useMemo(() => {
        return applications.filter(app => app.status === ApplicationStatus.PENDING_UNDERWRITING || app.status === ApplicationStatus.SUBMITTED);
    }, [applications]);

    const selectedApp = useMemo(() => {
        return applications.find(app => app.id === selectedApplicationId);
    }, [applications, selectedApplicationId]);
    
    React.useEffect(() => {
        if(selectedApp) {
            setNotes(selectedApp.underwritingNotes || '');
        }
    }, [selectedApp]);

    const handleDecision = (decision: 'approved' | 'rejected') => {
        if (!selectedApp) return;
        if (!selectedApp.creditScore) {
            alert('Please run a credit check before making a decision.');
            return;
        }
        if (!notes) {
            alert('Please provide underwriting notes before making a decision.');
            return;
        }
        handleUnderwritingDecision(selectedApp.id, decision, notes);
    };

    return (
        <div className="animate-fade-in h-full flex flex-col">
            <div className="flex items-center space-x-3 mb-6">
                <div className="bg-primary-light p-3 rounded-full text-primary">
                    <UnderwritingIcon />
                </div>
                <h2 className="text-3xl font-bold text-gray-800">Underwriting Workbench</h2>
            </div>

            <div className="flex-grow grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
                <div className="lg:col-span-1 bg-white p-4 rounded-xl shadow-md flex flex-col">
                    <h3 className="text-xl font-semibold text-gray-800 px-2 pb-2 border-b">Application Queue ({underwritingQueue.length})</h3>
                    <ul className="space-y-2 mt-2 overflow-y-auto">
                        {underwritingQueue.map(app => (
                            <li key={app.id}>
                                <button
                                    onClick={() => setState(prev => ({...prev, selectedApplicationId: app.id}))}
                                    className={`w-full text-left p-3 rounded-lg transition-colors ${selectedApplicationId === app.id ? 'bg-primary-light text-primary-dark' : 'hover:bg-gray-100'}`}
                                >
                                    <p className="font-semibold">{app.applicant.name}</p>
                                    <p className="text-sm text-gray-600">{app.type} - {formatCurrency(app.amount)}</p>
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-md overflow-y-auto">
                    {selectedApp ? (
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-2xl font-bold text-gray-800">{selectedApp.applicant.name}</h3>
                                <p className="text-sm font-mono text-gray-500">{selectedApp.id}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-x-6 gap-y-4 p-4 border rounded-lg bg-gray-50">
                                <DetailItem label="Application Type" value={selectedApp.type} />
                                <DetailItem label="Requested Amount" value={formatCurrency(selectedApp.amount)} />
                                <DetailItem label="Applicant PAN" value={selectedApp.applicant.pan} />
                                <DetailItem label="Applicant Phone" value={selectedApp.applicant.phone} />
                            </div>

                            <div className="p-4 border rounded-lg">
                                <h4 className="text-lg font-semibold text-gray-700 mb-3">Credit Bureau Analysis</h4>
                                <div className="flex items-center justify-between">
                                    <p>Credit Score: <span className="font-bold text-2xl text-primary">{selectedApp.creditScore || 'N/A'}</span></p>
                                    <button
                                        onClick={() => handleRunCreditCheck(selectedApp.id)}
                                        disabled={!!selectedApp.creditScore}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
                                    >
                                        {selectedApp.creditScore ? 'Check Complete' : 'Fetch CIBIL Report (Simulate)'}
                                    </button>
                                </div>
                            </div>

                            { currentUser !== 'Auditor' && (
                                <div className="p-4 border rounded-lg">
                                    <h4 className="text-lg font-semibold text-gray-700 mb-3">Underwriting Decision</h4>
                                    <div>
                                        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">Notes / Deviations</label>
                                        <textarea
                                            id="notes"
                                            rows={4}
                                            value={notes}
                                            onChange={e => setNotes(e.target.value)}
                                            className="w-full p-2 border border-gray-300 rounded-md shadow-sm"
                                            placeholder="e.g., Applicant has a stable income but high debt-to-income ratio. Approving with a lower amount..."
                                        />
                                    </div>
                                    <div className="flex justify-end space-x-3 mt-4">
                                        <button
                                            onClick={() => handleDecision('rejected')}
                                            className="px-6 py-2 bg-red-600 text-white font-semibold rounded-lg shadow-sm hover:bg-red-700"
                                        >
                                            Reject Application
                                        </button>
                                        <button
                                            onClick={() => handleDecision('approved')}
                                            className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-sm hover:bg-green-700"
                                        >
                                            Recommend for Approval
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
                           <UnderwritingIcon />
                            <p className="mt-4 font-semibold text-lg">Select an application from the queue</p>
                            <p>Choose an application from the list on the left to begin the underwriting process.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Underwriting;