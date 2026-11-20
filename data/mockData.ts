
import { Application, Loan, Lease, Customer, Transaction, User, Vehicle, Lender, Account, Voucher, BankAccount, BankStatementTransaction, Item, SalesInvoice, Quotation, SalesOrder, DeliveryChallan, PurchaseBill, PurchaseOrder, GoodsReceiptNote, OperationalSettings, CollectionLog, LegalCase, AgreementTemplate, GeneratedAgreement, ComplianceTask, KycStatus, ApplicationType, ApplicationStatus, TransactionStatus, TransactionType, PaymentMode, VehicleStatus, LoanStatus, AccountType, VoucherType, VoucherStatus, CustomerStatus, LeaseStatus, InvoiceStatus, OrderStatus, AssetClass, KycCompany, KycCustomer, CollectionStatus, DatabaseSettings, WorkflowStage, LegalCaseType, LegalCaseStatus, ComplianceTaskStatus, AuditFinding, AuditFindingSeverity, MetadataSettings, LegalSettings, Branch, Employee, EmployeeStatus, SupportTicket, SupportTicketStatus, InteractionLog, DevelopmentGoal, CustomerAccount, CustomerAccountType, CustomerAccountStatus, TellerTransaction, Lead, LeadStatus, Grievance, GrievanceCategory, GrievanceStatus, AmlStatus, Group, PostDatedCheque, PdcStatus, GoldLoan, CommunicationTemplate, OperationalRiskEvent, OperationalRiskCategory, StrategicGoal, Investment, InvestmentType, Borrowing, TdsPayable, TdsSection, TdsReceivable, RilletContract, RilletSaaSMetrics, RilletBankFeedTransaction, RilletPrepaidItem, RilletFluxAnalysisItem, RilletCloseChecklistTask, RilletAiQueryLog, NbfcCrarMetrics, IndAs109EclStageSummary, NbfcAlmBucket, NbfcCoLendingEscrowDeal, BureauTudfRecord, OpenCostCenter, OpenBudgetRule, OpenPeriodClosingEntry, JevQuestion, JevEvaluationOutput, JevPipeline, JevBatchRecord, JevCalibrationBin, RunamargaCallRecord, RunamargaCampaign, RunamargaTelemetryStats, RunamargaTranscriptTurn, WorkspaceProject, WorkspaceTask, WorkspaceCustomer, WorkspaceSupplier, WorkspaceDocument, WorkspaceChannelMessage, WorkspaceChecklistSubmission, WorkspaceAuditLog, TaxComplianceItem, TaxRecord, TaxChatMessage, TaxOptimizationSuggestion, BusinessKpi, BusinessStrategyGoal, BusinessAssistantMessage, SwiftMessage, NostroVostroAccount, BicDirectoryEntry, TradeFinanceDocCredit, StandingOrder, CoreBatchLog, ConfiAccount, ConfiJournalEntry, ConfiInvoice, ConfiBill, FixedAssetItem, CoopMember, CoopDeposit, CoopLoan, CoopDdoRecoveryBatch, CoopPassbookTxn, CoopBackupSnapshot, CoopDividendRecord, CoopAgmRecord, CbsPhase, CbsTechLayer, CbsMigrationBatch, CbsLedgerSimTxn, CbsCutoverStep } from '../views/types';

import { generateLeasePaymentSchedule, generateRepaymentSchedule } from '../utils/finance';

export const mockLeads: Lead[] = [
    { id: 'lead-1', name: 'Sunrise Textiles', phone: '9123456780', email: 'contact@sunrisetex.com', productInterest: ApplicationType.MSME_LOAN, source: 'Marketing Campaign Q3', status: LeadStatus.QUALIFIED, assignedTo: 'Amit Patel' },
    { id: 'lead-2', name: 'Vijay constructions', phone: '9123456781', email: 'vijay@con.com', productInterest: ApplicationType.BUSINESS_LOAN, source: 'Website Inquiry', status: LeadStatus.CONTACTED, assignedTo: 'Priya Singh' },
    { id: 'lead-3', name: 'Anita Desai', phone: '9123456782', email: 'anita@example.com', productInterest: ApplicationType.HOME_LOAN, source: 'Referral', status: LeadStatus.NEW, assignedTo: 'Amit Patel' },
];

export const mockUsers: User[] = [
    { id: 'usr-1', name: 'Super Admin', email: 'admin@fincaplen.com', role: 'Super Admin', lastLogin: '2023-06-15 10:30 AM' },
    { id: 'usr-2', name: 'Anil Kumar', email: 'anil.k@fincaplen.com', role: 'Admin', lastLogin: '2023-06-15 09:45 AM' },
    { id: 'usr-3', name: 'Priya Sharma', email: 'priya.s@fincaplen.com', role: 'Auditor', lastLogin: '2023-06-14 02:15 PM' },
    { id: 'usr-4', name: 'Amit Patel', email: 'amit.p@fincaplen.com', role: 'Sales', lastLogin: '2023-06-15 11:00 AM' },
    { id: 'usr-5', name: 'Sunil Mehta', email: 'sunil.m@fincaplen.com', role: 'Legal', lastLogin: '2023-06-15 10:00 AM' },
    { id: 'usr-6', name: 'Rekha Gupta', email: 'rekha.g@fincaplen.com', role: 'Accounting', lastLogin: '2023-06-15 09:30 AM' },
];

export const mockLenders: Lender[] = [
    { id: 'lender-1', name: 'Internal Capital Fund', type: 'Internal', totalLent: 25000000, activeLoans: 15 },
    { id: 'lender-2', name: 'Partner NBFC A', type: 'External Partner', totalLent: 15000000, activeLoans: 8, interestShare: 8.5 },
];

export const mockVehicles: Vehicle[] = [
    { id: 'v-1', make: 'Tata', model: 'Nexon EV', year: 2023, vin: 'TATANEXON12345', registrationNumber: 'KA-01-EV-1234', status: VehicleStatus.LEASED, leaseId: 'lease-app-2', monthlyLeaseRate: 25000, color: 'White', fuelType: 'Electric', transmission: 'Automatic', mileage: 15000, insurance: { provider: 'GoDigit', policyNumber: 'POL98765', expiryDate: '2024-12-31' }, fitnessCertificate: { expiryDate: '2025-01-01' }, photos: ['https://placehold.co/600x400/3b82f6/white?text=Nexon+EV'], documents: [] },
    { id: 'v-2', make: 'Mahindra', model: 'XUV700', year: 2022, vin: 'MAHINDRAXUV700', registrationNumber: 'MH-12-AB-5678', status: VehicleStatus.AVAILABLE, monthlyLeaseRate: 35000, color: 'Blue', fuelType: 'Diesel', transmission: 'Automatic', mileage: 25000, insurance: { provider: 'Acko', policyNumber: 'POL12345', expiryDate: '2023-05-31' }, fitnessCertificate: { expiryDate: '2024-12-01' }, photos: ['https://placehold.co/600x400/8b5cf6/white?text=XUV700'], documents: [] },
    { id: 'v-3', make: 'Maruti', model: 'Brezza', year: 2023, vin: 'MARUTI-BREZZA', registrationNumber: 'DL-03-CD-9012', status: VehicleStatus.LEASED, leaseId: 'lease-app-3', monthlyLeaseRate: 22000, color: 'Red', fuelType: 'Petrol', transmission: 'Manual', mileage: 8000, insurance: { provider: 'Tata AIG', policyNumber: 'POL54321', expiryDate: '2024-10-20' }, fitnessCertificate: { expiryDate: '2025-11-01' }, photos: ['https://placehold.co/600x400/f97316/white?text=Brezza'], documents: [] },
];

export const mockApplications: Application[] = [
    { id: 'app-1', leadId: 'lead-1', applicant: { name: 'Rohan Tech', type: 'Company', phone: '9876543210', email: 'rohan@tech.com', pan: 'ABCDE1234F', address: '123 Tech Park, Bangalore', gstin: '29ABCDE1234F1Z5' }, type: ApplicationType.MSME_LOAN, amount: 500000, submittedDate: '2023-06-10', status: ApplicationStatus.DISBURSED, interestRate: 14, tenureMonths: 36, documents: [] },
    { id: 'app-2', applicant: { name: 'Priya Services', type: 'Company', phone: '9876543211', email: 'priya@services.com', pan: 'FGHIJ5678K', address: '456 Service Road, Mumbai', gstin: '27FGHIJ5678K1Z6' }, type: ApplicationType.AUTO_LEASE, amount: 1200000, submittedDate: '2023-06-12', status: ApplicationStatus.ACTIVE, documents: [] },
    { id: 'app-3', applicant: { name: 'Amit Singh', type: 'Individual', phone: '9876543212', email: 'amit@singh.com', pan: 'KLMNO9012P', address: '789 Residential Area, Delhi', aadhaar: '123456789012' }, type: ApplicationType.HOME_LOAN, amount: 7500000, submittedDate: '2023-06-14', status: ApplicationStatus.PENDING_UNDERWRITING, interestRate: 8.5, tenureMonths: 240, documents: [] },
    { id: 'app-4', applicant: { name: 'Global Exports', type: 'Company', phone: '9876543213', email: 'contact@globalexports.com', pan: 'PQRST3456Y', address: '987 Export Zone, Chennai', gstin: '33PQRST3456Y1Z7' }, type: ApplicationType.BUSINESS_LOAN, amount: 2500000, submittedDate: '2023-05-20', status: ApplicationStatus.DISBURSED, interestRate: 12.5, tenureMonths: 48, documents: [] },
];

const sanctionLetterTemplate: AgreementTemplate = { id: 'tpl-1', name: 'Standard Sanction Letter', type: 'Sanction Letter', content: '...', createdAt: '2023-01-01' };
const loanAgreementTemplate: AgreementTemplate = { id: 'tpl-2', name: 'MSME Loan Agreement', type: 'Loan Agreement', content: '...', createdAt: '2023-01-01' };
const leaseAgreementTemplate: AgreementTemplate = { id: 'tpl-3', name: 'Vehicle Lease Agreement', type: 'Lease Agreement', content: '...', createdAt: '2023-01-01' };

export const mockAgreementTemplates: AgreementTemplate[] = [sanctionLetterTemplate, loanAgreementTemplate, leaseAgreementTemplate];

export const mockLoans: Loan[] = [
    { id: 'loan-1', applicationId: 'app-1', customerId: 'cust-ABCDE1234F', applicantName: 'Rohan Tech', loanType: ApplicationType.MSME_LOAN, principalAmount: 500000, disbursedDate: '2023-06-15', interestRate: 14, tenureMonths: 36, status: LoanStatus.ACTIVE, repaymentSchedule: generateRepaymentSchedule(500000, 14, 36, '2023-06-15'), assetClass: AssetClass.STANDARD, daysPastDue: 0, hasLegalCase: false, collectionStatus: CollectionStatus.NONE, generatedAgreementIds: ['gen-agr-1'], coLenders: [{ lenderId: 'lender-1', lenderName: 'Internal Capital Fund', sharePercentage: 80 }, { lenderId: 'lender-2', lenderName: 'Partner NBFC A', sharePercentage: 20 }] },
    { id: 'loan-2', applicationId: 'app-3', customerId: 'cust-KLMNO9012P', applicantName: 'Amit Singh', loanType: ApplicationType.HOME_LOAN, principalAmount: 7500000, disbursedDate: '2023-06-20', interestRate: 8.5, tenureMonths: 240, status: LoanStatus.ACTIVE, repaymentSchedule: generateRepaymentSchedule(7500000, 8.5, 240, '2023-06-20'), assetClass: AssetClass.STANDARD, daysPastDue: 0, hasLegalCase: false, collectionStatus: CollectionStatus.NONE, generatedAgreementIds: ['gen-agr-3'] },
    { id: 'loan-3', applicationId: 'app-4', customerId: 'cust-PQRST3456Y', applicantName: 'Global Exports', loanType: ApplicationType.BUSINESS_LOAN, principalAmount: 2500000, disbursedDate: '2023-05-25', interestRate: 12.5, tenureMonths: 48, status: LoanStatus.OVERDUE, repaymentSchedule: generateRepaymentSchedule(2500000, 12.5, 48, '2023-05-25').map((inst, i) => i < 3 ? {...inst, status: 'Paid'} : inst), assetClass: AssetClass.SMA_1, daysPastDue: 35, hasLegalCase: false, collectionStatus: CollectionStatus.IN_PROGRESS, generatedAgreementIds: [], fieldAgent: 'Priya Singh' },
];

export const mockLeases: Lease[] = [
    { id: 'lease-1', applicationId: 'app-2', vehicleId: 'v-1', customerId: 'cust-FGHIJ5678K', applicantName: 'Priya Services', vehicleName: 'Tata Nexon EV', startDate: '2023-06-18', endDate: '2026-06-17', monthlyPayment: 25000, securityDeposit: 50000, status: LeaseStatus.ACTIVE, paymentSchedule: generateLeasePaymentSchedule(25000, 36, '2023-06-18'), cersaiRegistrationId: 'CERSAI12345', hasLegalCase: false, collectionStatus: CollectionStatus.NONE, generatedAgreementIds: ['gen-agr-2'] },
];

export const mockCustomers: Customer[] = [
    { id: 'cust-ABCDE1234F', pan: 'ABCDE1234F', name: 'Rohan Tech', type: 'Company', status: CustomerStatus.ACTIVE, address: '123 Tech Park, Bangalore', riskRating: 'Low', branchId: 'br-1', groupId: 'grp-1' },
    { id: 'cust-FGHIJ5678K', pan: 'FGHIJ5678K', name: 'Priya Services', type: 'Company', status: CustomerStatus.ACTIVE, address: '456 Service Road, Mumbai', riskRating: 'Low', branchId: 'br-1', groupId: 'grp-1' },
    { id: 'cust-KLMNO9012P', pan: 'KLMNO9012P', name: 'Amit Singh', type: 'Individual', status: CustomerStatus.ACTIVE, address: '789 Residential Area, Delhi', riskRating: 'Medium', branchId: 'br-1', groupId: 'grp-2' },
    { id: 'cust-PQRST3456Y', pan: 'PQRST3456Y', name: 'Global Exports', type: 'Company', status: CustomerStatus.HIGH_RISK, address: '987 Export Zone, Chennai', riskRating: 'High', branchId: 'br-1', groupId: 'grp-2' },
];

export const mockTransactions: Transaction[] = [
    { id: 'txn-1', date: '2023-06-15', description: 'Loan Disbursal to Rohan Tech', amount: 500000, type: TransactionType.DEBIT, mode: PaymentMode.NEFT, status: TransactionStatus.COMPLETED, referenceNumber: 'NEFT12345', accountId: 'ba-1', amlStatus: AmlStatus.CLEAN },
    { id: 'txn-2', date: '2023-07-05', description: 'EMI Payment from Rohan Tech', amount: 17094, type: TransactionType.CREDIT, mode: PaymentMode.UPI, status: TransactionStatus.COMPLETED, referenceNumber: 'UPI67890', accountId: 'ba-1', amlStatus: AmlStatus.CLEAN },
    { id: 'txn-3', date: '2023-08-10', description: 'Large cash deposit', amount: 800000, type: TransactionType.CREDIT, mode: PaymentMode.CASH, status: TransactionStatus.COMPLETED, referenceNumber: 'CASH-001', accountId: 'ba-1', amlStatus: AmlStatus.FLAGGED, amlRuleTriggered: 'Large single cash deposit > 5L' },
    { id: 'txn-4', date: '2023-08-11', description: 'Immediate fund transfer post deposit', amount: 750000, type: TransactionType.DEBIT, mode: PaymentMode.RTGS, status: TransactionStatus.COMPLETED, referenceNumber: 'RTGS-001', accountId: 'ba-1', amlStatus: AmlStatus.FLAGGED, amlRuleTriggered: 'Rapid movement of funds' },
];

export const mockAccounts: Account[] = [
    { id: 'acc-1', accountCode: '1010', accountName: 'Cash', accountType: AccountType.ASSET, group: 'Current Assets', openingBalance: 50000, balance: 50000 },
    { id: 'acc-2', accountCode: '1020', accountName: 'HDFC Bank', accountType: AccountType.ASSET, group: 'Bank Accounts', openingBalance: 1000000, balance: 500000 },
    { id: 'acc-3', accountCode: '2010', accountName: 'Loans Payable', accountType: AccountType.LIABILITY, group: 'Current Liabilities', openingBalance: 0, balance: 500000 },
];

export const mockVouchers: Voucher[] = [
    { id: 'v-1', voucherNumber: 'JV-001', voucherType: VoucherType.JOURNAL, date: '2023-06-15', description: 'Loan disbursal entry', lines: [{ accountId: 'acc-2', accountName: 'HDFC Bank', debit: 500000, credit: 0 }, { accountId: 'acc-3', accountName: 'Loans Payable', debit: 0, credit: 500000 }], status: VoucherStatus.APPROVED, createdBy: 'Admin', approvedBy: 'Super Admin' },
];

export const mockBankAccounts: BankAccount[] = [
    { id: 'ba-1', bankName: 'HDFC Bank', accountNumber: '...1234', ifsc: 'HDFC0001234', balance: 500000, isPrimary: true, linkStatus: 'Linked' },
];

export const mockBankStatementTransactions: BankStatementTransaction[] = [
    { id: 'bst-1', date: '2023-06-15', description: 'NEFT Out Rohan Tech', amount: 500000, type: 'Debit', isReconciled: true },
    { id: 'bst-2', date: '2023-07-05', description: 'UPI In Rohan Tech', amount: 17094, type: 'Credit', isReconciled: true },
];

export const mockItems: Item[] = [{ id: 'item-1', name: 'Laptop', sku: 'LP-001', salePrice: 80000, purchasePrice: 65000, stock: 50, hsnCode: '8471' }];

export const mockSalesInvoices: SalesInvoice[] = [{ id: 'si-1', invoiceNumber: 'SI-001', partyName: 'Customer A', date: '2023-07-01', dueDate: '2023-07-31', totalAmount: 94400, amountPaid: 0, status: InvoiceStatus.UNPAID, gstAmount: 14400 }];

export const mockQuotations: Quotation[] = [{ id: 'qt-1', quotationNumber: 'QT-001', partyName: 'Lead B', date: '2023-07-02', expiryDate: '2023-07-17', totalAmount: 160000, status: 'Sent' }];

export const mockSalesOrders: SalesOrder[] = [];
export const mockDeliveryChallans: DeliveryChallan[] = [];
export const mockPurchaseBills: PurchaseBill[] = [{ id: 'pb-1', billNumber: 'PB-001', partyName: 'Supplier X', date: '2023-07-05', dueDate: '2023-08-04', totalAmount: 59000, gstAmount: 9000, amountPaid: 59000, status: InvoiceStatus.PAID }];
export const mockPurchaseOrders: PurchaseOrder[] = [];
export const mockGoodsReceiptNotes: GoodsReceiptNote[] = [];

const mockWorkflowStages: WorkflowStage[] = [
    { id: 'wf-1', name: 'Credit Check', description: 'Perform CIBIL and other credit checks.', responsibleRole: 'Admin' },
    { id: 'wf-2', name: 'Management Approval', description: 'Approval from department head.', responsibleRole: 'Super Admin' },
];

export const mockOperationalSettings: OperationalSettings = {
    latePaymentFee: 500,
    overdueInterestRate: 24,
    companyName: 'fincaplen NBFC',
    companyPan: 'ABCDE1234F',
    companyGstin: '29ABCDE1234F1Z5',
    workflowStages: mockWorkflowStages,
};

export const mockCollectionLogs: CollectionLog[] = [];
export const mockLegalCases: LegalCase[] = [];

export const mockGeneratedAgreements: GeneratedAgreement[] = [
    { id: 'gen-agr-1', templateId: 'tpl-2', applicationId: 'app-1', type: 'Loan Agreement', content: '...', status: 'Signed', generatedAt: '2023-06-14', signedAt: '2023-06-15' },
];

export const mockComplianceTasks: ComplianceTask[] = [
    { id: 'ct-1', title: 'File RBI Return NBS-7', type: 'RBI', dueDate: '2023-07-15', status: ComplianceTaskStatus.PENDING },
];

export const mockKycCompanies: KycCompany[] = [
    { id: 'kyc-c-1', companyName: 'Rohan Tech', gstin: '29ABCDE1234F1Z5', status: KycStatus.VERIFIED, documents: [], ckycStatus: 'Uploaded', ckycIdentifier: '12345678901234' },
];

export const mockKycCustomers: KycCustomer[] = [
    { id: 'kyc-p-1', customerName: 'Amit Singh', pan: 'KLMNO9012P', status: KycStatus.VERIFIED, documents: [], ckycStatus: 'Uploaded', ckycIdentifier: '56789012345678' },
];

export const mockDatabaseSettings: DatabaseSettings = { type: 'PostgreSQL', host: 'localhost', port: 5432, username: 'fincaplen', dbName: 'fincaplen_prod' };

export const mockAuditFindings: AuditFinding[] = [
    { id: 'af-1', area: 'Data Integrity', finding: 'Mismatch in calculated EMI and recorded EMI for loan-1.', recommendation: 'Recalculate and update EMI schedule.', severity: AuditFindingSeverity.HIGH, timestamp: '2023-07-10T10:00:00Z' },
];

export const mockMetadataSettings: MetadataSettings = { siteTitle: 'fincaplen', metaDescription: 'Financial Management Suite', metaKeywords: 'nbfc, lending, leasing', faviconUrl: '' };

export const mockLegalSettings: LegalSettings = { companyLegalName: 'fincaplen Financial Services Pvt. Ltd.', copyrightNotice: '© 2023 fincaplen. All Rights Reserved.', termsOfServiceUrl: '/tos', privacyPolicyUrl: '/privacy' };

export const mockBranches: Branch[] = [
    {
        id: 'br-1',
        name: 'Bangalore Central HQ',
        branchCode: 'BLR-HO',
        location: 'Koramangala, Bangalore',
        manager: 'Anil Kumar',
        totalAssets: 150000000,
        employeeCount: 25,
        isHeadquarters: true,
        region: 'South HQ Cluster',
        hqSyncMode: 'REALTIME_HQ_STREAM',
        syncStatus: 'SYNCHRONIZED',
        replicationLagMs: 0,
        lastSyncAt: 'Live (< 5ms)',
        vpnTunnelIp: '10.100.0.10',
        activeModules: ['lms', 'accounting', 'risk', 'analytics', 'system', 'intelligence', 'legal', 'coreBanking', 'treasury', 'paymentsHub', 'goldAndGroupLoans', 'aiSuite', 'branchOps', 'coopSociety'],
    },
    {
        id: 'br-2',
        name: 'Mumbai Zonal Financial Hub',
        branchCode: 'MUM-ZN',
        location: 'Bandra Kurla Complex, Mumbai',
        manager: 'Priya Nair',
        totalAssets: 94500000,
        employeeCount: 18,
        isHeadquarters: false,
        region: 'West Zone',
        hqSyncMode: 'REALTIME_HQ_STREAM',
        syncStatus: 'SYNCHRONIZED',
        replicationLagMs: 14,
        lastSyncAt: '2 sec ago',
        vpnTunnelIp: '10.102.4.21',
        activeModules: ['coreBanking', 'treasury', 'paymentsHub', 'accounting', 'risk', 'branchOps', 'legal'],
    },
    {
        id: 'br-3',
        name: 'Delhi NCR Corporate Branch',
        branchCode: 'DEL-CR',
        location: 'Connaught Place, New Delhi',
        manager: 'Vikramaditya Rao',
        totalAssets: 72000000,
        employeeCount: 14,
        isHeadquarters: false,
        region: 'North Zone',
        hqSyncMode: 'REALTIME_HQ_STREAM',
        syncStatus: 'SYNCHRONIZED',
        replicationLagMs: 22,
        lastSyncAt: '4 sec ago',
        vpnTunnelIp: '10.104.8.15',
        activeModules: ['lms', 'accounting', 'coreBanking', 'risk', 'branchOps'],
    },
    {
        id: 'br-4',
        name: 'Chennai Southern Credit Branch',
        branchCode: 'CHN-SC',
        location: 'T. Nagar, Chennai',
        manager: 'Meenakshi Sundaram',
        totalAssets: 48500000,
        employeeCount: 11,
        isHeadquarters: false,
        region: 'South Zone',
        hqSyncMode: 'STORE_AND_FORWARD',
        syncStatus: 'SYNCHRONIZED',
        replicationLagMs: 41,
        lastSyncAt: '12 sec ago',
        vpnTunnelIp: '10.108.2.33',
        activeModules: ['lms', 'goldAndGroupLoans', 'coopSociety', 'accounting', 'branchOps'],
    },
];

export const mockEmployees: Employee[] = [
    { id: 'emp-1', employeeId: 'IF-001', name: 'Super Admin', role: 'Platform Owner', department: 'Administration', joiningDate: '2022-01-01', status: EmployeeStatus.ACTIVE },
    { id: 'emp-2', employeeId: 'IF-002', name: 'Priya Sharma', role: 'Credit Analyst', department: 'Credit & Underwriting', joiningDate: '2022-03-15', status: EmployeeStatus.ACTIVE },
    { id: 'emp-3', employeeId: 'IF-003', name: 'Anil Kumar', role: 'Finance Manager', department: 'Finance & Accounting', joiningDate: '2022-02-01', status: EmployeeStatus.ACTIVE },
];

export const mockSupportTickets: SupportTicket[] = [
    { id: 'st-1', ticketId: 'TICK-001', customerName: 'Rohan Tech', subject: 'EMI date change request', description: 'Customer wants to change their EMI due date from 5th to 10th of every month.', createdAt: '2023-07-20', status: SupportTicketStatus.IN_PROGRESS, assignedTo: 'Priya Sharma' },
    { id: 'st-2', ticketId: 'TICK-002', customerName: 'Amit Singh', subject: 'Portal login issue', description: 'Cannot login to the customer portal. Password reset link is not working.', createdAt: '2023-07-19', status: SupportTicketStatus.OPEN, assignedTo: 'Unassigned' },
    { id: 'st-3', ticketId: 'TICK-003', customerName: 'Priya Services', subject: 'Incorrect late fee charged', description: 'A late fee was applied even though the payment was made on the due date.', createdAt: '2023-07-18', status: SupportTicketStatus.RESOLVED, assignedTo: 'Anil Kumar' },
];

export const mockInteractionLogs: InteractionLog[] = [
    { id: 'int-1', customerId: 'cust-ABCDE1234F', date: '2023-07-10', type: 'Call', summary: 'Discussed repayment schedule. Customer confirmed understanding.', sentiment: 'Positive', loggedBy: 'Priya Sharma' },
    { id: 'int-2', customerId: 'cust-ABCDE1234F', date: '2023-07-25', type: 'Email', summary: 'Sent reminder for upcoming EMI. Acknowledged by customer.', sentiment: 'Neutral', loggedBy: 'System' },
];

export const mockDevelopmentGoals: DevelopmentGoal[] = [
    { id: 'dg-1', employeeId: 'emp-2', title: 'Advanced Credit Risk Analysis Certification', description: 'Complete the online certification by end of Q4.', status: 'In Progress', deadline: '2023-12-31' },
    { id: 'dg-2', employeeId: 'emp-2', title: 'Improve Public Speaking Skills', description: 'Present at two internal team meetings.', status: 'Not Started', deadline: '2023-11-30' },
];

export const mockStrategicGoals: StrategicGoal[] = [
    { id: 'sg-1', title: 'Increase MSME Loan Portfolio', quarter: 'Q4 2023', description: 'Grow the total MSME loan book.', kpi: 'Total Disbursed Amount', target: 50000000, current: 42000000, status: 'On Track' },
    { id: 'sg-2', title: 'Reduce NPA Percentage', quarter: 'Q4 2023', description: 'Bring down Gross NPA from 3.5% to below 2.5%.', kpi: 'Gross NPA %', target: 2.5, current: 2.8, status: 'At Risk' },
    { id: 'sg-3', title: 'Digital Onboarding Launch', quarter: 'Q4 2023', description: 'Successfully launch the new digital onboarding platform for customers.', kpi: 'Project Completion %', target: 100, current: 100, status: 'Achieved' },
];

