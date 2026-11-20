
export type View = 
  'dashboard' | 'kyc' | 'applications' | 'leases' | 'transactions' | 
  'reports' | 'settings' | 'allLoans' | 'accounting' | 
  'cashAndBank' | 'vehicleInventory' | 'lenders' | 
  'crm' | 'sales' | 'purchases' | 'items' |
  'reconciliation' | 'assetQuality' | 'insuranceCompliance' |
  'collections' | 'litigation' | 'agreements' | 'dataAnalytics' |
  'superAdminSettings' | 'organization' | 'loanCalculator' | 'branchManagement' | 'hrms' | 'underwriting' |
  'loanProducts' | 'cashCollection' | 'cashBankDeposit' | 'cashTransportation' |
  'salesTeam' | 'marketingTeam' | 'marketingStrategy' | 'crmSupport' | 'cyberSecurity' | 'dbms' |
  'leads' | 'legalReview' |
  'customerAccounts' | 'tellerOperations' | 'eodBodOperations' |
  'cardsManagement' | 'paymentsHub' | 'currencyExchange' | 'contactUs' | 'dms' | 'portal' | 'fieldCollection' | 'aml' | 'coLending' | 'grievanceRedressal' |
  'groupLending' | 'pdcManagement' | 'goldLoan' | 'communicationHub' | 'riskDashboard' | 'executiveCorner' | 'treasury' | 'gst' | 'tds' |
  'itms' | 'disasterRecovery' | 'dataBackup' | 'platformAnalytics' |
  'swiftHub' | 'confiBooks' | 'rilletAi' | 'nbfcEngine' | 'jevAi' | 'runamarga' | 'omniWorkspace' | 'taxAi' | 'businessAssistant' | 'truefincaplincoop' | 'cbsImplementation' | 'enterpriseCore';

export type UserRole = 'Super Admin' | 'Admin' | 'Auditor' | 'Sales' | 'Legal' | 'Accounting' | null;

export type AppModule =
  | 'lms'
  | 'accounting'
  | 'risk'
  | 'analytics'
  | 'system'
  | 'intelligence'
  | 'legal'
  | 'coreBanking'
  | 'treasury'
  | 'paymentsHub'
  | 'goldAndGroupLoans'
  | 'aiSuite'
  | 'branchOps'
  | 'coopSociety';

export type ClientBankPresetId = 'universal' | 'commercial' | 'nbfc' | 'cooperative' | 'custom';

export interface ModuleConfig {
  lms: boolean;
  accounting: boolean;
  risk: boolean;
  analytics: boolean;
  system: boolean;
  intelligence: boolean;
  legal: boolean;
  coreBanking: boolean;
  treasury: boolean;
  paymentsHub: boolean;
  goldAndGroupLoans: boolean;
  aiSuite: boolean;
  branchOps: boolean;
  coopSociety: boolean;
}

export interface SystemBackupSnapshot {
  id: string;
  label: string;
  createdAt: string;
  createdBy: string;
  type: 'Automated' | 'Manual' | 'Pre-Migration';
  schemaVersion: string;
  entityCounts: Record<string, number>;
  totalRecords: number;
  sizeKb: number;
  sha256: string;
  status: 'Verified' | 'Restored';
  payloadJson?: string;
}

export interface EntityMigrationBatch {
  id: string;
  targetEntity: 'branches' | 'transactions' | 'salesInvoices' | 'purchaseBills' | 'customers';
  sourceFormat: 'CSV' | 'JSON';
  executedAt: string;
  totalRows: number;
  insertedRows: number;
  skippedDuplicates: number;
  validationErrors: number;
  rollbackCheckpointId: string;
  status: 'Committed' | 'Rolled Back' | 'Dry-Run Validated';
  insertedIds: string[];
}

export interface MetadataSettings {
  siteTitle: string;
  metaDescription: string;
  metaKeywords: string;
  faviconUrl: string;
}

export interface LegalSettings {
  companyLegalName: string;
  copyrightNotice: string;
  termsOfServiceUrl: string;
  privacyPolicyUrl: string;
}

// --- ENUMS ---

export enum LeadStatus {
  NEW = 'New',
  CONTACTED = 'Contacted',
  QUALIFIED = 'Qualified',
  CONVERTED = 'Converted to Application',
  DROPPED = 'Dropped',
}

export enum KycStatus {
  PENDING = 'Pending',
  VERIFIED = 'Verified',
  REJECTED = 'Rejected',
  UPLOADED_CKYC = 'Uploaded to CKYC'
}

export enum ApplicationType {
  MSME_LOAN = 'MSME Loan',
  AUTO_LEASE = 'Auto Lease',
  HOME_LOAN = 'Home Loan',
  BUSINESS_LOAN = 'Business Loan',
  INDUSTRY_LOAN = 'Industry Loan',
  GROUP_LOAN = 'Group Loan',
  GOLD_LOAN = 'Gold Loan',
}

export enum ApplicationStatus {
  SUBMITTED = 'Submitted',
  PENDING_UNDERWRITING = 'Pending Underwriting',
  UNDERWRITING_APPROVED = 'Underwriting Approved',
  PENDING_LEGAL_REVIEW = 'Pending Legal Review',
  PENDING_FINAL_APPROVAL = 'Pending Final Approval',
  SANCTIONED = 'Sanctioned',
  AGREEMENT_PENDING = 'Agreement Pending',
  AWAITING_DISBURSEMENT = 'Awaiting Disbursement',
  ACTIVE = 'Active',
  CLOSED = 'Closed',
  DISBURSED = 'Disbursed',
  VEHICLE_DISBURSED = 'Vehicle Disbursed',
  REJECTED = 'Rejected',
}

export enum TransactionStatus {
  COMPLETED = 'Completed',
  PENDING = 'Pending',
  FAILED = 'Failed',
  RECONCILED = 'Reconciled',
}

export enum TransactionType {
  CREDIT = 'Credit',
  DEBIT = 'Debit',
  INCOME = 'Income',
  EXPENSE = 'Expense'
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
    INCORPORATION_CERT = 'Certificate of Incorporation',
    VEHICLE_RC = 'Vehicle RC',
    INSURANCE_POLICY = 'Insurance Policy'
}

export enum VehicleStatus {
    AVAILABLE = 'Available',
    LEASED = 'Leased',
    MAINTENANCE = 'Maintenance',
    SOLD = 'Sold',
    SEIZED = 'Seized',
}

export enum LoanStatus {
    PENDING = 'Pending',
    ACTIVE = 'Active',
    PAID_OFF = 'Paid Off',
    FNFS_ISSUED = 'FNFS Issued',
    CLOSED = 'Closed',
    OVERDUE = 'Overdue',
    DEFAULTED = 'Defaulted',
    PLEDGED = 'Pledged',
    AUCTIONED = 'Auctioned',
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
    SALES = 'Sales',
    PURCHASE = 'Purchase',
}

export enum VoucherStatus {
  DRAFT = 'Draft',
  PENDING_APPROVAL = 'Pending Approval',
  APPROVED = 'Approved',
  REJECTED = 'Rejected'
}

export enum CustomerStatus {
    ACTIVE = 'Active Customer',
    INACTIVE = 'Inactive',
    DEFAULTED = 'Defaulted',
    HIGH_RISK = 'High Risk',
}

export enum LeaseStatus {
    ACTIVE = 'Active',
    ENDED = 'Ended',
    TERMINATED = 'Terminated',
    RETURN_IN_PROGRESS = 'Return in Progress',
    VEHICLE_SEIZED = 'Vehicle Seized'
}

export enum InvoiceStatus {
    PAID = 'Paid',
    UNPAID = 'Unpaid',
    PARTIALLY_PAID = 'Partially Paid',
    DRAFT = 'Draft',
}

export enum OrderStatus {
    OPEN = 'Open',
    CLOSED = 'Closed',
    DRAFT = 'Draft',
}

export enum AssetClass {
    STANDARD = 'Standard',
    SMA_0 = 'SMA-0',
    SMA_1 = 'SMA-1',
    SMA_2 = 'SMA-2',
    SUB_STANDARD = 'Sub-Standard',
    DOUBTFUL = 'Doubtful',
    LOSS = 'Loss',
}

