import React from 'react';
import DataTable, { Column } from '../components/DataTable';
import { useAppContext } from '../AppContext';
import type { CustomerAccount } from './types';
import { formatCurrency } from '../utils/formatters';
import StatusBadge from '../components/StatusBadge';
import CoreBankingIcon from '../components/icons/CoreBankingIcon';

const CustomerAccounts: React.FC = () => {
    const { customerAccounts, currentUser } = useAppContext();

    const columns: Column<CustomerAccount>[] = [
        { header: 'Account Number', accessor: 'accountNumber', render: (row) => <span className="font-mono text-sm">{row.accountNumber}</span> },
        { header: 'Customer Name', accessor: 'customerName' },
        { header: 'Account Type', accessor: 'accountType' },
        { header: 'Balance', accessor: 'balance', render: (row) => formatCurrency(row.balance) },
        { header: 'Open Date', accessor: 'openDate' },
        { header: 'Status', accessor: 'status', render: (row) => <StatusBadge status={row.status as any} /> },
        { header: 'Actions', accessor: 'id', render: (row) => <button className="font-semibold text-primary hover:text-primary-dark">View Details</button> },
    ];

    return (
        <div className="animate-fade-in">
            <div className="flex items-center space-x-3 mb-6">
                <div className="bg-primary-light p-3 rounded-full text-primary">
                    <CoreBankingIcon />
                </div>
                <h2 className="text-3xl font-bold text-gray-800">Customer Accounts</h2>
            </div>
            <DataTable
                columns={columns}
                data={customerAccounts}
                title="All Customer Deposit Accounts"
                actionButton={currentUser !== 'Auditor' ? <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark">Create New Account</button> : null}
            />
        </div>
    );
};

export default CustomerAccounts;