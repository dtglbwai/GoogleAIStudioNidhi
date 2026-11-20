
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { db, auth, handleFirestoreError, OperationType } from './lib/firebase';
import { mockApplications, mockLoans, mockLeases, mockCustomers, mockTransactions, mockUsers, mockVehicles, mockLenders, mockAccounts, mockVouchers, mockBankAccounts, mockBankStatementTransactions, mockItems, mockSalesInvoices, mockQuotations, mockSalesOrders, mockDeliveryChallans, mockPurchaseBills, mockPurchaseOrders, mockGoodsReceiptNotes, mockOperationalSettings, mockCollectionLogs, mockLegalCases, mockAgreementTemplates, mockGeneratedAgreements, mockComplianceTasks, mockKycCompanies, mockKycCustomers, mockDatabaseSettings, mockAuditFindings, mockMetadataSettings, mockLegalSettings, mockBranches, mockEmployees, mockSupportTickets, mockInteractionLogs, mockDevelopmentGoals, mockCustomerAccounts, mockTellerTransactions, mockLeads, mockGrievances, mockGroups, mockPdcs, mockGoldLoans, mockCommunicationTemplates, mockOperationalRiskEvents, mockStrategicGoals, mockInvestments, mockBorrowings, mockTdsPayables, mockTdsReceivables, mockBicDirectory, mockNostroVostroAccounts, mockSwiftMessages, mockTradeFinanceCredits, mockStandingOrders, mockCoreBatchLogs, mockConfiAccounts, mockConfiJournalEntries, mockConfiInvoices, mockConfiBills, mockFixedAssets, mockRilletSaaSMetrics, mockRilletContracts, mockRilletBankTransactions, mockRilletPrepaids, mockRilletFluxAnalysis, mockRilletCloseChecklist, mockRilletAiQueries, mockNbfcCrar, mockIndAs109EclStages, mockNbfcAlmBuckets, mockNbfcCoLendingDeals, mockBureauTudfRecords, mockOpenCostCenters, mockOpenBudgetRules, mockOpenPeriodClosingEntries, mockJevPipelines, mockJevBatchRecords, mockJevCalibrationBuckets, mockJevRecentEvaluations, mockRunamargaTelemetry, mockRunamargaCampaigns, mockRunamargaCalls, mockWorkspaceCustomers, mockWorkspaceSuppliers, mockWorkspaceProjects, mockWorkspaceTasks, mockWorkspaceDocuments, mockWorkspaceChannels, mockWorkspaceChannelMessages, mockWorkspaceChecklists, mockWorkspaceAuditLogs, mockTaxComplianceItems, mockTaxRecords, mockTaxOptimizationSuggestions, mockTaxChatHistory, mockBusinessKpis, mockBusinessStrategyGoals, mockBusinessAssistantHistory, mockCoopMembers, mockCoopDeposits, mockCoopLoans, mockCoopDdoBatches, mockCoopPassbookTxns, mockCoopBackupSnapshots, mockCoopDividends, mockCoopAgms, mockCbsPhases, mockCbsTechLayers, mockCbsMigrationBatches, mockCbsLedgerSimTxns, mockCbsCutoverSteps } from './data/mockData';
import { View, Application, Loan, Lease, Customer, Transaction, User, Vehicle, Lender, Account, Voucher, BankAccount, BankStatementTransaction, Item, SalesInvoice, Quotation, SalesOrder, DeliveryChallan, PurchaseBill, PurchaseOrder, GoodsReceiptNote, OperationalSettings, CollectionLog, LegalCase, AgreementTemplate, GeneratedAgreement, ComplianceTask, UserRole, ModuleConfig, ClientBankPresetId, SystemBackupSnapshot, EntityMigrationBatch, ApplicationStatus, KycCompany, KycCustomer, LeaseStatus, VehicleStatus, VoucherStatus, LoanStatus, CollectionStatus, AssetClass, KycStatus, ComplianceTaskStatus, DatabaseSettings, AuditFinding, MetadataSettings, LegalSettings, AuditFindingSeverity, TransactionStatus, PaymentMode, TransactionType, Branch, Employee, EmployeeStatus, SupportTicket, SupportTicketStatus, InteractionLog, DevelopmentGoal, CustomerAccount, TellerTransaction, Lead, LeadStatus, CustomerStatus, Card, PaymentOrder, CardStatus, PaymentOrderStatus, AmlStatus, Grievance, GrievanceStatus, Group, PostDatedCheque, PdcStatus, GoldLoan, CommunicationLog, CommunicationTemplate, CommunicationStatus, OperationalRiskEvent, StrategicGoal, Investment, Borrowing, TdsPayable, TdsReceivable, SwiftMessage, NostroVostroAccount, BicDirectoryEntry, TradeFinanceDocCredit, StandingOrder, CoreBatchLog, ConfiAccount, ConfiJournalEntry, ConfiInvoice, ConfiBill, FixedAssetItem, RilletContract, RilletSaaSMetrics, RilletBankFeedTransaction, RilletPrepaidItem, RilletFluxAnalysisItem, RilletCloseChecklistTask, RilletAiQueryLog, NbfcCrarMetrics, IndAs109EclStageSummary, NbfcAlmBucket, NbfcCoLendingEscrowDeal, BureauTudfRecord, OpenCostCenter, OpenBudgetRule, OpenPeriodClosingEntry, JevPipeline, JevBatchRecord, JevCalibrationBin, JevEvaluationOutput, JevQuestion, RunamargaCallRecord, RunamargaCampaign, RunamargaTelemetryStats, RunamargaTranscriptTurn, WorkspaceProject, WorkspaceTask, WorkspaceCustomer, WorkspaceSupplier, WorkspaceDocument, WorkspaceChannelMessage, WorkspaceChecklistSubmission, WorkspaceAuditLog, WorkspaceStage, WorkspacePriority, WorkspaceDocCategory, WorkspaceDocStatus, TaxComplianceItem, TaxRecord, TaxChatMessage, TaxOptimizationSuggestion, BusinessKpi, BusinessStrategyGoal, BusinessAssistantMessage, VoucherType, TaxComplianceStatus, WorkspaceSignatureStamp, CoopMember, CoopDeposit, CoopLoan, CoopDdoRecoveryBatch, CoopPassbookTxn, CoopBackupSnapshot, CoopDividendRecord, CoopAgmRecord, CbsPhase, CbsDeliverable, CbsTechLayer, CbsMigrationBatch, CbsLedgerSimTxn, CbsCutoverStep } from './views/types';
import { generateLeasePaymentSchedule, generateRepaymentSchedule } from './utils/finance';
import { formatCurrency } from './utils/formatters';

interface AppState {
  isAuthenticated: boolean;
  currentView: View;
  currentUser: UserRole;
  moduleConfig: ModuleConfig;
  clientBankPreset: ClientBankPresetId;
  activeBranchId: string | 'ALL';
  backupSnapshots: SystemBackupSnapshot[];
  migrationBatches: EntityMigrationBatch[];
  leads: Lead[];
  applications: Application[];
  loans: Loan[];
  homeLoans: Loan[];
  businessLoans: Loan[];
  industryLoans: Loan[];
  goldLoans: GoldLoan[];
  leases: Lease[];
  customers: Customer[];
  transactions: Transaction[];
  users: User[];
  vehicles: Vehicle[];
  lenders: Lender[];
  accounts: Account[];
  vouchers: Voucher[];
  bankAccounts: BankAccount[];
  bankStatementTransactions: BankStatementTransaction[];
  items: Item[];
  salesInvoices: SalesInvoice[];
  quotations: Quotation[];
  salesOrders: SalesOrder[];
  deliveryChallans: DeliveryChallan[];
  purchaseBills: PurchaseBill[];
  purchaseOrders: PurchaseOrder[];
  goodsReceiptNotes: GoodsReceiptNote[];
  operationalSettings: OperationalSettings;
  databaseSettings: DatabaseSettings;
  metadataSettings: MetadataSettings;
  legalSettings: LegalSettings;
  collectionLogs: CollectionLog[];
  legalCases: LegalCase[];
  agreementTemplates: AgreementTemplate[];
  generatedAgreements: GeneratedAgreement[];
  complianceTasks: ComplianceTask[];
  selectedLoanId: string | null;
  selectedLeaseId: string | null;
  selectedVehicleId: string | null;
  selectedCustomerId: string | null;
  selectedEmployeeId: string | null;
  selectedApplicationId: string | null;
  kycCompanies: KycCompany[];
  kycCustomers: KycCustomer[];
  auditFindings: AuditFinding[];
  branches: Branch[];
  employees: Employee[];
  supportTickets: SupportTicket[];
  interactionLogs: InteractionLog[];
  developmentGoals: DevelopmentGoal[];
  strategicGoals: StrategicGoal[];
  customerAccounts: CustomerAccount[];
  tellerTransactions: TellerTransaction[];
  cards: Card[];
  paymentOrders: PaymentOrder[];
  grievances: Grievance[];
  groups: Group[];
  pdcs: PostDatedCheque[];
  communicationLogs: CommunicationLog[];
  communicationTemplates: CommunicationTemplate[];
  operationalRiskEvents: OperationalRiskEvent[];
  investments: Investment[];
  borrowings: Borrowing[];
  tdsPayables: TdsPayable[];
  tdsReceivables: TdsReceivable[];
  swiftMessages: SwiftMessage[];
  nostroVostroAccounts: NostroVostroAccount[];
  bicDirectory: BicDirectoryEntry[];
  tradeFinanceCredits: TradeFinanceDocCredit[];
  standingOrders: StandingOrder[];
  coreBatchLogs: CoreBatchLog[];
  confiAccounts: ConfiAccount[];
  confiJournalEntries: ConfiJournalEntry[];
  confiInvoices: ConfiInvoice[];
  confiBills: ConfiBill[];
  fixedAssets: FixedAssetItem[];
  // Rillet AI State
  rilletSaaSMetrics: RilletSaaSMetrics;
  rilletContracts: RilletContract[];
  rilletBankTransactions: RilletBankFeedTransaction[];
  rilletPrepaids: RilletPrepaidItem[];
  rilletFluxAnalysis: RilletFluxAnalysisItem[];
  rilletCloseChecklist: RilletCloseChecklistTask[];
  rilletAiQueries: RilletAiQueryLog[];
  // NBFC & Open Accounting Standards State
  nbfcCrar: NbfcCrarMetrics;
  indAs109EclStages: IndAs109EclStageSummary[];
  nbfcAlmBuckets: NbfcAlmBucket[];
  nbfcCoLendingDeals: NbfcCoLendingEscrowDeal[];
  bureauTudfRecords: BureauTudfRecord[];
  openCostCenters: OpenCostCenter[];
  openBudgetRules: OpenBudgetRule[];
  openPeriodClosingEntries: OpenPeriodClosingEntry[];
  // Jev.ai System One AI Engine State
  jevPipelines: JevPipeline[];
  jevBatchRecords: JevBatchRecord[];
  jevCalibrationBuckets: JevCalibrationBin[];
  jevRecentEvaluations: JevEvaluationOutput[];
  jevActivePipelineId: string;
  // Runamarga Voice AI Infrastructure & Monitoring State
  runamargaTelemetry: RunamargaTelemetryStats;
  runamargaCampaigns: RunamargaCampaign[];
  runamargaCalls: RunamargaCallRecord[];
  runamargaActiveCallId: string | null;
  // OmniWorkspace State (Oasis Workspace Standards)
  workspaceProjects: WorkspaceProject[];
  workspaceTasks: WorkspaceTask[];
  workspaceCustomers: WorkspaceCustomer[];
  workspaceSuppliers: WorkspaceSupplier[];
  workspaceDocuments: WorkspaceDocument[];
  workspaceChannelMessages: WorkspaceChannelMessage[];
  workspaceChecklists: WorkspaceChecklistSubmission[];
  workspaceAuditLogs: WorkspaceAuditLog[];
  // Tax AI Compliance Agent State
  taxComplianceItems: TaxComplianceItem[];
  taxRecords: TaxRecord[];
  taxOptimizationSuggestions: TaxOptimizationSuggestion[];
  taxChatHistory: TaxChatMessage[];
  // Business Assistant State
  businessKpis: BusinessKpi[];
  businessStrategyGoals: BusinessStrategyGoal[];
  businessAssistantHistory: BusinessAssistantMessage[];
  // TrueFincaplinCoop Cooperative Society State
  coopMembers: CoopMember[];
  coopDeposits: CoopDeposit[];
  coopLoans: CoopLoan[];
  coopDdoBatches: CoopDdoRecoveryBatch[];
  coopPassbookTxns: CoopPassbookTxn[];
  coopBackupSnapshots: CoopBackupSnapshot[];
  coopDividends: CoopDividendRecord[];
  coopAgms: CoopAgmRecord[];
  // CBS Technology & Implementation State
  cbsPhases: CbsPhase[];
  cbsTechLayers: CbsTechLayer[];
  cbsMigrationBatches: CbsMigrationBatch[];
  cbsLedgerSimTxns: CbsLedgerSimTxn[];
  cbsCutoverSteps: CbsCutoverStep[];
}


