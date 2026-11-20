import React, { useState } from 'react';
import { useAppContext } from '../AppContext';
import { RilletContract, RilletContractItem, RilletPrepaidItem } from './types';
import RilletIcon from '../components/icons/RilletIcon';
import AiIcon from '../components/icons/AiIcon';

const RilletAi: React.FC = () => {
  const {
    rilletSaaSMetrics,
    rilletContracts,
    rilletBankTransactions,
    rilletPrepaids,
    rilletFluxAnalysis,
    rilletCloseChecklist,
    rilletAiQueries,
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
    currentUser,
  } = useAppContext();

  const [activeTab, setActiveTab] = useState<'revrec' | 'saasMetrics' | 'bankFeeds' | 'closeFlux' | 'prepaids' | 'copilot'>('revrec');
  
  // Modals
  const [showNewContractModal, setShowNewContractModal] = useState(false);
  const [showNewPrepaidModal, setShowNewPrepaidModal] = useState(false);
  const [showAiIngestModal, setShowAiIngestModal] = useState(false);
  const [selectedContract, setSelectedContract] = useState<RilletContract | null>(null);

  // Copilot input state
  const [copilotQuestion, setCopilotQuestion] = useState('');
  const [copilotCategory, setCopilotCategory] = useState<'Revenue & ASC 606' | 'SaaS Metrics' | 'Burn & Runway' | 'Anomalies & Flux' | 'Audit Trail'>('Revenue & ASC 606');

  // New Contract Form State
  const [newContractNumber, setNewContractNumber] = useState(`CTR-2026-${Math.floor(1000 + Math.random() * 9000)}`);
  const [newCustomerName, setNewCustomerName] = useState('');
  const [newCustomerTier, setNewCustomerTier] = useState<'Enterprise' | 'Growth' | 'Strategic Scale' | 'Startup'>('Enterprise');
  const [newArr, setNewArr] = useState(600000);
  const [newTcv, setNewTcv] = useState(1800000);
  const [newBillingFreq, setNewBillingFreq] = useState<'Annual Upfront' | 'Quarterly' | 'Monthly' | 'Multi-Year Prepaid' | 'Usage-Metered'>('Annual Upfront');
  const [newPaymentTerms, setNewPaymentTerms] = useState('Net 30');
  const [newStartDate, setNewStartDate] = useState('2026-08-01');
  const [newEndDate, setNewEndDate] = useState('2029-07-31');

  // New Prepaid Form State
  const [newPrepaidVendor, setNewPrepaidVendor] = useState('');
  const [newPrepaidDesc, setNewPrepaidDesc] = useState('');
  const [newPrepaidCost, setNewPrepaidCost] = useState(120000);
  const [newPrepaidMonths, setNewPrepaidMonths] = useState(12);
  const [newPrepaidGl, setNewPrepaidGl] = useState('5100 - Hosting & Cloud Infrastructure');

  // Formatters
  const fmtUsd = (amt: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amt);
  };

  const fmtUsdExact = (amt: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amt);
  };

  // Calculations
  const totalDeferredLiability = rilletContracts.reduce(
    (acc, c) => acc + c.elements.reduce((sum, e) => sum + e.deferredBalance, 0),
    0
  );
  const totalRecognizedRevenue = rilletContracts.reduce(
    (acc, c) => acc + c.elements.reduce((sum, e) => sum + e.recognizedSoFar, 0),
    0
  );
  const totalPrepaidAssets = rilletPrepaids.reduce((acc, p) => acc + p.remainingAssetBalance, 0);

  const completedCloseCount = rilletCloseChecklist.filter(t => t.status === 'COMPLETED').length;
  const closeProgressPct = Math.round((completedCloseCount / rilletCloseChecklist.length) * 100);

  const handleCreateContractSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomerName) return;

    const licenseValue = Math.round(newArr * 0.8);
    const servicesValue = Math.round(newArr * 0.2);

    const defaultElements: RilletContractItem[] = [
      {
        id: `elm-${Date.now()}-1`,
        elementName: 'SaaS Platform Core License',
        performanceObligation: 'Software Subscription',
        contractValue: licenseValue,
        standaloneSellingPrice: licenseValue,
        allocatedRevenue: licenseValue,
        revRecMethod: 'Daily Ratable (Over Time)',
        startDate: newStartDate,
        endDate: newEndDate,
        billedSoFar: newBillingFreq === 'Annual Upfront' ? licenseValue : Math.round(licenseValue / 4),
        recognizedSoFar: 0,
        deferredBalance: newBillingFreq === 'Annual Upfront' ? licenseValue : Math.round(licenseValue / 4),
      },
      {
        id: `elm-${Date.now()}-2`,
        elementName: 'Enterprise Setup & Integration Services',
        performanceObligation: 'Professional Services',
        contractValue: servicesValue,
        standaloneSellingPrice: servicesValue,
        allocatedRevenue: servicesValue,
        revRecMethod: 'Point-in-Time (Milestone Delivery)',
        startDate: newStartDate,
        endDate: newStartDate,
        billedSoFar: servicesValue,
        recognizedSoFar: 0,
        deferredBalance: servicesValue,
      }
    ];

    handleAddRilletContract({
      contractNumber: newContractNumber,
      customerName: newCustomerName,
      customerTier: newCustomerTier,
      annualContractValue: Number(newArr),
      totalContractValue: Number(newTcv),
      currency: 'USD',
      billingFrequency: newBillingFreq,
      contractStartDate: newStartDate,
      contractEndDate: newEndDate,
      autoRenew: true,
      paymentTerms: newPaymentTerms,
      contractPdfName: `${newCustomerName.replace(/\s+/g, '_')}_Order_Form.pdf`,
      extractedWithAi: true,
      elements: defaultElements,
    });

    setShowNewContractModal(false);
    setNewCustomerName('');
    setNewContractNumber(`CTR-2026-${Math.floor(1000 + Math.random() * 9000)}`);
  };

  const handleCreatePrepaidSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPrepaidVendor || !newPrepaidDesc) return;

    const monthlyAmort = Math.round(newPrepaidCost / newPrepaidMonths);

    handleAddRilletPrepaid({
      vendorName: newPrepaidVendor,
      description: newPrepaidDesc,
      totalPrepaidCost: Number(newPrepaidCost),
      startDate: '2026-08-01',
      endDate: '2027-07-31',
      totalMonths: Number(newPrepaidMonths),
      monthlyAmortization: monthlyAmort,
      expenseGlAccount: newPrepaidGl,
    });

    setShowNewPrepaidModal(false);
    setNewPrepaidVendor('');
    setNewPrepaidDesc('');
  };

  const handleAskCopilotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!copilotQuestion.trim()) return;
    handleAskRilletAi(copilotQuestion, copilotCategory);
    setCopilotQuestion('');
  };

  const handleAiContractExtractionSimulation = (sampleName: string, sampleArr: number, sampleTcv: number) => {
    const defaultElements: RilletContractItem[] = [
      {
        id: `elm-ext-${Date.now()}-1`,
        elementName: 'Enterprise SaaS Multi-Tenant License',
        performanceObligation: 'Software Subscription',
        contractValue: Math.round(sampleArr * 0.85),
        standaloneSellingPrice: Math.round(sampleArr * 0.85),
        allocatedRevenue: Math.round(sampleArr * 0.85),
        revRecMethod: 'Daily Ratable (Over Time)',
        startDate: '2026-08-01',
        endDate: '2027-07-31',
        billedSoFar: Math.round(sampleArr * 0.85),
        recognizedSoFar: 0,
        deferredBalance: Math.round(sampleArr * 0.85),
      },
      {
        id: `elm-ext-${Date.now()}-2`,
        elementName: 'Dedicated Model Architecture & Data Ingestion Setup',
        performanceObligation: 'Professional Services',
        contractValue: Math.round(sampleArr * 0.15),
        standaloneSellingPrice: Math.round(sampleArr * 0.15),
        allocatedRevenue: Math.round(sampleArr * 0.15),
        revRecMethod: 'Point-in-Time (Milestone Delivery)',
        startDate: '2026-08-01',
        endDate: '2026-09-30',
        billedSoFar: Math.round(sampleArr * 0.15),
        recognizedSoFar: 0,
        deferredBalance: Math.round(sampleArr * 0.15),
      }
    ];

    handleAddRilletContract({
      contractNumber: `CTR-2026-AI-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: sampleName,
      customerTier: 'Enterprise',
      annualContractValue: sampleArr,
      totalContractValue: sampleTcv,
      currency: 'USD',
      billingFrequency: 'Annual Upfront',
      contractStartDate: '2026-08-01',
      contractEndDate: '2027-07-31',
      autoRenew: true,
      paymentTerms: 'Net 30',
      contractPdfName: `${sampleName.replace(/\s+/g, '_')}_Signed_MSA.pdf`,
      extractedWithAi: true,
      elements: defaultElements,
    });

    setShowAiIngestModal(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner & Title Header */}
      <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 text-white p-6 rounded-2xl shadow-xl border border-indigo-700/40">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3.5 bg-indigo-500/20 border border-indigo-400/30 rounded-2xl shadow-inner text-indigo-300">
              <RilletIcon />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
                  Rillet AI
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Next-Gen AI ERP
                  </span>
                </h1>
              </div>
              <p className="text-sm text-indigo-200 mt-1">
                Autonomous Revenue Recognition (ASC 606 / IFRS 15), Zero-Touch Close, Real-Time SaaS Intelligence & AI Flux Explanations
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setShowAiIngestModal(true)}
              className="px-3.5 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg shadow-md transition-all flex items-center gap-1.5 border border-indigo-400/30"
            >
              <svg className="w-4 h-4 text-indigo-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              AI Contract Ingestion (OCR)
            </button>

            <button
              onClick={handleRunRevRecAmortization}
              className="px-3.5 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg shadow-md transition-all flex items-center gap-1.5 border border-emerald-400/30"
            >
              <svg className="w-4 h-4 text-emerald-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Run ASC 606 RevRec
            </button>

            <button
              onClick={handleAutoMatchBankFeed}
              className="px-3.5 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-indigo-200 rounded-lg shadow-md transition-all flex items-center gap-1.5 border border-slate-700"
            >
              <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              AI Auto-Match Feeds
            </button>
          </div>
        </div>

        {/* Global Real-Time KPIs ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-6 pt-5 border-t border-indigo-800/60 text-xs">
          <div className="bg-slate-900/60 p-3 rounded-xl border border-indigo-500/20">
            <span className="text-slate-400 block font-medium">Active ARR</span>
            <span className="text-lg font-bold text-white tracking-tight">{fmtUsd(rilletSaaSMetrics.arrCurrent)}</span>
            <span className="text-[11px] text-emerald-400 font-semibold block mt-0.5">+32.6% YoY</span>
          </div>

          <div className="bg-slate-900/60 p-3 rounded-xl border border-indigo-500/20">
            <span className="text-slate-400 block font-medium">Net Retention (NRR)</span>
            <span className="text-lg font-bold text-emerald-400 tracking-tight">{rilletSaaSMetrics.netRevenueRetentionPct}%</span>
            <span className="text-[11px] text-slate-400 block mt-0.5">Top-Decile SaaS</span>
          </div>

          <div className="bg-slate-900/60 p-3 rounded-xl border border-indigo-500/20">
            <span className="text-slate-400 block font-medium">Deferred Rev (ASC 606)</span>
            <span className="text-lg font-bold text-indigo-300 tracking-tight">{fmtUsd(totalDeferredLiability)}</span>
            <span className="text-[11px] text-indigo-200 block mt-0.5">{rilletContracts.length} Active Contracts</span>
          </div>

          <div className="bg-slate-900/60 p-3 rounded-xl border border-indigo-500/20">
            <span className="text-slate-400 block font-medium">Rule of 40</span>
            <span className="text-lg font-bold text-amber-300 tracking-tight">{rilletSaaSMetrics.ruleOf40Pct}%</span>
            <span className="text-[11px] text-emerald-400 block mt-0.5">Highly Efficient</span>
          </div>

          <div className="bg-slate-900/60 p-3 rounded-xl border border-indigo-500/20">
            <span className="text-slate-400 block font-medium">Cash Runway</span>
            <span className="text-lg font-bold text-cyan-300 tracking-tight">{rilletSaaSMetrics.liveCashRunwayMonths} Mo</span>
            <span className="text-[11px] text-cyan-400 block mt-0.5">Burn: 0.72x Mult</span>
          </div>

          <div className="bg-slate-900/60 p-3 rounded-xl border border-indigo-500/20">
            <span className="text-slate-400 block font-medium">Month Close Status</span>
            <div className="flex items-center justify-between mt-1">
              <span className="text-sm font-bold text-white">{closeProgressPct}%</span>
              <span className="text-[10px] px-1.5 py-0.5 bg-emerald-500/20 text-emerald-300 rounded font-semibold">
                {completedCloseCount}/{rilletCloseChecklist.length} tasks
              </span>
            </div>
            <div className="w-full bg-slate-700/80 rounded-full h-1.5 mt-1.5 overflow-hidden">
              <div className="bg-emerald-400 h-1.5 rounded-full transition-all" style={{ width: `${closeProgressPct}%` }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setActiveTab('revrec')}
          className={`px-4 py-2.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'revrec'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          ASC 606 RevRec & Waterfalls
        </button>

        <button
          onClick={() => setActiveTab('saasMetrics')}
          className={`px-4 py-2.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'saasMetrics'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
          Real-Time SaaS Metrics & Waterfalls
        </button>

        <button
          onClick={() => setActiveTab('bankFeeds')}
          className={`px-4 py-2.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'bankFeeds'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
          AI Zero-Touch Bank Recs
        </button>

        <button
          onClick={() => setActiveTab('closeFlux')}
          className={`px-4 py-2.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'closeFlux'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          AI Month-End Close & Flux Analysis
        </button>

        <button
          onClick={() => setActiveTab('prepaids')}
          className={`px-4 py-2.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'prepaids'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Prepaids & Amortization
        </button>

        <button
          onClick={() => setActiveTab('copilot')}
          className={`px-4 py-2.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'copilot'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <AiIcon />
          Ask Rillet AI Copilot
        </button>
      </div>

      {/* TAB 1: ASC 606 REVENUE RECOGNITION & WATERFALLS */}
      {activeTab === 'revrec' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                ASC 606 / IFRS 15 Revenue Recognition & Deferred Waterfalls
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Automated multi-element Standalone Selling Price (SSP) allocation, ratable daily recognition, and unearned contract liabilities
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowNewContractModal(true)}
                className="px-3 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                New Contract / Order Form
              </button>
            </div>
          </div>

          {/* Revenue & Deferred Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>Total Contracted Portfolio (TCV)</span>
                <span className="text-indigo-500 font-semibold">Multi-Year</span>
              </div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                {fmtUsd(rilletContracts.reduce((acc, c) => acc + c.totalContractValue, 0))}
              </div>
              <p className="text-xs text-slate-400 mt-1">Sum of all signed active customer Master Services Agreements</p>
            </div>

            <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>Recognized Revenue to Date</span>
                <span className="text-emerald-500 font-semibold">GAAP GL 4000</span>
              </div>
              <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                {fmtUsd(totalRecognizedRevenue)}
              </div>
              <p className="text-xs text-slate-400 mt-1">Performance obligations delivered & amortized over time</p>
            </div>

            <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>Deferred Revenue Balance (Liability)</span>
                <span className="text-amber-500 font-semibold">ASC 606 GL 2100</span>
              </div>
              <div className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">
                {fmtUsd(totalDeferredLiability)}
              </div>
              <p className="text-xs text-slate-400 mt-1">Unearned upfront customer billings scheduled for ratable release</p>
            </div>
          </div>

          {/* Active Contract Table with Multi-Element Drilldown */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                Active Customer Contracts & Performance Obligations
                <span className="px-2 py-0.5 text-xs bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300 rounded font-medium">
                  {rilletContracts.length} Contracts
                </span>
              </h3>
              <span className="text-xs text-slate-500">Relative Fair Value Allocation (ASC 606 Step 4)</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
                <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="px-4 py-3">Contract & Customer</th>
                    <th className="px-4 py-3">Tier & Terms</th>
                    <th className="px-4 py-3 text-right">ARR</th>
                    <th className="px-4 py-3 text-right">TCV</th>
                    <th className="px-4 py-3 text-right">Recognized</th>
                    <th className="px-4 py-3 text-right">Deferred Balance</th>
                    <th className="px-4 py-3 text-center">Status</th>
                    <th className="px-4 py-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                  {rilletContracts.map(contract => {
                    const cRecognized = contract.elements.reduce((sum, e) => sum + e.recognizedSoFar, 0);
                    const cDeferred = contract.elements.reduce((sum, e) => sum + e.deferredBalance, 0);
                    const isExpanded = selectedContract?.id === contract.id;

                    return (
                      <React.Fragment key={contract.id}>
                        <tr className="hover:bg-slate-50/80 dark:hover:bg-slate-750 transition-colors">
                          <td className="px-4 py-3">
                            <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                              {contract.customerName}
                              {contract.extractedWithAi && (
                                <span className="px-1.5 py-0.5 bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300 text-[10px] rounded font-medium flex items-center gap-1">
                                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span> AI OCR
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                              <span>{contract.contractNumber}</span>
                              <span>•</span>
                              <span>{contract.contractStartDate} to {contract.contractEndDate}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className="inline-block px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded text-[11px] font-medium">
                              {contract.customerTier}
                            </span>
                            <div className="text-[11px] text-slate-400 mt-0.5">{contract.billingFrequency} • {contract.paymentTerms}</div>
                          </td>
                          <td className="px-4 py-3 text-right font-bold text-slate-900 dark:text-white">
                            {fmtUsd(contract.annualContractValue)}
                          </td>
                          <td className="px-4 py-3 text-right text-slate-600 dark:text-slate-300 font-medium">
                            {fmtUsd(contract.totalContractValue)}
                          </td>
                          <td className="px-4 py-3 text-right text-emerald-600 dark:text-emerald-400 font-semibold">
                            {fmtUsd(cRecognized)}
                          </td>
                          <td className="px-4 py-3 text-right text-amber-600 dark:text-amber-400 font-semibold">
                            {fmtUsd(cDeferred)}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                              {contract.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <button
                              onClick={() => setSelectedContract(isExpanded ? null : contract)}
                              className="px-2.5 py-1 text-[11px] font-semibold bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-900/30 dark:hover:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded transition-colors"
                            >
                              {isExpanded ? 'Hide Elements' : 'View SSP Split'}
                            </button>
                          </td>
                        </tr>

                        {/* Expandable Multi-Element Arrangement Breakdown */}
                        {isExpanded && (
                          <tr className="bg-slate-50/90 dark:bg-slate-900/60">
                            <td colSpan={8} className="p-4">
                              <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-indigo-200 dark:border-indigo-900/50 space-y-3 shadow-inner">
                                <div className="flex items-center justify-between">
                                  <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                                    ASC 606 Standalone Selling Price (SSP) & Performance Obligations Breakdown
                                  </span>
                                  <span className="text-[11px] text-indigo-500 font-medium">Source Document: {contract.contractPdfName}</span>
                                </div>

                                <div className="overflow-x-auto">
                                  <table className="w-full text-left text-xs">
                                    <thead className="bg-slate-100 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400 text-[11px]">
                                      <tr>
                                        <th className="p-2">Obligation Name</th>
                                        <th className="p-2">Type</th>
                                        <th className="p-2">RevRec Method</th>
                                        <th className="p-2 text-right">Contract Value</th>
                                        <th className="p-2 text-right">SSP (Fair Value)</th>
                                        <th className="p-2 text-right">Allocated Rev</th>
                                        <th className="p-2 text-right">Recognized</th>
                                        <th className="p-2 text-right">Deferred</th>
                                      </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200 dark:divide-slate-700 text-slate-700 dark:text-slate-300">
                                      {contract.elements.map(el => (
                                        <tr key={el.id}>
                                          <td className="p-2 font-medium">{el.elementName}</td>
                                          <td className="p-2 text-slate-500">{el.performanceObligation}</td>
                                          <td className="p-2 text-indigo-600 dark:text-indigo-400 font-medium">{el.revRecMethod}</td>
                                          <td className="p-2 text-right font-medium">{fmtUsd(el.contractValue)}</td>
                                          <td className="p-2 text-right text-slate-500">{fmtUsd(el.standaloneSellingPrice)}</td>
                                          <td className="p-2 text-right font-bold text-slate-900 dark:text-white">{fmtUsd(el.allocatedRevenue)}</td>
                                          <td className="p-2 text-right text-emerald-600 dark:text-emerald-400 font-semibold">{fmtUsd(el.recognizedSoFar)}</td>
                                          <td className="p-2 text-right text-amber-600 dark:text-amber-400 font-semibold">{fmtUsd(el.deferredBalance)}</td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* 12-Month Rolling Revenue Recognition Waterfall Matrix */}
          <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  12-Month Deferred Revenue Waterfall Matrix (GAAP & Tax Projection)
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Rolling monthly deferred revenue release, new bookings recognition, and unbilled contract asset balance
                </p>
              </div>
              <span className="px-2.5 py-1 text-xs bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg font-semibold">
                Daily Ratable Calculation Active
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 text-[11px] uppercase">
                  <tr>
                    <th className="text-left p-3">Waterfall Metric</th>
                    <th className="p-3">Aug 26 (Actual)</th>
                    <th className="p-3">Sep 26</th>
                    <th className="p-3">Oct 26</th>
                    <th className="p-3">Nov 26</th>
                    <th className="p-3">Dec 26</th>
                    <th className="p-3">Jan 27</th>
                    <th className="p-3">Feb 27</th>
                    <th className="p-3">Mar 27</th>
                    <th className="p-3 font-bold text-indigo-600 dark:text-indigo-400">12-Mo Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                  <tr>
                    <td className="text-left p-3 font-medium text-slate-700 dark:text-slate-300">Beginning Deferred Revenue</td>
                    <td className="p-3 text-slate-600 dark:text-slate-400">$2,441,667</td>
                    <td className="p-3 text-slate-600 dark:text-slate-400">$3,604,167</td>
                    <td className="p-3 text-slate-600 dark:text-slate-400">$3,420,000</td>
                    <td className="p-3 text-slate-600 dark:text-slate-400">$3,235,833</td>
                    <td className="p-3 text-slate-600 dark:text-slate-400">$3,051,667</td>
                    <td className="p-3 text-slate-600 dark:text-slate-400">$4,867,500</td>
                    <td className="p-3 text-slate-600 dark:text-slate-400">$4,683,333</td>
                    <td className="p-3 text-slate-600 dark:text-slate-400">$4,499,167</td>
                    <td className="p-3 font-bold text-slate-900 dark:text-white">$2,441,667</td>
                  </tr>
                  <tr className="bg-indigo-50/30 dark:bg-indigo-950/20">
                    <td className="text-left p-3 font-medium text-indigo-700 dark:text-indigo-300">(+) New Contract Billings</td>
                    <td className="p-3 font-semibold text-indigo-600 dark:text-indigo-400">+$2,400,000</td>
                    <td className="p-3 text-slate-600 dark:text-slate-400">+$1,053,333</td>
                    <td className="p-3 text-slate-600 dark:text-slate-400">+$1,053,333</td>
                    <td className="p-3 text-slate-600 dark:text-slate-400">+$1,053,333</td>
                    <td className="p-3 text-slate-600 dark:text-slate-400">+$3,053,333</td>
                    <td className="p-3 text-slate-600 dark:text-slate-400">+$1,053,333</td>
                    <td className="p-3 text-slate-600 dark:text-slate-400">+$1,053,333</td>
                    <td className="p-3 text-slate-600 dark:text-slate-400">+$1,053,333</td>
                    <td className="p-3 font-bold text-indigo-600 dark:text-indigo-400">+$14,850,000</td>
                  </tr>
                  <tr className="bg-emerald-50/30 dark:bg-emerald-950/20">
                    <td className="text-left p-3 font-medium text-emerald-700 dark:text-emerald-300">(-) Recognized GAAP Revenue</td>
                    <td className="p-3 font-semibold text-emerald-600 dark:text-emerald-400">-$1,237,500</td>
                    <td className="p-3 text-slate-600 dark:text-slate-400">-$1,237,500</td>
                    <td className="p-3 text-slate-600 dark:text-slate-400">-$1,237,500</td>
                    <td className="p-3 text-slate-600 dark:text-slate-400">-$1,237,500</td>
                    <td className="p-3 text-slate-600 dark:text-slate-400">-$1,237,500</td>
                    <td className="p-3 text-slate-600 dark:text-slate-400">-$1,237,500</td>
                    <td className="p-3 text-slate-600 dark:text-slate-400">-$1,237,500</td>
                    <td className="p-3 text-slate-600 dark:text-slate-400">-$1,237,500</td>
                    <td className="p-3 font-bold text-emerald-600 dark:text-emerald-400">-$14,850,000</td>
                  </tr>
                  <tr className="font-bold text-slate-900 dark:text-white bg-slate-100/60 dark:bg-slate-700/40">
                    <td className="text-left p-3">Ending Deferred Revenue (Liability)</td>
                    <td className="p-3 text-amber-600 dark:text-amber-400">$3,604,167</td>
                    <td className="p-3 text-amber-600 dark:text-amber-400">$3,420,000</td>
                    <td className="p-3 text-amber-600 dark:text-amber-400">$3,235,833</td>
                    <td className="p-3 text-amber-600 dark:text-amber-400">$3,051,667</td>
                    <td className="p-3 text-amber-600 dark:text-amber-400">$4,867,500</td>
                    <td className="p-3 text-amber-600 dark:text-amber-400">$4,683,333</td>
                    <td className="p-3 text-amber-600 dark:text-amber-400">$4,499,167</td>
                    <td className="p-3 text-amber-600 dark:text-amber-400">$4,315,000</td>
                    <td className="p-3 text-amber-600 dark:text-amber-400">$4,315,000</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: REAL-TIME SAAS METRICS & WATERFALLS */}
      {activeTab === 'saasMetrics' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              Real-Time SaaS Metrics & ARR Movement Waterfall
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Live subscription intelligence computed directly from the General Ledger and ASC 606 revenue subledgers
            </p>
          </div>

          {/* ARR Waterfall visual cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3">
            <div className="p-3.5 bg-slate-900 text-white rounded-xl shadow-sm border border-slate-800">
              <span className="text-[11px] text-slate-400 block font-medium">Starting ARR</span>
              <span className="text-base font-bold block mt-1">{fmtUsd(rilletSaaSMetrics.startingArr)}</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Beginning of Year</span>
            </div>

            <div className="p-3.5 bg-emerald-900/30 text-emerald-300 rounded-xl shadow-sm border border-emerald-700/40">
              <span className="text-[11px] text-emerald-400 block font-medium">(+) New Bookings</span>
              <span className="text-base font-bold block mt-1">+{fmtUsd(rilletSaaSMetrics.newBookingsArr)}</span>
              <span className="text-[10px] text-emerald-400/80 block mt-0.5">New Logos Added</span>
            </div>

            <div className="p-3.5 bg-indigo-900/30 text-indigo-300 rounded-xl shadow-sm border border-indigo-700/40">
              <span className="text-[11px] text-indigo-400 block font-medium">(+) Expansion ARR</span>
              <span className="text-base font-bold block mt-1">+{fmtUsd(rilletSaaSMetrics.expansionArr)}</span>
              <span className="text-[10px] text-indigo-400/80 block mt-0.5">Seat & Tier Upgrades</span>
            </div>

            <div className="p-3.5 bg-amber-900/30 text-amber-300 rounded-xl shadow-sm border border-amber-700/40">
              <span className="text-[11px] text-amber-400 block font-medium">(-) Contraction</span>
              <span className="text-base font-bold block mt-1">{fmtUsd(rilletSaaSMetrics.contractionArr)}</span>
              <span className="text-[10px] text-amber-400/80 block mt-0.5">Downgrades</span>
            </div>

            <div className="p-3.5 bg-rose-900/30 text-rose-300 rounded-xl shadow-sm border border-rose-700/40">
              <span className="text-[11px] text-rose-400 block font-medium">(-) Churn ARR</span>
              <span className="text-base font-bold block mt-1">{fmtUsd(rilletSaaSMetrics.churnedArr)}</span>
              <span className="text-[10px] text-rose-400/80 block mt-0.5">3.8% Gross Churn</span>
            </div>

            <div className="p-3.5 bg-cyan-900/30 text-cyan-300 rounded-xl shadow-sm border border-cyan-700/40">
              <span className="text-[11px] text-cyan-400 block font-medium">(=) Net New ARR</span>
              <span className="text-base font-bold block mt-1">+{fmtUsd(rilletSaaSMetrics.netNewArr)}</span>
              <span className="text-[10px] text-cyan-400/80 block mt-0.5">Net Velocity</span>
            </div>

            <div className="p-3.5 bg-indigo-600 text-white rounded-xl shadow-md border border-indigo-500">
              <span className="text-[11px] text-indigo-200 block font-medium">Ending ARR</span>
              <span className="text-base font-black block mt-1">{fmtUsd(rilletSaaSMetrics.endingArr)}</span>
              <span className="text-[10px] text-indigo-200 block mt-0.5">$1.238M MRR</span>
            </div>
          </div>

          {/* Efficiency & Unit Economics Matrix */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>Net Revenue Retention (NRR)</span>
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 text-[10px] rounded font-semibold">
                  Excellent
                </span>
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-white">
                {rilletSaaSMetrics.netRevenueRetentionPct}%
              </div>
              <p className="text-xs text-slate-400">Includes expansion, contractions, and churn within existing customer cohorts</p>
            </div>

            <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>CAC Payback Period</span>
                <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300 text-[10px] rounded font-semibold">
                  &lt; 12 Months
                </span>
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-white">
                {rilletSaaSMetrics.cacPaybackMonths} Months
              </div>
              <p className="text-xs text-slate-400">Sales & Marketing spend recovered via gross margin subscription profits</p>
            </div>

            <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>LTV / CAC Ratio</span>
                <span className="px-2 py-0.5 bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300 text-[10px] rounded font-semibold">
                  High ROI
                </span>
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-white">
                {rilletSaaSMetrics.ltvToCacRatio}x
              </div>
              <p className="text-xs text-slate-400">Customer Lifetime Value compared against blended acquisition cost</p>
            </div>

            <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>SaaS Magic Number</span>
                <span className="px-2 py-0.5 bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 text-[10px] rounded font-semibold">
                  &gt; 1.0 (Scale)
                </span>
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-white">
                {rilletSaaSMetrics.magicNumber}
              </div>
              <p className="text-xs text-slate-400">Quarterly Net New ARR annualized divided by prior quarter S&M spend</p>
            </div>
          </div>

          {/* Cohort Expansion Trajectory Matrix */}
          <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Customer Cohort Net Retention & Expansion Heatmap
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-center text-xs">
                <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 text-[11px]">
                  <tr>
                    <th className="text-left p-3">Signup Cohort</th>
                    <th className="p-3">Initial ARR</th>
                    <th className="p-3">Month 3</th>
                    <th className="p-3">Month 6</th>
                    <th className="p-3">Month 9</th>
                    <th className="p-3">Month 12</th>
                    <th className="p-3">Month 18</th>
                    <th className="p-3 font-bold text-emerald-600 dark:text-emerald-400">Current NRR</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                  <tr>
                    <td className="text-left p-3 font-semibold text-slate-900 dark:text-white">2025 Q1 Cohort</td>
                    <td className="p-3">$2,100,000</td>
                    <td className="p-3 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 font-medium">102%</td>
                    <td className="p-3 bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 font-medium">114%</td>
                    <td className="p-3 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-semibold">122%</td>
                    <td className="p-3 bg-emerald-200 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-200 font-bold">131%</td>
                    <td className="p-3 bg-emerald-300 dark:bg-emerald-900/80 text-emerald-900 dark:text-emerald-100 font-black">142%</td>
                    <td className="p-3 font-black text-emerald-600 dark:text-emerald-400">142.0%</td>
                  </tr>
                  <tr>
                    <td className="text-left p-3 font-semibold text-slate-900 dark:text-white">2025 Q3 Cohort</td>
                    <td className="p-3">$3,400,000</td>
                    <td className="p-3 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 font-medium">101%</td>
                    <td className="p-3 bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 font-medium">109%</td>
                    <td className="p-3 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-semibold">118%</td>
                    <td className="p-3 bg-emerald-200 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-200 font-bold">128%</td>
                    <td className="p-3 text-slate-400">-</td>
                    <td className="p-3 font-black text-emerald-600 dark:text-emerald-400">128.4%</td>
                  </tr>
                  <tr>
                    <td className="text-left p-3 font-semibold text-slate-900 dark:text-white">2026 Q1 Cohort</td>
                    <td className="p-3">$4,200,000</td>
                    <td className="p-3 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 font-medium">103%</td>
                    <td className="p-3 bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 font-medium">112%</td>
                    <td className="p-3 text-slate-400">-</td>
                    <td className="p-3 text-slate-400">-</td>
                    <td className="p-3 text-slate-400">-</td>
                    <td className="p-3 font-black text-emerald-600 dark:text-emerald-400">112.0%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: AI ZERO-TOUCH BANK & GATEWAY RECONCILIATION */}
      {activeTab === 'bankFeeds' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                AI Zero-Touch Bank & Payment Gateway Reconciliation
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Autonomous ledger matching engine across SVB, Mercury, Brex Treasury, and Stripe net settlements with $0.00 unallocated variance
              </p>
            </div>

            <button
              onClick={handleAutoMatchBankFeed}
              className="px-4 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors flex items-center gap-2 shadow-sm"
            >
              <svg className="w-4 h-4 text-indigo-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Auto-Reconcile All High-Confidence Feeds
            </button>
          </div>

          {/* Live Feed Table */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                Connected Real-Time Bank & Gateway Feeds
                <span className="px-2 py-0.5 text-xs bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 rounded font-medium">
                  {rilletBankTransactions.length} Transactions
                </span>
              </span>
              <span className="text-xs text-slate-500">Zero-Touch Auto-Classification</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
                <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="px-4 py-3">Bank Source & Date</th>
                    <th className="px-4 py-3">Raw Memo & Counterparty</th>
                    <th className="px-4 py-3 text-right">Amount</th>
                    <th className="px-4 py-3">AI Confidence & Match Rule</th>
                    <th className="px-4 py-3">Suggested GL Posting</th>
                    <th className="px-4 py-3 text-center">Status</th>
                    <th className="px-4 py-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                  {rilletBankTransactions.map(tx => (
                    <tr key={tx.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-750 transition-colors">
                      <td className="px-4 py-3">
                        <div className="font-semibold text-slate-900 dark:text-white">{tx.bankAccount}</div>
                        <div className="text-[11px] text-slate-400">{tx.date}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-slate-800 dark:text-slate-200">{tx.counterparty}</div>
                        <div className="text-[11px] text-slate-400 truncate max-w-xs">{tx.rawDescription}</div>
                      </td>
                      <td className="px-4 py-3 text-right font-bold">
                        <span className={tx.direction === 'INFLOW' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'}>
                          {tx.direction === 'INFLOW' ? '+' : '-'}{fmtUsdExact(tx.amount)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5 font-bold text-indigo-600 dark:text-indigo-400">
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                          {tx.aiConfidencePct}% Confidence
                        </div>
                        <div className="text-[11px] text-slate-400 max-w-xs">{tx.aiMatchingRule}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-medium text-slate-900 dark:text-white">{tx.suggestedAccountCode} - {tx.suggestedAccountName}</span>
                        {tx.matchedDocumentRef && (
                          <div className="text-[11px] text-slate-400">Ref: {tx.matchedDocumentRef}</div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            tx.aiMatchStatus === 'AUTO_MATCHED' || tx.aiMatchStatus === 'CONFIRMED'
                              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                              : tx.aiMatchStatus === 'SPLIT_PROPOSED'
                              ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300'
                              : 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
                          }`}
                        >
                          {tx.aiMatchStatus.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        {tx.aiMatchStatus !== 'CONFIRMED' ? (
                          <button
                            onClick={() => handleConfirmBankMatch(tx.id)}
                            className="px-2.5 py-1 text-[11px] font-semibold bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-900/30 dark:hover:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded transition-colors"
                          >
                            Approve Match
                          </button>
                        ) : (
                          <span className="text-[11px] text-slate-400 font-medium">Reconciled</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: AI MONTH-END CLOSE & FLUX VARIANCE ANALYSIS */}
      {activeTab === 'closeFlux' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                AI Automated Month-End Close & Flux Analysis
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Zero-friction close checklist with cryptographic accounting period hard-locking and AI-generated variance explanations
              </p>
            </div>

            <button
              onClick={handlePeriodHardLock}
              className="px-4 py-2 text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white rounded-lg transition-colors flex items-center gap-2 shadow-sm"
            >
              <svg className="w-4 h-4 text-rose-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Apply Accounting Period Hard-Lock
            </button>
          </div>

          {/* Close Checklist */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                Month-End Close Sequential Checklist & Verification Status
              </h3>
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                {closeProgressPct}% Ready for Audit Lock
              </span>
            </div>

            <div className="space-y-2.5">
              {rilletCloseChecklist.map(task => {
                const isDone = task.status === 'COMPLETED';

                return (
                  <div
                    key={task.id}
                    className={`p-3.5 rounded-xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-3 ${
                      isDone
                        ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/40'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <button
                        onClick={() => handleToggleCloseChecklist(task.id)}
                        className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center border transition-all ${
                          isDone
                            ? 'bg-emerald-500 border-emerald-600 text-white'
                            : 'border-slate-300 dark:border-slate-600 hover:border-indigo-500'
                        }`}
                      >
                        {isDone && (
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </button>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900 dark:text-white">
                            {task.order}. {task.taskName}
                          </span>
                          <span className="px-2 py-0.5 text-[10px] bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded font-medium">
                            {task.category}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{task.description}</p>
                        <p className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium mt-1">
                          {task.aiValidationMessage}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-right">
                      <div>
                        <span className="text-[11px] text-slate-400 block">Owner: {task.owner}</span>
                        {task.completedAt && (
                          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                            Signed off: {task.signedOffBy}
                          </span>
                        )}
                      </div>
                      <span
                        className={`px-2.5 py-1 text-[11px] rounded-lg font-bold ${
                          isDone
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300'
                            : 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300'
                        }`}
                      >
                        {task.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* AI General Ledger Flux & Anomaly Analysis */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-5 space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Month-over-Month (MoM) Flux Analysis & AI Narrative Explanations
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Automated root cause identification for every material line item variance with 1-click auditor sign-off
              </p>
            </div>

            <div className="space-y-3">
              {rilletFluxAnalysis.map(flux => (
                <div
                  key={flux.id}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/40 space-y-2"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        GL {flux.accountCode} - {flux.accountName}
                      </span>
                      <span className="px-2 py-0.5 text-[10px] bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded font-medium">
                        {flux.category}
                      </span>
                      <span
                        className={`px-2 py-0.5 text-[10px] rounded font-bold ${
                          flux.anomalyScore === 'Normal'
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                            : flux.anomalyScore === 'Medium Alert'
                            ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
                            : 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300'
                        }`}
                      >
                        {flux.anomalyScore}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right text-xs">
                        <span className="text-slate-400 block text-[11px]">
                          Prior: {fmtUsd(flux.priorMonthBalance)} $\to$ Current: {fmtUsd(flux.currentMonthBalance)}
                        </span>
                        <span className="font-bold text-slate-900 dark:text-white">
                          +{fmtUsd(flux.varianceAmount)} ({flux.variancePercentage > 0 ? '+' : ''}{flux.variancePercentage}%)
                        </span>
                      </div>

                      {!flux.auditorSignoff ? (
                        <button
                          onClick={() => handleSignoffFluxItem(flux.id)}
                          className="px-2.5 py-1 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded transition-colors"
                        >
                          Sign Off Flux
                        </button>
                      ) : (
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 text-[10px] rounded font-bold">
                          ✓ Auditor Approved
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-3 bg-indigo-50/60 dark:bg-indigo-950/30 rounded-lg border border-indigo-100 dark:border-indigo-900/40 text-xs text-indigo-900 dark:text-indigo-200">
                    <span className="font-bold text-indigo-700 dark:text-indigo-300 block mb-0.5 flex items-center gap-1.5">
                      <AiIcon />
                      AI Autonomous Flux Explanation:
                    </span>
                    {flux.aiGeneratedExplanation}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: PREPAID EXPENSE AMORTIZATION */}
      {activeTab === 'prepaids' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                Prepaid Expenses & Automated Amortization Schedules
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Track annual SaaS software, multi-year cloud commitments (AWS/GCP), and corporate insurance policies with 1-click amortization journal creation
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleRunPrepaidAmortization}
                className="px-3.5 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <svg className="w-4 h-4 text-emerald-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Post Monthly Amortization
              </button>

              <button
                onClick={() => setShowNewPrepaidModal(true)}
                className="px-3.5 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                New Prepaid Asset
              </button>
            </div>
          </div>

          {/* Prepaid Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {rilletPrepaids.map(item => {
              const amortProgressPct = Math.round((item.accumulatedAmortization / item.totalPrepaidCost) * 100);

              return (
                <div
                  key={item.id}
                  className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">{item.vendorName}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{item.description}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                      {item.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 py-2 border-y border-slate-100 dark:border-slate-700 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[11px]">Total Cost</span>
                      <span className="font-bold text-slate-900 dark:text-white">{fmtUsd(item.totalPrepaidCost)}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Monthly Amort</span>
                      <span className="font-bold text-indigo-600 dark:text-indigo-400">{fmtUsd(item.monthlyAmortization)}/mo</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Remaining Book Value</span>
                      <span className="font-bold text-amber-600 dark:text-amber-400">{fmtUsd(item.remainingAssetBalance)}</span>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-slate-500">Amortization Progress ({item.totalMonths} months schedule)</span>
                      <span className="font-semibold text-slate-900 dark:text-white">{amortProgressPct}%</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                      <div className="bg-indigo-600 h-2 rounded-full transition-all" style={{ width: `${amortProgressPct}%` }}></div>
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-400 flex items-center justify-between">
                    <span>Expense GL: {item.expenseGlAccount}</span>
                    <span>Term: {item.startDate} to {item.endDate}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 6: ASK RILLET AI COPILOT */}
      {activeTab === 'copilot' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              Rillet AI Conversational Finance Copilot
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Query real-time revenue schedules, audit trails, unit economics, burn rate, and draft balanced GL journal entries in natural language
            </p>
          </div>

          {/* Copilot Input Box */}
          <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-indigo-200 dark:border-indigo-900/50 shadow-md space-y-4">
            <form onSubmit={handleAskCopilotSubmit} className="space-y-3">
              <div className="flex items-center gap-2">
                <select
                  value={copilotCategory}
                  onChange={(e) => setCopilotCategory(e.target.value as any)}
                  className="px-3 py-2 text-xs border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-medium"
                >
                  <option value="Revenue & ASC 606">Revenue & ASC 606</option>
                  <option value="SaaS Metrics">SaaS Metrics & ARR</option>
                  <option value="Burn & Runway">Burn & Runway</option>
                  <option value="Anomalies & Flux">Anomalies & Flux</option>
                  <option value="Audit Trail">Audit Trail & Traceability</option>
                </select>

                <input
                  type="text"
                  value={copilotQuestion}
                  onChange={(e) => setCopilotQuestion(e.target.value)}
                  placeholder="Ask Rillet AI: e.g. 'What is our current ARR and CAC Payback?', 'Why did AWS compute spike in August?'"
                  className="flex-1 px-4 py-2.5 text-xs border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />

                <button
                  type="submit"
                  className="px-4 py-2.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  <AiIcon />
                  Query Engine
                </button>
              </div>

              {/* Sample Prompts */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-[11px] text-slate-400 font-medium">Quick Prompts:</span>
                <button
                  type="button"
                  onClick={() => setCopilotQuestion('What is our current ARR and when do we cross $20M based on active pipeline & NRR?')}
                  className="px-2.5 py-1 text-[11px] bg-slate-100 dark:bg-slate-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 text-slate-600 dark:text-slate-300 rounded-full transition-colors"
                >
                  📈 ARR & $20M Milestone Target
                </button>
                <button
                  type="button"
                  onClick={() => setCopilotQuestion('Explain why Cloud Infrastructure COGS spiked by 35.7% in August')}
                  className="px-2.5 py-1 text-[11px] bg-slate-100 dark:bg-slate-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 text-slate-600 dark:text-slate-300 rounded-full transition-colors"
                >
                  🔍 Explain August AWS COGS Spike
                </button>
                <button
                  type="button"
                  onClick={() => setCopilotQuestion('How much deferred revenue is on our balance sheet and what is the 12-month recognition waterfall?')}
                  className="px-2.5 py-1 text-[11px] bg-slate-100 dark:bg-slate-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 text-slate-600 dark:text-slate-300 rounded-full transition-colors"
                >
                  💧 12-Month Deferred Revenue Waterfall
                </button>
              </div>
            </form>
          </div>

          {/* Copilot Query History & Responses */}
          <div className="space-y-3">
            {rilletAiQueries.map(log => (
              <div
                key={log.id}
                className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 text-[10px] bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300 rounded font-semibold">
                      {log.category}
                    </span>
                    <span className="text-[11px] text-slate-400">{log.timestamp}</span>
                  </div>
                  <span className="text-[11px] text-slate-400">Ref: {log.relatedDataRef}</span>
                </div>

                <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                  Q: {log.question}
                </div>

                <div className="p-3.5 bg-indigo-50/50 dark:bg-indigo-950/30 rounded-xl border border-indigo-100 dark:border-indigo-900/40 text-xs text-slate-700 dark:text-slate-200 leading-relaxed space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-indigo-600 dark:text-indigo-400 text-[11px]">
                    <AiIcon />
                    Rillet Autonomous Ledger Analysis:
                  </div>
                  <p>{log.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL 1: NEW CUSTOMER CONTRACT / ORDER FORM */}
      {showNewContractModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-700 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Create ASC 606 Customer Contract</h3>
              <button
                onClick={() => setShowNewContractModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateContractSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-medium mb-1">Contract Number</label>
                <input
                  type="text"
                  value={newContractNumber}
                  onChange={(e) => setNewContractNumber(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-medium mb-1">Customer / Debtor Legal Name</label>
                <input
                  type="text"
                  placeholder="e.g. Anthropic AI Research Corp"
                  value={newCustomerName}
                  onChange={(e) => setNewCustomerName(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 font-medium mb-1">Annual Contract Value (ARR USD)</label>
                  <input
                    type="number"
                    value={newArr}
                    onChange={(e) => {
                      setNewArr(Number(e.target.value));
                      setNewTcv(Number(e.target.value) * 3);
                    }}
                    className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-300 font-medium mb-1">Total Contract Value (TCV USD)</label>
                  <input
                    type="number"
                    value={newTcv}
                    onChange={(e) => setNewTcv(Number(e.target.value))}
                    className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 font-medium mb-1">Customer Tier</label>
                  <select
                    value={newCustomerTier}
                    onChange={(e) => setNewCustomerTier(e.target.value as any)}
                    className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                  >
                    <option value="Enterprise">Enterprise</option>
                    <option value="Growth">Growth</option>
                    <option value="Strategic Scale">Strategic Scale</option>
                    <option value="Startup">Startup</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-300 font-medium mb-1">Billing Frequency</label>
                  <select
                    value={newBillingFreq}
                    onChange={(e) => setNewBillingFreq(e.target.value as any)}
                    className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                  >
                    <option value="Annual Upfront">Annual Upfront</option>
                    <option value="Quarterly">Quarterly</option>
                    <option value="Monthly">Monthly</option>
                    <option value="Multi-Year Prepaid">Multi-Year Prepaid</option>
                    <option value="Usage-Metered">Usage-Metered</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 font-medium mb-1">Start Date</label>
                  <input
                    type="date"
                    value={newStartDate}
                    onChange={(e) => setNewStartDate(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-300 font-medium mb-1">End Date</label>
                  <input
                    type="date"
                    value={newEndDate}
                    onChange={(e) => setNewEndDate(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                    required
                  />
                </div>
              </div>

              <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 rounded-lg text-[11px] text-indigo-700 dark:text-indigo-300">
                ⚡ Automatically generates 80% Software Subscription (Ratable Daily RevRec) and 20% Implementation Setup (Milestone RevRec) with ASC 606 relative standalone selling price allocation.
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewContractModal(false)}
                  className="px-3.5 py-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-semibold shadow-sm"
                >
                  Save & Generate Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: NEW PREPAID ASSET */}
      {showNewPrepaidModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-700 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">New Prepaid Expense Schedule</h3>
              <button
                onClick={() => setShowNewPrepaidModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreatePrepaidSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-medium mb-1">Vendor Name</label>
                <input
                  type="text"
                  placeholder="e.g. Google Cloud Platform"
                  value={newPrepaidVendor}
                  onChange={(e) => setNewPrepaidVendor(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-medium mb-1">Description / Plan</label>
                <input
                  type="text"
                  placeholder="e.g. 1-Year Committed Use Discount (CUD)"
                  value={newPrepaidDesc}
                  onChange={(e) => setNewPrepaidDesc(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 font-medium mb-1">Total Prepaid Amount ($)</label>
                  <input
                    type="number"
                    value={newPrepaidCost}
                    onChange={(e) => setNewPrepaidCost(Number(e.target.value))}
                    className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-300 font-medium mb-1">Term (Months)</label>
                  <input
                    type="number"
                    value={newPrepaidMonths}
                    onChange={(e) => setNewPrepaidMonths(Number(e.target.value))}
                    className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-medium mb-1">Expense GL Account</label>
                <select
                  value={newPrepaidGl}
                  onChange={(e) => setNewPrepaidGl(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                >
                  <option value="5100 - Hosting & Cloud Infrastructure">5100 - Hosting & Cloud Infrastructure</option>
                  <option value="6100 - Sales & Marketing Software Tools">6100 - Sales & Marketing Software Tools</option>
                  <option value="5120 - Engineering Tooling & APM">5120 - Engineering Tooling & APM</option>
                  <option value="6400 - Corporate Insurance & Risk">6400 - Corporate Insurance & Risk</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewPrepaidModal(false)}
                  className="px-3.5 py-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-semibold shadow-sm"
                >
                  Add Prepaid Asset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: AI CONTRACT INGESTION / OCR SIMULATOR */}
      {showAiIngestModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-700 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <AiIcon />
                AI Autonomous Contract Ingestion & OCR
              </h3>
              <button
                onClick={() => setShowAiIngestModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Select an enterprise PDF Order Form to simulate Rillet AI's instant contract parsing, Standalone Selling Price allocation, and automated waterfall creation:
            </p>

            <div className="space-y-2.5">
              <div
                onClick={() => handleAiContractExtractionSimulation('Anthropic AI Labs UK', 2100000, 6300000)}
                className="p-3.5 rounded-xl border border-indigo-200 dark:border-indigo-900/50 hover:bg-indigo-50/70 dark:hover:bg-indigo-950/40 cursor-pointer transition-all flex items-center justify-between"
              >
                <div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white block">
                    📄 Anthropic_Claude_Enterprise_Agreement.pdf
                  </span>
                  <span className="text-[11px] text-slate-400">3-Year Multi-Element • $2.1M ARR • Annual Upfront</span>
                </div>
                <span className="px-2.5 py-1 bg-indigo-600 text-white rounded text-[11px] font-semibold">
                  Ingest & Parse
                </span>
              </div>

              <div
                onClick={() => handleAiContractExtractionSimulation('Snowflake Cloud Analytics Ltd', 1450000, 2900000)}
                className="p-3.5 rounded-xl border border-indigo-200 dark:border-indigo-900/50 hover:bg-indigo-50/70 dark:hover:bg-indigo-950/40 cursor-pointer transition-all flex items-center justify-between"
              >
                <div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white block">
                    📄 Snowflake_Data_Warehouse_SaaS_2026.pdf
                  </span>
                  <span className="text-[11px] text-slate-400">2-Year Strategic • $1.45M ARR • Quarterly Invoicing</span>
                </div>
                <span className="px-2.5 py-1 bg-indigo-600 text-white rounded text-[11px] font-semibold">
                  Ingest & Parse
                </span>
              </div>

              <div
                onClick={() => handleAiContractExtractionSimulation('Figma Collaboration Suite Inc', 850000, 1700000)}
                className="p-3.5 rounded-xl border border-indigo-200 dark:border-indigo-900/50 hover:bg-indigo-50/70 dark:hover:bg-indigo-950/40 cursor-pointer transition-all flex items-center justify-between"
              >
                <div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white block">
                    📄 Figma_Enterprise_Seat_Expansion_Order.pdf
                  </span>
                  <span className="text-[11px] text-slate-400">Growth Tier • $850k ARR • Annual Upfront</span>
                </div>
                <span className="px-2.5 py-1 bg-indigo-600 text-white rounded text-[11px] font-semibold">
                  Ingest & Parse
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end pt-2">
              <button
                type="button"
                onClick={() => setShowAiIngestModal(false)}
                className="px-3.5 py-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 font-medium text-xs"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RilletAi;
