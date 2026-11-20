import React from 'react';
import DataTable, { Column } from '../components/DataTable';
import type { Item } from './types';
import { formatCurrency } from '../utils/formatters';
import { useAppContext } from '../AppContext';

const Inventory: React.FC = () => {
    const { items, currentUser } = useAppContext();
    
    const columns: Column<Item>[] = [
        { header: 'Item Name', accessor: 'name' },
        { header: 'SKU', accessor: 'sku' },
        { header: 'Sale Price', accessor: 'salePrice', render: (row: Item) => formatCurrency(row.salePrice) },
        { header: 'Purchase Price', accessor: 'purchasePrice', render: (row: Item) => formatCurrency(row.purchasePrice) },
        { header: 'Stock on Hand', accessor: 'stock', render: (row: Item) => <span className={`font-bold ${row.stock < 20 ? 'text-red-500' : 'text-gray-800'}`}>{row.stock} units</span> },
        { header: 'HSN Code', accessor: 'hsnCode' },
        { header: 'Actions', accessor: 'id', render: (row: Item) => currentUser !== 'Auditor' ? <button className="font-semibold text-primary hover:text-primary-dark">Adjust Stock</button> : <span className="text-xs text-gray-400">Read-only</span> },
    ];

    return (
        <div className="animate-fade-in">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Item & Stock Management</h2>
            <DataTable
                columns={columns}
                data={items}
                title="All Items"
                actionButton={currentUser !== 'Auditor' ? <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors shadow-sm">Add New Item</button> : null}
            />
        </div>
    );
};

export default Inventory;