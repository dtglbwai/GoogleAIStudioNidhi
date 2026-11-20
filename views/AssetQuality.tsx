import React, { useMemo, useState } from 'react';
import DataTable, { Column } from '../components/DataTable';
import type { Loan } from './types';
import { AssetClass } from './types';
import { formatCurrency } from '../utils/formatters';
import { useAppContext } from '../AppContext';
import { MakeProvisionModal } from '../components/ActionModals';
import ShieldIcon from '../components/icons/ShieldIcon';

const AssetCard: React.FC<{ title: string; count: number; value: number; color: string }> = ({ title, count, value, color }) => (
    <div className={`bg-white p-6 rounded-xl shadow-md border-l-4`} style={{ borderColor: color }}>
        <div className="flex justify-between items-center">
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <span className="text-2xl" style={{ color }}> <ShieldIcon /></span>
        </div>
        <p className="text-3xl font-bold text-gray-800 mt-2">{count}</p>
        <p className="text-sm font-semibold text-gray-600">{formatCurrency(value)}</p>
    </div>
);


const AssetQuality: React.FC = () => {
  const { loans, homeLoans, businessLoans, industryLoans, currentUser } = useAppContext();
  const [provisionLoan, setProvisionLoan] = useState<Loan | null>(null);

  const allLoans = useMemo(() => [...loans, ...homeLoans, ...businessLoans, ...industryLoans], [loans, homeLoans, businessLoans, industryLoans]);

  const assetStats = useMemo(() => {
    return allLoans.reduce((acc, loan) => {
        if (!acc[loan.assetClass]) {
            acc[loan.assetClass] = { count: 0, value: 0 };
        }
        acc[loan.assetClass].count++;
        acc[loan.assetClass].value += loan.principalAmount;
        return acc;
    }, {} as Record<string, { count: number; value: number }>);
  }, [allLoans]);

  const npaLoans = useMemo(() => allLoans.filter(l => [AssetClass.SUB_STANDARD, AssetClass.DOUBTFUL, AssetClass.LOSS].includes(l.assetClass)), [allLoans]);
  
  const columns: Column<Loan>[] = [
    { header: 'Applicant', accessor: 'applicantName' },
    { header: 'Principal', accessor: 'principalAmount', render: (row: Loan) => formatCurrency(row.principalAmount) },
    { header: 'Days Past Due', accessor: 'daysPastDue' },
    { header: 'Asset Class', accessor: 'assetClass' },
    { header: 'Actions', accessor: 'id', render: (row: Loan) => (
      currentUser !== 'Auditor' ? <button onClick={() => setProvisionLoan(row)} className="font-semibold text-primary hover:text-primary-dark">Make Provision</button> : null
    )},
  ];

  const ASSET_COLORS: Record<string, string> = {
    [AssetClass.STANDARD]: '#10b981',
    [AssetClass.SMA_0]: '#facc15',
    [AssetClass.SMA_1]: '#f59e0b',
    [AssetClass.SMA_2]: '#f97316',
    [AssetClass.SUB_STANDARD]: '#ef4444',
    [AssetClass.DOUBTFUL]: '#b91c1c',
    [AssetClass.LOSS]: '#7f1d1d',
  };

  return (
    <div className="animate-fade-in">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Asset Quality & Provisioning</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {Object.keys(assetStats).map((title) => {
                const data = assetStats[title];
                return <AssetCard key={title} title={title} count={data.count} value={data.value} color={ASSET_COLORS[title] || '#64748b'} />;
            })}
        </div>

        <DataTable
            columns={columns}
            data={npaLoans}
            title="Non-Performing Assets (NPA)"
        />

        <MakeProvisionModal
            isOpen={!!provisionLoan}
            onClose={() => setProvisionLoan(null)}
            loan={provisionLoan}
        />
    </div>
  );
};

export default AssetQuality;