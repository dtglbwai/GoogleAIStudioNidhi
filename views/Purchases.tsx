import React, { useState } from 'react';
import DataTable from '../components/DataTable';
import type { PurchaseBill, PurchaseOrder } from '../types';
import { InvoiceStatus, OrderStatus } from '../types';
import StatusBadge from '../components/StatusBadge';
import { formatCurrency } from '../utils/formatters';

const mockBills: PurchaseBill[] = [
  { id: 'bill-1', billNumber: 'B-7890', partyId: 's-1', partyName: 'Raw Materials Co.', date: '2023-06-08', dueDate: '2023-07-08', lineItems: [], totalAmount: 250000, amountPaid: 250000, status: InvoiceStatus.PAID },
  { id: 'bill-2', billNumber: 'B-7891', partyId: 's-2', partyName: 'Office Supplies Inc.', date: '2023-06-12', dueDate: '2023-07-12', lineItems: [], totalAmount: 35000, amountPaid: 0, status: InvoiceStatus.UNPAID },
  { id: 'bill-3', billNumber: 'B-7892', partyId: 's-1', partyName: 'Raw Materials Co.', date: '2023-06-14', dueDate: '2023-07-14', lineItems: [], totalAmount: 180000, amountPaid: 100000, status: InvoiceStatus.PARTIALLY_PAID },
];

const mockOrders: PurchaseOrder[] = [
    { id: 'po-1', poNumber: 'PO-101', partyId: 's-1', partyName: 'Raw Materials Co.', date: '2023-06-01', deliveryDate: '2023-06-15', lineItems: [], totalAmount: 300000, status: OrderStatus.CLOSED },
    { id: 'po-2', poNumber: 'PO-102', partyId: 's-3', partyName: 'Machine Parts LLC', date: '2023-06-10', deliveryDate: '2023-06-25', lineItems: [], totalAmount: 750000, status: OrderStatus.OPEN },
];

const Purchases: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'bills' | 'orders'>('bills');

  const billColumns = [
    { header: 'Bill #', accessor: 'billNumber' as keyof PurchaseBill },
    { header: 'Supplier Name', accessor: 'partyName' as keyof PurchaseBill },
    { header: 'Date', accessor: 'date' as keyof PurchaseBill },
    { header: 'Due Date', accessor: 'dueDate' as keyof PurchaseBill },
    { header: 'Total Amount', accessor: 'totalAmount' as keyof PurchaseBill, render: (row: PurchaseBill) => formatCurrency(row.totalAmount) },
    { header: 'Balance Due', accessor: 'id' as keyof PurchaseBill, render: (row: PurchaseBill) => formatCurrency(row.totalAmount - row.amountPaid) },
    { header: 'Status', accessor: 'status' as keyof PurchaseBill, render: (row: PurchaseBill) => <StatusBadge status={row.status} /> },
    { header: 'Actions', accessor: 'id' as keyof PurchaseBill, render: (row: PurchaseBill) => <button className="font-semibold text-primary hover:text-primary-dark">View</button> },
  ];

  const orderColumns = [
    { header: 'Order #', accessor: 'poNumber' as keyof PurchaseOrder },
    { header: 'Supplier Name', accessor: 'partyName' as keyof PurchaseOrder },
    { header: 'Date', accessor: 'date' as keyof PurchaseOrder },
    { header: 'Delivery Date', accessor: 'deliveryDate' as keyof PurchaseOrder },
    { header: 'Total Amount', accessor: 'totalAmount' as keyof PurchaseOrder, render: (row: PurchaseOrder) => formatCurrency(row.totalAmount) },
    { header: 'Status', accessor: 'status' as keyof PurchaseOrder, render: (row: PurchaseOrder) => <StatusBadge status={row.status} /> },
    { header: 'Actions', accessor: 'id' as keyof PurchaseOrder, render: (row: PurchaseOrder) => <button className="font-semibold text-primary hover:text-primary-dark">View</button> },
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
          data={mockBills}
          title="All Purchase Bills"
          actionButton={<button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors shadow-sm">Add Bill</button>}
        />
      )}
      {activeTab === 'orders' && (
        <DataTable
          columns={orderColumns}
          data={mockOrders}
          title="All Purchase Orders"
          actionButton={<button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors shadow-sm">Create Purchase Order</button>}
        />
      )}
    </div>
  );
};

export default Purchases;
