
import React, { useState, useMemo } from 'react';
import { useAppContext } from '../AppContext';
import DataTable, { Column } from '../components/DataTable';
import { TdsPayable, TdsReceivable } from './types';
import { formatCurrency } from '../utils/formatters';
import TdsIcon from '../components/icons/TdsIcon';
import StatusBadge from '../components/StatusBadge';

const TDS: React.FC = () => {
    const { tdsPayables, tdsReceivables, currentUser } = useAppContext();
    const [activeTab, setActiveTab] = useState<'payable' | 'receivable'>('payable');

    const payableColumns: Column<TdsPayable>[] = [
        { header: 'Payment Date', accessor: 'paymentDate' },
        { header: 'Payee Name', accessor: 'payeeName' },
        { header: 'PAN', accessor: 'pan', render: (row) => <span className="font-mono">{row.pan}</span> },
        { header: 'Amount Paid', accessor: 'amountPaid', render: (row) => formatCurrency(row.amountPaid) },
        { header: 'TDS Amount', accessor: 'tdsAmount', render: (row) => formatCurrency(row.tdsAmount) },
        { header: 'Section', accessor: 'section' },
        { header: 'Status', accessor: 'status', render: (row) => <StatusBadge status={row.status as any} /> },
    ];

    const receivableColumns: Column<TdsReceivable>[] = [
        { header: 'Received Date', accessor: 'receivedDate' },
        { header: 'Payer Name', accessor: 'payerName' },
        { header: 'Gross Amount', accessor: 'grossAmount', render: (row) => formatCurrency(row.grossAmount) },
        { header: 'TDS Deducted', accessor: 'tdsDeducted', render: (row) => formatCurrency(row.tdsDeducted) },
        { header: 'Form 16A', accessor: 'form16AStatus', render: (row) => <StatusBadge status={row.form16AStatus as any} /> },
    ];
    
    const TabButton: React.FC<{ view: 'payable' | 'receivable'; label: string }> = ({ view, label }) => (
        <button onClick={() => setActiveTab(view)} className={`py-3 px-4 font-medium text-sm transition-colors rounded-t-lg ${activeTab === view ? 'border-b-2 border-primary text-primary' : 'text-gray-500 hover:text-gray-700'}`}>
            {label}
        </button>
    );

    return (
        <div className="animate-fade-in">
             <div className="flex items-center space-x-3 mb-6">
                <div className="bg-primary-light p-3 rounded-full text-primary">
                    <TdsIcon />
                </div>
                <h2 className="text-3xl font-bold text-gray-800">TDS Compliance</h2>
            </div>

            <div className="mb-4 border-b border-gray-200">
                <nav className="-mb-px flex space-x-6">
                    <TabButton view="payable" label="TDS Payable (Deducted by Us)" />
                    <TabButton view="receivable" label="TDS Receivable (Deducted from our Income)" />
                </nav>
            </div>

            {activeTab === 'payable' && (
                 <DataTable
                    columns={payableColumns}
                    data={tdsPayables}
                    title="TDS Deducted on Payments"
                    actionButton={currentUser !== 'Auditor' ? <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark">Record TDS Payment</button> : null}
                />
            )}

            {activeTab === 'receivable' && (
                 <DataTable
                    columns={receivableColumns}
                    data={tdsReceivables}
                    title="TDS on Our Receivables"
                />
            )}
        </div>
    );
};

export default TDS;
