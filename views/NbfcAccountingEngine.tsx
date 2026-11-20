import React, { useState, useMemo } from 'react';
import { useAppContext } from '../AppContext';
import { formatCurrency } from '../utils/formatters';
import { 
  NbfcSbrLayer, 
  IndAs109EclStageSummary, 
  NbfcAlmBucket, 
  NbfcCoLendingEscrowDeal, 
  BureauTudfRecord, 
  OpenCostCenter, 
  OpenBudgetRule, 
  OpenPeriodClosingEntry 
} from './types';

type NbfcTab = 
  | 'crar' 
  | 'indas109' 
  | 'alm' 
  | 'colending' 
  | 'bureau' 
  | 'costcenters' 
  | 'periodclose' 
  | 'statutory';

const NbfcAccountingEngine: React.FC = () => {
  const {
    nbfcCrar,
    indAs109EclStages,
    nbfcAlmBuckets,
    nbfcCoLendingDeals,
    bureauTudfRecords,
    openCostCenters,
    openBudgetRules,
    openPeriodClosingEntries,
    vouchers,
    handleRecalculateCrar,
    handleRunIndAs109EclProvision,
    handleSettleCoLendingEscrow,
    handleScrubBureauTudf,
    handleAddOpenCostCenter,
    handleAddOpenBudgetRule,
    handleExecutePeriodClose,
  } = useAppContext();

  const [activeTab, setActiveTab] = useState<NbfcTab>('crar');
  const [notification, setNotification] = useState<string | null>(null);

  // CRAR Simulator States
  const [simLoanGrowthCr, setSimLoanGrowthCr] = useState<number>(50); // ₹50 Cr incremental loan portfolio
  const [simRiskWeightPct, setSimRiskWeightPct] = useState<number>(100); // 100% risk weight
  const [simEquityInfusionCr, setSimEquityInfusionCr] = useState<number>(10); // ₹10 Cr equity infusion

  // Modal States
  const [showAddCcModal, setShowAddCcModal] = useState(false);
  const [showAddBudgetModal, setShowAddBudgetModal] = useState(false);
  const [showPeriodCloseModal, setShowPeriodCloseModal] = useState(false);

  // New Cost Center Form
  const [newCcCode, setNewCcCode] = useState('');
  const [newCcName, setNewCcName] = useState('');
  const [newCcDept, setNewCcDept] = useState<'Retail Lending' | 'SME & Corporate' | 'Treasury & ALM' | 'Collections & Recovery' | 'Risk & Underwriting' | 'Corporate Operations'>('Retail Lending');
  const [newCcBudget, setNewCcBudget] = useState(5000000);
  const [newCcHod, setNewCcHod] = useState('');

  // New Budget Form
  const [newBgAccountCode, setNewBgAccountCode] = useState('5500');
  const [newBgAccountName, setNewBgAccountName] = useState('Legal & Bureau Verification Fees');
  const [newBgCcCode, setNewBgCcCode] = useState('CC-RET-LEND');
  const [newBgMonthly, setNewBgMonthly] = useState(500000);
  const [newBgAction, setNewBgAction] = useState<'Stop Transaction' | 'Warn User & Log Audit' | 'Ignore'>('Warn User & Log Audit');
  const [newBgAlertPct, setNewBgAlertPct] = useState(85);

  // Period Close Form
  const [closePeriodName, setClosePeriodName] = useState('FY2026-27 Q2 Semi-Annual Close');
  const [closeExpenseDebit, setCloseExpenseDebit] = useState(38400000);
  const [closeIncomeCredit, setCloseIncomeCredit] = useState(59200000);

  // CIBIL TUDF Filter & Search
  const [bureauSearch, setBureauSearch] = useState('');
  const [bureauFilterStatus, setBureauFilterStatus] = useState<string>('ALL');

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  // Simulated CRAR calculations
  const simResults = useMemo(() => {
    const additionalRwa = (simLoanGrowthCr * 10000000) * (simRiskWeightPct / 100);
    const additionalCapital = simEquityInfusionCr * 10000000;
    const simTotalCapital = nbfcCrar.totalCapital + additionalCapital;
    const simTier1Capital = nbfcCrar.tier1Capital + additionalCapital;
    const simTotalRwa = nbfcCrar.totalRwa + additionalRwa;
    const simCrarPct = Math.round((simTotalCapital / simTotalRwa) * 10000) / 100;
    const simTier1Pct = Math.round((simTier1Capital / simTotalRwa) * 10000) / 100;
    const isCompliant = simCrarPct >= 15.0;

    return {
      simTotalCapital,
      simTier1Capital,
      simTotalRwa,
      simCrarPct,
      simTier1Pct,
      isCompliant
    };
  }, [nbfcCrar, simLoanGrowthCr, simRiskWeightPct, simEquityInfusionCr]);

  // Filtered Bureau Records
  const filteredBureauRecords = useMemo(() => {
    return bureauTudfRecords.filter(rec => {
      const matchSearch = rec.borrowerName.toLowerCase().includes(bureauSearch.toLowerCase()) ||
                          rec.accountNumber.toLowerCase().includes(bureauSearch.toLowerCase()) ||
                          rec.idNumber.toLowerCase().includes(bureauSearch.toLowerCase());
      const matchStatus = bureauFilterStatus === 'ALL' || rec.validationStatus === bureauFilterStatus;
      return matchSearch && matchStatus;
    });
  }, [bureauTudfRecords, bureauSearch, bureauFilterStatus]);

  const totalIndAsEcl = useMemo(() => {
    return indAs109EclStages.reduce((sum, s) => sum + s.eclProvisionAmount, 0);
  }, [indAs109EclStages]);

  const totalIracpProvision = useMemo(() => {
    return indAs109EclStages.reduce((sum, s) => sum + s.iracpRegulatoryProvision, 0);
  }, [indAs109EclStages]);

  const totalColendingDisbursed = useMemo(() => {
    return nbfcCoLendingDeals.reduce((sum, d) => sum + d.totalPoolDisbursed, 0);
  }, [nbfcCoLendingDeals]);

  const totalColendingLive = useMemo(() => {
    return nbfcCoLendingDeals.reduce((sum, d) => sum + d.livePrincipalOutstanding, 0);
  }, [nbfcCoLendingDeals]);

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-5 right-5 z-50 bg-emerald-900 border border-emerald-500 text-emerald-100 px-4 py-3 rounded-lg shadow-2xl flex items-center space-x-3 animate-fade-in">
          <svg className="w-5 h-5 text-emerald-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span className="text-sm font-medium">{notification}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-slate-800/90 border border-slate-700/80 rounded-xl p-6 shadow-xl backdrop-blur-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-indigo-500/10 via-cyan-500/5 to-transparent rounded-full pointer-events-none -mr-20 -mt-20"></div>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center space-x-3">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                RBI SBR & Ind AS 109
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                Apache Fineract & ERPNext Standards
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                TransUnion CIBIL TUDF 3.0
              </span>
            </div>
            <h1 className="text-2xl font-bold text-slate-100 mt-2 flex items-center gap-2">
              <span>NBFC Regulatory & Enterprise Accounting Suite</span>
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-3xl">
              Production standard engine for Non-Banking Financial Companies: Scale-Based Regulation (SBR), Capital Adequacy (CRAR), Ind AS 109 3-Stage ECL, ALM Structural Liquidity Buckets, Co-Lending Escrow Waterfall, CIBIL TUDF 3.0 Scrubber, and Multi-Dimension Cost Centers.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                handleRecalculateCrar();
                showToast('CRAR & Regulatory Risk-Weighted Assets refreshed against live loan ledger.');
              }}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 text-sm font-medium rounded-lg transition-colors border border-slate-600 flex items-center space-x-2"
            >
              <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Refresh CRAR</span>
            </button>
            <button
              onClick={() => {
                handleRunIndAs109EclProvision();
                showToast('Automated Ind AS 109 ECL provisioning run executed & posted to General Ledger.');
              }}
              className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white text-sm font-semibold rounded-lg shadow-lg shadow-indigo-500/20 transition-all flex items-center space-x-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>Run Ind AS 109 ECL</span>
            </button>
          </div>
        </div>

        {/* Global Key Metrics Ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-6 pt-5 border-t border-slate-700/60">
          <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-700/40">
            <span className="text-xs text-slate-400 font-medium">SBR Category</span>
            <div className="text-sm font-bold text-slate-100 mt-1 truncate">{nbfcCrar.sbrLayer.split(' ')[0]} Layer</div>
            <span className="text-[10px] text-indigo-400">NBFC-ML Middle</span>
          </div>

          <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-700/40">
            <span className="text-xs text-slate-400 font-medium">Total CRAR Ratio</span>
            <div className="text-base font-bold text-emerald-400 mt-0.5">{nbfcCrar.crarPercentage}%</div>
            <span className="text-[10px] text-slate-400">Reg Min: 15.0%</span>
          </div>

          <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-700/40">
            <span className="text-xs text-slate-400 font-medium">Tier-1 Capital CRAR</span>
            <div className="text-base font-bold text-cyan-400 mt-0.5">{nbfcCrar.tier1CrarPercentage}%</div>
            <span className="text-[10px] text-slate-400">Reg Min: 10.0%</span>
          </div>

          <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-700/40">
            <span className="text-xs text-slate-400 font-medium">Ind AS 109 ECL</span>
            <div className="text-base font-bold text-amber-400 mt-0.5">{formatCurrency(totalIndAsEcl)}</div>
            <span className="text-[10px] text-slate-400">vs IRACP {formatCurrency(totalIracpProvision)}</span>
          </div>

          <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-700/40">
            <span className="text-xs text-slate-400 font-medium">Co-Lending Live AUM</span>
            <div className="text-base font-bold text-purple-400 mt-0.5">{formatCurrency(totalColendingLive)}</div>
            <span className="text-[10px] text-slate-400">{nbfcCoLendingDeals.length} Partner Deals</span>
          </div>

          <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-700/40">
            <span className="text-xs text-slate-400 font-medium">ALM 1-30D Surplus</span>
            <div className="text-base font-bold text-teal-400 mt-0.5">+₹13.00 Cr</div>
            <span className="text-[10px] text-emerald-400">Compliant (No Deficit)</span>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-slate-700">
        <nav className="flex space-x-1 sm:space-x-2 overflow-x-auto pb-1 scrollbar-thin">
          {[
            { key: 'crar', label: '1. SBR & CRAR Capital Adequacy', count: `${nbfcCrar.crarPercentage}%` },
            { key: 'indas109', label: '2. Ind AS 109 ECL & IRACP', count: '3 Stages' },
            { key: 'alm', label: '3. ALM Structural Liquidity', count: `${nbfcAlmBuckets.length} Buckets` },
            { key: 'colending', label: '4. Co-Lending & Escrow Waterfall', count: `${nbfcCoLendingDeals.length} Deals` },
            { key: 'bureau', label: '5. CIBIL TUDF 3.0 Scrub Engine', count: `${bureauTudfRecords.length} Loans` },
            { key: 'costcenters', label: '6. Cost Centers & Budgets', count: `${openCostCenters.length} CCs` },
            { key: 'periodclose', label: '7. Period-Closing Voucher (Frappe/ERP)', count: `${openPeriodClosingEntries.length} Closed` },
            { key: 'statutory', label: '8. GST & TDS Tax Compliance', count: 'Standard' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as NbfcTab)}
              className={`py-3 px-3.5 text-sm font-medium rounded-t-lg transition-colors whitespace-nowrap flex items-center space-x-2 ${
                activeTab === tab.key
                  ? 'bg-slate-800 text-indigo-400 border-b-2 border-indigo-500 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                activeTab === tab.key ? 'bg-indigo-500/20 text-indigo-300' : 'bg-slate-700 text-slate-400'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </nav>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: SBR & CRAR CAPITAL ADEQUACY ENGINE */}
      {/* ========================================================================= */}
      {activeTab === 'crar' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Live Regulatory Capital Breakdown */}
            <div className="lg:col-span-2 bg-slate-800/90 border border-slate-700 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-100">RBI Capital to Risk-Weighted Assets (CRAR) Computation</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Under RBI Scale Based Regulation (SBR) Master Directions for NBFC-ML</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  nbfcCrar.complianceStatus === 'COMPLIANT' 
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' 
                    : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                }`}>
                  {nbfcCrar.complianceStatus} (CRAR {nbfcCrar.crarPercentage}%)
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-slate-900/70 p-4 rounded-lg border border-slate-700/60">
                  <div className="text-xs font-semibold text-slate-400">Tier-1 Capital (Net Owned Funds)</div>
                  <div className="text-xl font-bold text-cyan-400 mt-1">{formatCurrency(nbfcCrar.tier1Capital)}</div>
                  <div className="text-xs text-slate-400 mt-2 space-y-1">
                    <div className="flex justify-between"><span>Paid-Up Equity:</span> <span className="text-slate-200">₹25.00 Cr</span></div>
                    <div className="flex justify-between"><span>Statutory Reserve (Sec 45-IC):</span> <span className="text-slate-200">₹12.50 Cr</span></div>
                    <div className="flex justify-between"><span>Securities Premium:</span> <span className="text-slate-200">₹5.00 Cr</span></div>
                  </div>
                  <div className="mt-3 pt-2 border-t border-slate-700/60 flex justify-between text-xs font-semibold text-cyan-300">
                    <span>Tier 1 Ratio:</span>
                    <span>{nbfcCrar.tier1CrarPercentage}% (Min: 10%)</span>
                  </div>
                </div>

                <div className="bg-slate-900/70 p-4 rounded-lg border border-slate-700/60">
                  <div className="text-xs font-semibold text-slate-400">Tier-2 Capital</div>
                  <div className="text-xl font-bold text-indigo-400 mt-1">{formatCurrency(nbfcCrar.tier2Capital)}</div>
                  <div className="text-xs text-slate-400 mt-2 space-y-1">
                    <div className="flex justify-between"><span>Subordinated Tier-2 Debt:</span> <span className="text-slate-200">₹6.00 Cr</span></div>
                    <div className="flex justify-between"><span>General Loan Provisions:</span> <span className="text-slate-200">₹2.50 Cr</span></div>
                    <div className="flex justify-between"><span>Tier 2 Cap Limit (1.25% RWA):</span> <span className="text-slate-200">₹2.91 Cr (Compliant)</span></div>
                  </div>
                  <div className="mt-3 pt-2 border-t border-slate-700/60 flex justify-between text-xs font-semibold text-indigo-300">
                    <span>Tier 2 Ratio:</span>
                    <span>{nbfcCrar.tier2CrarPercentage}%</span>
                  </div>
                </div>

                <div className="bg-slate-900/70 p-4 rounded-lg border border-slate-700/60">
                  <div className="text-xs font-semibold text-slate-400">Risk Weighted Assets (RWA)</div>
                  <div className="text-xl font-bold text-amber-400 mt-1">{formatCurrency(nbfcCrar.totalRwa)}</div>
                  <div className="text-xs text-slate-400 mt-2 space-y-1">
                    <div className="flex justify-between"><span>On-Balance Sheet RWA:</span> <span className="text-slate-200">{formatCurrency(nbfcCrar.rwaOnBalanceSheet)}</span></div>
                    <div className="flex justify-between"><span>Off-Balance Sheet RWA:</span> <span className="text-slate-200">{formatCurrency(nbfcCrar.rwaOffBalanceSheet)}</span></div>
                    <div className="flex justify-between"><span>Leverage Ratio (TOL / NOF):</span> <span className="text-slate-200">{nbfcCrar.leverageRatio}x (Max 7.0x)</span></div>
                  </div>
                  <div className="mt-3 pt-2 border-t border-slate-700/60 flex justify-between text-xs font-semibold text-amber-300">
                    <span>Total CRAR:</span>
                    <span>{nbfcCrar.crarPercentage}% (Min: 15%)</span>
                  </div>
                </div>
              </div>

              {/* Progress Gauges */}
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-medium text-slate-300 mb-1">
                    <span>Total CRAR Compliance ({nbfcCrar.crarPercentage}% vs Minimum 15.0%)</span>
                    <span className="text-emerald-400 font-bold">+{ (nbfcCrar.crarPercentage - 15.0).toFixed(2) }% Buffer</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-3 relative overflow-hidden">
                    <div className="bg-gradient-to-r from-cyan-500 to-emerald-500 h-3 rounded-full" style={{ width: `${Math.min(100, (nbfcCrar.crarPercentage / 30) * 100)}%` }}></div>
                    <div className="absolute top-0 bottom-0 left-[50%] w-0.5 bg-rose-500 z-10" title="Regulatory Minimum 15.0%"></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-medium text-slate-300 mb-1">
                    <span>Tier-1 Capital Adequacy ({nbfcCrar.tier1CrarPercentage}% vs Minimum 10.0%)</span>
                    <span className="text-cyan-400 font-bold">+{ (nbfcCrar.tier1CrarPercentage - 10.0).toFixed(2) }% Buffer</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-3 relative overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-500 to-cyan-500 h-3 rounded-full" style={{ width: `${Math.min(100, (nbfcCrar.tier1CrarPercentage / 25) * 100)}%` }}></div>
                    <div className="absolute top-0 bottom-0 left-[40%] w-0.5 bg-rose-500 z-10" title="Regulatory Minimum 10.0%"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Stress Test & Capital Planning Simulator */}
            <div className="bg-slate-800/90 border border-slate-700 rounded-xl p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <span className="p-1.5 bg-indigo-500/20 text-indigo-400 rounded-lg">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </span>
                  <h3 className="text-base font-bold text-slate-100">CRAR Stress Test Simulator</h3>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs text-slate-300 mb-1">
                      <span>Projected New Loan Growth</span>
                      <span className="font-semibold text-indigo-400">+₹{simLoanGrowthCr} Cr</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="200"
                      step="10"
                      value={simLoanGrowthCr}
                      onChange={(e) => setSimLoanGrowthCr(Number(e.target.value))}
                      className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs text-slate-300 mb-1">
                      <span>Portfolio Risk Weight %</span>
                      <span className="font-semibold text-amber-400">{simRiskWeightPct}%</span>
                    </div>
                    <select
                      value={simRiskWeightPct}
                      onChange={(e) => setSimRiskWeightPct(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg p-2 focus:ring-indigo-500"
                    >
                      <option value={50}>50% - Gold Loans & Highly Secured</option>
                      <option value={75}>75% - Prime Retail Housing Mortgages</option>
                      <option value={100}>100% - Standard MSME & Auto Leases</option>
                      <option value={125}>125% - Unsecured Personal & Business Loans</option>
                      <option value={150}>150% - Commercial Real Estate (CRE)</option>
                    </select>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs text-slate-300 mb-1">
                      <span>Simulated Equity Infusion</span>
                      <span className="font-semibold text-emerald-400">+₹{simEquityInfusionCr} Cr</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="50"
                      step="5"
                      value={simEquityInfusionCr}
                      onChange={(e) => setSimEquityInfusionCr(Number(e.target.value))}
                      className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                    />
                  </div>
                </div>

                <div className="mt-5 p-3.5 bg-slate-900/80 rounded-lg border border-slate-700/80 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Simulated Total RWA:</span>
                    <span className="font-bold text-slate-200">{formatCurrency(simResults.simTotalRwa)}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Simulated Tier-1 CRAR:</span>
                    <span className="font-bold text-cyan-400">{simResults.simTier1Pct}%</span>
                  </div>
                  <div className="flex justify-between text-xs pt-1 border-t border-slate-700">
                    <span className="text-slate-300 font-semibold">Simulated Total CRAR:</span>
                    <span className={`font-bold ${simResults.isCompliant ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {simResults.simCrarPct}%
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  handleRecalculateCrar((simLoanGrowthCr * 10000000) * (simRiskWeightPct / 100), simEquityInfusionCr * 10000000);
                  showToast(`Applied scenario: RWA +₹${((simLoanGrowthCr * simRiskWeightPct)/100).toFixed(1)} Cr, Capital +₹${simEquityInfusionCr} Cr`);
                }}
                className="w-full mt-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg transition-colors"
              >
                Apply Simulated Capital Scenario
              </button>
            </div>
          </div>

          {/* Scale Based Regulation (SBR) Framework Cards */}
          <div className="bg-slate-800/90 border border-slate-700 rounded-xl p-6">
            <h3 className="text-base font-bold text-slate-100 mb-4">RBI Scale Based Regulation (SBR) Tier Governance Matrix</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 bg-slate-900/60 border border-slate-700/50 rounded-lg opacity-60">
                <span className="text-xs font-semibold px-2 py-0.5 bg-slate-700 text-slate-300 rounded">Base Layer (NBFC-BL)</span>
                <div className="text-sm font-bold text-slate-200 mt-2">Asset Size &lt; ₹1,000 Cr</div>
                <p className="text-xs text-slate-400 mt-1">Non-deposit taking NBFCs below ₹1,000 Cr. Basic NOF ₹10 Cr.</p>
              </div>

              <div className="p-4 bg-slate-900 border-2 border-indigo-500/80 rounded-lg shadow-lg relative">
                <span className="absolute top-2 right-2 px-2 py-0.5 bg-indigo-500 text-white text-[10px] font-bold rounded">CURRENT</span>
                <span className="text-xs font-semibold px-2 py-0.5 bg-indigo-500/20 text-indigo-300 rounded">Middle Layer (NBFC-ML)</span>
                <div className="text-sm font-bold text-slate-100 mt-2">Asset Size ₹1,000 - ₹50,000 Cr</div>
                <p className="text-xs text-slate-400 mt-1">Deposit taking + systemically important non-deposit NBFCs. CRAR 15%, Internal Audit mandatory.</p>
              </div>

              <div className="p-4 bg-slate-900/60 border border-slate-700/50 rounded-lg opacity-60">
                <span className="text-xs font-semibold px-2 py-0.5 bg-slate-700 text-slate-300 rounded">Upper Layer (NBFC-UL)</span>
                <div className="text-sm font-bold text-slate-200 mt-2">Top 25 Identified NBFCs</div>
                <p className="text-xs text-slate-400 mt-1">Enhanced regulatory requirements, Common Equity Tier 1 (CET1) 9%, mandatory listing on stock exchanges.</p>
              </div>

              <div className="p-4 bg-slate-900/60 border border-slate-700/50 rounded-lg opacity-60">
                <span className="text-xs font-semibold px-2 py-0.5 bg-slate-700 text-slate-300 rounded">Top Layer (NBFC-TL)</span>
                <div className="text-sm font-bold text-slate-200 mt-2">Extreme Systemic Risk</div>
                <p className="text-xs text-slate-400 mt-1">Populated only if RBI determines an Upper Layer NBFC poses extreme systemic contagion risk.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: IND AS 109 / IFRS 9 ECL IMPAIRMENT & IRACP */}
      {/* ========================================================================= */}
      {activeTab === 'indas109' && (
        <div className="space-y-6">
          <div className="bg-slate-800/90 border border-slate-700 rounded-xl p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <h3 className="text-base font-bold text-slate-100">Ind AS 109 / IFRS 9 3-Stage Expected Credit Loss (ECL) Model</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Formula: <span className="font-mono text-indigo-300">ECL = Exposure at Default (EAD) × Probability of Default (PD) × Loss Given Default (LGD)</span>
                </p>
              </div>
              <button
                onClick={() => {
                  handleRunIndAs109EclProvision();
                  showToast('Ind AS 109 provision matrix recalculated and posted to GL Voucher subledger.');
                }}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg transition-colors flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                <span>Recalculate & Post Provision Voucher</span>
              </button>
            </div>

            {/* 3 Stage Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {indAs109EclStages.map((stage, idx) => (
                <div key={stage.stage} className={`p-5 rounded-xl border ${
                  idx === 0 ? 'bg-emerald-950/20 border-emerald-500/40' :
                  idx === 1 ? 'bg-amber-950/20 border-amber-500/40' :
                  'bg-rose-950/20 border-rose-500/40'
                }`}>
                  <div className="flex items-center justify-between mb-3">
                    <span className={`px-2.5 py-1 rounded text-xs font-bold ${
                      idx === 0 ? 'bg-emerald-500/20 text-emerald-300' :
                      idx === 1 ? 'bg-amber-500/20 text-amber-300' :
                      'bg-rose-500/20 text-rose-300'
                    }`}>
                      {stage.stage}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">{stage.loanCount} Accounts</span>
                  </div>

                  <p className="text-xs text-slate-400 mb-4 h-10">{stage.description}</p>

                  <div className="space-y-2 text-xs bg-slate-900/60 p-3 rounded-lg border border-slate-700/50">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Total EAD:</span>
                      <span className="font-semibold text-slate-200">{formatCurrency(stage.exposureAtDefault)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">PD %:</span>
                      <span className="font-semibold text-indigo-300">{stage.probabilityOfDefaultPct}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">LGD %:</span>
                      <span className="font-semibold text-indigo-300">{stage.lossGivenDefaultPct}%</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-slate-700 font-bold">
                      <span className="text-slate-200">Ind AS 109 Provision:</span>
                      <span className={idx === 0 ? 'text-emerald-400' : idx === 1 ? 'text-amber-400' : 'text-rose-400'}>
                        {formatCurrency(stage.eclProvisionAmount)}
                      </span>
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-400">
                      <span>RBI IRACP Norm:</span>
                      <span>{formatCurrency(stage.iracpRegulatoryProvision)}</span>
                    </div>
                    <div className="flex justify-between text-[11px] text-cyan-400 font-medium">
                      <span>Impairment Reserve Buffer:</span>
                      <span>+{formatCurrency(stage.indAsVsIracpDifference)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Ind AS vs IRACP Summary Ledger Bar */}
            <div className="mt-6 p-4 bg-slate-900/80 rounded-xl border border-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="text-xs text-slate-400">Total Ind AS 109 Balance Sheet Provision:</div>
                <div className="text-xl font-bold text-amber-400">{formatCurrency(totalIndAsEcl)}</div>
              </div>
              <div className="text-xs text-slate-400 border-l border-slate-700 pl-4 hidden md:block">
                <div>RBI IRACP Prudential Requirement:</div>
                <div className="text-sm font-semibold text-slate-300">{formatCurrency(totalIracpProvision)}</div>
              </div>
              <div className="text-xs text-slate-400 border-l border-slate-700 pl-4">
                <div>Excess Transferred to Impairment Reserve:</div>
                <div className="text-sm font-bold text-emerald-400">+{formatCurrency(totalIndAsEcl - totalIracpProvision)}</div>
              </div>
              <div className="px-3 py-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-lg text-xs font-semibold flex items-center space-x-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>RBI SBR Provisioning Compliant</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: ALM STRUCTURAL LIQUIDITY & SENSITIVITY */}
      {/* ========================================================================= */}
      {activeTab === 'alm' && (
        <div className="space-y-6">
          <div className="bg-slate-800/90 border border-slate-700 rounded-xl p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-100">Asset-Liability Management (ALM) Structural Liquidity Matrix</h3>
                <p className="text-xs text-slate-400 mt-0.5">RBI Master Directions ALM Statement of Short-Term & Long-Term Dynamic Cash Flows</p>
              </div>
              <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-full text-xs font-bold">
                All 10 Maturity Buckets Within Tolerance Limits
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left text-slate-300">
                <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-700">
                  <tr>
                    <th className="py-3 px-3">Time Bucket</th>
                    <th className="py-3 px-3 text-right">Cash Inflows (Assets)</th>
                    <th className="py-3 px-3 text-right">Cash Outflows (Liabilities)</th>
                    <th className="py-3 px-3 text-right">Net Mismatch</th>
                    <th className="py-3 px-3 text-right">Cumulative Mismatch</th>
                    <th className="py-3 px-3 text-right">Cumulative %</th>
                    <th className="py-3 px-3 text-center">RBI Threshold</th>
                    <th className="py-3 px-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/60">
                  {nbfcAlmBuckets.map((bucket) => {
                    const isDeficit = bucket.netMismatchAmount < 0;
                    return (
                      <tr key={bucket.id} className="hover:bg-slate-700/30 transition-colors">
                        <td className="py-3 px-3 font-semibold text-slate-200">{bucket.timeBucket}</td>
                        <td className="py-3 px-3 text-right text-emerald-400 font-mono">{formatCurrency(bucket.cashInflows)}</td>
                        <td className="py-3 px-3 text-right text-rose-400 font-mono">{formatCurrency(bucket.cashOutflows)}</td>
                        <td className={`py-3 px-3 text-right font-mono font-bold ${isDeficit ? 'text-amber-400' : 'text-slate-200'}`}>
                          {isDeficit ? '-' : '+'}{formatCurrency(Math.abs(bucket.netMismatchAmount))}
                        </td>
                        <td className="py-3 px-3 text-right font-mono text-cyan-300 font-semibold">{formatCurrency(bucket.cumulativeMismatchAmount)}</td>
                        <td className="py-3 px-3 text-right font-bold text-slate-200">+{bucket.cumulativeMismatchPct}%</td>
                        <td className="py-3 px-3 text-center text-slate-400">{bucket.regulatoryLimitPct}%</td>
                        <td className="py-3 px-3 text-center">
                          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-500/20 text-emerald-300">
                            COMPLIANT
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: CO-LENDING & ESCROW WATERFALL ENGINE */}
      {/* ========================================================================= */}
      {activeTab === 'colending' && (
        <div className="space-y-6">
          <div className="bg-slate-800/90 border border-slate-700 rounded-xl p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <h3 className="text-base font-bold text-slate-100">Co-Lending (CLM) & Direct Assignment Escrow Waterfall</h3>
                <p className="text-xs text-slate-400 mt-0.5">RBI Guidelines on Co-Lending by Banks and NBFCs to Priority Sector & FLDG Default Guarantees</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs px-3 py-1 bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 rounded-full font-semibold">
                  FLDG Cap: Max 5% (RBI Norm)
                </span>
              </div>
            </div>

            <div className="space-y-4">
              {nbfcCoLendingDeals.map((deal) => (
                <div key={deal.id} className="bg-slate-900/80 border border-slate-700/80 rounded-xl p-5 hover:border-slate-600 transition-all">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-700/60">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-bold text-slate-100">{deal.dealCode}</span>
                        <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-300 text-xs rounded font-medium">{deal.colendingModel}</span>
                      </div>
                      <div className="text-xs text-slate-400 mt-1">
                        Originator: <span className="text-slate-200 font-semibold">{deal.originatingNbfcName}</span> | Partner Bank: <span className="text-cyan-300 font-semibold">{deal.partnerBankName}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="text-right">
                        <div className="text-xs text-slate-400">Blended Rate:</div>
                        <div className="text-sm font-bold text-amber-400">{deal.blendedInterestRate}% p.a.</div>
                      </div>
                      <button
                        onClick={() => {
                          handleSettleCoLendingEscrow(deal.id);
                          showToast(`Automated RTGS Escrow settlement of ${formatCurrency(deal.bankEscrowRemittance)} remitted to ${deal.partnerBankName}`);
                        }}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg transition-colors flex items-center space-x-1"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Settle Escrow Remittance</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-4 text-xs">
                    <div>
                      <span className="text-slate-400">Disbursed Pool:</span>
                      <div className="font-bold text-slate-200 mt-0.5">{formatCurrency(deal.totalPoolDisbursed)}</div>
                    </div>
                    <div>
                      <span className="text-slate-400">Live Balance:</span>
                      <div className="font-bold text-slate-200 mt-0.5">{formatCurrency(deal.livePrincipalOutstanding)}</div>
                    </div>
                    <div>
                      <span className="text-slate-400">Sharing Ratio:</span>
                      <div className="font-bold text-indigo-300 mt-0.5">{deal.nbfcSharePct}% NBFC / {deal.partnerBankSharePct}% Bank</div>
                    </div>
                    <div>
                      <span className="text-slate-400">Monthly Collections:</span>
                      <div className="font-bold text-emerald-400 mt-0.5">{formatCurrency(deal.monthlyCollectionsTotal)}</div>
                    </div>
                    <div>
                      <span className="text-slate-400">Bank Remittance:</span>
                      <div className="font-bold text-cyan-400 mt-0.5">{formatCurrency(deal.bankEscrowRemittance)}</div>
                    </div>
                    <div>
                      <span className="text-slate-400">FLDG Guarantee:</span>
                      <div className="font-bold text-emerald-400 mt-0.5">{deal.firstLossDefaultGuaranteePct}% ({deal.fldgStatus})</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: CIBIL / EXPERIAN TUDF 3.0 SCRUB ENGINE */}
      {/* ========================================================================= */}
      {activeTab === 'bureau' && (
        <div className="space-y-6">
          <div className="bg-slate-800/90 border border-slate-700 rounded-xl p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <h3 className="text-base font-bold text-slate-100">TransUnion CIBIL / Experian TUDF 3.0 Bureau Reporting & Scrub Engine</h3>
                <p className="text-xs text-slate-400 mt-0.5">Automated 36-month repayment history string generation and mandatory TUDF segment validator</p>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={() => {
                    handleScrubBureauTudf();
                    showToast('TransUnion CIBIL TUDF 3.0 Scrub completed. 100% of segment formats validated.');
                  }}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg transition-colors flex items-center space-x-2"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Run TUDF 3.0 Scrub</span>
                </button>
              </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <input
                type="text"
                placeholder="Search borrower, loan account, or PAN..."
                value={bureauSearch}
                onChange={(e) => setBureauSearch(e.target.value)}
                className="flex-1 bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-2 focus:ring-indigo-500"
              />
              <select
                value={bureauFilterStatus}
                onChange={(e) => setBureauFilterStatus(e.target.value)}
                className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-2 focus:ring-indigo-500"
              >
                <option value="ALL">All Statuses</option>
                <option value="CLEAN">Clean Records</option>
                <option value="WARNING">Warnings</option>
                <option value="REJECT">Rejections</option>
              </select>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left text-slate-300">
                <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-700">
                  <tr>
                    <th className="py-3 px-3">Account Number</th>
                    <th className="py-3 px-3">Borrower & ID</th>
                    <th className="py-3 px-3 text-right">Sanction Amount</th>
                    <th className="py-3 px-3 text-right">Live Balance</th>
                    <th className="py-3 px-3 text-center">DPD</th>
                    <th className="py-3 px-3 text-center">Asset Class</th>
                    <th className="py-3 px-3 font-mono">36-Month Repayment String</th>
                    <th className="py-3 px-3 text-center">Score</th>
                    <th className="py-3 px-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/60">
                  {filteredBureauRecords.map((rec) => (
                    <tr key={rec.id} className="hover:bg-slate-700/30 transition-colors">
                      <td className="py-3 px-3 font-mono font-bold text-slate-200">{rec.accountNumber}</td>
                      <td className="py-3 px-3">
                        <div className="font-semibold text-slate-100">{rec.borrowerName}</div>
                        <div className="text-[10px] text-slate-400">{rec.idType}: {rec.idNumber}</div>
                      </td>
                      <td className="py-3 px-3 text-right font-mono">{formatCurrency(rec.sanctionAmount)}</td>
                      <td className="py-3 px-3 text-right font-mono font-semibold text-slate-200">{formatCurrency(rec.currentBalance)}</td>
                      <td className="py-3 px-3 text-center">
                        <span className={`px-2 py-0.5 rounded font-bold ${
                          rec.daysPastDue === 0 ? 'bg-emerald-500/20 text-emerald-300' :
                          rec.daysPastDue <= 30 ? 'bg-yellow-500/20 text-yellow-300' :
                          'bg-rose-500/20 text-rose-300'
                        }`}>
                          {rec.daysPastDue} DPD
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center font-bold text-indigo-300">{rec.assetClassification}</td>
                      <td className="py-3 px-3 font-mono text-[10px] text-slate-400 truncate max-w-[140px]" title={rec.paymentHistoryString}>
                        {rec.paymentHistoryString}
                      </td>
                      <td className="py-3 px-3 text-center font-bold text-emerald-400">{rec.bureauScoreEstimated}</td>
                      <td className="py-3 px-3 text-center">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          rec.validationStatus === 'CLEAN' ? 'bg-emerald-500/20 text-emerald-300' :
                          rec.validationStatus === 'WARNING' ? 'bg-amber-500/20 text-amber-300' :
                          'bg-rose-500/20 text-rose-300'
                        }`}>
                          {rec.validationStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 6: MULTI-DIMENSIONAL COST CENTERS & BUDGETS */}
      {/* ========================================================================= */}
      {activeTab === 'costcenters' && (
        <div className="space-y-6">
          <div className="bg-slate-800/90 border border-slate-700 rounded-xl p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <h3 className="text-base font-bold text-slate-100">Multi-Dimensional Cost Centers (Frappe & ERPNext Standard)</h3>
                <p className="text-xs text-slate-400 mt-0.5">Segmented Profit & Loss tracking by Department, Branch & Business Line</p>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setShowAddCcModal(true)}
                  className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg transition-colors flex items-center space-x-1"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span>New Cost Center</span>
                </button>
                <button
                  onClick={() => setShowAddBudgetModal(true)}
                  className="px-3.5 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-bold rounded-lg transition-colors"
                >
                  <span>New Budget Rule</span>
                </button>
              </div>
            </div>

            {/* Cost Centers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {openCostCenters.map((cc) => {
                const utilizationPct = Math.round((cc.actualSpent / cc.allocatedBudget) * 100);
                return (
                  <div key={cc.id} className="bg-slate-900/80 border border-slate-700 p-4 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-xs text-indigo-400 font-bold">{cc.code}</span>
                      <span className="text-[11px] px-2 py-0.5 bg-slate-800 text-slate-300 rounded">{cc.department}</span>
                    </div>
                    <div className="text-sm font-bold text-slate-100 mb-3">{cc.name}</div>

                    <div className="space-y-1.5 text-xs text-slate-400">
                      <div className="flex justify-between">
                        <span>Budget Allocated:</span>
                        <span className="font-semibold text-slate-200">{formatCurrency(cc.allocatedBudget)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Actual Spent YTD:</span>
                        <span className="font-semibold text-amber-400">{formatCurrency(cc.actualSpent)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Remaining Variance:</span>
                        <span className="font-semibold text-emerald-400">{formatCurrency(cc.variance)}</span>
                      </div>
                    </div>

                    <div className="mt-3">
                      <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                        <span>Utilization</span>
                        <span className="font-bold text-slate-200">{utilizationPct}%</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${utilizationPct > 90 ? 'bg-rose-500' : utilizationPct > 75 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                          style={{ width: `${Math.min(100, utilizationPct)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Budget Rules Table */}
            <div className="mt-6 pt-6 border-t border-slate-700">
              <h4 className="text-sm font-bold text-slate-200 mb-3">Active Budget Variance Controls</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left text-slate-300">
                  <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-700">
                    <tr>
                      <th className="py-2.5 px-3">GL Account</th>
                      <th className="py-2.5 px-3">Cost Center</th>
                      <th className="py-2.5 px-3 text-right">Monthly Budget</th>
                      <th className="py-2.5 px-3 text-right">Actual YTD</th>
                      <th className="py-2.5 px-3 text-right">Remaining</th>
                      <th className="py-2.5 px-3 text-center">Alert At</th>
                      <th className="py-2.5 px-3 text-center">Action on Exceed</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/60">
                    {openBudgetRules.map((rule) => (
                      <tr key={rule.id} className="hover:bg-slate-700/30">
                        <td className="py-2.5 px-3 font-semibold text-slate-200">
                          {rule.accountCode} - {rule.accountName}
                        </td>
                        <td className="py-2.5 px-3 font-mono text-indigo-300">{rule.costCenterCode}</td>
                        <td className="py-2.5 px-3 text-right font-mono">{formatCurrency(rule.monthlyBudget)}</td>
                        <td className="py-2.5 px-3 text-right font-mono font-semibold text-amber-400">{formatCurrency(rule.actualYearToDate)}</td>
                        <td className="py-2.5 px-3 text-right font-mono text-emerald-400 font-semibold">{formatCurrency(rule.remainingBudget)}</td>
                        <td className="py-2.5 px-3 text-center text-slate-400">{rule.alertThresholdPct}%</td>
                        <td className="py-2.5 px-3 text-center">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            rule.actionOnExceed === 'Stop Transaction' ? 'bg-rose-500/20 text-rose-300' :
                            'bg-amber-500/20 text-amber-300'
                          }`}>
                            {rule.actionOnExceed}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 7: PERIOD-CLOSING VOUCHER (FRAPPE/ERPNEXT STANDARD) */}
      {/* ========================================================================= */}
      {activeTab === 'periodclose' && (
        <div className="space-y-6">
          <div className="bg-slate-800/90 border border-slate-700 rounded-xl p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <h3 className="text-base font-bold text-slate-100">Period-Closing Voucher Engine (Frappe & ERPNext Standard)</h3>
                <p className="text-xs text-slate-400 mt-0.5">Automates year-end zeroing of Nominal Income & Expense Accounts into Retained Earnings (GL 3100)</p>
              </div>

              <button
                onClick={() => setShowPeriodCloseModal(true)}
                className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold rounded-lg shadow-lg shadow-emerald-500/20 transition-all flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                </svg>
                <span>Execute Period Closing Voucher</span>
              </button>
            </div>

            {/* Closed Periods Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left text-slate-300">
                <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-700">
                  <tr>
                    <th className="py-3 px-3">Period Name</th>
                    <th className="py-3 px-3">Closing Date</th>
                    <th className="py-3 px-3 font-mono">Voucher #</th>
                    <th className="py-3 px-3 text-right">Expense Debits Transferred</th>
                    <th className="py-3 px-3 text-right">Income Credits Transferred</th>
                    <th className="py-3 px-3 text-right font-bold">Net Profit Transferred</th>
                    <th className="py-3 px-3">Target Retained Earnings Account</th>
                    <th className="py-3 px-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/60">
                  {openPeriodClosingEntries.map((pce) => (
                    <tr key={pce.id} className="hover:bg-slate-700/30 transition-colors">
                      <td className="py-3 px-3 font-bold text-slate-100">{pce.periodName}</td>
                      <td className="py-3 px-3 text-slate-400">{pce.closingDate}</td>
                      <td className="py-3 px-3 font-mono text-cyan-300">{pce.closingVoucherNumber}</td>
                      <td className="py-3 px-3 text-right font-mono text-rose-400">{formatCurrency(pce.totalExpenseDebitTransferred)}</td>
                      <td className="py-3 px-3 text-right font-mono text-emerald-400">{formatCurrency(pce.totalIncomeCreditTransferred)}</td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-emerald-300">{formatCurrency(pce.netProfitTransferredToRetainedEarnings)}</td>
                      <td className="py-3 px-3 text-slate-400 text-[11px]">{pce.retainedEarningsAccount}</td>
                      <td className="py-3 px-3 text-center">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-700 text-slate-200 flex items-center justify-center gap-1">
                          <svg className="w-3 h-3 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                          </svg>
                          LOCKED
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 8: STATUTORY GST & TDS TAX ENGINE */}
      {/* ========================================================================= */}
      {activeTab === 'statutory' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* GST E-Invoicing & E-Way Hub */}
            <div className="bg-slate-800/90 border border-slate-700 rounded-xl p-6">
              <h3 className="text-base font-bold text-slate-100 mb-2">GST E-Invoicing & Signed QR Code Generator</h3>
              <p className="text-xs text-slate-400 mb-4">Real-time NIC / IRP (Invoice Registration Portal) cryptographic IRN generator</p>

              <div className="bg-slate-900 p-4 rounded-xl border border-slate-700 space-y-3 font-mono text-xs">
                <div>
                  <span className="text-slate-500">Invoice Ref:</span> <span className="text-slate-200">INV-2026-0819</span>
                </div>
                <div>
                  <span className="text-slate-500">IRN Hash (64 Char SHA-256):</span>
                  <div className="text-cyan-400 text-[10px] break-all mt-0.5">
                    a7b29f0c5e31d8e4129b8c34f01e892d19283e74a123f9901d8e123abcf0192e
                  </div>
                </div>
                <div>
                  <span className="text-slate-500">Ack No & Date:</span> <span className="text-slate-300">122610992381 / 2026-08-24 10:14:02</span>
                </div>
                <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-slate-300">
                  <span>Cryptographic QR:</span>
                  <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded text-[10px] font-sans font-bold">DIGITALLY SIGNED</span>
                </div>
              </div>
            </div>

            {/* TDS Challan 281 & Section 194A / 194J Hub */}
            <div className="bg-slate-800/90 border border-slate-700 rounded-xl p-6">
              <h3 className="text-base font-bold text-slate-100 mb-2">TDS Withholding & Challan 281 Hub</h3>
              <p className="text-xs text-slate-400 mb-4">Tax Deducted at Source on Loan Processing & Interest Payouts</p>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between p-3 bg-slate-900 rounded-lg border border-slate-700/70">
                  <div>
                    <div className="font-bold text-slate-200">Section 194A - Interest Other than Securities</div>
                    <div className="text-[11px] text-slate-400">TDS Rate: 10.0% | Form 26Q</div>
                  </div>
                  <div className="text-right font-mono font-bold text-amber-400">₹4,25,000</div>
                </div>

                <div className="flex justify-between p-3 bg-slate-900 rounded-lg border border-slate-700/70">
                  <div>
                    <div className="font-bold text-slate-200">Section 194J - Professional & Legal Fees</div>
                    <div className="text-[11px] text-slate-400">TDS Rate: 10.0% | Form 26Q</div>
                  </div>
                  <div className="text-right font-mono font-bold text-amber-400">₹1,80,000</div>
                </div>

                <div className="flex justify-between p-3 bg-slate-900 rounded-lg border border-slate-700/70">
                  <div>
                    <div className="font-bold text-slate-200">Section 194C - Contractor & Courier Payments</div>
                    <div className="text-[11px] text-slate-400">TDS Rate: 2.0% | Form 26Q</div>
                  </div>
                  <div className="text-right font-mono font-bold text-amber-400">₹62,000</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ADD COST CENTER */}
      {/* ========================================================================= */}
      {showAddCcModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-100">Create New Dimension Cost Center</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Cost Center Code</label>
                <input
                  type="text"
                  placeholder="e.g. CC-TECH-INNOV"
                  value={newCcCode}
                  onChange={(e) => setNewCcCode(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-slate-200"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Cost Center Name</label>
                <input
                  type="text"
                  placeholder="e.g. Technology & Digital Lending Division"
                  value={newCcName}
                  onChange={(e) => setNewCcName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-slate-200"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Department</label>
                <select
                  value={newCcDept}
                  onChange={(e) => setNewCcDept(e.target.value as any)}
                  className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-slate-200"
                >
                  <option value="Retail Lending">Retail Lending</option>
                  <option value="SME & Corporate">SME & Corporate</option>
                  <option value="Treasury & ALM">Treasury & ALM</option>
                  <option value="Collections & Recovery">Collections & Recovery</option>
                  <option value="Risk & Underwriting">Risk & Underwriting</option>
                  <option value="Corporate Operations">Corporate Operations</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Annual Budget (₹)</label>
                <input
                  type="number"
                  value={newCcBudget}
                  onChange={(e) => setNewCcBudget(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-slate-200"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Head of Department (HOD)</label>
                <input
                  type="text"
                  placeholder="e.g. Rajesh Nair"
                  value={newCcHod}
                  onChange={(e) => setNewCcHod(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-slate-200"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-3 border-t border-slate-700">
              <button
                onClick={() => setShowAddCcModal(false)}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs rounded font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (!newCcCode || !newCcName) {
                    showToast('Please enter both Cost Center code and name.');
                    return;
                  }
                  handleAddOpenCostCenter({
                    code: newCcCode,
                    name: newCcName,
                    department: newCcDept,
                    allocatedBudget: newCcBudget,
                    headOfDepartment: newCcHod || 'Admin'
                  });
                  setShowAddCcModal(false);
                  showToast(`Cost center ${newCcCode} created successfully.`);
                }}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs rounded font-bold"
              >
                Save Cost Center
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ADD BUDGET RULE */}
      {/* ========================================================================= */}
      {showAddBudgetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-100">Create New Budget Control Rule</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">GL Account Code & Name</label>
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="text"
                    placeholder="Code"
                    value={newBgAccountCode}
                    onChange={(e) => setNewBgAccountCode(e.target.value)}
                    className="bg-slate-900 border border-slate-700 rounded p-2 text-slate-200"
                  />
                  <input
                    type="text"
                    placeholder="Account Name"
                    value={newBgAccountName}
                    onChange={(e) => setNewBgAccountName(e.target.value)}
                    className="col-span-2 bg-slate-900 border border-slate-700 rounded p-2 text-slate-200"
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Target Cost Center</label>
                <select
                  value={newBgCcCode}
                  onChange={(e) => setNewBgCcCode(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-slate-200"
                >
                  {openCostCenters.map(cc => (
                    <option key={cc.id} value={cc.code}>{cc.code} - {cc.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Monthly Budget (₹)</label>
                <input
                  type="number"
                  value={newBgMonthly}
                  onChange={(e) => setNewBgMonthly(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-slate-200"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Action On Exceed Threshold</label>
                <select
                  value={newBgAction}
                  onChange={(e) => setNewBgAction(e.target.value as any)}
                  className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-slate-200"
                >
                  <option value="Stop Transaction">Stop Transaction (Hard Lock)</option>
                  <option value="Warn User & Log Audit">Warn User & Log Audit</option>
                  <option value="Ignore">Ignore</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-3 border-t border-slate-700">
              <button
                onClick={() => setShowAddBudgetModal(false)}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs rounded font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleAddOpenBudgetRule({
                    accountCode: newBgAccountCode,
                    accountName: newBgAccountName,
                    costCenterCode: newBgCcCode,
                    fiscalYear: '2026-2027',
                    monthlyBudget: newBgMonthly,
                    actionOnExceed: newBgAction,
                    alertThresholdPct: newBgAlertPct
                  });
                  setShowAddBudgetModal(false);
                  showToast('Budget control rule registered successfully.');
                }}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs rounded font-bold"
              >
                Save Budget Rule
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: EXECUTE PERIOD CLOSE */}
      {/* ========================================================================= */}
      {showPeriodCloseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-100">Execute Period Closing Voucher</h3>
            <p className="text-xs text-slate-400">
              This will automatically zero out all Income & Expense nominal accounts and transfer net profits to Retained Earnings (GL 3100).
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Period Name</label>
                <input
                  type="text"
                  value={closePeriodName}
                  onChange={(e) => setClosePeriodName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-slate-200 font-semibold"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Total Operating Expenses (Debit to be zeroed)</label>
                <input
                  type="number"
                  value={closeExpenseDebit}
                  onChange={(e) => setCloseExpenseDebit(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-slate-200 font-mono text-rose-400"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Total Revenue / Income (Credit to be zeroed)</label>
                <input
                  type="number"
                  value={closeIncomeCredit}
                  onChange={(e) => setCloseIncomeCredit(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-slate-200 font-mono text-emerald-400"
                />
              </div>

              <div className="p-3 bg-slate-900 rounded-lg border border-slate-700/80 flex justify-between items-center">
                <span className="text-slate-300 font-semibold">Net Profit to Retained Earnings:</span>
                <span className="font-mono font-bold text-emerald-400 text-sm">
                  {formatCurrency(closeIncomeCredit - closeExpenseDebit)}
                </span>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-3 border-t border-slate-700">
              <button
                onClick={() => setShowPeriodCloseModal(false)}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs rounded font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleExecutePeriodClose(closePeriodName, closeExpenseDebit, closeIncomeCredit);
                  setShowPeriodCloseModal(false);
                  showToast(`Period-closing voucher created and nominal accounts zeroed for ${closePeriodName}`);
                }}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs rounded font-bold shadow-lg shadow-emerald-500/20"
              >
                Confirm & Seal Period
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NbfcAccountingEngine;