export const mockCustomerAccounts: CustomerAccount[] = [
    { id: 'ca-1', customerId: 'cust-ABCDE1234F', customerName: 'Rohan Tech', accountNumber: '123456789012', accountType: CustomerAccountType.CURRENT, balance: 250000, status: CustomerAccountStatus.ACTIVE, openDate: '2023-01-15' },
    { id: 'ca-2', customerId: 'cust-KLMNO9012P', customerName: 'Amit Singh', accountNumber: '987654321098', accountType: CustomerAccountType.SAVINGS, balance: 120000, status: CustomerAccountStatus.ACTIVE, openDate: '2022-11-20' },
    { id: 'ca-3', customerId: 'cust-FGHIJ5678K', customerName: 'Priya Services', accountNumber: '564738291054', accountType: CustomerAccountType.CURRENT, balance: 75000, status: CustomerAccountStatus.DORMANT, openDate: '2021-05-10' },
];

export const mockTellerTransactions: TellerTransaction[] = [
    { id: 'tt-1', transactionType: 'Deposit', accountNumber: '987654321098', customerName: 'Amit Singh', amount: 10000, date: new Date().toISOString().split('T')[0], teller: 'Anil Kumar' },
    { id: 'tt-2', transactionType: 'Withdrawal', accountNumber: '123456789012', customerName: 'Rohan Tech', amount: 5000, date: new Date().toISOString().split('T')[0], teller: 'Anil Kumar' },
];

export const mockGrievances: Grievance[] = [
    { id: 'grv-1', grievanceId: 'GRV-2023-001', customerId: 'cust-PQRST3456Y', customerName: 'Global Exports', category: GrievanceCategory.COLLECTIONS, description: 'Collection agent was rude and unprofessional during their visit.', status: GrievanceStatus.OPEN, createdAt: '2023-10-25', dueDate: '2023-11-08' },
    { id: 'grv-2', grievanceId: 'GRV-2023-002', customerId: 'cust-ABCDE1234F', customerName: 'Rohan Tech', category: GrievanceCategory.INTEREST_RATES, description: 'Interest rate charged on the last EMI seems higher than the agreed-upon rate.', status: GrievanceStatus.UNDER_INVESTIGATION, createdAt: '2023-10-22', dueDate: '2023-11-05' },
    { id: 'grv-3', grievanceId: 'GRV-2023-003', customerId: 'cust-KLMNO9012P', customerName: 'Amit Singh', category: GrievanceCategory.LOAN_PROCESSING, description: 'Application for a top-up loan has been pending for over 3 weeks without any update.', status: GrievanceStatus.RESOLVED, createdAt: '2023-09-15', resolvedAt: '2023-09-20', dueDate: '2023-09-29' },
];

export const mockGroups: Group[] = [
    { id: 'grp-1', name: 'Shakti Self-Help Group', center: 'Ramnagar Village', leaderId: 'cust-ABCDE1234F', branchId: 'br-1', memberIds: ['cust-ABCDE1234F', 'cust-FGHIJ5678K'] },
    { id: 'grp-2', name: 'Uday Joint-Liability Group', center: 'Gandhipuram', leaderId: 'cust-KLMNO9012P', branchId: 'br-1', memberIds: ['cust-KLMNO9012P', 'cust-PQRST3456Y'] },
];

export const mockPdcs: PostDatedCheque[] = [
    { id: 'pdc-1', loanId: 'loan-1', applicantName: 'Rohan Tech', chequeNumber: '123456', chequeDate: '2023-11-05', bankName: 'HDFC Bank', amount: 17094, status: PdcStatus.DEPOSITED },
    { id: 'pdc-2', loanId: 'loan-1', applicantName: 'Rohan Tech', chequeNumber: '123457', chequeDate: '2023-12-05', bankName: 'HDFC Bank', amount: 17094, status: PdcStatus.PENDING },
    { id: 'pdc-3', loanId: 'loan-3', applicantName: 'Global Exports', chequeNumber: '654321', chequeDate: '2023-10-15', bankName: 'ICICI Bank', amount: 66000, status: PdcStatus.BOUNCED },
    { id: 'pdc-4', loanId: 'loan-3', applicantName: 'Global Exports', chequeNumber: '654322', chequeDate: '2023-09-15', bankName: 'ICICI Bank', amount: 66000, status: PdcStatus.CLEARED },
];

export const mockGoldLoans: GoldLoan[] = [
    {
        id: 'gl-1',
        applicationId: 'app-gl-1',
        customerId: 'cust-KLMNO9012P',
        applicantName: 'Amit Singh',
        loanType: ApplicationType.GOLD_LOAN,
        principalAmount: 150000,
        disbursedDate: '2023-10-10',
        interestRate: 12,
        tenureMonths: 12,
        status: LoanStatus.PLEDGED,
        repaymentSchedule: generateRepaymentSchedule(150000, 12, 12, '2023-10-10'),
        assetClass: AssetClass.STANDARD,
        daysPastDue: 0,
        hasLegalCase: false,
        collectionStatus: CollectionStatus.NONE,
        generatedAgreementIds: [],
        pledgePacketNumber: 'PKT-A-101',
        appraisedValue: 200000,
        jewelDetails: [
            { id: 'j-1', itemType: 'Chain', purity: 22, grossWeight: 30, stoneWeight: 0, netWeight: 30 },
            { id: 'j-2', itemType: 'Bangle', purity: 22, grossWeight: 20.5, stoneWeight: 0.5, netWeight: 20 },
        ]
    },
    {
        id: 'gl-2',
        applicationId: 'app-gl-2',
        customerId: 'cust-ABCDE1234F',
        applicantName: 'Rohan Tech',
        loanType: ApplicationType.GOLD_LOAN,
        principalAmount: 75000,
        disbursedDate: '2023-08-01',
        interestRate: 12,
        tenureMonths: 6,
        status: LoanStatus.DEFAULTED,
        repaymentSchedule: generateRepaymentSchedule(75000, 12, 6, '2023-08-01'),
        assetClass: AssetClass.SUB_STANDARD,
        daysPastDue: 95,
        hasLegalCase: false,
        collectionStatus: CollectionStatus.LEGAL,
        generatedAgreementIds: [],
        pledgePacketNumber: 'PKT-B-205',
        appraisedValue: 100000,
        jewelDetails: [
            { id: 'j-3', itemType: 'Ring', purity: 24, grossWeight: 15, stoneWeight: 0, netWeight: 15 },
        ]
    }
];

export const mockCommunicationTemplates: CommunicationTemplate[] = [
    { id: 'tpl-comm-1', event: 'EMI Reminder', channel: 'SMS', content: 'Dear {{customerName}}, your EMI of {{emiAmount}} is due on {{dueDate}}. Please pay on time. - fincaplen', isActive: true },
    { id: 'tpl-comm-2', event: 'EMI Reminder', channel: 'Email', subject: 'Upcoming EMI Reminder', content: 'Dear {{customerName}},\n\nThis is a friendly reminder that your upcoming EMI payment of {{emiAmount}} is due on {{dueDate}}.\n\nThank you,\nfincaplen Team', isActive: true },
    { id: 'tpl-comm-3', event: 'Overdue Notice', channel: 'SMS', content: 'Dear {{customerName}}, your EMI of {{emiAmount}} due on {{dueDate}} is overdue by {{daysPastDue}} days. Please pay immediately to avoid penalties. - fincaplen', isActive: true },
    { id: 'tpl-comm-4', event: 'Payment Confirmation', channel: 'Email', subject: 'Payment Received', content: 'Dear {{customerName}},\n\nWe have successfully received your payment of {{paymentAmount}} for your loan account.\n\nThank you,\nfincaplen Team', isActive: false },
];

export const mockOperationalRiskEvents: OperationalRiskEvent[] = [
    { id: 'ore-1', date: '2023-10-15', category: OperationalRiskCategory.FRAUD, description: 'Potential fraudulent activity detected on loan application APP-FRAUD-01.', impact: 'High', status: 'Under Investigation' },
    { id: 'ore-2', date: '2023-10-20', category: OperationalRiskCategory.SYSTEM_FAILURE, description: 'Core banking system experienced 15 minutes of downtime during peak hours.', impact: 'Medium', status: 'Resolved' },
    { id: 'ore-3', date: '2023-10-22', category: OperationalRiskCategory.PROCESS_ERROR, description: 'Incorrect interest rate applied to a batch of 5 new home loans.', impact: 'Medium', status: 'Resolved' },
];

export const mockInvestments: Investment[] = [
    { id: 'inv-1', name: 'GOI 7.26% 2033', type: InvestmentType.GOVERNMENT_SECURITIES, purchaseDate: '2023-05-10', quantity: 1000000, purchasePrice: 1015000, currentValue: 1021000, maturityDate: '2033-05-10' },
    { id: 'inv-2', name: 'Reliance Industries 8% Bond', type: InvestmentType.CORPORATE_BONDS, purchaseDate: '2023-06-15', quantity: 500000, purchasePrice: 500000, currentValue: 502500, maturityDate: '2028-06-15' },
    { id: 'inv-3', name: 'HDFC Mid-Cap Opportunities Fund', type: InvestmentType.MUTUAL_FUNDS, purchaseDate: '2023-01-20', quantity: 2000, purchasePrice: 100000, currentValue: 116000 },
];

export const mockBorrowings: Borrowing[] = [
    { id: 'bor-1', lenderName: 'State Bank of India', facilityType: 'Term Loan', sanctionedAmount: 50000000, outstandingAmount: 45000000, interestRate: 8.5, maturityDate: '2028-12-31' },
    { id: 'bor-2', lenderName: 'ICICI Bank', facilityType: 'Cash Credit', sanctionedAmount: 20000000, outstandingAmount: 12000000, interestRate: 9.0, maturityDate: '2024-12-31' },
];

export const mockTdsPayables: TdsPayable[] = [
    { id: 'tdsp-1', payeeName: 'Consulting Firm LLP', pan: 'AACFC1234E', paymentDate: '2023-07-15', amountPaid: 200000, tdsRate: 10, tdsAmount: 20000, section: TdsSection._194J, status: 'Paid' },
    { id: 'tdsp-2', payeeName: 'Office Rentals Ltd', pan: 'AABCO5678F', paymentDate: '2023-07-05', amountPaid: 150000, tdsRate: 10, tdsAmount: 15000, section: TdsSection._194I, status: 'Paid' },
    { id: 'tdsp-3', payeeName: 'Sales Agent Ram', pan: 'AGHPT9012G', paymentDate: '2023-08-02', amountPaid: 50000, tdsRate: 5, tdsAmount: 2500, section: TdsSection._194H, status: 'Due' },
];

export const mockTdsReceivables: TdsReceivable[] = [
    { id: 'tdsr-1', payerName: 'Major Client Inc.', grossAmount: 1000000, tdsDeducted: 10000, receivedDate: '2023-07-20', form16AStatus: 'Pending' },
    { id: 'tdsr-2', payerName: 'Partner Corp.', grossAmount: 500000, tdsDeducted: 5000, receivedDate: '2023-06-18', form16AStatus: 'Available' },
];

// --- SWIFT & CORE BANKING MOCK DATA ---

export const mockBicDirectory: BicDirectoryEntry[] = [
  { bic: 'CHASUS33XXX', institutionName: 'JPMorgan Chase Bank, N.A.', branchName: 'Head Office', city: 'New York', country: 'United States', countryCode: 'US', networkStatus: 'CONNECTED_LIVE', supportedProtocols: ['FIN (MT)', 'ISO 20022 (MX)', 'SWIFT gpi'], rmaStatus: 'AUTHORISED', cutoffTimeGmt: '21:00' },
  { bic: 'BNPAFRPPXXX', institutionName: 'BNP Paribas S.A.', branchName: 'Central Branch', city: 'Paris', country: 'France', countryCode: 'FR', networkStatus: 'CONNECTED_LIVE', supportedProtocols: ['FIN (MT)', 'ISO 20022 (MX)', 'SWIFT gpi'], rmaStatus: 'AUTHORISED', cutoffTimeGmt: '17:30' },
  { bic: 'DEUTDEDDFXX', institutionName: 'Deutsche Bank AG', branchName: 'Frankfurt Main', city: 'Frankfurt', country: 'Germany', countryCode: 'DE', networkStatus: 'CONNECTED_LIVE', supportedProtocols: ['FIN (MT)', 'ISO 20022 (MX)', 'SWIFT gpi'], rmaStatus: 'AUTHORISED', cutoffTimeGmt: '18:00' },
  { bic: 'BARCGB22XXX', institutionName: 'Barclays Bank PLC', branchName: 'London HQ', city: 'London', country: 'United Kingdom', countryCode: 'GB', networkStatus: 'CONNECTED_LIVE', supportedProtocols: ['FIN (MT)', 'ISO 20022 (MX)', 'SWIFT gpi'], rmaStatus: 'AUTHORISED', cutoffTimeGmt: '18:30' },
  { bic: 'SBININBBXXX', institutionName: 'State Bank of India', branchName: 'Global Operations', city: 'Mumbai', country: 'India', countryCode: 'IN', networkStatus: 'CONNECTED_LIVE', supportedProtocols: ['FIN (MT)', 'ISO 20022 (MX)', 'SWIFT gpi'], rmaStatus: 'AUTHORISED', cutoffTimeGmt: '19:00' },
  { bic: 'DBSSSGSGXXX', institutionName: 'DBS Bank Ltd', branchName: 'Marina Bay', city: 'Singapore', country: 'Singapore', countryCode: 'SG', networkStatus: 'CONNECTED_LIVE', supportedProtocols: ['FIN (MT)', 'ISO 20022 (MX)', 'SWIFT gpi'], rmaStatus: 'AUTHORISED', cutoffTimeGmt: '16:00' },
  { bic: 'HSBCHKHXXXX', institutionName: 'HSBC Hong Kong', branchName: 'Queen’s Road', city: 'Hong Kong', country: 'Hong Kong', countryCode: 'HK', networkStatus: 'CONNECTED_LIVE', supportedProtocols: ['FIN (MT)', 'ISO 20022 (MX)', 'SWIFT gpi'], rmaStatus: 'AUTHORISED', cutoffTimeGmt: '16:30' },
  { bic: 'UBSWCHZHXXX', institutionName: 'UBS Switzerland AG', branchName: 'Zurich Centre', city: 'Zurich', country: 'Switzerland', countryCode: 'CH', networkStatus: 'CONNECTED_LIVE', supportedProtocols: ['FIN (MT)', 'ISO 20022 (MX)', 'SWIFT gpi'], rmaStatus: 'AUTHORISED', cutoffTimeGmt: '17:00' }
];

export const mockNostroVostroAccounts: NostroVostroAccount[] = [
  { id: 'nv-1', accountType: 'NOSTRO', correspondentBank: 'JPMorgan Chase Bank, N.A.', bic: 'CHASUS33XXX', currency: 'USD', ourLedgerBalance: 4250000.00, mirrorStatementBalance: 4250000.00, unreconciledItemsCount: 0, country: 'United States', creditLimit: 10000000, status: 'ACTIVE', lastReconciledAt: '2026-08-21 23:45:00' },
  { id: 'nv-2', accountType: 'NOSTRO', correspondentBank: 'Deutsche Bank AG', bic: 'DEUTDEDDFXX', currency: 'EUR', ourLedgerBalance: 3180450.50, mirrorStatementBalance: 3175200.00, unreconciledItemsCount: 2, country: 'Germany', creditLimit: 8000000, status: 'ACTIVE', lastReconciledAt: '2026-08-22 03:15:00' },
  { id: 'nv-3', accountType: 'NOSTRO', correspondentBank: 'Barclays Bank PLC', bic: 'BARCGB22XXX', currency: 'GBP', ourLedgerBalance: 1840000.00, mirrorStatementBalance: 1840000.00, unreconciledItemsCount: 0, country: 'United Kingdom', creditLimit: 5000000, status: 'ACTIVE', lastReconciledAt: '2026-08-21 22:30:00' },
  { id: 'nv-4', accountType: 'VOSTRO', correspondentBank: 'DBS Bank Singapore', bic: 'DBSSSGSGXXX', currency: 'INR', ourLedgerBalance: 84500000.00, mirrorStatementBalance: 84500000.00, unreconciledItemsCount: 0, country: 'Singapore', creditLimit: 150000000, status: 'ACTIVE', lastReconciledAt: '2026-08-22 04:00:00' },
  { id: 'nv-5', accountType: 'VOSTRO', correspondentBank: 'BNP Paribas S.A.', bic: 'BNPAFRPPXXX', currency: 'INR', ourLedgerBalance: 45200000.00, mirrorStatementBalance: 45000000.00, unreconciledItemsCount: 1, country: 'France', creditLimit: 100000000, status: 'ACTIVE', lastReconciledAt: '2026-08-21 20:10:00' }
];

export const mockSwiftMessages: SwiftMessage[] = [
  {
    id: 'msg-sw-001',
    messageType: 'MT103',
    uetr: 'eb54f3b8-62d1-4cb5-b461-9c6dfa693b71',
    senderBic: 'SBININBBXXX',
    receiverBic: 'CHASUS33XXX',
    senderName: 'fincaplen Core Bank Mumbai',
    receiverName: 'JPMorgan Chase NY',
    amount: 145000.00,
    currency: 'USD',
    direction: 'OUTBOUND',
    status: 'ACKNOWLEDGED',
    valueDate: '2026-08-22',
    referenceNumber: 'FT260822009841',
    orderingCustomer: {
      name: 'Apex Global Logistics Ltd',
      accountOrIban: '984029418294',
      address: 'Plot 44, SEZ Cyber Park, Mumbai, IN'
    },
    beneficiaryCustomer: {
      name: 'Pacific Maritime Components Inc',
      accountOrIban: 'US44CHAS00019284759382',
      bankName: 'JPMorgan Chase Bank, NY',
      address: '270 Park Ave, New York, NY 10017'
    },
    intermediaryBic: 'CHASUS33XXX',
    chargeDetails: 'OUR',
    remittanceInfo: 'INV-2026-PAC-9041 FREIGHT ENGINE SPARES',
    rawSwiftBlock: `{1:F01SBININBBAXXX0000000000}{2:I103CHASUS33XXXXN}{3:{121:eb54f3b8-62d1-4cb5-b461-9c6dfa693b71}}{4:
:20:FT260822009841
:23B:CRED
:32A:260822USD145000,00
:50K:/984029418294
APEX GLOBAL LOGISTICS LTD
MUMBAI IN
:59:/US44CHAS00019284759382
PACIFIC MARITIME COMPONENTS INC
:70:INV-2026-PAC-9041 FREIGHT ENGINE SPARES
:71A:OUR
-}`,
    gpiTracking: {
      trackingStatus: 'CREDITED_BENEFICIARY',
      totalDeductions: 0.00,
      estimatedSettlementTime: '15 mins (Completed)',
      hops: [
        { stage: 'Payment Initiated & Validated', bankName: 'fincaplen Core Banking', bic: 'SBININBBXXX', location: 'Mumbai, IN', timestamp: '2026-08-22 09:15:02', status: 'COMPLETED' },
        { stage: 'SWIFT Alliance Access Dispatched', bankName: 'SWIFT FIN Gateway', bic: 'SWIFTNETXXX', location: 'La Hulpe, BE', timestamp: '2026-08-22 09:15:10', status: 'COMPLETED' },
        { stage: 'Intermediary Clearing & Sanctions Check', bankName: 'JPMorgan Chase Nostro', bic: 'CHASUS33XXX', location: 'New York, US', timestamp: '2026-08-22 09:22:45', status: 'COMPLETED' },
        { stage: 'Credited to Beneficiary Account', bankName: 'JPMorgan Chase NY', bic: 'CHASUS33XXX', location: 'New York, US', timestamp: '2026-08-22 09:28:10', status: 'COMPLETED' }
      ]
    },
    sanctionsCheck: {
      isPassed: true,
      pepHit: false,
      ofacMatchScore: 0.02,
      screenedAt: '2026-08-22 09:14:40',
      complianceOfficerNotes: 'Automated OFAC/PEP Clear - Score 0.02'
    }
  },
  {
    id: 'msg-sw-002',
    messageType: 'MT700',
    uetr: '8fa19340-9a2c-4ec1-a901-7681c201a03e',
    senderBic: 'DEUTDEDDFXX',
    receiverBic: 'SBININBBXXX',
    senderName: 'Deutsche Bank Frankfurt',
    receiverName: 'fincaplen Core Bank Mumbai',
    amount: 520000.00,
    currency: 'EUR',
    direction: 'INBOUND',
    status: 'INBOUND_RECEIVED',
    valueDate: '2026-08-22',
    referenceNumber: 'LC-DEUT-2026-8812',
    orderingCustomer: {
      name: 'Siemens Energy AG',
      accountOrIban: 'DE89370400440532013000',
      address: 'Werner-von-Siemens-Strasse 1, Munich, DE'
    },
    beneficiaryCustomer: {
      name: 'Bharat Heavy Dynamics Ltd',
      accountOrIban: 'IN09SBIN00004928172901',
      bankName: 'fincaplen Core Bank',
      address: 'Industrial Area Phase 2, Pune, IN'
    },
    chargeDetails: 'SHA',
    remittanceInfo: 'DOCUMENTARY CREDIT FOR TURBINE SPARES CONTRACT BHD-GER-2026',
    rawSwiftBlock: `{1:F01DEUTDEDDFAXXX0000000000}{2:I700SBININBBXXXXN}{3:{121:8fa19340-9a2c-4ec1-a901-7681c201a03e}}{4:
:27:1/1
:40A:IRREVOCABLE
:20:LC-DEUT-2026-8812
:31C:260822
:40E:UCP LATEST VERSION
:31D:261130IN
:50:SIEMENS ENERGY AG MUNICH
:59:BHARAT HEAVY DYNAMICS LTD PUNE
:32B:EUR520000,00
:45A:HIGH PRECISION TURBINE COMPONENTS AS PER PO 89402
:46A:COMMERCIAL INVOICE IN 3 COPIES, FULL SET CLEAN ON BOARD BILL OF LADING
-}`,
    gpiTracking: {
      trackingStatus: 'CREDITED_BENEFICIARY',
      totalDeductions: 120.00,
      estimatedSettlementTime: 'LC Active',
      hops: [
        { stage: 'Documentary Credit Issued', bankName: 'Deutsche Bank Frankfurt', bic: 'DEUTDEDDFXX', location: 'Frankfurt, DE', timestamp: '2026-08-22 07:30:00', status: 'COMPLETED' },
        { stage: 'Advised to fincaplen Branch', bankName: 'fincaplen Core Bank', bic: 'SBININBBXXX', location: 'Mumbai, IN', timestamp: '2026-08-22 08:15:00', status: 'COMPLETED' }
      ]
    },
    sanctionsCheck: {
      isPassed: true,
      pepHit: false,
      ofacMatchScore: 0.01,
      screenedAt: '2026-08-22 08:14:00'
    }
  },
  {
    id: 'msg-sw-003',
    messageType: 'MT202',
    uetr: '4bc78321-1256-42ee-89a1-56128490a012',
    senderBic: 'SBININBBXXX',
    receiverBic: 'BNPAFRPPXXX',
    senderName: 'fincaplen Core Bank Mumbai',
    receiverName: 'BNP Paribas Paris',
    amount: 2500000.00,
    currency: 'EUR',
    direction: 'OUTBOUND',
    status: 'SENT',
    valueDate: '2026-08-22',
    referenceNumber: 'TR26082200114',
    orderingCustomer: {
      name: 'fincaplen Treasury Desk',
      accountOrIban: 'NOSTRO-EUR-BNP',
      address: 'Mumbai Treasury HQ, IN'
    },
    beneficiaryCustomer: {
      name: 'Credit Agricole CIB',
      accountOrIban: 'FR7630006000011234567890189',
      bankName: 'Credit Agricole Paris',
      address: 'Montrouge, Paris, FR'
    },
    chargeDetails: 'OUR',
    remittanceInfo: 'FX INTERBANK SETTLEMENT EUR/INR DEAL #84920',
    rawSwiftBlock: `{1:F01SBININBBAXXX0000000000}{2:I202BNPAFRPPXXXXN}{3:{121:4bc78321-1256-42ee-89a1-56128490a012}}{4:
:20:TR26082200114
:21:DEAL-FX-84920
:32A:260822EUR2500000,00
:53A:BNPAFRPPXXX
:58A:AGRIFRPPXXX
:72:/BNF/INTERBANK FX SWAP SETTLEMENT
-}`,
    gpiTracking: {
      trackingStatus: 'ONGOING',
      totalDeductions: 0.00,
      estimatedSettlementTime: 'Est. 45 mins',
      hops: [
        { stage: 'Initiated in Treasury', bankName: 'fincaplen Treasury', bic: 'SBININBBXXX', location: 'Mumbai, IN', timestamp: '2026-08-22 10:00:00', status: 'COMPLETED' },
        { stage: 'In Transit to BNP Clearing', bankName: 'BNP Paribas', bic: 'BNPAFRPPXXX', location: 'Paris, FR', timestamp: '2026-08-22 10:05:00', status: 'IN_TRANSIT' }
      ]
    },
    sanctionsCheck: {
      isPassed: true,
      pepHit: false,
      ofacMatchScore: 0.0,
      screenedAt: '2026-08-22 09:59:00'
    }
  }
];

export const mockTradeFinanceCredits: TradeFinanceDocCredit[] = [
  {
    id: 'tf-1',
    instrumentType: 'Letter of Credit (LC)',
    lcNumber: 'LC-DEUT-2026-8812',
    applicant: 'Siemens Energy AG, Munich',
    beneficiary: 'Bharat Heavy Dynamics Ltd, Pune',
    issuingBank: 'Deutsche Bank AG Frankfurt',
    advisingBank: 'fincaplen Core Bank Mumbai',
    amount: 520000,
    currency: 'EUR',
    issueDate: '2026-08-22',
    expiryDate: '2026-11-30',
    tenor: '90 Days Sight',
    status: 'ISSUED',
    discrepanciesCount: 0,
    applicableRules: 'UCP 600'
  },
  {
    id: 'tf-2',
    instrumentType: 'Bank Guarantee (BG)',
    lcNumber: 'BG-PERF-2026-00491',
    applicant: 'Apex Global Logistics Ltd',
    beneficiary: 'National Highways Authority of India (NHAI)',
    issuingBank: 'fincaplen Core Bank Mumbai',
    advisingBank: 'State Bank of India Corporate Branch',
    amount: 25000000,
    currency: 'INR',
    issueDate: '2026-06-15',
    expiryDate: '2027-06-14',
    tenor: 'Performance Guarantee (12 Months)',
    status: 'ISSUED',
    discrepanciesCount: 0,
    applicableRules: 'URDG 758'
  },
  {
    id: 'tf-3',
    instrumentType: 'Letter of Credit (LC)',
    lcNumber: 'LC-HSBC-2026-4401',
    applicant: 'Omni Retailers Singapore Pte Ltd',
    beneficiary: 'Vardhman Textiles Ltd, Ludhiana',
    issuingBank: 'HSBC Hong Kong / Singapore',
    advisingBank: 'fincaplen Core Bank Mumbai',
    amount: 380000,
    currency: 'USD',
    issueDate: '2026-07-10',
    expiryDate: '2026-10-15',
    tenor: 'Irrevocable At Sight',
    status: 'DOCS_PRESENTED',
    discrepanciesCount: 1,
    applicableRules: 'UCP 600'
  }
];

export const mockStandingOrders: StandingOrder[] = [
  { id: 'so-1', sourceAccountId: 'ca-1', sourceAccountName: 'Apex Logistics Current A/c', beneficiaryName: 'NHAI Toll Escrow', beneficiaryAccount: '9920194819284', beneficiaryRouting: 'SBIN0001824', amount: 50000, currency: 'INR', frequency: 'Daily', nextRunDate: '2026-08-23', status: 'ACTIVE', ruleType: 'Fixed Amount', executionCount: 142 },
  { id: 'so-2', sourceAccountId: 'ca-2', sourceAccountName: 'Sunil Sharma Savings', beneficiaryName: 'Sunil HDFC Mutual Fund SIP', beneficiaryAccount: '110294829104', beneficiaryRouting: 'HDFC0000128', amount: 25000, currency: 'INR', frequency: 'Monthly', nextRunDate: '2026-09-01', status: 'ACTIVE', ruleType: 'Fixed Amount', executionCount: 11 },
  { id: 'so-3', sourceAccountId: 'ca-3', sourceAccountName: 'TechVision Enterprise Pool', beneficiaryName: 'fincaplen High-Yield Overnight Sweep', beneficiaryAccount: 'POOL-SWEEP-09', beneficiaryRouting: 'INTERNAL', amount: 0, currency: 'INR', frequency: 'Daily', nextRunDate: '2026-08-22', status: 'ACTIVE', ruleType: 'Sweep Excess', thresholdAmount: 500000, executionCount: 220 }
];

