import React, { useState, useMemo } from 'react';
import DataTable, { Column } from '../components/DataTable';
import type { Loan, RepaymentInstallment } from './types';
import StatusBadge from '../components/StatusBadge';
import { formatCurrency } from '../utils/formatters';
import { useAppContext } from '../AppContext';
import { AddPdcModal } from '../components/ActionModals';

const LoanDetailView: React.FC<{ loan: Loan, onBack: () => void }> = ({ loan, onBack }) => {
    const [isPdcModalOpen, setIsPdcModalOpen] = useState(false);
    const scheduleColumns: Column<RepaymentInstallment>[] = [
        { header: '#', accessor: 'installmentNumber'},
        { header: 'Due Date', accessor: 'dueDate'},
        { header: 'Principal', accessor: 'principal', render: (row: RepaymentInstallment) => formatCurrency(row.principal)},
        { header: 'Interest', accessor: 'interest', render: (row: RepaymentInstallment) => formatCurrency(row.interest)},
        { header: 'Total EMI', accessor: 'totalAmount', render: (row: RepaymentInstallment) => formatCurrency(row.totalAmount)},
        { header: 'Status', accessor: 'status', render: (row: RepaymentInstallment) => <StatusBadge status={row.status} />},
    ];

    const DetailItem: React.FC<{ label: string, value: React.ReactNode }> = ({label, value}) => (
        <div>
            <p className="text-sm text-gray-500">{label}</p>
            <p className="text-lg font-semibold text-gray-800">{value}</p>
        </div>
    );

    return (
        <div className="animate-fade-in">
            <div className="flex justify-between items-center">
                <button onClick={onBack} className="flex items-center text-sm font-semibold text-gray-600 hover:text-gray-900 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                    Back to Loan List
                </button>
                <button onClick={() => setIsPdcModalOpen(true)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-semibold">
                    Add PDCs
                </button>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="flex justify-between items-start">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Loan Details for {loan.applicantName}</h2>
                        <p className="text-sm font-mono text-gray-500">{loan.id}</p>
                    </div>
                    <StatusBadge status={loan.status} />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-6 border-t pt-6">
                    <DetailItem label="Principal Amount" value={formatCurrency(loan.principalAmount)} />
                    <DetailItem label="Interest Rate" value={`${loan.interestRate.toFixed(2)}% p.a.`} />
                    <DetailItem label="Tenure" value={`${loan.tenureMonths} months`} />
                    <DetailItem label="Disbursed On" value={loan.disbursedDate} />
                </div>
            </div>

            <div className="mt-8">
                 <DataTable
                    columns={scheduleColumns}
                    data={loan.repaymentSchedule}
                    title="Repayment Schedule"
                    itemsPerPage={12}
                 />
            </div>
             <AddPdcModal
                isOpen={isPdcModalOpen}
                onClose={() => setIsPdcModalOpen(false)}
                loan={loan}
            />
        </div>
    )
}

const LoanListView: React.FC<{ loans: Loan[]; title: string; onSelectLoan: (id: string) => void; }> = ({ loans, title, onSelectLoan }) => {
    const columns: Column<Loan>[] = [
        { header: 'Loan ID', accessor: 'id', render: (row: Loan) => <span className="font-mono text-xs">{row.id}</span> },
        { header: 'Applicant Name', accessor: 'applicantName' },
        { header: 'Principal Amount', accessor: 'principalAmount', render: (row: Loan) => formatCurrency(row.principalAmount) },
        { header: 'Disbursed Date', accessor: 'disbursedDate' },
        { header: 'Interest Rate', accessor: 'interestRate', render: (row: Loan) => `${row.interestRate.toFixed(2)}%` },
        { header: 'Tenure', accessor: 'tenureMonths', render: (row: Loan) => `${row.tenureMonths} months` },
        { header: 'Status', accessor: 'status', render: (row: Loan) => <StatusBadge status={row.status} /> },
        { header: 'Actions', accessor: 'id', render: (row: Loan) => <button onClick={() => onSelectLoan(row.id)} className="font-semibold text-primary hover:text-primary-dark">View Details</button> },
    ];

    return <DataTable columns={columns} data={loans} title={title} />;
};

type LoanTab = 'msme' | 'home' | 'business' | 'industry';

const AllLoans: React.FC = () => {
    const { loans, homeLoans, businessLoans, industryLoans, setState, selectedLoanId } = useAppContext();
    const [activeTab, setActiveTab] = useState<LoanTab>('msme');

    const setSelectedLoanId = (id: string | null) => {
        setState(prev => ({ ...prev, selectedLoanId: id }));
    };
    
    const { loansToShow, title, selectedLoan } = useMemo(() => {
        let loansArr: Loan[] = [];
        let viewTitle = '';
        switch(activeTab) {
            case 'msme':
                loansArr = loans;
                viewTitle = "All Active & Historic MSME Loans";
                break;
            case 'home':
                loansArr = homeLoans;
                viewTitle = "All Active & Historic Home Loans";
                break;
            case 'business':
                loansArr = businessLoans;
                viewTitle = "All Active & Historic Business Loans";
                break;
            case 'industry':
                loansArr = industryLoans;
                viewTitle = "All Active & Historic Industry Loans";
                break;
        }
        const loan = [...loans, ...homeLoans, ...businessLoans, ...industryLoans].find(l => l.id === selectedLoanId);
        return { loansToShow: loansArr, title: viewTitle, selectedLoan: loan };
    }, [activeTab, loans, homeLoans, businessLoans, industryLoans, selectedLoanId]);
    
    if (selectedLoan) {
        return <LoanDetailView loan={selectedLoan} onBack={() => setSelectedLoanId(null)} />;
    }

    const TabButton: React.FC<{ view: LoanTab, label: string }> = ({ view, label }) => (
        <button onClick={() => setActiveTab(view)} className={`py-3 px-4 font-medium text-sm transition-colors rounded-t-lg ${activeTab === view ? 'border-b-2 border-primary text-primary' : 'text-gray-500 hover:text-gray-700'}`}>
            {label}
        </button>
      );

    return (
        <div className="animate-fade-in">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Active Loans</h2>
            <div className="mb-4 border-b border-gray-200">
                <nav className="-mb-px flex space-x-6">
                    <TabButton view="msme" label="MSME Loans" />
                    <TabButton view="home" label="Home Loans" />
                    <TabButton view="business" label="Business Loans" />
                    <TabButton view="industry" label="Industry Loans" />
                </nav>
            </div>
            <div className="mt-6">
                <LoanListView loans={loansToShow} title={title} onSelectLoan={setSelectedLoanId} />
            </div>
        </div>
    );
};

export default AllLoans;