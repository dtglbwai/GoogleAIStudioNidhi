import React, { useState } from 'react';
import DataTable, { Column } from '../components/DataTable';
import { useAppContext } from '../AppContext';
import type { SupportTicket } from './types';
import StatusBadge from '../components/StatusBadge';
import { NewSupportTicketModal } from '../components/ActionModals';
import SupportIcon from '../components/icons/SupportIcon';

const CrmSupport: React.FC = () => {
    const { supportTickets, currentUser } = useAppContext();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const columns: Column<SupportTicket>[] = [
        { header: 'Ticket ID', accessor: 'ticketId' },
        { header: 'Customer', accessor: 'customerName' },
        { header: 'Subject', accessor: 'subject' },
        { header: 'Created At', accessor: 'createdAt' },
        { header: 'Assigned To', accessor: 'assignedTo' },
        { header: 'Status', accessor: 'status', render: (row: SupportTicket) => <StatusBadge status={row.status} /> },
        { header: 'Actions', accessor: 'id', render: (row: SupportTicket) => (
            currentUser !== 'Auditor' ? <button className="font-semibold text-primary hover:text-primary-dark">View</button> : <span className="text-xs text-gray-400">Read-only</span>
        )},
    ];

    return (
        <div className="animate-fade-in">
            <div className="flex items-center space-x-3 mb-6">
                <div className="bg-primary-light p-3 rounded-full text-primary">
                    <SupportIcon />
                </div>
                <h2 className="text-3xl font-bold text-gray-800">CRM Support Services</h2>
            </div>
            
            <DataTable
                columns={columns}
                data={supportTickets}
                title="Customer Support Tickets"
                actionButton={currentUser !== 'Auditor' ? <button onClick={() => setIsModalOpen(true)} className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors shadow-sm">New Support Ticket</button> : null}
            />
            <NewSupportTicketModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
};

export default CrmSupport;