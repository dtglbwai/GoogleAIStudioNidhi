
import React, { useState, useMemo } from 'react';
import DataTable, { Column } from '../components/DataTable';
import type { Vehicle } from './types';
import { useAppContext } from '../AppContext';
import { UpdateInsuranceModal } from '../components/ActionModals';

type InsuranceFilter = 'All' | 'Active' | 'Expiring Soon' | 'Expired';

const InsuranceCompliance: React.FC = () => {
    const { vehicles, currentUser } = useAppContext();
    const [filter, setFilter] = useState<InsuranceFilter>('All');
    const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);

    const isExpired = (dateStr: string) => new Date(dateStr) < new Date();
    const isExpiringSoon = (dateStr: string) => {
        const expiry = new Date(dateStr);
        const today = new Date();
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(today.getDate() + 30);
        return expiry >= today && expiry <= thirtyDaysFromNow;
    };

    const filteredVehicles = useMemo(() => {
        switch (filter) {
            case 'Active':
                return vehicles.filter(v => !isExpired(v.insurance.expiryDate) && !isExpiringSoon(v.insurance.expiryDate));
            case 'Expiring Soon':
                return vehicles.filter(v => isExpiringSoon(v.insurance.expiryDate));
            case 'Expired':
                return vehicles.filter(v => isExpired(v.insurance.expiryDate));
            case 'All':
            default:
                return vehicles;
        }
    }, [vehicles, filter]);

    const columns: Column<Vehicle>[] = [
        { header: 'Vehicle', accessor: 'make', render: (row: Vehicle) => `${row.make} ${row.model}` },
        { header: 'Registration No.', accessor: 'registrationNumber' },
        { header: 'Insurance Provider', accessor: 'insurance', render: (row: Vehicle) => row.insurance.provider },
        { header: 'Policy No.', accessor: 'insurance', render: (row: Vehicle) => row.insurance.policyNumber },
        { header: 'Expiry Date', accessor: 'insurance', render: (row: Vehicle) => (
            <span className={`font-semibold ${isExpired(row.insurance.expiryDate) ? 'text-red-600' : isExpiringSoon(row.insurance.expiryDate) ? 'text-orange-500' : 'text-gray-700'}`}>
                {row.insurance.expiryDate}
            </span>
        )},
        { header: 'Actions', accessor: 'id', render: (row: Vehicle) => (
            currentUser !== 'Auditor' ? 
            <button onClick={() => setEditingVehicle(row)} className="font-semibold text-primary hover:text-primary-dark">Update Insurance</button> :
            <span className="text-xs text-gray-400">Read-only</span>
        )},
    ];
    
    const FilterButton: React.FC<{ type: InsuranceFilter; count: number }> = ({ type, count }) => (
        <button 
            onClick={() => setFilter(type)}
            className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${filter === type ? 'bg-primary text-white shadow' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
        >
            {type} <span className="ml-2 bg-gray-200 text-gray-700 text-xs px-2 py-0.5 rounded-full">{count}</span>
        </button>
    );

    return (
        <div className="animate-fade-in">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Insurance Compliance</h2>
            
            <div className="bg-white p-4 rounded-xl shadow-md mb-8">
                <div className="flex items-center space-x-2">
                    <FilterButton type="All" count={vehicles.length} />
                    <FilterButton type="Active" count={vehicles.filter(v => !isExpired(v.insurance.expiryDate) && !isExpiringSoon(v.insurance.expiryDate)).length} />
                    <FilterButton type="Expiring Soon" count={vehicles.filter(v => isExpiringSoon(v.insurance.expiryDate)).length} />
                    <FilterButton type="Expired" count={vehicles.filter(v => isExpired(v.insurance.expiryDate)).length} />
                </div>
            </div>

            <DataTable
                columns={columns}
                data={filteredVehicles}
                title="Fleet Insurance Status"
            />
            
            <UpdateInsuranceModal 
                isOpen={!!editingVehicle}
                onClose={() => setEditingVehicle(null)}
                vehicle={editingVehicle}
            />
        </div>
    );
};

export default InsuranceCompliance;
