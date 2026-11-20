import React, { useState, useMemo } from 'react';
import DataTable, { Column } from '../components/DataTable';
import { useAppContext } from '../AppContext';
import type { PaymentOrder } from './types';
import { PaymentOrderStatus } from './types';
import StatusBadge from '../components/StatusBadge';
import { formatCurrency } from '../utils/formatters';
import { NewPaymentOrderModal } from '../components/ActionModals';
import PaymentsHubIcon from '../components/icons/PaymentsHubIcon';
import StatsCard from '../components/StatsCard';
import MoneyIcon from '../components/icons/MoneyIcon';
import ShieldIcon from '../components/icons/ShieldIcon';


const PaymentsHub: React.FC = () => {
    const { paymentOrders, customerAccounts, currentUser } = useAppContext();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const paymentStats = useMemo(() => {
        const totalSent = paymentOrders.filter(p => p.status === PaymentOrderStatus.COMPLETED).reduce((sum, p) => sum + p.amount, 0);
        const pending = paymentOrders.filter(p => p.status === PaymentOrderStatus.PENDING).length;
        const failed = paymentOrders.filter(p => p.status === PaymentOrderStatus.FAILED).length;
        return { totalSent, pending, failed };
    }, [paymentOrders]);

    const getAccountHolder = (accountId: string) => {
        return customerAccounts.find(acc => acc.id === accountId)?.customerName || accountId;
    };

    const columns: Column<PaymentOrder>[] = [
        { header: 'Source', accessor: 'sourceAccountId', render: (row) => getAccountHolder(row.sourceAccountId) },
        { header: 'Destination', accessor: 'destinationAccount' },
        { header: 'Amount', accessor: 'amount', render: (row) => formatCurrency(row.amount) },
        { header: 'Type', accessor: 'paymentType' },
        { header: 'Created At', accessor: 'createdAt', render: (row) => new Date(row.createdAt).toLocaleString() },
        { header: 'Status', accessor: 'status', render: (row) => <StatusBadge status={row.status} /> },
    ];

    return (
        <div className="animate-fade-in space-y-8">
             <div className="flex items-center space-x-3">
                <div className="bg-primary-light p-3 rounded-full text-primary">
                    <PaymentsHubIcon />
                </div>
                <h2 className="text-3xl font-bold text-gray-800">Payments Hub</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatsCard title="Total Sent (Completed)" value={formatCurrency(paymentStats.totalSent)} change="" changeType="none" isChangeGood={true} icon={<MoneyIcon />} color="#10b981" />
                <StatsCard title="Pending Orders" value={paymentStats.pending.toString()} change="" changeType="none" isChangeGood={true} icon={<MoneyIcon />} color="#f97316" />
                <StatsCard title="Failed Orders" value={paymentStats.failed.toString()} change="" changeType="none" isChangeGood={false} icon={<ShieldIcon />} color="#ef4444" />
            </div>

            <DataTable
                columns={columns}
                data={paymentOrders}
                title="High-Value Payment Orders (NEFT/RTGS/IMPS)"
                actionButton={currentUser !== 'Auditor' ? <button onClick={() => setIsModalOpen(true)} className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark">New Payment Order</button> : null}
            />
            <NewPaymentOrderModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
};

export default PaymentsHub;