export const mockCoreBatchLogs: CoreBatchLog[] = [
  {
    id: 'batch-eod-20260821',
    batchType: 'EOD',
    executedDate: '2026-08-21 23:59:12',
    durationSeconds: 38,
    status: 'SUCCESS',
    interestAccrualsPosted: 1428,
    standingOrdersFired: 46,
    dormancyFlagsApplied: 3,
    ledgerBalanced: true,
    executedBy: 'System Auto-Scheduler',
    details: [
      'Began End-of-Day cutoff at 23:59:00',
      'Locked all teller counter drawers across 12 branches',
      'Calculated daily compound interest on 1,428 active savings & term deposit accounts',
      'Executed 46 standing order sweeps and transfers',
      'Extracted trial balance: Total Debits = ₹4,892,104,200.00, Total Credits = ₹4,892,104,200.00 (Variance ₹0.00)',
      'Generated RBI regulatory liquidity & SMA staging snapshot'
    ]
  },
  {
    id: 'batch-bod-20260822',
    batchType: 'BOD',
    executedDate: '2026-08-22 06:00:05',
    durationSeconds: 19,
    status: 'SUCCESS',
    interestAccrualsPosted: 0,
    standingOrdersFired: 0,
    dormancyFlagsApplied: 0,
    ledgerBalanced: true,
    executedBy: 'System Auto-Scheduler',
    details: [
      'Initialized business date to 2026-08-22',
      'Fetched live interbank FX spot rates for USD, EUR, GBP, AED, JPY, SGD',
      'Unlocked teller operations with opening cash drawer float limits',
      'SWIFT FIN & ISO 20022 communication queues connected successfully'
    ]
  }
];

// --- CONFIBOOKS MOCK DATA ---

export const mockConfiAccounts: ConfiAccount[] = [
  // Assets
  { id: 'cfa-101', code: '1010', name: 'Cash in Hand (Main Vault)', category: 'Asset', subCategory: 'Cash & Cash Equivalents', balance: 2500000, currency: 'INR', description: 'Physical cash at central vault', isSystem: true, isActive: true },
  { id: 'cfa-102', code: '1020', name: 'HDFC Operating Bank Account', category: 'Asset', subCategory: 'Bank Accounts', balance: 14520000, currency: 'INR', description: 'Primary working capital account', isSystem: true, isActive: true },
  { id: 'cfa-103', code: '1030', name: 'SBI Settlement Account', category: 'Asset', subCategory: 'Bank Accounts', balance: 8940000, currency: 'INR', description: 'RTGS & NEFT clearing account', isSystem: true, isActive: true },
  { id: 'cfa-104', code: '1200', name: 'Accounts Receivable (Trade Debtors)', category: 'Asset', subCategory: 'Current Assets', balance: 6450000, currency: 'INR', description: 'Uncollected customer invoices', isSystem: true, isActive: true },
  { id: 'cfa-105', code: '1300', name: 'Finished Goods Inventory', category: 'Asset', subCategory: 'Inventory', balance: 4120000, currency: 'INR', description: 'Stock in warehouse', isSystem: false, isActive: true },
  { id: 'cfa-106', code: '1500', name: 'Office Equipment & IT Assets', category: 'Asset', subCategory: 'Fixed Assets', balance: 3500000, currency: 'INR', description: 'Laptops, servers, workstations', isSystem: false, isActive: true },
  { id: 'cfa-107', code: '1590', name: 'Accumulated Depreciation - IT Assets', category: 'Asset', subCategory: 'Fixed Assets', balance: -850000, currency: 'INR', description: 'Contra-asset account', isSystem: false, isActive: true },
  // Liabilities
  { id: 'cfa-201', code: '2010', name: 'Accounts Payable (Trade Creditors)', category: 'Liability', subCategory: 'Current Liabilities', balance: 3890000, currency: 'INR', description: 'Outstanding vendor bills', isSystem: true, isActive: true },
  { id: 'cfa-202', code: '2020', name: 'GST Output Liability (IGST/CGST/SGST)', category: 'Liability', subCategory: 'Duties & Taxes', balance: 540000, currency: 'INR', description: 'Tax collected on sales', isSystem: true, isActive: true },
  { id: 'cfa-203', code: '2030', name: 'TDS Payable (Sec 194C/J/I)', category: 'Liability', subCategory: 'Duties & Taxes', balance: 125000, currency: 'INR', description: 'Tax deducted at source on payments', isSystem: true, isActive: true },
  { id: 'cfa-204', code: '2500', name: 'Term Loan Facility - SBI', category: 'Liability', subCategory: 'Non-Current Liabilities', balance: 25000000, currency: 'INR', description: 'Long term secured bank borrowing', isSystem: false, isActive: true },
  // Equity
  { id: 'cfa-301', code: '3010', name: 'Owner / Share Capital', category: 'Equity', subCategory: 'Share Capital', balance: 20000000, currency: 'INR', description: 'Issued & paid up equity capital', isSystem: true, isActive: true },
  { id: 'cfa-302', code: '3020', name: 'Retained Earnings', category: 'Equity', subCategory: 'Reserves & Surplus', balance: 18455000, currency: 'INR', description: 'Cumulative profits brought forward', isSystem: true, isActive: true },
  // Income
  { id: 'cfa-401', code: '4010', name: 'Loan Interest Income', category: 'Income', subCategory: 'Operating Revenue', balance: 14200000, currency: 'INR', description: 'Interest from lending portfolio', isSystem: false, isActive: true },
  { id: 'cfa-402', code: '4020', name: 'Processing & Advisory Fee Income', category: 'Income', subCategory: 'Operating Revenue', balance: 1850000, currency: 'INR', description: 'Upfront origination fees', isSystem: false, isActive: true },
  { id: 'cfa-403', code: '4030', name: 'Software SaaS Subscription Sales', category: 'Income', subCategory: 'Operating Revenue', balance: 6400000, currency: 'INR', description: 'ConfiBooks license & cloud subscriptions', isSystem: false, isActive: true },
  // Expenses & COGS
  { id: 'cfa-501', code: '5010', name: 'Cost of Lending (Interest Expense)', category: 'Cost of Goods Sold', subCategory: 'Direct Expenses', balance: 5200000, currency: 'INR', description: 'Interest paid on borrowings', isSystem: false, isActive: true },
  { id: 'cfa-502', code: '6010', name: 'Employee Salaries & Benefits', category: 'Expense', subCategory: 'Payroll Expenses', balance: 4800000, currency: 'INR', description: 'Staff payroll & statutory benefits', isSystem: false, isActive: true },
  { id: 'cfa-503', code: '6020', name: 'Office Rent & Utilities', category: 'Expense', subCategory: 'Administrative Expenses', balance: 960000, currency: 'INR', description: 'Premises lease and power bills', isSystem: false, isActive: true },
  { id: 'cfa-504', code: '6030', name: 'Cloud Infrastructure & AWS Servers', category: 'Expense', subCategory: 'Technology Expenses', balance: 420000, currency: 'INR', description: 'Hosting and database servers', isSystem: false, isActive: true },
  { id: 'cfa-505', code: '6040', name: 'Depreciation Expense', category: 'Expense', subCategory: 'Depreciation & Amortization', balance: 280000, currency: 'INR', description: 'Asset amortization', isSystem: true, isActive: true }
];

export const mockConfiJournalEntries: ConfiJournalEntry[] = [
  {
    id: 'cje-001',
    entryNumber: 'JV-2026-0089',
    date: '2026-08-20',
    reference: 'SAL-AUG-2026',
    narration: 'Monthly staff salary provision and TDS deduction for August 2026',
    totalDebit: 480000,
    totalCredit: 480000,
    status: 'Posted',
    createdBy: 'Accounting Manager',
    isRecurring: true,
    recurringFrequency: 'Monthly',
    lines: [
      { id: 'cjl-1', accountId: 'cfa-502', accountCode: '6010', accountName: 'Employee Salaries & Benefits', description: 'August Gross Payroll', debit: 480000, credit: 0 },
      { id: 'cjl-2', accountId: 'cfa-203', accountCode: '2030', accountName: 'TDS Payable (Sec 194C/J/I)', description: 'TDS under Sec 192', debit: 0, credit: 48000 },
      { id: 'cjl-3', accountId: 'cfa-102', accountCode: '1020', accountName: 'HDFC Operating Bank Account', description: 'Net Salaries Disbursed', debit: 0, credit: 432000 }
    ]
  },
  {
    id: 'cje-002',
    entryNumber: 'JV-2026-0090',
    date: '2026-08-21',
    reference: 'DEP-AUG-2026',
    narration: 'Monthly depreciation for IT Hardware and Servers (Straight Line Method)',
    totalDebit: 28000,
    totalCredit: 28000,
    status: 'Posted',
    createdBy: 'Senior Auditor',
    isRecurring: true,
    recurringFrequency: 'Monthly',
    lines: [
      { id: 'cjl-4', accountId: 'cfa-505', accountCode: '6040', accountName: 'Depreciation Expense', description: 'August IT Assets Dep.', debit: 28000, credit: 0 },
      { id: 'cjl-5', accountId: 'cfa-107', accountCode: '1590', accountName: 'Accumulated Depreciation - IT Assets', description: 'Monthly credit to Accum Dep', debit: 0, credit: 28000 }
    ]
  },
  {
    id: 'cje-003',
    entryNumber: 'JV-2026-0091',
    date: '2026-08-22',
    reference: 'INT-ACCRUAL-08',
    narration: 'Daily loan portfolio interest accrual posting to general ledger',
    totalDebit: 145000,
    totalCredit: 145000,
    status: 'Posted',
    createdBy: 'Core Banking EOD Batch',
    isRecurring: false,
    lines: [
      { id: 'cjl-6', accountId: 'cfa-104', accountCode: '1200', accountName: 'Accounts Receivable (Trade Debtors)', description: 'Accrued Interest Receivable', debit: 145000, credit: 0 },
      { id: 'cjl-7', accountId: 'cfa-401', accountCode: '4010', accountName: 'Loan Interest Income', description: 'Daily Portfolio Yield Earned', debit: 0, credit: 145000 }
    ]
  }
];

export const mockConfiInvoices: ConfiInvoice[] = [
  {
    id: 'cinv-1',
    invoiceNumber: 'INV-CB-2026-0042',
    customerId: 'cust-101',
    customerName: 'Tata Telematics India Ltd',
    customerGstPan: '27AABCT1234F1Z8',
    invoiceDate: '2026-08-15',
    dueDate: '2026-09-15',
    items: [
      { id: 'ii-1', name: 'ConfiBooks Enterprise Core License', hsnSac: '998313', quantity: 1, unitPrice: 250000, discountPercent: 10, taxPercent: 18, taxAmount: 40500, lineTotal: 265500 },
      { id: 'ii-2', name: 'SWIFT Integration & ISO 20022 Connector', hsnSac: '998314', quantity: 1, unitPrice: 150000, discountPercent: 0, taxPercent: 18, taxAmount: 27000, lineTotal: 177000 }
    ],
    subTotal: 400000,
    discountTotal: 25000,
    taxTotal: 67500,
    grandTotal: 442500,
    amountPaid: 442500,
    balanceDue: 0,
    status: 'Paid',
    termsAndConditions: 'Payment due within 30 days. Subject to Mumbai Jurisdiction.',
    notes: 'Thank you for choosing ConfiBooks by fincaplen.'
  },
  {
    id: 'cinv-2',
    invoiceNumber: 'INV-CB-2026-0043',
    customerId: 'cust-102',
    customerName: 'Reliance AgriLogistics Corp',
    customerGstPan: '24AABCR5678G1Z2',
    invoiceDate: '2026-08-18',
    dueDate: '2026-09-18',
    items: [
      { id: 'ii-3', name: 'Loan Portfolio Management SaaS Subscription (Q3)', hsnSac: '998313', quantity: 1, unitPrice: 380000, discountPercent: 5, taxPercent: 18, taxAmount: 65070, lineTotal: 426070 }
    ],
    subTotal: 380000,
    discountTotal: 19000,
    taxTotal: 65070,
    grandTotal: 426070,
    amountPaid: 200000,
    balanceDue: 226070,
    status: 'Partially Paid',
    termsAndConditions: 'Standard Net 30 days payment terms.'
  },
  {
    id: 'cinv-3',
    invoiceNumber: 'INV-CB-2026-0044',
    customerId: 'cust-103',
    customerName: 'Zenith Logistics Hub',
    customerGstPan: '29AABCZ9012H1Z5',
    invoiceDate: '2026-08-01',
    dueDate: '2026-08-15',
    items: [
      { id: 'ii-4', name: 'Financial Accounting Audit & Advisory Module', hsnSac: '998222', quantity: 1, unitPrice: 180000, discountPercent: 0, taxPercent: 18, taxAmount: 32400, lineTotal: 212400 }
    ],
    subTotal: 180000,
    discountTotal: 0,
    taxTotal: 32400,
    grandTotal: 212400,
    amountPaid: 0,
    balanceDue: 212400,
    status: 'Overdue',
    termsAndConditions: 'Late payment interest @ 18% p.a. applicable after due date.'
  }
];

export const mockConfiBills: ConfiBill[] = [
  {
    id: 'cbill-1',
    billNumber: 'BILL-AWS-2026-08',
    vendorId: 'vend-101',
    vendorName: 'Amazon Web Services India Pvt Ltd',
    vendorGst: '27AABCA1234D1ZX',
    billDate: '2026-08-10',
    dueDate: '2026-08-31',
    poReference: 'PO-2026-042',
    grnReference: 'GRN-2026-042',
    items: [
      { description: 'EC2 Cloud Compute & RDS Multi-AZ Database Hosting', quantity: 1, unitPrice: 185000, taxPercent: 18, lineTotal: 218300 },
      { description: 'CloudFront CDN & S3 Backup Storage', quantity: 1, unitPrice: 45000, taxPercent: 18, lineTotal: 53100 }
    ],
    subTotal: 230000,
    taxTotal: 41400,
    grandTotal: 271400,
    amountPaid: 271400,
    balanceDue: 0,
    matchStatus: '3-Way Matched',
    status: 'Paid'
  },
  {
    id: 'cbill-2',
    billNumber: 'BILL-SWIFT-2026-Q3',
    vendorId: 'vend-102',
    vendorName: 'S.W.I.F.T. SCRL India Branch',
    vendorGst: '27AABCS9988K1Z9',
    billDate: '2026-08-16',
    dueDate: '2026-09-15',
    poReference: 'PO-2026-089',
    items: [
      { description: 'SWIFT Alliance Gateway Annual Terminal Maintenance', quantity: 1, unitPrice: 320000, taxPercent: 18, lineTotal: 377600 },
      { description: 'FIN Messaging Volume Pack (10,000 MT Messages)', quantity: 1, unitPrice: 95000, taxPercent: 18, lineTotal: 112100 }
    ],
    subTotal: 415000,
    taxTotal: 74700,
    grandTotal: 489700,
    amountPaid: 0,
    balanceDue: 489700,
    matchStatus: '3-Way Matched',
    status: 'Approved'
  }
];

export const mockFixedAssets: FixedAssetItem[] = [
  {
    id: 'fa-1',
    assetCode: 'FA-IT-001',
    assetName: 'Dell PowerEdge R750 Core Banking Rack Server',
    category: 'IT & Office Hardware',
    purchaseDate: '2025-04-10',
    purchaseCost: 850000,
    salvageValue: 50000,
    usefulLifeYears: 5,
    depreciationMethod: 'Straight Line (SLM)',
    annualDepreciationRate: 20,
    accumulatedDepreciation: 213333,
    currentNetBookValue: 636667,
    status: 'Active In-Service',
    custodianEmployee: 'Chief Technology Officer',
    location: 'Central Data Center (Rack A4), Mumbai'
  },
  {
    id: 'fa-2',
    assetCode: 'FA-VH-001',
    assetName: 'Mahindra Bolero Armoured Cash Transportation Van',
    category: 'Vehicles',
    purchaseDate: '2024-06-15',
    purchaseCost: 1650000,
    salvageValue: 150000,
    usefulLifeYears: 8,
    depreciationMethod: 'Written Down Value (WDV)',
    annualDepreciationRate: 25,
    accumulatedDepreciation: 642500,
    currentNetBookValue: 1007500,
    status: 'Active In-Service',
    custodianEmployee: 'Head of Cash Logistics',
    location: 'Headquarters Garage, Mumbai'
  },
  {
    id: 'fa-3',
    assetCode: 'FA-BL-001',
    assetName: 'Corporate Headquarters Office Floor (5,000 sq ft)',
    category: 'Land & Buildings',
    purchaseDate: '2023-01-10',
    purchaseCost: 45000000,
    salvageValue: 10000000,
    usefulLifeYears: 30,
    depreciationMethod: 'Straight Line (SLM)',
    annualDepreciationRate: 3.33,
    accumulatedDepreciation: 3885000,
    currentNetBookValue: 41115000,
    status: 'Active In-Service',
    custodianEmployee: 'Head of Facilities',
    location: 'BKC Financial Center, Mumbai'
  }
];

// --- RILLET AI REVENUE RECOGNITION & MODERN ACCOUNTING ENGINE MOCKS ---

export const mockRilletSaaSMetrics: RilletSaaSMetrics = {
  arrCurrent: 14850000, // $14.85M ARR
  mrrCurrent: 1237500,  // $1.2375M MRR
  startingArr: 11200000,
  newBookingsArr: 2850000,
  expansionArr: 1420000,
  contractionArr: -240000,
  churnedArr: -380000,
  netNewArr: 3650000,
  endingArr: 14850000,
  netRevenueRetentionPct: 128.4, // 128.4% NRR
  grossRevenueRetentionPct: 96.2, // 96.2% GRR
  cacPaybackMonths: 11.2,
  ltvToCacRatio: 5.4,
  magicNumber: 1.38,
  ruleOf40Pct: 58.6, // 32.6% growth + 26.0% FCF margin
  grossMarginPct: 82.5,
  burnMultiple: 0.72,
  liveCashRunwayMonths: 28.5,
};

export const mockRilletContracts: RilletContract[] = [
  {
    id: 'cnt-001',
    contractNumber: 'CTR-2026-NVIDIA',
    customerName: 'NVIDIA Enterprise AI Corp',
    customerTier: 'Enterprise',
    annualContractValue: 2400000, // $2.4M ARR
    totalContractValue: 7200000,  // 3-Year $7.2M TCV
    currency: 'USD',
    billingFrequency: 'Annual Upfront',
    contractStartDate: '2026-01-01',
    contractEndDate: '2028-12-31',
    status: 'Active',
    autoRenew: true,
    paymentTerms: 'Net 30',
    contractPdfName: 'Nvidia_Master_SaaS_Agreement_2026.pdf',
    extractedWithAi: true,
    elements: [
      {
        id: 'elm-001-1',
        elementName: 'Enterprise SaaS Core License (Unlimited Seats)',
        performanceObligation: 'Software Subscription',
        contractValue: 1800000,
        standaloneSellingPrice: 1800000,
        allocatedRevenue: 1800000,
        revRecMethod: 'Daily Ratable (Over Time)',
        startDate: '2026-01-01',
        endDate: '2026-12-31',
        billedSoFar: 1800000,
        recognizedSoFar: 1200000, // 8 months
        deferredBalance: 600000,
      },
      {
        id: 'elm-001-2',
        elementName: 'Dedicated Custom Fine-Tuning & Model Architecture Setup',
        performanceObligation: 'Professional Services',
        contractValue: 350000,
        standaloneSellingPrice: 380000,
        allocatedRevenue: 350000,
        revRecMethod: 'Point-in-Time (Milestone Delivery)',
        startDate: '2026-01-01',
        endDate: '2026-03-31',
        billedSoFar: 350000,
        recognizedSoFar: 350000,
        deferredBalance: 0,
      },
      {
        id: 'elm-001-3',
        elementName: '24/7 Dedicated Technical Account Manager & SLA Support',
        performanceObligation: 'Software Subscription',
        contractValue: 250000,
        standaloneSellingPrice: 250000,
        allocatedRevenue: 250000,
        revRecMethod: 'Daily Ratable (Over Time)',
        startDate: '2026-01-01',
        endDate: '2026-12-31',
        billedSoFar: 250000,
        recognizedSoFar: 166667,
        deferredBalance: 83333,
      }
    ]
  },
  {
    id: 'cnt-002',
    contractNumber: 'CTR-2026-STRIPE',
    customerName: 'Stripe Global Financial Services',
    customerTier: 'Strategic Scale',
    annualContractValue: 1850000,
    totalContractValue: 3700000,
    currency: 'USD',
    billingFrequency: 'Quarterly',
    contractStartDate: '2026-02-01',
    contractEndDate: '2028-01-31',
    status: 'Active',
    autoRenew: true,
    paymentTerms: 'Net 15',
    contractPdfName: 'Stripe_SaaS_Order_Form_Q1.pdf',
    extractedWithAi: true,
    elements: [
      {
        id: 'elm-002-1',
        elementName: 'SaaS Platform License (High Volume Tier)',
        performanceObligation: 'Software Subscription',
        contractValue: 1450000,
        standaloneSellingPrice: 1450000,
        allocatedRevenue: 1450000,
        revRecMethod: 'Daily Ratable (Over Time)',
        startDate: '2026-02-01',
        endDate: '2027-01-31',
        billedSoFar: 725000,
        recognizedSoFar: 845833,
        deferredBalance: 239167,
      },
      {
        id: 'elm-002-2',
        elementName: 'High-Throughput Webhook & Event Streaming Ingestion',
        performanceObligation: 'Usage-Based Consumption',
        contractValue: 400000,
        standaloneSellingPrice: 420000,
        allocatedRevenue: 400000,
        revRecMethod: 'Usage/Consumption Incurred',
        startDate: '2026-02-01',
        endDate: '2027-01-31',
        billedSoFar: 260000,
        recognizedSoFar: 260000,
        deferredBalance: 0,
      }
    ]
  },
  {
    id: 'cnt-003',
    contractNumber: 'CTR-2026-DATABRICKS',
    customerName: 'Databricks Cloud Systems Inc.',
    customerTier: 'Enterprise',
    annualContractValue: 1200000,
    totalContractValue: 1200000,
    currency: 'USD',
    billingFrequency: 'Annual Upfront',
    contractStartDate: '2026-04-01',
    contractEndDate: '2027-03-31',
    status: 'Active',
    autoRenew: true,
    paymentTerms: 'Net 30',
    contractPdfName: 'Databricks_Order_2026.pdf',
    extractedWithAi: true,
    elements: [
      {
        id: 'elm-003-1',
        elementName: 'Enterprise Data Lake Connector & Compute Bridge',
        performanceObligation: 'Software Subscription',
        contractValue: 1050000,
        standaloneSellingPrice: 1050000,
        allocatedRevenue: 1050000,
        revRecMethod: 'Daily Ratable (Over Time)',
        startDate: '2026-04-01',
        endDate: '2027-03-31',
        billedSoFar: 1050000,
        recognizedSoFar: 437500, // 5 months
        deferredBalance: 612500,
      },
      {
        id: 'elm-003-2',
        elementName: 'Initial Schema Migration & Data Pipeline Engineering',
        performanceObligation: 'Professional Services',
        contractValue: 150000,
        standaloneSellingPrice: 175000,
        allocatedRevenue: 150000,
        revRecMethod: 'Point-in-Time (Milestone Delivery)',
        startDate: '2026-04-01',
        endDate: '2026-05-15',
        billedSoFar: 150000,
        recognizedSoFar: 150000,
        deferredBalance: 0,
      }
    ]
  },
  {
    id: 'cnt-004',
    contractNumber: 'CTR-2026-AIRBNB',
    customerName: 'Airbnb Hospitality Tech UK',
    customerTier: 'Growth',
    annualContractValue: 680000,
    totalContractValue: 1360000,
    currency: 'USD',
    billingFrequency: 'Quarterly',
    contractStartDate: '2026-05-01',
    contractEndDate: '2028-04-30',
    status: 'Active',
    autoRenew: true,
    paymentTerms: 'Net 30',
    contractPdfName: 'Airbnb_EMEA_Contract.pdf',
    extractedWithAi: true,
    elements: [
      {
        id: 'elm-004-1',
        elementName: 'Global Multi-Currency FX Settlement Engine',
        performanceObligation: 'Software Subscription',
        contractValue: 680000,
        standaloneSellingPrice: 680000,
        allocatedRevenue: 680000,
        revRecMethod: 'Daily Ratable (Over Time)',
        startDate: '2026-05-01',
        endDate: '2027-04-30',
        billedSoFar: 340000,
        recognizedSoFar: 226667,
        deferredBalance: 113333,
      }
    ]
  },
  {
    id: 'cnt-005',
    contractNumber: 'CTR-2026-OPENAI',
    customerName: 'OpenAI Labs Research LLC',
    customerTier: 'Strategic Scale',
    annualContractValue: 3100000,
    totalContractValue: 9300000,
    currency: 'USD',
    billingFrequency: 'Annual Upfront',
    contractStartDate: '2026-06-01',
    contractEndDate: '2029-05-31',
    status: 'Active',
    autoRenew: true,
    paymentTerms: 'Net 30',
    contractPdfName: 'OpenAI_Strategic_Enterprise_Contract.pdf',
    extractedWithAi: true,
    elements: [
      {
        id: 'elm-005-1',
        elementName: 'Enterprise AI Governance & Audit Platform',
        performanceObligation: 'Software Subscription',
        contractValue: 2600000,
        standaloneSellingPrice: 2600000,
        allocatedRevenue: 2600000,
        revRecMethod: 'Daily Ratable (Over Time)',
        startDate: '2026-06-01',
        endDate: '2027-05-31',
        billedSoFar: 2600000,
        recognizedSoFar: 650000, // 3 months
        deferredBalance: 1950000,
      },
      {
        id: 'elm-005-2',
        elementName: 'Real-time Vector Search Cluster Scaling Engine',
        performanceObligation: 'Usage-Based Consumption',
        contractValue: 500000,
        standaloneSellingPrice: 500000,
        allocatedRevenue: 500000,
        revRecMethod: 'Usage/Consumption Incurred',
        startDate: '2026-06-01',
        endDate: '2027-05-31',
        billedSoFar: 145000,
        recognizedSoFar: 145000,
        deferredBalance: 0,
      }
    ]
  }
];

