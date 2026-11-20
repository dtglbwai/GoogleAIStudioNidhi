





import React, { useState, useMemo } from 'react';
import Modal from './Modal';
import type { Application, Lease, Vehicle, User, Lender, Transaction, Document, LegalCase, AgreementTemplate, GeneratedAgreement, Collateral, Loan, KycCompany, KycCustomer, Branch, Employee, Lead, CustomerAccount, PaymentOrder, Voucher, Grievance, Group, PostDatedCheque, GoldLoan, JewelItem } from '../views/types';
import { TransactionType, PaymentMode, ApplicationType, DocumentType, LegalCaseType, UserRole, EmployeeStatus, SupportTicketStatus, CardType, LoanStatus, GrievanceCategory, GrievanceStatus, PdcStatus } from '../views/types';
import { formatCurrency } from '../utils/formatters';
import { useAppContext } from '../AppContext';

// --- Reusable Form Components ---
const FormRow: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => <div className={`grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 ${className}`}>{children}</div>;
const FormField: React.FC<{ label: string; children: React.ReactNode; }> = ({ label, children }) => <div><label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>{children}</div>;
const TextInput = (props: React.InputHTMLAttributes<HTMLInputElement>) => <input {...props} className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-sm" />;
const TextAreaInput = (props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => <textarea {...props} className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-sm" />;
const SelectInput: React.FC<React.SelectHTMLAttributes<HTMLSelectElement>> = ({ children, ...props }) => <select {...props} className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-sm bg-white">{children}</select>;
const DetailItem: React.FC<{ label: string; value: React.ReactNode; fullWidth?: boolean }> = ({ label, value, fullWidth = false }) => <div className={`py-2 ${fullWidth ? 'col-span-2' : ''}`}><p className="text-xs text-gray-500">{label}</p><p className="text-md text-gray-800 font-medium">{value}</p></div>;

// --- All Modals ---

export const NewGoldLoanModal: React.FC<{ isOpen: boolean; onClose: () => void; }> = ({ isOpen, onClose }) => {
    const { customers, handleAddGoldLoan } = useAppContext();
    const [jewels, setJewels] = useState<Omit<JewelItem, 'id'>[]>([]);
    
    const [formData, setFormData] = useState({
        customerId: '',
        principalAmount: 0,
        interestRate: 12,
        tenureMonths: 12,
        appraisedValue: 0,
        pledgePacketNumber: '',
    });

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const addJewelRow = () => {
        setJewels([...jewels, { itemType: '', purity: 22, grossWeight: 0, stoneWeight: 0, netWeight: 0 }]);
    };
    const removeJewelRow = (index: number) => {
        setJewels(jewels.filter((_, i) => i !== index));
    };
    const handleJewelChange = (index: number, field: keyof Omit<JewelItem, 'id'>, value: string | number) => {
        const updated = [...jewels];
        (updated[index] as any)[field] = value;
        // Auto-calculate net weight
        if (field === 'grossWeight' || field === 'stoneWeight') {
            updated[index].netWeight = updated[index].grossWeight - updated[index].stoneWeight;
        }
        setJewels(updated);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const customer = customers.find(c => c.id === formData.customerId);
        if (!customer) return alert('Please select a customer.');

        handleAddGoldLoan({
            applicationId: `app-gl-${Date.now()}`,
            customerId: customer.id,
            applicantName: customer.name,
            loanType: ApplicationType.GOLD_LOAN,
            principalAmount: Number(formData.principalAmount),
            interestRate: Number(formData.interestRate),
            tenureMonths: Number(formData.tenureMonths),
            disbursedDate: new Date().toISOString().split('T')[0],
            appraisedValue: Number(formData.appraisedValue),
            pledgePacketNumber: formData.pledgePacketNumber,
            jewelDetails: jewels.map((j, i) => ({ ...j, id: `j-${Date.now()}-${i}` })),
        });
        onClose();
    };

    const footer = <>
        <button type="button" onClick={onClose} className="px-4 py-2 bg-white border border-gray-300 rounded-md">Cancel</button>
        <button type="submit" form="new-gold-loan-form" className="px-4 py-2 bg-primary text-white rounded-lg">Create Pledge</button>
    </>;
    
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="New Gold Pledge" footer={footer}>
            <form id="new-gold-loan-form" onSubmit={handleSubmit} className="space-y-6">
                <FormField label="Customer">
                    <SelectInput name="customerId" value={formData.customerId} onChange={handleFormChange} required>
                        <option value="">Select an existing customer</option>
                        {customers.map(c => <option key={c.id} value={c.id}>{c.name} ({c.pan})</option>)}
                    </SelectInput>
                </FormField>

                <div>
                    <h4 className="text-md font-semibold text-gray-700 mb-2">Jewel Details</h4>
                    {jewels.map((jewel, index) => (
                        <div key={index} className="grid grid-cols-12 gap-2 items-center p-2 bg-gray-50 rounded-md mb-2">
                            <div className="col-span-3"><TextInput placeholder="Item Type" value={jewel.itemType} onChange={e => handleJewelChange(index, 'itemType', e.target.value)} /></div>
                            <div className="col-span-2"><TextInput type="number" placeholder="Purity (Kt)" value={jewel.purity || ''} onChange={e => handleJewelChange(index, 'purity', Number(e.target.value))} /></div>
                            <div className="col-span-2"><TextInput type="number" step="0.01" placeholder="Gross Wt (g)" value={jewel.grossWeight || ''} onChange={e => handleJewelChange(index, 'grossWeight', Number(e.target.value))} /></div>
                            <div className="col-span-2"><TextInput type="number" step="0.01" placeholder="Stone Wt (g)" value={jewel.stoneWeight || ''} onChange={e => handleJewelChange(index, 'stoneWeight', Number(e.target.value))} /></div>
                            <div className="col-span-2"><TextInput type="number" step="0.01" placeholder="Net Wt (g)" value={jewel.netWeight || ''} readOnly className="bg-gray-200" /></div>
                            <div className="col-span-1 text-center"><button type="button" onClick={() => removeJewelRow(index)} className="text-red-500 hover:text-red-700 font-bold text-xl">&times;</button></div>
                        </div>
                    ))}
                    <button type="button" onClick={addJewelRow} className="text-sm text-primary font-semibold hover:underline">+ Add Jewel Item</button>
                </div>

                <FormRow>
                    <FormField label="Total Appraised Value (₹)"><TextInput name="appraisedValue" type="number" value={formData.appraisedValue || ''} onChange={handleFormChange} required /></FormField>
                    <FormField label="Pledge Packet No."><TextInput name="pledgePacketNumber" value={formData.pledgePacketNumber} onChange={handleFormChange} required /></FormField>
                </FormRow>
                
                 <h4 className="text-md font-semibold text-gray-700 pt-4 border-t">Loan Details</h4>
                 <FormRow>
                    <FormField label="Loan Amount (₹)"><TextInput name="principalAmount" type="number" value={formData.principalAmount || ''} onChange={handleFormChange} required /></FormField>
                    <FormField label="Interest Rate (% p.a.)"><TextInput name="interestRate" type="number" step="0.01" value={formData.interestRate || ''} onChange={handleFormChange} required /></FormField>
                    <FormField label="Tenure (Months)"><TextInput name="tenureMonths" type="number" value={formData.tenureMonths || ''} onChange={handleFormChange} required /></FormField>
                 </FormRow>

            </form>
        </Modal>
    );
};


