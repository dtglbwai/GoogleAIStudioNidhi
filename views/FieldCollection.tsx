

import React, { useState, useMemo } from 'react';
import { useAppContext } from '../AppContext';
import { formatCurrency } from '../utils/formatters';
import type { Loan, Lease, Customer, Group } from './types';
import FieldCollectionIcon from '../components/icons/FieldCollectionIcon';
import Modal from '../components/Modal';

interface CollectionTask {
    id: string;
    type: 'Loan' | 'Lease';
    customer: Customer;
    overdueAmount: number;
    groupId?: string;
    groupName?: string;
    groupCenter?: string;
}

const RecordCollectionPaymentModal: React.FC<{ 
    isOpen: boolean; 
    onClose: () => void; 
    task: CollectionTask | null;
}> = ({ isOpen, onClose, task }) => {
    const { handleLogCollectionPayment } = useAppContext();
    const [amount, setAmount] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!task || !amount) return;
        handleLogCollectionPayment(task.id, task.type, Number(amount));
        onClose();
        setAmount('');
    };

    const footer = <>
        <button onClick={onClose} className="px-4 py-2 bg-white border border-gray-300 rounded-md">Cancel</button>
        <button type="submit" form="collection-payment-form" className="px-4 py-2 bg-primary text-white rounded-lg">Log Payment</button>
    </>;
    
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Record Payment for ${task?.customer.name}`} footer={footer}>
            <form id="collection-payment-form" onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Amount Collected (₹)</label>
                    <input type="number" id="amount" value={amount} onChange={e => setAmount(e.target.value)} className="mt-1 w-full p-2 border border-gray-300 rounded-md" required />
                </div>
                 <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400">
                    <p className="text-sm text-yellow-700">Total overdue amount for this contract is <strong>{formatCurrency(task?.overdueAmount || 0)}</strong>.</p>
                </div>
            </form>
        </Modal>
    )
}

const FieldCollection: React.FC = () => {
    const { loans, homeLoans, businessLoans, industryLoans, leases, customers, groups } = useAppContext();
    const [selectedTask, setSelectedTask] = useState<CollectionTask | null>(null);

    const groupedTasks = useMemo(() => {
        const agentName = "Priya Singh"; // Hardcoded for simulation
        const allLoans = [...loans, ...homeLoans, ...businessLoans, ...industryLoans];
        
        const overdueLoans = allLoans
            .filter(l => l.fieldAgent === agentName && l.status === 'Overdue')
            .map(l => {
                const customer = customers.find(c => c.id === l.customerId);
                const group = customer?.groupId ? groups.find(g => g.id === customer.groupId) : undefined;
                return {
                    id: l.id,
                    type: 'Loan' as const,
                    customer: customer!,
                    overdueAmount: l.repaymentSchedule.filter(p => p.status === 'Overdue').reduce((sum, p) => sum + p.totalAmount, 0),
                    groupId: group?.id,
                    groupName: group?.name,
                    groupCenter: group?.center
                };
            });

        const overdueLeases = leases
            .filter(l => l.fieldAgent === agentName && l.paymentSchedule.some(p => p.status === 'Overdue'))
            .map(l => {
                const customer = customers.find(c => c.id === l.customerId);
                const group = customer?.groupId ? groups.find(g => g.id === customer.groupId) : undefined;
                return {
                    id: l.id,
                    type: 'Lease' as const,
                    customer: customer!,
                    overdueAmount: l.paymentSchedule.filter(p => p.status === 'Overdue').reduce((sum, p) => sum + p.amount, 0),
                    groupId: group?.id,
                    groupName: group?.name,
                    groupCenter: group?.center
                };
            });
            
        const allTasks = [...overdueLoans, ...overdueLeases].filter(task => task.customer);

        // Group by group/center
        return allTasks.reduce((acc: Record<string, { name: string, center: string, tasks: CollectionTask[] }>, task) => {
            const key = task.groupId || 'Individual';
            if (!acc[key]) {
                acc[key] = {
                    name: task.groupName || 'Individual Collections',
                    center: task.groupCenter || 'N/A',
                    tasks: []
                };
            }
            acc[key].tasks.push(task);
            return acc;
        }, {} as Record<string, { name: string, center: string, tasks: CollectionTask[] }>);

    }, [loans, homeLoans, businessLoans, industryLoans, leases, customers, groups]);
    
    const assignedTasksCount = useMemo(() => Object.values(groupedTasks).reduce((sum: number, group: { tasks: CollectionTask[] }) => sum + group.tasks.length, 0), [groupedTasks]);


    return (
        <div className="animate-fade-in">
            <div className="flex items-center space-x-3 mb-6">
                <div className="bg-primary-light p-3 rounded-full text-primary">
                    <FieldCollectionIcon />
                </div>
                <div>
                    <h2 className="text-3xl font-bold text-gray-800">Field Collection Sheet</h2>
                    <p className="text-gray-600">Daily tasks for agent: Priya Singh</p>
                </div>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-md mb-8">
                <h3 className="font-semibold mb-2">Today's Route</h3>
                <div className="bg-gray-200 h-64 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500">[Simulated Map of Collection Route]</p>
                </div>
            </div>

            <div className="space-y-6">
                <h3 className="font-semibold text-xl text-gray-800">Assigned Collections ({assignedTasksCount})</h3>
                {Object.values(groupedTasks).map((group: { name: string; center: string; tasks: CollectionTask[] }) => (
                    <div key={group.name} className="bg-white p-4 rounded-xl shadow-md">
                        <div className="border-b pb-2 mb-3">
                            <h4 className="font-bold text-lg text-primary">{group.name}</h4>
                            <p className="text-sm text-gray-500">Center: {group.center}</p>
                        </div>
                        {group.tasks.map(task => (
                            <div key={task.id} className="border-t first:border-t-0 py-3">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                                    <div>
                                        <p className="font-bold text-gray-800">{task.customer.name}</p>
                                        <p className="text-sm text-gray-500">{task.customer.address}</p>
                                        <p className="text-xs font-mono text-gray-400">{task.type} ID: {task.id}</p>
                                    </div>
                                    <div className="flex items-center justify-center">
                                        <div>
                                            <p className="text-sm text-gray-500 text-center">Overdue</p>
                                            <p className="text-xl font-bold text-red-600 text-center">{formatCurrency(task.overdueAmount)}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-end space-x-2">
                                        <button onClick={() => alert('Action logged!')} className="px-3 py-2 text-sm font-semibold bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Not Available</button>
                                        <button onClick={() => alert('Action logged!')} className="px-3 py-2 text-sm font-semibold bg-yellow-100 text-yellow-800 rounded-md hover:bg-yellow-200">Follow-up</button>
                                        <button onClick={() => setSelectedTask(task)} className="px-3 py-2 text-sm font-semibold bg-green-600 text-white rounded-md hover:bg-green-700">Payment</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ))}

                {assignedTasksCount === 0 && (
                    <div className="bg-white p-8 rounded-xl shadow-md text-center">
                        <p className="font-semibold text-gray-600">No overdue collections assigned for today. Great job!</p>
                    </div>
                )}
            </div>
            
            <RecordCollectionPaymentModal 
                isOpen={!!selectedTask}
                onClose={() => setSelectedTask(null)}
                task={selectedTask}
            />
        </div>
    );
};

export default FieldCollection;