export const mockRilletBankTransactions: RilletBankFeedTransaction[] = [
  {
    id: 'tx-bnk-001',
    bankAccount: 'Silicon Valley Bank (USD)',
    date: '2026-08-22',
    amount: 2400000,
    direction: 'INFLOW',
    rawDescription: 'WIRE IN - NVIDIA CORP / REF: CTR-2026-NVIDIA / INVOICE INV-88910',
    counterparty: 'NVIDIA Enterprise AI Corp',
    aiMatchStatus: 'AUTO_MATCHED',
    aiConfidencePct: 99.9,
    aiMatchingRule: 'Exact Amount & Debtor Name Match against ASC 606 Contract Schedule #CTR-2026-NVIDIA',
    suggestedAccountCode: '2100',
    suggestedAccountName: 'Deferred Revenue (ASC 606 Unearned)',
    matchedDocumentRef: 'INV-88910',
    reconciledBy: 'Rillet AI Auto-Reconciler'
  },
  {
    id: 'tx-bnk-002',
    bankAccount: 'Stripe USD Payouts',
    date: '2026-08-21',
    amount: 462500,
    direction: 'INFLOW',
    rawDescription: 'STRIPE PAYOUT STR-PO-991823 / GROSS: $475,000 / FEES: $12,500',
    counterparty: 'Stripe Settlement Account',
    aiMatchStatus: 'SPLIT_PROPOSED',
    aiConfidencePct: 99.4,
    aiMatchingRule: 'Auto-Split Rule: Credit AR $475,000, Debit Merchant Processing Fee (GL 6200) $12,500',
    suggestedAccountCode: '1100',
    suggestedAccountName: 'Accounts Receivable (Trade)',
    matchedDocumentRef: 'STR-PO-991823',
    reconciledBy: 'Rillet AI Auto-Reconciler'
  },
  {
    id: 'tx-bnk-003',
    bankAccount: 'Mercury Operating (USD)',
    date: '2026-08-20',
    amount: 142500,
    direction: 'OUTFLOW',
    rawDescription: 'ACH DEBIT - AMAZON WEB SERVICES AWS*PAYMENT / ACC-8891230-US-EAST',
    counterparty: 'Amazon Web Services (AWS)',
    aiMatchStatus: 'AUTO_MATCHED',
    aiConfidencePct: 98.9,
    aiMatchingRule: 'Monthly Cloud Infrastructure Vendor Schedule matching Vendor Bill AWS-2026-08',
    suggestedAccountCode: '5100',
    suggestedAccountName: 'Hosting & Cloud Infrastructure (COGS)',
    matchedDocumentRef: 'AWS-2026-08',
    reconciledBy: 'Rillet AI Auto-Reconciler'
  },
  {
    id: 'tx-bnk-004',
    bankAccount: 'Brex Treasury (USD)',
    date: '2026-08-19',
    amount: 38400,
    direction: 'OUTFLOW',
    rawDescription: 'BREX AUTO-PAYMENT - MONTHLY CORPORATE CARD STATEMENT 08-2026',
    counterparty: 'Brex Corporate Card Statement',
    aiMatchStatus: 'CONFIRMED',
    aiConfidencePct: 99.2,
    aiMatchingRule: 'Itemized Receipt Ingestion matches 42 individual employee SaaS & travel receipts',
    suggestedAccountCode: '2050',
    suggestedAccountName: 'Credit Card Clearing Liability',
    matchedDocumentRef: 'BREX-STMT-AUG-2026',
    reconciledBy: 'Anil Kumar (Admin)'
  },
  {
    id: 'tx-bnk-005',
    bankAccount: 'Silicon Valley Bank (USD)',
    date: '2026-08-18',
    amount: 512000,
    direction: 'OUTFLOW',
    rawDescription: 'GUSTO PAYROLL DIRECT DEPOSIT BATCH ID #GST-88129-ENGINEERING & SALES',
    counterparty: 'Gusto Payroll Processing',
    aiMatchStatus: 'AUTO_MATCHED',
    aiConfidencePct: 99.8,
    aiMatchingRule: 'Payroll Journal Integration: Splits Salary Expense, Employer Tax & 401(k) Accruals',
    suggestedAccountCode: '2200',
    suggestedAccountName: 'Accrued Payroll & Benefits',
    matchedDocumentRef: 'GUSTO-PAYROLL-2026-08-15',
    reconciledBy: 'Rillet AI Auto-Reconciler'
  },
  {
    id: 'tx-bnk-006',
    bankAccount: 'Mercury Operating (USD)',
    date: '2026-08-17',
    amount: 85000,
    direction: 'INFLOW',
    rawDescription: 'WIRE IN - DATABRICKS INC / MIGRATION MILESTONE #2 SIGN-OFF',
    counterparty: 'Databricks Cloud Systems Inc.',
    aiMatchStatus: 'AUTO_MATCHED',
    aiConfidencePct: 99.5,
    aiMatchingRule: 'Milestone Delivery match on Contract #CTR-2026-DATABRICKS Element #2',
    suggestedAccountCode: '4020',
    suggestedAccountName: 'Professional Services Revenue',
    matchedDocumentRef: 'INV-DB-MS2',
    reconciledBy: 'Rillet AI Auto-Reconciler'
  },
  {
    id: 'tx-bnk-007',
    bankAccount: 'Silicon Valley Bank (USD)',
    date: '2026-08-16',
    amount: 68000,
    direction: 'OUTFLOW',
    rawDescription: 'WIRE OUT - LATHAM & WATKINS LLP / LEGAL RETAINER & IP DILIGENCE',
    counterparty: 'Latham & Watkins LLP',
    aiMatchStatus: 'NEEDS_REVIEW',
    aiConfidencePct: 88.5,
    aiMatchingRule: 'No active PO detected. Suggested classification based on historical vendor profile: Legal & Professional Fees.',
    suggestedAccountCode: '6300',
    suggestedAccountName: 'Legal & Professional Retainer Fees',
    matchedDocumentRef: 'LW-INV-9921',
    reconciledBy: 'Pending Auditor Review'
  }
];

export const mockRilletPrepaids: RilletPrepaidItem[] = [
  {
    id: 'prep-001',
    vendorName: 'Amazon Web Services (AWS)',
    description: '3-Year Enterprise Compute Savings Plan (Committed Usage)',
    totalPrepaidCost: 360000,
    startDate: '2025-01-01',
    endDate: '2027-12-31',
    totalMonths: 36,
    monthlyAmortization: 10000,
    accumulatedAmortization: 200000,
    remainingAssetBalance: 160000,
    expenseGlAccount: '5100 - Hosting & Cloud Infrastructure',
    status: 'Active Amortizing'
  },
  {
    id: 'prep-002',
    vendorName: 'Salesforce & Slack Enterprise Grid',
    description: 'Annual Enterprise CRM & Sales Engagement Multi-Seat License',
    totalPrepaidCost: 180000,
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    totalMonths: 12,
    monthlyAmortization: 15000,
    accumulatedAmortization: 120000,
    remainingAssetBalance: 60000,
    expenseGlAccount: '6100 - Sales & Marketing Software Tools',
    status: 'Active Amortizing'
  },
  {
    id: 'prep-003',
    vendorName: 'Datadog & Sentry Enterprise',
    description: 'Annual APM Monitoring, Distributed Tracing & Error Diagnostics',
    totalPrepaidCost: 96000,
    startDate: '2026-03-01',
    endDate: '2027-02-28',
    totalMonths: 12,
    monthlyAmortization: 8000,
    accumulatedAmortization: 48000,
    remainingAssetBalance: 48000,
    expenseGlAccount: '5120 - Engineering Tooling & APM',
    status: 'Active Amortizing'
  },
  {
    id: 'prep-004',
    vendorName: 'Chubb & Coalition Cyber Insurance',
    description: 'Corporate Directors & Officers (D&O) + Cyber Security Policy 2026',
    totalPrepaidCost: 84000,
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    totalMonths: 12,
    monthlyAmortization: 7000,
    accumulatedAmortization: 56000,
    remainingAssetBalance: 28000,
    expenseGlAccount: '6400 - Corporate Insurance & Risk',
    status: 'Active Amortizing'
  }
];

export const mockRilletFluxAnalysis: RilletFluxAnalysisItem[] = [
  {
    id: 'flux-001',
    accountCode: '4000',
    accountName: 'SaaS Subscription Revenue (ASC 606)',
    category: 'Revenue',
    currentMonthBalance: 1237500,
    priorMonthBalance: 1145000,
    varianceAmount: 92500,
    variancePercentage: 8.08,
    isMaterialVariance: true,
    anomalyScore: 'Normal',
    aiGeneratedExplanation: 'Increase of +$92.5k (+8.1% MoM) driven by full-month revenue recognition from OpenAI Enterprise expansion ($+54.2k) and Databricks mid-month go-live ($+38.3k).',
    auditorSignoff: true
  },
  {
    id: 'flux-002',
    accountCode: '5100',
    accountName: 'Cloud Infrastructure & GPU Compute (COGS)',
    category: 'Cost of Goods Sold',
    currentMonthBalance: 198400,
    priorMonthBalance: 146200,
    varianceAmount: 52200,
    variancePercentage: 35.70,
    isMaterialVariance: true,
    anomalyScore: 'Medium Alert',
    aiGeneratedExplanation: 'Material spike of +$52.2k (+35.7% MoM) due to on-demand H100 GPU cluster reservations on AWS for high-throughput model fine-tuning milestone deliveries.',
    auditorSignoff: true
  },
  {
    id: 'flux-003',
    accountCode: '6000',
    accountName: 'Engineering & R&D Payroll',
    category: 'R&D Engineering',
    currentMonthBalance: 345000,
    priorMonthBalance: 338000,
    varianceAmount: 7000,
    variancePercentage: 2.07,
    isMaterialVariance: false,
    anomalyScore: 'Normal',
    aiGeneratedExplanation: 'Nominal variance of +$7.0k (+2.1%) aligned with standard headcount cost and mid-year merit adjustments for 2 Staff ML engineers.',
    auditorSignoff: true
  },
  {
    id: 'flux-004',
    accountCode: '6200',
    accountName: 'Paid Acquisition & Growth Marketing',
    category: 'Sales & Marketing',
    currentMonthBalance: 124000,
    priorMonthBalance: 78000,
    varianceAmount: 46000,
    variancePercentage: 58.97,
    isMaterialVariance: true,
    anomalyScore: 'Significant Flux',
    aiGeneratedExplanation: 'Substantial surge of +$46.0k (+59.0% MoM) resulting from Q3 Annual FinTech Summit headline sponsorship and expanded LinkedIn account-based marketing campaign for enterprise banking leads.',
    auditorSignoff: false
  },
  {
    id: 'flux-005',
    accountCode: '2100',
    accountName: 'Deferred Revenue (ASC 606 Contract Liabilities)',
    category: 'Liabilities',
    currentMonthBalance: 3604167,
    priorMonthBalance: 2441667,
    varianceAmount: 1162500,
    variancePercentage: 47.61,
    isMaterialVariance: true,
    anomalyScore: 'Significant Flux',
    aiGeneratedExplanation: 'Increase of +$1.16M (+47.6%) following collection of NVIDIA upfront annual license billing ($1.8M billed) minus ratable monthly amortization across the portfolio.',
    auditorSignoff: true
  }
];

export const mockRilletCloseChecklist: RilletCloseChecklistTask[] = [
  {
    id: 'chk-001',
    order: 1,
    category: 'Cash & Banking',
    taskName: 'Zero-Touch Bank & Payment Gateway Feeds Auto-Reconciliation',
    description: 'Auto-match bank feeds (SVB, Mercury, Brex, Stripe) to GL cash clearing accounts with $0.00 discrepancy',
    owner: 'Rillet AI Copilot',
    status: 'COMPLETED',
    aiAutomatedCheck: true,
    aiValidationMessage: 'Verified: 100% of 427 transactions reconciled. Zero unallocated bank variances across all currency accounts.',
    completedAt: '2026-08-23 18:30:12',
    signedOffBy: 'Rekha Gupta (Accounting)'
  },
  {
    id: 'chk-002',
    order: 2,
    category: 'Revenue (ASC 606)',
    taskName: 'ASC 606 / IFRS 15 Revenue Recognition & Deferred Waterfall Posting',
    description: 'Recalculate ratable daily schedules, milestone deliveries, and post monthly amortization journal entries to GL 4000 and GL 2100',
    owner: 'Rillet Revenue Engine',
    status: 'COMPLETED',
    aiAutomatedCheck: true,
    aiValidationMessage: 'Verified: $1,237,500 ratable revenue recognized. Ending deferred liability rebalanced to $3,604,167 across 18 contracts.',
    completedAt: '2026-08-23 19:15:44',
    signedOffBy: 'Rekha Gupta (Accounting)'
  },
  {
    id: 'chk-003',
    order: 3,
    category: 'Prepaids & Fixed Assets',
    taskName: 'Amortize Prepaid Expenses & Fixed Asset Depreciation Run',
    description: 'Post automated monthly amortization vouchers for cloud commitments, annual software, and D&O insurance schedules',
    owner: 'Rillet Accruals Engine',
    status: 'COMPLETED',
    aiAutomatedCheck: true,
    aiValidationMessage: 'Verified: 4 prepaid schedules amortized ($40,000 total expense posted). Fixed asset depreciation verified.',
    completedAt: '2026-08-23 20:00:00',
    signedOffBy: 'Rekha Gupta (Accounting)'
  },
  {
    id: 'chk-004',
    order: 4,
    category: 'AP & Accruals',
    taskName: 'Unbilled Contractor Accruals & 3-Way Match Bill Verification',
    description: 'Scan unbilled POs and vendor timesheets to create automated accrued expense accruals for un-invoiced services',
    owner: 'Rillet AI AP Agent',
    status: 'COMPLETED',
    aiAutomatedCheck: true,
    aiValidationMessage: 'Verified: 100% vendor bills 3-way matched. $42,500 unbilled contractor accrual automatically booked to GL 2250.',
    completedAt: '2026-08-23 20:45:00',
    signedOffBy: 'Anil Kumar (Admin)'
  },
  {
    id: 'chk-005',
    order: 5,
    category: 'Payroll & Equity',
    taskName: 'Payroll Clearing Reconciliation & Stock-Based Compensation Accrual',
    description: 'Reconcile Gusto payroll debits against gross wages, tax withholdings, and ASC 718 stock compensation expense',
    owner: 'Priya Sharma (Auditor)',
    status: 'COMPLETED',
    aiAutomatedCheck: true,
    aiValidationMessage: 'Verified: Payroll clearing balance is exactly $0.00. 409A stock option valuation expense aligned with Carta ledger.',
    completedAt: '2026-08-23 21:10:00',
    signedOffBy: 'Priya Sharma (Auditor)'
  },
  {
    id: 'chk-006',
    order: 6,
    category: 'Financial Close & Locks',
    taskName: 'AI Flux Variance Analysis & Auditor Anomaly Review',
    description: 'Generate AI narrative explanations for all MoM account variances > 10% and secure auditor sign-offs',
    owner: 'Super Admin',
    status: 'IN_PROGRESS',
    aiAutomatedCheck: true,
    aiValidationMessage: '4 of 5 material flux items signed off. 1 pending review: Paid Acquisition & Growth Marketing (+58.9% spike).',
    completedAt: undefined,
    signedOffBy: undefined
  },
  {
    id: 'chk-007',
    order: 7,
    category: 'Financial Close & Locks',
    taskName: 'Accounting Period Hard-Lock & Audit Snapshot Cryptographic Hash',
    description: 'Lock accounting period against any retroactive backdated journal entries and generate immutable audit hash',
    owner: 'Super Admin',
    status: 'PENDING_REVIEW',
    aiAutomatedCheck: false,
    aiValidationMessage: 'Awaiting completion of Flux Analysis sign-off before applying hard period lock.',
    completedAt: undefined,
    signedOffBy: undefined
  }
];

export const mockRilletAiQueries: RilletAiQueryLog[] = [
  {
    id: 'qry-001',
    timestamp: '2026-08-23 21:40:12',
    question: 'What is our current ARR and when do we cross $20M based on active pipeline & NRR?',
    answer: 'Our current ARR is $14,850,000 ($1.238M MRR). With a Net Revenue Retention (NRR) of 128.4% and an average net ARR growth velocity of $304,000/month, we are projected to reach the $20,000,000 ARR milestone in February 2027 (~6.1 months).',
    category: 'SaaS Metrics',
    relatedDataRef: 'SaaS Metrics Engine'
  },
  {
    id: 'qry-002',
    timestamp: '2026-08-23 21:45:00',
    question: 'Explain why Cloud Infrastructure COGS spiked by 35.7% in August',
    answer: 'AWS Cloud Infrastructure expense increased by +$52,200 (+35.7% MoM from $146.2k to $198.4k). The root cause is high-demand dedicated NVIDIA H100 GPU cluster reservations provisioned on August 8 for custom enterprise model training milestones requested by NVIDIA Enterprise AI Corp and Databricks.',
    category: 'Anomalies & Flux',
    relatedDataRef: 'Flux Item #flux-002'
  },
  {
    id: 'qry-003',
    timestamp: '2026-08-23 22:00:15',
    question: 'How much deferred revenue is on our balance sheet and what is the 12-month recognition waterfall?',
    answer: 'Total ASC 606 Deferred Revenue across all customer contracts stands at $3,604,167. Over the next 12 months, this will be ratably recognized as follows: Q3 2026: $1,237,500/mo, Q4 2026: $1,290,000/mo, Q1 2027: $1,340,000/mo. All 5 major enterprise contracts are fully compliant with ASC 606 Standalone Selling Price (SSP) allocations.',
    category: 'Revenue & ASC 606',
    relatedDataRef: 'ASC 606 Waterfall Schedule'
  }
];

// ==========================================
// NBFC PRUDENTIAL & ACCOUNTING STANDARDS MOCK DATA
// ==========================================

export const mockNbfcCrar: NbfcCrarMetrics = {
  tier1Capital: 425000000, // ₹42.50 Cr (Paid-up capital + Statutory reserves + Share premium)
  tier2Capital: 85000000,  // ₹8.50 Cr (Subordinated Tier-2 debt + General loan provisions)
  totalCapital: 510000000, // ₹51.00 Cr
  rwaOnBalanceSheet: 2150000000, // ₹215.00 Cr Risk Weighted Assets
  rwaOffBalanceSheet: 180000000,  // ₹18.00 Cr (Undrawn credit lines + Guarantees)
  totalRwa: 2330000000,           // ₹233.00 Cr
  crarPercentage: 21.89,          // 21.89% (Reg min: 15.0%)
  tier1CrarPercentage: 18.24,     // 18.24% (Reg min: 10.0%)
  tier2CrarPercentage: 3.65,
  leverageRatio: 3.82,            // 3.82x (Well within RBI 7x cap)
  regulatoryMinimumCrar: 15.0,
  sbrLayer: 'Middle Layer (NBFC-ML)',
  complianceStatus: 'COMPLIANT'
};

export const mockIndAs109EclStages: IndAs109EclStageSummary[] = [
  {
    stage: 'Stage 1 (0-30 DPD)',
    description: 'Performing Assets with low credit risk. 12-Month Expected Credit Loss computed.',
    loanCount: 1420,
    exposureAtDefault: 2450000000, // ₹245.00 Cr
    probabilityOfDefaultPct: 1.45,
    lossGivenDefaultPct: 35.0,
    eclProvisionAmount: 12433750, // ₹1.24 Cr
    coverageRatioPct: 0.51,
    iracpRegulatoryProvision: 9800000, // 0.40% under RBI IRACP (₹98 Lakh)
    indAsVsIracpDifference: 2633750, // Net higher provision under Ind AS 109
  },
  {
    stage: 'Stage 2 (31-90 DPD SICR)',
    description: 'Underperforming Assets with Significant Increase in Credit Risk. Lifetime ECL computed.',
    loanCount: 168,
    exposureAtDefault: 320000000, // ₹32.00 Cr
    probabilityOfDefaultPct: 8.75,
    lossGivenDefaultPct: 45.0,
    eclProvisionAmount: 12600000, // ₹1.26 Cr
    coverageRatioPct: 3.94,
    iracpRegulatoryProvision: 1280000, // 0.40% under IRACP
    indAsVsIracpDifference: 11320000, // Additional buffer created
  },
  {
    stage: 'Stage 3 (90+ DPD Impaired)',
    description: 'Credit-Impaired Non-Performing Assets (NPA). Lifetime ECL + Specific recovery hair-cut.',
    loanCount: 42,
    exposureAtDefault: 95000000, // ₹9.50 Cr (Gross NPA: 3.32%)
    probabilityOfDefaultPct: 100.0,
    lossGivenDefaultPct: 58.0,
    eclProvisionAmount: 55100000, // ₹5.51 Cr (PCR: 58.0%)
    coverageRatioPct: 58.0,
    iracpRegulatoryProvision: 38000000, // Substandard + Doubtful under IRACP
    indAsVsIracpDifference: 17100000,
  }
];

export const mockNbfcAlmBuckets: NbfcAlmBucket[] = [
  {
    id: 'alm-01',
    timeBucket: '1 - 7 Days',
    cashInflows: 145000000,
    cashOutflows: 95000000,
    netMismatchAmount: 50000000,
    cumulativeMismatchAmount: 50000000,
    cumulativeMismatchPct: 52.6,
    regulatoryLimitPct: -10.0,
    isWithinLimit: true
  },
  {
    id: 'alm-02',
    timeBucket: '8 - 14 Days',
    cashInflows: 180000000,
    cashOutflows: 140000000,
    netMismatchAmount: 40000000,
    cumulativeMismatchAmount: 90000000,
    cumulativeMismatchPct: 38.3,
    regulatoryLimitPct: -10.0,
    isWithinLimit: true
  },
  {
    id: 'alm-03',
    timeBucket: '15 - 30 Days',
    cashInflows: 260000000,
    cashOutflows: 220000000,
    netMismatchAmount: 40000000,
    cumulativeMismatchAmount: 130000000,
    cumulativeMismatchPct: 28.6,
    regulatoryLimitPct: -15.0,
    isWithinLimit: true
  },
  {
    id: 'alm-04',
    timeBucket: '1 - 2 Months',
    cashInflows: 310000000,
    cashOutflows: 290000000,
    netMismatchAmount: 20000000,
    cumulativeMismatchAmount: 150000000,
    cumulativeMismatchPct: 20.1,
    regulatoryLimitPct: -15.0,
    isWithinLimit: true
  },
  {
    id: 'alm-05',
    timeBucket: '2 - 3 Months',
    cashInflows: 290000000,
    cashOutflows: 310000000,
    netMismatchAmount: -20000000,
    cumulativeMismatchAmount: 130000000,
    cumulativeMismatchPct: 12.4,
    regulatoryLimitPct: -15.0,
    isWithinLimit: true
  },
  {
    id: 'alm-06',
    timeBucket: '3 - 6 Months',
    cashInflows: 480000000,
    cashOutflows: 450000000,
    netMismatchAmount: 30000000,
    cumulativeMismatchAmount: 160000000,
    cumulativeMismatchPct: 10.7,
    regulatoryLimitPct: -15.0,
    isWithinLimit: true
  },
  {
    id: 'alm-07',
    timeBucket: '6 - 12 Months',
    cashInflows: 720000000,
    cashOutflows: 680000000,
    netMismatchAmount: 40000000,
    cumulativeMismatchAmount: 200000000,
    cumulativeMismatchPct: 9.2,
    regulatoryLimitPct: -15.0,
    isWithinLimit: true
  },
  {
    id: 'alm-08',
    timeBucket: '1 - 3 Years',
    cashInflows: 1400000000,
    cashOutflows: 1350000000,
    netMismatchAmount: 50000000,
    cumulativeMismatchAmount: 250000000,
    cumulativeMismatchPct: 7.1,
    regulatoryLimitPct: -15.0,
    isWithinLimit: true
  },
  {
    id: 'alm-09',
    timeBucket: '3 - 5 Years',
    cashInflows: 850000000,
    cashOutflows: 900000000,
    netMismatchAmount: -50000000,
    cumulativeMismatchAmount: 200000000,
    cumulativeMismatchPct: 4.5,
    regulatoryLimitPct: -15.0,
    isWithinLimit: true
  },
  {
    id: 'alm-10',
    timeBucket: 'Over 5 Years',
    cashInflows: 620000000,
    cashOutflows: 500000000,
    netMismatchAmount: 120000000,
    cumulativeMismatchAmount: 320000000,
    cumulativeMismatchPct: 6.5,
    regulatoryLimitPct: -15.0,
    isWithinLimit: true
  }
];

export const mockNbfcCoLendingDeals: NbfcCoLendingEscrowDeal[] = [
  {
    id: 'cld-001',
    dealCode: 'SBI-MSME-POOL-2026-A',
    originatingNbfcName: 'FinCapLen NBFC Ltd',
    partnerBankName: 'State Bank of India',
    colendingModel: 'Model 1 (Joint Lending)',
    nbfcSharePct: 20,
    partnerBankSharePct: 80,
    blendedInterestRate: 10.75,
    totalPoolDisbursed: 250000000, // ₹25.00 Cr
    livePrincipalOutstanding: 218000000,
    monthlyCollectionsTotal: 8450000,
    bankEscrowRemittance: 6760000, // 80%
    nbfcRetainedRemittance: 1690000, // 20%
    firstLossDefaultGuaranteePct: 4.5, // <= 5% RBI limit
    fldgAmountDeposited: 11250000,
    fldgStatus: 'COMPLIANT (<=5%)',
    escrowStatus: 'Settled'
  },
  {
    id: 'cld-002',
    dealCode: 'HDFC-AUTO-SEC-2026-Q1',
    originatingNbfcName: 'FinCapLen NBFC Ltd',
    partnerBankName: 'HDFC Bank',
    colendingModel: 'Model 2 (Direct Assignment / Securitization 80:20)',
    nbfcSharePct: 15,
    partnerBankSharePct: 85,
    blendedInterestRate: 11.20,
    totalPoolDisbursed: 180000000, // ₹18.00 Cr
    livePrincipalOutstanding: 154000000,
    monthlyCollectionsTotal: 6200000,
    bankEscrowRemittance: 5270000,
    nbfcRetainedRemittance: 930000,
    firstLossDefaultGuaranteePct: 5.0,
    fldgAmountDeposited: 9000000,
    fldgStatus: 'COMPLIANT (<=5%)',
    escrowStatus: 'Settled'
  },
  {
    id: 'cld-003',
    dealCode: 'ICICI-RETAIL-GOLD-2026',
    originatingNbfcName: 'FinCapLen NBFC Ltd',
    partnerBankName: 'ICICI Bank',
    colendingModel: 'Model 1 (Joint Lending)',
    nbfcSharePct: 20,
    partnerBankSharePct: 80,
    blendedInterestRate: 9.80,
    totalPoolDisbursed: 120000000,
    livePrincipalOutstanding: 105000000,
    monthlyCollectionsTotal: 4100000,
    bankEscrowRemittance: 3280000,
    nbfcRetainedRemittance: 820000,
    firstLossDefaultGuaranteePct: 3.5,
    fldgAmountDeposited: 4200000,
    fldgStatus: 'COMPLIANT (<=5%)',
    escrowStatus: 'Settled'
  }
];

export const mockBureauTudfRecords: BureauTudfRecord[] = [
  {
    id: 'bur-001',
    accountNumber: 'LN-MSME-2025-0819',
    borrowerName: 'Rohan Tech Solutions Pvt Ltd',
    idType: 'PAN',
    idNumber: 'ABCDE1234F',
    sanctionAmount: 5000000,
    currentBalance: 3420000,
    amountOverdue: 0,
    daysPastDue: 0,
    assetClassification: 'STD',
    paymentHistoryString: '000000000000000000000000000000000000',
    bureauScoreEstimated: 785,
    validationStatus: 'CLEAN',
    validationMessage: 'All mandatory TUDF 3.0 fields present and verified against CIBIL specifications.'
  },
  {
    id: 'bur-002',
    accountNumber: 'LN-AUTO-2024-1142',
    borrowerName: 'Priya Services & Logistics Ltd',
    idType: 'PAN',
    idNumber: 'FGHIJ5678K',
    sanctionAmount: 2500000,
    currentBalance: 1680000,
    amountOverdue: 42000,
    daysPastDue: 28,
    assetClassification: 'STD',
    paymentHistoryString: '028000000000000000000000000000000000',
    bureauScoreEstimated: 720,
    validationStatus: 'WARNING',
    validationMessage: 'Current installment overdue by 28 days (SMA-0). No restructuring reported.'
  },
  {
    id: 'bur-003',
    accountNumber: 'LN-HL-2023-0491',
    borrowerName: 'Amit Singh',
    idType: 'PAN',
    idNumber: 'KLMNO9012P',
    sanctionAmount: 7500000,
    currentBalance: 6890000,
    amountOverdue: 0,
    daysPastDue: 0,
    assetClassification: 'STD',
    paymentHistoryString: '000000000000000000000000000000000000',
    bureauScoreEstimated: 810,
    validationStatus: 'CLEAN',
    validationMessage: 'Spotless 36-month repayment track record.'
  },
  {
    id: 'bur-004',
    accountNumber: 'LN-BL-2024-8831',
    borrowerName: 'Global Exports Trading House',
    idType: 'PAN',
    idNumber: 'PQRST3456Y',
    sanctionAmount: 3500000,
    currentBalance: 3120000,
    amountOverdue: 185000,
    daysPastDue: 94,
    assetClassification: 'SUB',
    paymentHistoryString: '094064034000000000000000000000000000',
    bureauScoreEstimated: 615,
    validationStatus: 'CLEAN',
    validationMessage: 'Account crossed 90 DPD threshold. Classified as Sub-Standard NPA per RBI IRACP.'
  }
];