export const AddPdcModal: React.FC<{ isOpen: boolean; onClose: () => void; loan: Loan | null }> = ({ isOpen, onClose, loan }) => {
    const { handleAddPdc } = useAppContext();
    const [pdcs, setPdcs] = useState<Omit<PostDatedCheque, 'id' | 'loanId' | 'applicantName' | 'status'>[]>([
        { chequeNumber: '', chequeDate: '', bankName: '', amount: 0 }
    ]);

    if (!loan) return null;

    const handlePdcChange = (index: number, field: keyof typeof pdcs[0], value: string | number) => {
        const updatedPdcs = [...pdcs];
        (updatedPdcs[index] as any)[field] = value;
        setPdcs(updatedPdcs);
    };

    const addRow = () => setPdcs([...pdcs, { chequeNumber: '', chequeDate: '', bankName: '', amount: 0 }]);
    const removeRow = (index: number) => setPdcs(pdcs.filter((_, i) => i !== index));

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        pdcs.forEach(pdc => {
            if (pdc.chequeNumber && pdc.chequeDate && pdc.bankName && pdc.amount > 0) {
                handleAddPdc({ ...pdc, loanId: loan.id });
            }
        });
        onClose();
    };

    const footer = <>
        <button type="button" onClick={onClose} className="px-4 py-2 bg-white border border-gray-300 rounded-md">Cancel</button>
        <button type="submit" form="add-pdc-form" className="px-4 py-2 bg-primary text-white rounded-lg">Add Cheques</button>
    </>;
    
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Add PDCs for ${loan.applicantName}`} footer={footer}>
            <form id="add-pdc-form" onSubmit={handleSubmit} className="space-y-4">
                <p className="text-sm text-gray-600">Enter details for one or more post-dated cheques for Loan ID: <span className="font-mono font-semibold">{loan.id}</span></p>
                {pdcs.map((pdc, index) => (
                    <div key={index} className="grid grid-cols-12 gap-2 items-center p-2 bg-gray-50 rounded-md">
                        <div className="col-span-3"><TextInput placeholder="Cheque Number" value={pdc.chequeNumber} onChange={e => handlePdcChange(index, 'chequeNumber', e.target.value)} required /></div>
                        <div className="col-span-3"><TextInput type="date" value={pdc.chequeDate} onChange={e => handlePdcChange(index, 'chequeDate', e.target.value)} required /></div>
                        <div className="col-span-3"><TextInput placeholder="Bank Name" value={pdc.bankName} onChange={e => handlePdcChange(index, 'bankName', e.target.value)} required /></div>
                        <div className="col-span-2"><TextInput type="number" placeholder="Amount" value={pdc.amount || ''} onChange={e => handlePdcChange(index, 'amount', Number(e.target.value))} required /></div>
                        <div className="col-span-1 text-center"><button type="button" onClick={() => removeRow(index)} className="text-red-500 hover:text-red-700 font-bold text-xl">&times;</button></div>
                    </div>
                ))}
                <button type="button" onClick={addRow} className="mt-2 text-sm text-primary font-semibold hover:underline">+ Add Another Cheque</button>
            </form>
        </Modal>
    );
};

export const IssueCardModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { customerAccounts, handleIssueCard } = useAppContext();
  const [formData, setFormData] = useState({
    linkedAccountId: '',
    cardType: CardType.DEBIT,
    network: 'Rupay' as 'Visa' | 'Mastercard' | 'Rupay',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const account = customerAccounts.find(acc => acc.id === formData.linkedAccountId);
    if (!account) {
      alert('Please select a valid customer account.');
      return;
    }
    handleIssueCard({
      ...formData,
      cardHolderName: account.customerName,
      linkedAccountId: account.id,
    });
    onClose();
  };

  const footer = <>
    <button type="button" onClick={onClose} className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
    <button type="submit" form="issue-card-form" className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors shadow-sm">Issue Card</button>
  </>;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Issue New Card" footer={footer}>
      <form id="issue-card-form" onSubmit={handleSubmit} className="space-y-4">
        <FormField label="Customer Account">
          <SelectInput
            value={formData.linkedAccountId}
            onChange={e => setFormData({ ...formData, linkedAccountId: e.target.value })}
            required
          >
            <option value="">Select an account</option>
            {customerAccounts.map(acc => (
              <option key={acc.id} value={acc.id}>{acc.customerName} - {acc.accountNumber}</option>
            ))}
          </SelectInput>
        </FormField>
        <FormRow>
          <FormField label="Card Type">
            <SelectInput
              value={formData.cardType}
              onChange={e => setFormData({ ...formData, cardType: e.target.value as CardType })}
            >
              {Object.values(CardType).map(t => <option key={t} value={t}>{t}</option>)}
            </SelectInput>
          </FormField>
          <FormField label="Card Network">
            <SelectInput
              value={formData.network}
              onChange={e => setFormData({ ...formData, network: e.target.value as any })}
            >
              <option>Rupay</option>
              <option>Visa</option>
              <option>Mastercard</option>
            </SelectInput>
          </FormField>
        </FormRow>
      </form>
    </Modal>
  );
};

export const NewPaymentOrderModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { customerAccounts, handleCreatePaymentOrder } = useAppContext();
  const [formData, setFormData] = useState<Omit<PaymentOrder, 'id' | 'status' | 'createdAt' | 'processedAt' | 'currency'>>({
      sourceAccountId: '',
      destinationAccount: '',
      destinationBank: '',
      amount: 0,
      paymentType: PaymentMode.NEFT,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleCreatePaymentOrder(formData);
    onClose();
  };

  const footer = <>
    <button type="button" onClick={onClose} className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
    <button type="submit" form="new-payment-form" className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors shadow-sm">Submit Payment Order</button>
  </>;
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Payment Order" footer={footer}>
      <form id="new-payment-form" onSubmit={handleSubmit} className="space-y-4">
        <FormField label="Source Account">
          <SelectInput
            value={formData.sourceAccountId}
            onChange={e => setFormData({ ...formData, sourceAccountId: e.target.value })}
            required
          >
            <option value="">Select source account</option>
            {customerAccounts.map(acc => (
              <option key={acc.id} value={acc.id}>{acc.customerName} - {acc.accountNumber} ({formatCurrency(acc.balance)})</option>
            ))}
          </SelectInput>
        </FormField>
         <h3 className="text-md font-semibold text-gray-700 border-b pb-2 pt-2">Beneficiary Details</h3>
        <FormRow>
          <FormField label="Destination Account Number">
            <TextInput value={formData.destinationAccount} onChange={e => setFormData({ ...formData, destinationAccount: e.target.value})} required />
          </FormField>
          <FormField label="Destination Bank (IFSC)">
            <TextInput value={formData.destinationBank} onChange={e => setFormData({ ...formData, destinationBank: e.target.value})} required />
          </FormField>
        </FormRow>
        <FormRow>
           <FormField label="Amount (₹)">
            <TextInput type="number" value={formData.amount || ''} onChange={e => setFormData({ ...formData, amount: Number(e.target.value)})} required />
          </FormField>
           <FormField label="Payment Type">
            <SelectInput value={formData.paymentType} onChange={e => setFormData({ ...formData, paymentType: e.target.value as any })}>
                <option value={PaymentMode.NEFT}>NEFT</option>
                <option value={PaymentMode.RTGS}>RTGS</option>
                <option value={PaymentMode.IMPS}>IMPS</option>
            </SelectInput>
          </FormField>
        </FormRow>
      </form>
    </Modal>
  );
};

export const NewApplicantApplicationModal: React.FC<{isOpen: boolean; onClose: () => void;}> = ({ isOpen, onClose }) => {
  const { handleAddApplication } = useAppContext();
  const [appType, setAppType] = useState<ApplicationType>(ApplicationType.MSME_LOAN);
  const [applicantType, setApplicantType] = useState<'Individual' | 'Company'>('Individual');
  const [files, setFiles] = useState<File[]>([]);
  const [collaterals, setCollaterals] = useState<Omit<Collateral, 'id'>[]>([]);

  const [formData, setFormData] = useState({
      name: '', type: 'Individual', phone: '', email: '', pan: '', address: '', aadhaar: '', gstin: '',
      amount: '', interestRate: '', tenureMonths: '',
      make: '', model: '', year: '',
      photo: null as File | null, thumb: null as File | null, iris: null as File | null,
      propertyAddress: '', propertyValue: '',
      businessIndustry: '', businessYears: '',
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setFormData({ ...formData, [e.target.name]: e.target.value });
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const newFile = e.target.files[0];
      if (files.length >= 3) {
        alert('You can upload a maximum of 3 supporting documents.');
        return;
      }
      setFiles(prev => [...prev, newFile]);
      e.target.value = '';
    }
  };

  const handleBiometricFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          setFormData(prev => ({ ...prev, [e.target.name]: e.target.files![0] }));
      }
  }

  const handleRemoveFile = (indexToRemove: number) => {
    setFiles(prev => prev.filter((_, index) => index !== indexToRemove));
  };
  
  const addCollateral = () => setCollaterals([...collaterals, { type: '', description: '', value: 0 }]);
  const removeCollateral = (index: number) => setCollaterals(collaterals.filter((_, i) => i !== index));
  const handleCollateralChange = (index: number, field: keyof Omit<Collateral, 'id'>, value: string | number) => {
      const newCollaterals = [...collaterals];
      (newCollaterals[index] as any)[field] = value;
      setCollaterals(newCollaterals);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const uploadedDocuments: Document[] = files.map((file, index) => ({
      id: `doc-${formData.pan}-${index}`, name: file.name, url: URL.createObjectURL(file),
      uploadedAt: new Date().toISOString().split('T')[0], type: DocumentType.BANK_STATEMENT
    }));

    const finalCollaterals: Collateral[] = collaterals.map((c, i) => ({ ...c, id: `coll-${Date.now()}-${i}`}));

    handleAddApplication({ 
        applicant: {
            name: formData.name, type: applicantType, phone: formData.phone, email: formData.email,
            pan: formData.pan.toUpperCase(), address: formData.address,
            aadhaar: applicantType === 'Individual' ? formData.aadhaar : undefined,
            gstin: applicantType === 'Company' ? formData.gstin : undefined,
            photoUrl: formData.photo ? URL.createObjectURL(formData.photo) : undefined,
            thumbImpressionUrl: formData.thumb ? URL.createObjectURL(formData.thumb) : undefined,
            irisDataUrl: formData.iris ? URL.createObjectURL(formData.iris) : undefined,
        },
        type: appType,
        amount: parseFloat(formData.amount),
        interestRate: [ApplicationType.MSME_LOAN, ApplicationType.BUSINESS_LOAN, ApplicationType.HOME_LOAN, ApplicationType.INDUSTRY_LOAN].includes(appType) ? parseFloat(formData.interestRate) : undefined,
        tenureMonths: [ApplicationType.MSME_LOAN, ApplicationType.BUSINESS_LOAN, ApplicationType.HOME_LOAN, ApplicationType.INDUSTRY_LOAN].includes(appType) ? parseInt(formData.tenureMonths) : undefined,
        vehicleDetails: appType === ApplicationType.AUTO_LEASE ? { make: formData.make, model: formData.model, year: parseInt(formData.year) } : undefined,
        propertyDetails: appType === ApplicationType.HOME_LOAN ? { address: formData.propertyAddress, value: parseFloat(formData.propertyValue) } : undefined,
        businessDetails: appType === ApplicationType.BUSINESS_LOAN ? { industry: formData.businessIndustry, yearsInBusiness: parseInt(formData.businessYears) } : undefined,
        documents: uploadedDocuments,
        collaterals: finalCollaterals,
    });
    onClose();
  };

  const footer = <>
    <button type="button" onClick={onClose} className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
    <button type="submit" form="new-applicant-form" className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors shadow-sm">Submit Application</button>
  </>;
  
  const FileUploadPreview: React.FC<{file: File | null, name: string, label: string}> = ({ file, name, label }) => (
    <FormField label={label}>
        <div className="flex items-center space-x-4">
            <div className="w-20 h-20 rounded-md bg-gray-100 flex items-center justify-center">
                {file ? <img src={URL.createObjectURL(file)} alt="preview" className="w-full h-full object-cover rounded-md" /> : <span className="text-xs text-gray-400">Preview</span>}
            </div>
            <label htmlFor={name} className="cursor-pointer text-sm text-primary hover:underline">
                {file ? "Change" : "Upload"}
            </label>
            <input id={name} name={name} type="file" className="sr-only" onChange={handleBiometricFileChange} accept="image/*" />
        </div>
    </FormField>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="New Applicant Application" footer={footer}>
        <form id="new-applicant-form" onSubmit={handleSubmit} className="space-y-6">
            <FormField label="Type of Application">
                <SelectInput value={appType} onChange={e => setAppType(e.target.value as ApplicationType)}>
                    {Object.values(ApplicationType).map(t => <option key={t} value={t}>{t}</option>)}
                </SelectInput>
            </FormField>
            
            <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Applicant Details</h3>
            <FormRow>
                <FormField label="Applicant Type">
                    <SelectInput value={applicantType} onChange={e => setApplicantType(e.target.value as any)}>
                        <option value="Individual">Individual</option>
                        <option value="Company">Company</option>
                    </SelectInput>
                </FormField>
                <FormField label="Full Name / Company Name">
                    <TextInput name="name" value={formData.name} onChange={handleChange} required />
                </FormField>
            </FormRow>
            <FormRow>
                <FormField label="Phone Number">
                    <TextInput name="phone" type="tel" value={formData.phone} onChange={handleChange} required />
                </FormField>
                <FormField label="Email Address">
                    <TextInput name="email" type="email" value={formData.email} onChange={handleChange} required />
                </FormField>
            </FormRow>
            <FormRow>
                <FormField label="PAN">
                    <TextInput name="pan" value={formData.pan} onChange={handleChange} required className="uppercase" />
                </FormField>
                {applicantType === 'Individual' ? (
                    <FormField label="Aadhaar Number">
                        <TextInput name="aadhaar" value={formData.aadhaar} onChange={handleChange} />
                    </FormField>
                ) : (
                    <FormField label="GSTIN">
                        <TextInput name="gstin" value={formData.gstin} onChange={handleChange} />
                    </FormField>
                )}
            </FormRow>
            <FormField label="Full Address">
                <TextAreaInput name="address" value={formData.address} onChange={handleChange} rows={2} />
            </FormField>

            {applicantType === 'Individual' && (
                <>
                    <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Biometric Information</h3>
                    <FormRow>
                        <FileUploadPreview file={formData.photo} name="photo" label="Applicant Photo" />
                        <FileUploadPreview file={formData.thumb} name="thumb" label="Thumb Impression" />
                        <FileUploadPreview file={formData.iris} name="iris" label="Iris Scan Data" />
                    </FormRow>
                </>
            )}

            <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Application Details</h3>
            <FormRow>
                <FormField label="Requested Amount (₹)">
                    <TextInput name="amount" type="number" value={formData.amount} onChange={handleChange} required />
                </FormField>
            </FormRow>
            
            {[ApplicationType.MSME_LOAN, ApplicationType.BUSINESS_LOAN, ApplicationType.HOME_LOAN, ApplicationType.INDUSTRY_LOAN].includes(appType) && (
                 <FormRow>
                    <FormField label="Interest Rate (% p.a.)">
                        <TextInput name="interestRate" type="number" step="0.01" value={formData.interestRate} onChange={handleChange} />
                    </FormField>
                    <FormField label="Tenure (Months)">
                        <TextInput name="tenureMonths" type="number" value={formData.tenureMonths} onChange={handleChange} />
                    </FormField>
                </FormRow>
            )}

            {appType === ApplicationType.AUTO_LEASE && (
                 <FormRow>
                    <FormField label="Vehicle Make">
                        <TextInput name="make" value={formData.make} onChange={handleChange} />
                    </FormField>
                    <FormField label="Vehicle Model">
                        <TextInput name="model" value={formData.model} onChange={handleChange} />
                    </FormField>
                     <FormField label="Vehicle Year">
                        <TextInput name="year" type="number" value={formData.year} onChange={handleChange} />
                    </FormField>
                </FormRow>
            )}

            {appType === ApplicationType.HOME_LOAN && (
                <FormRow>
                    <FormField label="Property Address">
                        <TextInput name="propertyAddress" value={formData.propertyAddress} onChange={handleChange} />
                    </FormField>
                    <FormField label="Property Value (₹)">
                        <TextInput name="propertyValue" type="number" value={formData.propertyValue} onChange={handleChange} />
                    </FormField>
                </FormRow>
            )}

            {appType === ApplicationType.BUSINESS_LOAN && (
                 <FormRow>
                    <FormField label="Industry">
                        <TextInput name="businessIndustry" value={formData.businessIndustry} onChange={handleChange} />
                    </FormField>
                    <FormField label="Years in Business">
                        <TextInput name="businessYears" type="number" value={formData.businessYears} onChange={handleChange} />
                    </FormField>
                </FormRow>
            )}

            <div>
                <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Collaterals</h3>
                {collaterals.map((c, i) => (
                     <div key={i} className="grid grid-cols-12 gap-2 items-center my-2 p-2 bg-gray-50 rounded-md">
                        <div className="col-span-4"><TextInput placeholder="Type (e.g., Property)" value={c.type} onChange={(e) => handleCollateralChange(i, 'type', e.target.value)} /></div>
                        <div className="col-span-5"><TextInput placeholder="Description" value={c.description} onChange={(e) => handleCollateralChange(i, 'description', e.target.value)} /></div>
                        <div className="col-span-2"><TextInput type="number" placeholder="Value (₹)" value={c.value || ''} onChange={(e) => handleCollateralChange(i, 'value', Number(e.target.value))} /></div>
                        <div className="col-span-1 text-center"><button type="button" onClick={() => removeCollateral(i)} className="text-red-500 hover:text-red-700 font-bold text-xl">&times;</button></div>
                     </div>
                ))}
                <button type="button" onClick={addCollateral} className="mt-2 text-sm text-primary font-semibold hover:underline">+ Add Collateral</button>
            </div>

            <div>
                <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Document Upload</h3>
                <div className="mt-2 p-4 border-2 border-dashed border-gray-300 rounded-lg text-center">
                     <label htmlFor="file-upload" className="cursor-pointer text-primary font-semibold">
                        Click to upload supporting documents
                     </label>
                     <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} multiple />
                     <p className="text-xs text-gray-500 mt-1">PDF, JPG, PNG up to 5MB. Max 3 files.</p>
                </div>
                 <ul className="mt-2 space-y-1">
                    {files.map((file, index) => (
                        <li key={index} className="text-sm flex justify-between items-center p-2 bg-gray-100 rounded-md">
                            <span>{file.name}</span>
                            <button type="button" onClick={() => handleRemoveFile(index)} className="text-red-500 hover:text-red-700">&times;</button>
                        </li>
                    ))}
                </ul>
            </div>
        </form>
    </Modal>
  );
};

export const GenerateAgreementModal: React.FC<{isOpen: boolean; onClose: () => void; application: Application; agreementType: 'Sanction Letter' | 'Loan Agreement' | 'Lease Agreement';}> = ({ isOpen, onClose, application, agreementType }) => {
    return <Modal isOpen={isOpen} onClose={onClose} title="Generate Agreement"><p>Agreement form placeholder for {application.applicant.name} - {agreementType}</p></Modal>;
};

export const NewCompanyKycModal: React.FC<{ isOpen: boolean; onClose: () => void; }> = ({ isOpen, onClose }) => {
  const { handleAddCompanyKyc } = useAppContext();
  const [formData, setFormData] = useState({ companyName: '', gstin: '' });
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleAddCompanyKyc(formData);
    onClose();
  };
  const footer = <>
    <button onClick={onClose} className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
    <button type="submit" form="new-company-kyc-form" className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors shadow-sm">Submit</button>
  </>;
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="New Company KYC" footer={footer}>
      <form id="new-company-kyc-form" onSubmit={handleSubmit} className="space-y-4">
        <FormField label="Company Name"><TextInput value={formData.companyName} onChange={e => setFormData({...formData, companyName: e.target.value})} required /></FormField>
        <FormField label="GSTIN"><TextInput value={formData.gstin} onChange={e => setFormData({...formData, gstin: e.target.value})} required /></FormField>
      </form>
    </Modal>
  );
};

export const NewCustomerKycModal: React.FC<{ isOpen: boolean; onClose: () => void; }> = ({ isOpen, onClose }) => {
  const { handleAddCustomerKyc } = useAppContext();
  const [formData, setFormData] = useState({ customerName: '', pan: '' });
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleAddCustomerKyc(formData);
    onClose();
  };
  const footer = <>
    <button onClick={onClose} className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
    <button type="submit" form="new-customer-kyc-form" className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors shadow-sm">Submit</button>
  </>;
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="New Customer KYC" footer={footer}>
      <form id="new-customer-kyc-form" onSubmit={handleSubmit} className="space-y-4">
        <FormField label="Customer Name"><TextInput value={formData.customerName} onChange={e => setFormData({...formData, customerName: e.target.value})} required /></FormField>
        <FormField label="PAN"><TextInput value={formData.pan} onChange={e => setFormData({...formData, pan: e.target.value.toUpperCase()})} required /></FormField>
      </form>
    </Modal>
  );
};

export const RecordPaymentModal: React.FC<{ isOpen: boolean; onClose: () => void; }> = ({ isOpen, onClose }) => {
  const { handleAddTransaction } = useAppContext();
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    type: TransactionType.CREDIT,
    mode: PaymentMode.UPI
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleAddTransaction({ ...formData, amount: parseFloat(formData.amount) });
    onClose();
  };

  const footer = (
    <>
      <button onClick={onClose} className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium">Cancel</button>
      <button type="submit" form="record-payment-form" className="px-4 py-2 bg-primary text-white rounded-lg">Record</button>
    </>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Record Manual Payment" footer={footer}>
      <form id="record-payment-form" onSubmit={handleSubmit} className="space-y-4">
        <FormField label="Description"><TextInput value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} required /></FormField>
        <FormRow>
          <FormField label="Amount"><TextInput type="number" value={formData.amount} onChange={e => setFormData({ ...formData, amount: e.target.value })} required /></FormField>
          <FormField label="Transaction Type">
            <SelectInput value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value as TransactionType })}>
              <option value={TransactionType.CREDIT}>Credit (Receipt)</option>
              <option value={TransactionType.DEBIT}>Debit (Payment)</option>
            </SelectInput>
          </FormField>
        </FormRow>
      </form>
    </Modal>
  );
};

export const NewVehicleModal: React.FC<{ isOpen: boolean; onClose: () => void; }> = ({ isOpen, onClose }) => {
  const { handleAddVehicle } = useAppContext();
  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); handleAddVehicle({}); onClose(); };
  return <Modal isOpen={isOpen} onClose={onClose} title="Add New Vehicle"><p>Form to add new vehicle.</p></Modal>;
};

export const UpdateInsuranceModal: React.FC<{ isOpen: boolean; onClose: () => void; vehicle: Vehicle | null }> = ({ isOpen, onClose, vehicle }) => {
  const { handleUpdateVehicleInsurance } = useAppContext();
  const [formData, setFormData] = useState({ provider: '', policyNumber: '', expiryDate: '' });

  React.useEffect(() => {
    if (vehicle) {
      setFormData(vehicle.insurance);
    }
  }, [vehicle]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vehicle) return;
    handleUpdateVehicleInsurance(vehicle.id, formData.provider, formData.policyNumber, formData.expiryDate);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Update Insurance for ${vehicle?.registrationNumber}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField label="Provider"><TextInput value={formData.provider} onChange={e => setFormData({ ...formData, provider: e.target.value })} /></FormField>
        <FormField label="Policy Number"><TextInput value={formData.policyNumber} onChange={e => setFormData({ ...formData, policyNumber: e.target.value })} /></FormField>
        <FormField label="Expiry Date"><TextInput type="date" value={formData.expiryDate} onChange={e => setFormData({ ...formData, expiryDate: e.target.value })} /></FormField>
        <button type="submit" className="w-full mt-4 px-4 py-2 bg-primary text-white rounded-lg">Update</button>
      </form>
    </Modal>
  );
};

export const VoucherApprovalModal: React.FC<{ isOpen: boolean; onClose: () => void; voucher: Voucher | null }> = ({ isOpen, onClose, voucher }) => {
  const { handleVoucherAction } = useAppContext();
  if (!voucher) return null;
  const footer = (
    <>
      <button onClick={() => { handleVoucherAction(voucher.id, 'reject'); onClose(); }} className="px-4 py-2 bg-red-600 text-white rounded-lg">Reject</button>
      <button onClick={() => { handleVoucherAction(voucher.id, 'approve'); onClose(); }} className="px-4 py-2 bg-green-600 text-white rounded-lg">Approve</button>
    </>
  );
  return <Modal isOpen={isOpen} onClose={onClose} title={`Review Voucher ${voucher.voucherNumber}`} footer={footer}><p>Details for voucher {voucher.description}</p></Modal>;
};

export const NewLenderModal: React.FC<{ isOpen: boolean; onClose: () => void; onAddLender: (data: any) => void }> = ({ isOpen, onClose, onAddLender }) => {
  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); onAddLender({}); onClose(); };
  return <Modal isOpen={isOpen} onClose={onClose} title="Add New Lender"><form onSubmit={handleSubmit}><p>Form for new lender</p><button type="submit">Add</button></form></Modal>;
};

export const MakeProvisionModal: React.FC<{ isOpen: boolean; onClose: () => void; loan: Loan | null }> = ({ isOpen, onClose, loan }) => {
  return <Modal isOpen={isOpen} onClose={onClose} title={`Make Provision for ${loan?.applicantName}`}><p>Provision form.</p></Modal>;
};

export const LogCollectionActionModal: React.FC<{ isOpen: boolean; onClose: () => void; entityId: string | null; entityType: 'Loan' | 'Lease' }> = ({ isOpen, onClose, entityId, entityType }) => {
  return <Modal isOpen={isOpen} onClose={onClose} title={`Log Action for ${entityType} ${entityId}`}><p>Log action form.</p></Modal>;
};

export const NewLegalCaseModal: React.FC<{ isOpen: boolean; onClose: () => void; entityId?: string; entityType?: 'Loan' | 'Lease'; applicantName?: string; }> = ({ isOpen, onClose, applicantName }) => {
  return <Modal isOpen={isOpen} onClose={onClose} title={`File New Case for ${applicantName || ''}`}><p>New legal case form.</p></Modal>;
};

export const EndLeaseModal: React.FC<{ isOpen: boolean; onClose: () => void; lease: Lease | null }> = ({ isOpen, onClose, lease }) => {
  return <Modal isOpen={isOpen} onClose={onClose} title={`End Lease for ${lease?.applicantName}`}><p>End lease form.</p></Modal>;
};

export const NewLeadModal: React.FC<{ isOpen: boolean; onClose: () => void; }> = ({ isOpen, onClose }) => {
  const { handleAddLead } = useAppContext();
  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); handleAddLead({} as any); onClose(); };
  return <Modal isOpen={isOpen} onClose={onClose} title="Add New Lead"><p>Form to add new lead.</p></Modal>;
};

export const NewBranchModal: React.FC<{ isOpen: boolean; onClose: () => void; }> = ({ isOpen, onClose }) => {
  const { handleAddBranch, moduleConfig } = useAppContext();
  const [name, setName] = useState('');
  const [branchCode, setBranchCode] = useState('');
  const [location, setLocation] = useState('');
  const [region, setRegion] = useState('West Zone');
  const [manager, setManager] = useState('');
  const [totalAssets, setTotalAssets] = useState('25000000');
  const [employeeCount, setEmployeeCount] = useState('12');
  const [hqSyncMode, setHqSyncMode] = useState<'REALTIME_HQ_STREAM' | 'STORE_AND_FORWARD'>('REALTIME_HQ_STREAM');
  const [vpnTunnelIp, setVpnTunnelIp] = useState('10.106.12.18');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !branchCode.trim() || !location.trim() || !manager.trim()) return;
    handleAddBranch({
      name: name.trim(),
      branchCode: branchCode.trim().toUpperCase(),
      location: location.trim(),
      region,
      manager: manager.trim(),
      totalAssets: Math.max(0, Number(totalAssets) || 0),
      employeeCount: Math.max(1, Number(employeeCount) || 1),
      hqSyncMode,
      vpnTunnelIp: vpnTunnelIp.trim() || '10.106.12.18',
      activeModules: Object.keys(moduleConfig).filter(k => moduleConfig[k as keyof typeof moduleConfig]) as any,
    });
    setName('');
    setBranchCode('');
    setLocation('');
    setManager('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Provision Branch Connected to Centralized HQ Server">
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormRow>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Branch Name</label>
            <TextInput required placeholder="e.g., Pune Regional Treasury Branch" value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Branch Code</label>
            <TextInput required placeholder="e.g., PUN-01" value={branchCode} onChange={e => setBranchCode(e.target.value)} />
          </div>
        </FormRow>
        <FormRow>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">City / Street Address</label>
            <TextInput required placeholder="e.g., Shivajinagar, Pune" value={location} onChange={e => setLocation(e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Operational Zone / Region</label>
            <TextInput value={region} onChange={e => setRegion(e.target.value)} />
          </div>
        </FormRow>
        <FormRow>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Branch Manager</label>
            <TextInput required placeholder="e.g., Rajesh Kulkarni" value={manager} onChange={e => setManager(e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">HQ Sync Mode</label>
            <SelectInput value={hqSyncMode} onChange={e => setHqSyncMode(e.target.value as any)}>
              <option value="REALTIME_HQ_STREAM">Real-Time HQ Stream (Central Ledger)</option>
              <option value="STORE_AND_FORWARD">Store-and-Forward (Offline Resilient)</option>
            </SelectInput>
          </div>
        </FormRow>
        <FormRow>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Allocated Portfolio Assets (INR)</label>
            <TextInput type="number" min="0" value={totalAssets} onChange={e => setTotalAssets(e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">VPN Tunnel Endpoint &amp; Staff Count</label>
            <div className="grid grid-cols-2 gap-2">
              <TextInput value={vpnTunnelIp} onChange={e => setVpnTunnelIp(e.target.value)} placeholder="10.106.12.18" />
              <TextInput type="number" min="1" value={employeeCount} onChange={e => setEmployeeCount(e.target.value)} />
            </div>
          </div>
        </FormRow>
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className="px-4 py-2 text-xs font-semibold text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
            Cancel
          </button>
          <button type="submit" className="px-4 py-2 text-xs font-semibold text-white bg-primary rounded-lg hover:bg-primary-dark">
            Provision &amp; Link to HQ
          </button>
        </div>
      </form>
    </Modal>
  );
};

export const NewEmployeeModal: React.FC<{ isOpen: boolean; onClose: () => void; }> = ({ isOpen, onClose }) => {
  const { handleAddEmployee } = useAppContext();
  return <Modal isOpen={isOpen} onClose={onClose} title="Add New Employee"><p>Form for new employee.</p></Modal>;
};

export const NewSupportTicketModal: React.FC<{ isOpen: boolean; onClose: () => void; }> = ({ isOpen, onClose }) => {
  return <Modal isOpen={isOpen} onClose={onClose} title="Create Support Ticket"><p>Form for new support ticket.</p></Modal>;
};

export const InvestigateAmlTransactionModal: React.FC<{ isOpen: boolean; onClose: () => void; transaction: Transaction | null }> = ({ isOpen, onClose, transaction }) => {
    const { handleInvestigateAmlTransaction } = useAppContext();
    const [notes, setNotes] = useState('');

    if (!transaction) return null;

    const handleAction = (action: 'mark_safe' | 'generate_sar') => {
        if (!notes) {
            alert('Please provide investigation notes.');
            return;
        }
        handleInvestigateAmlTransaction(transaction.id, action, notes);
        onClose();
    };

    const footer = <>
        <button onClick={() => handleAction('mark_safe')} className="px-4 py-2 bg-green-600 text-white rounded-lg">Mark as Safe</button>
        <button onClick={() => handleAction('generate_sar')} className="px-4 py-2 bg-orange-600 text-white rounded-lg">Generate SAR</button>
    </>;
    
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Investigate Transaction ${transaction.id.slice(-6)}`} footer={footer}>
            <div className="space-y-4">
                <DetailItem label="Description" value={transaction.description} fullWidth />
                <FormRow>
                    <DetailItem label="Amount" value={formatCurrency(transaction.amount)} />
                    <DetailItem label="Type" value={transaction.type} />
                </FormRow>
                <DetailItem label="Rule Triggered" value={<span className="font-mono text-red-600">{transaction.amlRuleTriggered}</span>} fullWidth />
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Investigation Notes</label>
                    <TextAreaInput value={notes} onChange={e => setNotes(e.target.value)} rows={4} placeholder="Add investigation details, findings, and justification for the action..." />
                </div>
            </div>
        </Modal>
    );
};

