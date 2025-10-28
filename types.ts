export type View = 'dashboard' | 'kyc' | 'applications' | 'transactions' | 'reports' | 'settings' | 'loans' | 'accounting' | 'applicants' | 'cashAndBank' | 'vehicleInventory' | 'lenders' | 'lendees';

// --- ENUMS ---

export enum KycStatus {
  PENDING = 'Pending',
  VERIFIED = 'Verified',
  REJECTED = 'Rejected'
}

export enum ApplicationType {
  MSME_LOAN = 'MSME Loan',
  AUTO_LEASE = 'Auto Lease'
}

export enum ApplicationStatus {
  DRAFT = 'Draft',
  SUBMITTED = 'Submitted',
  IN_REVIEW = 'In Review',
  APPROVED = 'Approved',
  DISBURSED = 'Disbursed',
  REJECTED = 'Rejected',
  PENDING = 'Pending',
}

export enum TransactionStatus {
  COMPLETED = 'Completed',
  PENDING = 'Pending',
  FAILED = 'Failed'
}

export enum TransactionType {
  CREDIT = 'Credit',
  DEBIT = 'Debit'
}

export enum PaymentMode {
  UPI = 'UPI',
  NEFT = 'NEFT',
  RTGS = 'RTGS',
  IMPS = 'IMPS',
  CASH = 'Cash',
  GATEWAY = 'Payment Gateway'
}

export enum DocumentType {
    PAN = 'PAN Card',
    AADHAAR = 'Aadhaar Card',
    GST_CERT = 'GST Certificate',
    BANK_STATEMENT = 'Bank Statement',
    ITR = 'Income Tax Return',
    INCORPORATION_CERT = 'Certificate of Incorporation'
}

export enum VehicleStatus {
    AVAILABLE = 'Available',
    LEASED = 'Leased',
    MAINTENANCE = 'Maintenance',
    SOLD = 'Sold',
}

export enum LoanStatus {
    PENDING = 'Pending',
    ACTIVE = 'Active',
    PAID_OFF = 'Paid Off',
    OVERDUE = 'Overdue',
    DEFAULTED = 'Defaulted',
}

export enum AccountType {
    ASSET = 'Asset',
    LIABILITY = 'Liability',
    EQUITY = 'Equity',
    REVENUE = 'Revenue',
    EXPENSE = 'Expense'
}

export enum VoucherType {
    PAYMENT = 'Payment',
    RECEIPT = 'Receipt',
    CONTRA = 'Contra',
    JOURNAL = 'Journal',
}

export enum LendeeStatus {
    ACTIVE = 'Active Customer',
    INACTIVE = 'Inactive',
    DEFAULTED = 'Defaulted',
    HIGH_RISK = 'High Risk',
}

// FIX: Add missing enums for invoice and order status
export enum InvoiceStatus {
    PAID = 'Paid',
    UNPAID = 'Unpaid',
    PARTIALLY_PAID = 'Partially Paid'
}

export enum OrderStatus {
    OPEN = 'Open',
    CLOSED = 'Closed'
}

// --- DATA STRUCTURES ---

export interface Document {
  id: string;
  name: string;
  url: string; // URL to the stored document in cloud storage
  uploadedAt: string;
  type: DocumentType;
}

export interface CompanyKyc {
  id:string;
  companyName: string;
  registrationDate: string;
  gstin: string;
  pan: string;
  registeredAddress: string;
  directors: { name: string; pan: string }[];
  documents: Document[];
  status: KycStatus;
}

export interface CustomerKyc {
  id: string;
  customerName: string;
  submissionDate: string;
  aadhaar: string; // Store only last 4 digits for display
  pan: string;
  address: string;
  phone: string;
  email: string;
  documents: Document[];
  status: KycStatus;
}

export interface Application {
  id: string;
  applicant: {
      name: string;
      type: 'Individual' | 'Company';
      phone: string;
      email: string;
      pan: string;
      address: string;
      aadhaar?: string;
      gstin?: string;
  };
  type: ApplicationType;
  amount: number;
  submittedDate: string;
  status: ApplicationStatus;
  interestRate?: number; // In percentage
  tenureMonths?: number;
  vehicleDetails?: { // Specific to Auto Lease
    make: string;
    model: string;
    year: number;
    registrationNumber?: string;
  };
  documents: Document[];
}

