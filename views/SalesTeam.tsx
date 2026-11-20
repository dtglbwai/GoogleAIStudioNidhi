import React from 'react';
import DataTable, { Column } from '../components/DataTable';
import { useAppContext } from '../AppContext';
import { formatCurrency } from '../utils/formatters';

const SalesTeam: React.FC = () => {
  // Mock data for sales team
  const salesTeamData = [
    { id: '1', name: 'Ravi Kumar', role: 'Sales Head', region: 'North', target: 5000000, achieved: 4500000 },
    { id: '2', name: 'Sunita Sharma', role: 'Sales Manager', region: 'West', target: 3000000, achieved: 3200000 },
    { id: '3', name: 'Amit Patel', role: 'Field Agent', region: 'West', target: 1000000, achieved: 950000 },
    { id: '4', name: 'Priya Singh', role: 'Field Agent', region: 'North', target: 1000000, achieved: 1100000 },
  ];

  const columns: Column<typeof salesTeamData[0]>[] = [
    { header: 'Name', accessor: 'name' },
    { header: 'Role', accessor: 'role' },
    { header: 'Region', accessor: 'region' },
    { header: 'Target', accessor: 'target', render: (row: any) => formatCurrency(row.target) },
    { header: 'Achieved', accessor: 'achieved', render: (row: any) => formatCurrency(row.achieved) },
    { header: 'Performance', accessor: 'id', render: (row: any) => {
        const performance = (row.achieved / row.target) * 100;
        const color = performance >= 100 ? 'text-green-600' : 'text-orange-600';
        return <span className={`font-bold ${color}`}>{performance.toFixed(1)}%</span>
    }},
  ];

  return (
    <div className="animate-fade-in">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Sales Team Management</h2>
      <DataTable
        columns={columns}
        data={salesTeamData}
        title="Team Performance Overview"
      />
    </div>
  );
};

export default SalesTeam;