export enum InsuranceStatus {
    ACTIVE = 'Active',
    EXPIRING_SOON = 'Expiring Soon',
    EXPIRED = 'Expired',
}

export enum CollectionStatus {
  NONE = 'None',
  IN_PROGRESS = 'In Progress',
  SETTLED = 'Settled',
  LEGAL = 'Legal',
}

export enum LegalCaseType {
    LOAN_DEFAULT = 'Loan Default',
    LEASE_VIOLATION = 'Lease Violation',
    FRAUD = 'Fraud Investigation',
    OTHER = 'Other',
}

export enum LegalCaseStatus {
    FILED = 'Filed',
    IN_PROGRESS = 'In Progress',
    HEARING = 'Hearing',
    SETTLED = 'Settled',
    CLOSED = 'Closed',
}

export enum ComplianceTaskStatus {
    PENDING = 'Pending',
    COMPLETED = 'Completed',
    OVERDUE = 'Overdue',
}

export enum AuditFindingSeverity {
  CRITICAL = 'Critical',
  HIGH = 'High',
  MEDIUM = 'Medium',
  LOW = 'Low',
}

export enum EmployeeStatus {
    ACTIVE = 'Active',
    ON_LEAVE = 'On Leave',
    RESIGNED = 'Resigned',
}

export enum SupportTicketStatus {
    OPEN = 'Open',
    IN_PROGRESS = 'In Progress',
    RESOLVED = 'Resolved',
    CLOSED = 'Closed',
}

export enum CustomerAccountType {
  SAVINGS = 'Savings',
  CURRENT = 'Current',
  FIXED_DEPOSIT = 'Fixed Deposit'
}

export enum CustomerAccountStatus {
  ACTIVE = 'Active',
  DORMANT = 'Dormant',
  CLOSED = 'Closed'
}

export enum CardType {
  DEBIT = 'Debit',
  CREDIT = 'Credit',
  PREPAID = 'Prepaid',
}

export enum CardStatus {
  PENDING_ACTIVATION = 'Pending Activation',
  ACTIVE = 'Active',
  BLOCKED = 'Blocked',
  EXPIRED = 'Expired',
}

export enum PaymentOrderStatus {
  PENDING = 'Pending',
  PROCESSING = 'Processing',
  COMPLETED = 'Completed',
  FAILED = 'Failed',
}

export enum AmlStatus {
    CLEAN = 'Clean',
    FLAGGED = 'Flagged',
    UNDER_INVESTIGATION = 'Under Investigation',
    REPORTED = 'Reported',
    CLEARED = 'Cleared',
}

export enum GrievanceStatus {
  OPEN = 'Open',
  UNDER_INVESTIGATION = 'Under Investigation',
  AWAITING_CUSTOMER_RESPONSE = 'Awaiting Customer Response',
  RESOLVED = 'Resolved',
  ESCALATED = 'Escalated',
}

export enum GrievanceCategory {
  LOAN_PROCESSING = 'Loan Processing',
  INTEREST_RATES = 'Interest Rates',
  STAFF_BEHAVIOR = 'Staff Behavior',
  COLLECTIONS = 'Collections Process',
  ACCOUNT_ISSUES = 'Account Issues',
  OTHER = 'Other',
}

export enum PdcStatus {
  PENDING = 'Pending',
  DEPOSITED = 'Deposited',
  CLEARED = 'Cleared',
  BOUNCED = 'Bounced',
}

export enum CommunicationStatus {
    SENT = 'Sent',
    FAILED = 'Failed',
}

export enum OperationalRiskCategory {
    FRAUD = 'Internal Fraud',
    SYSTEM_FAILURE = 'System Failure',
    PROCESS_ERROR = 'Process Error',
    EXTERNAL_EVENT = 'External Event',
}

export enum InvestmentType {
    GOVERNMENT_SECURITIES = 'Government Securities',
    CORPORATE_BONDS = 'Corporate Bonds',
    MUTUAL_FUNDS = 'Mutual Funds',
    EQUITY = 'Equity',
}

export enum TdsSection {
    _194A = '194A - Interest on Securities',
    _194J = '194J - Fees for Professional Services',
    _194I = '194I - Rent',
    _194H = '194H - Commission or Brokerage',
}


// --- INTERFACES ---

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string;
  productInterest: ApplicationType;
  source: string;
  status: LeadStatus;
  assignedTo: string;
}

export interface KycCompany {
    id: string;
    companyName: string;
    gstin: string;
    status: KycStatus;
    documents: Document[];
    ckycStatus: 'Pending' | 'Uploaded';
    ckycIdentifier?: string;
}
export interface KycCustomer {
    id: string;
    customerName: string;
    pan: string;
    status: KycStatus;
    documents: Document[];
    ckycStatus: 'Pending' | 'Uploaded';
    ckycIdentifier?: string;
}

export interface Document {
    id: string;
    name: string;
    type: DocumentType;
    url: string;
    uploadedAt: string;
}

export interface Application {
    id: string;
    leadId?: string;
    applicant: {
        name: string;
        type: 'Individual' | 'Company';
        phone: string;
        email: string;
        pan: string;
        address: string;
        aadhaar?: string;
        gstin?: string;
        photoUrl?: string;
        thumbImpressionUrl?: string;
        irisDataUrl?: string;
    };
    type: ApplicationType;
    amount: number;
    submittedDate: string;
    status: ApplicationStatus;
    interestRate?: number;
    tenureMonths?: number;
    vehicleDetails?: {
        make: string;
        model: string;
        year: number;
    };
    propertyDetails?: {
        address: string;
        value: number;
    };
    businessDetails?: {
        industry: string;
        yearsInBusiness: number;
    };
    documents: Document[];
    collaterals?: Collateral[];
    creditScore?: number;
    underwritingNotes?: string;
}

export interface Collateral {
    id: string;
    type: string;
    description: string;
    value: number;
}

export interface CoLender {
    lenderId: string;
    lenderName: string;
    sharePercentage: number;
}

export interface Loan {
    id: string;
    applicationId: string;
    customerId: string;
    applicantName: string;
    loanType: ApplicationType;
    principalAmount: number;
    disbursedDate: string;
    interestRate: number;
    tenureMonths: number;
    status: LoanStatus;
    repaymentSchedule: RepaymentInstallment[];
    assetClass: AssetClass;
    daysPastDue: number;
    hasLegalCase: boolean;
    collectionStatus: CollectionStatus;
    generatedAgreementIds: string[];
    fieldAgent?: string;
    coLenders?: CoLender[];
}

export type InstallmentStatus = 'Pending' | 'Paid' | 'Overdue' | 'Paid (Late)';

export interface RepaymentInstallment {
    id: string;
    installmentNumber: number;
    dueDate: string;
    principal: number;
    interest: number;
    totalAmount: number;
    status: InstallmentStatus;
    paidDate?: string;
}

export interface Lease {
    id: string;
    applicationId: string;
    vehicleId: string;
    customerId: string;
    applicantName: string;
    vehicleName: string;
    startDate: string;
    endDate: string;
    monthlyPayment: number;
    securityDeposit: number;
    status: LeaseStatus;
    paymentSchedule: LeasePaymentInstallment[];
    cersaiRegistrationId?: string;
    hasLegalCase: boolean;
    collectionStatus: CollectionStatus;
    generatedAgreementIds: string[];
    fieldAgent?: string;
}

export interface LeasePaymentInstallment {
    id: string;
    installmentNumber: number;
    dueDate: string;
    amount: number;
    status: InstallmentStatus;
    paidDate?: string;
}

export interface Customer {
    id: string;
    pan: string;
    name: string;
    type: 'Individual' | 'Company';
    status: CustomerStatus;
    address?: string; // For field collection
    riskRating?: 'Low' | 'Medium' | 'High';
    branchId: string;
    groupId?: string;
}

export interface Transaction {
    id: string;
    date: string;
    description: string;
    amount: number;
    type: TransactionType;
    mode: PaymentMode;
    status: TransactionStatus;
    referenceNumber: string;
    accountId: string; // Links to BankAccount
    amlStatus?: AmlStatus;
    amlRuleTriggered?: string;
}

