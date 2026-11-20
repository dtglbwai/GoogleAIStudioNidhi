import React, { useMemo, useState } from 'react';
import { useAppContext } from '../AppContext';
import { formatCurrency } from '../utils/formatters';
import CoreBankingIcon from '../components/icons/CoreBankingIcon';
import {
  Layers,
  Globe,
  ArrowLeftRight,
  Landmark,
  CheckSquare,
  Cpu,
  Plus,
  Play,
  Download,
  CheckCircle2,
  ShieldCheck,
  Search,
} from 'lucide-react';

type EnterpriseTab =
  | 'modules'
  | 'omnichannel'
  | 'payments'
  | 'treasury'
  | 'operations'
  | 'strategy';

interface CifRecord {
  cifId: string;
  name: string;
  segment: 'Retail' | 'Corporate' | 'MSME' | 'Co-operative';
  kycTier: 'CKYC Verified' | 'Full KYC' | 'Enhanced Due Diligence';
  riskRating: 'Low' | 'Medium' | 'High';
  depositsTotal: number;
  creditExposure: number;
  branchCode: string;
}

interface ProductSchema {
  code: string;
  name: string;
  family: 'CASA' | 'Term Deposit' | 'Retail Loan' | 'Corporate Overdraft';
  baseRatePct: number;
  dayCount: 'Actual/365' | 'Actual/360' | '30/360';
  compounding: 'Daily' | 'Monthly' | 'Quarterly';
  minBalance: number;
  autoSweep: boolean;
}

interface ChannelGateway {
  id: string;
  channel: string;
  protocol: string;
  authStandard: string;
  slaTarget: string;
  tpsCapacity: number;
  enabled: boolean;
}

interface SmartPaymentItem {
  ref: string;
  beneficiary: string;
  currency: string;
  amount: number;
  rail: 'RTGS' | 'NEFT' | 'IMPS' | 'UPI' | 'SWIFT pacs.008';
  amlStatus: 'Cleared' | 'Enhanced Review';
  status: 'Settled' | 'Dual-Auth Pending' | 'Rejected';
  timestamp: string;
}

interface TradeInstrument {
  id: string;
  type: 'LC (MT700)' | 'Bank Guarantee' | 'Export Packing Credit';
  applicant: string;
  beneficiary: string;
  currency: string;
  amount: number;
  stage: 'Draft' | 'Limit Check' | 'Dual Auth' | 'Advised' | 'Settled';
}

interface FxDeal {
  dealId: string;
  pair: string;
  side: 'Buy' | 'Sell';
  tenor: 'Spot (T+2)' | 'Tom (T+1)' | '1M Forward';
  notionalForeign: number;
  contractRate: number;
  counterparty: string;
  bookedAt: string;
}

interface BatchStep {
  seq: number;
  code: string;
  name: string;
  subsystem: string;
  status: 'Completed' | 'Running' | 'Queued';
  durationMs: number;
}

interface MakerCheckerItem {
  id: string;
  category: string;
  reference: string;
  summary: string;
  amountImpact: number;
  maker: string;
  createdAt: string;
  status: 'Pending Checker' | 'Approved' | 'Returned';
}

const INITIAL_CIFS: CifRecord[] = [
  {
    cifId: 'CIF-1004821',
    name: 'Sahyadri Agro Co-op Federation',
    segment: 'Co-operative',
    kycTier: 'CKYC Verified',
    riskRating: 'Low',
    depositsTotal: 4250000,
    creditExposure: 1850000,
    branchCode: 'BR-001',
  },
  {
    cifId: 'CIF-1004910',
    name: 'Narmada Precision Components Pvt Ltd',
    segment: 'Corporate',
    kycTier: 'Full KYC',
    riskRating: 'Low',
    depositsTotal: 9400000,
    creditExposure: 6200000,
    branchCode: 'BR-002',
  },
  {
    cifId: 'CIF-1005118',
    name: 'Deccan Cold-Chain Logistics',
    segment: 'MSME',
    kycTier: 'Full KYC',
    riskRating: 'Medium',
    depositsTotal: 1180000,
    creditExposure: 2450000,
    branchCode: 'BR-004',
  },
  {
    cifId: 'CIF-1005294',
    name: 'Ananya Deshmukh',
    segment: 'Retail',
    kycTier: 'CKYC Verified',
    riskRating: 'Low',
    depositsTotal: 645000,
    creditExposure: 320000,
    branchCode: 'BR-001',
  },
];

const INITIAL_PRODUCTS: ProductSchema[] = [
  {
    code: 'SB-PRIME',
    name: 'Privilege Savings Sweep',
    family: 'CASA',
    baseRatePct: 3.75,
    dayCount: 'Actual/365',
    compounding: 'Quarterly',
    minBalance: 10000,
    autoSweep: true,
  },
  {
    code: 'CA-ZBA',
    name: 'Corporate Zero-Balance Current',
    family: 'CASA',
    baseRatePct: 0.0,
    dayCount: 'Actual/365',
    compounding: 'Monthly',
    minBalance: 50000,
    autoSweep: true,
  },
  {
    code: 'TD-CUM365',
    name: 'Fixed Deposit Cumulative Yield',
    family: 'Term Deposit',
    baseRatePct: 7.45,
    dayCount: 'Actual/365',
    compounding: 'Quarterly',
    minBalance: 25000,
    autoSweep: false,
  },
  {
    code: 'OD-WC-CORP',
    name: 'Working Capital Overdraft Facility',
    family: 'Corporate Overdraft',
    baseRatePct: 10.6,
    dayCount: 'Actual/365',
    compounding: 'Monthly',
    minBalance: 0,
    autoSweep: false,
  },
];

const INITIAL_CHANNELS: ChannelGateway[] = [
  {
    id: 'ch-1',
    channel: 'Retail & Corporate Internet Portal',
    protocol: 'HTTPS / REST + OpenID Connect',
    authStandard: 'MFA + Device Binding',
    slaTarget: '99.99% (<180ms)',
    tpsCapacity: 2400,
    enabled: true,
  },
  {
    id: 'ch-2',
    channel: 'Mobile Banking SDK (iOS / Android)',
    protocol: 'REST / gRPC + TLS 1.3 Pinning',
    authStandard: 'FIDO2 Biometric + SIM Bind',
    slaTarget: '99.99% (<150ms)',
    tpsCapacity: 3800,
    enabled: true,
  },
  {
    id: 'ch-3',
    channel: 'Branch Teller & Cash Workbench',
    protocol: 'Internal mTLS Mesh',
    authStandard: 'AD SSO + Maker/Checker Token',
    slaTarget: '99.95% (<220ms)',
    tpsCapacity: 950,
    enabled: true,
  },
  {
    id: 'ch-4',
    channel: 'ATM / Debit / POS Card Switch',
    protocol: 'ISO 8583 (1987 / 1993)',
    authStandard: 'FIPS 140-3 HSM PIN Block',
    slaTarget: '99.995% (<95ms)',
    tpsCapacity: 4500,
    enabled: true,
  },
  {
    id: 'ch-5',
    channel: 'Open Banking / BaaS Partner API Hub',
    protocol: 'OpenAPI 3.1 + FAPI 2.0',
    authStandard: 'OAuth2 Client Certs + JWS',
    slaTarget: '99.95% (<200ms)',
    tpsCapacity: 3100,
    enabled: true,
  },
];

const INITIAL_PAYMENTS: SmartPaymentItem[] = [
  {
    ref: 'PAY-992014',
    beneficiary: 'Bharat Heavy Pumps Ltd',
    currency: 'INR',
    amount: 2450000,
    rail: 'RTGS',
    amlStatus: 'Cleared',
    status: 'Settled',
    timestamp: '10:14:22',
  },
  {
    ref: 'PAY-992015',
    beneficiary: 'EuroTrade GmbH Frankfurt',
    currency: 'EUR',
    amount: 48500,
    rail: 'SWIFT pacs.008',
    amlStatus: 'Enhanced Review',
    status: 'Dual-Auth Pending',
    timestamp: '10:21:05',
  },
  {
    ref: 'PAY-992016',
    beneficiary: 'Kaveri Packaging Associates',
    currency: 'INR',
    amount: 185000,
    rail: 'NEFT',
    amlStatus: 'Cleared',
    status: 'Settled',
    timestamp: '10:29:40',
  },
];