export const mockOpenCostCenters: OpenCostCenter[] = [
  {
    id: 'cc-101',
    code: 'CC-RET-LEND',
    name: 'Retail Lending & Auto Leasing Division',
    department: 'Retail Lending',
    allocatedBudget: 15000000,
    actualSpent: 12400000,
    variance: 2600000,
    headOfDepartment: 'Amit Patel',
    status: 'Active'
  },
  {
    id: 'cc-102',
    code: 'CC-SME-CORP',
    name: 'SME, MSME & Commercial Finance',
    department: 'SME & Corporate',
    allocatedBudget: 22000000,
    actualSpent: 19800000,
    variance: 2200000,
    headOfDepartment: 'Sunil Mehta',
    status: 'Active'
  },
  {
    id: 'cc-103',
    code: 'CC-TREAS-ALM',
    name: 'Treasury, Liquidity & Capital Markets',
    department: 'Treasury & ALM',
    allocatedBudget: 8000000,
    actualSpent: 7100000,
    variance: 900000,
    headOfDepartment: 'Rekha Gupta',
    status: 'Active'
  },
  {
    id: 'cc-104',
    code: 'CC-COLL-REC',
    name: 'Field Collections & Legal Recovery',
    department: 'Collections & Recovery',
    allocatedBudget: 12000000,
    actualSpent: 11400000,
    variance: 600000,
    headOfDepartment: 'Vikas Rao',
    status: 'Active'
  },
  {
    id: 'cc-105',
    code: 'CC-RISK-UND',
    name: 'Credit Risk, Fraud & Underwriting',
    department: 'Risk & Underwriting',
    allocatedBudget: 9500000,
    actualSpent: 8200000,
    variance: 1300000,
    headOfDepartment: 'Priya Sharma',
    status: 'Active'
  }
];

export const mockOpenBudgetRules: OpenBudgetRule[] = [
  {
    id: 'bgt-01',
    accountCode: '5200',
    accountName: 'Cloud Infrastructure & Core Banking Hosting',
    costCenterCode: 'CC-TREAS-ALM',
    fiscalYear: '2026-2027',
    monthlyBudget: 850000,
    actualYearToDate: 720000,
    remainingBudget: 130000,
    actionOnExceed: 'Warn User & Log Audit',
    alertThresholdPct: 85,
    isBreached: false
  },
  {
    id: 'bgt-02',
    accountCode: '5300',
    accountName: 'Credit Bureau Pulls & Verification APIs',
    costCenterCode: 'CC-RISK-UND',
    fiscalYear: '2026-2027',
    monthlyBudget: 400000,
    actualYearToDate: 385000,
    remainingBudget: 15000,
    actionOnExceed: 'Stop Transaction',
    alertThresholdPct: 90,
    isBreached: true
  },
  {
    id: 'bgt-03',
    accountCode: '5400',
    accountName: 'Legal Notice & Recovery Arbitrator Fees',
    costCenterCode: 'CC-COLL-REC',
    fiscalYear: '2026-2027',
    monthlyBudget: 600000,
    actualYearToDate: 450000,
    remainingBudget: 150000,
    actionOnExceed: 'Warn User & Log Audit',
    alertThresholdPct: 80,
    isBreached: false
  }
];

export const mockOpenPeriodClosingEntries: OpenPeriodClosingEntry[] = [
  {
    id: 'pce-01',
    periodName: 'FY2025-26 Q4 Annual Financial Close',
    closingDate: '2026-03-31',
    closingVoucherNumber: 'VCH-CLOSE-2026-03-01',
    totalExpenseDebitTransferred: 48500000,
    totalIncomeCreditTransferred: 72400000,
    netProfitTransferredToRetainedEarnings: 23900000,
    retainedEarningsAccount: '3100 - Retained Earnings & Statutory Reserve',
    executedBy: 'Rekha Gupta (Accounting)',
    isLocked: true
  },
  {
    id: 'pce-02',
    periodName: 'FY2026-27 Q1 Quarterly Provisional Close',
    closingDate: '2026-06-30',
    closingVoucherNumber: 'VCH-CLOSE-2026-06-01',
    totalExpenseDebitTransferred: 14200000,
    totalIncomeCreditTransferred: 21800000,
    netProfitTransferredToRetainedEarnings: 7600000,
    retainedEarningsAccount: '3100 - Retained Earnings & Statutory Reserve',
    executedBy: 'Rekha Gupta (Accounting)',
    isLocked: true
  }
];

// ==========================================
// JEV.AI (SYSTEM ONE AI ENGINE) MOCK DATA
// ==========================================

export const mockJevPipelines: JevPipeline[] = [
  {
    id: 'jev-pipe-01',
    name: 'Autonomous General Ledger (GL) Auto-Coder & STP Sentinel',
    tag: 'GL-STP-01',
    description: 'Instant sub-50ms Chart of Accounts code prediction, confidence evaluation, and Straight-Through-Processing triage for inbound bank, vendor, and core banking transactions.',
    category: 'General Ledger',
    sampleState: {
      transactionRef: 'TXN-BANK-99420',
      narration: 'ACH DIRECT DEBIT AWS CLOUD EMEA EUR 14,200 PROD SERVER HOSTING US-EAST',
      amount: 1285000,
      currency: 'INR',
      counterparty: 'Amazon Web Services Inc.',
      channel: 'Corporate NetBanking RTGS',
      costCenter: 'CC-TECH-01'
    },
    questions: [
      {
        id: 'q-gl-1',
        question: 'Predict Standard Chart of Accounts (COA) Account Code for inbound transaction',
        type: 'choice',
        options: [
          '5100 - Cloud Infrastructure & Server Hosting',
          '5200 - Software Subscriptions & SaaS Licenses',
          '5300 - IT Hardware & Data Center Amortization',
          '2100 - Trade Accounts Payable',
          '4100 - Operating Revenue'
        ],
        description: 'Single-pass categorical classification across Chart of Accounts hierarchy'
      },
      {
        id: 'q-gl-2',
        question: 'Requires manual senior controller review (P > 0.05 indicates exception / threshold breach)?',
        type: 'noul',
        noulThreshold: 0.5,
        description: 'Calibrated boolean guardrail evaluating amount anomaly and foreign remittance compliance'
      },
      {
        id: 'q-gl-3',
        question: 'Audit Confidence & Documentation Quality Score (0-100)',
        type: 'score',
        scoreMin: 0,
        scoreMax: 100,
        description: 'Continuous calibrated score reflecting tax invoice matching probability'
      }
    ],
    stpConfidenceThreshold: 0.95,
    latencyAvgMs: 44,
    costSavingsPct: 99.2,
    status: 'Active'
  },
  {
    id: 'jev-pipe-02',
    name: 'RBI NBFC Prudential & Single-Borrower Exposure Guardrail',
    tag: 'RBI-REG-SBR',
    description: 'Enforces Reserve Bank of India Scale Based Regulation (SBR) exposure ceilings (20% of Tier 1 Capital) and instant asset classification without human delay.',
    category: 'Regulatory & RBI',
    sampleState: {
      borrowerPan: 'AAACF9821K',
      borrowerName: 'Zenith Logistics Infra Pvt Ltd',
      sanctionAmount: 45000000,
      existingExposure: 82000000,
      tier1Capital: 750000000,
      sector: 'Infrastructure & Heavy Transport',
      promoterCibilScore: 782,
      assetType: 'Secured Commercial Hypothecation'
    },
    questions: [
      {
        id: 'q-rbi-1',
        question: 'Violates RBI Single Borrower Exposure Limit (20% of Net Owned Funds / Tier 1 Capital)?',
        type: 'noul',
        noulThreshold: 0.5,
        description: 'Rigorous regulatory ceiling check: Total proposed exposure must not exceed ₹150,000,000'
      },
      {
        id: 'q-rbi-2',
        question: 'Asset Classification Bucket under SBR Scale Based Regulation',
        type: 'choice',
        options: [
          'Standard - Performing (0 DPD)',
          'SMA-0 (1-30 DPD Early Alert)',
          'SMA-1 (31-60 DPD)',
          'SMA-2 (61-90 DPD Sub-Standard)',
          'Non-Performing Asset (NPA 90+ DPD)'
        ],
        description: 'Statutory prudential asset categorization'
      },
      {
        id: 'q-rbi-3',
        question: 'Capital Adequacy & Risk-Weighted Asset (RWA) Density Index (0-100)',
        type: 'score',
        scoreMin: 0,
        scoreMax: 100,
        description: 'RBI Basel-aligned risk-weight score'
      }
    ],
    stpConfidenceThreshold: 0.98,
    latencyAvgMs: 39,
    costSavingsPct: 98.9,
    status: 'Active'
  },
  {
    id: 'jev-pipe-03',
    name: 'Vendor Invoice Fraud, Duplicate & TDS Section 194Q Sentinel',
    tag: 'TAX-TDS-194Q',
    description: 'Real-time detection of split billing, duplicate vendor invoices, and automated Indian Income Tax TDS deduction code assignment.',
    category: 'Regulatory & RBI',
    sampleState: {
      vendorGstin: '27AABCT8812L1Z9',
      vendorName: 'Apex Enterprise Software Solutions',
      invoiceNumber: 'INV/2026/884',
      invoiceDate: '2026-09-21',
      grossAmount: 1850000,
      tdsEligibleSection: '194J',
      previousInvoicesIn30Days: 2,
      cumulativeFYTurnoverWithVendor: 6200000
    },
    questions: [
      {
        id: 'q-tds-1',
        question: 'Is this transaction a potential split payment or duplicate invoice under Sec 194Q / 194C?',
        type: 'noul',
        noulThreshold: 0.4,
        description: 'Calculates probability of intentional invoice subdivision or duplicate billing'
      },
      {
        id: 'q-tds-2',
        question: 'Vendor Fraud, Shell Entity & GST Mismatch Risk Score (0-100)',
        type: 'score',
        scoreMin: 0,
        scoreMax: 100,
        description: 'Calibrated vendor risk rating based on GST 2B filing history'
      },
      {
        id: 'q-tds-3',
        question: 'Applicable Tax Deduction at Source (TDS) Statutory Rate Code',
        type: 'choice',
        options: [
          'Section 194J - Professional & Technical Fees (10% or 2%)',
          'Section 194C - Contractor & Subcontractor Works (1% or 2%)',
          'Section 194Q - Purchase of Goods > ₹50 Lakhs (0.1%)',
          'Section 194I - Rent of Land / Building (10%)',
          'Exempt - No TDS Applicable (Form 15G/15H / Below Threshold)'
        ],
        description: 'Direct tax statutory deduction classification'
      }
    ],
    stpConfidenceThreshold: 0.94,
    latencyAvgMs: 46,
    costSavingsPct: 99.4,
    status: 'Active'
  },
  {
    id: 'jev-pipe-04',
    name: 'Continuous AML / SAR Suspicious Structuring Detector',
    tag: 'AML-PMLA-SAR',
    description: 'Detects smurfing, cash structuring below ₹10 Lakhs reporting thresholds, and high-velocity fund rotation under Prevention of Money Laundering Act.',
    category: 'Fraud & AML',
    sampleState: {
      accountId: 'CA-NBFC-881920',
      accountHolder: 'Horizon Multitrade Agencies',
      transactionCount24h: 18,
      totalDeposits24h: 980000,
      averageDepositSize: 49000,
      kycTier: 'Medium Risk Corporate',
      geographicCluster: 'Border District Tier-3',
      beneficialOwnerPep: false
    },
    questions: [
      {
        id: 'q-aml-1',
        question: 'Does transaction sequence match PMLA Suspicious Transaction Report (STR) cash structuring criteria?',
        type: 'noul',
        noulThreshold: 0.35,
        description: 'High-sensitivity calibrated boolean detector for structuring'
      },
      {
        id: 'q-aml-2',
        question: 'Anti-Money Laundering Anomaly Risk Score (0-100)',
        type: 'score',
        scoreMin: 0,
        scoreMax: 100,
        description: 'Velocity, geographic risk, and counterparty graph score'
      },
      {
        id: 'q-aml-3',
        question: 'Autonomous Enforcement & Routing Recommendation',
        type: 'choice',
        options: [
          'STP Clear - Normal Business Activity',
          'Internal Watchlist - Monitor Next 7 Days',
          'Require Enhanced Due Diligence (EDD) Form',
          'Escalate to Principal Officer for FIU-IND STR Filing',
          'Immediate Account Debit Freeze'
        ],
        description: 'Deterministic enforcement action selection'
      }
    ],
    stpConfidenceThreshold: 0.96,
    latencyAvgMs: 36,
    costSavingsPct: 99.1,
    status: 'Active'
  },
  {
    id: 'jev-pipe-05',
    name: 'Ind AS 109 Expected Credit Loss (ECL) Stage Classifier',
    tag: 'INDAS-109-ECL',
    description: 'Instant credit migration classifier evaluating Significant Increase in Credit Risk (SICR) across retail and SME loan books.',
    category: 'Asset Staging',
    sampleState: {
      loanId: 'LN-IND-8841',
      borrowerSegment: 'SME Secured Working Capital',
      currentDpd: 38,
      dpdHistoricalMax: 42,
      restructuredLoan: false,
      industryMacroShockFactor: 1.15,
      collateralCoverRatio: 1.45,
      cibilBureauScoreChange30d: -48
    },
    questions: [
      {
        id: 'q-ecl-1',
        question: 'Classify Ind AS 109 ECL Stage based on 30-day DPD, SICR indicators and macro overlays',
        type: 'choice',
        options: [
          'Stage 1 - Performing (12-Month ECL)',
          'Stage 2 - Significant Increase in Credit Risk (Lifetime ECL)',
          'Stage 3 - Credit Impaired / Default (Lifetime ECL + Loss Given Default)'
        ],
        description: 'Accounting standard ECL staging category'
      },
      {
        id: 'q-ecl-2',
        question: 'Calibrated Probability of Default (PD) Estimate Score (0-100)',
        type: 'score',
        scoreMin: 0,
        scoreMax: 100,
        description: '12-month forward-looking default probability scaled 0-100'
      },
      {
        id: 'q-ecl-3',
        question: 'Significant Increase in Credit Risk (SICR) triggered since initial origination?',
        type: 'noul',
        noulThreshold: 0.5,
        description: 'Determines whether 12-month ECL must transition to Lifetime ECL'
      }
    ],
    stpConfidenceThreshold: 0.97,
    latencyAvgMs: 49,
    costSavingsPct: 99.0,
    status: 'Active'
  }
];

export const mockJevBatchRecords: JevBatchRecord[] = [
  {
    id: 'jb-01',
    referenceNumber: 'VCH-2026-701',
    date: '2026-09-25',
    partyName: 'Tata Consultancy Services Ltd',
    amount: 1450000,
    transactionType: 'Vendor Bill - IT Consulting',
    predictedGlAccount: '5200 - Software Subscriptions & SaaS Licenses',
    choiceConfidence: 0.988,
    riskScore: 8,
    noulRequiresApproval: false,
    noulConfidence: 0.994,
    stpStatus: 'STP_COMMITTED',
    latencyMs: 38,
    executionCostUsd: 0.000004
  },
  {
    id: 'jb-02',
    referenceNumber: 'VCH-2026-702',
    date: '2026-09-25',
    partyName: 'Reliance Jio Infocomm Ltd',
    amount: 320000,
    transactionType: 'Telecom & Leased Line Data Feeds',
    predictedGlAccount: '5100 - Cloud Infrastructure & Server Hosting',
    choiceConfidence: 0.976,
    riskScore: 12,
    noulRequiresApproval: false,
    noulConfidence: 0.985,
    stpStatus: 'STP_COMMITTED',
    latencyMs: 41,
    executionCostUsd: 0.000003
  },
  {
    id: 'jb-03',
    referenceNumber: 'VCH-2026-703',
    date: '2026-09-25',
    partyName: 'Unknown Foreign Entity Ltd (Dubai)',
    amount: 8750000,
    transactionType: 'International Advisory Fee Remittance',
    predictedGlAccount: '5800 - Miscellaneous Professional & Legal',
    choiceConfidence: 0.812,
    riskScore: 84,
    noulRequiresApproval: true,
    noulConfidence: 0.965,
    stpStatus: 'ESCALATED_TO_SYSTEM2',
    latencyMs: 54,
    executionCostUsd: 0.000006
  },
  {
    id: 'jb-04',
    referenceNumber: 'VCH-2026-704',
    date: '2026-09-25',
    partyName: 'HDFC Bank Treasury Account',
    amount: 25000000,
    transactionType: 'Inter-Bank Term Money Placement',
    predictedGlAccount: '1150 - Short-Term Bank Placements & T-Bills',
    choiceConfidence: 0.995,
    riskScore: 4,
    noulRequiresApproval: false,
    noulConfidence: 0.998,
    stpStatus: 'STP_COMMITTED',
    latencyMs: 35,
    executionCostUsd: 0.000003
  },
  {
    id: 'jb-05',
    referenceNumber: 'VCH-2026-705',
    date: '2026-09-25',
    partyName: 'Vikas Transport Syndicate',
    amount: 495000,
    transactionType: 'Cash Transport & Security Van Log',
    predictedGlAccount: '5400 - Cash Logistics & Field Transport',
    choiceConfidence: 0.964,
    riskScore: 19,
    noulRequiresApproval: false,
    noulConfidence: 0.978,
    stpStatus: 'STP_COMMITTED',
    latencyMs: 43,
    executionCostUsd: 0.000004
  },
  {
    id: 'jb-06',
    referenceNumber: 'VCH-2026-706',
    date: '2026-09-24',
    partyName: 'Apex Machinery Suppliers Pvt Ltd',
    amount: 2850000,
    transactionType: 'Capital Equipment Hypothecation Disbursement',
    predictedGlAccount: '1300 - Secured Equipment Financing Advances',
    choiceConfidence: 0.982,
    riskScore: 22,
    noulRequiresApproval: false,
    noulConfidence: 0.961,
    stpStatus: 'STP_COMMITTED',
    latencyMs: 47,
    executionCostUsd: 0.000005
  },
  {
    id: 'jb-07',
    referenceNumber: 'VCH-2026-707',
    date: '2026-09-24',
    partyName: 'Duplicate Suspicious Invoice (Split 1)',
    amount: 499000,
    transactionType: 'Advisory Bill with identical hash to #708',
    predictedGlAccount: '5800 - Miscellaneous Professional & Legal',
    choiceConfidence: 0.884,
    riskScore: 91,
    noulRequiresApproval: true,
    noulConfidence: 0.988,
    stpStatus: 'ESCALATED_TO_SYSTEM2',
    latencyMs: 49,
    executionCostUsd: 0.000005
  },
  {
    id: 'jb-08',
    referenceNumber: 'VCH-2026-708',
    date: '2026-09-24',
    partyName: 'Duplicate Suspicious Invoice (Split 2)',
    amount: 498000,
    transactionType: 'Advisory Bill with identical hash to #707',
    predictedGlAccount: '5800 - Miscellaneous Professional & Legal',
    choiceConfidence: 0.879,
    riskScore: 93,
    noulRequiresApproval: true,
    noulConfidence: 0.991,
    stpStatus: 'ESCALATED_TO_SYSTEM2',
    latencyMs: 51,
    executionCostUsd: 0.000005
  },
  {
    id: 'jb-09',
    referenceNumber: 'VCH-2026-709',
    date: '2026-09-24',
    partyName: 'ICICI Lombard General Insurance',
    amount: 680000,
    transactionType: 'Borrower Credit Shield Group Premium',
    predictedGlAccount: '2250 - Premium Payable to Underwriters',
    choiceConfidence: 0.991,
    riskScore: 6,
    noulRequiresApproval: false,
    noulConfidence: 0.996,
    stpStatus: 'STP_COMMITTED',
    latencyMs: 37,
    executionCostUsd: 0.000003
  },
  {
    id: 'jb-10',
    referenceNumber: 'VCH-2026-710',
    date: '2026-09-23',
    partyName: 'Retail Micro-Borrower Collections Pool #4',
    amount: 1845000,
    transactionType: 'UPI AutoPay Batch Repayment Receipt',
    predictedGlAccount: '1200 - Retail Loan Portfolio Receivables',
    choiceConfidence: 0.997,
    riskScore: 2,
    noulRequiresApproval: false,
    noulConfidence: 0.999,
    stpStatus: 'STP_COMMITTED',
    latencyMs: 36,
    executionCostUsd: 0.000003
  },
  {
    id: 'jb-11',
    referenceNumber: 'VCH-2026-711',
    date: '2026-09-23',
    partyName: 'Credit Information Bureau India Ltd (CIBIL)',
    amount: 142000,
    transactionType: 'Monthly Bureau Pull API Billing',
    predictedGlAccount: '5300 - Credit Bureau Pulls & Verification APIs',
    choiceConfidence: 0.989,
    riskScore: 5,
    noulRequiresApproval: false,
    noulConfidence: 0.995,
    stpStatus: 'STP_COMMITTED',
    latencyMs: 39,
    executionCostUsd: 0.000003
  },
  {
    id: 'jb-12',
    referenceNumber: 'VCH-2026-712',
    date: '2026-09-23',
    partyName: 'M/S Sharma & Associates (Advocates)',
    amount: 750000,
    transactionType: 'SARFAESI Section 13(2) Legal Notice Notice Retainer',
    predictedGlAccount: '5400 - Legal Notice & Recovery Arbitrator Fees',
    choiceConfidence: 0.968,
    riskScore: 16,
    noulRequiresApproval: false,
    noulConfidence: 0.974,
    stpStatus: 'STP_COMMITTED',
    latencyMs: 44,
    executionCostUsd: 0.000004
  },
  {
    id: 'jb-13',
    referenceNumber: 'VCH-2026-713',
    date: '2026-09-22',
    partyName: 'State Bank of India Term Loan Tranche',
    amount: 50000000,
    transactionType: 'Long-Term Bank Borrowing Principal Inflow',
    predictedGlAccount: '2400 - Bank Borrowings & Refinance Facilities',
    choiceConfidence: 0.994,
    riskScore: 7,
    noulRequiresApproval: false,
    noulConfidence: 0.988,
    stpStatus: 'STP_COMMITTED',
    latencyMs: 40,
    executionCostUsd: 0.000004
  },
  {
    id: 'jb-14',
    referenceNumber: 'VCH-2026-714',
    date: '2026-09-22',
    partyName: 'Indo-African Timber Exports Pvt Ltd',
    amount: 18500000,
    transactionType: 'Sanction Exceeding Borrower Single Limit',
    predictedGlAccount: '1400 - Corporate Term Loan Advances',
    choiceConfidence: 0.892,
    riskScore: 88,
    noulRequiresApproval: true,
    noulConfidence: 0.978,
    stpStatus: 'PENDING_HUMAN_REVIEW',
    latencyMs: 46,
    executionCostUsd: 0.000005
  },
  {
    id: 'jb-15',
    referenceNumber: 'VCH-2026-715',
    date: '2026-09-22',
    partyName: 'Electricity & Utility Board Mumbai',
    amount: 88400,
    transactionType: 'Head Office Power Bill',
    predictedGlAccount: '5600 - Office Utilities & Electricity',
    choiceConfidence: 0.996,
    riskScore: 3,
    noulRequiresApproval: false,
    noulConfidence: 0.999,
    stpStatus: 'STP_COMMITTED',
    latencyMs: 34,
    executionCostUsd: 0.000002
  },
  {
    id: 'jb-16',
    referenceNumber: 'VCH-2026-716',
    date: '2026-09-21',
    partyName: 'Director Extraordinary Bonus Allocation',
    amount: 4500000,
    transactionType: 'Non-routine Director Remuneration',
    predictedGlAccount: '5900 - Executive Compensation & Perquisites',
    choiceConfidence: 0.865,
    riskScore: 72,
    noulRequiresApproval: true,
    noulConfidence: 0.952,
    stpStatus: 'ESCALATED_TO_SYSTEM2',
    latencyMs: 53,
    executionCostUsd: 0.000005
  }
];

export const mockJevCalibrationBuckets: JevCalibrationBin[] = [
  { binRange: '0.50 - 0.55', confidenceMidpoint: 0.525, empiricalAccuracy: 0.531, sampleCount: 1420 },
  { binRange: '0.55 - 0.60', confidenceMidpoint: 0.575, empiricalAccuracy: 0.582, sampleCount: 1890 },
  { binRange: '0.60 - 0.65', confidenceMidpoint: 0.625, empiricalAccuracy: 0.628, sampleCount: 2340 },
  { binRange: '0.65 - 0.70', confidenceMidpoint: 0.675, empiricalAccuracy: 0.672, sampleCount: 3100 },
  { binRange: '0.70 - 0.75', confidenceMidpoint: 0.725, empiricalAccuracy: 0.730, sampleCount: 4210 },
  { binRange: '0.75 - 0.80', confidenceMidpoint: 0.775, empiricalAccuracy: 0.779, sampleCount: 5890 },
  { binRange: '0.80 - 0.85', confidenceMidpoint: 0.825, empiricalAccuracy: 0.824, sampleCount: 8120 },
  { binRange: '0.85 - 0.90', confidenceMidpoint: 0.875, empiricalAccuracy: 0.878, sampleCount: 12450 },
  { binRange: '0.90 - 0.95', confidenceMidpoint: 0.925, empiricalAccuracy: 0.927, sampleCount: 26800 },
  { binRange: '0.95 - 1.00', confidenceMidpoint: 0.975, empiricalAccuracy: 0.974, sampleCount: 78500 }
];

export const mockJevRecentEvaluations: JevEvaluationOutput[] = [
  {
    id: 'jev-eval-101',
    title: 'Bank Feed GL Auto-Coding: AWS Hosting Remittance',
    stateInput: { narration: 'ACH AWS CLOUD EMEA EUR 14,200', amount: 1285000, counterparty: 'Amazon Web Services' },
    question: 'Predict Standard Chart of Accounts (COA) Account Code for inbound transaction',
    decisionType: 'choice',
    answer: '5100 - Cloud Infrastructure & Server Hosting',
    confidence: 0.988,
    probabilities: {
      '5100 - Cloud Infrastructure & Server Hosting': 0.988,
      '5200 - Software Subscriptions & SaaS Licenses': 0.009,
      '5300 - IT Hardware & Data Center Amortization': 0.002,
      '2100 - Trade Accounts Payable': 0.001
    },
    latencyMs: 41,
    inputTokens: 142,
    costUsd: 0.000006,
    stpStatus: 'STP_APPROVED',
    system2Triggered: false,
    timestamp: '2026-09-25 09:42:18'
  },
  {
    id: 'jev-eval-102',
    title: 'RBI Single-Borrower Ceiling: Zenith Logistics Loan Extension',
    stateInput: { borrower: 'Zenith Logistics Infra', exposureProposed: 127000000, ceiling: 150000000 },
    question: 'Violates RBI Single Borrower Exposure Limit (20% of Net Owned Funds)?',
    decisionType: 'noul',
    answer: false,
    confidence: 0.994,
    probabilities: { 'Yes': 0.006, 'No': 0.994 },
    latencyMs: 38,
    inputTokens: 180,
    costUsd: 0.000008,
    stpStatus: 'STP_APPROVED',
    system2Triggered: false,
    timestamp: '2026-09-25 09:35:04'
  },
  {
    id: 'jev-eval-103',
    title: 'High-Value Advisory Bill: Foreign Remittance Escalation',
    stateInput: { counterparty: 'Unknown Foreign Entity Ltd', amount: 8750000, jurisdiction: 'UAE' },
    question: 'Requires manual senior controller review (P > 0.05 indicates exception / threshold breach)?',
    decisionType: 'noul',
    answer: true,
    confidence: 0.965,
    probabilities: { 'Yes': 0.965, 'No': 0.035 },
    latencyMs: 52,
    inputTokens: 215,
    costUsd: 0.000009,
    stpStatus: 'REJECTED_BY_GUARDRAIL',
    system2Triggered: true,
    system2Explanation: 'System 2 (Gemini Deep Reasoning): Escalated due to high-value foreign remittance (₹87.5 Lakhs) to non-treaty jurisdiction with generic narration. FEMA Section 10(4) documentation and Form 15CA/CB statutory auditor certification required prior to ledger commitment.',
    timestamp: '2026-09-25 09:12:45'
  }
];

// ==========================================
// RUNAMARGA AI MOCK DATA
// ==========================================

export const mockRunamargaTelemetry: RunamargaTelemetryStats = {
  activeCallsCount: 14,
  totalCallsToday: 1845,
  avgHandlingTimeSec: 142,
  avgE2eLatencyMs: 615,
  ptpConversionRate: 74.2,
  fpcComplianceRate: 100.0,
  costSavingsPct: 92.4,
  totalCostSavedInr: 77490,
  asrAccuracyPct: 98.1,
  interruptionSuccessPct: 98.7
};

