import React, { useState, useMemo } from 'react';
import DataTable, { Column } from '../components/DataTable';
import type { Employee, DevelopmentGoal } from './types';
import { useAppContext } from '../AppContext';
import StatusBadge from '../components/StatusBadge';
import { NewEmployeeModal } from '../components/ActionModals';

const EmployeeDetailView: React.FC<{ employee: Employee, onBack: () => void }> = ({ employee, onBack }) => {
    const { developmentGoals, handleAddDevelopmentGoal, currentUser } = useAppContext();
    const [newGoal, setNewGoal] = useState({ title: '', description: '', deadline: '' });

    const employeeGoals = useMemo(() => {
        return developmentGoals.filter(g => g.employeeId === employee.id);
    }, [developmentGoals, employee.id]);

    const handleGoalSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(!newGoal.title || !newGoal.description || !newGoal.deadline) return;
        handleAddDevelopmentGoal({
            ...newGoal,
            employeeId: employee.id,
            status: 'Not Started',
        });
        setNewGoal({ title: '', description: '', deadline: '' });
    };

    return (
        <div className="animate-fade-in">
             <button onClick={onBack} className="flex items-center text-sm font-semibold text-gray-600 hover:text-gray-900 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                Back to Employee List
            </button>
            <div className="bg-white p-6 rounded-xl shadow-md mb-8">
                 <div className="flex justify-between items-start">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">{employee.name}</h2>
                        <p className="text-gray-600">{employee.role}, {employee.department}</p>
                        <p className="text-sm font-mono text-gray-500 mt-1">Employee ID: {employee.employeeId}</p>
                    </div>
                    <StatusBadge status={employee.status as any} />
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Personal Development Plan</h3>
                <div className="space-y-4">
                    {employeeGoals.map(goal => (
                        <div key={goal.id} className="p-4 bg-gray-50 rounded-lg border">
                             <div className="flex justify-between items-start">
                                <p className="font-semibold text-gray-800">{goal.title}</p>
                                <StatusBadge status={goal.status as any} />
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{goal.description}</p>
                            <p className="text-xs text-gray-500 mt-2">Deadline: {goal.deadline}</p>
                        </div>
                    ))}
                    {employeeGoals.length === 0 && <p className="text-sm text-gray-500">No development goals set yet.</p>}
                </div>
                {currentUser !== 'Auditor' && (
                    <form onSubmit={handleGoalSubmit} className="mt-6 pt-4 border-t">
                        <h4 className="font-semibold text-gray-700 mb-2">Add New Goal</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                            <input value={newGoal.title} onChange={e => setNewGoal({...newGoal, title: e.target.value})} placeholder="Goal Title" className="p-2 border rounded-md" required />
                            <input value={newGoal.description} onChange={e => setNewGoal({...newGoal, description: e.target.value})} placeholder="Brief Description" className="p-2 border rounded-md" required />
                            <input type="date" value={newGoal.deadline} onChange={e => setNewGoal({...newGoal, deadline: e.target.value})} className="p-2 border rounded-md" required />
                            <button type="submit" className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark">Set Goal</button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

const HRMS: React.FC = () => {
    const { employees, currentUser, selectedEmployeeId, setState } = useAppContext();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const setSelectedEmployeeId = (id: string | null) => {
        setState(prev => ({ ...prev, selectedEmployeeId: id }));
    };

    const selectedEmployee = useMemo(() => {
        return employees.find(e => e.id === selectedEmployeeId);
    }, [employees, selectedEmployeeId]);


    if (selectedEmployee) {
        return <EmployeeDetailView employee={selectedEmployee} onBack={() => setSelectedEmployeeId(null)} />
    }

    const columns: Column<Employee>[] = [
        { header: 'Employee ID', accessor: 'employeeId' },
        { header: 'Name', accessor: 'name' },
        { header: 'Role', accessor: 'role' },
        { header: 'Department', accessor: 'department' },
        { header: 'Joining Date', accessor: 'joiningDate' },
        { header: 'Status', accessor: 'status', render: (row: Employee) => <StatusBadge status={row.status as any} /> },
        { header: 'Actions', accessor: 'id', render: (row: Employee) => (
            <button onClick={() => setSelectedEmployeeId(row.id)} className="font-semibold text-primary hover:text-primary-dark">View Profile</button>
        )},
    ];

    return (
        <div className="animate-fade-in">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Human Resource Management</h2>
            <DataTable
                columns={columns}
                data={employees}
                title="All Employees"
                actionButton={currentUser !== 'Auditor' ? <button onClick={() => setIsModalOpen(true)} className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors shadow-sm">Add New Employee</button> : null}
            />
            <NewEmployeeModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
};

export default HRMS;