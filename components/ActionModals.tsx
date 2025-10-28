import React, { useState } from 'react';
import Modal from './Modal';
import type { Application, Loan, Vehicle, User, Lender, Lendee, Transaction, CompanyKyc, CustomerKyc } from '../types';
import { TransactionType, PaymentMode, ApplicationType } from '../types';
import { formatCurrency } from '../utils/formatters';

// --- Reusable Form Components ---
const FormRow: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => <div className={`grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 ${className}`}>{children}</div>;
const FormField: React.FC<{ label: string; children: React.ReactNode; }> = ({ label, children }) => <div><label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>{children}</div>;
const TextInput = (props: React.InputHTMLAttributes<HTMLInputElement>) => <input {...props} className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-sm" />;
const SelectInput: React.FC<React.SelectHTMLAttributes<HTMLSelectElement>> = ({ children, ...props }) => <select {...props} className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-sm bg-white">{children}</select>;
const DetailItem: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => <div className="py-2"><p className="text-xs text-gray-500">{label}</p><p className="text-md text-gray-800 font-medium">{value}</p></div>;


// --- NewApplicantApplicationModal ---
export const NewApplicantApplicationModal: React.FC<{isOpen: boolean; onClose: () => void; onAddApplication: (data: Omit<Application, 'id'|'submittedDate'|'status'|'documents'>) => void;}> = ({ isOpen, onClose, onAddApplication }) => {
  const [appType, setAppType] = useState<ApplicationType>(ApplicationType.MSME_LOAN);
  const [applicantType, setApplicantType] = useState<'Individual' | 'Company'>('Individual');

  const [formData, setFormData] = useState({
      name: '', type: 'Individual', phone: '', email: '', pan: '', address: '', aadhaar: '', gstin: '',
      amount: '', interestRate: '', tenureMonths: '',
      make: '', model: '', year: ''
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, [e.target.name]: e.target.value });
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddApplication({ 
        applicant: {
            name: formData.name,
            type: applicantType,
            phone: formData.phone,
            email: formData.email,
            pan: formData.pan,
            address: formData.address,
            aadhaar: applicantType === 'Individual' ? formData.aadhaar : undefined,
            gstin: applicantType === 'Company' ? formData.gstin : undefined,
        },
        type: appType,
        amount: parseFloat(formData.amount),
        interestRate: appType === ApplicationType.MSME_LOAN ? parseFloat(formData.interestRate) : undefined,
        tenureMonths: appType === ApplicationType.MSME_LOAN ? parseInt(formData.tenureMonths) : undefined,
        vehicleDetails: appType === ApplicationType.AUTO_LEASE ? { make: formData.make, model: formData.model, year: parseInt(formData.year) } : undefined,
    });
    onClose(); // Close modal on successful submission
  };

  const footer = <>
    <button type="button" onClick={onClose} className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
    <button type="submit" form="new-applicant-form" className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors shadow-sm">Submit Application</button>
  </>;
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="New Applicant Application" footer={footer}>
      <form id="new-applicant-form" onSubmit={handleSubmit} className="space-y-6">
        <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2 border-b pb-2">Applicant Details</h3>
            <FormRow>
                <FormField label="Applicant Type">
                    <SelectInput value={applicantType} onChange={(e) => setApplicantType(e.target.value as any)}>
                        <option value="Individual">Individual</option>
                        <option value="Company">Company</option>
                    </SelectInput>
                </FormField>
                <FormField label="Full Name / Company Name"><TextInput name="name" onChange={handleChange} required /></FormField>
            </FormRow>
            <FormRow className="mt-4">
                <FormField label="Email"><TextInput type="email" name="email" onChange={handleChange} required /></FormField>
                <FormField label="Phone"><TextInput name="phone" onChange={handleChange} required /></FormField>
            </FormRow>
            <FormRow className="mt-4">
                <FormField label="PAN"><TextInput name="pan" onChange={handleChange} required /></FormField>
                {applicantType === 'Individual' ? (
                    <FormField label="Aadhaar"><TextInput name="aadhaar" onChange={handleChange} /></FormField>
                ) : (
                    <FormField label="GSTIN"><TextInput name="gstin" onChange={handleChange} /></FormField>
                )}
            </FormRow>
             <FormField label="Full Address"><TextInput name="address" onChange={handleChange} required /></FormField>
        </div>

        <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2 border-b pb-2 pt-4">Application Details</h3>
            <FormRow>
                <FormField label="Application Type">
                    <SelectInput value={appType} onChange={(e) => setAppType(e.target.value as ApplicationType)}>
                        <option value={ApplicationType.MSME_LOAN}>MSME Loan</option>
                        <option value={ApplicationType.AUTO_LEASE}>Auto Lease</option>
                    </SelectInput>
                </FormField>
                 <FormField label="Amount Requested (₹)"><TextInput type="number" name="amount" onChange={handleChange} required /></FormField>
            </FormRow>
            {appType === ApplicationType.MSME_LOAN && (
                <FormRow className="mt-4">
                    <FormField label="Tenure (Months)"><TextInput type="number" name="tenureMonths" onChange={handleChange} required /></FormField>
                    <FormField label="Interest Rate (%)"><TextInput type="number" step="0.1" name="interestRate" onChange={handleChange} required /></FormField>
                </FormRow>
            )}
             {appType === ApplicationType.AUTO_LEASE && (
                <>
                    <h4 className="text-md font-semibold text-gray-700 pt-4 mt-4 border-t">Vehicle Details</h4>
                    <FormRow className="mt-4">
                        <FormField label="Make"><TextInput name="make" onChange={handleChange} required /></FormField>
                        <FormField label="Model"><TextInput name="model" onChange={handleChange} required /></FormField>
                    </FormRow>
                    <FormField label="Year"><TextInput type="number" name="year" onChange={handleChange} required /></FormField>
                </>
            )}
        </div>
      </form>
    </Modal>
  );
};