export const mockRunamargaCampaigns: RunamargaCampaign[] = [
  {
    id: 'cmp-1',
    name: 'MSME Working Capital Pre-Approved Sales Drive',
    type: 'LOAN_SALES',
    targetAudience: 'Pre-qualified MSME Proprietors & Directors (CIBIL 720+)',
    totalContacts: 2400,
    completedCalls: 1840,
    connectedRate: 83.5,
    conversionRate: 36.8,
    status: 'ACTIVE',
    pacing: 45,
    languages: ['Hinglish', 'Hindi', 'English'],
    scheduleWindow: '09:30 - 18:30 (RBI FPC)',
    avgDurationSec: 165
  },
  {
    id: 'cmp-2',
    name: 'Early Delinquency EMI Reminder (1-15 DPD)',
    type: 'COLLECTIONS_EARLY',
    targetAudience: 'Active retail & auto loan borrowers with overdue cycle',
    totalContacts: 1520,
    completedCalls: 1390,
    connectedRate: 91.2,
    conversionRate: 74.6,
    status: 'ACTIVE',
    pacing: 60,
    languages: ['Hindi', 'English', 'Tamil', 'Telugu'],
    scheduleWindow: '08:30 - 18:45 (FPC Compliant)',
    avgDurationSec: 110
  },
  {
    id: 'cmp-3',
    name: 'SMA-1 & SMA-2 Structured Recovery & PTP',
    type: 'COLLECTIONS_LATE',
    targetAudience: 'Commercial & business loans 31-89 DPD pre-NPA bracket',
    totalContacts: 680,
    completedCalls: 512,
    connectedRate: 78.4,
    conversionRate: 48.2,
    status: 'ACTIVE',
    pacing: 25,
    languages: ['Hinglish', 'Hindi', 'Marathi'],
    scheduleWindow: '10:00 - 18:00 (FPC Compliant)',
    avgDurationSec: 210
  },
  {
    id: 'cmp-4',
    name: 'Instant Voice-Guided KYC & V-CIP Assistance',
    type: 'KYC_ONBOARDING',
    targetAudience: 'Sanctioned applicants with pending CKYC / Bank verification',
    totalContacts: 850,
    completedCalls: 810,
    connectedRate: 95.3,
    conversionRate: 88.4,
    status: 'ACTIVE',
    pacing: 35,
    languages: ['English', 'Hindi', 'Kannada', 'Telugu'],
    scheduleWindow: '24/7 Inbound & Daytime Outbound',
    avgDurationSec: 135
  },
  {
    id: 'cmp-5',
    name: '24/7 Borrower Self-Service Care & Statement Desk',
    type: 'CUSTOMER_SUPPORT',
    targetAudience: 'Inbound callers requesting loan status, SOA, NOC, Foreclosure',
    totalContacts: 3100,
    completedCalls: 3085,
    connectedRate: 99.4,
    conversionRate: 93.8,
    status: 'ACTIVE',
    pacing: 80,
    languages: ['All Vernacular Indian Languages'],
    scheduleWindow: '24 Hours / 365 Days Uninterrupted',
    avgDurationSec: 98
  }
];

export const mockRunamargaCalls: RunamargaCallRecord[] = [
  {
    id: 'call-rn-101',
    callId: 'RN-LIVE-8041',
    phoneNumber: '+91 98451 28491',
    customerName: 'Rahul Verma',
    campaignType: 'LOAN_SALES',
    language: 'hinglish',
    direction: 'OUTBOUND',
    status: 'IN_PROGRESS',
    durationSeconds: 94,
    startTime: '2026-09-30 11:01:22',
    sentimentScore: 0.65,
    overallSentiment: 'RECEPTIVE',
    qaScore: 97,
    fpcCompliant: true,
    latencyMetrics: {
      totalMs: 545,
      asrMs: 115,
      llmMs: 240,
      ttsMs: 145,
      networkJitterMs: 45
    },
    extractedData: {
      loanAmount: 1500000,
      loanType: 'MSME Machinery Loan',
      tenorMonths: 36,
      monthlyIncome: 350000,
      panNumber: 'BHKPV4912K'
    },
    transcript: [
      {
        speaker: 'agent',
        text: 'Namaste Rahul ji, main Trueifincaplen Runamarga AI assistant baat kar rahi hoon. Aapne hamare portal par MSME business expansion loan ke liye inquiry submit ki thi. Kya main aapse 2 minute baat kar sakti hoon?',
        timestamp: '11:01:24',
        sentiment: 'POSITIVE',
        asrConfidence: 1.0
      },
      {
        speaker: 'customer',
        text: 'Haan bolo, mujhe textile machinery upgrade ke liye lagbhag pandrah lakh rupees chahiye the.',
        timestamp: '11:01:31',
        sentiment: 'RECEPTIVE',
        asrConfidence: 0.98,
        extractedEntities: { loanAmount: 1500000, purpose: 'Textile Machinery Upgrade' }
      },
      {
        speaker: 'agent',
        text: 'Bilkul Rahul ji! 15 Lakh tak ka machinery loan hamare paas 13.5% annual ROI par available hai. Aapke business ka monthly turnover lagbhag kitna hai?',
        timestamp: '11:01:37',
        sentiment: 'POSITIVE',
        asrConfidence: 1.0
      },
      {
        speaker: 'customer',
        text: 'Monthly turnover around 12 to 14 Lakhs rehta hai, aur net profit lagbhag साढ़े तीन लाख (3.5 Lakhs) hai.',
        timestamp: '11:01:47',
        sentiment: 'POSITIVE',
        asrConfidence: 0.97,
        extractedEntities: { monthlyTurnover: 1300000, monthlyProfit: 350000 }
      },
      {
        speaker: 'agent',
        text: 'Bahut badhiya! Is turnover par aapka loan instant pre-qualify ho raha hai. Tenure aap 3 saal (36 months) rakhna chahenge ya 5 saal?',
        timestamp: '11:01:53',
        sentiment: 'POSITIVE',
        asrConfidence: 1.0
      }
    ],
    outcome: 'LEAD_GENERATED',
    costInr: 2.85,
    relatedLeadId: 'lead-1'
  },
  {
    id: 'call-rn-102',
    callId: 'RN-LIVE-8042',
    phoneNumber: '+91 97230 45812',
    customerName: 'Suresh G. Patil',
    campaignType: 'COLLECTIONS_EARLY',
    language: 'hi-IN',
    direction: 'OUTBOUND',
    status: 'IN_PROGRESS',
    durationSeconds: 118,
    startTime: '2026-09-30 11:00:58',
    sentimentScore: 0.50,
    overallSentiment: 'POSITIVE',
    qaScore: 98,
    fpcCompliant: true,
    latencyMetrics: {
      totalMs: 610,
      asrMs: 125,
      llmMs: 270,
      ttsMs: 160,
      networkJitterMs: 55
    },
    extractedData: {
      ptpDate: '2026-10-01',
      ptpAmount: 24500,
      ptpMode: 'UPI Instant Mandate',
      paymentLinkDispatched: true
    },
    transcript: [
      {
        speaker: 'agent',
        text: 'Namaste Suresh ji. Main Fincaplen NBFC se automated voice desk se call kar raha hoon. Aapke commercial vehicle loan account par September month ki EMI ₹24,500 due date cross kar chuki hai. Kya main jaan sakta hoon kab tak clear ho jayegi?',
        timestamp: '11:01:02',
        sentiment: 'NEUTRAL',
        asrConfidence: 1.0
      },
      {
        speaker: 'customer',
        text: 'Haan sir, kal mera client se payment aane wala hai. Main kal shaam tak har haal mein pay kar dunga.',
        timestamp: '11:01:14',
        sentiment: 'RECEPTIVE',
        asrConfidence: 0.99,
        extractedEntities: { ptpCommitment: 'Tomorrow evening', ptpDate: '2026-10-01' }
      },
      {
        speaker: 'agent',
        text: 'Samajh gaya Suresh ji. Maine aapka Promise to Pay kal shaam 5 baje ke liye note kar liya hai. Kya main abhi aapke WhatsApp par zero-convenience-fee UPI payment link bhej doon?',
        timestamp: '11:01:21',
        sentiment: 'POSITIVE',
        asrConfidence: 1.0
      },
      {
        speaker: 'customer',
        text: 'Haan please bhej dijiye, main link aate hi kal pay karke screenshot upload kar dunga.',
        timestamp: '11:01:29',
        sentiment: 'POSITIVE',
        asrConfidence: 0.96,
        extractedEntities: { consentLink: true }
      }
    ],
    outcome: 'PTP_CAPTURED',
    costInr: 3.40,
    relatedLoanId: 'loan-3'
  },
  {
    id: 'call-rn-103',
    callId: 'RN-HIST-7920',
    phoneNumber: '+91 94440 19283',
    customerName: 'Ananya Sundaram',
    campaignType: 'PRE_DISBURSEMENT',
    language: 'en-IN',
    direction: 'OUTBOUND',
    status: 'COMPLETED',
    durationSeconds: 154,
    startTime: '2026-09-30 10:45:10',
    endTime: '2026-09-30 10:47:44',
    sentimentScore: 0.88,
    overallSentiment: 'POSITIVE',
    qaScore: 100,
    fpcCompliant: true,
    latencyMetrics: {
      totalMs: 580,
      asrMs: 110,
      llmMs: 250,
      ttsMs: 170,
      networkJitterMs: 50
    },
    extractedData: {
      loanAmount: 750000,
      tenorMonths: 24,
      kycConfirmed: true,
      aadhaarMasked: 'XXXX-XXXX-4921',
      panNumber: 'AQZPS9021M',
      customerConsentTimestamp: '2026-09-30T10:47:15Z'
    },
    transcript: [
      {
        speaker: 'agent',
        text: 'Good morning Ms. Ananya Sundaram. This is Trueifincaplen automated welcome and pre-disbursement verification. Your sanctioned loan of ₹7,50,000 is ready for direct bank disbursement. May I quickly verify your loan terms with you?',
        timestamp: '10:45:12',
        sentiment: 'POSITIVE',
        asrConfidence: 1.0
      },
      {
        speaker: 'customer',
        text: 'Yes please, go ahead.',
        timestamp: '10:45:18',
        sentiment: 'POSITIVE',
        asrConfidence: 0.99
      },
      {
        speaker: 'agent',
        text: 'Your sanctioned amount is ₹7,50,000 at 12.0% per annum for a 24-month tenure, resulting in an EMI of ₹35,308 commencing 5th of November. Do you accept these terms?',
        timestamp: '10:45:25',
        sentiment: 'POSITIVE',
        asrConfidence: 1.0
      },
      {
        speaker: 'customer',
        text: 'Yes, I fully accept the repayment terms and the EMI date.',
        timestamp: '10:45:34',
        sentiment: 'POSITIVE',
        asrConfidence: 0.98,
        extractedEntities: { termsAccepted: true }
      },
      {
        speaker: 'agent',
        text: 'For RBI compliance, please confirm the last 4 digits of your linked Aadhaar and your registered bank name.',
        timestamp: '10:45:41',
        sentiment: 'POSITIVE',
        asrConfidence: 1.0
      },
      {
        speaker: 'customer',
        text: 'Last four digits are 4921, and the account is with HDFC Bank Koramangala branch.',
        timestamp: '10:45:51',
        sentiment: 'POSITIVE',
        asrConfidence: 0.99,
        extractedEntities: { aadhaarLast4: '4921', bank: 'HDFC Bank' }
      },
      {
        speaker: 'agent',
        text: 'Verification complete and cryptographically logged. Your disbursement order has been queued for immediate NEFT transfer. Thank you!',
        timestamp: '10:46:02',
        sentiment: 'POSITIVE',
        asrConfidence: 1.0
      }
    ],
    outcome: 'KYC_VERIFIED',
    costInr: 3.90,
    relatedLoanId: 'loan-1',
    workflowDispatched: true
  },
  {
    id: 'call-rn-104',
    callId: 'RN-HIST-7918',
    phoneNumber: '+91 98110 93412',
    customerName: 'Vikramjit Malhotra',
    campaignType: 'COLLECTIONS_LATE',
    language: 'hinglish',
    direction: 'OUTBOUND',
    status: 'COMPLETED',
    durationSeconds: 198,
    startTime: '2026-09-30 10:20:00',
    endTime: '2026-09-30 10:23:18',
    sentimentScore: 0.25,
    overallSentiment: 'RECEPTIVE',
    qaScore: 96,
    fpcCompliant: true,
    latencyMetrics: {
      totalMs: 630,
      asrMs: 130,
      llmMs: 290,
      ttsMs: 155,
      networkJitterMs: 55
    },
    extractedData: {
      ptpDate: '2026-10-03',
      ptpAmount: 35000,
      ptpMode: 'NEFT Part Payment',
      disputeReason: 'Client delay in receivables payment',
      paymentLinkDispatched: true
    },
    transcript: [
      {
        speaker: 'agent',
        text: 'Namaste Mr. Vikramjit Malhotra. Main Trueifincaplen Collections Desk se Runamarga voice agent baat kar rahi hoon. Aapka loan account 38 din overdue ho gaya hai aur outstanding amount ₹68,200 hai. RBI SMA-1 guidelines ke anusaar hume iska immediate resolution karna hoga.',
        timestamp: '10:20:04',
        sentiment: 'NEUTRAL',
        asrConfidence: 1.0
      },
      {
        speaker: 'customer',
        text: 'Look, main bhaag nahi raha hoon. Meri supply payment delayed hai. Main poora 68k ek baar me nahi de sakta abhi.',
        timestamp: '10:20:18',
        sentiment: 'HESITANT',
        asrConfidence: 0.97
      },
      {
        speaker: 'agent',
        text: 'Hum aapki business situation samajhte hain Vikramjit ji. Kya aap is Friday tak ₹35,000 ka part payment karke apne account ko standard stage me protect rakhna chahenge? Remaining balance aap 15th tak settle kar sakte hain.',
        timestamp: '10:20:29',
        sentiment: 'POSITIVE',
        asrConfidence: 1.0
      },
      {
        speaker: 'customer',
        text: 'Theek hai, 3rd October Friday tak main ₹35,000 NEFT transfer kar dunga. Baki 10th tak pakka ho jayega.',
        timestamp: '10:20:42',
        sentiment: 'RECEPTIVE',
        asrConfidence: 0.98,
        extractedEntities: { partPtpAmount: 35000, ptpDate: '2026-10-03', secondInstallmentDate: '2026-10-10' }
      },
      {
        speaker: 'agent',
        text: 'Bahut dhanyavaad Vikramjit ji! Maine Friday 3rd October ke liye ₹35,000 ka structured PTP confirm kar diya hai. SMS par transaction reference details bhej di gayi hain.',
        timestamp: '10:20:54',
        sentiment: 'POSITIVE',
        asrConfidence: 1.0
      }
    ],
    outcome: 'PTP_CAPTURED',
    costInr: 4.80,
    relatedLoanId: 'loan-3',
    workflowDispatched: true
  },
  {
    id: 'call-rn-105',
    callId: 'RN-HIST-7905',
    phoneNumber: '+91 99080 34129',
    customerName: 'Kavita Reddy',
    campaignType: 'CUSTOMER_SUPPORT',
    language: 'en-IN',
    direction: 'INBOUND',
    status: 'COMPLETED',
    durationSeconds: 102,
    startTime: '2026-09-30 09:55:12',
    endTime: '2026-09-30 09:56:54',
    sentimentScore: 0.95,
    overallSentiment: 'POSITIVE',
    qaScore: 100,
    fpcCompliant: true,
    latencyMetrics: {
      totalMs: 510,
      asrMs: 105,
      llmMs: 220,
      ttsMs: 140,
      networkJitterMs: 45
    },
    extractedData: {
      supportIssueResolved: true,
      loanType: 'Home Loan HL-2024-88',
      monthlyIncome: 0
    },
    transcript: [
      {
        speaker: 'customer',
        text: 'Hi, I need to know my outstanding loan balance and the procedure to obtain a provisional interest certificate for IT tax filing.',
        timestamp: '09:55:14',
        sentiment: 'NEUTRAL',
        asrConfidence: 0.99
      },
      {
        speaker: 'agent',
        text: 'Welcome to Trueifincaplen 24/7 Voice Care. As per your registered mobile number, for Home Loan account ending in 88, your current principal balance is ₹3,42,100. I have generated your provisional Section 24 interest certificate right now. Would you like me to send it to your email or WhatsApp?',
        timestamp: '09:55:22',
        sentiment: 'POSITIVE',
        asrConfidence: 1.0
      },
      {
        speaker: 'customer',
        text: 'Please send to my WhatsApp. That was amazingly fast!',
        timestamp: '09:55:31',
        sentiment: 'POSITIVE',
        asrConfidence: 0.98
      },
      {
        speaker: 'agent',
        text: 'Sent! The PDF certificate has been delivered to your WhatsApp. Is there anything else I can assist you with today?',
        timestamp: '09:55:38',
        sentiment: 'POSITIVE',
        asrConfidence: 1.0
      },
      {
        speaker: 'customer',
        text: 'No, that is all. Thank you so much!',
        timestamp: '09:55:44',
        sentiment: 'POSITIVE',
        asrConfidence: 0.99
      }
    ],
    outcome: 'INQUIRY_RESOLVED',
    costInr: 2.10,
    workflowDispatched: true
  },
  {
    id: 'call-rn-106',
    callId: 'RN-HIST-7890',
    phoneNumber: '+91 98201 84930',
    customerName: 'Deepak Sharma',
    campaignType: 'COLLECTIONS_EARLY',
    language: 'hi-IN',
    direction: 'OUTBOUND',
    status: 'COMPLETED',
    durationSeconds: 142,
    startTime: '2026-09-30 09:30:15',
    endTime: '2026-09-30 09:32:37',
    sentimentScore: -0.30,
    overallSentiment: 'DISTRESSED',
    qaScore: 98,
    fpcCompliant: true,
    latencyMetrics: {
      totalMs: 595,
      asrMs: 120,
      llmMs: 260,
      ttsMs: 165,
      networkJitterMs: 50
    },
    extractedData: {
      hardshipFlag: true,
      disputeReason: 'Medical emergency hospitalization of spouse',
      ptpMode: 'Hardship Restructuring Committee'
    },
    transcript: [
      {
        speaker: 'agent',
        text: 'Namaste Deepak ji. Fincaplen automated desk se reminder call hai aapke personal loan EMI ₹12,800 ke sandarbh mein.',
        timestamp: '09:30:17',
        sentiment: 'NEUTRAL',
        asrConfidence: 1.0
      },
      {
        speaker: 'customer',
        text: 'Bhaiya meri wife hospital mein admit hai ICU mein. Saare paise wahan lag gaye hain, main abhi bilkul pareshan hoon.',
        timestamp: '09:30:28',
        sentiment: 'DISTRESSED',
        asrConfidence: 0.98,
        extractedEntities: { hardshipDeclared: 'Medical Emergency' }
      },
      {
        speaker: 'agent',
        text: 'Deepak ji, hum aapki situation ke prati poori tarah sahanubhuti vyakt karte hain. Hum turant aapke collection calls 15 dino ke liye pause kar rahe hain aur aapka case hamari Customer Grievance & Hardship Committee ko forward kar rahe hain taaki aapko EMI moratorium ya restructuring mil sake. Kripya aap patient par dhyaan dijiye.',
        timestamp: '09:30:42',
        sentiment: 'POSITIVE',
        asrConfidence: 1.0
      },
      {
        speaker: 'customer',
        text: 'Thank you bhaiya, thank you for understanding.',
        timestamp: '09:30:52',
        sentiment: 'RECEPTIVE',
        asrConfidence: 0.99
      }
    ],
    outcome: 'HARDSHIP_ESCALATED',
    costInr: 3.20,
    workflowDispatched: true
  },
  {
    id: 'call-rn-107',
    callId: 'RN-HIST-7872',
    phoneNumber: '+91 97654 32109',
    customerName: 'Gaurav Joshi',
    campaignType: 'LOAN_SALES',
    language: 'hinglish',
    direction: 'OUTBOUND',
    status: 'COMPLETED',
    durationSeconds: 180,
    startTime: '2026-09-30 09:10:04',
    endTime: '2026-09-30 09:13:04',
    sentimentScore: 0.85,
    overallSentiment: 'POSITIVE',
    qaScore: 99,
    fpcCompliant: true,
    latencyMetrics: {
      totalMs: 560,
      asrMs: 110,
      llmMs: 250,
      ttsMs: 155,
      networkJitterMs: 45
    },
    extractedData: {
      loanAmount: 2500000,
      loanType: 'Business Loan',
      tenorMonths: 48,
      monthlyIncome: 650000,
      panNumber: 'ABCPJ8123G'
    },
    transcript: [
      {
        speaker: 'agent',
        text: 'Good morning Gaurav ji. This is Runamarga AI from Trueifincaplen. You showed interest in our Business Expansion Term Loan. I am calling to help you complete your pre-sanction assessment.',
        timestamp: '09:10:06',
        sentiment: 'POSITIVE',
        asrConfidence: 1.0
      },
      {
        speaker: 'customer',
        text: 'Yes! We are setting up a second cloud kitchen facility in Pune. We need around 25 Lakhs for 4 years.',
        timestamp: '09:10:19',
        sentiment: 'POSITIVE',
        asrConfidence: 0.98,
        extractedEntities: { loanAmount: 2500000, tenor: 48, purpose: 'Cloud Kitchen Facility' }
      },
      {
        speaker: 'agent',
        text: 'Excellent! Based on your GST filings and monthly cashflow of ₹6.5 Lakhs, your pre-approved ROI is 12.75%. I have created your LOS loan application directly in our system (App ID: APP-MSME-9912). You will receive a document upload link right now.',
        timestamp: '09:10:35',
        sentiment: 'POSITIVE',
        asrConfidence: 1.0
      },
      {
        speaker: 'customer',
        text: 'Awesome, that was seamless. I will upload our 6 months bank statement today.',
        timestamp: '09:10:46',
        sentiment: 'POSITIVE',
        asrConfidence: 0.99
      }
    ],
    outcome: 'LEAD_GENERATED',
    costInr: 4.10,
    workflowDispatched: true
  },
  {
    id: 'call-rn-108',
    callId: 'RN-HIST-7855',
    phoneNumber: '+91 98234 56781',
    customerName: 'Mohammed Tariq',
    campaignType: 'COLLECTIONS_EARLY',
    language: 'hinglish',
    direction: 'OUTBOUND',
    status: 'COMPLETED',
    durationSeconds: 125,
    startTime: '2026-09-30 08:45:00',
    endTime: '2026-09-30 08:47:05',
    sentimentScore: 0.70,
    overallSentiment: 'POSITIVE',
    qaScore: 97,
    fpcCompliant: true,
    latencyMetrics: {
      totalMs: 540,
      asrMs: 110,
      llmMs: 235,
      ttsMs: 150,
      networkJitterMs: 45
    },
    extractedData: {
      ptpDate: '2026-09-30',
      ptpAmount: 18900,
      ptpMode: 'Instant UPI WhatsApp',
      paymentLinkDispatched: true
    },
    transcript: [
      {
        speaker: 'agent',
        text: 'Namaste Tariq ji. Trueifincaplen automated reminder desk. Aapki vehicle finance EMI ₹18,900 due date par bounce ho gayi thi technical reason se.',
        timestamp: '08:45:03',
        sentiment: 'NEUTRAL',
        asrConfidence: 1.0
      },
      {
        speaker: 'customer',
        text: 'Haan wo account mein balance late transfer hua tha. Main abhi turant pay karna chahta hoon.',
        timestamp: '08:45:15',
        sentiment: 'POSITIVE',
        asrConfidence: 0.98
      },
      {
        speaker: 'agent',
        text: 'Main abhi aapke WhatsApp par instant payment link trigger kar rahi hoon. Ek click mein GPay ya PhonePe se payment ho jayega bina kisi late charge ke.',
        timestamp: '08:45:22',
        sentiment: 'POSITIVE',
        asrConfidence: 1.0
      },
      {
        speaker: 'customer',
        text: 'Mil gaya link WhatsApp pe. Pay kar diya maine right now!',
        timestamp: '08:45:39',
        sentiment: 'POSITIVE',
        asrConfidence: 0.99,
        extractedEntities: { paymentCompleted: true }
      },
      {
        speaker: 'agent',
        text: 'Payment received! Receipt reference TXN-994821 generated and posted to your ledger. Thank you Tariq ji!',
        timestamp: '08:45:48',
        sentiment: 'POSITIVE',
        asrConfidence: 1.0
      }
    ],
    outcome: 'PAYMENT_LINK_SENT',
    costInr: 2.95,
    workflowDispatched: true
  },
  {
    id: 'call-rn-109',
    callId: 'RN-HIST-7830',
    phoneNumber: '+91 99123 45678',
    customerName: 'Meera Iyer',
    campaignType: 'KYC_ONBOARDING',
    language: 'en-IN',
    direction: 'OUTBOUND',
    status: 'COMPLETED',
    durationSeconds: 140,
    startTime: '2026-09-30 08:35:10',
    endTime: '2026-09-30 08:37:30',
    sentimentScore: 0.80,
    overallSentiment: 'POSITIVE',
    qaScore: 98,
    fpcCompliant: true,
    latencyMetrics: {
      totalMs: 565,
      asrMs: 115,
      llmMs: 245,
      ttsMs: 160,
      networkJitterMs: 45
    },
    extractedData: {
      kycConfirmed: true,
      panNumber: 'AYZPM8821R',
      aadhaarMasked: 'XXXX-XXXX-9912'
    },
    transcript: [
      {
        speaker: 'agent',
        text: 'Hello Ms. Meera Iyer. Calling from Trueifincaplen digital onboarding. We need 60 seconds to verify your PAN and registered residential address to activate your credit line.',
        timestamp: '08:35:12',
        sentiment: 'POSITIVE',
        asrConfidence: 1.0
      },
      {
        speaker: 'customer',
        text: 'Sure, I am ready.',
        timestamp: '08:35:18',
        sentiment: 'POSITIVE',
        asrConfidence: 0.99
      },
      {
        speaker: 'agent',
        text: 'Please confirm your permanent account number (PAN).',
        timestamp: '08:35:24',
        sentiment: 'POSITIVE',
        asrConfidence: 1.0
      },
      {
        speaker: 'customer',
        text: 'It is A-Y-Z-P-M 8-8-2-1 R.',
        timestamp: '08:35:34',
        sentiment: 'POSITIVE',
        asrConfidence: 0.98,
        extractedEntities: { panNumber: 'AYZPM8821R' }
      },
      {
        speaker: 'agent',
        text: 'PAN verified against NSDL repository. Your digital KYC is approved and your sanction letter is ready to download.',
        timestamp: '08:35:45',
        sentiment: 'POSITIVE',
        asrConfidence: 1.0
      }
    ],
    outcome: 'KYC_VERIFIED',
    costInr: 3.10,
    workflowDispatched: true
  },
  {
    id: 'call-rn-110',
    callId: 'RN-HIST-7811',
    phoneNumber: '+91 98450 12890',
    customerName: 'Sunil Deshmukh',
    campaignType: 'COLLECTIONS_LATE',
    language: 'mr-IN',
    direction: 'OUTBOUND',
    status: 'TRANSFERRED_TO_HUMAN',
    durationSeconds: 160,
    startTime: '2026-09-29 17:15:00',
    endTime: '2026-09-29 17:17:40',
    sentimentScore: -0.45,
    overallSentiment: 'FRUSTRATED',
    qaScore: 94,
    fpcCompliant: true,
    latencyMetrics: {
      totalMs: 640,
      asrMs: 135,
      llmMs: 285,
      ttsMs: 170,
      networkJitterMs: 50
    },
    extractedData: {
      disputeReason: 'Contesting overdue bounce charges calculation',
      ptpMode: 'Escalated to Senior Grievance Nodal Officer'
    },
    transcript: [
      {
        speaker: 'agent',
        text: 'Namaskar Sunil ji. Trueifincaplen NBFC kadun aplyala call ahe. Aplya loan account var ₹42,000 overdue ahe.',
        timestamp: '17:15:05',
        sentiment: 'NEUTRAL',
        asrConfidence: 1.0
      },
      {
        speaker: 'customer',
        text: 'Mala tumchya late fee charges manzoor nahit. Bank mandate chuki mule bounce zala, maajhi chuk navhati.',
        timestamp: '17:15:20',
        sentiment: 'FRUSTRATED',
        asrConfidence: 0.96
      },
      {
        speaker: 'agent',
        text: 'Aamhi samju shakto Sunil ji. Aplya dispute chi nond ghetli ahe. Apanla right assistance milnyasathi, mi ha call amchya Senior Grievance Officer kade transfer karat ahe. Kripya 20 second line var raha.',
        timestamp: '17:15:35',
        sentiment: 'POSITIVE',
        asrConfidence: 1.0
      }
    ],
    outcome: 'DISPUTED',
    costInr: 3.65
  }
];