const INITIAL_TRADE: TradeInstrument[] = [
  {
    id: 'TRD-LC-7041',
    type: 'LC (MT700)',
    applicant: 'Narmada Precision Components Pvt Ltd',
    beneficiary: 'Osaka CNC Exports Corp',
    currency: 'USD',
    amount: 180000,
    stage: 'Dual Auth',
  },
  {
    id: 'TRD-BG-3108',
    type: 'Bank Guarantee',
    applicant: 'Deccan Cold-Chain Logistics',
    beneficiary: 'State Warehousing Authority',
    currency: 'INR',
    amount: 3500000,
    stage: 'Limit Check',
  },
];

const INITIAL_FX_DEALS: FxDeal[] = [
  {
    dealId: 'FX-2026-881',
    pair: 'USD/INR',
    side: 'Buy',
    tenor: 'Spot (T+2)',
    notionalForeign: 250000,
    contractRate: 84.185,
    counterparty: 'Clearing House Interbank Desk',
    bookedAt: '09:45:12',
  },
  {
    dealId: 'FX-2026-882',
    pair: 'EUR/INR',
    side: 'Sell',
    tenor: '1M Forward',
    notionalForeign: 120000,
    contractRate: 91.42,
    counterparty: 'Narmada Precision Treasury',
    bookedAt: '10:08:30',
  },
];

const INITIAL_BATCH_STEPS: BatchStep[] = [
  { seq: 1, code: 'SHDW-SNAP', name: '24x7 Shadow-Ledger Read-Replica Cutover', subsystem: 'CQRS Store', status: 'Completed', durationMs: 410 },
  { seq: 2, code: 'ACCR-INT', name: 'Daily CASA, TD & Loan Interest Accrual Engine', subsystem: 'Product Engine', status: 'Completed', durationMs: 1280 },
  { seq: 3, code: 'SI-SWEEP', name: 'Standing Instructions & ZBA Liquidity Sweeps', subsystem: 'Liquidity Hub', status: 'Completed', durationMs: 690 },
  { seq: 4, code: 'NPA-DPD', name: 'IRAC / IndAS DPD Asset Classification Roll', subsystem: 'Risk & Lending', status: 'Completed', durationMs: 840 },
  { seq: 5, code: 'GL-PROOF', name: 'Multi-Branch Double-Entry GL Trial Balance Proof', subsystem: 'General Ledger', status: 'Completed', durationMs: 530 },
  { seq: 6, code: 'REG-XBRL', name: 'Regulatory XBRL & Statutory ADF Reporting Extract', subsystem: 'Compliance', status: 'Completed', durationMs: 495 },
];

const INITIAL_CHECKER_QUEUE: MakerCheckerItem[] = [
  {
    id: 'MC-401',
    category: 'Overdraft Limit Enhancement',
    reference: 'OD-WC-88412',
    summary: 'Increase corporate OD limit from 50L to 75L against receivable charge',
    amountImpact: 2500000,
    maker: 'credit.officer@bank',
    createdAt: '09:52:10',
    status: 'Pending Checker',
  },
  {
    id: 'MC-402',
    category: 'Dormant Account Reactivation',
    reference: 'SB-00419283',
    summary: 'Re-KYC video verification completed; reactivate savings ledger',
    amountImpact: 412000,
    maker: 'teller.branch01@bank',
    createdAt: '10:04:45',
    status: 'Pending Checker',
  },
  {
    id: 'MC-403',
    category: 'Term Deposit Lien Release',
    reference: 'TD-00912041',
    summary: 'Release pledge lien post full loan closure voucher GL-9841',
    amountImpact: 1200000,
    maker: 'ops.desk@bank',
    createdAt: '10:19:02',
    status: 'Pending Checker',
  },
];

const ALM_BUCKETS = [
  { bucket: '1 - 14 Days', inflows: 48.5, outflows: 42.0 },
  { bucket: '15 - 28 Days', inflows: 26.2, outflows: 24.8 },
  { bucket: '29 Days - 3 Months', inflows: 64.0, outflows: 59.5 },
  { bucket: '3 - 6 Months', inflows: 82.4, outflows: 78.1 },
  { bucket: '6 - 12 Months', inflows: 118.0, outflows: 109.5 },
  { bucket: '1 - 3 Years', inflows: 196.5, outflows: 174.2 },
];

const TECH_LAYERS = [
  {
    layer: '01. Omnichannel & Partner Experience',
    components: 'Web SPA, Mobile SDK, Teller Workbench, Open Banking Developer Portal',
    patterns: 'Micro-Frontends · Zero-Trust Session Tokens · WCAG AA',
  },
  {
    layer: '02. API Gateway & Channel Orchestration',
    components: 'FAPI 2.0 OAuth2 Gateway, Rate Limiter, ISO 8583 & ISO 20022 Adapters',
    patterns: 'mTLS · Idempotency-Key Enforcement · Schema Validation',
  },
  {
    layer: '03. Domain-Driven Business Microservices',
    components: 'CIF, Product Factory, Deposits, Lending, Payments Hub, Trade Finance, Treasury',
    patterns: 'Bounded Contexts · Outbox Pattern · Saga Compensations',
  },
  {
    layer: '04. High-Integrity Core Accounting & Ledger',
    components: 'Immutable Double-Entry Journal, Chart of Accounts, EOD/BOD Shadow-Ledger',
    patterns: 'Serializable ACID · Zero Floating-Point Rounding · Temporal Audit',
  },
  {
    layer: '05. Security, HSM & Compliance Controls',
    components: 'FIPS 140-3 HSM PIN/Key Custody, AML Sanctions Screener, Maker-Checker RBAC',
    patterns: 'Envelope Encryption · PII Egress Airlock · Immutable WORM Logs',
  },
  {
    layer: '06. Active-Active Cloud-Native Infrastructure',
    components: 'Kubernetes Multi-AZ Clusters, Distributed SQL + Read Replicas, Kafka Event Backbone',
    patterns: 'RPO = 0s · RTO < 5m · Blue/Green & Canary Rollouts',
  },
];

const STRATEGIES = [
  {
    id: 'strangler',
    name: 'Strangler Fig ("Hollow-the-Core")',
    horizon: '12 - 18 Months',
    riskProfile: 'Low (Progressive Traffic Cutover)',
    bestFor: 'Universal & Co-operative Banks with live legacy cores that cannot risk downtime',
    steps: [
      'Deploy API Gateway & Event CDC mirror ahead of legacy core',
      'Carve out Digital Payments, Virtual Accounts & Product Factory first',
      'Run 30-day dual-ledger parallel parity reconciliation per product slice',
      'Decommission legacy mainframe/monolith modules batch by batch',
    ],
  },
  {
    id: 'sidecar',
    name: 'Sidecar / Green-Field Digital Core',
    horizon: '4 - 7 Months',
    riskProfile: 'Minimal (Isolated New Launch)',
    bestFor: 'New NBFC Lending Verticals, Co-operative Mobile Banking, or Corporate VAM Launches',
    steps: [
      'Provision clean modular core beside existing ERP/CBS',
      'Launch digital savings, co-lending, or instant credit line products rapidly',
      'Roll up automated EOD General Ledger summaries into enterprise GL',
      'Migrate existing books only after full operational maturity',
    ],
  },
  {
    id: 'bigbang',
    name: 'Phased Big-Bang Cutover',
    horizon: '8 - 12 Months',
    riskProfile: 'Managed (Weekend Dress Rehearsals)',
    bestFor: 'Single-tenant NBFCs or Regional Credit Societies consolidating fragmented systems',
    steps: [
      'Complete 3 full mock ETL dry-runs with 100% trial balance hash match',
      'Freeze legacy ledger over scheduled cutover window and take SHA-256 baseline',
      'Execute automated CIF + Balance + Loan Schedule migration',
      'Run Day-1 BOD verification and dual-auth smoke test before branch open',
    ],
  },
] as const;

