import React, { useState } from 'react';
import DataTable, { Column } from '../components/DataTable';
import type { PurchaseBill, PurchaseOrder } from './types';
import { InvoiceStatus, OrderStatus } from './types';
import StatusBadge from '../components/StatusBadge';
import { formatCurrency } from '../utils/formatters';
import { useAppContext } from '../AppContext';

const Purchases: React.FC = () => {
  const { purchaseBills, purchaseOrders, currentUser } = useAppContext();
  const [activeTab, setActiveTab] = useState<'bills' | 'orders'>('bills');

  const billColumns: Column<PurchaseBill>[] = [
    { header: 'Bill #', accessor: 'billNumber' },
    { header: 'Supplier Name', accessor: 'partyName' },
    { header: 'Date', accessor: 'date' },
    { header: 'Due Date', accessor: 'dueDate' },
    { header: 'Total Amount', accessor: 'totalAmount', render: (row: PurchaseBill) => formatCurrency(row.totalAmount) },
    { header: 'Balance Due', accessor: 'id', render: (row: PurchaseBill) => formatCurrency(row.totalAmount - row.amountPaid) },
    { header: 'Status', accessor: 'status', render: (row: PurchaseBill) => <StatusBadge status={row.status} /> },
    { header: 'Actions', accessor: 'id', render: (row: PurchaseBill) => <button className="font-semibold text-primary hover:text-primary-dark">View</button> },
  ];

  const orderColumns: Column<PurchaseOrder>[] = [
    { header: 'Order #', accessor: 'poNumber' },
    { header: 'Supplier Name', accessor: 'partyName' },
    { header: 'Date', accessor: 'date' },
    { header: 'Delivery Date', accessor: 'deliveryDate' },
    { header: 'Total Amount', accessor: 'totalAmount', render: (row: PurchaseOrder) => formatCurrency(row.totalAmount) },
    { header: 'Status', accessor: 'status', render: (row: PurchaseOrder) => <StatusBadge status={row.status} /> },
    { header: 'Actions', accessor: 'id', render: (row: PurchaseOrder) => <button className="font-semibold text-primary hover:text-primary-dark">View</button> },
  ];
  
  const TabButton: React.FC<{ view: 'bills' | 'orders', label: string }> = ({ view, label }) => (
    <button onClick={() => setActiveTab(view)} className={`py-3 px-4 font-medium text-sm transition-colors rounded-t-lg ${activeTab === view ? 'border-b-2 border-primary text-primary' : 'text-gray-500 hover:text-gray-700'}`}>
        {label}
    </button>
  );

  return (
    <div className="animate-fade-in">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Purchases</h2>
       <div className="mb-4 border-b border-gray-200">
        <nav className="-mb-px flex space-x-6">
            <TabButton view="bills" label="Purchase Bills" />
            <TabButton view="orders" label="Purchase Orders" />
        </nav>
      </div>
      
      {activeTab === 'bills' && (
        <DataTable
          columns={billColumns}
          data={purchaseBills}
          title="All Purchase Bills"
          actionButton={currentUser !== 'Auditor' ? <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors shadow-sm">Add Bill</button> : null}
        />
      )}
      {activeTab === 'orders' && (
        <DataTable
          columns={orderColumns}
          data={purchaseOrders}
          title="All Purchase Orders"
          actionButton={currentUser !== 'Auditor' ? <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors shadow-sm">Create Purchase Order</button> : null}
        />
      )}
    </div>
  );
};

export default Purchases;