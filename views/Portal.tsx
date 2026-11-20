
import React, { useMemo, useState } from 'react';
import { useAppContext } from '../AppContext';
import { useBranding } from '../BrandingContext';
import { formatCurrency } from '../utils/formatters';
import type { Loan, Lease, RepaymentInstallment, LeasePaymentInstallment } from './types';
import LogoIcon from '../components/icons/LogoIcon';
import LogoutIcon from '../components/icons/LogoutIcon';
import StatusBadge from '../components/StatusBadge';
import DataTable, { Column } from '../components/DataTable';

const Portal: React.FC = () => {
    const { selectedCustomerId, customers, loans, homeLoans, businessLoans, industryLoans, leases, handleMakeCustomerPayment, setState } = useAppContext();
    const { logo, logoSize, primaryColor } = useBranding();
    const portalLogoHeight = Math.min(128, Math.max(80, Number.isFinite(logoSize) ? logoSize : 116));
    const [selectedContract, setSelectedContract] = useState<Loan | Lease | null>(null);

    const allLoans = useMemo(() => [...loans, ...homeLoans, ...businessLoans, ...industryLoans], [loans, homeLoans, businessLoans, industryLoans]);
    
    const customer = useMemo(() => customers.find(c => c.id === selectedCustomerId), [customers, selectedCustomerId]);
    
    const customerContracts = useMemo(() => {
        if (!customer) return [];
        const customerLoans = allLoans.filter(l => l.customerId === customer.id);
        const customerLeases = leases.filter(l => l.customerId === customer.id);
        return [...customerLoans, ...customerLeases];
    }, [customer, allLoans, leases]);

    const portalStats = useMemo(() => {
        const totalOutstanding = customerContracts.reduce((sum, contract) => {
            if ('repaymentSchedule' in contract) {
                return sum + contract.repaymentSchedule.filter(p => p.status === 'Pending' || p.status === 'Overdue').reduce((s, p) => s + p.totalAmount, 0);
            }
            return sum + contract.paymentSchedule.filter(p => p.status === 'Pending' || p.status === 'Overdue').reduce((s, p) => s + p.amount, 0);
        }, 0);

        const nextPayment = customerContracts
            .flatMap(c => 'repaymentSchedule' in c ? c.repaymentSchedule : c.paymentSchedule)
            .filter(p => p.status === 'Pending' || p.status === 'Overdue')
            .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())[0];
        
        return { totalOutstanding, nextPayment };
    }, [customerContracts]);


    const handleLogout = () => {
         setState(prev => ({...prev, currentView: 'dashboard', selectedCustomerId: null}));
    };

    if (!customer) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-100">
                <div className="text-center p-8 bg-white rounded-lg shadow-md">
                    <h2 className="text-xl font-bold text-red-600">Access Denied</h2>
                    <p className="text-gray-600 mt-2">No customer is currently selected for the portal view.</p>
                    <button onClick={handleLogout} className="mt-4 px-4 py-2 bg-primary text-white rounded-lg">Return to Admin Dashboard</button>
                </div>
            </div>
        );
    }

    if (selectedContract) {
        const isLoan = 'repaymentSchedule' in selectedContract;
        
        const repaymentColumns: Column<RepaymentInstallment>[] = [
            { header: '#', accessor: 'installmentNumber' },
            { header: 'Due Date', accessor: 'dueDate' },
            { header: 'Principal', accessor: 'principal', render: (row) => formatCurrency(row.principal) },
            { header: 'Interest', accessor: 'interest', render: (row) => formatCurrency(row.interest) },
            { header: 'Total EMI', accessor: 'totalAmount', render: (row) => formatCurrency(row.totalAmount) },
            { header: 'Status', accessor: 'status', render: (row) => <StatusBadge status={row.status} />},
        ];
        
        const leaseColumns: Column<LeasePaymentInstallment>[] = [
            { header: '#', accessor: 'installmentNumber' },
            { header: 'Due Date', accessor: 'dueDate' },
            { header: 'Amount', accessor: 'amount', render: (row) => formatCurrency(row.amount) },
            { header: 'Status', accessor: 'status', render: (row) => <StatusBadge status={row.status} />},
        ];

        return (
            <div className="bg-gray-100 min-h-screen">
                <header className="bg-white shadow-md">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                         <div className="flex items-center space-x-4">
                            {logo ? (
                                <div className="relative inline-flex items-center justify-center p-2 rounded-2xl bg-gradient-to-br from-white via-slate-100 to-slate-300 border-t-4 border-l-4 border-white border-b-4 border-r-4 border-slate-500/80 shadow-[0_10px_22px_rgba(15,23,42,0.32),0_3px_0_#334155,inset_0_2px_0_rgba(255,255,255,0.98)] overflow-hidden shrink-0">
                                    <img
                                        src={logo}
                                        alt="Logo"
                                        style={{ height: `${portalLogoHeight}px` }}
                                        className="w-auto max-w-[300px] object-contain drop-shadow-[0_3px_5px_rgba(15,23,42,0.45)] contrast-[1.08]"
                                    />
                                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/55 via-transparent to-transparent" />
                                </div>
                            ) : (
                                <LogoIcon style={{ height: `${portalLogoHeight}px`, width: `${portalLogoHeight}px` }} />
                            )}
                            <span className="font-bold text-xl text-gray-800">Customer Portal</span>
                        </div>
                        <button onClick={handleLogout} className="flex items-center space-x-2 text-sm font-medium text-gray-600 hover:text-primary"><LogoutIcon className="h-5 w-5" /><span>Logout</span></button>
                    </div>
                </header>
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                     <button onClick={() => setSelectedContract(null)} className="flex items-center text-sm font-semibold text-gray-600 hover:text-gray-900 mb-4">
                        &larr; Back to Dashboard
                    </button>
                    {isLoan ? (
                        <DataTable 
                            columns={repaymentColumns} 
                            data={(selectedContract as Loan).repaymentSchedule} 
                            title={`Repayment Schedule for Loan ${selectedContract.id.slice(-6)}`} 
                        />
                    ) : (
                        <DataTable 
                            columns={leaseColumns} 
                            data={(selectedContract as Lease).paymentSchedule} 
                            title={`Payment Schedule for Lease ${selectedContract.id.slice(-6)}`} 
                        />
                    )}
                </main>
            </div>
        )
    }

    return (
        <div className="bg-gray-100 min-h-screen">
            <header className="bg-white shadow-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                        {logo ? (
                            <div className="relative inline-flex items-center justify-center p-2 rounded-2xl bg-gradient-to-br from-white via-slate-100 to-slate-300 border-t-4 border-l-4 border-white border-b-4 border-r-4 border-slate-500/80 shadow-[0_10px_22px_rgba(15,23,42,0.32),0_3px_0_#334155,inset_0_2px_0_rgba(255,255,255,0.98)] overflow-hidden shrink-0">
                                <img
                                    src={logo}
                                    alt="Logo"
                                    style={{ height: `${portalLogoHeight}px` }}
                                    className="w-auto max-w-[300px] object-contain drop-shadow-[0_3px_5px_rgba(15,23,42,0.45)] contrast-[1.08]"
                                />
                                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/55 via-transparent to-transparent" />
                            </div>
                        ) : (
                            <LogoIcon style={{ height: `${portalLogoHeight}px`, width: `${portalLogoHeight}px` }} />
                        )}
                        <span className="font-bold text-xl text-gray-800">Customer Portal</span>
                    </div>
                    <div className="flex items-center space-x-4">
                        <span className="text-sm font-medium">Welcome, {customer.name}</span>
                         <button onClick={handleLogout} className="flex items-center space-x-2 text-sm font-medium text-gray-600 hover:text-primary"><LogoutIcon className="h-5 w-5" /><span>Logout</span></button>
                    </div>
                </div>
            </header>
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">My Dashboard</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-gray-500 font-medium">Total Outstanding</h3>
                        <p className="text-3xl font-bold text-gray-800 mt-2">{formatCurrency(portalStats.totalOutstanding)}</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-gray-500 font-medium">Next Payment Due</h3>
                        <p className="text-3xl font-bold text-gray-800 mt-2">{portalStats.nextPayment?.dueDate || 'N/A'}</p>
                    </div>
                     <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-gray-500 font-medium">Next EMI Amount</h3>
                        <p className="text-3xl font-bold text-primary mt-2">{formatCurrency((portalStats.nextPayment as any)?.totalAmount || (portalStats.nextPayment as any)?.amount || 0)}</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">My Contracts</h3>
                    <div className="space-y-4">
                        {customerContracts.map(contract => (
                            <div key={contract.id} className="border rounded-lg p-4 flex justify-between items-center">
                                <div>
                                    <p className="font-semibold text-gray-800">{'loanType' in contract ? contract.loanType : contract.vehicleName}</p>
                                    <p className="text-sm text-gray-500 font-mono">ID: {contract.id}</p>
                                </div>
                                <div className="text-right">
                                    <StatusBadge status={contract.status} />
                                    <p className="font-semibold mt-1">{'repaymentSchedule' in contract ? formatCurrency(contract.repaymentSchedule[0].totalAmount) : formatCurrency(contract.monthlyPayment)} / mo</p>
                                </div>
                                <div className="flex items-center space-x-2">
                                     <button onClick={() => setSelectedContract(contract)} className="px-3 py-1.5 text-sm font-semibold bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">View Schedule</button>
                                     <button onClick={() => handleMakeCustomerPayment(contract.id, 'repaymentSchedule' in contract ? 'Loan' : 'Lease')} className="px-3 py-1.5 text-sm font-semibold bg-primary text-white rounded-md hover:bg-primary-dark">Pay Next EMI</button>
                                </div>
                            </div>
                        ))}
                        {customerContracts.length === 0 && <p className="text-center text-gray-500 py-4">You have no active loans or leases.</p>}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Portal;