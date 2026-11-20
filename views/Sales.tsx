import React, { useState } from 'react';
import DataTable, { Column } from '../components/DataTable';
import type { SalesInvoice, Quotation } from './types';
import { InvoiceStatus } from './types';
import StatusBadge from '../components/StatusBadge';
import { formatCurrency } from '../utils/formatters';
import { useAppContext } from '../AppContext';

const Sales: React.FC = () => {
  const { salesInvoices, quotations, currentUser } = useAppContext();
  const [activeTab, setActiveTab] = useState<'invoices' | 'quotations'>('invoices');

  const invoiceColumns: Column<SalesInvoice>[] = [
    { header: 'Invoice #', accessor: 'invoiceNumber' },
    { header: 'Party Name', accessor: 'partyName' },
    { header: 'Date', accessor: 'date' },
    { header: 'Due Date', accessor: 'dueDate' },
    { header: 'Total Amount', accessor: 'totalAmount', render: (row: SalesInvoice) => formatCurrency(row.totalAmount) },
    { header: 'Balance Due', accessor: 'id', render: (row: SalesInvoice) => formatCurrency(row.totalAmount - row.amountPaid) },
    { header: 'Status', accessor: 'status', render: (row: SalesInvoice) => <StatusBadge status={row.status} /> },
    { header: 'Actions', accessor: 'id', render: (row: SalesInvoice) => <button className="font-semibold text-primary hover:text-primary-dark">View</button> },
  ];

  const quotationColumns: Column<Quotation>[] = [
    { header: 'Quotation #', accessor: 'quotationNumber' },
    { header: 'Party Name', accessor: 'partyName' },
    { header: 'Date', accessor: 'date' },
    { header: 'Expiry Date', accessor: 'expiryDate' },
    { header: 'Total Amount', accessor: 'totalAmount', render: (row: Quotation) => formatCurrency(row.totalAmount) },
    { header: 'Status', accessor: 'status', render: (row: Quotation) => <span className="text-sm font-medium">{row.status}</span> },
    { header: 'Actions', accessor: 'id', render: (row: Quotation) => <button className="font-semibold text-primary hover:text-primary-dark">View</button> },
  ];

  const TabButton: React.FC<{ view: 'invoices' | 'quotations', label: string }> = ({ view, label }) => (
    <button onClick={() => setActiveTab(view)} className={`py-3 px-4 font-medium text-sm transition-colors rounded-t-lg ${activeTab === view ? 'border-b-2 border-primary text-primary' : 'text-gray-500 hover:text-gray-700'}`}>
        {label}
    </button>
  );
  
  return (
    <div className="animate-fade-in">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Sales</h2>
      <div className="mb-4 border-b border-gray-200">
        <nav className="-mb-px flex space-x-6">
            <TabButton view="invoices" label="Sales Invoices" />
            <TabButton view="quotations" label="Quotations / Estimates" />
        </nav>
      </div>
      
      {activeTab === 'invoices' && (
        <DataTable
          columns={invoiceColumns}
          data={salesInvoices}
          title="All Sales Invoices"
          actionButton={currentUser !== 'Auditor' ? <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors shadow-sm">Create Invoice</button> : null}
        />
      )}
      {activeTab === 'quotations' && (
        <DataTable
          columns={quotationColumns}
          data={quotations}
          title="All Quotations"
          actionButton={currentUser !== 'Auditor' ? <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors shadow-sm">Create Quotation</button> : null}
        />
      )}
    </div>
  );
};

export default Sales;