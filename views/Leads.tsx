import React, { useState } from 'react';
import DataTable, { Column } from '../components/DataTable';
import type { Lead } from './types';
import { LeadStatus } from './types';
import { useAppContext } from '../AppContext';
import StatusBadge from '../components/StatusBadge';
import { NewLeadModal } from '../components/ActionModals';
import SalesIcon from '../components/icons/SalesIcon';

const Leads: React.FC = () => {
    const { leads, handleConvertLeadToApplication, currentUser } = useAppContext();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const columns: Column<Lead>[] = [
        { header: 'Name', accessor: 'name' },
        { header: 'Contact', accessor: 'phone' },
        { header: 'Product Interest', accessor: 'productInterest' },
        { header: 'Source', accessor: 'source' },
        { header: 'Assigned To', accessor: 'assignedTo' },
        { header: 'Status', accessor: 'status', render: (row: Lead) => <StatusBadge status={row.status as any} /> },
        { header: 'Actions', accessor: 'id', render: (row: Lead) => {
            if (row.status === LeadStatus.QUALIFIED) {
                return <button onClick={() => handleConvertLeadToApplication(row.id)} className="font-semibold text-primary hover:text-primary-dark">Convert to Application</button>
            }
            return <span className="text-xs text-gray-400">Update Status</span>;
        }},
    ];

    return (
        <div className="animate-fade-in">
            <div className="flex items-center space-x-3 mb-6">
                <div className="bg-primary-light p-3 rounded-full text-primary">
                    <SalesIcon />
                </div>
                <h2 className="text-3xl font-bold text-gray-800">Lead Management</h2>
            </div>
            <DataTable
                columns={columns}
                data={leads}
                title="All Sales Leads"
                actionButton={currentUser === 'Sales' || currentUser === 'Super Admin' ? <button onClick={() => setIsModalOpen(true)} className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark">Add New Lead</button> : null}
            />
            <NewLeadModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
};

export default Leads;