export const NewGrievanceModal: React.FC<{ isOpen: boolean; onClose: () => void; }> = ({ isOpen, onClose }) => {
    const { customers, handleAddGrievance } = useAppContext();
    const [formData, setFormData] = useState({
        customerId: '',
        category: GrievanceCategory.OTHER,
        description: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const customer = customers.find(c => c.id === formData.customerId);
        if (!customer) return;
        
        handleAddGrievance({ ...formData, customerName: customer.name });
        onClose();
    };

    const footer = <>
        <button type="button" onClick={onClose} className="px-4 py-2 bg-white border border-gray-300 rounded-md">Cancel</button>
        <button type="submit" form="new-grievance-form" className="px-4 py-2 bg-primary text-white rounded-lg">Register Grievance</button>
    </>;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Register New Grievance" footer={footer}>
            <form id="new-grievance-form" onSubmit={handleSubmit} className="space-y-4">
                <FormField label="Customer">
                    <SelectInput value={formData.customerId} onChange={e => setFormData({...formData, customerId: e.target.value})} required>
                        <option value="">Select Customer</option>
                        {customers.map(c => <option key={c.id} value={c.id}>{c.name} ({c.pan})</option>)}
                    </SelectInput>
                </FormField>
                <FormField label="Grievance Category">
                    <SelectInput value={formData.category} onChange={e => setFormData({...formData, category: e.target.value as GrievanceCategory})}>
                        {Object.values(GrievanceCategory).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </SelectInput>
                </FormField>
                <FormField label="Detailed Description">
                    <TextAreaInput value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows={5} required />
                </FormField>
            </form>
        </Modal>
    );
};

export const InvestigateGrievanceModal: React.FC<{ isOpen: boolean; onClose: () => void; grievance: Grievance | null }> = ({ isOpen, onClose, grievance }) => {
    const { handleUpdateGrievanceStatus } = useAppContext();
    const [notes, setNotes] = useState('');
    const [newStatus, setNewStatus] = useState<GrievanceStatus | ''>('');
    
    if (!grievance) return null;

    const handleUpdate = () => {
        if (!newStatus || !notes) {
            alert('Please select a new status and provide notes.');
            return;
        }
        handleUpdateGrievanceStatus(grievance.id, newStatus, notes);
        onClose();
    };
    
    const footer = <>
        <button onClick={onClose} className="px-4 py-2 bg-white border border-gray-300 rounded-md">Cancel</button>
        <button onClick={handleUpdate} className="px-4 py-2 bg-primary text-white rounded-lg">Update Status</button>
    </>;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Investigate Grievance ${grievance.grievanceId}`} footer={footer}>
            <div className="space-y-4">
                <DetailItem label="Customer" value={grievance.customerName} />
                <DetailItem label="Category" value={grievance.category} />
                <DetailItem label="Description" value={<p className="whitespace-pre-wrap">{grievance.description}</p>} fullWidth />
                <DetailItem label="Investigation History" value={<p className="text-xs font-mono whitespace-pre-wrap">{grievance.investigationNotes || 'No notes yet.'}</p>} fullWidth />
                <FormRow>
                    <FormField label="Update Status">
                        <SelectInput value={newStatus} onChange={e => setNewStatus(e.target.value as GrievanceStatus)}>
                            <option value="">Select New Status</option>
                             {Object.values(GrievanceStatus).map(s => <option key={s} value={s}>{s}</option>)}
                        </SelectInput>
                    </FormField>
                </FormRow>
                <FormField label="Add Investigation Notes / Resolution Details">
                    <TextAreaInput value={notes} onChange={e => setNotes(e.target.value)} rows={4} />
                </FormField>
            </div>
        </Modal>
    );
};

export const NewGroupModal: React.FC<{ isOpen: boolean; onClose: () => void; }> = ({ isOpen, onClose }) => {
  const { handleAddGroup, customers, branches } = useAppContext();
  const [formData, setFormData] = useState<Omit<Group, 'id'>>({
    name: '',
    center: '',
    leaderId: '',
    branchId: '',
    memberIds: [],
  });

  const availableCustomers = useMemo(() => customers.filter(c => !c.groupId), [customers]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.leaderId || !formData.memberIds.includes(formData.leaderId)) {
        alert('Group leader must be one of the selected members.');
        return;
    }
    handleAddGroup(formData);
    onClose();
  };
  
  const handleMemberSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedIds = Array.from(e.target.selectedOptions, (option: HTMLOptionElement) => option.value);
    setFormData(prev => ({ ...prev, memberIds: selectedIds }));
  };

  const footer = <>
    <button type="button" onClick={onClose} className="px-4 py-2 bg-white border border-gray-300 rounded-md">Cancel</button>
    <button type="submit" form="new-group-form" className="px-4 py-2 bg-primary text-white rounded-lg">Create Group</button>
  </>;
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Customer Group" footer={footer}>
      <form id="new-group-form" onSubmit={handleSubmit} className="space-y-4">
        <FormRow>
            <FormField label="Group Name"><TextInput value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required /></FormField>
            <FormField label="Center / Village"><TextInput value={formData.center} onChange={e => setFormData({...formData, center: e.target.value})} required /></FormField>
        </FormRow>
        <FormRow>
            <FormField label="Branch">
                <SelectInput value={formData.branchId} onChange={e => setFormData({...formData, branchId: e.target.value})} required>
                    <option value="">Select Branch</option>
                    {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                </SelectInput>
            </FormField>
            <FormField label="Group Leader">
                <SelectInput value={formData.leaderId} onChange={e => setFormData({...formData, leaderId: e.target.value})} required>
                    <option value="">Select a member</option>
                    {customers.filter(c => formData.memberIds.includes(c.id)).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </SelectInput>
            </FormField>
        </FormRow>
        <FormField label="Group Members (Select multiple)">
            <SelectInput multiple value={formData.memberIds} onChange={handleMemberSelect} className="h-48" required>
                {availableCustomers.map(c => <option key={c.id} value={c.id}>{c.name} ({c.pan})</option>)}
            </SelectInput>
        </FormField>
      </form>
    </Modal>
  );
};