export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
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
    leaseId?: string;
    monthlyLeaseRate: number;
    color: string;
    fuelType: string;
    transmission: string;
    mileage: number;
    insurance: {
        provider: string;
        policyNumber: string;
        expiryDate: string;
    };
    fitnessCertificate: {
        expiryDate: string;
    };
    photos: string[];
    documents: Document[];
    remarketingNotes?: string;
}

export interface Lender {
    id: string;
    name: string;
    type: 'Internal' | 'External Partner';
    totalLent: number;
    activeLoans: number;
    interestShare?: number; // Only for external partners
}

export interface Account {
    id: string;
    accountCode: string;
    accountName: string;
    accountType: AccountType;
    group: string;
    openingBalance: number;
    balance: number;
}

export interface JournalLine {
    accountId: string;
    accountName: string;
    debit: number;
    credit: number;
}

export interface Voucher {
    id: string;
    voucherNumber: string;
    voucherType: VoucherType;
    type?: VoucherType; // Alias used in some parts of the app
    date: string;
    description: string;
    narration?: string; // Alias for description
    lines: JournalLine[];
    status: VoucherStatus;
    createdBy?: UserRole | string;
    approvedBy?: UserRole | string;
    referenceDocument?: string;
}

export interface BankAccount {
    id: string;
    bankName: string;
    accountNumber: string;
    ifsc: string;
    balance: number;
    isPrimary: boolean;
    linkStatus: 'Linked' | 'Not Linked' | 'Pending';
}

export interface BankStatementTransaction {
    id: string;
    date: string;
    description: string;
    amount: number;
    type: 'Credit' | 'Debit';
    isReconciled?: boolean;
}

export interface Item {
    id: string;
    name: string;
    sku: string;
    salePrice: number;
    purchasePrice: number;
    stock: number;
    hsnCode?: string;
}

export interface Investment {
    id: string;
    name: string;
    type: InvestmentType;
    purchaseDate: string;
    quantity: number;
    purchasePrice: number;
    currentValue: number;
    maturityDate?: string;
}

export interface Borrowing {
    id: string;
    lenderName: string;
    facilityType: 'Term Loan' | 'Cash Credit' | 'Overdraft';
    sanctionedAmount: number;
    outstandingAmount: number;
    interestRate: number;
    maturityDate: string;
}

export interface OperationalSettings {
    latePaymentFee: number;
    overdueInterestRate: number;
    companyName: string;
    companyPan: string;
    companyGstin: string;
    workflowStages: WorkflowStage[];
}

export interface CommunicationTemplate {
    id: string;
    event: string;
    channel: 'SMS' | 'Email';
    subject?: string;
    content: string;
    isActive: boolean;
}

export interface ComplianceTask {
    id: string;
    title: string;
    type: 'RBI' | 'MCA' | 'Internal';
    dueDate: string;
    status: ComplianceTaskStatus;
    relatedId?: string;
}

export interface SalesInvoice {
    id: string;
    invoiceNumber: string;
    partyName: string;
    date: string;
    dueDate: string;
    totalAmount: number;
    amountPaid: number;
    status: InvoiceStatus;
    gstAmount: number;
}

export interface Quotation {
    id: string;
    quotationNumber: string;
    partyName: string;
    date: string;
    expiryDate: string;
    totalAmount: number;
    status: 'Draft' | 'Sent' | 'Accepted' | 'Rejected';
}

export interface PurchaseBill {
    id: string;
    billNumber: string;
    partyName: string;
    date: string;
    dueDate: string;
    totalAmount: number;
    amountPaid: number;
    status: InvoiceStatus;
    gstAmount: number;
}

export interface PurchaseOrder {
    id: string;
    poNumber: string;
    partyName: string;
    date: string;
    deliveryDate: string;
    totalAmount: number;
    status: OrderStatus;
}

export interface LegalCase {
    id: string;
    caseNumber: string;
    type: LegalCaseType;
    applicantName: string;
    relatedId: string;
    relatedType: 'Loan' | 'Lease';
    filingDate: string;
    status: LegalCaseStatus;
    counsel: string;
    nextHearingDate?: string;
    documents: Document[];
}

export interface AgreementTemplate {
    id: string;
    name: string;
    type: 'Sanction Letter' | 'Loan Agreement' | 'Lease Agreement';
    content: string;
    createdAt: string;
}

export interface GeneratedAgreement {
    id: string;
    templateId: string;
    applicationId: string;
    type: 'Sanction Letter' | 'Loan Agreement' | 'Lease Agreement';
    content: string;
    status: 'Generated' | 'Sent' | 'Signed';
    generatedAt: string;
    signedAt?: string;
}

export interface Branch {
    id: string;
    name: string;
    branchCode: string;
    location: string;
    manager: string;
    totalAssets: number;
    employeeCount: number;
    isHeadquarters?: boolean;
    region?: string;
    hqSyncMode?: 'REALTIME_HQ_STREAM' | 'STORE_AND_FORWARD';
    syncStatus?: 'SYNCHRONIZED' | 'SYNCING' | 'ISOLATED' | 'FAILOVER_STANDBY';
    replicationLagMs?: number;
    lastSyncAt?: string;
    vpnTunnelIp?: string;
    activeModules?: AppModule[];
}

export interface Employee {
    id: string;
    employeeId: string;
    name: string;
    role: string;
    department: string;
    joiningDate: string;
    status: EmployeeStatus;
}

export interface CustomerAccount {
    id: string;
    customerId: string;
    customerName: string;
    accountNumber: string;
    accountType: CustomerAccountType;
    balance: number;
    status: CustomerAccountStatus;
    openDate: string;
}

export interface PaymentOrder {
    id: string;
    sourceAccountId: string;
    destinationAccount: string;
    destinationBank: string;
    amount: number;
    currency: 'INR';
    paymentType: PaymentMode.NEFT | PaymentMode.RTGS | PaymentMode.IMPS;
    status: PaymentOrderStatus;
    createdAt: string;
    processedAt?: string;
}

export interface Grievance {
    id: string;
    grievanceId: string;
    customerId: string;
    customerName: string;
    category: GrievanceCategory;
    description: string;
    status: GrievanceStatus;
    createdAt: string;
    dueDate: string;
    resolvedAt?: string;
    investigationNotes?: string;
}

export interface Group {
    id: string;
    name: string;
    center: string;
    leaderId: string;
    branchId: string;
    memberIds: string[];
}

export interface PostDatedCheque {
    id: string;
    loanId: string;
    applicantName: string;
    chequeNumber: string;
    chequeDate: string;
    bankName: string;
    amount: number;
    status: PdcStatus;
}

export interface JewelItem {
    id: string;
    itemType: string;
    purity: number; // in Karats
    grossWeight: number; // in grams
    stoneWeight: number; // in grams
    netWeight: number; // in grams
}

export interface GoldLoan extends Loan {
    appraisedValue: number;
    pledgePacketNumber: string;
    jewelDetails: JewelItem[];
}

export interface SalesOrder {
    id: string;
    orderNumber: string;
    partyName: string;
    date: string;
    totalAmount: number;
    status: OrderStatus;
}

export interface DeliveryChallan {
    id: string;
    dcNumber: string;
    partyName: string;
    date: string;
    invoiceId?: string;
}

export interface GoodsReceiptNote {
    id: string;
    grnNumber: string;
    partyName: string;
    date: string;
    poId?: string;
}

export interface CollectionLog {
    id: string;
    date: string;
    action: string;
    notes: string;
    officer: UserRole | string;
}

export interface DatabaseSettings {
    type: 'PostgreSQL' | 'MySQL' | 'Oracle';
    host: string;
    port: number;
    username: string;
    password?: string;
    dbName: string;
}

export interface AuditFinding {
    id: string;
    area: string;
    finding: string;
    recommendation: string;
    severity: AuditFindingSeverity;
    timestamp: string;
}

export interface SupportTicket {
    id: string;
    ticketId: string;
    customerName: string;
    subject: string;
    description: string;
    createdAt: string;
    status: SupportTicketStatus;
    assignedTo: string;
}

