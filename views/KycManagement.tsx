
import React, { useState } from 'react';
import DataTable, { Column } from '../components/DataTable';
import type { KycCompany, KycCustomer, Document } from './types';
import { KycStatus } from './types';
import StatusBadge from '../components/StatusBadge';
import DocumentPreviewModal from '../components/DocumentPreviewModal';
import { NewCompanyKycModal, NewCustomerKycModal } from '../components/ActionModals';
import { useAppContext } from '../AppContext';

const KycManagement: React.FC = () => {
  const { kycCompanies, kycCustomers, handleVerifyKyc, handlePushToCkyc, currentUser } = useAppContext();
  const [activeTab, setActiveTab] = useState<'company' | 'customer'>('company');
  const [verifyingId, setVerifyingId] = useState<string | null>(null);
  const [pushingId, setPushingId] = useState<string | null>(null);

  const [selectedEntity, setSelectedEntity] = useState<{ name: string; documents: Document[] } | null>(null);
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);

  const onVerify = (id: string, type: 'company' | 'customer') => {
    setVerifyingId(id);
    handleVerifyKyc(id, type);
    setTimeout(() => setVerifyingId(null), 2000); // UI feedback timer
  };
  
  const onPushToCkyc = (id: string, type: 'company' | 'customer') => {
    setPushingId(id);
    handlePushToCkyc(id, type);
    setTimeout(() => setPushingId(null), 2000); // UI feedback timer
  };

  const companyColumns: Column<KycCompany>[] = [
    { header: 'Company Name', accessor: 'companyName' },
    { header: 'GSTIN', accessor: 'gstin' },
    { header: 'CKYC Identifier', accessor: 'ckycIdentifier', render: (row: KycCompany) => row.ckycIdentifier || 'N/A' },
    { header: 'Status', accessor: 'status', render: (row: KycCompany) => <StatusBadge status={row.status === KycStatus.VERIFIED && row.ckycStatus === 'Uploaded' ? KycStatus.UPLOADED_CKYC : row.status} /> },
    { header: 'Actions', accessor: 'id', render: (row: KycCompany) => (
      <div className="flex items-center space-x-4">
        {currentUser !== 'Auditor' && (
          <>
            {row.status === KycStatus.PENDING && (
                <button 
                  onClick={() => onVerify(row.id, 'company')} 
                  disabled={!!verifyingId}
                  className="font-semibold text-primary hover:text-primary-dark disabled:text-gray-400"
                >
                  {verifyingId === row.id ? 'Verifying...' : 'Verify'}
                </button>
            )}
            {row.status === KycStatus.VERIFIED && row.ckycStatus === 'Pending' && (
                 <button 
                  onClick={() => onPushToCkyc(row.id, 'company')} 
                  disabled={!!pushingId}
                  className="font-semibold text-blue-600 hover:text-blue-800 disabled:text-gray-400"
                >
                  {pushingId === row.id ? 'Pushing...' : 'Push to CKYC'}
                </button>
            )}
          </>
        )}
        <button onClick={() => setSelectedEntity({ name: row.companyName, documents: row.documents })} className="font-semibold text-gray-600 hover:text-gray-800">Docs</button>
      </div>
    )},
  ];
  
  const customerColumns: Column<KycCustomer>[] = [
    { header: 'Customer Name', accessor: 'customerName' },
    { header: 'PAN', accessor: 'pan' },
    { header: 'CKYC Identifier', accessor: 'ckycIdentifier', render: (row: KycCustomer) => row.ckycIdentifier || 'N/A' },
    { header: 'Status', accessor: 'status', render: (row: KycCustomer) => <StatusBadge status={row.status === KycStatus.VERIFIED && row.ckycStatus === 'Uploaded' ? KycStatus.UPLOADED_CKYC : row.status} /> },
    { header: 'Actions', accessor: 'id', render: (row: KycCustomer) => (
       <div className="flex items-center space-x-4">
        {currentUser !== 'Auditor' && (
            <>
                {row.status === KycStatus.PENDING && (
                    <button 
                      onClick={() => onVerify(row.id, 'customer')} 
                      disabled={!!verifyingId}
                      className="font-semibold text-primary hover:text-primary-dark disabled:text-gray-400"
                    >
                      {verifyingId === row.id ? 'Verifying with UIDAI...' : 'Verify'}
                    </button>
                )}
                {row.status === KycStatus.VERIFIED && row.ckycStatus === 'Pending' && (
                     <button 
                      onClick={() => onPushToCkyc(row.id, 'customer')} 
                      disabled={!!pushingId}
                      className="font-semibold text-blue-600 hover:text-blue-800 disabled:text-gray-400"
                    >
                      {pushingId === row.id ? 'Pushing...' : 'Push to CKYC'}
                    </button>
                )}
            </>
        )}
        <button onClick={() => setSelectedEntity({ name: row.customerName, documents: row.documents })} className="font-semibold text-gray-600 hover:text-gray-800">Docs</button>
      </div>
    )},
  ];

  return (
    <div className="animate-fade-in">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">KYC Management</h2>
      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button onClick={() => setActiveTab('company')} className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'company' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
            Company KYC
          </button>
          <button onClick={() => setActiveTab('customer')} className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'customer' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
            Customer KYC
          </button>
        </nav>
      </div>

      {activeTab === 'company' && (
        <DataTable
          columns={companyColumns}
          data={kycCompanies}
          title="Company KYC Submissions"
          actionButton={currentUser !== 'Auditor' ? <button onClick={() => setIsCompanyModalOpen(true)} className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors shadow-sm">Add New Company</button> : null}
        />
      )}
      {activeTab === 'customer' && (
        <DataTable
          columns={customerColumns}
          data={kycCustomers}
          title="Customer KYC Submissions"
          actionButton={currentUser !== 'Auditor' ? <button onClick={() => setIsCustomerModalOpen(true)} className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors shadow-sm">Add New Customer</button> : null}
        />
      )}
      <DocumentPreviewModal 
        entity={selectedEntity} 
        onClose={() => setSelectedEntity(null)} 
      />
      <NewCompanyKycModal 
        isOpen={isCompanyModalOpen} 
        onClose={() => setIsCompanyModalOpen(false)} 
      />
      <NewCustomerKycModal 
        isOpen={isCustomerModalOpen}
        onClose={() => setIsCustomerModalOpen(false)}
      />
    </div>
  );
};

export default KycManagement;