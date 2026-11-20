import React, { useState } from 'react';
import DataTable, { Column } from '../components/DataTable';
import { useAppContext } from '../AppContext';
import type { Card } from './types';
import StatusBadge from '../components/StatusBadge';
import { IssueCardModal } from '../components/ActionModals';
import CardIcon from '../components/icons/CardIcon';

const CardsManagement: React.FC = () => {
    const { cards, currentUser } = useAppContext();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const maskCardNumber = (num: string) => `**** **** **** ${num.slice(-4)}`;

    const columns: Column<Card>[] = [
        { header: 'Card Number', accessor: 'cardNumber', render: (row) => <span className="font-mono">{maskCardNumber(row.cardNumber)}</span> },
        { header: 'Card Holder', accessor: 'cardHolderName' },
        { header: 'Type', accessor: 'cardType' },
        { header: 'Network', accessor: 'network' },
        { header: 'Expires', accessor: 'expiryDate' },
        { header: 'Status', accessor: 'status', render: (row) => <StatusBadge status={row.status} /> },
        { header: 'Actions', accessor: 'id', render: (row) => (
            currentUser !== 'Auditor' && row.status === 'Active' ? 
            <button className="font-semibold text-red-600 hover:text-red-800">Block Card</button> :
            <span className="text-xs text-gray-400">No actions</span>
        )},
    ];

    return (
        <div className="animate-fade-in">
            <div className="flex items-center space-x-3 mb-6">
                <div className="bg-primary-light p-3 rounded-full text-primary">
                    <CardIcon />
                </div>
                <h2 className="text-3xl font-bold text-gray-800">Cards Management</h2>
            </div>
            <DataTable
                columns={columns}
                data={cards}
                title="Issued Customer Cards"
                actionButton={currentUser !== 'Auditor' ? <button onClick={() => setIsModalOpen(true)} className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark">Issue New Card</button> : null}
            />
            <IssueCardModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
};

export default CardsManagement;