export interface InteractionLog {
    id: string;
    customerId: string;
    date: string;
    type: 'Call' | 'Email' | 'Meeting';
    summary: string;
    sentiment: 'Positive' | 'Neutral' | 'Negative';
    loggedBy: string;
}

export interface DevelopmentGoal {
    id: string;
    employeeId: string;
    title: string;
    description: string;
    status: 'Not Started' | 'In Progress' | 'Completed';
    deadline: string;
}

export interface TellerTransaction {
    id: string;
    transactionType: 'Deposit' | 'Withdrawal';
    accountNumber: string;
    customerName: string;
    amount: number;
    date: string;
    teller: string;
}

export interface Card {
    id: string;
    cardNumber: string;
    cardHolderName: string;
    linkedAccountId: string;
    cardType: CardType;
    network: 'Visa' | 'Mastercard' | 'Rupay';
    expiryDate: string;
    status: CardStatus;
}

export interface CommunicationLog {
    id: string;
    timestamp: string;
    customerId: string;
    customerName: string;
    channel: 'SMS' | 'Email';
    event: string;
    content: string;
    status: CommunicationStatus;
}

export interface OperationalRiskEvent {
    id: string;
    date: string;
    category: OperationalRiskCategory;
    description: string;
    impact: 'Low' | 'Medium' | 'High';
    status: 'Open' | 'Under Investigation' | 'Resolved';
}

export interface StrategicGoal {
    id: string;
    title: string;
    quarter: string;
    description: string;
    kpi: string;
    target: number;
    current: number;
    status: 'On Track' | 'At Risk' | 'Achieved';
}

export interface CurrencyRate {
    id: string;
    fromCurrency: string;
    toCurrency: string;
    rate: number;
    lastUpdated: string;
}

export interface WorkflowStage {
    id: string;
    name: string;
    description: string;
    responsibleRole: UserRole;
}

export interface TdsPayable {
    id: string;
    payeeName: string;
    pan: string;
    paymentDate: string;
    amountPaid: number;
    tdsRate: number;
    tdsAmount: number;
    section: TdsSection;
    status: 'Due' | 'Paid';
}

export interface TdsReceivable {
    id: string;
    payerName: string;
    grossAmount: number;
    tdsDeducted: number;
    receivedDate: string;
    form16AStatus: 'Available' | 'Pending';
}

// --- SWIFT & INTERNATIONAL CORE BANKING TYPES ---

export type SwiftMessageType = 
  'MT103' | 'MT202' | 'MT940' | 'MT950' | 'MT700' | 'MT707' | 'MT760' | 
  'pacs.008' | 'pain.001' | 'camt.053';

export type SwiftMessageStatus = 
  'QUEUED' | 'SENT' | 'DELIVERED' | 'ACKNOWLEDGED' | 'REJECTED' | 'HELD_COMPLIANCE' | 'INBOUND_RECEIVED';

export interface SwiftGpiHop {
  stage: string;
  bankName: string;
  bic: string;
  location: string;
  timestamp: string;
  status: 'COMPLETED' | 'IN_TRANSIT' | 'PENDING';
  deductedFee?: string;
}

export interface SwiftMessage {
  id: string;
  messageType: SwiftMessageType;
  uetr: string; // ISO 20022 Unique End-to-end Transaction Reference
  senderBic: string;
  receiverBic: string;
  senderName: string;
  receiverName: string;
  amount: number;
  currency: string;
  direction: 'OUTBOUND' | 'INBOUND';
  status: SwiftMessageStatus;
  valueDate: string;
  referenceNumber: string;
  orderingCustomer: {
    name: string;
    accountOrIban: string;
    address: string;
  };
  beneficiaryCustomer: {
    name: string;
    accountOrIban: string;
    bankName: string;
    address: string;
  };
  intermediaryBic?: string;
  chargeDetails: 'OUR' | 'BEN' | 'SHA'; // OUR: sender pays all, BEN: beneficiary pays, SHA: shared
  remittanceInfo: string;
  rawSwiftBlock: string;
  gpiTracking: {
    trackingStatus: 'CREDITED_BENEFICIARY' | 'ONGOING' | 'INVESTIGATION_PENDING' | 'REJECTED';
    totalDeductions: number;
    estimatedSettlementTime: string;
    hops: SwiftGpiHop[];
  };
  sanctionsCheck: {
    isPassed: boolean;
    pepHit: boolean;
    ofacMatchScore: number;
    screenedAt: string;
    complianceOfficerNotes?: string;
  };
}

export interface NostroVostroAccount {
  id: string;
  accountType: 'NOSTRO' | 'VOSTRO';
  correspondentBank: string;
  bic: string;
  currency: string;
  ourLedgerBalance: number;
  mirrorStatementBalance: number;
  unreconciledItemsCount: number;
  country: string;
  creditLimit: number;
  status: 'ACTIVE' | 'RESTRICTED' | 'FROZEN';
  lastReconciledAt: string;
}

export interface BicDirectoryEntry {
  bic: string;
  institutionName: string;
  branchName: string;
  city: string;
  country: string;
  countryCode: string;
  networkStatus: 'CONNECTED_LIVE' | 'INDIRECT_ROUTED';
  supportedProtocols: string[];
  rmaStatus: 'AUTHORISED' | 'PENDING' | 'REVOKED';
  cutoffTimeGmt: string;
}

export interface TradeFinanceDocCredit {
  id: string;
  instrumentType: 'Letter of Credit (LC)' | 'Bank Guarantee (BG)' | 'Standby LC (SBLC)' | 'Documentary Collection';
  lcNumber: string;
  applicant: string;
  beneficiary: string;
  issuingBank: string;
  advisingBank: string;
  amount: number;
  currency: string;
  issueDate: string;
  expiryDate: string;
  tenor: string;
  status: 'ISSUED' | 'DOCS_PRESENTED' | 'DISCREPANCY_UNDER_REVIEW' | 'HONOURED_SETTLED' | 'CANCELLED';
  discrepanciesCount: number;
  applicableRules: 'UCP 600' | 'URDG 758' | 'ISBP 745' | 'ISP98';
}

export interface StandingOrder {
  id: string;
  sourceAccountId: string;
  sourceAccountName: string;
  beneficiaryName: string;
  beneficiaryAccount: string;
  beneficiaryRouting: string; // BIC or IFSC
  amount: number;
  currency: string;
  frequency: 'Daily' | 'Weekly' | 'Monthly' | 'Quarterly' | 'Yearly';
  nextRunDate: string;
  lastRunDate?: string;
  status: 'ACTIVE' | 'PAUSED' | 'EXPIRED';
  ruleType: 'Fixed Amount' | 'Sweep Excess' | 'Target Balance Maintain';
  thresholdAmount?: number;
  executionCount: number;
}

export interface CoreBatchLog {
  id: string;
  batchType: 'EOD' | 'BOD' | 'MONTH_END' | 'QUARTER_END';
  executedDate: string;
  durationSeconds: number;
  status: 'SUCCESS' | 'WARNING' | 'FAILED';
  interestAccrualsPosted: number;
  standingOrdersFired: number;
  dormancyFlagsApplied: number;
  ledgerBalanced: boolean;
  executedBy: string;
  details: string[];
}

// --- CONFIBOOKS ENTERPRISE ACCOUNTING TYPES ---

export interface ConfiAccount {
  id: string;
  code: string;
  name: string;
  category: 'Asset' | 'Liability' | 'Equity' | 'Income' | 'Expense' | 'Cost of Goods Sold';
  subCategory: string;
  parentAccountId?: string;
  balance: number;
  currency: string;
  description: string;
  isSystem: boolean;
  isActive: boolean;
  taxTag?: string;
}

export interface ConfiJournalLine {
  id: string;
  accountId: string;
  accountCode: string;
  accountName: string;
  description: string;
  debit: number;
  credit: number;
  taxRate?: number;
  taxAmount?: number;
}