const API_CATALOG = [
  {
    id: 'api-bal',
    method: 'GET',
    path: '/cbs/v2/accounts/{accountId}/balance',
    scope: 'accounts.read',
    sampleReq: '{\n  "accountId": "ACC-10094821",\n  "includeShadowHold": true\n}',
  },
  {
    id: 'api-pay',
    method: 'POST',
    path: '/cbs/v2/payments/pacs008',
    scope: 'payments.initiate',
    sampleReq: '{\n  "idempotencyKey": "IDEM-849102",\n  "debtorAccount": "ACC-10094821",\n  "creditorAccount": "IFSC0009182",\n  "currency": "INR",\n  "amount": 250000\n}',
  },
  {
    id: 'api-fd',
    method: 'POST',
    path: '/cbs/v2/deposits/term-open',
    scope: 'deposits.write',
    sampleReq: '{\n  "cifId": "CIF-1004821",\n  "productCode": "TD-CUM365",\n  "principal": 500000,\n  "tenureDays": 365\n}',
  },
  {
    id: 'api-kyc',
    method: 'POST',
    path: '/cbs/v2/cif/kyc-screen',
    scope: 'compliance.screen',
    sampleReq: '{\n  "cifId": "CIF-1005118",\n  "checkSanctions": true,\n  "checkCkyc": true\n}',
  },
];

