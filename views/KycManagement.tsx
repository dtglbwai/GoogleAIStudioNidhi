import React, { useState } from 'react';
import DataTable from '../components/DataTable';
import type { CompanyKyc, CustomerKyc, Document } from '../types';
import { KycStatus, DocumentType } from '../types';
import StatusBadge from '../components/StatusBadge';
import DocumentPreviewModal from '../components/DocumentPreviewModal';
import { NewCompanyKycModal, NewCustomerKycModal } from '../components/ActionModals';

const mockCompanyKycData: CompanyKyc[] = [
  { id: '1', companyName: 'Innovate Solutions Pvt. Ltd.', registrationDate: '2022-01-15', gstin: '29ABCDE1234F1Z5', pan: 'ABCDE1234F', status: KycStatus.VERIFIED, registeredAddress: '123 Tech Park, Bangalore', directors: [], documents: [
      { id: 'cdoc1', name: 'Incorporation_Cert.pdf', url: '#', uploadedAt: '2022-01-10', type: DocumentType.INCORPORATION_CERT },
      { id: 'cdoc2', name: 'Innovate_PAN.pdf', url: '#', uploadedAt: '2022-01-10', type: DocumentType.PAN },
      { id: 'cdoc3', name: 'Innovate_GST.pdf', url: '#', uploadedAt: '2022-01-11', type: DocumentType.GST_CERT },
  ] },
  { id: '2', companyName: 'Bharat Enterprises', registrationDate: '2023-03-20', gstin: '27FGHIJ5678K1Z9', pan: 'FGHIJ5678K', status: KycStatus.PENDING, registeredAddress: '456 Commerce St, Mumbai', directors: [], documents: [] },
  { id: '3', companyName: 'Sunrise Textiles', registrationDate: '2021-11-05', gstin: '24LMNOP9012Q1Z3', pan: 'LMNOP9012Q', status: KycStatus.REJECTED, registeredAddress: '789 Industrial Area, Surat', directors: [], documents: [
      { id: 'cdoc4', name: 'Sunrise_PAN.pdf', url: '#', uploadedAt: '2021-11-01', type: DocumentType.PAN },
  ] },
  { id: '4', companyName: 'Quick Logistics', registrationDate: '2023-05-10', gstin: '33RSTUV3456W1Z7', pan: 'RSTUV3456W', status: KycStatus.PENDING, registeredAddress: '101 Highway Road, Delhi', directors: [], documents: [] },
];

const mockCustomerKycData: CustomerKyc[] = [
  { id: '1', customerName: 'Ramesh Kumar', submissionDate: '2023-06-01', aadhaar: 'XXXX-XXXX-1234', pan: 'JKLMN0987P', status: KycStatus.VERIFIED, address: 'A-10, Green Avenue, Chennai', phone: '9876543210', email: 'ramesh@email.com', documents: [
      { id: 'doc1', name: 'Ramesh_PAN.pdf', url: '#', uploadedAt: '2023-05-20', type: DocumentType.PAN },
      { id: 'doc2', name: 'Ramesh_Aadhaar.pdf', url: '#', uploadedAt: '2023-05-20', type: DocumentType.AADHAAR },
      { id: 'doc3', name: 'Ramesh_Bank_Statement.pdf', url: '#', uploadedAt: '2023-05-21', type: DocumentType.BANK_STATEMENT },
  ] },
  { id: '2', customerName: 'Sunita Sharma', submissionDate: '2023-06-02', aadhaar: 'XXXX-XXXX-5678', pan: 'PQRST4321U', status: KycStatus.PENDING, address: 'B-20, Royal Apartments, Pune', phone: '9876543211', email: 'sunita@email.com', documents: [
      { id: 'doc4', name: 'Sunita_PAN.pdf', url: '#', uploadedAt: '2023-06-01', type: DocumentType.PAN },
      { id: 'doc5', name: 'Sunita_Aadhaar.pdf', url: '#', uploadedAt: '2023-06-01', type: DocumentType.AADHAAR },
  ] },
  { id: '3', customerName: 'Amit Patel', submissionDate: '2023-06-03', aadhaar: 'XXXX-XXXX-9012', pan: 'VWXYZ5678A', status: KycStatus.VERIFIED, address: 'C-30, Sky Towers, Ahmedabad', phone: '9876543212', email: 'amit@email.com', documents: [] },
  { id: '4', customerName: 'Priya Singh', submissionDate: '2023-06-04', aadhaar: 'XXXX-XXXX-3456', pan: 'BCDEF1234G', status: KycStatus.REJECTED, address: 'D-40, Lakeview Residency, Kolkata', phone: '9876543213', email: 'priya@email.com', documents: [
      { id: 'doc6', name: 'Priya_PAN.pdf', url: '#', uploadedAt: '2023-06-02', type: DocumentType.PAN },
  ] },
];

const KycManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'company' | 'customer'>('company');
  const [companyKyc, setCompanyKyc] = useState<CompanyKyc[]>(mockCompanyKycData);
  const [customerKyc, setCustomerKyc] = useState<CustomerKyc[]>(mockCustomerKycData);
  const [verifyingId, setVerifyingId] = useState<string | null>(null);

  const [selectedEntity, setSelectedEntity] = useState<{ name: string; documents: Document[] } | null>(null);
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);

  const handleVerify = (id: string) => {
    setVerifyingId(id);
    setTimeout(() => {
      setCompanyKyc(prev => prev.map(c => c.id === id ? { ...c, status: KycStatus.VERIFIED } : c));
      setVerifyingId(null);
    }, 1500);
  };
  
  const handleAddCompany = (newCompany: Omit<CompanyKyc, 'id' | 'status' | 'documents'>) => {
    const company: CompanyKyc = {
      ...newCompany,
      id: `comp-${Date.now()}`,
      status: KycStatus.PENDING,
      documents: [],
    };
    setCompanyKyc(prev => [company, ...prev]);
    setIsCompanyModalOpen(false);
  };

  const handleAddCustomer = (newCustomer: Omit<CustomerKyc, 'id' | 'status' | 'documents'>) => {
    const customer: CustomerKyc = {
      ...newCustomer,
      id: `cust-${Date.now()}`,
      status: KycStatus.PENDING,
      documents: [],
    };
    setCustomerKyc(prev => [customer, ...prev]);
    setIsCustomerModalOpen(false);
  };

  const companyColumns = [
    { header: 'Company Name', accessor: 'companyName' as keyof CompanyKyc },
    { header: 'GSTIN', accessor: 'gstin' as keyof CompanyKyc },
    { header: 'PAN', accessor: 'pan' as keyof CompanyKyc },
    { header: 'Registration Date', accessor: 'registrationDate' as keyof CompanyKyc },
    { header: 'Status', accessor: 'status' as keyof CompanyKyc, render: (row: CompanyKyc) => <StatusBadge status={row.status} /> },
    { header: 'Actions', accessor: 'id' as keyof CompanyKyc, render: (row: CompanyKyc) => (
      <div className="flex items-center space-x-4">
        <button 
          onClick={() => handleVerify(row.id)} 
          disabled={verifyingId === row.id || row.status === KycStatus.VERIFIED}
          className="font-semibold text-primary hover:text-primary-dark disabled:text-gray-400 disabled:cursor-not-allowed"
        >
          {verifyingId === row.id ? 'Verifying...' : 'Verify'}
        </button>
        <button onClick={() => setSelectedEntity({ name: row.companyName, documents: row.documents })} className="font-semibold text-gray-600 hover:text-gray-800">View Docs</button>
      </div>
    )},
  ];
  
  const customerColumns = [
    { header: 'Customer Name', accessor: 'customerName' as keyof CustomerKyc },
    { header: 'Aadhaar (Last 4)', accessor: 'aadhaar' as keyof CustomerKyc },
    { header: 'PAN', accessor: 'pan' as keyof CustomerKyc },
    { header: 'Submission Date', accessor: 'submissionDate' as keyof CustomerKyc },
    { header: 'Status', accessor: 'status' as keyof CustomerKyc, render: (row: CustomerKyc) => <StatusBadge status={row.status} /> },
    { header: 'Actions', accessor: 'id' as keyof CustomerKyc, render: (row: CustomerKyc) => <button onClick={() => setSelectedEntity({ name: row.customerName, documents: row.documents })} className="font-semibold text-primary hover:text-primary-dark">View Docs</button> },
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
          data={companyKyc}
          title="Company KYC Submissions"
          actionButton={<button onClick={() => setIsCompanyModalOpen(true)} className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors shadow-sm">Add New Company</button>}
        />
      )}
      {activeTab === 'customer' && (
        <DataTable
          columns={customerColumns}
          data={customerKyc}
          title="Customer KYC Submissions"
          actionButton={<button onClick={() => setIsCustomerModalOpen(true)} className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors shadow-sm">Add New Customer</button>}
        />
      )}
      <DocumentPreviewModal 
        entity={selectedEntity} 
        onClose={() => setSelectedEntity(null)} 
      />
      <NewCompanyKycModal 
        isOpen={isCompanyModalOpen} 
        onClose={() => setIsCompanyModalOpen(false)} 
        onAddCompany={handleAddCompany}
      />
      <NewCustomerKycModal 
        isOpen={isCustomerModalOpen}
        onClose={() => setIsCustomerModalOpen(false)}
        onAddCustomer={handleAddCustomer}
      />
    </div>
  );
};

export default KycManagement;