export interface ConfiJournalEntry {
  id: string;
  entryNumber: string;
  date: string;
  reference: string;
  narration: string;
  lines: ConfiJournalLine[];
  totalDebit: number;
  totalCredit: number;
  status: 'Draft' | 'Posted' | 'Reversed';
  createdBy: string;
  isRecurring: boolean;
  recurringFrequency?: 'Monthly' | 'Quarterly';
  attachedDocName?: string;
}

export interface ConfiInvoiceItem {
  id: string;
  itemId?: string;
  name: string;
  hsnSac?: string;
  quantity: number;
  unitPrice: number;
  discountPercent: number;
  taxPercent: number;
  taxAmount: number;
  lineTotal: number;
}

export interface ConfiInvoice {
  id: string;
  invoiceNumber: string;
  customerId: string;
  customerName: string;
  customerGstPan?: string;
  invoiceDate: string;
  dueDate: string;
  items: ConfiInvoiceItem[];
  subTotal: number;
  discountTotal: number;
  taxTotal: number;
  grandTotal: number;
  amountPaid: number;
  balanceDue: number;
  status: 'Draft' | 'Sent' | 'Unpaid' | 'Partially Paid' | 'Paid' | 'Overdue' | 'Void';
  termsAndConditions: string;
  notes?: string;
}

export interface ConfiBill {
  id: string;
  billNumber: string;
  vendorId: string;
  vendorName: string;
  vendorGst?: string;
  billDate: string;
  dueDate: string;
  poReference?: string;
  grnReference?: string;
  items: {
    description: string;
    quantity: number;
    unitPrice: number;
    taxPercent: number;
    lineTotal: number;
  }[];
  subTotal: number;
  taxTotal: number;
  grandTotal: number;
  amountPaid: number;
  balanceDue: number;
  matchStatus: '3-Way Matched' | 'Partial Match (Price Variance)' | 'Pending GRN' | 'Unmatched';
  status: 'Draft' | 'Pending Approval' | 'Approved' | 'Paid' | 'Partially Paid' | 'Overdue';
}

export interface FixedAssetItem {
  id: string;
  assetCode: string;
  assetName: string;
  category: 'Land & Buildings' | 'Plant & Machinery' | 'Vehicles' | 'IT & Office Hardware' | 'Furniture & Fixtures';
  purchaseDate: string;
  purchaseCost: number;
  salvageValue: number;
  usefulLifeYears: number;
  depreciationMethod: 'Straight Line (SLM)' | 'Written Down Value (WDV)';
  annualDepreciationRate: number;
  accumulatedDepreciation: number;
  currentNetBookValue: number;
  status: 'Active In-Service' | 'Under Maintenance' | 'Disposed' | 'Fully Depreciated';
  custodianEmployee: string;
  location: string;
}

// --- RILLET AI REVENUE RECOGNITION & MODERN ACCOUNTING ENGINE ---

export interface RilletContractItem {
  id: string;
  elementName: string; // e.g. 'Platform Software License', 'Implementation & Setup', 'Premium 24/7 SLA Support', 'AI Inference Compute Usage'
  performanceObligation: 'Software Subscription' | 'Professional Services' | 'Usage-Based Consumption' | 'Hardware/Token';
  contractValue: number;
  standaloneSellingPrice: number; // SSP for ASC 606 relative fair value allocation
  allocatedRevenue: number; // ASC 606 calculated allocated consideration
  revRecMethod: 'Daily Ratable (Over Time)' | 'Point-in-Time (Milestone Delivery)' | 'Usage/Consumption Incurred';
  startDate: string;
  endDate: string;
  billedSoFar: number;
  recognizedSoFar: number;
  deferredBalance: number;
}

export interface RilletContract {
  id: string;
  contractNumber: string;
  customerName: string;
  customerTier: 'Enterprise' | 'Growth' | 'Strategic Scale' | 'Startup';
  annualContractValue: number; // ARR
  totalContractValue: number; // TCV
  currency: string;
  billingFrequency: 'Annual Upfront' | 'Quarterly' | 'Monthly' | 'Multi-Year Prepaid' | 'Usage-Metered';
  contractStartDate: string;
  contractEndDate: string;
  status: 'Active' | 'Pending Activation' | 'Amended/Upgraded' | 'Renewed' | 'Churned';
  elements: RilletContractItem[];
  autoRenew: boolean;
  paymentTerms: string;
  contractPdfName?: string;
  extractedWithAi?: boolean;
}

export interface RilletWaterfallMonth {
  period: string; // '2026-01', '2026-02', etc.
  beginningDeferred: number;
  newBillings: number;
  recognizedRevenue: number;
  endingDeferred: number;
  unbilledContractAsset: number;
}

export interface RilletSaaSMetrics {
  arrCurrent: number;
  mrrCurrent: number;
  startingArr: number;
  newBookingsArr: number;
  expansionArr: number;
  contractionArr: number;
  churnedArr: number;
  netNewArr: number;
  endingArr: number;
  netRevenueRetentionPct: number; // NRR % (e.g., 128%)
  grossRevenueRetentionPct: number; // GRR % (e.g., 96%)
  cacPaybackMonths: number; // (e.g., 11.2 months)
  ltvToCacRatio: number; // (e.g., 5.4x)
  magicNumber: number; // (e.g., 1.35)
  ruleOf40Pct: number; // ARR growth % + Free Cash Flow margin % (e.g., 58%)
  grossMarginPct: number; // (e.g., 82%)
  burnMultiple: number; // (e.g., 0.8x)
  liveCashRunwayMonths: number; // (e.g., 28 months)
}

export interface RilletBankFeedTransaction {
  id: string;
  bankAccount: 'Brex Treasury (USD)' | 'Mercury Operating (USD)' | 'Silicon Valley Bank (USD)' | 'Stripe USD Payouts' | 'HDFC Operating (INR)';
  date: string;
  amount: number;
  direction: 'INFLOW' | 'OUTFLOW';
  rawDescription: string;
  counterparty: string;
  aiMatchStatus: 'AUTO_MATCHED' | 'CONFIRMED' | 'NEEDS_REVIEW' | 'SPLIT_PROPOSED';
  aiConfidencePct: number; // e.g. 99.4
  aiMatchingRule: string;
  suggestedAccountCode: string;
  suggestedAccountName: string;
  matchedDocumentRef?: string; // e.g. 'INV-2026-0819' or 'BILL-DATADOG-JUL'
  reconciledBy: string;
}

export interface RilletPrepaidItem {
  id: string;
  vendorName: string;
  description: string; // e.g., 'AWS 3-Year Compute Savings Plan', 'Datadog Enterprise Monitoring'
  totalPrepaidCost: number;
  startDate: string;
  endDate: string;
  totalMonths: number;
  monthlyAmortization: number;
  accumulatedAmortization: number;
  remainingAssetBalance: number;
  expenseGlAccount: string;
  status: 'Active Amortizing' | 'Fully Amortized' | 'Pending Start';
}

export interface RilletFluxAnalysisItem {
  id: string;
  accountCode: string;
  accountName: string;
  category: 'Revenue' | 'Cost of Goods Sold' | 'R&D Engineering' | 'Sales & Marketing' | 'G&A Administrative' | 'Assets' | 'Liabilities';
  currentMonthBalance: number;
  priorMonthBalance: number;
  varianceAmount: number;
  variancePercentage: number;
  isMaterialVariance: boolean;
  anomalyScore: 'Normal' | 'Medium Alert' | 'Significant Flux';
  aiGeneratedExplanation: string;
  auditorSignoff: boolean;
}

export interface RilletCloseChecklistTask {
  id: string;
  order: number;
  category: 'Cash & Banking' | 'Revenue (ASC 606)' | 'Prepaids & Fixed Assets' | 'AP & Accruals' | 'Payroll & Equity' | 'Financial Close & Locks';
  taskName: string;
  description: string;
  owner: string;
  status: 'COMPLETED' | 'IN_PROGRESS' | 'PENDING_REVIEW' | 'ACTION_REQUIRED';
  aiAutomatedCheck: boolean;
  aiValidationMessage: string;
  completedAt?: string;
  signedOffBy?: string;
}