export interface Transaction {
  id: string;
  applicationId: string; // Foreign key to Application
  date: string;
  description: string;
  amount: number;
  type: TransactionType;
  mode: PaymentMode;
  status: TransactionStatus;
  referenceNumber: string;
}

export interface User {
    id: string;
    name: string;
    email: string;
    role: 'Super Admin' | 'Admin' | 'Auditor';
    lastLogin: string;
}

export interface Vehicle {
    id: string;
    make: string;
    model: string;
    year: number;
    vin: string;
    registrationNumber: string;
    status: VehicleStatus;
    monthlyLeaseRate: number;
    imageUrl?: string;
}

export type DatabaseType = 'PostgreSQL' | 'MongoDB' | 'Firebase' | 'MySQL';

export interface DatabaseSettings {
    type: DatabaseType;
    host: string;
    port: number;
    username: string;
    dbName: string;
}

// --- MONEY LENDING MODULE ---

export interface RepaymentInstallment {
    installmentNumber: number;
    dueDate: string;
    principal: number;
    interest: number;
    totalAmount: number;
    status: 'Paid' | 'Pending' | 'Overdue';
}

export interface Loan {
    id: string;
    applicantId: string;
    applicantName: string;
    principalAmount: number;
    disbursedDate: string;
    interestRate: number; // Annual percentage
    tenureMonths: number;
    status: LoanStatus;
    repaymentSchedule: RepaymentInstallment[];
}

// --- LENDER & LENDEE MODULES ---
export interface Lender {
    id: string;
    name: string; // e.g., 'Internal Capital', 'Partner Bank A'
    type: 'Internal' | 'External Partner';
    totalLent: number;
    activeLoans: number;
    interestShare?: number; // For external partners
}

export interface Lendee {
    id: string; // Can be linked to a CustomerKyc or CompanyKyc ID
    name: string;
    type: 'Individual' | 'Company';
    totalBorrowed: number;
    outstandingBalance: number;
    activeLoans: number;
    status: LendeeStatus;
    creditScore?: number;
}


// --- ACCOUNTING MODULE ---

export interface Party {
    id: string;
    name: string;
    type: 'Debtor' | 'Creditor';
    gstin?: string;
    phone: string;
    balance: number; // Positive for receivable, negative for payable
}


export interface Account {
    id: string;
    accountCode: string;
    accountName: string;
    accountType: AccountType;
    balance: number;
    isSubAccount: boolean;
}

export interface JournalLine {
    accountId: string;
    accountName: string;
    debit: number;
    credit: number;
}

export interface JournalEntry {
    id: string;
    date: string;
    description: string;
    lines: JournalLine[];
}

export interface Voucher extends JournalEntry {
    voucherType: VoucherType;
    voucherNumber: string;
}


export interface BankAccount {
    id: string;
    bankName: string;
    accountNumber: string;
    ifsc: string;
    balance: number;
    isPrimary: boolean;
}

// FIX: Add missing interfaces for Sales, Purchases, and Inventory
// --- SALES, PURCHASE & INVENTORY MODULE ---

export interface Item {
    id: string;
    name: string;
    sku: string;
    salePrice: number;
    purchasePrice: number;
    stock: number;
    hsnCode: string;
}

export interface LineItem {
    itemId: string;
    itemName: string;
    quantity: number;
    rate: number;
    amount: number;
}

export interface SalesInvoice {
    id: string;
    invoiceNumber: string;
    partyId: string;
    partyName: string;
    date: string;
    dueDate: string;
    lineItems: LineItem[];
    subTotal: number;
    gstAmount: number;
    totalAmount: number;
    amountPaid: number;
    status: InvoiceStatus;
}

export interface Quotation {
    id: string;
    quotationNumber: string;
    partyId: string;
    partyName: string;
    date: string;
    expiryDate: string;
    lineItems: LineItem[];
    subTotal: number;
    gstAmount: number;
    totalAmount: number;
    status: 'Sent' | 'Accepted' | 'Rejected' | 'Expired';
}

export interface PurchaseBill {
    id: string;
    billNumber: string;
    partyId: string;
    partyName: string;
    date: string;
    dueDate: string;
    lineItems: LineItem[];
    totalAmount: number;
    amountPaid: number;
    status: InvoiceStatus;
}

export interface PurchaseOrder {
    id: string;
    poNumber: string;
    partyId: string;
    partyName: string;
    date: string;
    deliveryDate: string;
    lineItems: LineItem[];
    totalAmount: number;
    status: OrderStatus;
}