// ==========================================
// OMNIWORKSPACE (OASIS WORKSPACE STANDARDS) MOCK DATA
// ==========================================

export const mockWorkspaceCustomers: WorkspaceCustomer[] = [
  {
    id: 'wcust-1',
    code: 'CUST-AERO-01',
    name: 'Apex Aerospace Solutions',
    industry: 'Aviation & Defense Systems',
    contactPerson: 'David Vance',
    email: 'd.vance@apexaero.com',
    phone: '+1 (555) 349-8812',
    activeProjectsCount: 4,
    slaCompliancePct: 98.6,
    totalContractValue: 2450000,
    status: 'ACTIVE',
    tier: 'Enterprise',
    region: 'North America (East)'
  },
  {
    id: 'wcust-2',
    code: 'CUST-MED-02',
    name: 'BioVanguard Health Dynamics',
    industry: 'Healthcare Diagnostics & Devices',
    contactPerson: 'Elena Rostova',
    email: 'e.rostova@biovanguard.org',
    phone: '+44 20 7946 0918',
    activeProjectsCount: 3,
    slaCompliancePct: 95.2,
    totalContractValue: 1820000,
    status: 'ACTIVE',
    tier: 'Strategic',
    region: 'EMEA (UK & Ireland)'
  },
  {
    id: 'wcust-3',
    code: 'CUST-FIN-03',
    name: 'Meridian Capital Core Group',
    industry: 'Banking & Financial Infrastructure',
    contactPerson: 'Rajesh Subramanian',
    email: 'r.subramanian@meridiancap.net',
    phone: '+91 22 6123 4500',
    activeProjectsCount: 5,
    slaCompliancePct: 100.0,
    totalContractValue: 3900000,
    status: 'ACTIVE',
    tier: 'Enterprise',
    region: 'APAC (Mumbai)'
  },
  {
    id: 'wcust-4',
    code: 'CUST-AUTO-04',
    name: 'NexDrive EV Powertrains',
    industry: 'Automotive & Clean Energy',
    contactPerson: 'Sophie Dubois',
    email: 's.dubois@nexdrive-ev.de',
    phone: '+49 89 2030 4410',
    activeProjectsCount: 2,
    slaCompliancePct: 91.8,
    totalContractValue: 975000,
    status: 'ONBOARDING',
    tier: 'Strategic',
    region: 'Central Europe'
  }
];

export const mockWorkspaceSuppliers: WorkspaceSupplier[] = [
  {
    id: 'wsupp-1',
    code: 'SUPP-FAB-101',
    name: 'Titan Precision CNC & Tooling Ltd',
    category: 'High-Precision Machining',
    rating: 4.9,
    onTimeDeliveryPct: 97.4,
    contactPerson: 'Markus Weber',
    email: 'm.weber@titanprecision.com',
    phone: '+1 (555) 782-9901',
    certifications: ['ISO 9001:2015', 'AS9100D (Aerospace)', 'ITAR Compliant'],
    openOrdersCount: 6,
    complianceStatus: 'CERTIFIED',
    country: 'United States'
  },
  {
    id: 'wsupp-2',
    code: 'SUPP-ELEC-202',
    name: 'Apex Semiconductor & SMT Fab',
    category: 'Electronic Components & SMT',
    rating: 4.7,
    onTimeDeliveryPct: 94.8,
    contactPerson: 'Lin Chen',
    email: 'lchen@apexsemicon.tw',
    phone: '+886 3 578 8899',
    certifications: ['ISO 14001', 'IATF 16949', 'RoHS / REACH Compliant'],
    openOrdersCount: 8,
    complianceStatus: 'CERTIFIED',
    country: 'Taiwan'
  },
  {
    id: 'wsupp-3',
    code: 'SUPP-LOG-303',
    name: 'Vanguard Global Freight & Logistics',
    category: 'Cold-Chain & Freight Forwarding',
    rating: 4.5,
    onTimeDeliveryPct: 92.1,
    contactPerson: 'Carla Mendez',
    email: 'c.mendez@vanguardfreight.com',
    phone: '+1 (555) 670-3321',
    certifications: ['C-TPAT Tier 3', 'AEO Certified', 'IATA Cargo Agent'],
    openOrdersCount: 4,
    complianceStatus: 'CERTIFIED',
    country: 'Panama / Global'
  },
  {
    id: 'wsupp-4',
    code: 'SUPP-QA-404',
    name: 'CertifyPro Global Metrology Labs',
    category: 'Testing & Third-Party Inspection',
    rating: 4.8,
    onTimeDeliveryPct: 99.0,
    contactPerson: 'Dr. Aris Thorne',
    email: 'a.thorne@certifypro-labs.ch',
    phone: '+41 22 819 0044',
    certifications: ['ISO/IEC 17025', 'NIST Traceable'],
    openOrdersCount: 2,
    complianceStatus: 'CERTIFIED',
    country: 'Switzerland'
  }
];

export const mockWorkspaceProjects: WorkspaceProject[] = [
  {
    id: 'wproj-1',
    code: 'PRJ-2026-AVION',
    name: 'Next-Gen Avionics Sensor Assembly Suite',
    category: 'Qualifying Federal & Aerospace',
    customerId: 'wcust-1',
    customerName: 'Apex Aerospace Solutions',
    supplierId: 'wsupp-1',
    supplierName: 'Titan Precision CNC & Tooling Ltd',
    stage: 'in_progress',
    priority: 'urgent',
    progressPct: 68,
    startDate: '2026-08-01',
    dueDate: '2026-11-30',
    ownerName: 'Sarah Jenkins (Lead Systems PM)',
    budget: 850000,
    currency: 'USD',
    tags: ['AS9100D', 'Mil-Spec', 'Critical Path'],
    description: 'Design, precision fabrication, environmental qualification and full documentation submission for multi-band sensor housing.',
    qualifyingProjectCode: 'OASIS-QP-AVION-884'
  },
  {
    id: 'wproj-2',
    code: 'PRJ-2026-DIAG',
    name: 'ISO 13485 Microfluidic Cartridge Tooling',
    category: 'Medical Device Manufacturing',
    customerId: 'wcust-2',
    customerName: 'BioVanguard Health Dynamics',
    supplierId: 'wsupp-2',
    supplierName: 'Apex Semiconductor & SMT Fab',
    stage: 'review',
    priority: 'high',
    progressPct: 88,
    startDate: '2026-07-15',
    dueDate: '2026-10-31',
    ownerName: 'Liam Chen (QA Program Director)',
    budget: 420000,
    currency: 'USD',
    tags: ['Cleanroom Class 7', 'FDA 21 CFR 820', 'Bio-Compatible'],
    description: 'High-throughput microfluidic disposable cartridge tooling qualification with full material biocompatibility dossier.',
    qualifyingProjectCode: 'OASIS-QP-MED-312'
  },
  {
    id: 'wproj-3',
    code: 'PRJ-2026-FIN-GATE',
    name: 'Enterprise Core Ledger Gateway Modernization',
    category: 'Enterprise Fintech & Treasury',
    customerId: 'wcust-3',
    customerName: 'Meridian Capital Core Group',
    stage: 'planning',
    priority: 'high',
    progressPct: 35,
    startDate: '2026-09-01',
    dueDate: '2027-02-28',
    ownerName: 'Amit Patel (Fintech Architect)',
    budget: 1200000,
    currency: 'USD',
    tags: ['ISO 20022', 'PCI-DSS v4', 'SWIFT MX'],
    description: 'Unified multi-entity ledger synchronization gateway with sub-second reconciliations and ISO 20022 compliance.',
    qualifyingProjectCode: 'OASIS-QP-FIN-901'
  },
  {
    id: 'wproj-4',
    code: 'PRJ-2026-EV-THERM',
    name: 'Battery Pack Liquid Cold Plate Die Casting',
    category: 'Clean Energy & Automotive',
    customerId: 'wcust-4',
    customerName: 'NexDrive EV Powertrains',
    supplierId: 'wsupp-1',
    supplierName: 'Titan Precision CNC & Tooling Ltd',
    stage: 'backlog',
    priority: 'medium',
    progressPct: 15,
    startDate: '2026-10-01',
    dueDate: '2027-04-15',
    ownerName: 'Carlos Moreno (Mechanical Lead)',
    budget: 310000,
    currency: 'EUR',
    tags: ['Automotive Aluminum 6063', 'Leak-Tight Helium Tested'],
    description: 'Thermal cold plate tooling design and helium leak verification for 800V EV traction battery module.'
  }
];

export const mockWorkspaceTasks: WorkspaceTask[] = [
  {
    id: 'wtsk-101',
    projectId: 'wproj-1',
    projectCode: 'PRJ-2026-AVION',
    title: 'First Article Inspection (FAI) Report Sign-off',
    assignee: 'Markus Weber',
    status: 'in_progress',
    priority: 'urgent',
    dueDate: '2026-10-22',
    estimatedHours: 24,
    actualHours: 18,
    checklistItems: [
      { id: 'chk-1', text: 'Calibrate CMM Coordinate Measuring Machine', done: true },
      { id: 'chk-2', text: 'Perform 100% optical dimensional inspection on Critical Dimensions', done: true },
      { id: 'chk-3', text: 'Obtain Metallurgical Material Mill Test Report (MTR)', done: true },
      { id: 'chk-4', text: 'Upload Form 1 AS9102 to DMS with Lead QA Digital E-Signature', done: false }
    ],
    workflowRule: 'Requires AS9100 Certified Auditor E-Signature before Stage Gate progression'
  },
  {
    id: 'wtsk-102',
    projectId: 'wproj-1',
    projectCode: 'PRJ-2026-AVION',
    title: 'Thermal Vacuum Chamber Qualification Protocol',
    assignee: 'Dr. Aris Thorne',
    status: 'todo',
    priority: 'high',
    dueDate: '2026-10-28',
    estimatedHours: 40,
    actualHours: 0,
    checklistItems: [
      { id: 'chk-5', text: 'Install cryogenic sensors on baseplate', done: false },
      { id: 'chk-6', text: 'Cycle temperature -55°C to +125°C for 24 cycles', done: false },
      { id: 'chk-7', text: 'Continuous telemetry capture via DAQ unit', done: false }
    ],
    workflowRule: 'Third-party testing laboratory verification required'
  },
  {
    id: 'wtsk-103',
    projectId: 'wproj-2',
    projectCode: 'PRJ-2026-DIAG',
    title: 'Biocompatibility Cytotoxicity Report Verification (ISO 10993-5)',
    assignee: 'Elena Rostova',
    status: 'review',
    priority: 'high',
    dueDate: '2026-10-20',
    estimatedHours: 16,
    actualHours: 14,
    checklistItems: [
      { id: 'chk-8', text: 'Examine in vitro L929 cell lysis results', done: true },
      { id: 'chk-9', text: 'Confirm non-cytotoxic grade (Grade 0 / <20% inhibition)', done: true },
      { id: 'chk-10', text: 'Attach certified tox report to submission bundle', done: true }
    ],
    workflowRule: 'Client Principal Investigator approval mandatory'
  },
  {
    id: 'wtsk-104',
    projectId: 'wproj-3',
    projectCode: 'PRJ-2026-FIN-GATE',
    title: 'ISO 20022 Schema Validator & SWIFT MX Mapping',
    assignee: 'Amit Patel',
    status: 'in_progress',
    priority: 'high',
    dueDate: '2026-11-05',
    estimatedHours: 60,
    actualHours: 32,
    checklistItems: [
      { id: 'chk-11', text: 'Map pacs.008 customer credit transfer schema', done: true },
      { id: 'chk-12', text: 'Map pacs.009 financial institution transfer', done: true },
      { id: 'chk-13', text: 'End-to-end sandbox payload test with SWIFT Alliance Gateway', done: false }
    ],
    workflowRule: 'Double-sign by Chief Security Officer and Lead Developer'
  },
  {
    id: 'wtsk-105',
    projectId: 'wproj-2',
    projectCode: 'PRJ-2026-DIAG',
    title: 'Final Production Master Mold Tool Acceptance',
    assignee: 'Lin Chen',
    status: 'done',
    priority: 'urgent',
    dueDate: '2026-10-10',
    estimatedHours: 30,
    actualHours: 28,
    checklistItems: [
      { id: 'chk-14', text: 'Perform 500-shot trial mold run', done: true },
      { id: 'chk-15', text: 'Cleanroom Class 7 particulate count verified', done: true },
      { id: 'chk-16', text: 'Client engineering sign-off issued', done: true }
    ]
  }
];

export const mockWorkspaceDocuments: WorkspaceDocument[] = [
  {
    id: 'wdoc-1',
    docNumber: 'DOC-2026-AS9102-001',
    title: 'First Article Inspection Report (AS9102 Rev B)',
    category: 'qa_certificate',
    version: 'v2.0',
    fileType: 'pdf',
    fileSize: '4.8 MB',
    uploadDate: '2026-10-15',
    expiryDate: '2027-10-15',
    uploadedBy: 'Markus Weber (Titan Precision)',
    status: 'pending_approval',
    customerOrSupplierName: 'Apex Aerospace Solutions',
    associatedProjectId: 'wproj-1',
    eSignatures: [
      {
        signerName: 'Markus Weber',
        role: 'Supplier QA Inspector',
        signedAt: '2026-10-15 14:22:10 UTC',
        signatureHash: 'SHA256:8f9a2b4c7d0e1f3a5b7c9d1e3f5a7b9c'
      }
    ],
    tags: ['AS9102', 'FAI', 'ITAR', 'Form 1-3']
  },
  {
    id: 'wdoc-2',
    docNumber: 'DOC-2026-SOW-AVION',
    title: 'Master Statement of Work & Technical Spec Rev 4',
    category: 'contract',
    version: 'v4.1',
    fileType: 'pdf',
    fileSize: '12.4 MB',
    uploadDate: '2026-08-10',
    uploadedBy: 'Sarah Jenkins',
    status: 'approved',
    customerOrSupplierName: 'Apex Aerospace Solutions',
    associatedProjectId: 'wproj-1',
    eSignatures: [
      {
        signerName: 'David Vance',
        role: 'VP Procurement (Customer)',
        signedAt: '2026-08-12 18:05:00 UTC',
        signatureHash: 'SHA256:1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d'
      },
      {
        signerName: 'Sarah Jenkins',
        role: 'Executive Program Lead',
        signedAt: '2026-08-12 18:45:12 UTC',
        signatureHash: 'SHA256:7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e'
      }
    ],
    tags: ['Master SOW', 'Mil-Spec', 'Approved']
  },
  {
    id: 'wdoc-3',
    docNumber: 'DOC-2026-BIO-CYTO',
    title: 'GLP Cytotoxicity In-Vitro Assay Report ISO 10993',
    category: 'specification',
    version: 'v1.0',
    fileType: 'pdf',
    fileSize: '3.2 MB',
    uploadDate: '2026-10-12',
    uploadedBy: 'Dr. Aris Thorne',
    status: 'approved',
    customerOrSupplierName: 'BioVanguard Health Dynamics',
    associatedProjectId: 'wproj-2',
    eSignatures: [
      {
        signerName: 'Dr. Aris Thorne',
        role: 'Chief Metrologist',
        signedAt: '2026-10-13 09:30:15 UTC',
        signatureHash: 'SHA256:3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f'
      }
    ],
    tags: ['ISO 10993', 'GLP Compliant', 'Cytotoxicity']
  },
  {
    id: 'wdoc-4',
    docNumber: 'DOC-2026-CAD-HOUSING',
    title: '3D Solid Model & Tolerance Stack CAD Drawing',
    category: 'drawing',
    version: 'v3.2',
    fileType: 'dwg',
    fileSize: '28.6 MB',
    uploadDate: '2026-09-28',
    uploadedBy: 'Carlos Moreno',
    status: 'approved',
    customerOrSupplierName: 'NexDrive EV Powertrains',
    associatedProjectId: 'wproj-4',
    eSignatures: [],
    tags: ['CAD', 'GD&T', 'Tooling']
  },
  {
    id: 'wdoc-5',
    docNumber: 'DOC-2026-FIN-AUDIT',
    title: 'Form 15CA/CB Statutory Cross-Border Remittance Filing',
    category: 'financial',
    version: 'v1.1',
    fileType: 'pdf',
    fileSize: '1.9 MB',
    uploadDate: '2026-10-04',
    uploadedBy: 'Rekha Gupta (Accounting)',
    status: 'draft',
    customerOrSupplierName: 'Meridian Capital Core Group',
    associatedProjectId: 'wproj-3',
    eSignatures: [],
    tags: ['Tax Compliance', 'FEMA', 'Statutory']
  }
];

export const mockWorkspaceChannels: { id: string; name: string; description: string; unreadCount: number }[] = [
  { id: 'chan-aerospace', name: 'apex-avionics-sync', description: 'Customer & Supplier cross-coordination for Aerospace Sensor suite', unreadCount: 2 },
  { id: 'chan-procurement', name: 'global-suppliers-rfq', description: 'Procurement RFQs, tooling quotes, supplier audits and PO tracking', unreadCount: 0 },
  { id: 'chan-quality', name: 'qa-first-article-approvals', description: 'FAI, AS9100D, ISO 13485 test reports and sign-offs', unreadCount: 3 },
  { id: 'chan-executive', name: 'executive-portfolio-brief', description: 'Senior leadership workspace health, SLA breaches, and project gates', unreadCount: 0 }
];

export const mockWorkspaceChannelMessages: WorkspaceChannelMessage[] = [
  {
    id: 'wmsg-1',
    channelId: 'chan-aerospace',
    senderName: 'David Vance',
    senderRole: 'VP Procurement (Customer)',
    senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    timestamp: 'Today at 09:15 AM',
    message: 'Hello team, we have reviewed the revised CMM inspection data for PRJ-2026-AVION. The datum B tolerance is now within the ±0.005mm spec. Please upload the finalized AS9102 Form 1 so we can issue the Stage 3 sign-off.',
    attachments: [{ name: 'Apex_CMM_Verification_Notes.pdf', size: '1.2 MB', type: 'application/pdf' }]
  },
  {
    id: 'wmsg-2',
    channelId: 'chan-aerospace',
    senderName: 'Markus Weber',
    senderRole: 'Supplier Lead (Titan Precision)',
    senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    timestamp: 'Today at 09:42 AM',
    message: 'Acknowledged, David. We have uploaded DOC-2026-AS9102-001 into the Workspace DMS. My digital e-signature hash is verified. Ready for Sarah and your team’s final counter-signature.',
    attachments: []
  },
  {
    id: 'wmsg-3',
    channelId: 'chan-quality',
    senderName: 'Dr. Aris Thorne',
    senderRole: 'Chief Metrologist',
    senderAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
    timestamp: 'Yesterday at 04:30 PM',
    message: 'ISO 10993 cytotoxicity assay completed for BioVanguard cartridges. Report uploaded with zero adverse cellular reaction across all replicates. Passed with highest purity grade.',
    attachments: [{ name: 'Assay_Spectral_Curves.png', size: '2.4 MB', type: 'image/png' }]
  }
];

export const mockWorkspaceChecklists: WorkspaceChecklistSubmission[] = [
  {
    id: 'wchk-1',
    projectId: 'wproj-1',
    category: '1. Legal & Regulatory Qualification',
    itemTitle: 'Mutual Non-Disclosure Agreement (M-NDA)',
    requiredDocumentType: 'Executed Legal Agreement PDF',
    isSubmitted: true,
    isVerified: true,
    verifiedBy: 'Sunil Mehta (Legal Counsel)',
    verifiedAt: '2026-08-02',
    notes: 'Countersigned by both corporate officers'
  },
  {
    id: 'wchk-2',
    projectId: 'wproj-1',
    category: '1. Legal & Regulatory Qualification',
    itemTitle: 'ITAR & Export Control Classification (ECCN 9A004)',
    requiredDocumentType: 'Compliance Jurisdiction Assessment',
    isSubmitted: true,
    isVerified: true,
    verifiedBy: 'Sarah Jenkins',
    verifiedAt: '2026-08-05'
  },
  {
    id: 'wchk-3',
    projectId: 'wproj-1',
    category: '2. Technical & Quality Gates',
    itemTitle: 'AS9102 First Article Inspection (FAI) Dossier',
    requiredDocumentType: 'Forms 1, 2, and 3 with Mill Test Reports',
    isSubmitted: true,
    isVerified: false,
    notes: 'Under review by Customer QA director'
  },
  {
    id: 'wchk-4',
    projectId: 'wproj-1',
    category: '2. Technical & Quality Gates',
    itemTitle: 'Environmental Stress Screening (ESS) Thermal Log',
    requiredDocumentType: 'Calibrated DAQ Data Export (.CSV & Signed PDF)',
    isSubmitted: false,
    isVerified: false
  },
  {
    id: 'wchk-5',
    projectId: 'wproj-1',
    category: '3. Financial & Past Performance',
    itemTitle: 'Contractor Past Performance Evaluation (CPARS / References)',
    requiredDocumentType: 'Verifiable Customer Performance Evaluation',
    isSubmitted: true,
    isVerified: true,
    verifiedBy: 'Auditor Team',
    verifiedAt: '2026-08-15'
  }
];

export const mockWorkspaceAuditLogs: WorkspaceAuditLog[] = [
  {
    id: 'waud-1',
    timestamp: '2026-10-18 01:25:14',
    actor: 'Markus Weber (Titan Precision)',
    action: 'DOCUMENT_UPLOAD',
    targetType: 'DOCUMENT',
    description: 'Uploaded DOC-2026-AS9102-001 (AS9102 Rev B FAI Report) with digital cryptographic signature',
    ipAddress: '198.51.100.44'
  },
  {
    id: 'waud-2',
    timestamp: '2026-10-18 00:54:10',
    actor: 'Sarah Jenkins',
    action: 'STAGE_TRANSITION',
    targetType: 'PROJECT',
    description: 'Transitioned project PRJ-2026-AVION to stage "In Progress" with 68% milestone completion',
    ipAddress: '192.0.2.112'
  },
  {
    id: 'waud-3',
    timestamp: '2026-10-17 19:12:05',
    actor: 'David Vance',
    action: 'PORTAL_LOGIN',
    targetType: 'AUTH',
    description: 'Successful authenticated login via Enterprise Workspace Portal (Domain: TENANT-NORTH-AMERICA)',
    ipAddress: '203.0.113.89'
  },
  {
    id: 'waud-4',
    timestamp: '2026-10-17 16:40:22',
    actor: 'Elena Rostova',
    action: 'CHECKLIST_SIGN_OFF',
    targetType: 'TASK',
    description: 'Verified Biocompatibility Cytotoxicity Report Verification checklist for ISO 13485 dossier',
    ipAddress: '198.51.100.82'
  }
];

// ==========================================
// TAX AI COMPLIANCE MOCK DATA
// ==========================================

export const mockTaxComplianceItems: TaxComplianceItem[] = [
  {
    id: 'tci-1',
    taxType: 'GST',
    event: 'GSTR-3B Monthly Filing',
    period: 'October 2026',
    dueDate: '2026-11-20',
    status: 'UPCOMING',
    priority: 'HIGH'
  },
  {
    id: 'tci-2',
    taxType: 'TDS',
    event: 'TDS Payment (Section 194C)',
    period: 'October 2026',
    dueDate: '2026-11-07',
    status: 'DUE_SOON',
    priority: 'HIGH',
    estimatedPenalty: 500
  },
  {
    id: 'tci-3',
    taxType: 'INCOME_TAX',
    event: 'Advance Tax 3rd Installment',
    period: 'FY 2026-27',
    dueDate: '2026-12-15',
    status: 'UPCOMING',
    priority: 'MEDIUM'
  },
  {
    id: 'tci-4',
    taxType: 'ROC_FILING',
    event: 'Form AOC-4 (Annual Filing)',
    period: 'FY 2025-26',
    dueDate: '2026-10-30',
    status: 'OVERDUE',
    priority: 'HIGH',
    estimatedPenalty: 2500
  }
];

export const mockTaxRecords: TaxRecord[] = [
  {
    id: 'tr-1',
    taxType: 'GST',
    filingDate: '2026-10-18',
    financialYear: '2026-27',
    status: 'FILED',
    amount: 125000,
    arnNumber: 'AA271026001234E',
    attachments: ['GSTR-3B_Sep26.pdf'],
    notes: 'Filed within due date. ITC reconciled.'
  },
  {
    id: 'tr-2',
    taxType: 'TDS',
    filingDate: '2026-10-05',
    financialYear: '2026-27',
    status: 'VERIFIED',
    amount: 45000,
    attachments: ['TDS_Challan_281_Sep26.pdf'],
    notes: 'Verified by central tax cell.'
  }
];

export const mockTaxOptimizationSuggestions: TaxOptimizationSuggestion[] = [
  {
    id: 'tos-1',
    title: 'Maximize 80D (Health Insurance)',
    description: 'You have only utilized ₹15,000 out of ₹25,000 limit for self/family health insurance premiums.',
    estimatedSaving: 3120,
    category: '80D'
  },
  {
    id: 'tos-2',
    title: 'Business Expense Optimization',
    description: 'Home office utility bills can be claimed as business expenses for your consultancy income.',
    estimatedSaving: 12000,
    category: 'BUSINESS_EXPENSE'
  },
  {
    id: 'tos-3',
    title: 'NPS Tier 1 Contribution',
    description: 'Additional ₹50,000 deduction available under 80CCD(1B) beyond the 80C limit.',
    estimatedSaving: 15600,
    category: '80C'
  }
];

export const mockTaxChatHistory: TaxChatMessage[] = [
  {
    id: 'm-1',
    role: 'assistant',
    content: 'Hi! I am your AI Tax Compliance Agent, trained on Sarthak Ahuja’s financial frameworks. How can I help you streamline your taxes today?',
    timestamp: '2026-10-30 09:00:00'
  }
];

// ==========================================
// BUSINESS ASSISTANT MOCK DATA
// ==========================================

export const mockBusinessKpis: BusinessKpi[] = [
  { id: 'kpi-1', label: 'Portfolio Health', value: 94.2, target: 95, trend: 'up', unit: '%' },
  { id: 'kpi-2', label: 'Operational Efficiency', value: 82.5, target: 85, trend: 'up', unit: '%' },
  { id: 'kpi-3', label: 'Customer Retention', value: 91.8, target: 90, trend: 'neutral', unit: '%' },
  { id: 'kpi-4', label: 'Net Profit Margin', value: 18.4, target: 20, trend: 'down', unit: '%' },
];

export const mockBusinessStrategyGoals: BusinessStrategyGoal[] = [
  { id: 'bsg-1', title: 'Expand to 5 new rural branches', status: 'in_progress', priority: 'high', dueDate: '2027-03-31' },
  { id: 'bsg-2', title: 'Implement AI-driven underwriting', status: 'completed', priority: 'high', dueDate: '2026-09-30' },
  { id: 'bsg-3', title: 'Achieve ₹500Cr AUM', status: 'in_progress', priority: 'medium', dueDate: '2027-12-31' },
];

export const mockBusinessAssistantHistory: BusinessAssistantMessage[] = [
  {
    id: 'ba-m-1',
    role: 'assistant',
    content: 'Welcome back. I have analyzed your portfolio performance for October. We are seeing a slight increase in delinquency in the small-ticket business loan segment. Would you like to review the risk mitigation strategy?',
    timestamp: '2026-10-30 09:30:00'
  }
];

// ==========================================
// TRUEFINCAPLINCOOP (MULTI-STATE COOPERATIVE SOCIETY) MOCK DATA
// ==========================================