export interface RilletAiQueryLog {
  id: string;
  timestamp: string;
  question: string;
  answer: string;
  category: 'Revenue & ASC 606' | 'SaaS Metrics' | 'Burn & Runway' | 'Anomalies & Flux' | 'Audit Trail';
  relatedDataRef?: string;
}

// ==========================================
// NBFC & OPEN ACCOUNTING GITHUB STANDARDS
// ==========================================

export type NbfcSbrLayer = 'Base Layer (NBFC-BL)' | 'Middle Layer (NBFC-ML)' | 'Upper Layer (NBFC-UL)' | 'Top Layer (NBFC-TL)';

export interface NbfcCrarMetrics {
  tier1Capital: number; // Paid-up equity + statutory reserves + share premium
  tier2Capital: number; // Subordinated debt + general provisions (up to 1.25% RWA)
  totalCapital: number;
  rwaOnBalanceSheet: number; // Risk weighted assets
  rwaOffBalanceSheet: number;
  totalRwa: number;
  crarPercentage: number; // (Total Capital / Total RWA) * 100 -> min 15%
  tier1CrarPercentage: number; // (Tier 1 / Total RWA) * 100 -> min 10%
  tier2CrarPercentage: number;
  leverageRatio: number; // Total outside liabilities / Net owned funds
  regulatoryMinimumCrar: number; // 15%
  sbrLayer: NbfcSbrLayer;
  complianceStatus: 'COMPLIANT' | 'BREACH' | 'WATCHLIST';
}

export interface IndAs109EclStageSummary {
  stage: 'Stage 1 (0-30 DPD)' | 'Stage 2 (31-90 DPD SICR)' | 'Stage 3 (90+ DPD Impaired)';
  description: string;
  loanCount: number;
  exposureAtDefault: number; // EAD
  probabilityOfDefaultPct: number; // PD %
  lossGivenDefaultPct: number; // LGD %
  eclProvisionAmount: number; // EAD * PD * LGD
  coverageRatioPct: number;
  iracpRegulatoryProvision: number; // Under RBI Prudential Norms
  indAsVsIracpDifference: number; // Impairment reserve transfer
}

export interface NbfcAlmBucket {
  id: string;
  timeBucket: '1 - 7 Days' | '8 - 14 Days' | '15 - 30 Days' | '1 - 2 Months' | '2 - 3 Months' | '3 - 6 Months' | '6 - 12 Months' | '1 - 3 Years' | '3 - 5 Years' | 'Over 5 Years';
  cashInflows: number; // Loans maturing, investments maturing, interest receivables
  cashOutflows: number; // Borrowings maturing, deposits, operating expenses
  netMismatchAmount: number; // Inflows - Outflows
  cumulativeMismatchAmount: number;
  cumulativeMismatchPct: number; // Mismatch / Outflows * 100
  regulatoryLimitPct: number; // e.g. -10% or -15%
  isWithinLimit: boolean;
}

export interface NbfcCoLendingEscrowDeal {
  id: string;
  dealCode: string;
  originatingNbfcName: string;
  partnerBankName: string;
  colendingModel: 'Model 1 (Joint Lending)' | 'Model 2 (Direct Assignment / Securitization 80:20)';
  nbfcSharePct: number; // e.g. 20%
  partnerBankSharePct: number; // e.g. 80%
  blendedInterestRate: number; // e.g. 11.4%
  totalPoolDisbursed: number;
  livePrincipalOutstanding: number;
  monthlyCollectionsTotal: number;
  bankEscrowRemittance: number;
  nbfcRetainedRemittance: number;
  firstLossDefaultGuaranteePct: number; // Capped at 5% per RBI FLDG guidelines
  fldgAmountDeposited: number;
  fldgStatus: 'COMPLIANT (<=5%)' | 'EXCEEDED';
  escrowStatus: 'Settled' | 'Processing' | 'Pending Allocation';
}

export interface BureauTudfRecord {
  id: string;
  accountNumber: string;
  borrowerName: string;
  idType: 'PAN' | 'Aadhaar' | 'Passport' | 'VoterID' | 'CIN';
  idNumber: string;
  sanctionAmount: number;
  currentBalance: number;
  amountOverdue: number;
  daysPastDue: number;
  assetClassification: 'STD' | 'SUB' | 'DB1' | 'DB2' | 'DB3' | 'LSS';
  paymentHistoryString: string; // 36-month string like 000000000030060090...
  bureauScoreEstimated: number;
  validationStatus: 'CLEAN' | 'WARNING' | 'REJECT';
  validationMessage: string;
}

export interface OpenCostCenter {
  id: string;
  code: string;
  name: string;
  parentCenter?: string;
  department: 'Retail Lending' | 'SME & Corporate' | 'Treasury & ALM' | 'Collections & Recovery' | 'Risk & Underwriting' | 'Corporate Operations';
  allocatedBudget: number;
  actualSpent: number;
  variance: number;
  headOfDepartment: string;
  status: 'Active' | 'Locked';
}

export interface OpenBudgetRule {
  id: string;
  accountCode: string;
  accountName: string;
  costCenterCode: string;
  fiscalYear: string;
  monthlyBudget: number;
  actualYearToDate: number;
  remainingBudget: number;
  actionOnExceed: 'Stop Transaction' | 'Warn User & Log Audit' | 'Ignore';
  alertThresholdPct: number; // e.g. 85%
  isBreached: boolean;
}

export interface OpenPeriodClosingEntry {
  id: string;
  periodName: string; // e.g. 'FY2025-26 Q1' or 'March 2026 Close'
  closingDate: string;
  closingVoucherNumber: string;
  totalExpenseDebitTransferred: number;
  totalIncomeCreditTransferred: number;
  netProfitTransferredToRetainedEarnings: number;
  retainedEarningsAccount: string;
  executedBy: string;
  isLocked: boolean;
}

// ==========================================
// JEV.AI (SYSTEM ONE AI DECISION ENGINE) TYPES
// ==========================================

export type JevDecisionPrimitive = 'choice' | 'score' | 'noul';

export interface JevQuestion {
  id: string;
  question: string;
  type: JevDecisionPrimitive;
  options?: string[]; // Up to 255 predefined choices for 'choice'
  scoreMin?: number; // Minimum value for 'score' (e.g., 0)
  scoreMax?: number; // Maximum value for 'score' (e.g., 100)
  description?: string;
  noulThreshold?: number; // Probability threshold above which Noul evaluates to true
}

export interface JevEvaluationOutput {
  id: string;
  title: string;
  stateInput: string | Record<string, any>;
  question: string;
  decisionType: JevDecisionPrimitive;
  answer: string | number | boolean;
  confidence: number; // Calibrated probability between 0.0 and 1.0 (RLCD)
  probabilities: Record<string, number>;
  latencyMs: number; // Sub-100ms non-autoregressive execution time
  inputTokens: number;
  costUsd: number; // $0.042 per 1M input tokens, free output tokens
  stpStatus: 'STP_APPROVED' | 'MANUAL_REVIEW_REQUIRED' | 'REJECTED_BY_GUARDRAIL';
  system2Triggered: boolean;
  system2Explanation?: string;
  timestamp: string;
}

export interface JevPipeline {
  id: string;
  name: string;
  tag: string;
  description: string;
  category: 'General Ledger' | 'Credit & Underwriting' | 'Regulatory & RBI' | 'Fraud & AML' | 'Asset Staging';
  sampleState: Record<string, any>;
  questions: JevQuestion[];
  stpConfidenceThreshold: number; // e.g., 0.95 (95% calibrated probability)
  latencyAvgMs: number;
  costSavingsPct: number;
  status: 'Active' | 'Paused';
}

export interface JevBatchRecord {
  id: string;
  referenceNumber: string;
  date: string;
  partyName: string;
  amount: number;
  transactionType: string;
  predictedGlAccount: string;
  choiceConfidence: number;
  riskScore: number;
  noulRequiresApproval: boolean;
  noulConfidence: number;
  stpStatus: 'STP_COMMITTED' | 'ESCALATED_TO_SYSTEM2' | 'PENDING_HUMAN_REVIEW';
  latencyMs: number;
  executionCostUsd: number;
}