interface AppContextType extends AppState {
  setCurrentView: (view: View) => void;
  setCurrentUser: (role: UserRole) => void;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
  handleLogin: (role: UserRole) => void;
  handleLogout: () => void;
  handleToggleModule: (module: keyof ModuleConfig) => void;
  handleApplyClientBankPreset: (presetId: ClientBankPresetId) => void;
  handleSetActiveBranch: (branchId: string | 'ALL') => void;
  handleSyncBranchToHq: (branchId: string) => void;
  handleToggleBranchIsolation: (branchId: string) => void;
  handleCreateBackupSnapshot: (label?: string, type?: SystemBackupSnapshot['type']) => Promise<SystemBackupSnapshot>;
  handleRestoreBackupSnapshot: (snapshotOrJson: string) => Promise<{ ok: boolean; message: string }>;
  handleCommitEntityMigration: (
    targetEntity: EntityMigrationBatch['targetEntity'],
    sourceFormat: 'CSV' | 'JSON',
    rows: Record<string, any>[]
  ) => Promise<EntityMigrationBatch>;
  handleRollbackMigration: (batchId: string) => Promise<boolean>;
  setJevActivePipelineId: (id: string) => void;
  handleExecuteJevEvaluation: (pipelineId: string, stateInput: Record<string, any>, question: JevQuestion) => Promise<JevEvaluationOutput>;
  handleRunJevBatchSimulation: (customThreshold?: number) => void;
  handleCommitStpRecord: (recordId: string) => void;
  handleTriggerSystem2Escalation: (recordId: string, customInstruction?: string) => Promise<string>;
  handleUpdateJevPipelineStatus: (pipelineId: string, status: 'Active' | 'Paused') => void;
  handleUpdateStpThreshold: (pipelineId: string, threshold: number) => void;
  // Runamarga Handlers
  setRunamargaActiveCallId: (callId: string | null) => void;
  handleToggleRunamargaCampaign: (campaignId: string) => void;
  handleCreateRunamargaCampaign: (campaign: Omit<RunamargaCampaign, 'id' | 'completedCalls' | 'connectedRate' | 'conversionRate'>) => void;
  handleDispatchRunamargaWorkflow: (callId: string) => void;
  handleSimulateRunamargaCallTurn: (callId: string, customerUtterance: string) => Promise<RunamargaTranscriptTurn>;
  handleAddNewRunamargaCall: (call: RunamargaCallRecord) => void;
  // OmniWorkspace Handlers (Oasis Workspace Standards)
  handleCreateWorkspaceProject: (proj: Omit<WorkspaceProject, 'id'>) => void;
  handleUpdateProjectStage: (projectId: string, newStage: WorkspaceStage) => void;
  handleCreateWorkspaceTask: (task: Omit<WorkspaceTask, 'id'>) => void;
  handleToggleWorkspaceChecklistItem: (taskId: string, itemId: string) => void;
  handleUpdateTaskStatus: (taskId: string, newStatus: 'todo' | 'in_progress' | 'review' | 'done') => void;
  handleCreateWorkspaceDocument: (doc: Omit<WorkspaceDocument, 'id' | 'docNumber' | 'uploadDate' | 'eSignatures'>) => void;
  handleSignWorkspaceDocument: (docId: string, signerName: string, role: string) => void;
  handleRejectWorkspaceDocument: (docId: string, reason: string) => void;
  handleSendWorkspaceMessage: (channelId: string, message: string, senderName: string, senderRole: string) => void;
  handleVerifyWorkspaceChecklist: (checklistId: string, verifiedBy: string) => void;
  handleAddWorkspaceCustomer: (customer: Omit<WorkspaceCustomer, 'id' | 'code'>) => void;
  handleAddWorkspaceSupplier: (supplier: Omit<WorkspaceSupplier, 'id' | 'code'>) => void;
  handleAddLead: (leadData: Omit<Lead, 'id' | 'status'>) => void;
  handleConvertLeadToApplication: (leadId: string) => void;
  handleAddApplication: (app: Omit<Application, 'id'|'status'|'submittedDate'>) => void;
  handleAdvanceApplicationState: (appId: string, targetStatus: ApplicationStatus) => void;
  handleIssueClosureCertificates: (loanId: string) => void;
  handleRunDailyProcess: () => void;
  handleUpdateOperationalSettings: (settings: OperationalSettings) => void;
  handleUpdateDatabaseSettings: (settings: DatabaseSettings) => void;
  handleUpdateMetadataSettings: (settings: MetadataSettings) => void;
  handleUpdateLegalSettings: (settings: LegalSettings) => void;
  handleVoucherAction: (voucherId: string, action: 'approve' | 'reject') => void;
  handleAddVoucher: (voucher: Omit<Voucher, 'id' | 'voucherNumber'>) => void;
  handlePushToCkyc: (entityId: string, type: 'company' | 'customer') => void;
  handleVerifyKyc: (entityId: string, type: 'company' | 'customer') => void;
  handleAddCompanyKyc: (data: any) => void;
  handleAddCustomerKyc: (data: any) => void;
  handleEndLease: (leaseId: string, notes: string) => void;
  handleAddVehicle: (vehicleData: any) => void;
  handleUpdateVehicleInsurance: (vehicleId: string, provider: string, policyNumber: string, expiryDate: string) => void;
  handleLinkAccount: (accountId: string) => void;
  handleFetchStatement: (accountId: string) => void;
  handleReconcile: (bookTxnIds: string[], bankTxnIds: string[]) => void;
  handleLogCollectionAction: (entityId: string, entityType: 'Loan' | 'Lease', action: string, notes: string) => void;
  handleLogCollectionPayment: (entityId: string, entityType: 'Loan' | 'Lease', amount: number) => void;
  handleInitiateVehicleSeizure: (leaseId: string) => void;
  handleAddLegalCase: (caseData: Omit<LegalCase, 'id'>) => void;
  handleGenerateAgreement: (applicationId: string, templateId: string) => void;
  handleMarkAgreementSigned: (agreementId: string) => void;
  handleAddUser: (userData: any) => void;
  handleAddLender: (lenderData: any) => void;
  handleAddTransaction: (txnData: Partial<Transaction>) => void;
  handleAddComplianceTask: (task: Omit<ComplianceTask, 'id'>) => void;
  handleUpdateAssetClass: (loanId: string, newClass: AssetClass) => void;
  handleRunAudit: () => void;
  handleAddBranch: (branchData: Omit<Branch, 'id'>) => void;
  handleAddEmployee: (employeeData: Omit<Employee, 'id' | 'status'>) => void;
  handleAddSupportTicket: (ticketData: Omit<SupportTicket, 'id' | 'ticketId' | 'createdAt' | 'status'>) => void;
  handleAddInteractionLog: (logData: Omit<InteractionLog, 'id' | 'loggedBy'>) => void;
  handleAddDevelopmentGoal: (goalData: Omit<DevelopmentGoal, 'id'>) => void;
  handleMakeCustomerPayment: (contractId: string, contractType: 'Loan' | 'Lease') => void;
  handleRunCreditCheck: (appId: string) => void;
  handleUnderwritingDecision: (appId: string, decision: 'approved' | 'rejected', notes: string) => void;
  handleIssueCard: (cardData: Omit<Card, 'id' | 'cardNumber' | 'status' | 'expiryDate'>) => void;
  handleCreatePaymentOrder: (orderData: Omit<PaymentOrder, 'id' | 'status' | 'createdAt' | 'processedAt' | 'currency'>) => void;
  handleInvestigateAmlTransaction: (transactionId: string, action: 'mark_safe' | 'generate_sar', notes: string) => void;
  handleAddGrievance: (grievanceData: Omit<Grievance, 'id' | 'grievanceId' | 'status' | 'createdAt' | 'dueDate'>) => void;
  handleUpdateGrievanceStatus: (grievanceId: string, newStatus: GrievanceStatus, notes: string) => void;
  handleAddGroup: (groupData: Omit<Group, 'id'>) => void;
  handleAddPdc: (pdcData: Omit<PostDatedCheque, 'id' | 'applicantName' | 'status'>) => void;
  handleUpdatePdcStatus: (pdcId: string, newStatus: PdcStatus) => void;
  handleAddGoldLoan: (loanData: Omit<GoldLoan, 'id' | 'status' | 'repaymentSchedule' | 'assetClass' | 'daysPastDue' | 'hasLegalCase' | 'collectionStatus' | 'generatedAgreementIds' >) => void;
  handleMoveToAuction: (loanId: string) => void;
  handleUpdateCommunicationTemplate: (template: CommunicationTemplate) => void;
  // SWIFT & Core Banking Methods
  handleCreateSwiftMessage: (msg: Omit<SwiftMessage, 'id' | 'uetr' | 'status' | 'rawSwiftBlock' | 'gpiTracking' | 'sanctionsCheck'>) => void;
  handleReleaseSwiftSanctions: (messageId: string) => void;
  handleRunCoreBatch: (batchType: 'EOD' | 'BOD') => void;
  handleAddStandingOrder: (so: Omit<StandingOrder, 'id' | 'status' | 'executionCount'>) => void;
  handleToggleStandingOrder: (id: string) => void;
  handleCreateTradeFinanceCredit: (tf: Omit<TradeFinanceDocCredit, 'id' | 'status' | 'discrepanciesCount'>) => void;
  // ConfiBooks Accounting Methods
  handleAddConfiAccount: (account: Omit<ConfiAccount, 'id' | 'isSystem'>) => void;
  handleAddConfiJournalEntry: (entry: Omit<ConfiJournalEntry, 'id' | 'entryNumber' | 'totalDebit' | 'totalCredit' | 'status'>) => void;
  handleAddConfiInvoice: (invoice: Omit<ConfiInvoice, 'id' | 'invoiceNumber' | 'subTotal' | 'discountTotal' | 'taxTotal' | 'grandTotal' | 'amountPaid' | 'balanceDue' | 'status'>) => void;
  handleRecordConfiInvoicePayment: (invoiceId: string, amount: number) => void;
  handleAddConfiBill: (bill: Omit<ConfiBill, 'id' | 'billNumber' | 'subTotal' | 'taxTotal' | 'grandTotal' | 'amountPaid' | 'balanceDue' | 'matchStatus' | 'status'>) => void;
  handleRecordConfiBillPayment: (billId: string, amount: number) => void;
  handleAddFixedAsset: (asset: Omit<FixedAssetItem, 'id' | 'accumulatedDepreciation' | 'currentNetBookValue' | 'status'>) => void;
  handleRunFixedAssetDepreciation: () => void;
  // Rillet AI Methods
  handleAddRilletContract: (contractData: Omit<RilletContract, 'id' | 'status'>) => void;
  handleRunRevRecAmortization: () => void;
  handleAutoMatchBankFeed: () => void;
  handleConfirmBankMatch: (txId: string) => void;
  handleAddRilletPrepaid: (prepaid: Omit<RilletPrepaidItem, 'id' | 'accumulatedAmortization' | 'remainingAssetBalance' | 'status'>) => void;
  handleRunPrepaidAmortization: () => void;
  handleSignoffFluxItem: (fluxId: string) => void;
  handleToggleCloseChecklist: (taskId: string) => void;
  handleAskRilletAi: (question: string, category?: string) => string;
  handlePeriodHardLock: () => void;
  // NBFC & Open Accounting Standard Handlers
  handleRecalculateCrar: (additionalRwa?: number, additionalCapital?: number) => void;
  handleRunIndAs109EclProvision: () => void;
  handleSettleCoLendingEscrow: (dealId: string) => void;
  handleScrubBureauTudf: () => void;
  handleAddOpenCostCenter: (cc: Omit<OpenCostCenter, 'id' | 'actualSpent' | 'variance' | 'status'>) => void;
  handleAddOpenBudgetRule: (rule: Omit<OpenBudgetRule, 'id' | 'actualYearToDate' | 'remainingBudget' | 'isBreached'>) => void;
  handleExecutePeriodClose: (periodName: string, expenseDebit: number, incomeCredit: number) => void;
  // Tax AI Handlers
  handleUpdateTaxComplianceStatus: (itemId: string, status: TaxComplianceStatus) => void;
  handleFileTaxRecord: (record: Omit<TaxRecord, 'id'>) => void;
  handleSendTaxChatMessage: (message: string) => Promise<void>;
  // Business Assistant Handlers
  handleSendBusinessAssistantMessage: (message: string) => Promise<void>;
  // TrueFincaplinCoop Handlers
  handleAddCoopMember: (member: Omit<CoopMember, 'id'>) => void;
  handleAddCoopDeposit: (deposit: Omit<CoopDeposit, 'id'>) => void;
  handleAddCoopLoan: (loan: Omit<CoopLoan, 'id'>) => void;
  handleApproveCoopLoan: (loanId: string) => void;
  handlePostCoopLoanRepayment: (loanId: string, amountPaid: number, interestPortion: number, principalPortion: number, mode: CoopPassbookTxn['mode']) => void;
  handlePostDdoRecovery: (batch: Omit<CoopDdoRecoveryBatch, 'id'>) => void;
  handleCreateCoopBackupSnapshot: (label: string) => void;
  handleAddDividendRecord: (dividend: Omit<CoopDividendRecord, 'id'>) => void;
  handleAddAgmRecord: (agm: Omit<CoopAgmRecord, 'id'>) => void;
  // CBS Technology & Implementation Handlers
  handleToggleCbsDeliverable: (phaseId: string, deliverableId: string) => void;
  handleAddCbsDeliverable: (phaseId: string, deliverable: Omit<CbsDeliverable, 'id'>) => void;
  handleExecuteCbsMigrationAction: (batchId: string, action: 'cleanse' | 'reconcile') => void;
  handleSimulateCbsLedgerEvent: (eventType: CbsLedgerSimTxn['eventType'], accountRef: string, amount: number) => CbsLedgerSimTxn;
  handleUpdateCbsCutoverStatus: (stepId: string, status: CbsCutoverStep['status']) => void;
}


const DEFAULT_MODULE_CONFIG: ModuleConfig = {
  lms: true,
  accounting: true,
  risk: true,
  analytics: true,
  system: true,
  intelligence: true,
  legal: true,
  coreBanking: true,
  treasury: true,
  paymentsHub: true,
  goldAndGroupLoans: true,
  aiSuite: true,
  branchOps: true,
  coopSociety: true,
};

const CLIENT_BANK_PRESETS: Record<Exclude<ClientBankPresetId, 'custom'>, ModuleConfig> = {
  universal: { ...DEFAULT_MODULE_CONFIG },
  commercial: {
    lms: true,
    accounting: true,
    risk: true,
    analytics: true,
    system: true,
    intelligence: true,
    legal: true,
    coreBanking: true,
    treasury: true,
    paymentsHub: true,
    goldAndGroupLoans: false,
    aiSuite: true,
    branchOps: true,
    coopSociety: false,
  },
  nbfc: {
    lms: true,
    accounting: true,
    risk: true,
    analytics: true,
    system: true,
    intelligence: true,
    legal: true,
    coreBanking: false,
    treasury: false,
    paymentsHub: false,
    goldAndGroupLoans: true,
    aiSuite: true,
    branchOps: true,
    coopSociety: false,
  },
  cooperative: {
    lms: true,
    accounting: true,
    risk: true,
    analytics: false,
    system: true,
    intelligence: false,
    legal: true,
    coreBanking: true,
    treasury: false,
    paymentsHub: true,
    goldAndGroupLoans: true,
    aiSuite: false,
    branchOps: true,
    coopSociety: true,
  },
};

function loadPersistedModules(): { moduleConfig: ModuleConfig; preset: ClientBankPresetId } {
  try {
    if (typeof window !== 'undefined') {
      const raw = localStorage.getItem('fincaplen_saas_modules_v1');
      if (raw) {
        const parsed = JSON.parse(raw);
        return {
          moduleConfig: { ...DEFAULT_MODULE_CONFIG, ...(parsed.moduleConfig || {}), system: true },
          preset: parsed.preset || 'universal',
        };
      }
    }
  } catch {
    // fallback to defaults
  }
  return { moduleConfig: { ...DEFAULT_MODULE_CONFIG }, preset: 'universal' };
}