function downloadFile(filename: string, content: string, mime = 'text/csv;charset=utf-8;') {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

const EnterpriseCoreBanking: React.FC = () => {
  const { customerAccounts, coopMembers, currentUser } = useAppContext();

  const [activeTab, setActiveTab] = useState<EnterpriseTab>('modules');
  const [notice, setNotice] = useState<string | null>(null);

  // Tab 1: CIF & Product Factory
  const [cifs, setCifs] = useState<CifRecord[]>(INITIAL_CIFS);
  const [cifSearch, setCifSearch] = useState('');
  const [showNewCif, setShowNewCif] = useState(false);
  const [newCifName, setNewCifName] = useState('');
  const [newCifSegment, setNewCifSegment] = useState<CifRecord['segment']>('Corporate');
  const [products, setProducts] = useState<ProductSchema[]>(INITIAL_PRODUCTS);
  const [selectedProdCode, setSelectedProdCode] = useState<string>(INITIAL_PRODUCTS[2].code);
  const [simPrincipal, setSimPrincipal] = useState<number>(500000);
  const [simDays, setSimDays] = useState<number>(180);
  const [showNewProd, setShowNewProd] = useState(false);
  const [newProdCode, setNewProdCode] = useState('');
  const [newProdName, setNewProdName] = useState('');
  const [newProdRate, setNewProdRate] = useState(7.25);

  // Tab 2: Omnichannel & API Hub
  const [channels, setChannels] = useState<ChannelGateway[]>(INITIAL_CHANNELS);
  const [selectedApiId, setSelectedApiId] = useState<string>(API_CATALOG[1].id);
  const [apiPayload, setApiPayload] = useState<string>(API_CATALOG[1].sampleReq);
  const [apiResponse, setApiResponse] = useState<string>('');

  // Tab 3: Payments Hub & VAM Liquidity
  const [payments, setPayments] = useState<SmartPaymentItem[]>(INITIAL_PAYMENTS);
  const [payBeneficiary, setPayBeneficiary] = useState('');
  const [payAmount, setPayAmount] = useState(350000);
  const [payCurrency, setPayCurrency] = useState('INR');
  const [payUrgency, setPayUrgency] = useState<'Instant' | 'Same-Day' | 'Cross-Border'>('Same-Day');
  const [poolBalances, setPoolBalances] = useState({ accA: 1850000, accB: -620000, accC: 940000 });

  // Tab 4: Treasury, Trade Finance & ALM
  const [fxDeals, setFxDeals] = useState<FxDeal[]>(INITIAL_FX_DEALS);
  const [fxPair, setFxPair] = useState('USD/INR');
  const [fxSide, setFxSide] = useState<'Buy' | 'Sell'>('Buy');
  const [fxNotional, setFxNotional] = useState(100000);
  const [tradeList, setTradeList] = useState<TradeInstrument[]>(INITIAL_TRADE);

  // Tab 5: 24x7 Batch & Maker-Checker
  const [batchSteps, setBatchSteps] = useState<BatchStep[]>(INITIAL_BATCH_STEPS);
  const [batchRunning, setBatchRunning] = useState(false);
  const [lastBatchRun, setLastBatchRun] = useState<string>('2026-11-19 06:00:05 UTC');
  const [checkerQueue, setCheckerQueue] = useState<MakerCheckerItem[]>(INITIAL_CHECKER_QUEUE);

  // Tab 6: Strategy
  const [selectedStrategyId, setSelectedStrategyId] = useState<string>('strangler');

  const filteredCifs = useMemo(() => {
    const q = cifSearch.trim().toLowerCase();
    if (!q) return cifs;
    return cifs.filter(
      c =>
        c.name.toLowerCase().includes(q) ||
        c.cifId.toLowerCase().includes(q) ||
        c.segment.toLowerCase().includes(q)
    );
  }, [cifs, cifSearch]);

  const activeProduct = useMemo(
    () => products.find(p => p.code === selectedProdCode) || products[0],
    [products, selectedProdCode]
  );

  const accrualResult = useMemo(() => {
    const basis = activeProduct.dayCount === 'Actual/365' ? 365 : 360;
    const rateDecimal = activeProduct.baseRatePct / 100;
    const periodsPerYear =
      activeProduct.compounding === 'Daily' ? 365 : activeProduct.compounding === 'Monthly' ? 12 : 4;
    const grossSimple = simPrincipal * rateDecimal * (simDays / basis);
    const compoundFactor = Math.pow(1 + rateDecimal / periodsPerYear, periodsPerYear * (simDays / basis)) - 1;
    const accruedCompound = simPrincipal * compoundFactor;
    const tdsWithheld = accruedCompound > 40000 ? accruedCompound * 0.1 : 0;
    return {
      grossSimple,
      accruedCompound,
      tdsWithheld,
      netPayable: accruedCompound - tdsWithheld,
      effectiveApyPct: (Math.pow(1 + rateDecimal / periodsPerYear, periodsPerYear) - 1) * 100,
    };
  }, [activeProduct, simPrincipal, simDays]);

  const netPoolLiquidity = poolBalances.accA + poolBalances.accB + poolBalances.accC;

  const almTotals = useMemo(() => {
    let cumulative = 0;
    return ALM_BUCKETS.map(b => {
      const net = b.inflows - b.outflows;
      cumulative += net;
      return { ...b, net, cumulative, mismatchPct: (net / b.outflows) * 100 };
    });
  }, []);

  const handleAddCif = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCifName.trim()) return;
    const id = `CIF-${Math.floor(1006000 + Math.random() * 3000)}`;
    setCifs(prev => [
      {
        cifId: id,
        name: newCifName.trim(),
        segment: newCifSegment,
        kycTier: 'CKYC Verified',
        riskRating: 'Low',
        depositsTotal: 0,
        creditExposure: 0,
        branchCode: 'BR-001',
      },
      ...prev,
    ]);
    setNewCifName('');
    setShowNewCif(false);
    setNotice(`Onboarded customer ${id} into Central CIF Registry.`);
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdCode.trim() || !newProdName.trim()) return;
    const codeUpper = newProdCode.trim().toUpperCase();
    setProducts(prev => [
      {
        code: codeUpper,
        name: newProdName.trim(),
        family: 'Term Deposit',
        baseRatePct: Number(newProdRate) || 7.0,
        dayCount: 'Actual/365',
        compounding: 'Quarterly',
        minBalance: 10000,
        autoSweep: false,
      },
      ...prev,
    ]);
    setSelectedProdCode(codeUpper);
    setNewProdCode('');
    setNewProdName('');
    setShowNewProd(false);
    setNotice(`Published configurable banking product ${codeUpper} without code deployment.`);
  };

  const handleSelectApi = (id: string) => {
    setSelectedApiId(id);
    const spec = API_CATALOG.find(a => a.id === id);
    if (spec) {
      setApiPayload(spec.sampleReq);
      setApiResponse('');
    }
  };

  const handleExecuteApiTest = () => {
    const spec = API_CATALOG.find(a => a.id === selectedApiId) || API_CATALOG[0];
    try {
      const parsed = JSON.parse(apiPayload);
      const responseObj = {
        httpStatus: 200,
        gatewayTraceId: `gw-${Date.now().toString(36)}`,
        endpoint: `${spec.method} ${spec.path}`,
        oauthScopeVerified: spec.scope,
        latencyMs: 34,
        data: {
          status: 'COMMITTED',
          echo: parsed,
          ledgerHash: `sha256:${Math.random().toString(16).slice(2, 14)}`,
        },
      };
      setApiResponse(JSON.stringify(responseObj, null, 2));
      setNotice(`Executed ${spec.method} ${spec.path} cleanly via Open API Gateway.`);
    } catch {
      setApiResponse(
        JSON.stringify(
          { httpStatus: 400, error: 'SCHEMA_VALIDATION_FAILED', message: 'Invalid JSON request payload.' },
          null,
          2
        )
      );
    }
  };

  const handleRoutePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payBeneficiary.trim() || payAmount <= 0) return;
    let rail: SmartPaymentItem['rail'] = 'NEFT';
    if (payCurrency !== 'INR' || payUrgency === 'Cross-Border') {
      rail = 'SWIFT pacs.008';
    } else if (payUrgency === 'Instant' && payAmount <= 500000) {
      rail = payAmount <= 100000 ? 'UPI' : 'IMPS';
    } else if (payAmount >= 200000) {
      rail = 'RTGS';
    }
    const needsDualAuth = payAmount >= 1000000 || rail === 'SWIFT pacs.008';
    const ref = `PAY-${Math.floor(992100 + Math.random() * 8900)}`;
    const next: SmartPaymentItem = {
      ref,
      beneficiary: payBeneficiary.trim(),
      currency: payCurrency,
      amount: payAmount,
      rail,
      amlStatus: needsDualAuth ? 'Enhanced Review' : 'Cleared',
      status: needsDualAuth ? 'Dual-Auth Pending' : 'Settled',
      timestamp: new Date().toTimeString().slice(0, 8),
    };
    setPayments(prev => [next, ...prev]);
    setPayBeneficiary('');
    setNotice(`Routed ${ref} via ${rail} (${next.status}).`);
  };

  const handleUpdatePaymentStatus = (ref: string, status: SmartPaymentItem['status']) => {
    setPayments(prev => prev.map(p => (p.ref === ref ? { ...p, status } : p)));
    setNotice(`Payment ${ref} updated to ${status}.`);
  };

  const handleBookFxDeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (fxNotional <= 0) return;
    const baseRates: Record<string, number> = {
      'USD/INR': 84.19,
      'EUR/INR': 91.35,
      'GBP/INR': 106.82,
      'AED/INR': 22.92,
    };
    const dealId = `FX-2026-${Math.floor(890 + Math.random() * 100)}`;
    const rate = baseRates[fxPair] || 84.0;
    setFxDeals(prev => [
      {
        dealId,
        pair: fxPair,
        side: fxSide,
        tenor: 'Spot (T+2)',
        notionalForeign: fxNotional,
        contractRate: rate,
        counterparty: 'Treasury Interbank Desk',
        bookedAt: new Date().toTimeString().slice(0, 8),
      },
      ...prev,
    ]);
    setNotice(`Booked ${fxSide} ${fxPair} deal ${dealId} at ${rate}.`);
  };

  const handleAdvanceTradeStage = (id: string) => {
    const order: TradeInstrument['stage'][] = ['Draft', 'Limit Check', 'Dual Auth', 'Advised', 'Settled'];
    setTradeList(prev =>
      prev.map(t => {
        if (t.id !== id) return t;
        const idx = order.indexOf(t.stage);
        const nextStage = idx < order.length - 1 ? order[idx + 1] : t.stage;
        return { ...t, stage: nextStage };
      })
    );
    setNotice(`Advanced workflow stage for trade instrument ${id}.`);
  };

  const handleRun24x7Batch = () => {
    if (batchRunning) return;
    setBatchRunning(true);
    setBatchSteps(prev => prev.map(s => ({ ...s, status: 'Queued' })));

    INITIAL_BATCH_STEPS.forEach((step, idx) => {
      setTimeout(() => {
        setBatchSteps(prev =>
          prev.map(s =>
            s.seq === step.seq
              ? { ...s, status: 'Running' }
              : s.seq < step.seq
              ? { ...s, status: 'Completed' }
              : s
          )
        );
      }, idx * 280);

      setTimeout(() => {
        setBatchSteps(prev =>
          prev.map(s => (s.seq === step.seq ? { ...s, status: 'Completed' } : s))
        );
        if (idx === INITIAL_BATCH_STEPS.length - 1) {
          setBatchRunning(false);
          setLastBatchRun(new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC');
          setNotice('Completed 24x7 Shadow-Ledger EOD/BOD cycle with zero GL trial balance variance.');
        }
      }, idx * 280 + 220);
    });
  };

  const handleCheckerAction = (id: string, decision: 'Approved' | 'Returned') => {
    setCheckerQueue(prev => prev.map(item => (item.id === id ? { ...item, status: decision } : item)));
    setNotice(`Dual-control verification ${decision.toLowerCase()} for ${id} by ${currentUser || 'Supervisor'}.`);
  };

  const handleExportBlueprint = () => {
    const payload = {
      exportedAt: new Date().toISOString(),
      suite: 'Enterprise Core Banking System Suite',
      cifCount: cifs.length,
      productCatalog: products,
      channels,
      paymentsCount: payments.length,
      almBuckets: almTotals,
      techLayers: TECH_LAYERS,
      selectedStrategy: STRATEGIES.find(s => s.id === selectedStrategyId),
    };
    downloadFile('enterprise-core-banking-blueprint.json', JSON.stringify(payload, null, 2), 'application/json');
    setNotice('Exported complete Enterprise Core Banking architecture & capability specification.');
  };

  const tabs: { id: EnterpriseTab; label: string; icon: React.ReactNode }[] = [
    { id: 'modules', label: '01. CIF & Product Factory', icon: <Layers className="w-4 h-4" /> },
    { id: 'omnichannel', label: '02. Omnichannel & APIs', icon: <Globe className="w-4 h-4" /> },
    { id: 'payments', label: '03. Payments & Liquidity', icon: <ArrowLeftRight className="w-4 h-4" /> },
    { id: 'treasury', label: '04. Treasury, Trade & ALM', icon: <Landmark className="w-4 h-4" /> },
    { id: 'operations', label: '05. 24x7 Batch & Dual-Auth', icon: <CheckSquare className="w-4 h-4" /> },
    { id: 'strategy', label: '06. Tech Stack & Strategy', icon: <Cpu className="w-4 h-4" /> },
  ];

  const pendingCheckers = checkerQueue.filter(c => c.status === 'Pending Checker').length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Bar */}
      <div className="bg-[var(--df-surface)] border border-[var(--df-border)] rounded-xl p-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-slate-900 text-white rounded-lg shrink-0">
            <div className="w-6 h-6">
              <CoreBankingIcon />
            </div>
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-[var(--df-text)] tracking-tight">
              Enterprise Core Banking &amp; Universal Financial Suite
            </h1>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-[var(--df-muted)]">
              <span>CIF &amp; No-Code Product Factory</span>
              <span aria-hidden="true">·</span>
              <span>Omnichannel Open API Hub</span>
              <span aria-hidden="true">·</span>
              <span>ISO 20022 Payments, Treasury &amp; 24x7 Shadow-Ledger Core</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleExportBlueprint}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-primary hover:bg-primary-dark rounded-lg transition-colors whitespace-nowrap"
          >
            <Download className="w-4 h-4" />
            Export Core Spec (JSON)
          </button>
        </div>
      </div>

      {notice && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 px-4 py-3 rounded-lg flex items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>{notice}</span>
          </div>
          <button onClick={() => setNotice(null)} className="font-semibold hover:underline">
            Dismiss
          </button>
        </div>
      )}

      {/* Top KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[var(--df-surface)] border border-[var(--df-border)] rounded-xl p-4">
          <div className="text-xs font-medium text-[var(--df-muted)]">Central CIF &amp; Deposit Books</div>
          <div className="font-display text-2xl font-bold text-[var(--df-text)] mt-1 tabular-nums">
            {cifs.length + customerAccounts.length + coopMembers.length}
          </div>
          <div className="text-xs text-[var(--df-muted)] mt-1">Unified retail, corporate &amp; co-op profiles</div>
        </div>

        <div className="bg-[var(--df-surface)] border border-[var(--df-border)] rounded-xl p-4">
          <div className="text-xs font-medium text-[var(--df-muted)]">Active Product Schemas</div>
          <div className="font-display text-2xl font-bold text-[var(--df-text)] mt-1 tabular-nums">
            {products.length}
          </div>
          <div className="text-xs text-[var(--df-muted)] mt-1">Configurable rules &amp; accrual templates</div>
        </div>

        <div className="bg-[var(--df-surface)] border border-[var(--df-border)] rounded-xl p-4">
          <div className="text-xs font-medium text-[var(--df-muted)]">Channel Capacity (TPS)</div>
          <div className="font-display text-2xl font-bold text-[var(--df-text)] mt-1 tabular-nums">
            {channels.filter(c => c.enabled).reduce((s, c) => s + c.tpsCapacity, 0).toLocaleString()}
          </div>
          <div className="text-xs text-[var(--df-muted)] mt-1">Omnichannel ISO 8583, FAPI 2.0 &amp; mTLS</div>
        </div>

        <div className="bg-[var(--df-surface)] border border-[var(--df-border)] rounded-xl p-4">
          <div className="text-xs font-medium text-[var(--df-muted)]">Dual-Control Pending Queue</div>
          <div className="font-display text-2xl font-bold text-[var(--df-text)] mt-1 tabular-nums">
            {pendingCheckers}
          </div>
          <div className="text-xs text-[var(--df-muted)] mt-1">Segregated maker-checker overrides</div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-[var(--df-surface)] border border-[var(--df-border)] rounded-xl p-1.5 flex flex-wrap gap-1">
        {tabs.map(t => {
          const active = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                active
                  ? 'bg-slate-900 text-white'
                  : 'text-[var(--df-muted)] hover:bg-[var(--df-surface-subtle)] hover:text-[var(--df-text)]'
              }`}
            >
              {t.icon}
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: CIF & PRODUCT FACTORY */}
      {activeTab === 'modules' && (
        <div className="space-y-6">
          <div className="bg-[var(--df-surface)] border border-[var(--df-border)] rounded-xl p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="font-display text-base font-bold text-[var(--df-text)]">
                  Customer Information File (CIF) &amp; Relationship Hierarchy
                </h2>
                <p className="text-xs text-[var(--df-muted)] mt-0.5">
                  Single-customer view across deposits, credit exposure, CKYC tier, and branch domicile.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-[var(--df-muted)] absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={cifSearch}
                    onChange={e => setCifSearch(e.target.value)}
                    placeholder="Search CIF ID or name..."
                    className="pl-8 pr-3 py-1.5 text-xs bg-[var(--df-surface)] border border-[var(--df-border)] rounded-lg text-[var(--df-text)]"
                  />
                </div>
                <button
                  onClick={() => setShowNewCif(v => !v)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-primary hover:bg-primary-dark rounded-lg whitespace-nowrap"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Onboard CIF
                </button>
              </div>
            </div>

            {showNewCif && (
              <form onSubmit={handleAddCif} className="grid grid-cols-1 sm:grid-cols-4 gap-3 p-4 bg-[var(--df-surface-subtle)] border border-[var(--df-border)] rounded-lg">
                <input
                  type="text"
                  required
                  value={newCifName}
                  onChange={e => setNewCifName(e.target.value)}
                  placeholder="Legal entity or customer name"
                  className="sm:col-span-2 px-3 py-2 text-xs bg-[var(--df-surface)] border border-[var(--df-border)] rounded-lg"
                />
                <select
                  value={newCifSegment}
                  onChange={e => setNewCifSegment(e.target.value as CifRecord['segment'])}
                  className="px-3 py-2 text-xs bg-[var(--df-surface)] border border-[var(--df-border)] rounded-lg"
                >
                  <option value="Corporate">Corporate</option>
                  <option value="Retail">Retail</option>
                  <option value="MSME">MSME</option>
                  <option value="Co-operative">Co-operative</option>
                </select>
                <button type="submit" className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg">
                  Create CIF Record
                </button>
              </form>
            )}

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="border-b border-[var(--df-border)] text-[var(--df-muted)]">
                  <tr>
                    <th className="py-2.5 pr-4 font-semibold">CIF ID</th>
                    <th className="py-2.5 pr-4 font-semibold">Customer / Entity</th>
                    <th className="py-2.5 pr-4 font-semibold">Segment</th>
                    <th className="py-2.5 pr-4 font-semibold">KYC Tier</th>
                    <th className="py-2.5 pr-4 font-semibold">Risk Rating</th>
                    <th className="py-2.5 pr-4 font-semibold text-right">Deposits</th>
                    <th className="py-2.5 font-semibold text-right">Credit Exposure</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--df-border)]">
                  {filteredCifs.map(row => (
                    <tr key={row.cifId} className="hover:bg-[var(--df-surface-subtle)]/50">
                      <td className="py-2.5 pr-4 font-mono tabular-nums text-[var(--df-text)]">{row.cifId}</td>
                      <td className="py-2.5 pr-4 font-medium text-[var(--df-text)]">{row.name}</td>
                      <td className="py-2.5 pr-4 text-[var(--df-muted)]">{row.segment}</td>
                      <td className="py-2.5 pr-4 text-[var(--df-muted)]">{row.kycTier}</td>
                      <td className="py-2.5 pr-4">
                        <span className={row.riskRating === 'Low' ? 'text-emerald-700 font-semibold' : 'text-amber-700 font-semibold'}>
                          {row.riskRating}
                        </span>
                      </td>
                      <td className="py-2.5 pr-4 font-mono tabular-nums text-right">{formatCurrency(row.depositsTotal)}</td>
                      <td className="py-2.5 font-mono tabular-nums text-right">{formatCurrency(row.creditExposure)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Product Factory & Accrual Simulator */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 bg-[var(--df-surface)] border border-[var(--df-border)] rounded-xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-display text-base font-bold text-[var(--df-text)]">
                    No-Code Configurable Product Factory
                  </h2>
                  <p className="text-xs text-[var(--df-muted)] mt-0.5">
                    Launch deposit, sweep, and lending parameters dynamically without core code releases.
                  </p>
                </div>
                <button
                  onClick={() => setShowNewProd(v => !v)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-[var(--df-text)] bg-[var(--df-surface)] border border-[var(--df-border)] rounded-lg hover:bg-[var(--df-surface-subtle)]"
                >
                  <Plus className="w-3.5 h-3.5" />
                  New Schema
                </button>
              </div>

              {showNewProd && (
                <form onSubmit={handleAddProduct} className="grid grid-cols-1 sm:grid-cols-4 gap-3 p-3 bg-[var(--df-surface-subtle)] border border-[var(--df-border)] rounded-lg">
                  <input
                    type="text"
                    required
                    value={newProdCode}
                    onChange={e => setNewProdCode(e.target.value)}
                    placeholder="Code (e.g. TD-FLEX)"
                    className="px-3 py-1.5 text-xs font-mono bg-[var(--df-surface)] border border-[var(--df-border)] rounded-lg"
                  />
                  <input
                    type="text"
                    required
                    value={newProdName}
                    onChange={e => setNewProdName(e.target.value)}
                    placeholder="Product Name"
                    className="sm:col-span-2 px-3 py-1.5 text-xs bg-[var(--df-surface)] border border-[var(--df-border)] rounded-lg"
                  />
                  <div className="flex gap-2">
                    <input
                      type="number"
                      step="0.05"
                      value={newProdRate}
                      onChange={e => setNewProdRate(Number(e.target.value))}
                      className="w-20 px-2 py-1.5 text-xs font-mono bg-[var(--df-surface)] border border-[var(--df-border)] rounded-lg"
                    />
                    <button type="submit" className="px-3 py-1.5 text-xs font-semibold text-white bg-primary rounded-lg">
                      Save
                    </button>
                  </div>
                </form>
              )}

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="border-b border-[var(--df-border)] text-[var(--df-muted)]">
                    <tr>
                      <th className="py-2 pr-3 font-semibold">Code</th>
                      <th className="py-2 pr-3 font-semibold">Product</th>
                      <th className="py-2 pr-3 font-semibold">Basis / Compounding</th>
                      <th className="py-2 pr-3 font-semibold text-right">Rate %</th>
                      <th className="py-2 font-semibold text-right">Min Bal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--df-border)]">
                    {products.map(p => (
                      <tr
                        key={p.code}
                        onClick={() => setSelectedProdCode(p.code)}
                        className={`cursor-pointer ${
                          selectedProdCode === p.code ? 'bg-[var(--df-surface-subtle)]' : 'hover:bg-[var(--df-surface-subtle)]/50'
                        }`}
                      >
                        <td className="py-2.5 pr-3 font-mono font-semibold text-[var(--df-text)]">{p.code}</td>
                        <td className="py-2.5 pr-3">
                          <div className="font-medium text-[var(--df-text)]">{p.name}</div>
                          <div className="text-[11px] text-[var(--df-muted)]">{p.family} {p.autoSweep ? '· Auto-Sweep' : ''}</div>
                        </td>
                        <td className="py-2.5 pr-3 text-[var(--df-muted)]">
                          {p.dayCount} · {p.compounding}
                        </td>
                        <td className="py-2.5 pr-3 font-mono tabular-nums text-right">{p.baseRatePct.toFixed(2)}%</td>
                        <td className="py-2.5 font-mono tabular-nums text-right">{formatCurrency(p.minBalance)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="lg:col-span-5 bg-[var(--df-surface)] border border-[var(--df-border)] rounded-xl p-6 space-y-4">
              <div>
                <h2 className="font-display text-base font-bold text-[var(--df-text)]">
                  Interest Accrual &amp; TDS Rule Engine
                </h2>
                <p className="text-xs text-[var(--df-muted)] mt-0.5">
                  Active schema: <span className="font-mono font-semibold text-[var(--df-text)]">{activeProduct.code}</span> ({activeProduct.dayCount} · {activeProduct.compounding})
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[var(--df-text)] mb-1">Principal Amount</label>
                  <input
                    type="number"
                    value={simPrincipal}
                    onChange={e => setSimPrincipal(Math.max(0, Number(e.target.value)))}
                    className="w-full px-3 py-2 text-xs font-mono tabular-nums bg-[var(--df-surface)] border border-[var(--df-border)] rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[var(--df-text)] mb-1">Tenure (Days)</label>
                  <input
                    type="number"
                    value={simDays}
                    onChange={e => setSimDays(Math.max(1, Number(e.target.value)))}
                    className="w-full px-3 py-2 text-xs font-mono tabular-nums bg-[var(--df-surface)] border border-[var(--df-border)] rounded-lg"
                  />
                </div>
              </div>
              <div className="border-t border-[var(--df-border)] pt-4 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-[var(--df-muted)]">Effective Annualized Yield (APY)</span>
                  <span className="font-mono tabular-nums font-semibold">{accrualResult.effectiveApyPct.toFixed(3)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--df-muted)]">Simple Interest Benchmark</span>
                  <span className="font-mono tabular-nums">{formatCurrency(accrualResult.grossSimple)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--df-muted)]">Compounded Gross Accrual</span>
                  <span className="font-mono tabular-nums font-semibold">{formatCurrency(accrualResult.accruedCompound)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--df-muted)]">Statutory TDS (10% above 40k threshold)</span>
                  <span className="font-mono tabular-nums text-amber-700">{formatCurrency(accrualResult.tdsWithheld)}</span>
                </div>
                <div className="flex justify-between border-t border-[var(--df-border)] pt-2 font-bold text-sm">
                  <span>Net Credited Return</span>
                  <span className="font-mono tabular-nums text-primary">{formatCurrency(accrualResult.netPayable)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: OMNICHANNEL & OPEN API HUB */}
      {activeTab === 'omnichannel' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 bg-[var(--df-surface)] border border-[var(--df-border)] rounded-xl p-6 space-y-4">
            <div>
              <h2 className="font-display text-base font-bold text-[var(--df-text)]">
                Omnichannel Orchestration &amp; Switch Gateways
              </h2>
              <p className="text-xs text-[var(--df-muted)] mt-0.5">
                Unified real-time routing across Web, Mobile, Branch, ISO 8583 Card Switch, and BaaS APIs.
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="border-b border-[var(--df-border)] text-[var(--df-muted)]">
                  <tr>
                    <th className="py-2 pr-3 font-semibold">Channel</th>
                    <th className="py-2 pr-3 font-semibold">Protocol &amp; Auth</th>
                    <th className="py-2 pr-3 font-semibold text-right">TPS</th>
                    <th className="py-2 font-semibold text-right">State</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--df-border)]">
                  {channels.map(ch => (
                    <tr key={ch.id}>
                      <td className="py-2.5 pr-3 font-medium text-[var(--df-text)]">
                        <div>{ch.channel}</div>
                        <div className="text-[11px] text-[var(--df-muted)] font-mono">{ch.slaTarget}</div>
                      </td>
                      <td className="py-2.5 pr-3 text-[var(--df-muted)]">
                        <div>{ch.protocol}</div>
                        <div className="text-[11px]">{ch.authStandard}</div>
                      </td>
                      <td className="py-2.5 pr-3 font-mono tabular-nums text-right">{ch.tpsCapacity.toLocaleString()}</td>
                      <td className="py-2.5 text-right">
                        <button
                          onClick={() =>
                            setChannels(prev =>
                              prev.map(x => (x.id === ch.id ? { ...x, enabled: !x.enabled } : x))
                            )
                          }
                          className={`px-2.5 py-1 text-[11px] font-semibold rounded-md border ${
                            ch.enabled
                              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                              : 'bg-slate-100 border-slate-200 text-slate-600'
                          }`}
                        >
                          {ch.enabled ? 'Active' : 'Paused'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="lg:col-span-6 bg-[var(--df-surface)] border border-[var(--df-border)] rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between gap-2">
              <div>
                <h2 className="font-display text-base font-bold text-[var(--df-text)]">
                  Open Banking API Gateway Tester (FAPI 2.0)
                </h2>
                <p className="text-xs text-[var(--df-muted)] mt-0.5">
                  Validate OAuth2 scopes, idempotency tokens, and signed JSON contracts.
                </p>
              </div>
              <button
                onClick={handleExecuteApiTest}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-primary hover:bg-primary-dark rounded-lg whitespace-nowrap"
              >
                <Play className="w-3.5 h-3.5" />
                Invoke Endpoint
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {API_CATALOG.map(api => (
                <button
                  key={api.id}
                  onClick={() => handleSelectApi(api.id)}
                  className={`px-2.5 py-1.5 text-[11px] font-mono rounded-md border transition-colors ${
                    selectedApiId === api.id
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-[var(--df-surface)] text-[var(--df-muted)] border-[var(--df-border)] hover:text-[var(--df-text)]'
                  }`}
                >
                  {api.method} {api.path}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[var(--df-text)] mb-1">Request Payload (JSON)</label>
                <textarea
                  rows={5}
                  value={apiPayload}
                  onChange={e => setApiPayload(e.target.value)}
                  className="w-full p-3 text-xs font-mono bg-[var(--df-surface-subtle)] border border-[var(--df-border)] rounded-lg text-[var(--df-text)]"
                />
              </div>
              {apiResponse && (
                <div>
                  <label className="block text-xs font-semibold text-[var(--df-text)] mb-1">Gateway Response</label>
                  <pre className="p-3 text-xs font-mono bg-slate-950 text-emerald-300 rounded-lg overflow-x-auto">
                    {apiResponse}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PAYMENTS HUB, ISO 20022 & LIQUIDITY */}
      {activeTab === 'payments' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 bg-[var(--df-surface)] border border-[var(--df-border)] rounded-xl p-6 space-y-5">
            <div>
              <h2 className="font-display text-base font-bold text-[var(--df-text)]">
                Smart Multi-Rail Payment Router &amp; Clearing Queue
              </h2>
              <p className="text-xs text-[var(--df-muted)] mt-0.5">
                Automatically selects RTGS, NEFT, IMPS, UPI, or SWIFT pacs.008 based on threshold, urgency, and AML rules.
              </p>
            </div>

            <form onSubmit={handleRoutePayment} className="grid grid-cols-1 sm:grid-cols-5 gap-3 p-4 bg-[var(--df-surface-subtle)] border border-[var(--df-border)] rounded-lg">
              <input
                type="text"
                required
                value={payBeneficiary}
                onChange={e => setPayBeneficiary(e.target.value)}
                placeholder="Beneficiary Name"
                className="sm:col-span-2 px-3 py-2 text-xs bg-[var(--df-surface)] border border-[var(--df-border)] rounded-lg"
              />
              <input
                type="number"
                required
                value={payAmount}
                onChange={e => setPayAmount(Number(e.target.value))}
                className="px-3 py-2 text-xs font-mono tabular-nums bg-[var(--df-surface)] border border-[var(--df-border)] rounded-lg"
              />
              <select
                value={payUrgency}
                onChange={e => setPayUrgency(e.target.value as 'Instant' | 'Same-Day' | 'Cross-Border')}
                className="px-3 py-2 text-xs bg-[var(--df-surface)] border border-[var(--df-border)] rounded-lg"
              >
                <option value="Instant">Instant</option>
                <option value="Same-Day">Same-Day Clearing</option>
                <option value="Cross-Border">Cross-Border (FX)</option>
              </select>
              <button type="submit" className="px-3 py-2 text-xs font-semibold text-white bg-primary hover:bg-primary-dark rounded-lg">
                Route Payment
              </button>
            </form>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="border-b border-[var(--df-border)] text-[var(--df-muted)]">
                  <tr>
                    <th className="py-2 pr-3 font-semibold">Ref</th>
                    <th className="py-2 pr-3 font-semibold">Beneficiary</th>
                    <th className="py-2 pr-3 font-semibold">Rail</th>
                    <th className="py-2 pr-3 font-semibold text-right">Amount</th>
                    <th className="py-2 pr-3 font-semibold">Status</th>
                    <th className="py-2 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--df-border)]">
                  {payments.map(p => (
                    <tr key={p.ref}>
                      <td className="py-2.5 pr-3 font-mono text-[var(--df-text)]">{p.ref}</td>
                      <td className="py-2.5 pr-3 font-medium text-[var(--df-text)]">{p.beneficiary}</td>
                      <td className="py-2.5 pr-3 font-mono text-[var(--df-muted)]">{p.rail}</td>
                      <td className="py-2.5 pr-3 font-mono tabular-nums text-right">
                        {p.currency} {p.amount.toLocaleString()}
                      </td>
                      <td className="py-2.5 pr-3">
                        <span className={p.status === 'Settled' ? 'text-emerald-700 font-semibold' : p.status === 'Rejected' ? 'text-red-700 font-semibold' : 'text-amber-700 font-semibold'}>
                          {p.status}
                        </span>
                      </td>
                      <td className="py-2.5 text-right space-x-2">
                        {p.status === 'Dual-Auth Pending' ? (
                          <>
                            <button
                              onClick={() => handleUpdatePaymentStatus(p.ref, 'Settled')}
                              className="text-emerald-700 font-semibold hover:underline"
                            >
                              Authorize
                            </button>
                            <button
                              onClick={() => handleUpdatePaymentStatus(p.ref, 'Rejected')}
                              className="text-red-700 font-semibold hover:underline"
                            >
                              Reject
                            </button>
                          </>
                        ) : (
                          <span className="text-[var(--df-muted)] font-mono">{p.timestamp}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Corporate Virtual Account Management & ZBA Pooling */}
          <div className="lg:col-span-4 bg-[var(--df-surface)] border border-[var(--df-border)] rounded-xl p-6 space-y-4">
            <div>
              <h2 className="font-display text-base font-bold text-[var(--df-text)]">
                Virtual Accounts &amp; ZBA Liquidity Pool
              </h2>
              <p className="text-xs text-[var(--df-muted)] mt-0.5">
                Real-time notional pooling &amp; end-of-day zero-balance sweeping across corporate subsidiaries.
              </p>
            </div>
            <div className="space-y-3">
              {[
                { key: 'accA' as const, label: 'Subsidiary VAM-01 (Manufacturing)' },
                { key: 'accB' as const, label: 'Subsidiary VAM-02 (Working Capital Deficit)' },
                { key: 'accC' as const, label: 'Subsidiary VAM-03 (Collections Pool)' },
              ].map(item => (
                <div key={item.key}>
                  <label className="block text-xs font-medium text-[var(--df-muted)] mb-1">{item.label}</label>
                  <input
                    type="number"
                    value={poolBalances[item.key]}
                    onChange={e => setPoolBalances(prev => ({ ...prev, [item.key]: Number(e.target.value) }))}
                    className="w-full px-3 py-2 text-xs font-mono tabular-nums bg-[var(--df-surface)] border border-[var(--df-border)] rounded-lg"
                  />
                </div>
              ))}
            </div>
            <div className="border-t border-[var(--df-border)] pt-4 space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-[var(--df-muted)]">Net Notional Pool Position</span>
                <span className={`font-mono tabular-nums font-bold ${netPoolLiquidity >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>
                  {formatCurrency(netPoolLiquidity)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--df-muted)]">Swept Overdraft Interest Saved (Est. p.a.)</span>
                <span className="font-mono tabular-nums font-semibold">
                  {formatCurrency(Math.max(0, Math.min(poolBalances.accA + poolBalances.accC, Math.abs(Math.min(0, poolBalances.accB)))) * 0.105)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: TREASURY, TRADE FINANCE & ALM */}
      {activeTab === 'treasury' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-6 bg-[var(--df-surface)] border border-[var(--df-border)] rounded-xl p-6 space-y-4">
              <div>
                <h2 className="font-display text-base font-bold text-[var(--df-text)]">
                  Treasury FX Spot &amp; Forward Deal Blotter
                </h2>
                <p className="text-xs text-[var(--df-muted)] mt-0.5">
                  Real-time currency position booking with Nostro counter-value settlement.
                </p>
              </div>
              <form onSubmit={handleBookFxDeal} className="grid grid-cols-4 gap-2">
                <select value={fxPair} onChange={e => setFxPair(e.target.value)} className="px-2.5 py-2 text-xs bg-[var(--df-surface)] border border-[var(--df-border)] rounded-lg">
                  <option value="USD/INR">USD/INR</option>
                  <option value="EUR/INR">EUR/INR</option>
                  <option value="GBP/INR">GBP/INR</option>
                  <option value="AED/INR">AED/INR</option>
                </select>
                <select value={fxSide} onChange={e => setFxSide(e.target.value as 'Buy' | 'Sell')} className="px-2.5 py-2 text-xs bg-[var(--df-surface)] border border-[var(--df-border)] rounded-lg">
                  <option value="Buy">Buy</option>
                  <option value="Sell">Sell</option>
                </select>
                <input
                  type="number"
                  value={fxNotional}
                  onChange={e => setFxNotional(Number(e.target.value))}
                  className="px-2.5 py-2 text-xs font-mono tabular-nums bg-[var(--df-surface)] border border-[var(--df-border)] rounded-lg"
                />
                <button type="submit" className="px-3 py-2 text-xs font-semibold text-white bg-primary hover:bg-primary-dark rounded-lg">
                  Book Deal
                </button>
              </form>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="border-b border-[var(--df-border)] text-[var(--df-muted)]">
                    <tr>
                      <th className="py-2 pr-2 font-semibold">Deal ID</th>
                      <th className="py-2 pr-2 font-semibold">Pair / Side</th>
                      <th className="py-2 pr-2 font-semibold text-right">Notional</th>
                      <th className="py-2 font-semibold text-right">Rate</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--df-border)]">
                    {fxDeals.map(d => (
                      <tr key={d.dealId}>
                        <td className="py-2 pr-2 font-mono">{d.dealId}</td>
                        <td className="py-2 pr-2 font-medium">{d.side} {d.pair} · {d.tenor}</td>
                        <td className="py-2 pr-2 font-mono tabular-nums text-right">{d.notionalForeign.toLocaleString()}</td>
                        <td className="py-2 font-mono tabular-nums text-right">{d.contractRate.toFixed(3)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="lg:col-span-6 bg-[var(--df-surface)] border border-[var(--df-border)] rounded-xl p-6 space-y-4">
              <div>
                <h2 className="font-display text-base font-bold text-[var(--df-text)]">
                  Trade Finance Workflow (LC / BG / Export Credit)
                </h2>
                <p className="text-xs text-[var(--df-muted)] mt-0.5">
                  Automated credit limit reservation, SWIFT MT700 advisement, and dual-auth lifecycle.
                </p>
              </div>
              <div className="space-y-3">
                {tradeList.map(tr => (
                  <div key={tr.id} className="p-3.5 border border-[var(--df-border)] rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="text-xs font-semibold text-[var(--df-text)]">
                        <span className="font-mono">{tr.id}</span> · {tr.type}
                      </div>
                      <div className="text-xs text-[var(--df-muted)] mt-0.5">
                        {tr.applicant} → {tr.beneficiary}
                      </div>
                      <div className="text-xs font-mono tabular-nums font-semibold text-[var(--df-text)] mt-1">
                        {tr.currency} {tr.amount.toLocaleString()} · Stage: {tr.stage}
                      </div>
                    </div>
                    <button
                      onClick={() => handleAdvanceTradeStage(tr.id)}
                      disabled={tr.stage === 'Settled'}
                      className="px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 rounded-lg shrink-0"
                    >
                      {tr.stage === 'Settled' ? 'Completed' : 'Advance Stage'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-[var(--df-surface)] border border-[var(--df-border)] rounded-xl p-6 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="font-display text-base font-bold text-[var(--df-text)]">
                  Asset-Liability Management (ALM) Structural Liquidity Gap (INR Cr)
                </h2>
                <p className="text-xs text-[var(--df-muted)]">
                  Monitors maturity bucket mismatches and verifies statutory LCR (128.4%) &amp; NSFR (116.2%) compliance.
                </p>
              </div>
              <div className="font-mono text-xs tabular-nums text-emerald-700 font-semibold">
                LCR 128.4% (Min 100%) · NSFR 116.2% (Min 100%)
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="border-b border-[var(--df-border)] text-[var(--df-muted)]">
                  <tr>
                    <th className="py-2 pr-4 font-semibold">Maturity Bucket</th>
                    <th className="py-2 pr-4 font-semibold text-right">Inflows (Cr)</th>
                    <th className="py-2 pr-4 font-semibold text-right">Outflows (Cr)</th>
                    <th className="py-2 pr-4 font-semibold text-right">Net Gap (Cr)</th>
                    <th className="py-2 pr-4 font-semibold text-right">Cumulative Gap</th>
                    <th className="py-2 font-semibold text-right">Mismatch %</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--df-border)]">
                  {almTotals.map(row => (
                    <tr key={row.bucket}>
                      <td className="py-2 pr-4 font-medium text-[var(--df-text)]">{row.bucket}</td>
                      <td className="py-2 pr-4 font-mono tabular-nums text-right">{row.inflows.toFixed(1)}</td>
                      <td className="py-2 pr-4 font-mono tabular-nums text-right">{row.outflows.toFixed(1)}</td>
                      <td className="py-2 pr-4 font-mono tabular-nums text-right text-emerald-700">+{row.net.toFixed(1)}</td>
                      <td className="py-2 pr-4 font-mono tabular-nums text-right font-semibold">{row.cumulative.toFixed(1)}</td>
                      <td className="py-2 font-mono tabular-nums text-right">+{row.mismatchPct.toFixed(1)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: 24x7 SHADOW-LEDGER BATCH & MAKER-CHECKER */}
      {activeTab === 'operations' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 bg-[var(--df-surface)] border border-[var(--df-border)] rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between gap-2">
              <div>
                <h2 className="font-display text-base font-bold text-[var(--df-text)]">
                  24x7 Zero-Downtime Shadow-Ledger EOD / BOD Runner
                </h2>
                <p className="text-xs text-[var(--df-muted)] mt-0.5">
                  Last verified cycle: <span className="font-mono">{lastBatchRun}</span>
                </p>
              </div>
              <button
                onClick={handleRun24x7Batch}
                disabled={batchRunning}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-primary hover:bg-primary-dark disabled:bg-slate-400 rounded-lg shrink-0"
              >
                <Play className="w-3.5 h-3.5" />
                {batchRunning ? 'Running Batch...' : 'Execute Batch Cycle'}
              </button>
            </div>

            <div className="divide-y divide-[var(--df-border)] border border-[var(--df-border)] rounded-lg">
              {batchSteps.map(step => (
                <div key={step.seq} className="p-3 flex items-center justify-between gap-3 text-xs">
                  <div>
                    <div className="font-semibold text-[var(--df-text)]">
                      <span className="font-mono text-[var(--df-muted)] mr-2">{step.seq}. [{step.code}]</span>
                      {step.name}
                    </div>
                    <div className="text-[11px] text-[var(--df-muted)] mt-0.5">{step.subsystem}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <div
                      className={`font-semibold ${
                        step.status === 'Completed'
                          ? 'text-emerald-700'
                          : step.status === 'Running'
                          ? 'text-amber-700'
                          : 'text-[var(--df-muted)]'
                      }`}
                    >
                      {step.status}
                    </div>
                    <div className="font-mono text-[11px] tabular-nums text-[var(--df-muted)]">{step.durationMs}ms</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-6 bg-[var(--df-surface)] border border-[var(--df-border)] rounded-xl p-6 space-y-4">
            <div>
              <h2 className="font-display text-base font-bold text-[var(--df-text)]">
                Segregated Dual-Control Maker-Checker Queue
              </h2>
              <p className="text-xs text-[var(--df-muted)] mt-0.5">
                Enforces independent 4-eyes sign-off on high-value limits, lien releases, and GL vouchers.
              </p>
            </div>

            <div className="space-y-3">
              {checkerQueue.map(item => (
                <div key={item.id} className="p-4 border border-[var(--df-border)] rounded-lg space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="text-xs font-bold text-[var(--df-text)]">
                        {item.id} · {item.category}
                      </div>
                      <div className="text-xs text-[var(--df-muted)] mt-0.5">{item.summary}</div>
                    </div>
                    <span className="font-mono text-xs tabular-nums font-bold text-[var(--df-text)]">
                      {formatCurrency(item.amountImpact)}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11px] text-[var(--df-muted)]">
                    <span>
                      Maker: <span className="font-mono">{item.maker}</span> · Ref {item.reference}
                    </span>
                    {item.status === 'Pending Checker' ? (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleCheckerAction(item.id, 'Approved')}
                          className="px-2.5 py-1 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-md"
                        >
                          Verify &amp; Approve
                        </button>
                        <button
                          onClick={() => handleCheckerAction(item.id, 'Returned')}
                          className="px-2.5 py-1 text-xs font-semibold text-red-700 bg-red-50 border border-red-200 hover:bg-red-100 rounded-md"
                        >
                          Return
                        </button>
                      </div>
                    ) : (
                      <span className={`font-semibold ${item.status === 'Approved' ? 'text-emerald-700' : 'text-red-700'}`}>
                        {item.status}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: TECHNOLOGY STACK & CORE STRATEGIES */}
      {activeTab === 'strategy' && (
        <div className="space-y-6">
          <div className="bg-[var(--df-surface)] border border-[var(--df-border)] rounded-xl p-6 space-y-4">
            <div>
              <h2 className="font-display text-base font-bold text-[var(--df-text)]">
                6-Layer Componentized Banking Technology Stack
              </h2>
              <p className="text-xs text-[var(--df-muted)] mt-0.5">
                Cloud-native, microservices-based, event-driven core banking architecture for zero-downtime scale.
              </p>
            </div>
            <div className="divide-y divide-[var(--df-border)] border border-[var(--df-border)] rounded-lg">
              {TECH_LAYERS.map(layer => (
                <div key={layer.layer} className="p-4 grid grid-cols-1 lg:grid-cols-12 gap-2 items-center text-xs">
                  <div className="lg:col-span-4 font-display font-bold text-[var(--df-text)]">{layer.layer}</div>
                  <div className="lg:col-span-5 text-[var(--df-text)]">{layer.components}</div>
                  <div className="lg:col-span-3 font-mono text-[11px] text-[var(--df-muted)] lg:text-right">{layer.patterns}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[var(--df-surface)] border border-[var(--df-border)] rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display text-base font-bold text-[var(--df-text)]">
                  Core Modernization &amp; Deployment Strategies
                </h2>
                <p className="text-xs text-[var(--df-muted)] mt-0.5">
                  Evaluate progressive strangler, green-field sidecar, and phased big-bang transformation models.
                </p>
              </div>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                <ShieldCheck className="w-4 h-4" />
                Zero-Variance Parallel Parity Verified
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {STRATEGIES.map(st => {
                const selected = selectedStrategyId === st.id;
                return (
                  <div
                    key={st.id}
                    onClick={() => setSelectedStrategyId(st.id)}
                    className={`p-5 rounded-xl border cursor-pointer transition-colors space-y-3 ${
                      selected
                        ? 'border-slate-900 bg-[var(--df-surface-subtle)]'
                        : 'border-[var(--df-border)] bg-[var(--df-surface)] hover:bg-[var(--df-surface-subtle)]/50'
                    }`}
                  >
                    <div>
                      <div className="font-display text-sm font-bold text-[var(--df-text)]">{st.name}</div>
                      <div className="text-xs text-[var(--df-muted)] mt-1">
                        {st.horizon} · Risk: {st.riskProfile}
                      </div>
                    </div>
                    <p className="text-xs text-[var(--df-muted)]">{st.bestFor}</p>
                    <ol className="space-y-1.5 text-xs text-[var(--df-text)] list-decimal list-inside pt-1 border-t border-[var(--df-border)]">
                      {st.steps.map(step => (
                        <li key={step}>{step}</li>
                      ))}
                    </ol>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnterpriseCoreBanking;
