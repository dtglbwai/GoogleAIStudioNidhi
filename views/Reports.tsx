
import React from 'react';
import DataTable, { Column } from '../components/DataTable';
import type { ComplianceTask } from './types';
import { ComplianceTaskStatus } from './types';
import StatusBadge from '../components/StatusBadge';
import { useAppContext } from '../AppContext';
import ReportsIcon from '../components/icons/ReportsIcon';
import FileIcon from '../components/icons/FileIcon';

const ReportCard: React.FC<{ title: string; description: string; icon: React.ReactNode; onGenerate: () => void; }> = ({ title, description, icon, onGenerate }) => (
    <button onClick={onGenerate} className="bg-white p-6 rounded-xl shadow-md text-left hover:shadow-lg hover:border-primary border-transparent border transition-all flex items-start space-x-4 w-full">
        <div className="bg-primary-light p-3 rounded-lg text-primary flex-shrink-0">
            {icon}
        </div>
        <div>
            <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
            <p className="text-sm text-gray-500 mt-1">{description}</p>
        </div>
    </button>
);


const Reports: React.FC = () => {
  const { complianceTasks, currentUser } = useAppContext();

  const columns: Column<ComplianceTask>[] = [
    { header: 'Task', accessor: 'title' },
    { header: 'Type', accessor: 'type' },
    { header: 'Due Date', accessor: 'dueDate' },
    { header: 'Status', accessor: 'status', render: (row: ComplianceTask) => <StatusBadge status={row.status} /> },
    { header: 'Actions', accessor: 'id', render: (row: ComplianceTask) => currentUser !== 'Auditor' ? <button className="font-semibold text-primary hover:text-primary-dark">Update Status</button> : <span className="text-xs text-gray-400">Read-only</span> },
  ];

  return (
    <div className="animate-fade-in">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Compliance & Reports</h2>
      
      <div className="mb-8">
        <DataTable
          columns={columns}
          data={complianceTasks}
          title="Compliance Calendar & Checklist"
        />
      </div>

      <div>
        <h3 className="text-2xl font-bold text-gray-800 mb-4">Report Generation Center</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ReportCard 
                title="Asset-Liability Management (ALM)" 
                description="Generate ALM statement as per RBI guidelines." 
                icon={<ReportsIcon />}
                onGenerate={() => alert('Generating ALM Report... (Data simulation)')}
            />
             <ReportCard 
                title="MCA Annual Filings Data" 
                description="Prepare data pack for AOC-4 and MGT-7 filings." 
                icon={<FileIcon />}
                onGenerate={() => alert('Preparing data for MCA filings... (Data simulation)')}
            />
            <ReportCard 
                title="RBI NBS-7 Return" 
                description="Quarterly return on prudential norms." 
                icon={<FileIcon />}
                onGenerate={() => alert('Generating NBS-7 Return... (Data simulation)')}
            />
        </div>
      </div>
    </div>
  );
};

export default Reports;