export interface JevCalibrationBin {
  binRange: string;
  confidenceMidpoint: number;
  empiricalAccuracy: number;
  sampleCount: number;
}

// ==========================================
// RUNAMARGA AI (BFSI VOICE INFRASTRUCTURE & MONITORING)
// ==========================================

export type RunamargaCampaignType = 
  | 'LOAN_SALES' 
  | 'KYC_ONBOARDING' 
  | 'COLLECTIONS_EARLY' 
  | 'COLLECTIONS_LATE' 
  | 'CUSTOMER_SUPPORT' 
  | 'PRE_DISBURSEMENT';

export type RunamargaLanguage = 
  | 'en-IN' 
  | 'hi-IN' 
  | 'hinglish' 
  | 'ta-IN' 
  | 'te-IN' 
  | 'kn-IN' 
  | 'mr-IN';

export type RunamargaCallStatus = 
  | 'QUEUED' 
  | 'RINGING' 
  | 'IN_PROGRESS' 
  | 'COMPLETED' 
  | 'FAILED' 
  | 'TRANSFERRED_TO_HUMAN';

export type RunamargaSentiment = 
  | 'POSITIVE' 
  | 'RECEPTIVE' 
  | 'NEUTRAL' 
  | 'HESITANT' 
  | 'FRUSTRATED' 
  | 'DISTRESSED';

export interface RunamargaTranscriptTurn {
  speaker: 'agent' | 'customer' | 'supervisor';
  text: string;
  timestamp: string;
  sentiment: RunamargaSentiment;
  asrConfidence: number;
  extractedEntities?: Record<string, any>;
}

export interface RunamargaExtractedData {
  loanAmount?: number;
  loanType?: string;
  tenorMonths?: number;
  monthlyIncome?: number;
  ptpDate?: string;
  ptpAmount?: number;
  ptpMode?: string;
  disputeReason?: string;
  hardshipFlag?: boolean;
  kycConfirmed?: boolean;
  aadhaarMasked?: string;
  panNumber?: string;
  supportIssueResolved?: boolean;
  paymentLinkDispatched?: boolean;
  customerConsentTimestamp?: string;
}

export interface RunamargaCallRecord {
  id: string;
  callId: string;
  phoneNumber: string;
  customerName: string;
  campaignType: RunamargaCampaignType;
  campaignName?: string; // used in UI
  language: RunamargaLanguage;
  direction: 'INBOUND' | 'OUTBOUND';
  status: RunamargaCallStatus;
  durationSeconds: number;
  durationSec?: number; // used in UI
  startTime: string;
  endTime?: string;
  recordingUrl?: string;
  sentimentScore: number; // -1.0 (frustrated/hostile) to +1.0 (delighted)
  overallSentiment: RunamargaSentiment;
  sentiment?: string; // used in UI (string representation)
  qaScore: number; // 0 to 100
  fpcCompliant: boolean; // RBI Fair Practices Code
  latencyMetrics: {
    totalMs: number;
    asrMs: number;
    llmMs: number;
    ttsMs: number;
    networkJitterMs: number;
  };
  extractedData: RunamargaExtractedData;
  transcript: RunamargaTranscriptTurn[];
  outcome: 
    | 'PTP_CAPTURED' 
    | 'LEAD_GENERATED' 
    | 'KYC_VERIFIED' 
    | 'PAYMENT_LINK_SENT' 
    | 'HARDSHIP_ESCALATED' 
    | 'CALL_BACK_REQUESTED' 
    | 'DISPUTED' 
    | 'INQUIRY_RESOLVED';
  costInr: number; // e.g. ₹3.40 vs ₹45 human agent
  relatedLeadId?: string;
  relatedLoanId?: string;
  workflowDispatched?: boolean;
}

export interface RunamargaCampaign {
  id: string;
  name: string;
  type: RunamargaCampaignType;
  targetAudience: string;
  totalContacts: number;
  completedCalls: number;
  connectedRate: number; // percentage e.g. 78%
  conversionRate: number; // percentage e.g. 42%
  status: 'ACTIVE' | 'PAUSED' | 'SCHEDULED' | 'COMPLETED';
  pacing: number; // concurrent lines
  languages: string[];
  scheduleWindow: string; // e.g. "08:30 - 18:30 (RBI FPC)"
  avgDurationSec: number;
}

export interface RunamargaTelemetryStats {
  activeCallsCount: number;
  totalCallsToday: number;
  avgHandlingTimeSec: number;
  avgE2eLatencyMs: number;
  ptpConversionRate: number;
  fpcComplianceRate: number;
  costSavingsPct: number;
  totalCostSavedInr: number;
  asrAccuracyPct: number;
  interruptionSuccessPct: number;
}

// ==========================================
// OMNIWORKSPACE ENTERPRISE WORKSPACE & PORTAL
// (Standards & Workflows of Oasis Workspace without branding)
// ==========================================

export type WorkspaceStage = 'backlog' | 'planning' | 'in_progress' | 'review' | 'completed';
export type WorkspacePriority = 'urgent' | 'high' | 'medium' | 'low';
export type WorkspaceDocCategory = 'contract' | 'specification' | 'qa_certificate' | 'proposal' | 'drawing' | 'financial';
export type WorkspaceDocStatus = 'draft' | 'pending_approval' | 'approved' | 'rejected';

export interface WorkspaceProject {
  id: string;
  code: string;
  name: string;
  category: string;
  customerId: string;
  customerName: string;
  supplierId?: string;
  supplierName?: string;
  stage: WorkspaceStage;
  priority: WorkspacePriority;
  progressPct: number;
  startDate: string;
  dueDate: string;
  ownerName: string;
  budget: number;
  currency: string;
  tags: string[];
  description: string;
  qualifyingProjectCode?: string;
}

export interface WorkspaceChecklistItem {
  id: string;
  text: string;
  done: boolean;
}

export interface WorkspaceTask {
  id: string;
  projectId: string;
  projectCode: string;
  title: string;
  assignee: string;
  status: 'todo' | 'in_progress' | 'review' | 'done';
  priority: WorkspacePriority;
  dueDate: string;
  estimatedHours: number;
  actualHours: number;
  checklistItems: WorkspaceChecklistItem[];
  workflowRule?: string;
}

export interface WorkspaceCustomer {
  id: string;
  code: string;
  name: string;
  industry: string;
  contactPerson: string;
  email: string;
  phone: string;
  activeProjectsCount: number;
  slaCompliancePct: number;
  totalContractValue: number;
  status: 'ACTIVE' | 'ONBOARDING' | 'HOLD';
  tier: 'Enterprise' | 'Strategic' | 'Standard';
  region: string;
}

export interface WorkspaceSupplier {
  id: string;
  code: string;
  name: string;
  category: string;
  rating: number; // 1-5
  onTimeDeliveryPct: number;
  contactPerson: string;
  email: string;
  phone: string;
  certifications: string[];
  openOrdersCount: number;
  complianceStatus: 'CERTIFIED' | 'PENDING_AUDIT' | 'EXPIRED';
  country: string;
}

export interface WorkspaceSignatureStamp {
  signerName: string;
  role: string;
  signedAt: string;
  signatureHash: string;
}

export interface WorkspaceDocument {
  id: string;
  docNumber: string;
  title: string;
  category: WorkspaceDocCategory;
  version: string;
  fileType: 'pdf' | 'png' | 'docx' | 'dwg';
  fileSize: string;
  uploadDate: string;
  expiryDate?: string;
  uploadedBy: string;
  status: WorkspaceDocStatus;
  customerOrSupplierName?: string;
  associatedProjectId?: string;
  eSignatures: WorkspaceSignatureStamp[];
  rejectionReason?: string;
  tags: string[];
}

export interface WorkspaceChannelMessage {
  id: string;
  channelId: string;
  senderName: string;
  senderRole: string;
  senderAvatar: string;
  timestamp: string;
  message: string;
  attachments?: { name: string; size: string; type: string }[];
}