export const mockCoopMembers: CoopMember[] = [
  { id: 'cm-1', folioNumber: 'FOLIO-2026-001', employeeCode: 'EMP-1042', memberName: 'Rajesh Kumar Sharma', designation: 'Senior Accounts Officer', ddoCode: 'DDO-DEL-01', ddoName: 'Delhi Secretariat HQ', pan: 'ABCDE1234F', aadhaar: '481920384910', shareCount: 50, shareCapitalAmount: 50000, thriftBalance: 245000, monthlyThriftContribution: 3500, savingsBalance: 125000, admissionDate: '2024-04-12', retirementDate: '2035-06-30', status: 'Active', nomineeName: 'Sunita Sharma (Wife)', branch: 'Delhi Main Branch', phone: '9811223344' },
  { id: 'cm-2', folioNumber: 'FOLIO-2026-002', employeeCode: 'EMP-2088', memberName: 'Pooja V. Nair', designation: 'Assistant Director (Tech)', ddoCode: 'DDO-MUM-02', ddoName: 'Mumbai Western Division', pan: 'FGHIJ5678K', aadhaar: '918237465019', shareCount: 100, shareCapitalAmount: 100000, thriftBalance: 412000, monthlyThriftContribution: 5000, savingsBalance: 340000, admissionDate: '2024-05-18', retirementDate: '2038-11-30', status: 'Active', nomineeName: 'Ramesh Nair (Father)', branch: 'Mumbai Regional Branch', phone: '9822334455' },
  { id: 'cm-3', folioNumber: 'FOLIO-2026-003', employeeCode: 'EMP-3115', memberName: 'Vikramaditya Rao', designation: 'Systems Engineer', ddoCode: 'DDO-BLR-03', ddoName: 'Bangalore IT Directorate', pan: 'KLMNO9012P', aadhaar: '382910492810', shareCount: 25, shareCapitalAmount: 25000, thriftBalance: 98000, monthlyThriftContribution: 2500, savingsBalance: 45000, admissionDate: '2025-01-10', retirementDate: '2042-03-31', status: 'Active', nomineeName: 'Geetha Rao (Mother)', branch: 'Bangalore Central Branch', phone: '9833445566' },
  { id: 'cm-4', folioNumber: 'FOLIO-2026-004', employeeCode: 'EMP-1091', memberName: 'Anil Gupta', designation: 'Superintendent Engineer', ddoCode: 'DDO-DEL-01', ddoName: 'Delhi Secretariat HQ', pan: 'PQRST3456Y', aadhaar: '746192830491', shareCount: 75, shareCapitalAmount: 75000, thriftBalance: 318000, monthlyThriftContribution: 4000, savingsBalance: 210000, admissionDate: '2025-03-22', retirementDate: '2033-08-31', status: 'Active', nomineeName: 'Kavita Gupta (Wife)', branch: 'Delhi Main Branch', phone: '9844556677' },
];

export const mockCoopDeposits: CoopDeposit[] = [
  { id: 'cd-1', depositNumber: 'FD-2026-881', memberId: 'cm-1', memberName: 'Rajesh Kumar Sharma', depositType: 'Fixed Deposit (FD)', principalAmount: 500000, interestRate: 8.5, tenureMonths: 36, maturityDate: '2029-04-12', maturityAmount: 642000, status: 'Active' },
  { id: 'cd-2', depositNumber: 'RD-2026-104', memberId: 'cm-2', memberName: 'Pooja V. Nair', depositType: 'Recurring Deposit (RD)', principalAmount: 10000, interestRate: 8.0, tenureMonths: 24, maturityDate: '2027-11-18', maturityAmount: 262000, status: 'Active' },
  { id: 'cd-3', depositNumber: 'PIG-2026-092', memberId: 'cm-3', memberName: 'Vikramaditya Rao', depositType: 'Daily Pigmy Deposit', principalAmount: 500, interestRate: 6.5, tenureMonths: 12, maturityDate: '2027-01-10', maturityAmount: 195000, status: 'Active' },
  { id: 'cd-4', depositNumber: 'FD-2025-410', memberId: 'cm-4', memberName: 'Anil Gupta', depositType: 'Fixed Deposit (FD)', principalAmount: 1000000, interestRate: 9.0, tenureMonths: 60, maturityDate: '2030-03-22', maturityAmount: 1552969, status: 'Active' },
];

export const mockCoopLoans: CoopLoan[] = [
  { id: 'cl-1', loanAccountNo: 'ECCS-LN-2026-101', memberId: 'cm-1', memberName: 'Rajesh Kumar Sharma', ddoCode: 'DDO-DEL-01', loanScheme: 'Regular Member Loan', sanctionedAmount: 600000, outstandingPrincipal: 425000, interestRate: 10.5, tenureMonths: 60, emiAmount: 12896, disbursedDate: '2025-05-01', lastPaymentDate: '2026-10-18', surety1Name: 'Anil Gupta', surety2Name: 'Pooja V. Nair', dpdDays: 0, status: 'Active' },
  { id: 'cl-2', loanAccountNo: 'ECCS-LN-2026-102', memberId: 'cm-2', memberName: 'Pooja V. Nair', ddoCode: 'DDO-MUM-02', loanScheme: 'Surety Loan', sanctionedAmount: 350000, outstandingPrincipal: 210000, interestRate: 11.0, tenureMonths: 36, emiAmount: 11459, disbursedDate: '2025-09-10', lastPaymentDate: '2026-10-18', surety1Name: 'Rajesh Kumar Sharma', surety2Name: 'Vikramaditya Rao', dpdDays: 0, status: 'Active' },
  { id: 'cl-3', loanAccountNo: 'ECCS-LN-2026-103', memberId: 'cm-3', memberName: 'Vikramaditya Rao', ddoCode: 'DDO-BLR-03', loanScheme: 'Emergency Loan', sanctionedAmount: 100000, outstandingPrincipal: 68500, interestRate: 9.5, tenureMonths: 24, emiAmount: 4591, disbursedDate: '2026-01-15', lastPaymentDate: '2026-09-18', surety1Name: 'Pooja V. Nair', dpdDays: 31, status: 'NPA Watch' },
  { id: 'cl-4', loanAccountNo: 'ECCS-LN-2026-104', memberId: 'cm-4', memberName: 'Anil Gupta', ddoCode: 'DDO-DEL-01', loanScheme: 'Festival Advance', sanctionedAmount: 50000, outstandingPrincipal: 35000, interestRate: 8.0, tenureMonths: 10, emiAmount: 5185, disbursedDate: '2026-08-01', lastPaymentDate: '2026-10-18', surety1Name: 'Rajesh Kumar Sharma', dpdDays: 0, status: 'Active' },
];

export const mockCoopDdoBatches: CoopDdoRecoveryBatch[] = [
  { id: 'ddo-b-1', ddoCode: 'DDO-DEL-01', ddoName: 'Delhi Secretariat HQ', billingMonth: '2026-10', memberCount: 2, totalThriftDemand: 7500, totalLoanPrincipalDemand: 14200, totalDayBasedInterestDemand: 3881, totalRdDemand: 0, grandTotalDemand: 25581, postedAt: '2026-10-20 11:15 AM', status: 'Posted to Ledger' },
  { id: 'ddo-b-2', ddoCode: 'DDO-MUM-02', ddoName: 'Mumbai Western Division', billingMonth: '2026-10', memberCount: 1, totalThriftDemand: 5000, totalLoanPrincipalDemand: 9534, totalDayBasedInterestDemand: 1925, totalRdDemand: 10000, grandTotalDemand: 26459, postedAt: '2026-10-21 09:40 AM', status: 'Posted to Ledger' },
];

export const mockCoopPassbookTxns: CoopPassbookTxn[] = [
  { id: 'pt-1', memberId: 'cm-1', date: '2026-10-18', accountType: 'Thrift Fund', particulars: 'Monthly Salary Thrift Recovery (DDO-DEL-01)', debit: 0, credit: 3500, mode: 'DDO Salary Deduction' },
  { id: 'pt-2', memberId: 'cm-1', date: '2026-10-18', accountType: 'Loan Account', particulars: 'EMI #17 Recovery (Prin ₹9,177 + Day Int ₹3,719)', debit: 0, credit: 12896, mode: 'DDO Salary Deduction' },
  { id: 'pt-3', memberId: 'cm-1', date: '2026-09-30', accountType: 'Savings', particulars: 'Quarterly Savings Interest Credit @ 5.5%', debit: 0, credit: 1718, mode: 'System Interest' },
  { id: 'pt-4', memberId: 'cm-2', date: '2026-10-18', accountType: 'FD/RD', particulars: 'RD Installment #12 (RD-2026-104)', debit: 0, credit: 10000, mode: 'DDO Salary Deduction' },
];

export const mockCoopBackupSnapshots: CoopBackupSnapshot[] = [
  { id: 'bk-1', timestamp: '2026-11-17 23:00:00', label: 'Nightly Automated EOD Vault Snapshot', recordsCount: 1482, sizeKb: 428, verifiedBy: 'Automated Scheduler', checksum: 'sha256:9f84c2a...71e9' },
  { id: 'bk-2', timestamp: '2026-11-16 23:00:00', label: 'Nightly Automated EOD Vault Snapshot', recordsCount: 1479, sizeKb: 426, verifiedBy: 'Automated Scheduler', checksum: 'sha256:3b19d8e...04c2' },
];

export const mockCoopDividends: CoopDividendRecord[] = [
  { id: 'div-2025', financialYear: '2024-25', totalProfit: 8450000, dividendRatePct: 12.5, statutoryReserveFund: 2112500, educationFund: 422500, status: 'Disbursed' },
  { id: 'div-2026', financialYear: '2025-26', totalProfit: 12100000, dividendRatePct: 14.0, statutoryReserveFund: 3025000, educationFund: 605000, status: 'Approved in AGM' },
];

export const mockCoopAgms: CoopAgmRecord[] = [
  { id: 'agm-2025', meetingTitle: '12th Annual General Meeting', financialYear: '2024-25', meetingDate: '2025-08-28', quorumMet: true, resolutionsPassed: 6, totalVotesCasted: 1420, status: 'Minutes Published' },
  { id: 'agm-2026', meetingTitle: '13th Annual General Meeting', financialYear: '2025-26', meetingDate: '2026-09-15', quorumMet: true, resolutionsPassed: 8, totalVotesCasted: 1890, status: 'Completed' },
];

// ==========================================
// CORE BANKING SYSTEM (CBS) IMPLEMENTATION MOCK DATA
// ==========================================

export const mockCbsPhases: CbsPhase[] = [
  {
    id: 'cbs-p1',
    phaseNumber: 1,
    title: '01. Discovery, Target Operating Model & Blueprinting',
    durationWeeks: 4,
    gateCriterion: 'Architecture Review Board (ARB) & Product Factory Sign-Off',
    leadRole: 'Chief Enterprise Architect',
    objective: 'Catalog legacy core dependencies, finalize Chart of Accounts (COA) hierarchy, and define product factory schemas for CASA, Term Deposits, and Lending.',
    deliverables: [
      { id: 'd-101', title: 'Legacy Interface Dependency Inventory (ATM/ISO 8583, NEFT/RTGS, Treasury)', owner: 'Solution Architect', targetWeek: 'Week 1', artifactType: 'Architecture Spec', completed: true },
      { id: 'd-102', title: 'Unified 6-Digit General Ledger & Sub-Ledger Mapping Blueprint', owner: 'Financial Controller', targetWeek: 'Week 2', artifactType: 'Data Mapping', completed: true },
      { id: 'd-103', title: 'Regulatory Compliance Matrix (RBI Master Directions, PCI-DSS 4.0, DPDP Act)', owner: 'CISO & Compliance Lead', targetWeek: 'Week 3', artifactType: 'Compliance Control', completed: true },
      { id: 'd-104', title: 'Parametric Product Catalog (CASA, FD/RD, Gold, MSME, Co-op Loans)', owner: 'Head of Banking Products', targetWeek: 'Week 4', artifactType: 'Architecture Spec', completed: true },
    ],
  },
  {
    id: 'cbs-p2',
    phaseNumber: 2,
    title: '02. Core Technology Stack & Ledger Architecture',
    durationWeeks: 6,
    gateCriterion: 'Multi-AZ Active-Active Failover & Zero-Data-Loss (RPO=0) Proof',
    leadRole: 'Principal Distributed Systems Engineer',
    objective: 'Provision immutable append-only double-entry ledger engine, event-sourced Kafka bus, hardware security modules (HSM), and API gateway.',
    deliverables: [
      { id: 'd-201', title: 'Serializable Double-Entry Posting Engine with Idempotency Keys', owner: 'Core Ledger Team', targetWeek: 'Week 6', artifactType: 'Architecture Spec', completed: true },
      { id: 'd-202', title: 'ISO 20022 (pacs.008 / camt.053) & ISO 8583 Switch Adapters', owner: 'Payments Rails Team', targetWeek: 'Week 8', artifactType: 'Architecture Spec', completed: true },
      { id: 'd-203', title: 'Thales Luna HSM PIN/MAC Key Ceremony & Envelope KMS Encryption', owner: 'Security Engineering', targetWeek: 'Week 9', artifactType: 'Compliance Control', completed: false },
      { id: 'd-204', title: 'Active-Active Multi-Region CockroachDB / PostgreSQL Synchronous Cluster', owner: 'Cloud Infra SRE', targetWeek: 'Week 10', artifactType: 'Architecture Spec', completed: true },
    ],
  },
  {
    id: 'cbs-p3',
    phaseNumber: 3,
    title: '03. Parameterization, API Mesh & Middleware Integration',
    durationWeeks: 6,
    gateCriterion: '100% Sandbox API Contract Parity & Real-Time AML Screening Hook',
    leadRole: 'VP of Platform Engineering',
    objective: 'Configure day-count accrual rules (Actual/365, Actual/Actual), NACH/UPI/IMPS connectors, CKYC/PAN verification hooks, and maker-checker workflows.',
    deliverables: [
      { id: 'd-301', title: 'Day-Based Interest Accrual & Quarterly Compounding Batch Engine', owner: 'Deposits & Loans Pod', targetWeek: 'Week 12', artifactType: 'Architecture Spec', completed: true },
      { id: 'd-302', title: 'mTLS OAuth 2.1 / FAPI 2.0 Open Banking API Gateway', owner: 'API Platform Team', targetWeek: 'Week 14', artifactType: 'Compliance Control', completed: true },
      { id: 'd-303', title: 'Real-Time Sanctions, PEP & Velocity AML Interceptor', owner: 'Risk & Compliance Pod', targetWeek: 'Week 16', artifactType: 'Compliance Control', completed: false },
    ],
  },
  {
    id: 'cbs-p4',
    phaseNumber: 4,
    title: '04. ETL Data Migration, Cleansing & Trial Cutover',
    durationWeeks: 5,
    gateCriterion: 'Zero-Paise Trial Balance Parity Across All CIF, Deposit & Loan Ledgers',
    leadRole: 'Data Migration Lead',
    objective: 'Extract historical CIFs, accounts, collaterals, standing instructions, and GL balances; deduplicate KYC records; execute 3 full mock migration rehearsals.',
    deliverables: [
      { id: 'd-401', title: 'CIF Deduplication & PAN/Aadhaar Format Cleansing Ruleset', owner: 'Data Engineering', targetWeek: 'Week 18', artifactType: 'Data Mapping', completed: true },
      { id: 'd-402', title: 'SHA-256 Row-Level Checksum & Hash Verification Pipeline', owner: 'Migration QA', targetWeek: 'Week 19', artifactType: 'Test Suite', completed: false },
      { id: 'd-403', title: 'Mock Cutover Rehearsal #2 (Legacy GL vs Target GL Control Totals)', owner: 'Financial Control', targetWeek: 'Week 21', artifactType: 'Runbook', completed: false },
    ],
  },
  {
    id: 'cbs-p5',
    phaseNumber: 5,
    title: '05. SIT, UAT, Chaos Engineering & Parallel Run',
    durationWeeks: 4,
    gateCriterion: '14-Day Parallel Run Zero Variance & 2,500 TPS Load Certification',
    leadRole: 'Head of Quality & Release',
    objective: 'Run legacy and new core ledgers side-by-side on live shadow traffic, benchmark peak EOD batch runtime, and validate chaos failover scenarios.',
    deliverables: [
      { id: 'd-501', title: 'Peak Load Benchmark (2,500 TPS Sustained, p99 < 65ms)', owner: 'Performance SRE', targetWeek: 'Week 22', artifactType: 'Test Suite', completed: true },
      { id: 'd-502', title: '14-Day Shadow Traffic & EOD Accrual Parity Certificate', owner: 'Audit & Reconciliation', targetWeek: 'Week 24', artifactType: 'Test Suite', completed: false },
      { id: 'd-503', title: 'Operational UAT Sign-Off (Teller, Branch, Treasury, Statutory Reports)', owner: 'Operations Steering Committee', targetWeek: 'Week 25', artifactType: 'Compliance Control', completed: false },
    ],
  },
  {
    id: 'cbs-p6',
    phaseNumber: 6,
    title: '06. Cutover Weekend, Go-Live & Hypercare SRE',
    durationWeeks: 3,
    gateCriterion: 'Clean T+0 Production BOD Open & 30-Day SLA Stability Sign-Off',
    leadRole: 'Cutover Commander',
    objective: 'Execute timed T-48h to T+72h production cutover sequence, switch DNS/payment rail endpoints, verify live balances, and run 24/7 hypercare.',
    deliverables: [
      { id: 'd-601', title: 'Minute-by-Minute Cutover Weekend Runbook & Rollback Checkpoints', owner: 'Release Management', targetWeek: 'Week 26', artifactType: 'Runbook', completed: true },
      { id: 'd-602', title: 'NPCI / RBI NEFT-RTGS Cutover Window Coordination', owner: 'Payment Operations', targetWeek: 'Week 27', artifactType: 'Runbook', completed: false },
      { id: 'd-603', title: 'T+1 Statutory Audit Opening Balance Certification', owner: 'Statutory Auditor', targetWeek: 'Week 28', artifactType: 'Compliance Control', completed: false },
    ],
  },
];

export const mockCbsTechLayers: CbsTechLayer[] = [
  {
    id: 'tl-1',
    layerOrder: 1,
    layerName: 'Digital Channels & Omnichannel Edge',
    primaryProtocol: 'HTTPS / TLS 1.3 · WebSocket · FAPI 2.0',
    technologyComponents: ['Mobile Banking App', 'Teller Branch Portal', 'Corporate Host-to-Host', 'ATM/POS ISO 8583 Edge'],
    targetLatencyMs: 18,
    throughputTps: 6000,
    resiliencePattern: 'Anycast Edge WAF + Rate Limiting + DDoS Scrubbing',
    complianceStandard: 'OWASP ASVS L3 · WCAG 2.1 AA',
  },
  {
    id: 'tl-2',
    layerOrder: 2,
    layerName: 'API Gateway, Switch & Payment Rails Mesh',
    primaryProtocol: 'ISO 20022 XML · gRPC · REST/JSON · ISO 8583',
    technologyComponents: ['Kong/Envoy mTLS Gateway', 'NEFT/RTGS/IMPS/UPI Adapter', 'SWIFT Alliance Connector', 'Idempotency Cache (Redis Cluster)'],
    targetLatencyMs: 14,
    throughputTps: 4500,
    resiliencePattern: 'Circuit Breakers + Exactly-Once Idempotent Deduplication',
    complianceStandard: 'PCI-DSS 4.0 · RBI PAPG Guidelines',
  },
  {
    id: 'tl-3',
    layerOrder: 3,
    layerName: 'Core Domain Microservices & Product Factory',
    primaryProtocol: 'gRPC / Protobuf · Temporal Workflows',
    technologyComponents: ['CIF & KYC Registry', 'CASA & Term Deposit Engine', 'Loan Origination & Amortization', 'Fee, Tax (GST/TDS) & Accrual Calculator'],
    targetLatencyMs: 22,
    throughputTps: 3200,
    resiliencePattern: 'Saga Orchestration + Compensating Reverse Transactions',
    complianceStandard: 'RBI SBR · Ind AS 109 · Fair Practices Code',
  },
  {
    id: 'tl-4',
    layerOrder: 4,
    layerName: 'Immutable Double-Entry Ledger & Event Bus',
    primaryProtocol: 'Kafka Partitioned Log · Serializable SQL',
    technologyComponents: ['Append-Only Journal Store', 'Real-Time Sub-Ledger to GL Rollup', 'Outbox CDC Publisher', 'Automated EOD/BOD Batch Scheduler'],
    targetLatencyMs: 9,
    throughputTps: 2800,
    resiliencePattern: 'Raft Consensus · Zero Unbalanced Posting Constraint (ΣDr = ΣCr)',
    complianceStandard: 'SOX ITGC · Immutable Hash-Chained Audit Trail',
  },
  {
    id: 'tl-5',
    layerOrder: 5,
    layerName: 'Active-Active Persistence, HSM & Disaster Recovery',
    primaryProtocol: 'PKCS#11 · Raft Synchronous Replication',
    technologyComponents: ['Multi-AZ Distributed SQL', 'Thales Luna Network HSM', 'Immutable Object Vault (WORM)', 'Cross-Region DR Failover Cluster'],
    targetLatencyMs: 6,
    throughputTps: 5000,
    resiliencePattern: 'RPO = 0 Seconds (Sync Quorum) · RTO < 12 Minutes',
    complianceStandard: 'ISO 27001 · RBI Business Continuity Circular',
  },
];

export const mockCbsMigrationBatches: CbsMigrationBatch[] = [
  {
    id: 'mig-1',
    domain: 'Customer Information File (CIF) & KYC',
    sourceTable: 'LEGACY_CIF_MASTER',
    targetEntity: 'cbs_cif_profiles',
    totalRecords: 14280,
    cleansedRecords: 14195,
    exceptionCount: 85,
    legacyControlTotal: 14280,
    cbsMigratedTotal: 14195,
    stage: 'Cleansed & Deduped',
    lastRunAt: '2026-11-17 21:40',
  },
  {
    id: 'mig-2',
    domain: 'CASA & Fixed/Recurring Deposits',
    sourceTable: 'LEGACY_DEP_ACCTS',
    targetEntity: 'cbs_deposit_accounts',
    totalRecords: 18640,
    cleansedRecords: 18640,
    exceptionCount: 0,
    legacyControlTotal: 482500000,
    cbsMigratedTotal: 482500000,
    stage: 'Loaded & Reconciled',
    lastRunAt: '2026-11-17 22:05',
  },
  {
    id: 'mig-3',
    domain: 'Retail, MSME & Co-op Loan Accounts',
    sourceTable: 'LEGACY_LOAN_LEDGER',
    targetEntity: 'cbs_loan_contracts',
    totalRecords: 6412,
    cleansedRecords: 6398,
    exceptionCount: 14,
    legacyControlTotal: 319420500,
    cbsMigratedTotal: 319392100,
    stage: 'Transformed',
    lastRunAt: '2026-11-17 22:18',
  },
  {
    id: 'mig-4',
    domain: 'General Ledger & Trial Balance Heads',
    sourceTable: 'LEGACY_GL_BALANCES',
    targetEntity: 'cbs_gl_accounts',
    totalRecords: 412,
    cleansedRecords: 412,
    exceptionCount: 0,
    legacyControlTotal: 940000000,
    cbsMigratedTotal: 940000000,
    stage: 'Loaded & Reconciled',
    lastRunAt: '2026-11-17 22:30',
  },
];

export const mockCbsLedgerSimTxns: CbsLedgerSimTxn[] = [
  {
    id: 'sim-1',
    idempotencyKey: 'idem-9f28c4b1-77a2-4012',
    uetr: 'eb9a2c44-1f8e-4c11-9b30-7c4d0e819a10',
    timestamp: '2026-11-18 09:14:22',
    eventType: 'NEFT_OUTWARD',
    iso20022MessageType: 'pacs.008.001.08',
    accountRef: 'CBS-CASA-0091842',
    amount: 250000,
    currency: 'INR',
    isolationLevel: 'SERIALIZABLE',
    latencyMs: 38,
    status: 'COMMITTED_IMMUTABLE',
    lines: [
      { glCode: '210101', accountTitle: 'Customer Savings Liability (CASA-0091842)', debit: 250000, credit: 0 },
      { glCode: '110402', accountTitle: 'RBI RTGS/NEFT Settlement Clearing Nostro', debit: 0, credit: 250000 },
    ],
    isoXmlSnippet: `<Document xmlns="urn:iso:std:iso:20022:tech:xsd:pacs.008.001.08"><FIToFICstmrCdtTrf><GrpHdr><MsgId>CBS2026111800918</MsgId><NbOfTxs>1</NbOfTxs></GrpHdr><CdtTrfTxInf><PmtId><UETR>eb9a2c44-1f8e-4c11-9b30-7c4d0e819a10</UETR></PmtId><IntrBkSttlmAmt Ccy="INR">250000.00</IntrBkSttlmAmt></CdtTrfTxInf></FIToFICstmrCdtTrf></Document>`,
  },
  {
    id: 'sim-2',
    idempotencyKey: 'idem-3a14e8d9-10c4-4b88',
    uetr: 'c42d18e9-881a-4100-a211-09f8e1a22c04',
    timestamp: '2026-11-18 09:05:10',
    eventType: 'LOAN_DISBURSEMENT',
    iso20022MessageType: 'pain.001.001.09',
    accountRef: 'CBS-LN-2026-4412',
    amount: 500000,
    currency: 'INR',
    isolationLevel: 'SERIALIZABLE',
    latencyMs: 42,
    status: 'COMMITTED_IMMUTABLE',
    lines: [
      { glCode: '130201', accountTitle: 'Term Loan Principal Asset (LN-2026-4412)', debit: 500000, credit: 0 },
      { glCode: '210101', accountTitle: 'Borrower Operational CASA Credit', debit: 0, credit: 494100 },
      { glCode: '420105', accountTitle: 'Loan Processing Fee Income', debit: 0, credit: 5000 },
      { glCode: '230418', accountTitle: 'CGST/SGST Output Tax Payable (18%)', debit: 0, credit: 900 },
    ],
    isoXmlSnippet: `<Document xmlns="urn:iso:std:iso:20022:tech:xsd:pain.001.001.09"><CstmrCdtTrfInitn><GrpHdr><MsgId>DISB202611184412</MsgId></GrpHdr><PmtInf><Amt><InstdAmt Ccy="INR">494100.00</InstdAmt></Amt></PmtInf></CstmrCdtTrfInitn></Document>`,
  },
];

export const mockCbsCutoverSteps: CbsCutoverStep[] = [
  { id: 'cut-1', sequence: '01', windowLabel: 'T-24h · Fri 18:00', title: 'Freeze Legacy Channel Writes & Trigger Pre-Cutover EOD Batch', owner: 'Branch Operations', estimatedMinutes: 45, rollbackTrigger: 'Unreconciled teller cash variance > ₹0', status: 'Completed' },
  { id: 'cut-2', sequence: '02', windowLabel: 'T-18h · Fri 22:00', title: 'Take Immutable Pre-Migration Snapshot & Hash Checksum', owner: 'DBA & Cloud SRE', estimatedMinutes: 30, rollbackTrigger: 'Snapshot checksum mismatch or I/O stall', status: 'Completed' },
  { id: 'cut-3', sequence: '03', windowLabel: 'T-12h · Sat 02:00', title: 'Execute Delta ETL Load (CIF, CASA, Loans, Standing Orders, GL)', owner: 'Data Migration Lead', estimatedMinutes: 120, rollbackTrigger: 'GL Trial Balance delta > ₹0.00 or rejected CIF > 0.1%', status: 'Completed' },
  { id: 'cut-4', sequence: '04', windowLabel: 'T-06h · Sat 08:00', title: 'Run Statutory Auditor Balance Parity Sign-Off (SHA-256 Proof)', owner: 'Statutory Auditor', estimatedMinutes: 60, rollbackTrigger: 'Auditor refuses opening balance certificate', status: 'Pending' },
  { id: 'cut-5', sequence: '05', windowLabel: 'T-02h · Sat 12:00', title: 'Switch ISO 8583 / UPI / NEFT / RTGS Gateway Endpoints & HSM Keys', owner: 'Payments & Security', estimatedMinutes: 40, rollbackTrigger: 'ISO 20022 heartbeat ACK failure on NPCI/RBI switch', status: 'Pending' },
  { id: 'cut-6', sequence: '06', windowLabel: 'T+00h · Sun 06:00', title: 'Open Production BOD Business Date & Execute Canary Smoke Transfers', owner: 'Cutover Commander', estimatedMinutes: 30, rollbackTrigger: 'p99 ledger commit latency > 150ms or error rate > 0.5%', status: 'Pending' },
];



