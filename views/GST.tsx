
import React, { useState, useMemo } from 'react';
import { useAppContext } from '../AppContext';
import StatsCard from '../components/StatsCard';
import DataTable, { Column } from '../components/DataTable';
import { SalesInvoice, PurchaseBill } from './types';
import { formatCurrency } from '../utils/formatters';
import MoneyIcon from '../components/icons/MoneyIcon';
import GstIcon from '../components/icons/GstIcon';

const GST: React.FC = () => {
    const { salesInvoices, purchaseBills } = useAppContext();
    const [activeTab, setActiveTab] = useState<'gstr1' | 'gstr2b' | 'gstr3b'>('gstr3b');

    const gstData = useMemo(() => {
        const outputTax = salesInvoices.reduce((sum, inv) => sum + inv.gstAmount, 0);
        const inputTaxCredit = purchaseBills.reduce((sum, bill) => sum + bill.gstAmount, 0);
        const gstPayable = outputTax - inputTaxCredit;
        return { outputTax, inputTaxCredit, gstPayable };
    }, [salesInvoices, purchaseBills]);

    const salesColumns: Column<SalesInvoice>[] = [
        { header: 'Invoice #', accessor: 'invoiceNumber' },
        { header: 'Party Name', accessor: 'partyName' },
        { header: 'Taxable Amount', accessor: 'totalAmount', render: (row) => formatCurrency(row.totalAmount - row.gstAmount) },
        { header: 'GST Amount', accessor: 'gstAmount', render: (row) => formatCurrency(row.gstAmount) },
        { header: 'Total', accessor: 'totalAmount', render: (row) => formatCurrency(row.totalAmount) },
    ];

    const purchaseColumns: Column<PurchaseBill>[] = [
        { header: 'Bill #', accessor: 'billNumber' },
        { header: 'Party Name', accessor: 'partyName' },
        { header: 'Taxable Amount', accessor: 'totalAmount', render: (row) => formatCurrency(row.totalAmount - row.gstAmount) },
        { header: 'GST Amount (ITC)', accessor: 'gstAmount', render: (row) => formatCurrency(row.gstAmount) },
        { header: 'Total', accessor: 'totalAmount', render: (row) => formatCurrency(row.totalAmount) },
    ];

    const TabButton: React.FC<{ view: 'gstr1' | 'gstr2b' | 'gstr3b'; label: string }> = ({ view, label }) => (
        <button onClick={() => setActiveTab(view)} className={`py-3 px-4 font-medium text-sm transition-colors rounded-t-lg ${activeTab === view ? 'border-b-2 border-primary text-primary' : 'text-gray-500 hover:text-gray-700'}`}>
            {label}
        </button>
    );

    return (
        <div className="animate-fade-in space-y-8">
            <div className="flex items-center space-x-3">
                <div className="bg-primary-light p-3 rounded-full text-primary">
                    <GstIcon />
                </div>
                <h2 className="text-3xl font-bold text-gray-800">GST Compliance Dashboard</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatsCard title="Output Tax (GSTR-1)" value={formatCurrency(gstData.outputTax)} change="" changeType="none" isChangeGood={true} icon={<MoneyIcon />} color="#ef4444" />
                <StatsCard title="Input Tax Credit (GSTR-2B)" value={formatCurrency(gstData.inputTaxCredit)} change="" changeType="none" isChangeGood={true} icon={<MoneyIcon />} color="#10b981" />
                <StatsCard title="Net GST Payable (GSTR-3B)" value={formatCurrency(gstData.gstPayable)} change="" changeType="none" isChangeGood={gstData.gstPayable <= 0} icon={<GstIcon />} color="#3b82f6" />
            </div>

            <div className="mb-4 border-b border-gray-200">
                <nav className="-mb-px flex space-x-6">
                    <TabButton view="gstr3b" label="GSTR-3B Summary" />
                    <TabButton view="gstr1" label="GSTR-1 (Outward Supplies)" />
                    <TabButton view="gstr2b" label="GSTR-2B (Input Tax Credit)" />
                </nav>
            </div>

            {activeTab === 'gstr3b' && (
                <div className="bg-white p-6 rounded-xl shadow-md">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">GSTR-3B Summary for the Current Period</h3>
                    <div className="space-y-3 max-w-md">
                        <div className="flex justify-between items-center p-3 bg-red-50 rounded-md">
                            <span className="font-semibold text-red-800">Total Output Tax Liability:</span>
                            <span className="font-mono font-semibold text-red-800">{formatCurrency(gstData.outputTax)}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-green-50 rounded-md">
                            <span className="font-semibold text-green-800">Eligible Input Tax Credit:</span>
                            <span className="font-mono font-semibold text-green-800">{formatCurrency(gstData.inputTaxCredit)}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-blue-50 rounded-md border-t-2 border-blue-200">
                            <span className="font-bold text-blue-800 text-lg">Net GST Payable:</span>
                            <span className="font-mono font-bold text-blue-800 text-lg">{formatCurrency(gstData.gstPayable)}</span>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'gstr1' && (
                <DataTable
                    columns={salesColumns}
                    data={salesInvoices}
                    title="Data for GSTR-1 (Outward Supplies)"
                />
            )}
            {activeTab === 'gstr2b' && (
                <DataTable
                    columns={purchaseColumns}
                    data={purchaseBills}
                    title="Data for GSTR-2B (Input Tax Credit)"
                />
            )}
        </div>
    );
};

export default GST;
