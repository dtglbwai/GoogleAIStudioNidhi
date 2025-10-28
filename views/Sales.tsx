import React, { useState } from 'react';
import DataTable from '../components/DataTable';
import type { SalesInvoice, Quotation } from '../types';
import { InvoiceStatus } from '../types';
import StatusBadge from '../components/StatusBadge';
import { formatCurrency } from '../utils/formatters';

const mockInvoices: SalesInvoice[] = [
  { id: 'inv-1', invoiceNumber: 'INV-2023-001', partyId: 'p-1', partyName: 'Global Tech Inc.', date: '2023-06-10', dueDate: '2023-07-10', lineItems: [], subTotal: 150000, gstAmount: 27000, totalAmount: 177000, amountPaid: 177000, status: InvoiceStatus.PAID },
  { id: 'inv-2', invoiceNumber: 'INV-2023-002', partyId: 'p-2', partyName: 'Local Hardware', date: '2023-06-11', dueDate: '2023-07-11', lineItems: [], subTotal: 45000, gstAmount: 8100, totalAmount: 53100, amountPaid: 0, status: InvoiceStatus.UNPAID },
  { id: 'inv-3', invoiceNumber: 'INV-2023-003', partyId: 'p-3', partyName: 'Creative Designs', date: '2023-06-12', dueDate: '2023-07-12', lineItems: [], subTotal: 75000, gstAmount: 13500, totalAmount: 88500, amountPaid: 40000, status: InvoiceStatus.PARTIALLY_PAID },
  { id: 'inv-4', invoiceNumber: 'INV-2023-004', partyId: 'p-1', partyName: 'Global Tech Inc.', date: '2023-06-15', dueDate: '2023-07-15', lineItems: [], subTotal: 220000, gstAmount: 39600, totalAmount: 259600, amountPaid: 0, status: InvoiceStatus.UNPAID },
];

const mockQuotations: Quotation[] = [
    { id: 'qt-1', quotationNumber: 'QT-2023-001', partyId: 'p-4', partyName: 'New Leads Ltd.', date: '2023-06-05', expiryDate: '2023-06-20', lineItems: [], subTotal: 500000, gstAmount: 90000, totalAmount: 590000, status: 'Sent' },
    { id: 'qt-2', quotationNumber: 'QT-2023-002', partyId: 'p-2', partyName: 'Local Hardware', date: '2023-06-08', expiryDate: '2023-06-23', lineItems: [], subTotal: 120000, gstAmount: 21600, totalAmount: 141600, status: 'Accepted' },
];

const Sales: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'invoices' | 'quotations'>('invoices');

  const invoiceColumns = [
    { header: 'Invoice #', accessor: 'invoiceNumber' as keyof SalesInvoice },
    { header: 'Party Name', accessor: 'partyName' as keyof SalesInvoice },
    { header: 'Date', accessor: 'date' as keyof SalesInvoice },
    { header: 'Due Date', accessor: 'dueDate' as keyof SalesInvoice },
    { header: 'Total Amount', accessor: 'totalAmount' as keyof SalesInvoice, render: (row: SalesInvoice) => formatCurrency(row.totalAmount) },
    { header: 'Balance Due', accessor: 'id' as keyof SalesInvoice, render: (row: SalesInvoice) => formatCurrency(row.totalAmount - row.amountPaid) },
    { header: 'Status', accessor: 'status' as keyof SalesInvoice, render: (row: SalesInvoice) => <StatusBadge status={row.status} /> },
    { header: 'Actions', accessor: 'id' as keyof SalesInvoice, render: (row: SalesInvoice) => <button className="font-semibold text-primary hover:text-primary-dark">View</button> },
  ];

  const quotationColumns = [
    { header: 'Quotation #', accessor: 'quotationNumber' as keyof Quotation },
    { header: 'Party Name', accessor: 'partyName' as keyof Quotation },
    { header: 'Date', accessor: 'date' as keyof Quotation },
    { header: 'Expiry Date', accessor: 'expiryDate' as keyof Quotation },
    { header: 'Total Amount', accessor: 'totalAmount' as keyof Quotation, render: (row: Quotation) => formatCurrency(row.totalAmount) },
    { header: 'Status', accessor: 'status' as keyof Quotation, render: (row: Quotation) => <span className="text-sm font-medium">{row.status}</span> },
    { header: 'Actions', accessor: 'id' as keyof Quotation, render: (row: Quotation) => <button className="font-semibold text-primary hover:text-primary-dark">View</button> },
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
          data={mockInvoices}
          title="All Sales Invoices"
          actionButton={<button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors shadow-sm">Create Invoice</button>}
        />
      )}
      {activeTab === 'quotations' && (
        <DataTable
          columns={quotationColumns}
          data={mockQuotations}
          title="All Quotations"
          actionButton={<button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors shadow-sm">Create Quotation</button>}
        />
      )}
    </div>
  );
};

export default Sales;
