
import React, { useState } from 'react';
import DataTable, { Column } from '../components/DataTable';
import type { AgreementTemplate, GeneratedAgreement } from './types';
import { useAppContext } from '../AppContext';
import StatusBadge from '../components/StatusBadge';

const Agreements: React.FC = () => {
    const { agreementTemplates, generatedAgreements, applications, currentUser } = useAppContext();
    const [activeTab, setActiveTab] = useState<'templates' | 'generated'>('generated');

    const templateColumns: Column<AgreementTemplate>[] = [
        { header: 'Template Name', accessor: 'name' },
        { header: 'Type', accessor: 'type' },
        { header: 'Created At', accessor: 'createdAt' },
        { header: 'Actions', accessor: 'id', render: (row: AgreementTemplate) => <button className="font-semibold text-primary hover:text-primary-dark">Edit</button> },
    ];

    const generatedColumns: Column<GeneratedAgreement>[] = [
        { header: 'Applicant', accessor: 'applicationId', render: (row: GeneratedAgreement) => applications.find(a => a.id === row.applicationId)?.applicant.name || 'N/A' },
        { header: 'Agreement Type', accessor: 'type' },
        { header: 'Generated At', accessor: 'generatedAt' },
        { header: 'Signed At', accessor: 'signedAt', render: (row: GeneratedAgreement) => row.signedAt || 'Not Signed' },
        { header: 'Status', accessor: 'status', render: (row: GeneratedAgreement) => <StatusBadge status={row.status as any} /> },
        { header: 'Actions', accessor: 'id', render: (row: GeneratedAgreement) => <button className="font-semibold text-primary hover:text-primary-dark">View/Download</button> },
    ];
    
    const TabButton: React.FC<{ view: 'templates' | 'generated', label: string }> = ({ view, label }) => (
        <button onClick={() => setActiveTab(view)} className={`py-3 px-4 font-medium text-sm transition-colors rounded-t-lg ${activeTab === view ? 'border-b-2 border-primary text-primary' : 'text-gray-500 hover:text-gray-700'}`}>
            {label}
        </button>
    );

  return (
    <div className="animate-fade-in">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Agreements & Legal</h2>
        <div className="mb-4 border-b border-gray-200">
            <nav className="-mb-px flex space-x-6">
                <TabButton view="generated" label="Generated Agreements" />
                <TabButton view="templates" label="Agreement Templates" />
            </nav>
        </div>

        {activeTab === 'generated' && (
            <DataTable
                columns={generatedColumns}
                data={generatedAgreements}
                title="All Generated Agreements"
            />
        )}

        {activeTab === 'templates' && (
             <DataTable
                columns={templateColumns}
                data={agreementTemplates}
                title="Agreement Templates"
                actionButton={currentUser === 'Super Admin' ? <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark">New Template</button> : null}
            />
        )}
    </div>
  );
};

export default Agreements;
