import React from 'react';
import DataTable from '../components/DataTable';
import type { Item } from '../types';
import { formatCurrency } from '../utils/formatters';

const mockItems: Item[] = [
    { id: 'item-1', name: 'Dell Latitude Laptop', sku: 'LP-DELL-LAT-I5', salePrice: 85000, purchasePrice: 62000, stock: 15, hsnCode: '84713010' },
    { id: 'item-2', name: 'Logitech Wireless Mouse', sku: 'MO-LOGI-MXM3', salePrice: 8000, purchasePrice: 5500, stock: 48, hsnCode: '84716060' },
    { id: 'item-3', name: 'Samsung 27" Monitor', sku: 'MN-SAM-ODSY-G7', salePrice: 32000, purchasePrice: 25000, stock: 22, hsnCode: '85285200' },
    { id: 'item-4', name: 'Office Chair - High Back', sku: 'CH-ERG-HB-BLK', salePrice: 12000, purchasePrice: 7800, stock: 35, hsnCode: '94013000' },
    { id: 'item-5', name: 'Printer Paper Ream (500)', sku: 'ST-PPR-A4-75G', salePrice: 450, purchasePrice: 320, stock: 150, hsnCode: '48025690' },
];

const Inventory: React.FC = () => {
    const columns = [
        { header: 'Item Name', accessor: 'name' as keyof Item },
        { header: 'SKU', accessor: 'sku' as keyof Item },
        { header: 'Sale Price', accessor: 'salePrice' as keyof Item, render: (row: Item) => formatCurrency(row.salePrice) },
        { header: 'Purchase Price', accessor: 'purchasePrice' as keyof Item, render: (row: Item) => formatCurrency(row.purchasePrice) },
        { header: 'Stock on Hand', accessor: 'stock' as keyof Item, render: (row: Item) => <span className={`font-bold ${row.stock < 20 ? 'text-red-500' : 'text-gray-800'}`}>{row.stock} units</span> },
        { header: 'HSN Code', accessor: 'hsnCode' as keyof Item },
        { header: 'Actions', accessor: 'id' as keyof Item, render: (row: Item) => <button className="font-semibold text-primary hover:text-primary-dark">Adjust Stock</button> },
    ];

    return (
        <div className="animate-fade-in">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Item & Stock Management</h2>
            <DataTable
                columns={columns}
                data={mockItems}
                title="All Items"
                actionButton={<button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors shadow-sm">Add New Item</button>}
            />
        </div>
    );
};

export default Inventory;
