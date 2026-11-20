

import React, { useMemo, useState } from 'react';
import DataTable, { Column } from '../components/DataTable';
import type { Lease, Vehicle, LeasePaymentInstallment } from './types';
import StatusBadge from '../components/StatusBadge';
import { formatCurrency } from '../utils/formatters';
import { EndLeaseModal } from '../components/ActionModals';
import { useAppContext } from '../AppContext';

const LeaseDetailView: React.FC<{
  lease: Lease;
  vehicle: Vehicle;
  onBack: () => void;
  onEndLeaseClick: () => void;
}> = ({ lease, vehicle, onBack, onEndLeaseClick }) => {
  const { currentUser } = useAppContext();

  const DetailItem: React.FC<{ label: string, value: React.ReactNode }> = ({label, value}) => (
      <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className="text-lg font-semibold text-gray-800">{value}</p>
      </div>
  );

  const paymentScheduleColumns: Column<LeasePaymentInstallment>[] = [
    { header: '#', accessor: 'installmentNumber' },
    { header: 'Due Date', accessor: 'dueDate' },
    { header: 'Amount', accessor: 'amount', render: (row: LeasePaymentInstallment) => formatCurrency(row.amount) },
    { header: 'Status', accessor: 'status', render: (row: LeasePaymentInstallment) => <StatusBadge status={row.status} /> },
    { header: 'Paid On', accessor: 'paidDate', render: (row: LeasePaymentInstallment) => row.paidDate || 'N/A' },
  ];
  
  return (
    <div className="animate-fade-in">
      <button onClick={onBack} className="flex items-center text-sm font-semibold text-gray-600 hover:text-gray-900 mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        Back to Lease List
      </button>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="flex justify-between items-start">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Lease Details for {lease.applicantName}</h2>
                        <p className="text-sm font-mono text-gray-500">{lease.id}</p>
                    </div>
                    <StatusBadge status={lease.status} />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-6 border-t pt-6">
                    <DetailItem label="Monthly Payment" value={formatCurrency(lease.monthlyPayment)} />
                    <DetailItem label="Start Date" value={lease.startDate} />
                    <DetailItem label="End Date" value={lease.endDate} />
                    <DetailItem label="Security Deposit" value={formatCurrency(lease.securityDeposit)} />
                    <DetailItem label="CERSAI Registration ID" value={lease.cersaiRegistrationId || 'Not Registered'} />
                </div>
            </div>
            <DataTable
              columns={paymentScheduleColumns}
              data={lease.paymentSchedule}
              title="Payment Schedule"
              itemsPerPage={6}
            />
        </div>
        <div className="lg:col-span-1 space-y-8">
            <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Vehicle Details</h3>
                 <img src={vehicle.photos[0]} alt={vehicle.model} className="w-full h-40 object-cover rounded-lg mb-4" />
                 <DetailItem label="Vehicle" value={`${vehicle.make} ${vehicle.model} (${vehicle.year})`} />
                 <DetailItem label="Registration #" value={vehicle.registrationNumber} />
                 <DetailItem label="VIN" value={vehicle.vin} />
            </div>
            {currentUser !== 'Auditor' && (
             <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">End of Term</h3>
                <p className="text-sm text-gray-500 mb-4">Process the vehicle return and close out the lease contract.</p>
                <button 
                  onClick={onEndLeaseClick}
                  disabled={lease.status !== 'Active'}
                  className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors shadow-sm disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  Initiate Vehicle Return
                </button>
            </div>
            )}
        </div>
      </div>
    </div>
  );
}

const Leases: React.FC = () => {
  const { leases, vehicles, selectedLeaseId, setState } = useAppContext();
  const [isEndLeaseModalOpen, setIsEndLeaseModalOpen] = useState(false);

  const setSelectedLeaseId = (id: string | null) => {
    setState(prev => ({ ...prev, selectedLeaseId: id }));
  };

  const selectedLease = useMemo(() => 
    leases.find(l => l.id === selectedLeaseId),
    [leases, selectedLeaseId]
  );
  
  const selectedVehicle = useMemo(() => 
    vehicles.find(v => v.id === selectedLease?.vehicleId),
    [vehicles, selectedLease]
  );

  if (selectedLease && selectedVehicle) {
    return (
        <>
            <LeaseDetailView 
                lease={selectedLease} 
                vehicle={selectedVehicle} 
                onBack={() => setSelectedLeaseId(null)}
                onEndLeaseClick={() => setIsEndLeaseModalOpen(true)}
            />
            <EndLeaseModal
                isOpen={isEndLeaseModalOpen}
                onClose={() => setIsEndLeaseModalOpen(false)}
                lease={selectedLease}
            />
        </>
    );
  }

  const columns: Column<Lease>[] = [
    { header: 'Lease ID', accessor: 'id', render: (row: Lease) => <span className="font-mono text-xs">{row.id}</span> },
    { header: 'Lendee Name', accessor: 'applicantName' },
    { header: 'Vehicle', accessor: 'vehicleName' },
    { header: 'Monthly Payment', accessor: 'monthlyPayment', render: (row: Lease) => formatCurrency(row.monthlyPayment) },
    { header: 'End Date', accessor: 'endDate' },
    { header: 'Status', accessor: 'status', render: (row: Lease) => <StatusBadge status={row.status} /> },
    { header: 'Actions', accessor: 'id', render: (row: Lease) => <button onClick={() => setSelectedLeaseId(row.id)} className="font-semibold text-primary hover:text-primary-dark">View Details</button> },
  ];

  return (
    <div className="animate-fade-in">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Lease Management</h2>
       <DataTable
          columns={columns}
          data={leases}
          title="All Active & Historic Leases"
        />
    </div>
  );
};

export default Leases;