
import React, { useMemo, useState } from 'react';
import { useAppContext } from '../AppContext';
import DataTable, { Column } from '../components/DataTable';
import DmsIcon from '../components/icons/DmsIcon';
import type { Document } from './types';

interface UnifiedDocument {
  id: string; // Composite key for React
  doc: Document;
  entityType: 'Application' | 'Company KYC' | 'Customer KYC' | 'Legal Case' | 'Vehicle';
  entityId: string;
  entityName: string;
}

const DMS: React.FC = () => {
  const { applications, kycCompanies, kycCustomers, legalCases, vehicles, currentUser } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');

  const allDocuments = useMemo((): UnifiedDocument[] => {
    const docs: UnifiedDocument[] = [];

    applications.forEach(app => {
      app.documents.forEach(doc => {
        docs.push({
          id: `${app.id}-${doc.id}`,
          doc,
          entityType: 'Application',
          entityId: app.id,
          entityName: app.applicant.name
        });
      });
    });

    kycCompanies.forEach(c => {
      c.documents.forEach(doc => {
        docs.push({
          id: `${c.id}-${doc.id}`,
          doc,
          entityType: 'Company KYC',
          entityId: c.id,
          entityName: c.companyName
        });
      });
    });

    kycCustomers.forEach(c => {
      c.documents.forEach(doc => {
        docs.push({
          id: `${c.id}-${doc.id}`,
          doc,
          entityType: 'Customer KYC',
          entityId: c.id,
          entityName: c.customerName
        });
      });
    });
    
    legalCases.forEach(lc => {
      lc.documents.forEach(doc => {
        docs.push({
          id: `${lc.id}-${doc.id}`,
          doc,
          entityType: 'Legal Case',
          entityId: lc.id,
          entityName: `Case #${lc.caseNumber}`
        });
      });
    });

    vehicles.forEach(v => {
      v.documents.forEach(doc => {
        docs.push({
          id: `${v.id}-${doc.id}`,
          doc,
          entityType: 'Vehicle',
          entityId: v.id,
          entityName: `${v.make} ${v.model} (${v.registrationNumber})`
        });
      });
    });
    
    return docs.sort((a, b) => new Date(b.doc.uploadedAt).getTime() - new Date(a.doc.uploadedAt).getTime());
  }, [applications, kycCompanies, kycCustomers, legalCases, vehicles]);
  
  const filteredDocuments = useMemo(() => {
    if (!searchTerm) return allDocuments;
    const lowercasedFilter = searchTerm.toLowerCase();
    return allDocuments.filter(item =>
        item.doc.name.toLowerCase().includes(lowercasedFilter) ||
        item.doc.type.toLowerCase().includes(lowercasedFilter) ||
        item.entityName.toLowerCase().includes(lowercasedFilter) ||
        item.entityId.toLowerCase().includes(lowercasedFilter)
    );
  }, [allDocuments, searchTerm]);

  const columns: Column<UnifiedDocument>[] = [
    { header: 'Document Type', accessor: 'doc', render: (row) => row.doc.type },
    { header: 'Document Name', accessor: 'doc', render: (row) => row.doc.name },
    { header: 'Associated Entity', accessor: 'entityName', render: (row) => (
      <div>
        <div className="font-semibold text-gray-800">{row.entityName}</div>
        <div className="text-xs text-gray-500">{row.entityType} - ID: {row.entityId.slice(-6)}</div>
      </div>
    )},
    { header: 'Upload Date', accessor: 'doc', render: (row) => row.doc.uploadedAt },
    { header: 'Actions', accessor: 'id', render: (row) => <a href={row.doc.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-primary hover:text-primary-dark">View Document</a> },
  ];

  return (
    <div className="animate-fade-in">
        <div className="flex items-center space-x-3 mb-6">
            <div className="bg-primary-light p-3 rounded-full text-primary">
                <DmsIcon />
            </div>
            <h2 className="text-3xl font-bold text-gray-800">Document Management System</h2>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-md mb-8">
            <div className="flex justify-between items-center">
                <div className="relative w-full max-w-md">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    </div>
                    <input
                        type="text"
                        placeholder="Search by name, type, entity..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full p-2 pl-10 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                    />
                </div>
                {currentUser !== 'Auditor' && (
                    <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors shadow-sm">
                        Upload Document
                    </button>
                )}
            </div>
        </div>

        <DataTable
            columns={columns}
            data={filteredDocuments}
            title="Central Document Repository"
        />
    </div>
  );
};

export default DMS;
