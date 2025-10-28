import React, { useState } from 'react';
import DataTable from '../components/DataTable';
import type { Vehicle } from '../types';
import { VehicleStatus } from '../types';
import StatusBadge from '../components/StatusBadge';
import { formatCurrency } from '../utils/formatters';
import { NewVehicleModal } from '../components/ActionModals';

const mockVehiclesData: Vehicle[] = [
    { id: 'v-1', make: 'Maruti Suzuki', model: 'Swift', year: 2023, vin: 'MS1234567890', registrationNumber: 'KA-01-AB-1234', status: VehicleStatus.AVAILABLE, monthlyLeaseRate: 15000, imageUrl: 'https://placehold.co/100x60/3b82f6/white?text=Swift' },
    { id: 'v-2', make: 'Hyundai', model: 'Creta', year: 2022, vin: 'HY9876543210', registrationNumber: 'MH-12-CD-5678', status: VehicleStatus.LEASED, monthlyLeaseRate: 22000, imageUrl: 'https://placehold.co/100x60/10b981/white?text=Creta' },
    { id: 'v-3', make: 'Tata', model: 'Nexon EV', year: 2023, vin: 'TA5432109876', registrationNumber: 'DL-03-EF-9012', status: VehicleStatus.MAINTENANCE, monthlyLeaseRate: 25000, imageUrl: 'https://placehold.co/100x60/f97316/white?text=Nexon' },
    { id: 'v-4', make: 'Mahindra', model: 'XUV700', year: 2023, vin: 'MA0192837465', registrationNumber: 'TN-04-GH-3456', status: VehicleStatus.AVAILABLE, monthlyLeaseRate: 30000, imageUrl: 'https://placehold.co/100x60/8b5cf6/white?text=XUV700' },
    { id: 'v-5', make: 'Kia', model: 'Seltos', year: 2022, vin: 'KI6574839201', registrationNumber: 'AP-05-IJ-7890', status: VehicleStatus.LEASED, monthlyLeaseRate: 23000, imageUrl: 'https://placehold.co/100x60/ef4444/white?text=Seltos' },
];

const VehicleInventory: React.FC = () => {
    const [vehicles, setVehicles] = useState<Vehicle[]>(mockVehiclesData);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleAddVehicle = (newVehicleData: Omit<Vehicle, 'id' | 'status'>) => {
        const newVehicle: Vehicle = {
            ...newVehicleData,
            id: `v-${Date.now()}`,
            status: VehicleStatus.AVAILABLE,
        };
        setVehicles(prev => [newVehicle, ...prev]);
        setIsModalOpen(false);
    };

    const columns = [
        { 
            header: 'Vehicle', 
            accessor: 'make' as keyof Vehicle,
            render: (row: Vehicle) => (
                <div className="flex items-center">
                    <img src={row.imageUrl || `https://placehold.co/100x60/gray/white?text=${row.model}`} alt={`${row.make} ${row.model}`} className="w-16 h-10 object-cover rounded-md mr-4" />
                    <div>
                        <div className="font-bold text-gray-800">{row.make} {row.model}</div>
                        <div className="text-sm text-gray-500">{row.year}</div>
                    </div>
                </div>
            )
        },
        { header: 'VIN', accessor: 'vin' as keyof Vehicle },
        { header: 'Registration No.', accessor: 'registrationNumber' as keyof Vehicle },
        { header: 'Monthly Rate', accessor: 'monthlyLeaseRate' as keyof Vehicle, render: (row: Vehicle) => formatCurrency(row.monthlyLeaseRate) },
        { header: 'Status', accessor: 'status' as keyof Vehicle, render: (row: Vehicle) => <StatusBadge status={row.status} /> },
        { 
            header: 'Actions', 
            accessor: 'id' as keyof Vehicle, 
            render: (row: Vehicle) => (
                <div className="flex items-center space-x-2">
                    <button onClick={() => alert(`Viewing details for ${row.make} ${row.model}`)} className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">View</button>
                    <button onClick={() => alert(`Editing ${row.make} ${row.model}`)} className="px-3 py-1 text-sm bg-primary-light text-primary-dark rounded-md hover:bg-primary/20">Edit</button>
                </div>
            )
        },
    ];

    return (
        <div className="animate-fade-in">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Vehicle Inventory</h2>
            <DataTable
                columns={columns}
                data={vehicles}
                title="Leasing Fleet"
                actionButton={<button onClick={() => setIsModalOpen(true)} className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors shadow-sm">Add New Vehicle</button>}
            />
            <NewVehicleModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAddVehicle={handleAddVehicle}
            />
        </div>
    );
};

export default VehicleInventory;
