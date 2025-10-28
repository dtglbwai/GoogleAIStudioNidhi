import React, { useMemo } from 'react';
import DataTable from '../components/DataTable';
import type { Application } from '../types';
import { ApplicationType } from '../types';
import StatusBadge from '../components/StatusBadge';
import { formatCurrency } from '../utils/formatters';

interface ApplicationsProps {
  applications: Application[];
}

const Applications: React.FC<ApplicationsProps> = ({ applications }) => {
  const leaseApplications = useMemo(() => 
    applications.filter(app => app.type === ApplicationType.AUTO_LEASE && app.status !== 'Pending' && app.status !== 'Submitted' && app.status !== 'In Review'),
    [applications]
  );

  const columns = [
    { header: 'Application ID', accessor: 'id' as keyof Application, render: (row: Application) => <span className="font-mono text-xs">{row.id}</span> },
    { header: 'Applicant Name', accessor: 'applicant' as keyof Application, render: (row: Application) => row.applicant.name },
    { header: 'Type', accessor: 'type' as keyof Application },
    { header: 'Amount', accessor: 'amount' as keyof Application, render: (row: Application) => formatCurrency(row.amount) },
    { header: 'Submitted Date', accessor: 'submittedDate' as keyof Application },
    { header: 'Status', accessor: 'status' as keyof Application, render: (row: Application) => <StatusBadge status={row.status} /> },
    { header: 'Actions', accessor: 'id' as keyof Application, render: (row: Application) => <button onClick={() => alert(`Viewing details for application ${row.id}. Detailed view coming soon!`)} className="font-semibold text-primary hover:text-primary-dark">View Details</button> },
  ];

  return (
    <div className="animate-fade-in">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Lease Applications</h2>
       <DataTable
          columns={columns}
          data={leaseApplications}
          title="All Processed Lease Applications"
        />
    </div>
  );
};

export default Applications;