export interface WorkspaceChecklistSubmission {
  id: string;
  projectId: string;
  category: string;
  itemTitle: string;
  requiredDocumentType: string;
  isSubmitted: boolean;
  isVerified: boolean;
  verifiedBy?: string;
  verifiedAt?: string;
  notes?: string;
}

export interface WorkspaceAuditLog {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  targetType: 'PROJECT' | 'TASK' | 'DOCUMENT' | 'SUPPLIER' | 'AUTH';
  description: string;
  ipAddress: string;
}

// ==========================================
// TAX AI COMPLIANCE AGENT (Sarthak Ahuja Inspired)
// ==========================================

export type TaxComplianceStatus = 'UPCOMING' | 'DUE_SOON' | 'OVERDUE' | 'COMPLETED';
export type TaxRecordStatus = 'DRAFT' | 'FILED' | 'VERIFIED' | 'REJECTED';
export type TaxType = 'GST' | 'INCOME_TAX' | 'TDS' | 'PROFESSIONAL_TAX' | 'ROC_FILING';

export interface TaxComplianceItem {
  id: string;
  taxType: TaxType;
  event: string;
  period: string;
  dueDate: string;
  status: TaxComplianceStatus;
  estimatedPenalty?: number;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface TaxRecord {
  id: string;
  taxType: TaxType;
  filingDate?: string;
  financialYear: string;
  status: TaxRecordStatus;
  amount: number;
  arnNumber?: string; // Application Reference Number
  attachments: string[];
  notes: string;
}

export interface TaxChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface TaxOptimizationSuggestion {
  id: string;
  title: string;
  description: string;
  estimatedSaving: number;
  category: '80C' | '80D' | 'HRA' | 'BUSINESS_EXPENSE';
}

// ==========================================
// BUSINESS MANAGEMENT ASSISTANT
// ==========================================

export interface BusinessAssistantMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface BusinessKpi {
  id: string;
  label: string;
  value: number | string;
  target: number | string;
  trend: 'up' | 'down' | 'neutral';
  unit: string;
}

export interface BusinessStrategyGoal {
  id: string;
  title: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'on_hold';
  priority: 'high' | 'medium' | 'low';
  dueDate: string;
}

// ==========================================
// TRUEFINCAPLINCOOP (MULTI-STATE COOPERATIVE SOCIETY)
// ==========================================

export interface CoopMember {
  id: string;
  folioNumber: string;
  employeeCode?: string;
  memberName: string;
  designation?: string;
  ddoCode?: string;
  ddoName?: string;
  pan: string;
  aadhaar: string;
  shareCount: number;
  shareCapitalAmount: number;
  thriftBalance?: number;
  monthlyThriftContribution?: number;
  savingsBalance: number;
  admissionDate: string;
  retirementDate?: string;
  status: 'Active' | 'Nominal' | 'Associate' | 'Suspended' | 'Retired';
  nomineeName: string;
  branch: string;
  phone: string;
}

export interface CoopDeposit {
  id: string;
  depositNumber: string;
  memberId: string;
  memberName: string;
  depositType: 'Fixed Deposit (FD)' | 'Recurring Deposit (RD)' | 'Savings Account' | 'Daily Pigmy Deposit' | 'Thrift Deposit';
  principalAmount: number;
  interestRate: number;
  tenureMonths: number;
  maturityDate: string;
  maturityAmount: number;
  status: 'Active' | 'Matured' | 'Closed';
}

export interface CoopLoan {
  id: string;
  loanAccountNo: string;
  memberId: string;
  memberName: string;
  ddoCode: string;
  loanScheme: 'Regular Member Loan' | 'Emergency Loan' | 'Festival Advance' | 'Loan Against Thrift/FD' | 'Surety Loan';
  sanctionedAmount: number;
  outstandingPrincipal: number;
  interestRate: number; // annual %
  tenureMonths: number;
  emiAmount: number;
  disbursedDate: string;
  lastPaymentDate: string;
  surety1Name: string;
  surety2Name?: string;
  dpdDays: number;
  status: 'Active' | 'Pending Approval' | 'Closed' | 'NPA Watch';
}

export interface CoopDdoRecoveryBatch {
  id: string;
  ddoCode: string;
  ddoName: string;
  billingMonth: string; // e.g., "2026-11"
  memberCount: number;
  totalThriftDemand: number;
  totalLoanPrincipalDemand: number;
  totalDayBasedInterestDemand: number;
  totalRdDemand: number;
  grandTotalDemand: number;
  postedAt?: string;
  status: 'Draft Demand' | 'Sent to DDO' | 'Posted to Ledger';
}

export interface CoopPassbookTxn {
  id: string;
  memberId: string;
  date: string;
  accountType: 'Share Capital' | 'Thrift Fund' | 'Savings' | 'Loan Account' | 'FD/RD';
  particulars: string;
  debit: number;
  credit: number;
  mode: 'DDO Salary Deduction' | 'NEFT/UPI' | 'Cash Counter' | 'System Interest';
}

export interface CoopBackupSnapshot {
  id: string;
  timestamp: string;
  label: string;
  recordsCount: number;
  sizeKb: number;
  verifiedBy: string;
  checksum: string;
}

export interface CoopDividendRecord {
  id: string;
  financialYear: string;
  totalProfit: number;
  dividendRatePct: number;
  statutoryReserveFund: number;
  educationFund: number;
  status: 'Declared' | 'Approved in AGM' | 'Disbursed';
}

export interface CoopAgmRecord {
  id: string;
  meetingTitle: string;
  financialYear: string;
  meetingDate: string;
  quorumMet: boolean;
  resolutionsPassed: number;
  totalVotesCasted: number;
  status: 'Scheduled' | 'Completed' | 'Minutes Published';
}

// ==========================================
// CORE BANKING SYSTEM (CBS) TECHNOLOGY & IMPLEMENTATION PROCESS
// ==========================================

export interface CbsDeliverable {
  id: string;
  title: string;
  owner: string;
  targetWeek: string;
  artifactType: 'Architecture Spec' | 'Data Mapping' | 'Compliance Control' | 'Test Suite' | 'Runbook';
  completed: boolean;
}

export interface CbsPhase {
  id: string;
  phaseNumber: number;
  title: string;
  durationWeeks: number;
  gateCriterion: string;
  leadRole: string;
  objective: string;
  deliverables: CbsDeliverable[];
}

export interface CbsTechLayer {
  id: string;
  layerOrder: number;
  layerName: string;
  primaryProtocol: string;
  technologyComponents: string[];
  targetLatencyMs: number;
  throughputTps: number;
  resiliencePattern: string;
  complianceStandard: string;
}

export interface CbsMigrationBatch {
  id: string;
  domain: string;
  sourceTable: string;
  targetEntity: string;
  totalRecords: number;
  cleansedRecords: number;
  exceptionCount: number;
  legacyControlTotal: number;
  cbsMigratedTotal: number;
  stage: 'Extracted' | 'Cleansed & Deduped' | 'Transformed' | 'Loaded & Reconciled';
  lastRunAt: string;
}

export interface CbsLedgerJournalLine {
  glCode: string;
  accountTitle: string;
  debit: number;
  credit: number;
}

export interface CbsLedgerSimTxn {
  id: string;
  idempotencyKey: string;
  uetr: string;
  timestamp: string;
  eventType: 'CASA_DEPOSIT' | 'NEFT_OUTWARD' | 'LOAN_DISBURSEMENT' | 'DAILY_INTEREST_ACCRUAL' | 'EOD_GL_ROLLUP';
  iso20022MessageType: 'pacs.008.001.08' | 'camt.053.001.08' | 'pain.001.001.09';
  accountRef: string;
  amount: number;
  currency: string;
  isolationLevel: 'SERIALIZABLE' | 'SNAPSHOT_ISOLATION';
  latencyMs: number;
  status: 'COMMITTED_IMMUTABLE' | 'REVERSED';
  lines: CbsLedgerJournalLine[];
  isoXmlSnippet: string;
}

export interface CbsCutoverStep {
  id: string;
  sequence: string;
  windowLabel: string;
  title: string;
  owner: string;
  estimatedMinutes: number;
  rollbackTrigger: string;
  status: 'Pending' | 'Completed' | 'Blocked';
}

