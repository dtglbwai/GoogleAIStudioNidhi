import React from 'react';
import MoneyIcon from '../components/icons/MoneyIcon';
import FileIcon from '../components/icons/FileIcon';
import UserIcon from '../components/icons/UserIcon';
import ReportsIcon from '../components/icons/ReportsIcon';
import CashAndBankIcon from '../components/icons/CashAndBankIcon';

const ReportCard: React.FC<{ title: string; description: string; icon: React.ReactNode }> = ({ title, description, icon }) => (
    <button className="bg-white p-6 rounded-xl shadow-md text-left hover:shadow-lg hover:border-primary border-transparent border transition-all flex items-start space-x-4">
        <div className="bg-primary-light p-3 rounded-lg text-primary">
            {icon}
        </div>
        <div>
            <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
            <p className="text-sm text-gray-500 mt-1">{description}</p>
        </div>
    </button>
);

const Reports: React.FC = () => {
  return (
    <div className="animate-fade-in">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Business & Accounting Reports</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <h3 className="text-xl font-semibold text-gray-700 col-span-full">General Reports</h3>
        <ReportCard title="Day Book" description="All transactions for a selected day." icon={<FileIcon />} />
        <ReportCard title="Cash & Bank Book" description="View cash flow and bank transactions." icon={<CashAndBankIcon />} />
        <ReportCard title="All Transactions" description="A complete log of all journal entries." icon={<ReportsIcon />} />
        
        <h3 className="text-xl font-semibold text-gray-700 col-span-full mt-4">Receivables & Payables</h3>
        <ReportCard title="Debtors Ledger" description="Outstanding balances from customers." icon={<UserIcon />} />
        <ReportCard title="Creditors Ledger" description="Amounts owed to suppliers." icon={<UserIcon />} />
        <ReportCard title="Party Statement" description="View transaction history for a party." icon={<UserIcon />} />

        <h3 className="text-xl font-semibold text-gray-700 col-span-full mt-4">Final Statements</h3>
        <ReportCard title="Profit & Loss" description="View income, expenses, and profit." icon={<MoneyIcon />} />
        <ReportCard title="Balance Sheet" description="Assets, liabilities, and equity." icon={<ReportsIcon />} />
        <ReportCard title="Trial Balance" description="Check debit/credit balance totals." icon={<ReportsIcon />} />
        
        <h3 className="text-xl font-semibold text-gray-700 col-span-full mt-4">GST Reports (Compliance)</h3>
        <ReportCard title="GSTR-1" description="Summary of all outward supplies." icon={<FileIcon />} />
        <ReportCard title="GSTR-3B" description="Summary of monthly returns." icon={<FileIcon />} />
        <ReportCard title="All Parties GSTIN" description="List of all parties with GSTIN." icon={<UserIcon />} />

      </div>
    </div>
  );
};

export default Reports;