// --- ReviewApplicationModal ---
export const ReviewApplicationModal: React.FC<{
    isOpen: boolean; 
    onClose: () => void; 
    application: Application;
    onApprove: (app: Application) => void;
    onReject: (app: Application) => void;
}> = ({ isOpen, onClose, application, onApprove, onReject }) => {
    
    const footer = <>
        <button type="button" onClick={onClose} className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">Close</button>
        <button type="button" onClick={() => onReject(application)} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-sm">Reject Application</button>
        <button type="button" onClick={() => onApprove(application)} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm">Approve Application</button>
    </>;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Review Application: ${application.applicant.name}`} footer={footer}>
            <div className="space-y-4">
                 <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2 border-b pb-2">Applicant Details</h3>
                    <FormRow>
                        <DetailItem label="Name" value={application.applicant.name} />
                        <DetailItem label="Type" value={application.applicant.type} />
                    </FormRow>
                    <FormRow>
                        <DetailItem label="Email" value={application.applicant.email} />
                        <DetailItem label="Phone" value={application.applicant.phone} />
                    </FormRow>
                    <FormRow>
                        <DetailItem label="PAN" value={application.applicant.pan} />
                        <DetailItem label={application.applicant.type === 'Individual' ? 'Aadhaar' : 'GSTIN'} value={application.applicant.aadhaar || application.applicant.gstin || 'N/A'} />
                    </FormRow>
                    <DetailItem label="Address" value={application.applicant.address} />
                </div>
                 <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2 border-b pb-2">Application Details</h3>
                    <FormRow>
                        <DetailItem label="Application Type" value={application.type} />
                        <DetailItem label="Amount Requested" value={formatCurrency(application.amount)} />
                    </FormRow>
                    {application.type === ApplicationType.MSME_LOAN && (
                        <FormRow>
                           <DetailItem label="Requested Tenure" value={`${application.tenureMonths} months`} />
                           <DetailItem label="Requested Interest Rate" value={`${application.interestRate}%`} />
                        </FormRow>
                    )}
                    {application.type === ApplicationType.AUTO_LEASE && application.vehicleDetails && (
                        <FormRow>
                           <DetailItem label="Vehicle" value={`${application.vehicleDetails.make} ${application.vehicleDetails.model} (${application.vehicleDetails.year})`} />
                        </FormRow>
                    )}
                 </div>
                 <div>
                     <h3 className="text-lg font-semibold text-gray-800 mb-2 border-b pb-2">Documents</h3>
                     <p className="text-sm text-gray-500">Document preview section. (Feature coming soon)</p>
                 </div>
            </div>
        </Modal>
    );
}

// --- NewVehicleModal ---
export const NewVehicleModal: React.FC<{isOpen: boolean; onClose: () => void; onAddVehicle: (data: Omit<Vehicle, 'id'|'status'>) => void;}> = ({ isOpen, onClose, onAddVehicle }) => {
    const [formData, setFormData] = useState({ make: '', model: '', year: '', vin: '', registrationNumber: '', monthlyLeaseRate: '' });
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, [e.target.name]: e.target.value });
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAddVehicle({
            ...formData,
            year: parseInt(formData.year),
            monthlyLeaseRate: parseFloat(formData.monthlyLeaseRate),
        });
        setFormData({ make: '', model: '', year: '', vin: '', registrationNumber: '', monthlyLeaseRate: '' });
    };

    const footer = <>
        <button type="button" onClick={onClose} className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
        <button type="submit" form="new-vehicle-form" className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors shadow-sm">Add Vehicle</button>
    </>;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Add New Vehicle" footer={footer}>
            <form id="new-vehicle-form" onSubmit={handleSubmit} className="space-y-4">
                <FormRow>
                    <FormField label="Make"><TextInput name="make" value={formData.make} onChange={handleChange} required /></FormField>
                    <FormField label="Model"><TextInput name="model" value={formData.model} onChange={handleChange} required /></FormField>
                </FormRow>
                 <FormRow>
                    <FormField label="Year"><TextInput type="number" name="year" value={formData.year} onChange={handleChange} required /></FormField>
                    <FormField label="Monthly Lease Rate (₹)"><TextInput type="number" name="monthlyLeaseRate" value={formData.monthlyLeaseRate} onChange={handleChange} required /></FormField>
                </FormRow>
                <FormRow>
                    <FormField label="VIN"><TextInput name="vin" value={formData.vin} onChange={handleChange} required /></FormField>
                    <FormField label="Registration Number"><TextInput name="registrationNumber" value={formData.registrationNumber} onChange={handleChange} required /></FormField>
                </FormRow>
            </form>
        </Modal>
    );
};

// --- NewUserModal ---
export const NewUserModal: React.FC<{isOpen: boolean; onClose: () => void; onAddUser: (data: Omit<User, 'id'|'lastLogin'>) => void;}> = ({ isOpen, onClose, onAddUser }) => {
    const [formData, setFormData] = useState({ name: '', email: '', role: 'Admin' as User['role']});
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setFormData({ ...formData, [e.target.name]: e.target.value });
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAddUser({ ...formData, role: formData.role as User['role'] });
        setFormData({ name: '', email: '', role: 'Admin' });
    };

    const footer = <>
        <button type="button" onClick={onClose} className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
        <button type="submit" form="new-user-form" className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors shadow-sm">Add User</button>
    </>;
    
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Add New User" footer={footer}>
            <form id="new-user-form" onSubmit={handleSubmit} className="space-y-4">
                <FormField label="Full Name"><TextInput name="name" value={formData.name} onChange={handleChange} required /></FormField>
                <FormField label="Email Address"><TextInput type="email" name="email" value={formData.email} onChange={handleChange} required /></FormField>
                <FormField label="Role">
                    <SelectInput name="role" value={formData.role} onChange={handleChange}>
                        <option value="Admin">Admin</option>
                        <option value="Auditor">Auditor</option>
                    </SelectInput>
                </FormField>
            </form>
        </Modal>
    );
};

// --- RecordPaymentModal ---
export const RecordPaymentModal: React.FC<{isOpen: boolean; onClose: () => void; onAddTransaction: (data: Partial<Transaction>) => void;}> = ({ isOpen, onClose, onAddTransaction }) => {
    const [formData, setFormData] = useState({ description: '', amount: '', type: TransactionType.CREDIT, mode: PaymentMode.UPI, date: new Date().toISOString().split('T')[0] });
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setFormData({ ...formData, [e.target.name]: e.target.value });
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAddTransaction({
            description: formData.description,
            amount: parseFloat(formData.amount),
            type: formData.type,
            mode: formData.mode,
            date: formData.date,
        });
        setFormData({ description: '', amount: '', type: TransactionType.CREDIT, mode: PaymentMode.UPI, date: new Date().toISOString().split('T')[0] });
    };

    const footer = <>
        <button type="button" onClick={onClose} className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
        <button type="submit" form="new-payment-form" className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">Record Payment</button>
    </>;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Record New Payment" footer={footer}>
            <form id="new-payment-form" onSubmit={handleSubmit} className="space-y-4">
                <FormField label="Description"><TextInput name="description" value={formData.description} onChange={handleChange} required /></FormField>
                <FormRow>
                    <FormField label="Amount (₹)"><TextInput type="number" name="amount" value={formData.amount} onChange={handleChange} required /></FormField>
                    <FormField label="Date"><TextInput type="date" name="date" value={formData.date} onChange={handleChange} required /></FormField>
                </FormRow>
                <FormRow>
                    <FormField label="Type">
                        <SelectInput name="type" value={formData.type} onChange={handleChange}>
                            <option value={TransactionType.CREDIT}>Credit (Received)</option>
                            <option value={TransactionType.DEBIT}>Debit (Paid)</option>
                        </SelectInput>
                    </FormField>
                    <FormField label="Payment Mode">
                        <SelectInput name="mode" value={formData.mode} onChange={handleChange}>
                           {Object.values(PaymentMode).map(m => <option key={m} value={m}>{m}</option>)}
                        </SelectInput>
                    </FormField>
                </FormRow>
            </form>
        </Modal>
    );
};

// --- NewLenderModal ---
export const NewLenderModal: React.FC<{isOpen: boolean; onClose: () => void; onAddLender: (data: Omit<Lender, 'id' | 'totalLent' | 'activeLoans'>) => void;}> = ({ isOpen, onClose, onAddLender }) => {
    const [formData, setFormData] = useState({ name: '', type: 'Internal' as Lender['type'], interestShare: '' });
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setFormData({ ...formData, [e.target.name]: e.target.value });
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAddLender({ ...formData, type: formData.type as Lender['type'], interestShare: formData.interestShare ? parseFloat(formData.interestShare) : undefined });
        setFormData({ name: '', type: 'Internal', interestShare: '' });
    };

    const footer = <> <button type="button" onClick={onClose} className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button> <button type="submit" form="new-lender-form" className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors shadow-sm">Add Lender</button> </>;
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Add New Lender" footer={footer}>
            <form id="new-lender-form" onSubmit={handleSubmit} className="space-y-4">
                <FormField label="Lender Name"><TextInput name="name" value={formData.name} onChange={handleChange} required /></FormField>
                <FormField label="Type">
                    <SelectInput name="type" value={formData.type} onChange={handleChange}><option value="Internal">Internal</option><option value="External Partner">External Partner</option></SelectInput>
                </FormField>
                {formData.type === 'External Partner' && <FormField label="Interest Share (%)"><TextInput type="number" name="interestShare" value={formData.interestShare} onChange={handleChange} /></FormField>}
            </form>
        </Modal>
    );
};

// --- NewLendeeModal ---
export const NewLendeeModal: React.FC<{isOpen: boolean; onClose: () => void; onAddLendee: (data: Omit<Lendee, 'id' | 'totalBorrowed' | 'outstandingBalance' | 'activeLoans' | 'status'>) => void;}> = ({ isOpen, onClose, onAddLendee }) => {
    const [formData, setFormData] = useState({ name: '', type: 'Individual' as Lendee['type'], creditScore: '' });
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setFormData({ ...formData, [e.target.name]: e.target.value });
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAddLendee({ ...formData, type: formData.type as Lendee['type'], creditScore: formData.creditScore ? parseInt(formData.creditScore) : undefined });
        setFormData({ name: '', type: 'Individual', creditScore: '' });
    };

    const footer = <> <button type="button" onClick={onClose} className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button> <button type="submit" form="new-lendee-form" className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors shadow-sm">Add Lendee</button> </>;
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Add New Lendee" footer={footer}>
            <form id="new-lendee-form" onSubmit={handleSubmit} className="space-y-4">
                <FormField label="Lendee Name"><TextInput name="name" value={formData.name} onChange={handleChange} required /></FormField>
                <FormField label="Type">
                    <SelectInput name="type" value={formData.type} onChange={handleChange}><option value="Individual">Individual</option><option value="Company">Company</option></SelectInput>
                </FormField>
                <FormField label="Credit Score (Optional)"><TextInput type="number" name="creditScore" value={formData.creditScore} onChange={handleChange} /></FormField>
            </form>
        </Modal>
    );
};

// --- NewCompanyKycModal ---
export const NewCompanyKycModal: React.FC<{isOpen: boolean; onClose: () => void; onAddCompany: (data: Omit<CompanyKyc, 'id'|'status'|'documents'>) => void;}> = ({ isOpen, onClose, onAddCompany }) => {
    const [formData, setFormData] = useState({ companyName: '', registrationDate: '', gstin: '', pan: '', registeredAddress: '' });
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, [e.target.name]: e.target.value });
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAddCompany({ ...formData, directors: [] });
        setFormData({ companyName: '', registrationDate: '', gstin: '', pan: '', registeredAddress: '' });
    };

    const footer = <> <button type="button" onClick={onClose}>Cancel</button> <button type="submit" form="new-company-kyc-form">Add Company</button> </>;
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Add New Company KYC" footer={footer}>
            <form id="new-company-kyc-form" onSubmit={handleSubmit} className="space-y-4">
                <FormField label="Company Name"><TextInput name="companyName" value={formData.companyName} onChange={handleChange} required /></FormField>
                <FormField label="Registration Date"><TextInput type="date" name="registrationDate" value={formData.registrationDate} onChange={handleChange} required /></FormField>
                <FormRow>
                    <FormField label="GSTIN"><TextInput name="gstin" value={formData.gstin} onChange={handleChange} required /></FormField>
                    <FormField label="PAN"><TextInput name="pan" value={formData.pan} onChange={handleChange} required /></FormField>
                </FormRow>
                <FormField label="Registered Address"><TextInput name="registeredAddress" value={formData.registeredAddress} onChange={handleChange} required /></FormField>
            </form>
        </Modal>
    );
};

// --- NewCustomerKycModal ---
export const NewCustomerKycModal: React.FC<{isOpen: boolean; onClose: () => void; onAddCustomer: (data: Omit<CustomerKyc, 'id'|'status'|'documents'>) => void;}> = ({ isOpen, onClose, onAddCustomer }) => {
    const [formData, setFormData] = useState({ customerName: '', submissionDate: '', aadhaar: '', pan: '', address: '', phone: '', email: '' });
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, [e.target.name]: e.target.value });
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAddCustomer(formData);
        setFormData({ customerName: '', submissionDate: '', aadhaar: '', pan: '', address: '', phone: '', email: '' });
    };

    const footer = <> <button type="button" onClick={onClose}>Cancel</button> <button type="submit" form="new-customer-kyc-form">Add Customer</button> </>;
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Add New Customer KYC" footer={footer}>
            <form id="new-customer-kyc-form" onSubmit={handleSubmit} className="space-y-4">
                <FormField label="Customer Name"><TextInput name="customerName" value={formData.customerName} onChange={handleChange} required /></FormField>
                <FormRow>
                    <FormField label="Email"><TextInput type="email" name="email" value={formData.email} onChange={handleChange} required /></FormField>
                    <FormField label="Phone"><TextInput name="phone" value={formData.phone} onChange={handleChange} required /></FormField>
                </FormRow>
                <FormRow>
                    <FormField label="PAN"><TextInput name="pan" value={formData.pan} onChange={handleChange} required /></FormField>
                    <FormField label="Aadhaar (Last 4)"><TextInput name="aadhaar" value={formData.aadhaar} onChange={handleChange} required /></FormField>
                </FormRow>
                <FormField label="Address"><TextInput name="address" value={formData.address} onChange={handleChange} required /></FormField>
            </form>
        </Modal>
    );
};