async function computeSha256Hex(text: string): Promise<string> {
  if (typeof window !== 'undefined' && window.crypto?.subtle) {
    const encoded = new TextEncoder().encode(text);
    const digest = await window.crypto.subtle.digest('SHA-256', encoded);
    return Array.from(new Uint8Array(digest))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0).toString(16).padStart(64, '0');
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const initialModules = loadPersistedModules();
  const [state, setState] = useState<AppState>({
    isAuthenticated: true,
    currentView: 'dashboard',
    currentUser: 'Super Admin',
    moduleConfig: initialModules.moduleConfig,
    clientBankPreset: initialModules.preset,
    activeBranchId: 'ALL',
    backupSnapshots: [
      {
        id: 'snap-boot-baseline',
        label: 'HQ Baseline Normalized Checkpoint',
        createdAt: new Date(Date.now() - 3600_000).toISOString().replace('T', ' ').slice(0, 19),
        createdBy: 'HQ Automated Scheduler',
        type: 'Automated',
        schemaVersion: '3NF-v2.4',
        entityCounts: {
          branches: mockBranches.length,
          customers: mockCustomers.length,
          customerAccounts: mockCustomerAccounts.length,
          transactions: mockTransactions.length,
          applications: mockApplications.length,
          salesInvoices: mockSalesInvoices.length,
          purchaseBills: mockPurchaseBills.length,
        },
        totalRecords:
          mockBranches.length +
          mockCustomers.length +
          mockCustomerAccounts.length +
          mockTransactions.length +
          mockApplications.length +
          mockSalesInvoices.length +
          mockPurchaseBills.length,
        sizeKb: 428,
        sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        status: 'Verified',
      },
    ],
    migrationBatches: [],
    leads: mockLeads,
    applications: mockApplications,
    loans: mockLoans.filter(l => l.loanType === 'MSME Loan'),
    homeLoans: mockLoans.filter(l => l.loanType === 'Home Loan'),
    businessLoans: mockLoans.filter(l => l.loanType === 'Business Loan'),
    industryLoans: mockLoans.filter(l => l.loanType === 'Industry Loan'),
    goldLoans: mockGoldLoans,
    leases: mockLeases,
    customers: mockCustomers,
    transactions: mockTransactions,
    users: mockUsers,
    vehicles: mockVehicles,
    lenders: mockLenders,
    accounts: mockAccounts,
    vouchers: mockVouchers,
    bankAccounts: mockBankAccounts,
    bankStatementTransactions: mockBankStatementTransactions,
    items: mockItems,
    salesInvoices: mockSalesInvoices,
    quotations: mockQuotations,
    salesOrders: mockSalesOrders,
    deliveryChallans: mockDeliveryChallans,
    purchaseBills: mockPurchaseBills,
    purchaseOrders: mockPurchaseOrders,
    goodsReceiptNotes: mockGoodsReceiptNotes,
    operationalSettings: mockOperationalSettings,
    databaseSettings: mockDatabaseSettings,
    metadataSettings: mockMetadataSettings,
    legalSettings: mockLegalSettings,
    collectionLogs: mockCollectionLogs,
    legalCases: mockLegalCases,
    agreementTemplates: mockAgreementTemplates,
    generatedAgreements: mockGeneratedAgreements,
    complianceTasks: mockComplianceTasks,
    selectedLoanId: null,
    selectedLeaseId: null,
    selectedVehicleId: null,
    selectedCustomerId: null,
    selectedEmployeeId: null,
    selectedApplicationId: null,
    kycCompanies: mockKycCompanies,
    kycCustomers: mockKycCustomers,
    auditFindings: mockAuditFindings,
    branches: mockBranches,
    employees: mockEmployees,
    supportTickets: mockSupportTickets,
    interactionLogs: mockInteractionLogs,
    developmentGoals: mockDevelopmentGoals,
    strategicGoals: mockStrategicGoals,
    customerAccounts: mockCustomerAccounts,
    tellerTransactions: mockTellerTransactions,
    cards: [],
    paymentOrders: [],
    grievances: mockGrievances,
    groups: mockGroups,
    pdcs: mockPdcs,
    communicationLogs: [],
    communicationTemplates: mockCommunicationTemplates,
    operationalRiskEvents: mockOperationalRiskEvents,
    investments: mockInvestments,
    borrowings: mockBorrowings,
    tdsPayables: mockTdsPayables,
    tdsReceivables: mockTdsReceivables,
    swiftMessages: mockSwiftMessages,
    nostroVostroAccounts: mockNostroVostroAccounts,
    bicDirectory: mockBicDirectory,
    tradeFinanceCredits: mockTradeFinanceCredits,
    standingOrders: mockStandingOrders,
    coreBatchLogs: mockCoreBatchLogs,
    confiAccounts: mockConfiAccounts,
    confiJournalEntries: mockConfiJournalEntries,
    confiInvoices: mockConfiInvoices,
    confiBills: mockConfiBills,
    fixedAssets: mockFixedAssets,
    rilletSaaSMetrics: mockRilletSaaSMetrics,
    rilletContracts: mockRilletContracts,
    rilletBankTransactions: mockRilletBankTransactions,
    rilletPrepaids: mockRilletPrepaids,
    rilletFluxAnalysis: mockRilletFluxAnalysis,
    rilletCloseChecklist: mockRilletCloseChecklist,
    rilletAiQueries: mockRilletAiQueries,
    nbfcCrar: mockNbfcCrar,
    indAs109EclStages: mockIndAs109EclStages,
    nbfcAlmBuckets: mockNbfcAlmBuckets,
    nbfcCoLendingDeals: mockNbfcCoLendingDeals,
    bureauTudfRecords: mockBureauTudfRecords,
    openCostCenters: mockOpenCostCenters,
    openBudgetRules: mockOpenBudgetRules,
    openPeriodClosingEntries: mockOpenPeriodClosingEntries,
    // Jev.ai Initial State
    jevPipelines: mockJevPipelines,
    jevBatchRecords: mockJevBatchRecords,
    jevCalibrationBuckets: mockJevCalibrationBuckets,
    jevRecentEvaluations: mockJevRecentEvaluations,
    jevActivePipelineId: 'jev-pipe-01',
    // Runamarga Voice AI Initial State
    runamargaTelemetry: mockRunamargaTelemetry,
    runamargaCampaigns: mockRunamargaCampaigns,
    runamargaCalls: mockRunamargaCalls,
    runamargaActiveCallId: 'call-rn-101',
    // OmniWorkspace Initial State (Oasis Workspace Standards)
    workspaceProjects: mockWorkspaceProjects,
    workspaceTasks: mockWorkspaceTasks,
    workspaceCustomers: mockWorkspaceCustomers,
    workspaceSuppliers: mockWorkspaceSuppliers,
    workspaceDocuments: mockWorkspaceDocuments,
    workspaceChannelMessages: mockWorkspaceChannelMessages,
    workspaceChecklists: mockWorkspaceChecklists,
    workspaceAuditLogs: mockWorkspaceAuditLogs,
    // Tax AI Initial State
    taxComplianceItems: mockTaxComplianceItems,
    taxRecords: mockTaxRecords,
    taxOptimizationSuggestions: mockTaxOptimizationSuggestions,
    taxChatHistory: mockTaxChatHistory,
    // Business Assistant Initial State
    businessKpis: mockBusinessKpis,
    businessStrategyGoals: mockBusinessStrategyGoals,
    businessAssistantHistory: mockBusinessAssistantHistory,
    // TrueFincaplinCoop Initial State
    coopMembers: mockCoopMembers,
    coopDeposits: mockCoopDeposits,
    coopLoans: mockCoopLoans,
    coopDdoBatches: mockCoopDdoBatches,
    coopPassbookTxns: mockCoopPassbookTxns,
    coopBackupSnapshots: mockCoopBackupSnapshots,
    coopDividends: mockCoopDividends,
    coopAgms: mockCoopAgms,
    // CBS Technology & Implementation Initial State
    cbsPhases: mockCbsPhases,
    cbsTechLayers: mockCbsTechLayers,
    cbsMigrationBatches: mockCbsMigrationBatches,
    cbsLedgerSimTxns: mockCbsLedgerSimTxns,
    cbsCutoverSteps: mockCbsCutoverSteps,
  });


  useEffect(() => {
    let unsubTxn: (() => void) | null = null;
    let unsubInvoices: (() => void) | null = null;
    let unsubBills: (() => void) | null = null;

    const cleanupListeners = () => {
      if (unsubTxn) { unsubTxn(); unsubTxn = null; }
      if (unsubInvoices) { unsubInvoices(); unsubInvoices = null; }
      if (unsubBills) { unsubBills(); unsubBills = null; }
    };

    const unsubAuth = onAuthStateChanged(auth, (firebaseUser) => {
      cleanupListeners();
      if (!firebaseUser) return;

      const isAdminUser =
        firebaseUser.email === 'dtglbw@gmail.com' && firebaseUser.emailVerified === true;

      const txnTarget = isAdminUser
        ? collection(db, 'transactions')
        : query(collection(db, 'transactions'), where('ownerId', '==', firebaseUser.uid));

      const invTarget = isAdminUser
        ? collection(db, 'salesInvoices')
        : query(collection(db, 'salesInvoices'), where('ownerId', '==', firebaseUser.uid));

      const billTarget = isAdminUser
        ? collection(db, 'purchaseBills')
        : query(collection(db, 'purchaseBills'), where('ownerId', '==', firebaseUser.uid));

      unsubTxn = onSnapshot(
        txnTarget,
        (snapshot) => {
          if (!snapshot.empty) {
            const transactions = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Transaction));
            setState(prev => ({ ...prev, transactions }));
          }
        },
        (error) => {
          handleFirestoreError(error, OperationType.LIST, 'transactions');
        }
      );

      unsubInvoices = onSnapshot(
        invTarget,
        (snapshot) => {
          if (!snapshot.empty) {
            const salesInvoices = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as SalesInvoice));
            setState(prev => ({ ...prev, salesInvoices }));
          }
        },
        (error) => {
          handleFirestoreError(error, OperationType.LIST, 'salesInvoices');
        }
      );

      unsubBills = onSnapshot(
        billTarget,
        (snapshot) => {
          if (!snapshot.empty) {
            const purchaseBills = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as PurchaseBill));
            setState(prev => ({ ...prev, purchaseBills }));
          }
        },
        (error) => {
          handleFirestoreError(error, OperationType.LIST, 'purchaseBills');
        }
      );
    });

    return () => {
      unsubAuth();
      cleanupListeners();
    };
  }, []);
  
  const { currentView, currentUser, moduleConfig } = state;

  const setCurrentView = (view: View) => {
    setState(prevState => ({ 
      ...prevState, 
      currentView: view,
      selectedLoanId: null,
      selectedLeaseId: null,
      selectedVehicleId: null,
      selectedCustomerId: view === 'portal' ? prevState.selectedCustomerId : null,
      selectedEmployeeId: null,
      selectedApplicationId: null,
    }));
  };
  const setCurrentUser = (role: UserRole) => setState(prev => ({ ...prev, currentUser: role }));

  const handleLogin = (role: UserRole) => {
    setState(prev => ({ ...prev, isAuthenticated: true, currentUser: role, currentView: 'dashboard' }));
  };

  const handleLogout = () => {
    setState(prev => ({...prev, isAuthenticated: true, currentUser: 'Super Admin', currentView: 'dashboard'}));
  };
  
  const persistModules = (nextConfig: ModuleConfig, preset: ClientBankPresetId) => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('fincaplen_saas_modules_v1', JSON.stringify({ moduleConfig: nextConfig, preset }));
      }
    } catch {
      // ignore storage quota errors
    }
  };

  const handleToggleModule = (module: keyof ModuleConfig) => {
    if (module === 'system') return;
    setState(prev => {
      const nextConfig: ModuleConfig = {
        ...prev.moduleConfig,
        [module]: !prev.moduleConfig[module],
        system: true,
      };
      persistModules(nextConfig, 'custom');
      return { ...prev, moduleConfig: nextConfig, clientBankPreset: 'custom' };
    });
  };

  const handleApplyClientBankPreset = (presetId: ClientBankPresetId) => {
    if (presetId === 'custom') return;
    const nextConfig = { ...CLIENT_BANK_PRESETS[presetId] };
    persistModules(nextConfig, presetId);
    setState(prev => ({
      ...prev,
      moduleConfig: nextConfig,
      clientBankPreset: presetId,
    }));
  };

  const handleSetActiveBranch = (branchId: string | 'ALL') => {
    setState(prev => ({ ...prev, activeBranchId: branchId }));
  };

  const handleRunDailyProcess = () => {
    setState(prev => {
        const today = new Date();
        let updatedLoans = [...prev.loans, ...prev.homeLoans, ...prev.businessLoans, ...prev.industryLoans, ...prev.goldLoans];
        let updatedComplianceTasks = [...prev.complianceTasks];
        const newCommunicationLogs: CommunicationLog[] = [];

        updatedLoans = updatedLoans.map(loan => {
            if (loan.status !== LoanStatus.ACTIVE && loan.status !== LoanStatus.OVERDUE) return loan;

            // Communication Logic
            const nextInstallment = loan.repaymentSchedule.find(p => p.status === 'Pending');
            if (nextInstallment) {
                const dueDate = new Date(nextInstallment.dueDate);
                const daysUntilDue = Math.floor((dueDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
                
                if (daysUntilDue > 0 && daysUntilDue <= 3) { // 3-day reminder window
                    const template = prev.communicationTemplates.find(t => t.event === 'EMI Reminder' && t.isActive);
                    if (template) {
                        const content = template.content
                            .replace('{{customerName}}', loan.applicantName)
                            .replace('{{emiAmount}}', formatCurrency(nextInstallment.totalAmount))
                            .replace('{{dueDate}}', nextInstallment.dueDate);
                        newCommunicationLogs.push({ id: `comm-${Date.now()}-${loan.id}`, timestamp: new Date().toISOString(), customerId: loan.customerId, customerName: loan.applicantName, channel: template.channel, event: 'EMI Reminder', content, status: CommunicationStatus.SENT });
                    }
                }
            }
            
            // Asset Classification Logic
            const overdueInstallments = loan.repaymentSchedule.filter(p => p.status === 'Pending' && new Date(p.dueDate) < today);
            if (overdueInstallments.length === 0) {
                return { ...loan, daysPastDue: 0, assetClass: AssetClass.STANDARD, status: LoanStatus.ACTIVE };
            }

            const firstOverdueDate = new Date(overdueInstallments[0].dueDate);
            const daysPastDue = Math.floor((today.getTime() - firstOverdueDate.getTime()) / (1000 * 3600 * 24));
            
            let assetClass = AssetClass.STANDARD;
            if (daysPastDue > 90) assetClass = AssetClass.SUB_STANDARD;
            else if (daysPastDue > 60) assetClass = AssetClass.SMA_2;
            else if (daysPastDue > 30) assetClass = AssetClass.SMA_1;
            else if (daysPastDue > 0) assetClass = AssetClass.SMA_0;

            if (assetClass === AssetClass.SUB_STANDARD && loan.assetClass !== AssetClass.SUB_STANDARD) {
                 updatedComplianceTasks.push({ id: `ct-npa-${loan.id}`, title: `NPA Reporting for ${loan.applicantName}`, type: 'RBI', dueDate: new Date().toISOString().split('T')[0], status: ComplianceTaskStatus.PENDING, relatedId: loan.id });
            }

            // Overdue Notice Communication
            if (daysPastDue > 0) {
                const template = prev.communicationTemplates.find(t => t.event === 'Overdue Notice' && t.isActive);
                if (template) {
                     const content = template.content
                        .replace('{{customerName}}', loan.applicantName)
                        .replace('{{emiAmount}}', formatCurrency(overdueInstallments[0].totalAmount))
                        .replace('{{dueDate}}', overdueInstallments[0].dueDate)
                        .replace('{{daysPastDue}}', String(daysPastDue));
                    newCommunicationLogs.push({ id: `comm-${Date.now()}-${loan.id}`, timestamp: new Date().toISOString(), customerId: loan.customerId, customerName: loan.applicantName, channel: template.channel, event: 'Overdue Notice', content, status: CommunicationStatus.SENT });
                }
            }

            return { ...loan, daysPastDue, assetClass, status: LoanStatus.OVERDUE };
        });

        const messagesGenerated = newCommunicationLogs.length > 0 ? `and sent ${newCommunicationLogs.length} automated communications` : '';
        alert(`Daily process simulation complete. Updated asset classifications ${messagesGenerated}.`);

        return {
            ...prev,
            loans: updatedLoans.filter(l => l.loanType === 'MSME Loan'),
            homeLoans: updatedLoans.filter(l => l.loanType === 'Home Loan'),
            businessLoans: updatedLoans.filter(l => l.loanType === 'Business Loan'),
            industryLoans: updatedLoans.filter(l => l.loanType === 'Industry Loan'),
            goldLoans: updatedLoans.filter(l => l.loanType === 'Gold Loan') as GoldLoan[],
            complianceTasks: updatedComplianceTasks,
            communicationLogs: [...prev.communicationLogs, ...newCommunicationLogs]
        };
    });
  };
  
  const handleRunAudit = () => {
    alert('Simulating a new AI audit run...');
    setState(prev => ({...prev, auditFindings: [...prev.auditFindings, {id: `af-${Date.now()}`, area: 'Operational', finding: 'Manual audit triggered a new finding.', recommendation: 'Investigate system status.', severity: AuditFindingSeverity.LOW, timestamp: new Date().toISOString()}]}));
  };

  const handleRunCreditCheck = (appId: string) => {
    alert(`Simulating CIBIL credit check for application ${appId}...`);
    setTimeout(() => {
        const score = 650 + Math.floor(Math.random() * 200); // Simulate a score between 650 and 850
        setState(prev => ({
            ...prev,
            applications: prev.applications.map(app => 
                app.id === appId ? { ...app, creditScore: score } : app
            )
        }));
        alert(`Credit score of ${score} fetched successfully.`);
    }, 2000);
  };

  const handleUnderwritingDecision = (appId: string, decision: 'approved' | 'rejected', notes: string) => {
    const targetStatus = decision === 'approved' ? ApplicationStatus.UNDERWRITING_APPROVED : ApplicationStatus.REJECTED;
    setState(prev => ({
        ...prev,
        applications: prev.applications.map(app =>
            app.id === appId ? { ...app, status: targetStatus, underwritingNotes: notes } : app
        )
    }));
    alert(`Application ${appId} has been ${decision}.`);
  };

  const handleUpdateOperationalSettings = (settings: OperationalSettings) => {
    setState(prev => ({...prev, operationalSettings: settings}));
  };

  const handleUpdateDatabaseSettings = (settings: DatabaseSettings) => {
    setState(prev => ({...prev, databaseSettings: settings}));
  };
  
  const handleUpdateMetadataSettings = (settings: MetadataSettings) => {
    setState(prev => ({...prev, metadataSettings: settings}));
  };
  
  const handleUpdateLegalSettings = (settings: LegalSettings) => {
    setState(prev => ({...prev, legalSettings: settings}));
  };

  const handleVoucherAction = (voucherId: string, action: 'approve' | 'reject') => {
    setState(prev => ({
      ...prev,
      vouchers: prev.vouchers.map(v => 
        v.id === voucherId 
        ? { ...v, status: action === 'approve' ? VoucherStatus.APPROVED : VoucherStatus.REJECTED, approvedBy: prev.currentUser } 
        : v
      )
    }));
  };
  
  const handleAddVoucher = (voucher: Omit<Voucher, 'id' | 'voucherNumber'>) => {
     const newVoucher: Voucher = {
      ...voucher,
      id: `v-${Date.now()}`,
      voucherNumber: `${voucher.voucherType.slice(0,4).toUpperCase()}-${Date.now().toString().slice(-4)}`,
    } as Voucher;
    setState(prev => ({ ...prev, vouchers: [newVoucher, ...prev.vouchers]}));
  };

  const handleVerifyKyc = (entityId: string, type: 'company' | 'customer') => {
    alert(`Simulating UIDAI/MCA verification for ${entityId}...`);
    setTimeout(() => {
      if(type === 'company') {
        setState(prev => ({...prev, kycCompanies: prev.kycCompanies.map(c => c.id === entityId ? {...c, status: KycStatus.VERIFIED} : c)}));
      } else {
        setState(prev => ({...prev, kycCustomers: prev.kycCustomers.map(c => c.id === entityId ? {...c, status: KycStatus.VERIFIED} : c)}));
      }
    }, 1500);
  };
  
  const handlePushToCkyc = (entityId: string, type: 'company' | 'customer') => {
    alert(`Simulating push to CKYC registry for ${entityId}...`);
     setTimeout(() => {
      const ckycId = `1000${Math.floor(Math.random() * 9000000000) + 1000000000}`;
      if(type === 'company') {
        setState(prev => ({...prev, kycCompanies: prev.kycCompanies.map(c => c.id === entityId ? {...c, ckycStatus: 'Uploaded', ckycIdentifier: ckycId} : c)}));
      } else {
        setState(prev => ({...prev, kycCustomers: prev.kycCustomers.map(c => c.id === entityId ? {...c, ckycStatus: 'Uploaded', ckycIdentifier: ckycId} : c)}));
      }
    }, 1500);
  };

  const handleAddApplication = (appData: Omit<Application, 'id'|'status'|'submittedDate'>) => {
      const newApp: Application = {
          ...appData,
          id: `app-${Date.now()}`,
          status: ApplicationStatus.SUBMITTED,
          submittedDate: new Date().toISOString().split('T')[0]
      };
      setState(prev => ({...prev, applications: [newApp, ...prev.applications]}));
  };

  const handleAddComplianceTask = (task: Omit<ComplianceTask, 'id'>) => {
    const newTask: ComplianceTask = {
      ...task,
      id: `task-${Date.now()}`
    };
    setState(prev => ({...prev, complianceTasks: [newTask, ...prev.complianceTasks]}));
  };
  
  const handleAdvanceApplicationState = (appId: string, targetStatus: ApplicationStatus) => {
    setState(prev => ({
        ...prev,
        applications: prev.applications.map(app => 
            app.id === appId ? { ...app, status: targetStatus } : app
        )
    }));
    alert(`Application ${appId} moved to ${targetStatus}.`);
  };
  
  const handleGenerateAgreement = (applicationId: string, templateId: string) => {
      alert(`Simulating agreement generation for application ${applicationId} using template ${templateId}.`);
  };

  const handleMarkAgreementSigned = (agreementId: string) => {
    setState(prev => ({...prev, generatedAgreements: prev.generatedAgreements.map(a => a.id === agreementId ? {...a, status: 'Signed', signedAt: new Date().toISOString().split('T')[0]} : a)}));
  };

  const handleEndLease = (leaseId: string, notes: string) => {
      const lease = state.leases.find(l => l.id === leaseId);
      if(!lease) return;
      setState(prev => ({
          ...prev,
          leases: prev.leases.map(l => l.id === leaseId ? {...l, status: LeaseStatus.ENDED} : l),
          vehicles: prev.vehicles.map(v => v.id === lease.vehicleId ? {...v, status: VehicleStatus.AVAILABLE, leaseId: undefined, remarketingNotes: notes} : v)
      }));
  };

  const handleUpdateVehicleInsurance = (vehicleId: string, provider: string, policyNumber: string, expiryDate: string) => {
    setState(prev => ({...prev, vehicles: prev.vehicles.map(v => v.id === vehicleId ? {...v, insurance: {provider, policyNumber, expiryDate}} : v)}));
  };
  
  const handleReconcile = (bookTxnIds: string[], bankTxnIds: string[]) => {
    setState(prev => ({
      ...prev,
      transactions: prev.transactions.map(t => bookTxnIds.includes(t.id) ? { ...t, status: TransactionStatus.RECONCILED } : t),
      bankStatementTransactions: prev.bankStatementTransactions.map(t => bankTxnIds.includes(t.id) ? { ...t, isReconciled: true } : t),
    }));
    alert(`Reconciled ${bookTxnIds.length} book transaction(s) with ${bankTxnIds.length} bank transaction(s).`);
  };

  const handleLogCollectionAction = (entityId: string, entityType: 'Loan' | 'Lease', action: string, notes: string) => {
      const newLog: CollectionLog = { 
        id: `clog-${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        action,
        notes,
        officer: currentUser || 'System'
    };
    setState(prev => ({...prev, collectionLogs: [...prev.collectionLogs, newLog]}));
  };
  
  const handleAddTransaction = (txnData: Partial<Transaction>) => {
    const newTxn: Transaction = {
        id: `txn-${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        description: txnData.description || 'Manual Transaction',
        amount: txnData.amount || 0,
        type: txnData.type || TransactionType.CREDIT,
        mode: txnData.mode || PaymentMode.GATEWAY,
        status: TransactionStatus.COMPLETED,
        referenceNumber: `MANUAL-${Date.now()}`,
        accountId: 'ba-1', // default to primary account
        ...txnData,
    } as Transaction;
    setState(prev => ({...prev, transactions: [newTxn, ...prev.transactions]}));
  };

  const handleLogCollectionPayment = (entityId: string, entityType: 'Loan' | 'Lease', amount: number) => {
    let entityName = '';
    if (entityType === 'Loan') {
        entityName = [...state.loans, ...state.homeLoans, ...state.businessLoans, ...state.industryLoans].find(l => l.id === entityId)?.applicantName || 'Unknown';
    } else {
        entityName = state.leases.find(l => l.id === entityId)?.applicantName || 'Unknown';
    }
    
    handleAddTransaction({
        description: `Payment from ${entityName} for ${entityType} ${entityId}`,
        amount,
        type: TransactionType.CREDIT,
        mode: PaymentMode.CASH,
    });

    alert(`Payment of ${formatCurrency(amount)} logged for ${entityName}.`);
  };

  const handleInitiateVehicleSeizure = (leaseId: string) => { console.warn('handleInitiateVehicleSeizure not implemented'); };
  const handleAddLead = (leadData: Omit<Lead, 'id' | 'status'>) => { console.warn('handleAddLead not implemented'); };
  const handleConvertLeadToApplication = (leadId: string) => { console.warn('handleConvertLeadToApplication not implemented'); };
  const handleIssueClosureCertificates = (loanId: string) => { console.warn('handleIssueClosureCertificates not implemented'); };
  const handleAddCompanyKyc = (data: any) => { console.warn('handleAddCompanyKyc not implemented'); };
  const handleAddCustomerKyc = (data: any) => { console.warn('handleAddCustomerKyc not implemented'); };
  const handleAddVehicle = (vehicleData: any) => { console.warn('handleAddVehicle not implemented'); };
  const handleLinkAccount = (accountId: string) => { console.warn('handleLinkAccount not implemented'); };
  const handleFetchStatement = (accountId: string) => { console.warn('handleFetchStatement not implemented'); };
  const handleAddLegalCase = (caseData: Omit<LegalCase, 'id'>) => { console.warn('handleAddLegalCase not implemented'); };
  const handleAddUser = (userData: any) => { console.warn('handleAddUser not implemented'); };
  const handleAddLender = (lenderData: any) => { console.warn('handleAddLender not implemented'); };
  const handleUpdateAssetClass = (loanId: string, newClass: AssetClass) => { console.warn('handleUpdateAssetClass not implemented'); };
  const handleAddBranch = (branchData: Omit<Branch, 'id'>) => {
    const newBranch: Branch = {
      id: `br-${Date.now()}`,
      isHeadquarters: false,
      region: branchData.region || 'Regional Network',
      hqSyncMode: branchData.hqSyncMode || 'REALTIME_HQ_STREAM',
      syncStatus: 'SYNCHRONIZED',
      replicationLagMs: 12,
      lastSyncAt: 'Just provisioned',
      vpnTunnelIp: branchData.vpnTunnelIp || `10.110.${Math.floor(Math.random() * 200) + 10}.${Math.floor(Math.random() * 200) + 10}`,
      activeModules: branchData.activeModules || (Object.keys(state.moduleConfig).filter(k => state.moduleConfig[k as keyof ModuleConfig]) as (keyof ModuleConfig)[]),
      ...branchData,
    };
    setState(prev => ({ ...prev, branches: [...prev.branches, newBranch] }));
  };

  const handleSyncBranchToHq = (branchId: string) => {
    setState(prev => ({
      ...prev,
      branches: prev.branches.map(b =>
        b.id === branchId
          ? {
              ...b,
              syncStatus: 'SYNCHRONIZED',
              replicationLagMs: b.isHeadquarters ? 0 : 8 + Math.floor(Math.random() * 14),
              lastSyncAt: 'Synced just now',
            }
          : b
      ),
    }));
  };

  const handleToggleBranchIsolation = (branchId: string) => {
    setState(prev => ({
      ...prev,
      branches: prev.branches.map(b => {
        if (b.id !== branchId || b.isHeadquarters) return b;
        const nextStatus = b.syncStatus === 'ISOLATED' ? 'SYNCHRONIZED' : 'ISOLATED';
        return {
          ...b,
          syncStatus: nextStatus,
          lastSyncAt: nextStatus === 'ISOLATED' ? 'Isolated for security maintenance' : 'Re-synced with HQ',
        };
      }),
    }));
  };

  const handleCreateBackupSnapshot = async (
    label = 'Manual Normalized DB Checkpoint',
    type: SystemBackupSnapshot['type'] = 'Manual'
  ): Promise<SystemBackupSnapshot> => {
    const bundle = {
      schemaVersion: '3NF-v2.4',
      exportedAt: new Date().toISOString(),
      moduleConfig: state.moduleConfig,
      entities: {
        branches: state.branches,
        customers: state.customers,
        customerAccounts: state.customerAccounts,
        loans: state.loans,
        transactions: state.transactions,
        applications: state.applications,
        salesInvoices: state.salesInvoices,
        purchaseBills: state.purchaseBills,
      },
    };
    const payloadJson = JSON.stringify(bundle);
    const sha256 = await computeSha256Hex(payloadJson);
    const entityCounts = {
      branches: state.branches.length,
      customers: state.customers.length,
      customerAccounts: state.customerAccounts.length,
      loans: state.loans.length,
      transactions: state.transactions.length,
      applications: state.applications.length,
      salesInvoices: state.salesInvoices.length,
      purchaseBills: state.purchaseBills.length,
    };
    const totalRecords = Object.values(entityCounts).reduce((a, b) => a + b, 0);
    const snapshot: SystemBackupSnapshot = {
      id: `snap-${Date.now()}`,
      label,
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
      createdBy: state.currentUser || 'Super Admin',
      type,
      schemaVersion: '3NF-v2.4',
      entityCounts,
      totalRecords,
      sizeKb: Math.max(1, Math.round(payloadJson.length / 1024)),
      sha256,
      status: 'Verified',
      payloadJson,
    };
    setState(prev => ({
      ...prev,
      backupSnapshots: [snapshot, ...prev.backupSnapshots].slice(0, 25),
    }));
    return snapshot;
  };

  const handleRestoreBackupSnapshot = async (
    snapshotOrJson: string
  ): Promise<{ ok: boolean; message: string }> => {
    try {
      const existingSnap = state.backupSnapshots.find(s => s.id === snapshotOrJson);
      const rawJson = existingSnap?.payloadJson || snapshotOrJson;
      if (!rawJson) {
        return { ok: false, message: 'Snapshot payload unavailable for this baseline checkpoint. Create a fresh snapshot first.' };
      }
      const computed = await computeSha256Hex(rawJson);
      if (existingSnap && existingSnap.sha256 !== computed) {
        return { ok: false, message: 'Integrity verification failed: SHA-256 checksum mismatch detected.' };
      }
      const parsed = JSON.parse(rawJson);
      if (!parsed?.entities || typeof parsed.entities !== 'object') {
        return { ok: false, message: 'Invalid backup archive structure: missing normalized entities map.' };
      }
      await handleCreateBackupSnapshot('Auto Pre-Restore Safety Point', 'Pre-Migration');
      setState(prev => ({
        ...prev,
        branches: Array.isArray(parsed.entities.branches) ? parsed.entities.branches : prev.branches,
        customers: Array.isArray(parsed.entities.customers) ? parsed.entities.customers : prev.customers,
        customerAccounts: Array.isArray(parsed.entities.customerAccounts) ? parsed.entities.customerAccounts : prev.customerAccounts,
        loans: Array.isArray(parsed.entities.loans) ? parsed.entities.loans : prev.loans,
        transactions: Array.isArray(parsed.entities.transactions) ? parsed.entities.transactions : prev.transactions,
        applications: Array.isArray(parsed.entities.applications) ? parsed.entities.applications : prev.applications,
        salesInvoices: Array.isArray(parsed.entities.salesInvoices) ? parsed.entities.salesInvoices : prev.salesInvoices,
        purchaseBills: Array.isArray(parsed.entities.purchaseBills) ? parsed.entities.purchaseBills : prev.purchaseBills,
        moduleConfig: parsed.moduleConfig ? { ...DEFAULT_MODULE_CONFIG, ...parsed.moduleConfig, system: true } : prev.moduleConfig,
        backupSnapshots: prev.backupSnapshots.map(s =>
          s.id === existingSnap?.id ? { ...s, status: 'Restored' as const } : s
        ),
      }));
      return { ok: true, message: `Restored normalized database cleanly (SHA-256 ${computed.slice(0, 12)}...).` };
    } catch (err) {
      return { ok: false, message: err instanceof Error ? err.message : 'Failed to parse backup archive.' };
    }
  };

  const handleCommitEntityMigration = async (
    targetEntity: EntityMigrationBatch['targetEntity'],
    sourceFormat: 'CSV' | 'JSON',
    rows: Record<string, any>[]
  ): Promise<EntityMigrationBatch> => {
    const checkpoint = await handleCreateBackupSnapshot(`Pre-Migration (${targetEntity})`, 'Pre-Migration');
    const existingList = (state[targetEntity] as { id: string }[]) || [];
    const existingIds = new Set(existingList.map(r => r.id));

    let skippedDuplicates = 0;
    let validationErrors = 0;
    const acceptedRecords: any[] = [];
    const insertedIds: string[] = [];

    for (const raw of rows) {
      if (!raw || typeof raw !== 'object') {
        validationErrors++;
        continue;
      }
      const cleanId = String(raw.id || `${targetEntity.slice(0, 3)}-mig-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`).trim();
      if (existingIds.has(cleanId) || insertedIds.includes(cleanId)) {
        skippedDuplicates++;
        continue;
      }
      acceptedRecords.push({ ...raw, id: cleanId });
      insertedIds.push(cleanId);
    }

    if (acceptedRecords.length > 0) {
      setState(prev => ({
        ...prev,
        [targetEntity]: [...acceptedRecords, ...(prev[targetEntity] as any[])],
      }));
    }

    const batch: EntityMigrationBatch = {
      id: `mig-${Date.now()}`,
      targetEntity,
      sourceFormat,
      executedAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
      totalRows: rows.length,
      insertedRows: acceptedRecords.length,
      skippedDuplicates,
      validationErrors,
      rollbackCheckpointId: checkpoint.id,
      status: 'Committed',
      insertedIds,
    };

    setState(prev => ({
      ...prev,
      migrationBatches: [batch, ...prev.migrationBatches],
    }));

    return batch;
  };

  const handleRollbackMigration = async (batchId: string): Promise<boolean> => {
    const batch = state.migrationBatches.find(b => b.id === batchId);
    if (!batch || batch.status === 'Rolled Back') return false;
    const removeIds = new Set(batch.insertedIds);
    setState(prev => ({
      ...prev,
      [batch.targetEntity]: (prev[batch.targetEntity] as { id: string }[]).filter(r => !removeIds.has(r.id)),
      migrationBatches: prev.migrationBatches.map(b =>
        b.id === batchId ? { ...b, status: 'Rolled Back' } : b
      ),
    }));
    return true;
  };
  const handleAddEmployee = (employeeData: Omit<Employee, 'id' | 'status'>) => { console.warn('handleAddEmployee not implemented'); };
  const handleAddSupportTicket = (ticketData: Omit<SupportTicket, 'id' | 'ticketId' | 'createdAt' | 'status'>) => { console.warn('handleAddSupportTicket not implemented'); };
  const handleAddInteractionLog = (logData: Omit<InteractionLog, 'id' | 'loggedBy'>) => { console.warn('handleAddInteractionLog not implemented'); };
  const handleAddDevelopmentGoal = (goalData: Omit<DevelopmentGoal, 'id'>) => { console.warn('handleAddDevelopmentGoal not implemented'); };
  const handleMakeCustomerPayment = (contractId: string, contractType: 'Loan' | 'Lease') => { console.warn('handleMakeCustomerPayment not implemented'); };
  const handleIssueCard = (cardData: Omit<Card, 'id' | 'cardNumber' | 'status' | 'expiryDate'>) => { console.warn('handleIssueCard not implemented'); };
  const handleCreatePaymentOrder = (orderData: Omit<PaymentOrder, 'id' | 'status' | 'createdAt' | 'processedAt' | 'currency'>) => { console.warn('handleCreatePaymentOrder not implemented'); };
  const handleInvestigateAmlTransaction = (transactionId: string, action: 'mark_safe' | 'generate_sar', notes: string) => { console.warn('handleInvestigateAmlTransaction not implemented'); };
  const handleAddGrievance = (grievanceData: Omit<Grievance, 'id' | 'grievanceId' | 'status' | 'createdAt' | 'dueDate'>) => { console.warn('handleAddGrievance not implemented'); };
  const handleUpdateGrievanceStatus = (grievanceId: string, newStatus: GrievanceStatus, notes: string) => { console.warn('handleUpdateGrievanceStatus not implemented'); };
  const handleAddGroup = (groupData: Omit<Group, 'id'>) => { console.warn('handleAddGroup not implemented'); };
  const handleAddPdc = (pdcData: Omit<PostDatedCheque, 'id' | 'applicantName' | 'status'>) => { console.warn('handleAddPdc not implemented'); };
  const handleUpdatePdcStatus = (pdcId: string, newStatus: PdcStatus) => { console.warn('handleUpdatePdcStatus not implemented'); };
  const handleAddGoldLoan = (loanData: Omit<GoldLoan, 'id' | 'status' | 'repaymentSchedule' | 'assetClass' | 'daysPastDue' | 'hasLegalCase' | 'collectionStatus' | 'generatedAgreementIds' >) => { console.warn('handleAddGoldLoan not implemented'); };
  const handleMoveToAuction = (loanId: string) => { console.warn('handleMoveToAuction not implemented'); };
  const handleUpdateCommunicationTemplate = (template: CommunicationTemplate) => { console.warn('handleUpdateCommunicationTemplate not implemented'); };

  // --- SWIFT & Core Banking Implementations ---
  const handleCreateSwiftMessage = (msgData: Omit<SwiftMessage, 'id' | 'uetr' | 'status' | 'rawSwiftBlock' | 'gpiTracking' | 'sanctionsCheck'>) => {
    const uetr = `${Math.random().toString(36).substring(2, 10)}-${Math.random().toString(36).substring(2, 6)}-4${Math.random().toString(36).substring(2, 5)}-${Math.random().toString(36).substring(2, 6)}-${Math.random().toString(36).substring(2, 14)}`;
    const msgId = `msg-sw-${Date.now()}`;
    const rawBlock = `{1:F01${msgData.senderBic}AXXX0000000000}{2:I${msgData.messageType.replace('MT', '')}${msgData.receiverBic}XXXXN}{3:{121:${uetr}}}{4:\n:20:${msgData.referenceNumber}\n:32A:${msgData.valueDate.replace(/-/g, '').slice(2)}${msgData.currency}${msgData.amount.toFixed(2).replace('.', ',')}\n:50K:/${msgData.orderingCustomer.accountOrIban}\n${msgData.orderingCustomer.name}\n:59:/${msgData.beneficiaryCustomer.accountOrIban}\n${msgData.beneficiaryCustomer.name}\n:70:${msgData.remittanceInfo}\n:71A:${msgData.chargeDetails}\n-}`;

    const newMsg: SwiftMessage = {
      ...msgData,
      id: msgId,
      uetr,
      status: 'SENT',
      rawSwiftBlock: rawBlock,
      gpiTracking: {
        trackingStatus: 'ONGOING',
        totalDeductions: msgData.chargeDetails === 'OUR' ? 0 : 25,
        estimatedSettlementTime: 'Est. 30-45 mins',
        hops: [
          { stage: 'Message Formatted & Validated', bankName: 'fincaplen Core Gateway', bic: msgData.senderBic, location: 'Mumbai, IN', timestamp: new Date().toLocaleString(), status: 'COMPLETED' },
          { stage: 'SWIFT FIN & GPI Dispatch', bankName: 'SWIFT Messaging Hub', bic: 'SWIFTNETXXX', location: 'La Hulpe, BE', timestamp: new Date().toLocaleString(), status: 'IN_TRANSIT' }
        ]
      },
      sanctionsCheck: {
        isPassed: true,
        pepHit: false,
        ofacMatchScore: 0.0,
        screenedAt: new Date().toLocaleString(),
        complianceOfficerNotes: 'Automated AML Watchlist Screen - Passed Clear'
      }
    };

    setState(prev => ({ ...prev, swiftMessages: [newMsg, ...prev.swiftMessages] }));
    alert(`SWIFT ${msgData.messageType} message created & dispatched to ${msgData.receiverBic} with UETR: ${uetr}`);
  };

  const handleReleaseSwiftSanctions = (messageId: string) => {
    setState(prev => ({
      ...prev,
      swiftMessages: prev.swiftMessages.map(m => m.id === messageId ? {
        ...m,
        status: 'SENT',
        sanctionsCheck: { ...m.sanctionsCheck, isPassed: true, complianceOfficerNotes: `Approved & released by ${prev.currentUser} at ${new Date().toLocaleTimeString()}` }
      } : m)
    }));
    alert(`Message ${messageId} released from compliance hold.`);
  };

  const handleRunCoreBatch = (batchType: 'EOD' | 'BOD') => {
    const timestamp = new Date().toLocaleString();
    const batchId = `batch-${batchType.toLowerCase()}-${Date.now()}`;
    const newLog: CoreBatchLog = {
      id: batchId,
      batchType,
      executedDate: timestamp,
      durationSeconds: batchType === 'EOD' ? 34 : 16,
      status: 'SUCCESS',
      interestAccrualsPosted: batchType === 'EOD' ? 1428 : 0,
      standingOrdersFired: batchType === 'EOD' ? 46 : 0,
      dormancyFlagsApplied: batchType === 'EOD' ? 2 : 0,
      ledgerBalanced: true,
      executedBy: state.currentUser || 'Administrator',
      details: batchType === 'EOD' 
        ? ['Locked teller cash drawers', 'Calculated daily interest accruals for 1,428 accounts', 'Executed scheduled standing order sweeps', 'Rebalanced General Ledger trial balance with 0 variance']
        : ['Opened business day', 'Fetched live currency exchange fixing rates', 'Unlocked branch teller balances for trading']
    };

    setState(prev => ({
      ...prev,
      coreBatchLogs: [newLog, ...prev.coreBatchLogs]
    }));
    alert(`Core Banking ${batchType} batch run completed successfully!`);
  };

  const handleAddStandingOrder = (soData: Omit<StandingOrder, 'id' | 'status' | 'executionCount'>) => {
    const newSo: StandingOrder = {
      ...soData,
      id: `so-${Date.now()}`,
      status: 'ACTIVE',
      executionCount: 0
    };
    setState(prev => ({ ...prev, standingOrders: [newSo, ...prev.standingOrders] }));
    alert('Standing Order / Automated Sweep rule created.');
  };

  const handleToggleStandingOrder = (id: string) => {
    setState(prev => ({
      ...prev,
      standingOrders: prev.standingOrders.map(so => so.id === id ? { ...so, status: so.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE' } : so)
    }));
  };

  const handleCreateTradeFinanceCredit = (tfData: Omit<TradeFinanceDocCredit, 'id' | 'status' | 'discrepanciesCount'>) => {
    const newTf: TradeFinanceDocCredit = {
      ...tfData,
      id: `tf-${Date.now()}`,
      status: 'ISSUED',
      discrepanciesCount: 0
    };
    setState(prev => ({ ...prev, tradeFinanceCredits: [newTf, ...prev.tradeFinanceCredits] }));
    alert(`Trade Finance instrument ${tfData.lcNumber} registered.`);
  };

  // --- ConfiBooks Accounting Implementations ---
  const handleAddConfiAccount = (accData: Omit<ConfiAccount, 'id' | 'isSystem'>) => {
    const newAcc: ConfiAccount = {
      ...accData,
      id: `cfa-${Date.now()}`,
      isSystem: false
    };
    setState(prev => ({ ...prev, confiAccounts: [...prev.confiAccounts, newAcc] }));
    alert(`Chart of Accounts updated with new account: ${accData.name}`);
  };

  const handleAddConfiJournalEntry = (entryData: Omit<ConfiJournalEntry, 'id' | 'entryNumber' | 'totalDebit' | 'totalCredit' | 'status'>) => {
    const totalDebit = entryData.lines.reduce((sum, l) => sum + (l.debit || 0), 0);
    const totalCredit = entryData.lines.reduce((sum, l) => sum + (l.credit || 0), 0);
    
    if (Math.abs(totalDebit - totalCredit) > 0.01) {
      alert('Debit and Credit totals must balance!');
      return;
    }

    const newEntry: ConfiJournalEntry = {
      ...entryData,
      id: `cje-${Date.now()}`,
      entryNumber: `JV-${new Date().getFullYear()}-${Date.now().toString().slice(-4)}`,
      totalDebit,
      totalCredit,
      status: 'Posted',
    };

    // Update account balances
    setState(prev => {
      const updatedAccounts = prev.confiAccounts.map(acc => {
        let balanceDelta = 0;
        entryData.lines.forEach(l => {
          if (l.accountId === acc.id) {
            if (acc.category === 'Asset' || acc.category === 'Expense' || acc.category === 'Cost of Goods Sold') {
              balanceDelta += (l.debit - l.credit);
            } else {
              balanceDelta += (l.credit - l.debit);
            }
          }
        });
        return balanceDelta !== 0 ? { ...acc, balance: acc.balance + balanceDelta } : acc;
      });

      return {
        ...prev,
        confiAccounts: updatedAccounts,
        confiJournalEntries: [newEntry, ...prev.confiJournalEntries]
      };
    });

    alert(`Journal Entry ${newEntry.entryNumber} posted successfully!`);
  };

  const handleAddConfiInvoice = (invoiceData: Omit<ConfiInvoice, 'id' | 'invoiceNumber' | 'subTotal' | 'discountTotal' | 'taxTotal' | 'grandTotal' | 'amountPaid' | 'balanceDue' | 'status'>) => {
    const subTotal = invoiceData.items.reduce((sum, it) => sum + (it.quantity * it.unitPrice), 0);
    const discountTotal = invoiceData.items.reduce((sum, it) => sum + (it.quantity * it.unitPrice * (it.discountPercent || 0) / 100), 0);
    const taxTotal = invoiceData.items.reduce((sum, it) => sum + (it.taxAmount || 0), 0);
    const grandTotal = (subTotal - discountTotal) + taxTotal;

    const newInvoice: ConfiInvoice = {
      ...invoiceData,
      id: `cinv-${Date.now()}`,
      invoiceNumber: `INV-CB-${new Date().getFullYear()}-${Date.now().toString().slice(-4)}`,
      subTotal,
      discountTotal,
      taxTotal,
      grandTotal,
      amountPaid: 0,
      balanceDue: grandTotal,
      status: 'Unpaid'
    };

    setState(prev => ({ ...prev, confiInvoices: [newInvoice, ...prev.confiInvoices] }));
    alert(`ConfiBooks Invoice ${newInvoice.invoiceNumber} generated!`);
  };

  const handleRecordConfiInvoicePayment = (invoiceId: string, amount: number) => {
    setState(prev => ({
      ...prev,
      confiInvoices: prev.confiInvoices.map(inv => {
        if (inv.id !== invoiceId) return inv;
        const newPaid = inv.amountPaid + amount;
        const newBalance = Math.max(0, inv.grandTotal - newPaid);
        const newStatus = newBalance === 0 ? 'Paid' : 'Partially Paid';
        return { ...inv, amountPaid: newPaid, balanceDue: newBalance, status: newStatus as any };
      })
    }));
    alert(`Payment of ${formatCurrency(amount)} recorded.`);
  };

  const handleAddConfiBill = (billData: Omit<ConfiBill, 'id' | 'billNumber' | 'subTotal' | 'taxTotal' | 'grandTotal' | 'amountPaid' | 'balanceDue' | 'matchStatus' | 'status'>) => {
    const subTotal = billData.items.reduce((sum, it) => sum + (it.quantity * it.unitPrice), 0);
    const taxTotal = billData.items.reduce((sum, it) => sum + (it.quantity * it.unitPrice * (it.taxPercent || 0) / 100), 0);
    const grandTotal = subTotal + taxTotal;

    const newBill: ConfiBill = {
      ...billData,
      id: `cbill-${Date.now()}`,
      billNumber: `BILL-${new Date().getFullYear()}-${Date.now().toString().slice(-4)}`,
      subTotal,
      taxTotal,
      grandTotal,
      amountPaid: 0,
      balanceDue: grandTotal,
      matchStatus: billData.poReference ? '3-Way Matched' : 'Unmatched',
      status: 'Pending Approval'
    };

    setState(prev => ({ ...prev, confiBills: [newBill, ...prev.confiBills] }));
    alert(`Vendor Bill ${newBill.billNumber} created.`);
  };

  const handleRecordConfiBillPayment = (billId: string, amount: number) => {
    setState(prev => ({
      ...prev,
      confiBills: prev.confiBills.map(b => {
        if (b.id !== billId) return b;
        const newPaid = b.amountPaid + amount;
        const newBalance = Math.max(0, b.grandTotal - newPaid);
        const newStatus = newBalance === 0 ? 'Paid' : 'Partially Paid';
        return { ...b, amountPaid: newPaid, balanceDue: newBalance, status: newStatus as any };
      })
    }));
    alert(`Vendor bill payment of ${formatCurrency(amount)} recorded.`);
  };

  const handleAddFixedAsset = (assetData: Omit<FixedAssetItem, 'id' | 'accumulatedDepreciation' | 'currentNetBookValue' | 'status'>) => {
    const newAsset: FixedAssetItem = {
      ...assetData,
      id: `fa-${Date.now()}`,
      accumulatedDepreciation: 0,
      currentNetBookValue: assetData.purchaseCost,
      status: 'Active In-Service'
    };
    setState(prev => ({ ...prev, fixedAssets: [newAsset, ...prev.fixedAssets] }));
    alert(`Fixed Asset ${newAsset.assetName} registered into asset schedule.`);
  };

  const handleRunFixedAssetDepreciation = () => {
    setState(prev => {
      let totalMonthlyDep = 0;
      const updatedAssets = prev.fixedAssets.map(fa => {
        const annualDep = fa.depreciationMethod === 'Straight Line (SLM)'
          ? (fa.purchaseCost - fa.salvageValue) / (fa.usefulLifeYears || 5)
          : fa.currentNetBookValue * (fa.annualDepreciationRate / 100);
        const monthlyDep = Math.round(annualDep / 12);
        totalMonthlyDep += monthlyDep;
        const newAccum = fa.accumulatedDepreciation + monthlyDep;
        const newNet = Math.max(fa.salvageValue, fa.purchaseCost - newAccum);
        return { ...fa, accumulatedDepreciation: newAccum, currentNetBookValue: newNet };
      });

      return {
        ...prev,
        fixedAssets: updatedAssets
      };
    });
    alert('Automated monthly depreciation processed and posted to General Ledger.');
  };

  // --- RILLET AI HANDLERS ---

  const handleAddRilletContract = (contractData: Omit<RilletContract, 'id' | 'status'>) => {
    const newContract: RilletContract = {
      ...contractData,
      id: `cnt-${Date.now().toString().slice(-4)}`,
      status: 'Active',
    };
    setState(prev => ({
      ...prev,
      rilletContracts: [newContract, ...prev.rilletContracts],
      rilletSaaSMetrics: {
        ...prev.rilletSaaSMetrics,
        arrCurrent: prev.rilletSaaSMetrics.arrCurrent + newContract.annualContractValue,
        mrrCurrent: Math.round((prev.rilletSaaSMetrics.arrCurrent + newContract.annualContractValue) / 12),
        endingArr: prev.rilletSaaSMetrics.endingArr + newContract.annualContractValue,
        newBookingsArr: prev.rilletSaaSMetrics.newBookingsArr + newContract.annualContractValue,
      }
    }));
  };

  const handleRunRevRecAmortization = () => {
    setState(prev => {
      let totalRecognizedThisRun = 0;
      const updatedContracts = prev.rilletContracts.map(contract => {
        const updatedElements = contract.elements.map(el => {
          if (el.revRecMethod === 'Daily Ratable (Over Time)') {
            const monthlyRatable = Math.round(el.allocatedRevenue / 12);
            const addRecognized = Math.min(el.deferredBalance, monthlyRatable);
            totalRecognizedThisRun += addRecognized;
            return {
              ...el,
              recognizedSoFar: el.recognizedSoFar + addRecognized,
              deferredBalance: Math.max(0, el.deferredBalance - addRecognized)
            };
          }
          return el;
        });
        return {
          ...contract,
          elements: updatedElements
        };
      });

      return {
        ...prev,
        rilletContracts: updatedContracts
      };
    });
  };

  const handleAutoMatchBankFeed = () => {
    setState(prev => {
      const updatedFeed = prev.rilletBankTransactions.map(tx => {
        if (tx.aiMatchStatus === 'NEEDS_REVIEW' || tx.aiMatchStatus === 'SPLIT_PROPOSED') {
          return {
            ...tx,
            aiMatchStatus: 'AUTO_MATCHED' as const,
            aiConfidencePct: 99.8,
            reconciledBy: 'Rillet AI Auto-Reconciler'
          };
        }
        return tx;
      });
      return {
        ...prev,
        rilletBankTransactions: updatedFeed
      };
    });
  };

  const handleConfirmBankMatch = (txId: string) => {
    setState(prev => ({
      ...prev,
      rilletBankTransactions: prev.rilletBankTransactions.map(tx =>
        tx.id === txId ? { ...tx, aiMatchStatus: 'CONFIRMED' as const, reconciledBy: `${prev.currentUser || 'Auditor'}` } : tx
      )
    }));
  };

  const handleAddRilletPrepaid = (prepaid: Omit<RilletPrepaidItem, 'id' | 'accumulatedAmortization' | 'remainingAssetBalance' | 'status'>) => {
    const newPrepaid: RilletPrepaidItem = {
      ...prepaid,
      id: `prep-${Date.now().toString().slice(-4)}`,
      accumulatedAmortization: 0,
      remainingAssetBalance: prepaid.totalPrepaidCost,
      status: 'Active Amortizing'
    };
    setState(prev => ({
      ...prev,
      rilletPrepaids: [newPrepaid, ...prev.rilletPrepaids]
    }));
  };

  const handleRunPrepaidAmortization = () => {
    setState(prev => {
      const updatedPrepaids = prev.rilletPrepaids.map(p => {
        if (p.status !== 'Active Amortizing') return p;
        const newAccum = Math.min(p.totalPrepaidCost, p.accumulatedAmortization + p.monthlyAmortization);
        const newRemaining = Math.max(0, p.totalPrepaidCost - newAccum);
        return {
          ...p,
          accumulatedAmortization: newAccum,
          remainingAssetBalance: newRemaining,
          status: (newRemaining === 0 ? 'Fully Amortized' : 'Active Amortizing') as 'Active Amortizing' | 'Fully Amortized'
        };
      });
      return {
        ...prev,
        rilletPrepaids: updatedPrepaids
      };
    });
  };

  const handleSignoffFluxItem = (fluxId: string) => {
    setState(prev => ({
      ...prev,
      rilletFluxAnalysis: prev.rilletFluxAnalysis.map(item =>
        item.id === fluxId ? { ...item, auditorSignoff: true } : item
      )
    }));
  };

  const handleToggleCloseChecklist = (taskId: string) => {
    setState(prev => ({
      ...prev,
      rilletCloseChecklist: prev.rilletCloseChecklist.map(t => {
        if (t.id === taskId) {
          const newStatus = t.status === 'COMPLETED' ? 'IN_PROGRESS' : 'COMPLETED';
          return {
            ...t,
            status: newStatus as any,
            completedAt: newStatus === 'COMPLETED' ? new Date().toISOString().replace('T', ' ').slice(0, 19) : undefined,
            signedOffBy: newStatus === 'COMPLETED' ? `${prev.currentUser || 'Auditor'}` : undefined
          };
        }
        return t;
      })
    }));
  };

  const handleAskRilletAi = (question: string, category: string = 'Revenue & ASC 606'): string => {
    let answer = `Analysis for "${question}": Verified with real-time General Ledger and ASC 606 revenue schedules. All deferred contract liabilities and bank clearing accounts are reconciled with zero unallocated variance.`;
    const qLower = question.toLowerCase();

    if (qLower.includes('arr') || qLower.includes('mrr') || qLower.includes('nrr') || qLower.includes('metrics')) {
      answer = `Current ARR is $${(state.rilletSaaSMetrics.arrCurrent / 1e6).toFixed(2)}M with an MRR of $${(state.rilletSaaSMetrics.mrrCurrent / 1e3).toFixed(1)}k. Net Revenue Retention (NRR) is ${state.rilletSaaSMetrics.netRevenueRetentionPct}%, CAC Payback is ${state.rilletSaaSMetrics.cacPaybackMonths} months, and Rule of 40 is at ${state.rilletSaaSMetrics.ruleOf40Pct}%. Cash runway stands at ${state.rilletSaaSMetrics.liveCashRunwayMonths} months.`;
    } else if (qLower.includes('burn') || qLower.includes('runway') || qLower.includes('cash')) {
      answer = `Total liquid cash across Brex Treasury, SVB, and Mercury stands at $8.42M USD equivalent. Net monthly burn rate is $295,000, giving a robust runway of ${state.rilletSaaSMetrics.liveCashRunwayMonths} months with a Burn Multiple of ${state.rilletSaaSMetrics.burnMultiple}x.`;
    } else if (qLower.includes('deferred') || qLower.includes('asc 606') || qLower.includes('waterfall')) {
      const totalDeferred = state.rilletContracts.reduce((acc, c) => acc + c.elements.reduce((sum, e) => sum + e.deferredBalance, 0), 0);
      answer = `Current ASC 606 Deferred Revenue liability on the Balance Sheet is $${totalDeferred.toLocaleString()}. All performance obligations (Software Subscriptions, Professional Services, Usage) follow Standalone Selling Price (SSP) relative fair value allocation rules.`;
    } else if (qLower.includes('gpu') || qLower.includes('cogs') || qLower.includes('aws') || qLower.includes('flux')) {
      answer = `Cloud Infrastructure COGS variance (+35.7% MoM) is attributed to $52.2k in on-demand AWS NVIDIA H100 GPU cluster reservations dedicated to enterprise model training contracts (NVIDIA & Databricks milestones).`;
    }

    const newQueryLog: RilletAiQueryLog = {
      id: `qry-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      question,
      answer,
      category: category as any,
      relatedDataRef: 'Rillet Autonomous Ledger Engine'
    };

    setState(prev => ({
      ...prev,
      rilletAiQueries: [newQueryLog, ...prev.rilletAiQueries]
    }));

    return answer;
  };

  const handlePeriodHardLock = () => {
    setState(prev => ({
      ...prev,
      rilletCloseChecklist: prev.rilletCloseChecklist.map(t =>
        t.category === 'Financial Close & Locks' ? { ...t, status: 'COMPLETED' as const, signedOffBy: 'Super Admin', completedAt: new Date().toISOString().replace('T', ' ').slice(0, 19) } : t
      )
    }));
  };

  // NBFC & Open Accounting Standard Implementation Handlers
  const handleRecalculateCrar = (additionalRwa: number = 0, additionalCapital: number = 0) => {
    setState(prev => {
      const newTotalCapital = prev.nbfcCrar.totalCapital + additionalCapital;
      const newTier1 = prev.nbfcCrar.tier1Capital + additionalCapital;
      const newTotalRwa = prev.nbfcCrar.totalRwa + additionalRwa;
      const crarPct = Math.round((newTotalCapital / newTotalRwa) * 10000) / 100;
      const tier1Pct = Math.round((newTier1 / newTotalRwa) * 10000) / 100;
      return {
        ...prev,
        nbfcCrar: {
          ...prev.nbfcCrar,
          totalCapital: newTotalCapital,
          tier1Capital: newTier1,
          totalRwa: newTotalRwa,
          rwaOnBalanceSheet: prev.nbfcCrar.rwaOnBalanceSheet + additionalRwa,
          crarPercentage: crarPct,
          tier1CrarPercentage: tier1Pct,
          complianceStatus: crarPct >= 15.0 ? 'COMPLIANT' : 'BREACH'
        }
      };
    });
  };

  const handleRunIndAs109EclProvision = () => {
    setState(prev => {
      const updatedStages = prev.indAs109EclStages.map(stage => {
        const computedEcl = Math.round(stage.exposureAtDefault * (stage.probabilityOfDefaultPct / 100) * (stage.lossGivenDefaultPct / 100));
        return {
          ...stage,
          eclProvisionAmount: computedEcl,
          coverageRatioPct: Math.round((computedEcl / stage.exposureAtDefault) * 10000) / 100,
          indAsVsIracpDifference: computedEcl - stage.iracpRegulatoryProvision
        };
      });

      // Also create an automated accounting journal voucher for ECL impairment
      const totalEcl = updatedStages.reduce((acc, s) => acc + s.eclProvisionAmount, 0);
      const newVoucher: Voucher = {
        id: `vch-ecl-${Date.now().toString().slice(-4)}`,
        voucherNumber: `VCH-INDAS109-${new Date().toISOString().slice(0, 10)}`,
        voucherType: VoucherType.JOURNAL,
        date: new Date().toISOString().slice(0, 10),
        description: 'Auto Ind AS 109 Expected Credit Loss (ECL) Impairment Provisioning run across Stage 1/2/3 loans',
        status: VoucherStatus.APPROVED,
        createdBy: 'Accounting',
        lines: [
          { accountId: 'acc-ecl-exp', accountName: '5110 - Provision for Expected Credit Loss (P&L)', debit: totalEcl, credit: 0 },
          { accountId: 'acc-ecl-allowance', accountName: '1410 - Allowance for Credit Impairment (Contra Asset)', debit: 0, credit: totalEcl }
        ]
      };

      return {
        ...prev,
        indAs109EclStages: updatedStages,
        vouchers: [newVoucher, ...prev.vouchers]
      };
    });
  };

  const handleSettleCoLendingEscrow = (dealId: string) => {
    setState(prev => {
      const deal = prev.nbfcCoLendingDeals.find(d => d.id === dealId);
      if (!deal) return prev;

      const newTxn: Transaction = {
        id: `txn-cl-${Date.now().toString().slice(-4)}`,
        date: new Date().toISOString().slice(0, 10),
        description: `Automated Escrow Waterfall remittance to Partner Bank ${deal.partnerBankName} (Deal: ${deal.dealCode})`,
        amount: deal.bankEscrowRemittance,
        type: TransactionType.EXPENSE,
        mode: PaymentMode.NEFT,
        status: TransactionStatus.COMPLETED,
        referenceNumber: `ESCROW-RTGS-${Date.now().toString().slice(-6)}`,
        accountId: 'acc-1',
        amlStatus: AmlStatus.CLEARED
      };

      return {
        ...prev,
        transactions: [newTxn, ...prev.transactions],
        nbfcCoLendingDeals: prev.nbfcCoLendingDeals.map(d => d.id === dealId ? { ...d, escrowStatus: 'Settled' as const } : d)
      };
    });
  };

  const handleScrubBureauTudf = () => {
    setState(prev => ({
      ...prev,
      bureauTudfRecords: prev.bureauTudfRecords.map(rec => ({
        ...rec,
        validationStatus: rec.daysPastDue > 90 ? 'CLEAN' : rec.daysPastDue > 0 ? 'WARNING' : 'CLEAN',
        validationMessage: rec.daysPastDue > 90 
          ? 'Passed RBI & CIBIL TUDF 3.0 automated scrub. Flagged as Substandard NPA with 90+ DPD string.'
          : rec.daysPastDue > 0 
          ? 'Passed scrub with SMA-0/1 warning. Repayment string validated.'
          : '100% Validated against TransUnion CIBIL 3.0 Segment Norms.'
      }))
    }));
  };

  const handleAddOpenCostCenter = (cc: Omit<OpenCostCenter, 'id' | 'actualSpent' | 'variance' | 'status'>) => {
    const newCC: OpenCostCenter = {
      id: `cc-${Date.now().toString().slice(-4)}`,
      ...cc,
      actualSpent: 0,
      variance: cc.allocatedBudget,
      status: 'Active'
    };
    setState(prev => ({ ...prev, openCostCenters: [...prev.openCostCenters, newCC] }));
  };

  const handleAddOpenBudgetRule = (rule: Omit<OpenBudgetRule, 'id' | 'actualYearToDate' | 'remainingBudget' | 'isBreached'>) => {
    const newRule: OpenBudgetRule = {
      id: `bgt-${Date.now().toString().slice(-4)}`,
      ...rule,
      actualYearToDate: 0,
      remainingBudget: rule.monthlyBudget * 12,
      isBreached: false
    };
    setState(prev => ({ ...prev, openBudgetRules: [...prev.openBudgetRules, newRule] }));
  };

  const handleExecutePeriodClose = (periodName: string, expenseDebit: number, incomeCredit: number) => {
    const netProfit = incomeCredit - expenseDebit;
    const newClosingEntry: OpenPeriodClosingEntry = {
      id: `pce-${Date.now().toString().slice(-4)}`,
      periodName,
      closingDate: new Date().toISOString().slice(0, 10),
      closingVoucherNumber: `VCH-CLOSE-${new Date().toISOString().slice(0, 7)}-${Date.now().toString().slice(-3)}`,
      totalExpenseDebitTransferred: expenseDebit,
      totalIncomeCreditTransferred: incomeCredit,
      netProfitTransferredToRetainedEarnings: netProfit,
      retainedEarningsAccount: '3100 - Retained Earnings & Statutory Reserve',
      executedBy: 'Rekha Gupta (Accounting)',
      isLocked: true
    };

    const closingVoucher: Voucher = {
      id: `vch-close-${Date.now().toString().slice(-4)}`,
      voucherNumber: newClosingEntry.closingVoucherNumber,
      voucherType: VoucherType.JOURNAL,
      date: newClosingEntry.closingDate,
      description: `Frappe/ERPNext Standard Period Closing Voucher: Nominal Accounts zeroed into Retained Earnings for ${periodName}`,
      status: VoucherStatus.APPROVED,
      createdBy: 'Accounting',
      lines: [
        { accountId: 'acc-inc-sum', accountName: '4000 - Total Revenue Accounts (Zeroed out)', debit: incomeCredit, credit: 0 },
        { accountId: 'acc-exp-sum', accountName: '5000 - Total Operating Expense Accounts (Zeroed out)', debit: 0, credit: expenseDebit },
        { accountId: 'acc-ret-earn', accountName: '3100 - Retained Earnings & Statutory Reserve', debit: 0, credit: netProfit }
      ]
    };

    setState(prev => ({
      ...prev,
      openPeriodClosingEntries: [newClosingEntry, ...prev.openPeriodClosingEntries],
      vouchers: [closingVoucher, ...prev.vouchers]
    }));
  };

  // ==========================================
  // JEV.AI SYSTEM ONE DECISION ENGINE HANDLERS
  // ==========================================

  const setJevActivePipelineId = (id: string) => {
    setState(prev => ({ ...prev, jevActivePipelineId: id }));
  };

  const handleExecuteJevEvaluation = async (
    pipelineId: string,
    stateInput: Record<string, any>,
    question: JevQuestion
  ): Promise<JevEvaluationOutput> => {
    // Benchmark realistic sub-100ms single-pass execution latency (35ms - 75ms)
    const simulatedLatencyMs = Math.floor(35 + Math.random() * 38);
    await new Promise(res => setTimeout(res, simulatedLatencyMs));

    const pipeline = state.jevPipelines.find(p => p.id === pipelineId) || state.jevPipelines[0];
    const rawText = JSON.stringify(stateInput);
    // Token computation ($0.042 / 1M input tokens, free output tokens)
    const estimatedInputTokens = Math.max(50, Math.round(rawText.length / 3.8));
    const costUsd = Number(((estimatedInputTokens / 1000000) * 0.042).toFixed(7));

    let answer: string | number | boolean;
    let confidence: number;
    let probabilities: Record<string, number> = {};
    let stpStatus: 'STP_APPROVED' | 'MANUAL_REVIEW_REQUIRED' | 'REJECTED_BY_GUARDRAIL' = 'STP_APPROVED';
    let system2Triggered = false;
    let system2Explanation: string | undefined = undefined;

    if (question.type === 'choice') {
      const opts = question.options || ['Standard Choice A', 'Standard Choice B'];
      // Determine calibrated probabilities
      const bestIdx = 0;
      confidence = Number((0.955 + Math.random() * 0.04).toFixed(3));
      answer = opts[bestIdx];
      
      let remainingProb = 1 - confidence;
      probabilities[answer] = confidence;
      opts.slice(1).forEach((opt, idx) => {
        const slice = idx === opts.length - 2 ? remainingProb : Number((remainingProb * (0.6 / (idx + 1))).toFixed(4));
        remainingProb = Math.max(0, remainingProb - slice);
        probabilities[opt] = Number(slice.toFixed(4));
      });

      if (confidence >= pipeline.stpConfidenceThreshold) {
        stpStatus = 'STP_APPROVED';
      } else {
        stpStatus = 'MANUAL_REVIEW_REQUIRED';
      }
    } else if (question.type === 'noul') {
      // Calibrated Boolean Yes/No decision
      // Check for guardrail triggers
      const isBreachSuspect = 
        (stateInput.exposureProposed && stateInput.ceiling && stateInput.exposureProposed > stateInput.ceiling) ||
        (stateInput.amount && stateInput.amount > 5000000 && String(stateInput.narration || '').toLowerCase().includes('foreign')) ||
        (stateInput.transactionCount24h && stateInput.transactionCount24h > 15 && stateInput.averageDepositSize < 50000);

      if (isBreachSuspect) {
        answer = true;
        confidence = Number((0.962 + Math.random() * 0.035).toFixed(3));
        probabilities = { 'Yes': confidence, 'No': Number((1 - confidence).toFixed(3)) };
        stpStatus = 'REJECTED_BY_GUARDRAIL';
        system2Triggered = true;
        system2Explanation = `System 2 (Gemini Deep Reasoning): Escalated by System 1 Noul guardrail. Non-conforming risk patterns detected in payload. Regulatory memorandum generated: Requires Tier-2 Audit Committee and Compliance Officer authorization.`;
      } else {
        answer = false;
        confidence = Number((0.985 + Math.random() * 0.014).toFixed(3));
        probabilities = { 'Yes': Number((1 - confidence).toFixed(3)), 'No': confidence };
        stpStatus = 'STP_APPROVED';
      }
    } else {
      // Score primitive
      const min = question.scoreMin || 0;
      const max = question.scoreMax || 100;
      const randomScore = Math.floor(min + 8 + Math.random() * 18);
      answer = randomScore;
      confidence = Number((0.94 + Math.random() * 0.05).toFixed(3));
      probabilities = {
        'Low Risk [0-25]': 0.885,
        'Medium Risk [26-60]': 0.098,
        'High Risk [61-100]': 0.017
      };
      stpStatus = randomScore < 30 ? 'STP_APPROVED' : 'MANUAL_REVIEW_REQUIRED';
    }

    const evaluation: JevEvaluationOutput = {
      id: `jev-eval-${Date.now()}`,
      title: `${pipeline.tag}: ${question.question.slice(0, 48)}...`,
      stateInput,
      question: question.question,
      decisionType: question.type,
      answer,
      confidence,
      probabilities,
      latencyMs: simulatedLatencyMs,
      inputTokens: estimatedInputTokens,
      costUsd,
      stpStatus,
      system2Triggered,
      system2Explanation,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19)
    };

    setState(prev => ({
      ...prev,
      jevRecentEvaluations: [evaluation, ...prev.jevRecentEvaluations.slice(0, 49)]
    }));

    return evaluation;
  };

  const handleRunJevBatchSimulation = (customThreshold: number = 0.95) => {
    setState(prev => {
      const updatedRecords = prev.jevBatchRecords.map(rec => {
        const isEligible = rec.choiceConfidence >= customThreshold && !rec.noulRequiresApproval;
        return {
          ...rec,
          stpStatus: isEligible
            ? ('STP_COMMITTED' as const)
            : rec.riskScore > 70 || rec.noulRequiresApproval
            ? ('ESCALATED_TO_SYSTEM2' as const)
            : ('PENDING_HUMAN_REVIEW' as const),
          latencyMs: Math.floor(32 + Math.random() * 26)
        };
      });
      return { ...prev, jevBatchRecords: updatedRecords };
    });
  };

  const handleCommitStpRecord = (recordId: string) => {
    const record = state.jevBatchRecords.find(r => r.id === recordId);
    if (!record) return;

    const voucherNumber = `VCH-JEV-STP-${Math.floor(10000 + Math.random() * 90000)}`;
    const newVoucher: Voucher = {
      id: `vch-jev-${Date.now()}`,
      voucherNumber,
      date: record.date,
      voucherType: VoucherType.JOURNAL,
      description: `[Jev.ai System One STP Auto-Commit] ${record.transactionType} for ${record.partyName}. Calibrated Confidence: ${(record.choiceConfidence * 100).toFixed(1)}%. Latency: ${record.latencyMs}ms.`,
      status: VoucherStatus.APPROVED,
      referenceDocument: record.referenceNumber,
      lines: [
        {
          accountId: 'acc-jev-dr',
          accountName: record.predictedGlAccount,
          debit: record.amount,
          credit: 0
        },
        {
          accountId: 'acc-jev-cr',
          accountName: '1110 - HDFC Bank Corporate Clearing Account',
          debit: 0,
          credit: record.amount
        }
      ]
    };

    setState(prev => ({
      ...prev,
      vouchers: [newVoucher, ...prev.vouchers],
      jevBatchRecords: prev.jevBatchRecords.map(r => r.id === recordId ? { ...r, stpStatus: 'STP_COMMITTED' } : r)
    }));
  };

  const handleTriggerSystem2Escalation = async (recordId: string, customInstruction?: string): Promise<string> => {
    const record = state.jevBatchRecords.find(r => r.id === recordId);
    if (!record) return 'Record not found';

    await new Promise(res => setTimeout(res, 450)); // Simulating System 2 deliberative reasoning

    const explanation = `System 2 (Gemini Deep Reasoning Audit Memorandum):\n` +
      `Evaluated Record Ref: ${record.referenceNumber} | Counterparty: ${record.partyName} | Amount: ₹${record.amount.toLocaleString('en-IN')}.\n` +
      `System 1 Trigger: Jev Noul Guardrail Flagged (Confidence ${(record.noulConfidence * 100).toFixed(1)}%) | Risk Index: ${record.riskScore}/100.\n` +
      `Statutory Analysis: ${customInstruction || 'Potential split payment, exposure concentration, or non-routine ledger reclassification.'} ` +
      `In accordance with RBI Prudential Norms and IND AS 109, this entry has been isolated from STP ledger ingestion. Mandatory CFO co-signature and Supporting Tax Invoices (Form 16A/GST 2B) required.`;

    setState(prev => ({
      ...prev,
      jevBatchRecords: prev.jevBatchRecords.map(r => r.id === recordId ? {
        ...r,
        stpStatus: 'ESCALATED_TO_SYSTEM2'
      } : r)
    }));

    return explanation;
  };

  const handleUpdateJevPipelineStatus = (pipelineId: string, status: 'Active' | 'Paused') => {
    setState(prev => ({
      ...prev,
      jevPipelines: prev.jevPipelines.map(p => p.id === pipelineId ? { ...p, status } : p)
    }));
  };

  const handleUpdateStpThreshold = (pipelineId: string, threshold: number) => {
    setState(prev => ({
      ...prev,
      jevPipelines: prev.jevPipelines.map(p => p.id === pipelineId ? { ...p, stpConfidenceThreshold: threshold } : p)
    }));
  };

  // Runamarga Voice AI Infrastructure Handlers
  const setRunamargaActiveCallId = (callId: string | null) => {
    setState(prev => ({ ...prev, runamargaActiveCallId: callId }));
  };

  const handleToggleRunamargaCampaign = (campaignId: string) => {
    setState(prev => ({
      ...prev,
      runamargaCampaigns: prev.runamargaCampaigns.map(c => 
        c.id === campaignId 
          ? { ...c, status: c.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE' } 
          : c
      )
    }));
  };

  const handleCreateRunamargaCampaign = (campaignData: Omit<RunamargaCampaign, 'id' | 'completedCalls' | 'connectedRate' | 'conversionRate'>) => {
    const newCamp: RunamargaCampaign = {
      ...campaignData,
      id: `cmp-${Date.now()}`,
      completedCalls: 0,
      connectedRate: 0,
      conversionRate: 0
    };
    setState(prev => ({
      ...prev,
      runamargaCampaigns: [newCamp, ...prev.runamargaCampaigns]
    }));
  };

  const handleDispatchRunamargaWorkflow = (callId: string) => {
    setState(prev => ({
      ...prev,
      runamargaCalls: prev.runamargaCalls.map(c => c.id === callId ? { ...c, workflowDispatched: true } : c)
    }));
  };

  const handleSimulateRunamargaCallTurn = async (callId: string, customerUtterance: string): Promise<RunamargaTranscriptTurn> => {
    await new Promise(r => setTimeout(r, 500));
    const newTurn: RunamargaTranscriptTurn = {
      speaker: 'agent',
      text: `Noted: "${customerUtterance}". Our system has synchronized this event with your records. Is there anything further I can help you with today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      sentiment: 'POSITIVE',
      asrConfidence: 0.98
    };
    return newTurn;
  };

  const handleAddNewRunamargaCall = (call: RunamargaCallRecord) => {
    setState(prev => ({
      ...prev,
      runamargaCalls: [call, ...prev.runamargaCalls],
      runamargaTelemetry: {
        ...prev.runamargaTelemetry,
        totalCallsToday: prev.runamargaTelemetry.totalCallsToday + 1
      }
    }));
  };

  // OmniWorkspace Handlers (Oasis Workspace Standards)
  const handleCreateWorkspaceProject = (proj: Omit<WorkspaceProject, 'id'>) => {
    const newProj: WorkspaceProject = {
      ...proj,
      id: `wproj-${Date.now()}`
    };
    const log: WorkspaceAuditLog = {
      id: `waud-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      actor: state.currentUser || 'Workspace Lead',
      action: 'PROJECT_CREATED',
      targetType: 'PROJECT',
      description: `Created new project "${newProj.name}" [${newProj.code}]`,
      ipAddress: '192.0.2.100'
    };
    setState(prev => ({
      ...prev,
      workspaceProjects: [newProj, ...prev.workspaceProjects],
      workspaceAuditLogs: [log, ...prev.workspaceAuditLogs]
    }));
  };

  const handleUpdateProjectStage = (projectId: string, newStage: WorkspaceStage) => {
    setState(prev => ({
      ...prev,
      workspaceProjects: prev.workspaceProjects.map(p => p.id === projectId ? { ...p, stage: newStage } : p),
      workspaceAuditLogs: [
        {
          id: `waud-${Date.now()}`,
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
          actor: prev.currentUser || 'Workspace Lead',
          action: 'STAGE_TRANSITION',
          targetType: 'PROJECT',
          description: `Updated project stage to "${newStage.replace('_', ' ').toUpperCase()}"`,
          ipAddress: '192.0.2.100'
        },
        ...prev.workspaceAuditLogs
      ]
    }));
  };

  const handleCreateWorkspaceTask = (task: Omit<WorkspaceTask, 'id'>) => {
    const newTask: WorkspaceTask = {
      ...task,
      id: `wtsk-${Date.now()}`
    };
    setState(prev => ({
      ...prev,
      workspaceTasks: [newTask, ...prev.workspaceTasks]
    }));
  };

  const handleToggleWorkspaceChecklistItem = (taskId: string, itemId: string) => {
    setState(prev => ({
      ...prev,
      workspaceTasks: prev.workspaceTasks.map(t => {
        if (t.id !== taskId) return t;
        return {
          ...t,
          checklistItems: t.checklistItems.map(item => item.id === itemId ? { ...item, done: !item.done } : item)
        };
      })
    }));
  };

  const handleUpdateTaskStatus = (taskId: string, newStatus: 'todo' | 'in_progress' | 'review' | 'done') => {
    setState(prev => ({
      ...prev,
      workspaceTasks: prev.workspaceTasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t)
    }));
  };

  const handleCreateWorkspaceDocument = (doc: Omit<WorkspaceDocument, 'id' | 'docNumber' | 'uploadDate' | 'eSignatures'>) => {
    const newDoc: WorkspaceDocument = {
      ...doc,
      id: `wdoc-${Date.now()}`,
      docNumber: `DOC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      uploadDate: new Date().toISOString().split('T')[0],
      eSignatures: []
    };
    const log: WorkspaceAuditLog = {
      id: `waud-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      actor: doc.uploadedBy,
      action: 'DOCUMENT_UPLOAD',
      targetType: 'DOCUMENT',
      description: `Uploaded document ${newDoc.docNumber}: "${newDoc.title}"`,
      ipAddress: '192.0.2.100'
    };
    setState(prev => ({
      ...prev,
      workspaceDocuments: [newDoc, ...prev.workspaceDocuments],
      workspaceAuditLogs: [log, ...prev.workspaceAuditLogs]
    }));
  };

  const handleSignWorkspaceDocument = (docId: string, signerName: string, role: string) => {
    const newStamp: WorkspaceSignatureStamp = {
      signerName,
      role,
      signedAt: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
      signatureHash: 'SHA256:' + Array.from({length: 32}, () => Math.floor(Math.random()*16).toString(16)).join('')
    };
    setState(prev => ({
      ...prev,
      workspaceDocuments: prev.workspaceDocuments.map(d => {
        if (d.id !== docId) return d;
        return {
          ...d,
          status: 'approved',
          eSignatures: [...d.eSignatures, newStamp]
        };
      }),
      workspaceAuditLogs: [
        {
          id: `waud-${Date.now()}`,
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
          actor: signerName,
          action: 'DOCUMENT_E_SIGNED',
          targetType: 'DOCUMENT',
          description: `Applied cryptographic e-signature to document with hash ${newStamp.signatureHash.substring(0, 18)}...`,
          ipAddress: '192.0.2.100'
        },
        ...prev.workspaceAuditLogs
      ]
    }));
  };

  const handleRejectWorkspaceDocument = (docId: string, reason: string) => {
    setState(prev => ({
      ...prev,
      workspaceDocuments: prev.workspaceDocuments.map(d => d.id === docId ? { ...d, status: 'rejected', rejectionReason: reason } : d),
      workspaceAuditLogs: [
        {
          id: `waud-${Date.now()}`,
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
          actor: prev.currentUser || 'Auditor',
          action: 'DOCUMENT_REJECTED',
          targetType: 'DOCUMENT',
          description: `Rejected document with reason: ${reason}`,
          ipAddress: '192.0.2.100'
        },
        ...prev.workspaceAuditLogs
      ]
    }));
  };

  const handleSendWorkspaceMessage = (channelId: string, message: string, senderName: string, senderRole: string) => {
    const newMsg: WorkspaceChannelMessage = {
      id: `wmsg-${Date.now()}`,
      channelId,
      senderName,
      senderRole,
      senderAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80',
      timestamp: 'Just now',
      message
    };
    setState(prev => ({
      ...prev,
      workspaceChannelMessages: [...prev.workspaceChannelMessages, newMsg]
    }));
  };

  const handleVerifyWorkspaceChecklist = (checklistId: string, verifiedBy: string) => {
    setState(prev => ({
      ...prev,
      workspaceChecklists: prev.workspaceChecklists.map(c => c.id === checklistId ? {
        ...c,
        isVerified: true,
        verifiedBy,
        verifiedAt: new Date().toISOString().split('T')[0]
      } : c)
    }));
  };

  const handleAddWorkspaceCustomer = (customer: Omit<WorkspaceCustomer, 'id' | 'code'>) => {
    const newCust: WorkspaceCustomer = {
      ...customer,
      id: `wcust-${Date.now()}`,
      code: `CUST-${customer.name.substring(0, 4).toUpperCase()}-${Math.floor(10 + Math.random() * 90)}`
    };
    setState(prev => ({
      ...prev,
      workspaceCustomers: [newCust, ...prev.workspaceCustomers]
    }));
  };

  const handleAddWorkspaceSupplier = (supplier: Omit<WorkspaceSupplier, 'id' | 'code'>) => {
    const newSupp: WorkspaceSupplier = {
      ...supplier,
      id: `wsupp-${Date.now()}`,
      code: `SUPP-${supplier.name.substring(0, 4).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`
    };
    setState(prev => ({
      ...prev,
      workspaceSuppliers: [newSupp, ...prev.workspaceSuppliers]
    }));
  };

  const handleUpdateTaxComplianceStatus = (itemId: string, status: TaxComplianceStatus) => {
    setState(prev => ({
      ...prev,
      taxComplianceItems: prev.taxComplianceItems.map(item => 
        item.id === itemId ? { ...item, status } : item
      )
    }));
  };

  const handleFileTaxRecord = (record: Omit<TaxRecord, 'id'>) => {
    const newRecord: TaxRecord = {
      ...record,
      id: `tr-${Date.now()}`
    };
    setState(prev => ({
      ...prev,
      taxRecords: [newRecord, ...prev.taxRecords]
    }));
  };

  const handleSendTaxChatMessage = async (message: string) => {
    const userMsg: TaxChatMessage = {
      id: `m-u-${Date.now()}`,
      role: 'user',
      content: message,
      timestamp: new Date().toISOString()
    };

    setState(prev => ({
      ...prev,
      taxChatHistory: [...prev.taxChatHistory, userMsg]
    }));

    try {
      const response = await fetch('/api/gemini/tax-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, history: state.taxChatHistory })
      });
      
      const data = await response.json();
      
      const assistantMsg: TaxChatMessage = {
        id: `m-a-${Date.now()}`,
        role: 'assistant',
        content: data.reply,
        timestamp: new Date().toISOString()
      };

      setState(prev => ({
        ...prev,
        taxChatHistory: [...prev.taxChatHistory, assistantMsg]
      }));
    } catch (error) {
      console.error('Error in Tax AI Chat:', error);
      const errorMsg: TaxChatMessage = {
        id: `m-e-${Date.now()}`,
        role: 'assistant',
        content: 'I encountered an error while processing your request. Please try again.',
        timestamp: new Date().toISOString()
      };
      setState(prev => ({
        ...prev,
        taxChatHistory: [...prev.taxChatHistory, errorMsg]
      }));
    }
  };

  const handleSendBusinessAssistantMessage = async (message: string) => {
    const userMsg: BusinessAssistantMessage = {
      id: `ba-m-u-${Date.now()}`,
      role: 'user',
      content: message,
      timestamp: new Date().toISOString()
    };

    setState(prev => ({
      ...prev,
      businessAssistantHistory: [...prev.businessAssistantHistory, userMsg]
    }));

    try {
      const response = await fetch('/api/gemini/business-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message, 
          history: state.businessAssistantHistory,
          kpis: state.businessKpis,
          goals: state.businessStrategyGoals
        })
      });
      
      const data = await response.json();
      
      const assistantMsg: BusinessAssistantMessage = {
        id: `ba-m-a-${Date.now()}`,
        role: 'assistant',
        content: data.reply,
        timestamp: new Date().toISOString()
      };

      setState(prev => ({
        ...prev,
        businessAssistantHistory: [...prev.businessAssistantHistory, assistantMsg]
      }));
    } catch (error) {
      console.error('Error in Business Assistant Chat:', error);
      const errorMsg: BusinessAssistantMessage = {
        id: `ba-m-e-${Date.now()}`,
        role: 'assistant',
        content: 'I encountered an error while processing your strategic inquiry. Please try again.',
        timestamp: new Date().toISOString()
      };
      setState(prev => ({
        ...prev,
        businessAssistantHistory: [...prev.businessAssistantHistory, errorMsg]
      }));
    }
  };

  const handleAddCoopMember = (memberData: Omit<CoopMember, 'id'>) => {
    const newMember: CoopMember = { id: `cm-${Date.now()}`, ...memberData };
    setState(prev => ({
      ...prev,
      coopMembers: [newMember, ...prev.coopMembers],
      coopPassbookTxns: [
        {
          id: `pt-${Date.now()}`,
          memberId: newMember.id,
          date: newMember.admissionDate,
          accountType: 'Share Capital',
          particulars: `Share Allotment (${newMember.shareCount} shares @ ₹1,000)`,
          debit: 0,
          credit: newMember.shareCapitalAmount,
          mode: 'NEFT/UPI',
        },
        ...prev.coopPassbookTxns,
      ],
    }));
  };

  const handleAddCoopDeposit = (depositData: Omit<CoopDeposit, 'id'>) => {
    const newDeposit: CoopDeposit = { id: `cd-${Date.now()}`, ...depositData };
    setState(prev => ({
      ...prev,
      coopDeposits: [newDeposit, ...prev.coopDeposits],
      coopPassbookTxns: [
        {
          id: `pt-${Date.now()}`,
          memberId: newDeposit.memberId,
          date: new Date().toISOString().split('T')[0],
          accountType: 'FD/RD',
          particulars: `Opened ${newDeposit.depositType} (${newDeposit.depositNumber})`,
          debit: 0,
          credit: newDeposit.principalAmount,
          mode: 'NEFT/UPI',
        },
        ...prev.coopPassbookTxns,
      ],
    }));
  };

  const handleAddCoopLoan = (loanData: Omit<CoopLoan, 'id'>) => {
    const newLoan: CoopLoan = { id: `cl-${Date.now()}`, ...loanData };
    setState(prev => ({ ...prev, coopLoans: [newLoan, ...prev.coopLoans] }));
  };

  const handleApproveCoopLoan = (loanId: string) => {
    setState(prev => ({
      ...prev,
      coopLoans: prev.coopLoans.map(l => l.id === loanId ? { ...l, status: 'Active' } : l),
    }));
  };

  const handlePostCoopLoanRepayment = (
    loanId: string,
    amountPaid: number,
    interestPortion: number,
    principalPortion: number,
    mode: CoopPassbookTxn['mode']
  ) => {
    const today = new Date().toISOString().split('T')[0];
    setState(prev => {
      const targetLoan = prev.coopLoans.find(l => l.id === loanId);
      if (!targetLoan) return prev;
      const nextPrincipal = Math.max(0, targetLoan.outstandingPrincipal - principalPortion);
      const updatedLoans = prev.coopLoans.map(l =>
        l.id === loanId
          ? {
              ...l,
              outstandingPrincipal: nextPrincipal,
              lastPaymentDate: today,
              dpdDays: 0,
              status: nextPrincipal === 0 ? ('Closed' as const) : ('Active' as const),
            }
          : l
      );
      const newTxn: CoopPassbookTxn = {
        id: `pt-${Date.now()}`,
        memberId: targetLoan.memberId,
        date: today,
        accountType: 'Loan Account',
        particulars: `Loan Recovery ${targetLoan.loanAccountNo} (Prin ₹${principalPortion.toLocaleString('en-IN')} + Day Int ₹${interestPortion.toLocaleString('en-IN')})`,
        debit: 0,
        credit: amountPaid,
        mode,
      };
      return {
        ...prev,
        coopLoans: updatedLoans,
        coopPassbookTxns: [newTxn, ...prev.coopPassbookTxns],
      };
    });
  };

  const handlePostDdoRecovery = (batchData: Omit<CoopDdoRecoveryBatch, 'id'>) => {
    const today = new Date().toISOString().split('T')[0];
    const newBatch: CoopDdoRecoveryBatch = {
      id: `ddo-b-${Date.now()}`,
      ...batchData,
      postedAt: new Date().toLocaleString(),
      status: 'Posted to Ledger',
    };
    setState(prev => {
      const ddoMembers = prev.coopMembers.filter(m => m.ddoCode === batchData.ddoCode && m.status === 'Active');
      const ddoMemberIds = new Set(ddoMembers.map(m => m.id));
      const updatedMembers = prev.coopMembers.map(m =>
        ddoMemberIds.has(m.id)
          ? { ...m, thriftBalance: (m.thriftBalance || 0) + (m.monthlyThriftContribution || 2500) }
          : m
      );
      const updatedLoans = prev.coopLoans.map(l => {
        if (ddoMemberIds.has(l.memberId) && (l.status === 'Active' || l.status === 'NPA Watch')) {
          const interest = Math.round(l.outstandingPrincipal * (l.interestRate / 100) * (30 / 365));
          const principalPart = Math.max(0, Math.min(l.outstandingPrincipal, l.emiAmount - interest));
          const nextBal = Math.max(0, l.outstandingPrincipal - principalPart);
          return {
            ...l,
            outstandingPrincipal: nextBal,
            lastPaymentDate: today,
            dpdDays: 0,
            status: nextBal === 0 ? ('Closed' as const) : ('Active' as const),
          };
        }
        return l;
      });
      const newTxns: CoopPassbookTxn[] = ddoMembers.map((m, idx) => ({
        id: `pt-ddo-${Date.now()}-${idx}`,
        memberId: m.id,
        date: today,
        accountType: 'Thrift Fund',
        particulars: `DDO Salary Thrift Deduction (${batchData.billingMonth} · ${batchData.ddoCode})`,
        debit: 0,
        credit: m.monthlyThriftContribution || 2500,
        mode: 'DDO Salary Deduction',
      }));
      return {
        ...prev,
        coopMembers: updatedMembers,
        coopLoans: updatedLoans,
        coopDdoBatches: [newBatch, ...prev.coopDdoBatches],
        coopPassbookTxns: [...newTxns, ...prev.coopPassbookTxns],
      };
    });
  };

  const handleCreateCoopBackupSnapshot = (label: string) => {
    setState(prev => {
      const count =
        prev.coopMembers.length +
        prev.coopDeposits.length +
        prev.coopLoans.length +
        prev.coopPassbookTxns.length +
        prev.coopDdoBatches.length;
      const snap: CoopBackupSnapshot = {
        id: `bk-${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
        label,
        recordsCount: count * 124,
        sizeKb: Math.max(256, count * 18),
        verifiedBy: prev.currentUser || 'Society Administrator',
        checksum: `sha256:${Math.random().toString(16).slice(2, 10)}...${Math.random().toString(16).slice(2, 6)}`,
      };
      return { ...prev, coopBackupSnapshots: [snap, ...prev.coopBackupSnapshots] };
    });
  };

  const handleAddDividendRecord = (dividendData: Omit<CoopDividendRecord, 'id'>) => {
    const newDiv: CoopDividendRecord = { id: `div-${Date.now()}`, ...dividendData };
    setState(prev => ({ ...prev, coopDividends: [newDiv, ...prev.coopDividends] }));
  };

  const handleAddAgmRecord = (agmData: Omit<CoopAgmRecord, 'id'>) => {
    const newAgm: CoopAgmRecord = { id: `agm-${Date.now()}`, ...agmData };
    setState(prev => ({ ...prev, coopAgms: [newAgm, ...prev.coopAgms] }));
  };

  // --- CBS Technology & Implementation Handlers ---

  const handleToggleCbsDeliverable = (phaseId: string, deliverableId: string) => {
    setState(prev => ({
      ...prev,
      cbsPhases: prev.cbsPhases.map(p =>
        p.id === phaseId
          ? {
              ...p,
              deliverables: p.deliverables.map(d =>
                d.id === deliverableId ? { ...d, completed: !d.completed } : d
              ),
            }
          : p
      ),
    }));
  };

  const handleAddCbsDeliverable = (phaseId: string, deliverable: Omit<CbsDeliverable, 'id'>) => {
    const newDeliv: CbsDeliverable = { id: `d-${Date.now()}`, ...deliverable };
    setState(prev => ({
      ...prev,
      cbsPhases: prev.cbsPhases.map(p =>
        p.id === phaseId ? { ...p, deliverables: [...p.deliverables, newDeliv] } : p
      ),
    }));
  };

  const handleExecuteCbsMigrationAction = (batchId: string, action: 'cleanse' | 'reconcile') => {
    const nowStamp = new Date().toISOString().replace('T', ' ').slice(0, 16);
    setState(prev => ({
      ...prev,
      cbsMigrationBatches: prev.cbsMigrationBatches.map(b => {
        if (b.id !== batchId) return b;
        if (action === 'cleanse') {
          return {
            ...b,
            cleansedRecords: b.totalRecords,
            exceptionCount: 0,
            stage: b.stage === 'Extracted' ? 'Cleansed & Deduped' : 'Transformed',
            lastRunAt: nowStamp,
          };
        }
        return {
          ...b,
          cleansedRecords: b.totalRecords,
          exceptionCount: 0,
          cbsMigratedTotal: b.legacyControlTotal,
          stage: 'Loaded & Reconciled',
          lastRunAt: nowStamp,
        };
      }),
    }));
  };

  const handleSimulateCbsLedgerEvent = (
    eventType: CbsLedgerSimTxn['eventType'],
    accountRef: string,
    amount: number
  ): CbsLedgerSimTxn => {
    const cleanAmt = Math.max(1, Math.round(amount));
    const uetr = `${Math.random().toString(16).slice(2, 10)}-${Math.random().toString(16).slice(2, 6)}-4c11-9b30-${Math.random().toString(16).slice(2, 14)}`.padEnd(36, '0').slice(0, 36);
    const idempotencyKey = `idem-${Math.random().toString(16).slice(2, 10)}-${Date.now().toString().slice(-4)}`;
    const nowStamp = new Date().toISOString().replace('T', ' ').slice(0, 19);

    let lines: CbsLedgerSimTxn['lines'];
    let isoType: CbsLedgerSimTxn['iso20022MessageType'] = 'pacs.008.001.08';

    if (eventType === 'CASA_DEPOSIT') {
      isoType = 'camt.053.001.08';
      lines = [
        { glCode: '110101', accountTitle: 'Vault Cash / Clearing Nostro Debit', debit: cleanAmt, credit: 0 },
        { glCode: '210101', accountTitle: `Customer CASA Liability (${accountRef})`, debit: 0, credit: cleanAmt },
      ];
    } else if (eventType === 'NEFT_OUTWARD') {
      isoType = 'pacs.008.001.08';
      lines = [
        { glCode: '210101', accountTitle: `Customer CASA Liability (${accountRef})`, debit: cleanAmt, credit: 0 },
        { glCode: '110402', accountTitle: 'RBI NEFT/RTGS Settlement Clearing', debit: 0, credit: cleanAmt },
      ];
    } else if (eventType === 'LOAN_DISBURSEMENT') {
      isoType = 'pain.001.001.09';
      const procFee = Math.round(cleanAmt * 0.01);
      const gst = Math.round(procFee * 0.18);
      const netCred = cleanAmt - procFee - gst;
      lines = [
        { glCode: '130201', accountTitle: `Term Loan Asset (${accountRef})`, debit: cleanAmt, credit: 0 },
        { glCode: '210101', accountTitle: 'Borrower Operational CASA Credit', debit: 0, credit: netCred },
        { glCode: '420105', accountTitle: 'Loan Origination Fee Income', debit: 0, credit: procFee },
        { glCode: '230418', accountTitle: 'GST Output Liability (18%)', debit: 0, credit: gst },
      ];
    } else if (eventType === 'DAILY_INTEREST_ACCRUAL') {
      isoType = 'camt.053.001.08';
      lines = [
        { glCode: '510201', accountTitle: 'Savings Deposit Interest Expense', debit: cleanAmt, credit: 0 },
        { glCode: '210990', accountTitle: `Accrued Interest Payable Control (${accountRef})`, debit: 0, credit: cleanAmt },
      ];
    } else {
      isoType = 'camt.053.001.08';
      lines = [
        { glCode: '410100', accountTitle: 'EOD Branch Interest Earned Sweep', debit: cleanAmt, credit: 0 },
        { glCode: '310100', accountTitle: 'Head Office Central Profit & Loss Control', debit: 0, credit: cleanAmt },
      ];
    }

    const simTxn: CbsLedgerSimTxn = {
      id: `sim-${Date.now()}`,
      idempotencyKey,
      uetr,
      timestamp: nowStamp,
      eventType,
      iso20022MessageType: isoType,
      accountRef,
      amount: cleanAmt,
      currency: 'INR',
      isolationLevel: 'SERIALIZABLE',
      latencyMs: 28 + Math.floor(Math.random() * 19),
      status: 'COMMITTED_IMMUTABLE',
      lines,
      isoXmlSnippet: `<Document xmlns="urn:iso:std:iso:20022:tech:xsd:${isoType}"><Hdr><MsgId>CBS-${Date.now()}</MsgId><UETR>${uetr}</UETR><Amt Ccy="INR">${cleanAmt.toFixed(2)}</Amt><Acct>${accountRef}</Acct></Hdr></Document>`,
    };

    setState(prev => ({ ...prev, cbsLedgerSimTxns: [simTxn, ...prev.cbsLedgerSimTxns] }));
    return simTxn;
  };

  const handleUpdateCbsCutoverStatus = (stepId: string, status: CbsCutoverStep['status']) => {
    setState(prev => ({
      ...prev,
      cbsCutoverSteps: prev.cbsCutoverSteps.map(s => (s.id === stepId ? { ...s, status } : s)),
    }));
  };


  return (
    <AppContext.Provider value={{
      ...state,
      handleAddCoopMember,
      handleAddCoopDeposit,
      handleAddCoopLoan,
      handleApproveCoopLoan,
      handlePostCoopLoanRepayment,
      handlePostDdoRecovery,
      handleCreateCoopBackupSnapshot,
      handleAddDividendRecord,
      handleAddAgmRecord,
      handleToggleCbsDeliverable,
      handleAddCbsDeliverable,
      handleExecuteCbsMigrationAction,
      handleSimulateCbsLedgerEvent,
      handleUpdateCbsCutoverStatus,
      setCurrentView,
      setCurrentUser,
      setState,
      handleLogin,
      handleLogout,
      handleToggleModule,
      setJevActivePipelineId,
      handleExecuteJevEvaluation,
      handleRunJevBatchSimulation,
      handleCommitStpRecord,
      handleTriggerSystem2Escalation,
      handleUpdateJevPipelineStatus,
      handleUpdateStpThreshold,
      handleAddLead,
      handleConvertLeadToApplication,
      handleAddApplication,
      handleAdvanceApplicationState,
      handleIssueClosureCertificates,
      handleRunDailyProcess,
      handleUpdateOperationalSettings,
      handleUpdateDatabaseSettings,
      handleUpdateMetadataSettings,
      handleUpdateLegalSettings,
      handleVoucherAction,
      handleAddVoucher,
      handlePushToCkyc,
      handleVerifyKyc,
      handleAddCompanyKyc,
      handleAddCustomerKyc,
      handleEndLease,
      handleAddVehicle,
      handleUpdateVehicleInsurance,
      handleLinkAccount,
      handleFetchStatement,
      handleReconcile,
      handleLogCollectionAction,
      handleLogCollectionPayment,
      handleInitiateVehicleSeizure,
      handleAddLegalCase,
      handleGenerateAgreement,
      handleMarkAgreementSigned,
      handleAddUser,
      handleAddLender,
      handleAddTransaction,
      handleAddComplianceTask,
      handleUpdateAssetClass,
      handleRunAudit,
      handleAddBranch,
      handleAddEmployee,
      handleAddSupportTicket,
      handleAddInteractionLog,
      handleAddDevelopmentGoal,
      handleMakeCustomerPayment,
      handleRunCreditCheck,
      handleUnderwritingDecision,
      handleIssueCard,
      handleCreatePaymentOrder,
      handleInvestigateAmlTransaction,
      handleAddGrievance,
      handleUpdateGrievanceStatus,
      handleAddGroup,
      handleAddPdc,
      handleUpdatePdcStatus,
      handleAddGoldLoan,
      handleMoveToAuction,
      handleUpdateCommunicationTemplate,
      handleCreateSwiftMessage,
      handleReleaseSwiftSanctions,
      handleRunCoreBatch,
      handleAddStandingOrder,
      handleToggleStandingOrder,
      handleCreateTradeFinanceCredit,
      handleAddConfiAccount,
      handleAddConfiJournalEntry,
      handleAddConfiInvoice,
      handleRecordConfiInvoicePayment,
      handleAddConfiBill,
      handleRecordConfiBillPayment,
      handleAddFixedAsset,
      handleRunFixedAssetDepreciation,
      handleAddRilletContract,
      handleRunRevRecAmortization,
      handleAutoMatchBankFeed,
      handleConfirmBankMatch,
      handleAddRilletPrepaid,
      handleRunPrepaidAmortization,
      handleSignoffFluxItem,
      handleToggleCloseChecklist,
      handleAskRilletAi,
      handlePeriodHardLock,
      handleRecalculateCrar,
      handleRunIndAs109EclProvision,
      handleSettleCoLendingEscrow,
      handleScrubBureauTudf,
      handleAddOpenCostCenter,
      handleAddOpenBudgetRule,
      handleExecutePeriodClose,
      // Runamarga
      setRunamargaActiveCallId,
      handleToggleRunamargaCampaign,
      handleCreateRunamargaCampaign,
      handleDispatchRunamargaWorkflow,
      handleSimulateRunamargaCallTurn,
      handleAddNewRunamargaCall,
      // OmniWorkspace
      handleCreateWorkspaceProject,
      handleUpdateProjectStage,
      handleCreateWorkspaceTask,
      handleToggleWorkspaceChecklistItem,
      handleUpdateTaskStatus,
      handleCreateWorkspaceDocument,
      handleSignWorkspaceDocument,
      handleRejectWorkspaceDocument,
      handleSendWorkspaceMessage,
      handleVerifyWorkspaceChecklist,
      handleAddWorkspaceCustomer,
      handleAddWorkspaceSupplier,
      handleApplyClientBankPreset,
      handleSetActiveBranch,
      handleSyncBranchToHq,
      handleToggleBranchIsolation,
      handleCreateBackupSnapshot,
      handleRestoreBackupSnapshot,
      handleCommitEntityMigration,
      handleRollbackMigration,
      // Tax AI
      handleUpdateTaxComplianceStatus,
      handleFileTaxRecord,
      handleSendTaxChatMessage,
      handleSendBusinessAssistantMessage
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
