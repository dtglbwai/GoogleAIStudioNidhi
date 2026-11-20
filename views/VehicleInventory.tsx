import React, { useState } from 'react';
import DataTable, { Column } from '../components/DataTable';
import type { Vehicle, Document } from './types';
import StatusBadge from '../components/StatusBadge';
import { formatCurrency } from '../utils/formatters';
import { NewVehicleModal, UpdateInsuranceModal } from '../components/ActionModals';
import { useAppContext } from '../AppContext';

const VehicleDetailView: React.FC<{
  vehicle: Vehicle;
  onBack: () => void;
  onUpdateInsurance: () => void;
}> = ({ vehicle, onBack, onUpdateInsurance }) => {
  const { currentUser } = useAppContext();
  const [primaryPhoto, setPrimaryPhoto] = useState(vehicle.photos[0] || 'https://placehold.co/600x400/gray/white?text=No+Image');
  const DetailItem: React.FC<{ label: string, value: React.ReactNode }> = ({label, value}) => (
    <div><p className="text-sm text-gray-500">{label}</p><p className="text-lg font-semibold text-gray-800">{value || 'N/A'}</p></div>
  );
  return (
    <div className="animate-fade-in">
        <button onClick={onBack} className="flex items-center text-sm font-semibold text-gray-600 hover:text-gray-900 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            Back to Inventory
        </button>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
                <div className="bg-white p-6 rounded-xl shadow-md">
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">{vehicle.make} {vehicle.model} ({vehicle.year})</h2>
                            <p className="text-sm font-mono text-gray-500">{vehicle.registrationNumber}</p>
                        </div>
                        <StatusBadge status={vehicle.status} />
                    </div>
                     <div className="mt-4">
                        <img src={primaryPhoto} alt="Primary vehicle view" className="w-full h-64 object-cover rounded-lg" />
                        <div className="flex space-x-2 mt-2">
                            {vehicle.photos.map((p, i) => (
                                <img key={i} src={p} onClick={() => setPrimaryPhoto(p)} className={`w-16 h-16 object-cover rounded-md cursor-pointer border-2 ${primaryPhoto === p ? 'border-primary' : 'border-transparent'}`} />
                            ))}
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-md">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Specifications</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                        <DetailItem label="Color" value={vehicle.color} />
                        <DetailItem label="Fuel Type" value={vehicle.fuelType} />
                        <DetailItem label="Transmission" value={vehicle.transmission} />
                        <DetailItem label="Mileage" value={`${vehicle.mileage.toLocaleString()} km`} />
                        <DetailItem label="VIN" value={vehicle.vin} />
                    </div>
                </div>
            </div>
            <div className="lg:col-span-1 space-y-8">
                <div className="bg-white p-6 rounded-xl shadow-md">
                     <h3 className="text-xl font-semibold text-gray-800 mb-4">Insurance & Compliance</h3>
                     <DetailItem label="Insurance Provider" value={vehicle.insurance.provider} />
                     <DetailItem label="Policy Number" value={vehicle.insurance.policyNumber} />
                     <DetailItem label="Insurance Expiry" value={vehicle.insurance.expiryDate} />
                     <DetailItem label="Fitness Cert. Expiry" value={vehicle.fitnessCertificate.expiryDate} />
                     {currentUser !== 'Auditor' && <button onClick={onUpdateInsurance} className="w-full mt-4 px-4 py-2 bg-primary-light text-primary-dark font-semibold text-sm rounded-lg hover:bg-primary/20">Update Insurance</button>}
                </div>
                 <div className="bg-white p-6 rounded-xl shadow-md">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Documents</h3>
                    <ul className="space-y-2">
                    {vehicle.documents.map(doc => (
                        <li key={doc.id} className="flex items-center text-sm text-gray-700 hover:bg-gray-50 p-2 rounded-md"><a href={doc.url} target="_blank" rel="noreferrer" className="text-primary hover:underline">{doc.name}</a></li>
                    ))}
                    </ul>
                    {currentUser !== 'Auditor' && <button className="w-full mt-4 text-sm text-gray-600 border-2 border-dashed rounded-lg p-3 hover:bg-gray-50">Upload Document</button>}
                </div>
            </div>
        </div>
    </div>
  );
};

const VehicleInventory: React.FC = () => {
    const { vehicles, selectedVehicleId, setState, currentUser } = useAppContext();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isInsuranceModalOpen, setIsInsuranceModalOpen] = useState(false);

    const setSelectedVehicleId = (id: string | null) => {
        setState(prev => ({ ...prev, selectedVehicleId: id }));
    };

    const selectedVehicle = vehicles.find(v => v.id === selectedVehicleId);

    const columns: Column<Vehicle>[] = [
        { 
            header: 'Vehicle', 
            accessor: 'make',
            render: (row: Vehicle) => (
                <div className="flex items-center">
                    <img src={row.photos[0] || `https://placehold.co/100x60/gray/white?text=${row.model}`} alt={`${row.make} ${row.model}`} className="w-16 h-10 object-cover rounded-md mr-4" />
                    <div><div className="font-bold text-gray-800">{row.make} {row.model}</div><div className="text-sm text-gray-500">{row.year}</div></div>
                </div>
            )
        },
        { header: 'Registration No.', accessor: 'registrationNumber' },
        { header: 'Monthly Rate', accessor: 'monthlyLeaseRate', render: (row: Vehicle) => formatCurrency(row.monthlyLeaseRate) },
        { header: 'Status', accessor: 'status', render: (row: Vehicle) => <StatusBadge status={row.status} /> },
        { 
            header: 'Actions', 
            accessor: 'id', 
            render: (row: Vehicle) => (
                <button onClick={() => setSelectedVehicleId(row.id)} className="font-semibold text-primary hover:text-primary-dark">View Details</button>
            )
        },
    ];

    if (selectedVehicle) {
        return (
            <>
            <VehicleDetailView 
                vehicle={selectedVehicle} 
                onBack={() => setSelectedVehicleId(null)} 
                onUpdateInsurance={() => setIsInsuranceModalOpen(true)}
            />
            <UpdateInsuranceModal 
                isOpen={isInsuranceModalOpen}
                onClose={() => setIsInsuranceModalOpen(false)}
                vehicle={selectedVehicle}
            />
            </>
        )
    }

    return (
        <div className="animate-fade-in">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Vehicle Inventory</h2>
            <DataTable
                columns={columns}
                data={vehicles}
                title="Leasing Fleet"
                actionButton={currentUser !== 'Auditor' ? <button onClick={() => setIsModalOpen(true)} className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors shadow-sm">Add New Vehicle</button> : null}
            />
            <NewVehicleModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
};

export default VehicleInventory;