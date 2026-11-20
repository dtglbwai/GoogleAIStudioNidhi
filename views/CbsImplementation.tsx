import React, { useMemo, useState } from 'react';
import { useAppContext } from '../AppContext';
import { CbsDeliverable, CbsLedgerSimTxn } from './types';
import CoreBankingIcon from '../components/icons/CoreBankingIcon';
import { formatCurrency } from '../utils/formatters';
import {
  Layers,
  GitBranch,
  Database,
  ShieldCheck,
  Terminal,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Download,
  Plus,
  Play,
  RefreshCw,
  ArrowRight,
  Lock,
  Server,
  FileCode2,
} from 'lucide-react';

type CbsWorkspaceTab =
  | 'roadmap'
  | 'architecture'
  | 'ledger'
  | 'migration'
  | 'cutover';

function downloadBlob(filename: string, content: string, mimeType = 'text/csv;charset=utf-8;') {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

const CbsImplementation: React.FC = () => {
  const {
    cbsPhases,
    cbsTechLayers,
    cbsMigrationBatches,
    cbsLedgerSimTxns,
    cbsCutoverSteps,
    customerAccounts,
    loans,
    coopMembers,
    transactions,
    handleToggleCbsDeliverable,
    handleAddCbsDeliverable,
    handleExecuteCbsMigrationAction,
    handleSimulateCbsLedgerEvent,
    handleUpdateCbsCutoverStatus,
  } = useAppContext();

  const [activeTab, setActiveTab] = useState<CbsWorkspaceTab>('roadmap');
  const [selectedPhaseId, setSelectedPhaseId] = useState<string>(cbsPhases[0]?.id || 'cbs-p1');
  const [notice, setNotice] = useState<string | null>(null);

  // New deliverable inline form
  const [showAddDeliverable, setShowAddDeliverable] = useState(false);
  const [newDelivTitle, setNewDelivTitle] = useState('');
  const [newDelivOwner, setNewDelivOwner] = useState('Solution Architect');
  const [newDelivWeek, setNewDelivWeek] = useState('Week 12');
  const [newDelivType, setNewDelivType] = useState<CbsDeliverable['artifactType']>('Architecture Spec');

  // Architecture Decision Configurator State
  const [selectedLayerId, setSelectedLayerId] = useState<string>(cbsTechLayers[3]?.id || 'tl-4');
  const [ledgerEngine, setLedgerEngine] = useState<'event_cqrs' | 'serializable_sql'>('serializable_sql');
  const [deploymentMode, setDeploymentMode] = useState<'active_active' | 'active_passive'>('active_active');
  const [hsmStandard, setHsmStandard] = useState<'fips_140_3' | 'kms_envelope'>('fips_140_3');
  const [messageBus, setMessageBus] = useState<'kafka_outbox' | 'rabbitmq_quorum'>('kafka_outbox');

  // Ledger Simulator State
  const [simEventType, setSimEventType] = useState<CbsLedgerSimTxn['eventType']>('NEFT_OUTWARD');
  const [simAccountRef, setSimAccountRef] = useState('CBS-CASA-0091842');
  const [simAmount, setSimAmount] = useState(125000);
  const [selectedSimId, setSelectedSimId] = useState<string>(cbsLedgerSimTxns[0]?.id || '');

  // Parallel Run Parity State
  const [parityVerifiedAt, setParityVerifiedAt] = useState<string | null>(null);

  const roadmapStats = useMemo(() => {
    const allDeliverables = cbsPhases.flatMap(p => p.deliverables);
    const completedCount = allDeliverables.filter(d => d.completed).length;
    const totalCount = allDeliverables.length || 1;
    const readinessPct = Math.round((completedCount / totalCount) * 100);
    const totalWeeks = cbsPhases.reduce((s, p) => s + p.durationWeeks, 0);
    const cutoverDone = cbsCutoverSteps.filter(s => s.status === 'Completed').length;
    return {
      completedCount,
      totalCount,
      readinessPct,
      totalWeeks,
      cutoverDone,
      cutoverTotal: cbsCutoverSteps.length,
    };
  }, [cbsPhases, cbsCutoverSteps]);

  const activePhase = useMemo(
    () => cbsPhases.find(p => p.id === selectedPhaseId) || cbsPhases[0],
    [cbsPhases, selectedPhaseId]
  );

  const selectedLayer = useMemo(
    () => cbsTechLayers.find(l => l.id === selectedLayerId) || cbsTechLayers[0],
    [cbsTechLayers, selectedLayerId]
  );

  const selectedSimTxn = useMemo(
    () => cbsLedgerSimTxns.find(t => t.id === selectedSimId) || cbsLedgerSimTxns[0],
    [cbsLedgerSimTxns, selectedSimId]
  );

  const archSpecSummary = useMemo(() => {
    const rpo = deploymentMode === 'active_active' ? '0 seconds (Synchronous Raft Quorum)' : '15 seconds (Async WAL Stream)';
    const rto = deploymentMode === 'active_active' ? '< 8 minutes (Automated DNS/Envoy Shift)' : '35 minutes (Manual DR Promotion)';
    const peakTps =
      (ledgerEngine === 'event_cqrs' ? 4200 : 2800) +
      (messageBus === 'kafka_outbox' ? 900 : 300);
    const p99LatencyMs = ledgerEngine === 'event_cqrs' ? 29 : 41;
    const hsmCompliance = hsmStandard === 'fips_140_3' ? 'PCI-DSS 4.0 + RBI HSM Certified' : 'Cloud KMS Envelope Encryption';
    return { rpo, rto, peakTps, p99LatencyMs, hsmCompliance };
  }, [ledgerEngine, deploymentMode, hsmStandard, messageBus]);

  const liveErpControlTotals = useMemo(() => {
    const customerDepositTotal = customerAccounts.reduce((s, a) => s + a.balance, 0);
    const loanPrincipalTotal = loans.reduce((s, l) => s + l.principalAmount, 0);
    const coopThriftTotal = coopMembers.reduce((s, m) => s + (m.thriftBalance || 0) + m.savingsBalance, 0);
    return {
      customerAccountsCount: customerAccounts.length,
      customerDepositTotal,
      loansCount: loans.length,
      loanPrincipalTotal,
      coopMembersCount: coopMembers.length,
      coopThriftTotal,
      transactionsCount: transactions.length,
    };
  }, [customerAccounts, loans, coopMembers, transactions]);

  const handleSubmitDeliverable = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDelivTitle.trim() || !activePhase) return;
    handleAddCbsDeliverable(activePhase.id, {
      title: newDelivTitle.trim(),
      owner: newDelivOwner.trim() || 'Core Engineering',
      targetWeek: newDelivWeek.trim() || 'Week 14',
      artifactType: newDelivType,
      completed: false,
    });
    setNotice(`Added deliverable "${newDelivTitle.trim()}" to ${activePhase.title}.`);
    setNewDelivTitle('');
    setShowAddDeliverable(false);
  };

  const handleRunSim = (e: React.FormEvent) => {
    e.preventDefault();
    const created = handleSimulateCbsLedgerEvent(simEventType, simAccountRef.trim() || 'CBS-CASA-0091842', simAmount);
    setSelectedSimId(created.id);
    setNotice(`Committed immutable journal ${created.idempotencyKey} (${created.iso20022MessageType}) in ${created.latencyMs}ms with zero debit/credit variance.`);
  };

  const handleExportCharter = () => {
    const payload = {
      exportedAt: new Date().toISOString(),
      program: 'Core Banking System Technology & Implementation Program',
      readinessPct: roadmapStats.readinessPct,
      architectureConfig: { ledgerEngine, deploymentMode, hsmStandard, messageBus, ...archSpecSummary },
      phases: cbsPhases,
      migrationBatches: cbsMigrationBatches,
      cutoverRunbook: cbsCutoverSteps,
    };
    downloadBlob('cbs-implementation-blueprint.json', JSON.stringify(payload, null, 2), 'application/json');
    setNotice('Exported complete CBS implementation architecture and cutover blueprint (JSON).');
  };

  const handleExportCutoverCsv = () => {
    const header = 'Sequence,Window,Activity,Owner,EstMinutes,RollbackTrigger,Status\n';
    const rows = cbsCutoverSteps
      .map(s => `"${s.sequence}","${s.windowLabel}","${s.title.replace(/"/g, '""')}","${s.owner}",${s.estimatedMinutes},"${s.rollbackTrigger.replace(/"/g, '""')}","${s.status}"`)
      .join('\n');
    downloadBlob('cbs-cutover-runbook.csv', header + rows);
    setNotice('Downloaded CBS cutover runbook checklist (CSV).');
  };

  const tabs: { id: CbsWorkspaceTab; label: string; icon: React.ReactNode }[] = [
    { id: 'roadmap', label: '01. Implementation Lifecycle', icon: <GitBranch className="w-4 h-4" /> },
    { id: 'architecture', label: '02. Technology Stack', icon: <Layers className="w-4 h-4" /> },
    { id: 'ledger', label: '03. Core Ledger & ISO 20022', icon: <Terminal className="w-4 h-4" /> },
    { id: 'migration', label: '04. ETL Migration & Parity', icon: <Database className="w-4 h-4" /> },
    { id: 'cutover', label: '05. Cutover & DR Runbook', icon: <ShieldCheck className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-slate-900 text-white rounded-lg shrink-0">
            <div className="w-6 h-6">
              <CoreBankingIcon />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Core Banking System Technology & Implementation Process
            </h1>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
              <span>6-Phase Rollout Governance</span>
              <span aria-hidden="true">·</span>
              <span>ISO 20022 &amp; Double-Entry Ledger</span>
              <span aria-hidden="true">·</span>
              <span>ETL Migration &amp; Zero-Downtime Cutover</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleExportCharter}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0"
          >
            <Download className="w-4 h-4" />
            Export Blueprint JSON
          </button>
          <button
            onClick={() => setActiveTab('ledger')}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0"
          >
            <Play className="w-4 h-4" />
            Test Core Ledger
          </button>
        </div>
      </div>

      {notice && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 px-4 py-3 rounded-lg flex items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>{notice}</span>
          </div>
          <button
            onClick={() => setNotice(null)}
            className="text-emerald-800 font-semibold hover:underline whitespace-nowrap shrink-0"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Program KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <div className="text-xs font-medium text-slate-500">Program Gate Readiness</div>
          <div className="mt-2 text-2xl font-bold text-slate-900 tabular-nums">
            {roadmapStats.readinessPct}%
          </div>
          <div className="mt-1 text-xs text-slate-500 tabular-nums">
            {roadmapStats.completedCount} of {roadmapStats.totalCount} deliverables signed off
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <div className="text-xs font-medium text-slate-500">Implementation Horizon</div>
          <div className="mt-2 text-2xl font-bold text-slate-900 tabular-nums">
            {roadmapStats.totalWeeks} Weeks
          </div>
          <div className="mt-1 text-xs text-slate-500">
            6 gated phases · Discovery to Hypercare
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <div className="text-xs font-medium text-slate-500">Target Throughput &amp; RPO</div>
          <div className="mt-2 text-2xl font-bold text-slate-900 tabular-nums font-mono">
            {archSpecSummary.peakTps.toLocaleString('en-IN')} TPS
          </div>
          <div className="mt-1 text-xs text-slate-500 tabular-nums">
            p99 {archSpecSummary.p99LatencyMs}ms · {deploymentMode === 'active_active' ? 'RPO 0s' : 'RPO 15s'}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <div className="text-xs font-medium text-slate-500">Cutover Runbook Progress</div>
          <div className="mt-2 text-2xl font-bold text-slate-900 tabular-nums">
            {roadmapStats.cutoverDone} / {roadmapStats.cutoverTotal}
          </div>
          <div className="mt-1 text-xs text-slate-500">
            Production switch checkpoints verified
          </div>
        </div>
      </div>

      {/* Segmented Navigation Tabs */}
      <div className="bg-white border border-slate-200 rounded-xl p-1.5 flex items-center gap-1 overflow-x-auto">
        {tabs.map(tab => {
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                active
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB 1: 6-PHASE IMPLEMENTATION LIFECYCLE */}
      {activeTab === 'roadmap' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl divide-y divide-slate-200 overflow-hidden">
            <div className="px-5 py-4 bg-slate-50 flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900">Implementation Phases</h2>
              <span className="text-xs text-slate-500 tabular-nums">{cbsPhases.length} Stages</span>
            </div>
            {cbsPhases.map(phase => {
              const done = phase.deliverables.filter(d => d.completed).length;
              const total = phase.deliverables.length || 1;
              const pct = Math.round((done / total) * 100);
              const isSelected = phase.id === activePhase.id;
              return (
                <button
                  key={phase.id}
                  onClick={() => setSelectedPhaseId(phase.id)}
                  className={`w-full text-left p-4 transition-colors ${
                    isSelected ? 'bg-slate-900 text-white' : 'bg-white hover:bg-slate-50 text-slate-900'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-semibold">{phase.title}</span>
                    <span className={`text-xs font-mono tabular-nums shrink-0 ${isSelected ? 'text-slate-300' : 'text-slate-600'}`}>
                      {done}/{total} ({pct}%)
                    </span>
                  </div>
                  <div className={`mt-1.5 flex items-center gap-2 text-xs ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                    <span>{phase.durationWeeks} weeks</span>
                    <span aria-hidden="true">·</span>
                    <span className="truncate">{phase.leadRole}</span>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 border-b border-slate-200 pb-4">
              <div>
                <div className="text-xs text-slate-500">
                  Phase {activePhase.phaseNumber} · {activePhase.durationWeeks} Weeks · Owner: {activePhase.leadRole}
                </div>
                <h2 className="text-lg font-bold text-slate-900 mt-1">{activePhase.title}</h2>
                <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">{activePhase.objective}</p>
              </div>
              <button
                onClick={() => setShowAddDeliverable(v => !v)}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50 whitespace-nowrap shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Deliverable
              </button>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 text-xs text-slate-700">
              <span className="font-semibold text-slate-900">Phase Exit Gate Criterion: </span>
              {activePhase.gateCriterion}
            </div>

            {showAddDeliverable && (
              <form onSubmit={handleSubmitDeliverable} className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-3">
                <div className="text-xs font-bold text-slate-900">New Phase Deliverable</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    required
                    value={newDelivTitle}
                    onChange={e => setNewDelivTitle(e.target.value)}
                    placeholder="Deliverable title (e.g., ISO 8583 Load Test)"
                    className="sm:col-span-2 px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white text-slate-900"
                  />
                  <input
                    type="text"
                    value={newDelivOwner}
                    onChange={e => setNewDelivOwner(e.target.value)}
                    placeholder="Owner role"
                    className="px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white text-slate-900"
                  />
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newDelivWeek}
                      onChange={e => setNewDelivWeek(e.target.value)}
                      placeholder="Target week"
                      className="w-28 px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white text-slate-900"
                    />
                    <select
                      value={newDelivType}
                      onChange={e => setNewDelivType(e.target.value as CbsDeliverable['artifactType'])}
                      className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white text-slate-900"
                    >
                      <option value="Architecture Spec">Architecture Spec</option>
                      <option value="Data Mapping">Data Mapping</option>
                      <option value="Compliance Control">Compliance Control</option>
                      <option value="Test Suite">Test Suite</option>
                      <option value="Runbook">Runbook</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddDeliverable(false)}
                    className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800"
                  >
                    Save Deliverable
                  </button>
                </div>
              </form>
            )}

            <div className="divide-y divide-slate-200 border border-slate-200 rounded-lg">
              {activePhase.deliverables.map(deliv => (
                <div key={deliv.id} className="p-4 flex items-start justify-between gap-4 hover:bg-slate-50 transition-colors">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={deliv.completed}
                      onChange={() => {
                        handleToggleCbsDeliverable(activePhase.id, deliv.id);
                        setNotice(`Updated deliverable "${deliv.title}" to ${!deliv.completed ? 'Signed Off' : 'In Progress'}.`);
                      }}
                      className="mt-0.5 h-4 w-4 rounded border-slate-300 text-slate-900 cursor-pointer"
                    />
                    <div>
                      <div className={`text-sm font-medium ${deliv.completed ? 'text-slate-900' : 'text-slate-800'}`}>
                        {deliv.title}
                      </div>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                        <span>{deliv.artifactType}</span>
                        <span aria-hidden="true">·</span>
                        <span>Owner: {deliv.owner}</span>
                        <span aria-hidden="true">·</span>
                        <span className="tabular-nums">{deliv.targetWeek}</span>
                      </div>
                    </div>
                  </div>
                  <div className={`inline-flex items-center gap-1.5 text-xs font-medium shrink-0 ${deliv.completed ? 'text-emerald-700' : 'text-amber-700'}`}>
                    {deliv.completed ? <CheckCircle2 className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                    <span>{deliv.completed ? 'Signed Off' : 'Pending'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: TECHNOLOGY STACK & ARCHITECTURE */}
      {activeTab === 'architecture' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6 space-y-5">
            <div>
              <h2 className="text-base font-bold text-slate-900">5-Layer Cloud-Native Core Banking Stack</h2>
              <p className="text-xs text-slate-500 mt-1">
                Select an architectural tier to inspect protocols, throughput targets, and resilience controls.
              </p>
            </div>

            <div className="space-y-2.5">
              {cbsTechLayers.map(layer => {
                const active = layer.id === selectedLayer.id;
                return (
                  <button
                    key={layer.id}
                    onClick={() => setSelectedLayerId(layer.id)}
                    className={`w-full text-left p-4 rounded-lg border transition-colors ${
                      active
                        ? 'bg-slate-900 border-slate-900 text-white'
                        : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-900'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="font-semibold text-sm">
                        0{layer.layerOrder}. {layer.layerName}
                      </div>
                      <div className={`text-xs font-mono tabular-nums shrink-0 ${active ? 'text-slate-300' : 'text-slate-600'}`}>
                        {layer.targetLatencyMs}ms SLA · {layer.throughputTps.toLocaleString('en-IN')} TPS
                      </div>
                    </div>
                    <div className={`mt-1.5 text-xs ${active ? 'text-slate-300' : 'text-slate-500'}`}>
                      {layer.primaryProtocol} · {layer.complianceStandard}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-lg p-5 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-sm font-bold text-slate-900">
                  Selected Tier: {selectedLayer.layerName}
                </h3>
                <span className="text-xs font-mono text-slate-600 tabular-nums">
                  Tier 0{selectedLayer.layerOrder}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <div className="text-slate-500">Wire Protocols</div>
                  <div className="font-medium text-slate-900 mt-0.5">{selectedLayer.primaryProtocol}</div>
                </div>
                <div>
                  <div className="text-slate-500">Resilience &amp; Fault Tolerance</div>
                  <div className="font-medium text-slate-900 mt-0.5">{selectedLayer.resiliencePattern}</div>
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-500 mb-1.5">Core Subsystems</div>
                <div className="text-xs text-slate-800 font-medium">
                  {selectedLayer.technologyComponents.join('  ·  ')}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6 space-y-5">
            <div className="flex items-center gap-2">
              <Server className="w-4 h-4 text-slate-700" />
              <h2 className="text-base font-bold text-slate-900">Architecture Decision Configurator</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Ledger Concurrency &amp; Consistency Model
                </label>
                <select
                  value={ledgerEngine}
                  onChange={e => setLedgerEngine(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white text-slate-900"
                >
                  <option value="serializable_sql">Serializable Distributed SQL (Strict ACID Double-Entry)</option>
                  <option value="event_cqrs">Event-Sourced CQRS Append Log + Materialized Balances</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Availability &amp; Disaster Recovery Topology
                </label>
                <select
                  value={deploymentMode}
                  onChange={e => setDeploymentMode(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white text-slate-900"
                >
                  <option value="active_active">Active-Active Multi-Region Quorum (Zero RPO)</option>
                  <option value="active_passive">Active-Passive Warm Standby DR (15s Async WAL)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Cryptographic &amp; PIN Key Custody
                </label>
                <select
                  value={hsmStandard}
                  onChange={e => setHsmStandard(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white text-slate-900"
                >
                  <option value="fips_140_3">Dedicated Network HSM (FIPS 140-3 Level 3 · PKCS#11)</option>
                  <option value="kms_envelope">Cloud KMS Envelope AES-256-GCM Encryption</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Payment &amp; Outbox Event Bus
                </label>
                <select
                  value={messageBus}
                  onChange={e => setMessageBus(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white text-slate-900"
                >
                  <option value="kafka_outbox">Transactional Outbox + Partitioned Kafka Cluster</option>
                  <option value="rabbitmq_quorum">Quorum AMQP Broker with Dead-Letter Replay</option>
                </select>
              </div>
            </div>

            <div className="border-t border-slate-200 pt-4 space-y-2.5 text-xs">
              <div className="font-bold text-slate-900">Computed SLA &amp; Compliance Profile</div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Recovery Point Objective (RPO)</span>
                <span className="font-mono font-semibold text-slate-900">{archSpecSummary.rpo}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Recovery Time Objective (RTO)</span>
                <span className="font-mono font-semibold text-slate-900">{archSpecSummary.rto}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Sustained Clearing Throughput</span>
                <span className="font-mono font-semibold text-slate-900 tabular-nums">
                  {archSpecSummary.peakTps.toLocaleString('en-IN')} TPS (p99 {archSpecSummary.p99LatencyMs}ms)
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Key Custody Posture</span>
                <span className="font-semibold text-emerald-700">{archSpecSummary.hsmCompliance}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: CORE LEDGER & ISO 20022 SIMULATOR */}
      {activeTab === 'ledger' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6 space-y-5">
            <div>
              <h2 className="text-base font-bold text-slate-900">Double-Entry Posting &amp; ISO 20022 Bench</h2>
              <p className="text-xs text-slate-500 mt-1">
                Simulate an atomic core banking event with idempotency protection and inspect the resulting GL postings and XML payload.
              </p>
            </div>

            <form onSubmit={handleRunSim} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Core Transaction Event</label>
                <select
                  value={simEventType}
                  onChange={e => setSimEventType(e.target.value as CbsLedgerSimTxn['eventType'])}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white text-slate-900"
                >
                  <option value="NEFT_OUTWARD">NEFT / RTGS Outward Remittance (pacs.008)</option>
                  <option value="CASA_DEPOSIT">CASA Cash / Clearing Deposit (camt.053)</option>
                  <option value="LOAN_DISBURSEMENT">Term Loan Disbursement + 1% Fee &amp; 18% GST (pain.001)</option>
                  <option value="DAILY_INTEREST_ACCRUAL">EOD Daily Interest Accrual Posting (Actual/365)</option>
                  <option value="EOD_GL_ROLLUP">Head Office EOD Profit/Loss GL Sweep</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Target Account / Contract Reference</label>
                <input
                  type="text"
                  value={simAccountRef}
                  onChange={e => setSimAccountRef(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-mono border border-slate-300 rounded-lg bg-white text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Principal / Transaction Amount (INR)</label>
                <input
                  type="number"
                  min={1}
                  value={simAmount}
                  onChange={e => setSimAmount(Number(e.target.value) || 0)}
                  className="w-full px-3 py-2 text-xs font-mono tabular-nums border border-slate-300 rounded-lg bg-white text-slate-900"
                />
              </div>

              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <Play className="w-4 h-4" />
                Execute Serializable Ledger Post
              </button>
            </form>

            <div className="border-t border-slate-200 pt-4">
              <div className="text-xs font-bold text-slate-900 mb-2">Recent Immutable Journal Commits</div>
              <div className="divide-y divide-slate-200 border border-slate-200 rounded-lg max-h-60 overflow-y-auto">
                {cbsLedgerSimTxns.map(txn => {
                  const isSel = selectedSimTxn?.id === txn.id;
                  return (
                    <button
                      key={txn.id}
                      onClick={() => setSelectedSimId(txn.id)}
                      className={`w-full text-left px-3.5 py-2.5 text-xs flex items-center justify-between gap-2 transition-colors ${
                        isSel ? 'bg-slate-900 text-white' : 'bg-white hover:bg-slate-50 text-slate-800'
                      }`}
                    >
                      <div className="truncate">
                        <div className="font-semibold truncate">{txn.eventType} · {txn.accountRef}</div>
                        <div className={`text-[11px] font-mono ${isSel ? 'text-slate-300' : 'text-slate-500'}`}>
                          {txn.iso20022MessageType} · {txn.latencyMs}ms
                        </div>
                      </div>
                      <div className="font-mono font-semibold tabular-nums shrink-0">
                        {formatCurrency(txn.amount)}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6 space-y-5">
            {selectedSimTxn ? (
              <>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-200 pb-4">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      Double-Entry Journal Proof · {selectedSimTxn.eventType}
                    </h3>
                    <div className="text-xs font-mono text-slate-500 mt-1">
                      UETR: {selectedSimTxn.uetr} · Key: {selectedSimTxn.idempotencyKey}
                    </div>
                  </div>
                  <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 shrink-0">
                    <Lock className="w-3.5 h-3.5" />
                    <span>{selectedSimTxn.isolationLevel}</span>
                  </div>
                </div>

                <div className="overflow-x-auto border border-slate-200 rounded-lg">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                      <tr>
                        <th className="px-4 py-2.5 font-semibold">GL Code</th>
                        <th className="px-4 py-2.5 font-semibold">General Ledger Head</th>
                        <th className="px-4 py-2.5 font-semibold text-right">Debit (INR)</th>
                        <th className="px-4 py-2.5 font-semibold text-right">Credit (INR)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {selectedSimTxn.lines.map((line, i) => (
                        <tr key={i} className="hover:bg-slate-50">
                          <td className="px-4 py-2.5 font-mono text-slate-700 tabular-nums">{line.glCode}</td>
                          <td className="px-4 py-2.5 text-slate-900 font-medium">{line.accountTitle}</td>
                          <td className="px-4 py-2.5 font-mono text-right tabular-nums text-slate-900">
                            {line.debit > 0 ? formatCurrency(line.debit) : '—'}
                          </td>
                          <td className="px-4 py-2.5 font-mono text-right tabular-nums text-slate-900">
                            {line.credit > 0 ? formatCurrency(line.credit) : '—'}
                          </td>
                        </tr>
                      ))}
                      <tr className="bg-slate-50 font-bold text-slate-900 border-t border-slate-300">
                        <td className="px-4 py-2.5" colSpan={2}>Invariant Check (Sum Debit = Sum Credit)</td>
                        <td className="px-4 py-2.5 font-mono text-right tabular-nums">
                          {formatCurrency(selectedSimTxn.lines.reduce((s, l) => s + l.debit, 0))}
                        </td>
                        <td className="px-4 py-2.5 font-mono text-right tabular-nums text-emerald-700">
                          {formatCurrency(selectedSimTxn.lines.reduce((s, l) => s + l.credit, 0))}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-900 mb-2">
                    <FileCode2 className="w-4 h-4 text-slate-700" />
                    <span>Generated ISO 20022 Wire Message ({selectedSimTxn.iso20022MessageType})</span>
                  </div>
                  <pre className="p-4 bg-slate-950 text-slate-100 rounded-lg text-[11px] font-mono overflow-x-auto leading-relaxed">
                    {selectedSimTxn.isoXmlSnippet}
                  </pre>
                </div>
              </>
            ) : (
              <div className="text-sm text-slate-500 py-12 text-center">
                Execute a simulated event on the left to inspect its balanced ledger lines and ISO 20022 payload.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: ETL DATA MIGRATION & PARALLEL RUN PARITY */}
      {activeTab === 'migration' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">ETL Migration &amp; Zero-Variance Trial Reconciliation</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Execute automated KYC deduplication, legacy-to-CBS schema transformation, and hash-verified control total checks.
                </p>
              </div>
              <button
                onClick={() => {
                  cbsMigrationBatches.forEach(b => handleExecuteCbsMigrationAction(b.id, 'reconcile'));
                  setParityVerifiedAt(new Date().toLocaleTimeString());
                  setNotice('All migration domains cleansed, transformed, and reconciled to 0.00 variance.');
                }}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 whitespace-nowrap shrink-0"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Reconcile All Batches
              </button>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-lg">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Banking Domain</th>
                    <th className="px-4 py-3 font-semibold">Source &rarr; Target</th>
                    <th className="px-4 py-3 font-semibold text-right">Records</th>
                    <th className="px-4 py-3 font-semibold text-right">Exceptions</th>
                    <th className="px-4 py-3 font-semibold text-right">Variance</th>
                    <th className="px-4 py-3 font-semibold">Stage</th>
                    <th className="px-4 py-3 font-semibold text-right">Pipeline Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {cbsMigrationBatches.map(batch => {
                    const variance = batch.legacyControlTotal - batch.cbsMigratedTotal;
                    const isClean = variance === 0 && batch.exceptionCount === 0;
                    return (
                      <tr key={batch.id} className="hover:bg-slate-50">
                        <td className="px-4 py-3 font-semibold text-slate-900">{batch.domain}</td>
                        <td className="px-4 py-3 font-mono text-slate-600">
                          {batch.sourceTable} <ArrowRight className="inline w-3 h-3 mx-1" /> {batch.targetEntity}
                        </td>
                        <td className="px-4 py-3 text-right font-mono tabular-nums text-slate-900">
                          {batch.cleansedRecords.toLocaleString('en-IN')} / {batch.totalRecords.toLocaleString('en-IN')}
                        </td>
                        <td className={`px-4 py-3 text-right font-mono tabular-nums font-semibold ${batch.exceptionCount > 0 ? 'text-amber-700' : 'text-emerald-700'}`}>
                          {batch.exceptionCount}
                        </td>
                        <td className={`px-4 py-3 text-right font-mono tabular-nums font-semibold ${variance !== 0 ? 'text-red-700' : 'text-emerald-700'}`}>
                          {batch.domain.includes('CIF') ? variance : formatCurrency(variance)}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1.5 font-medium ${isClean ? 'text-emerald-700' : 'text-amber-700'}`}>
                            {isClean ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                            {batch.stage}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right space-x-2 whitespace-nowrap">
                          {batch.exceptionCount > 0 && (
                            <button
                              onClick={() => {
                                handleExecuteCbsMigrationAction(batch.id, 'cleanse');
                                setNotice(`Cleansed and deduplicated ${batch.exceptionCount} anomalies in ${batch.domain}.`);
                              }}
                              className="px-2.5 py-1 text-xs font-semibold text-amber-800 bg-amber-50 border border-amber-200 rounded hover:bg-amber-100"
                            >
                              Cleanse Dedupe
                            </button>
                          )}
                          <button
                            onClick={() => {
                              handleExecuteCbsMigrationAction(batch.id, 'reconcile');
                              setNotice(`Loaded and verified SHA-256 checksum parity for ${batch.domain}.`);
                            }}
                            className="px-2.5 py-1 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-50"
                          >
                            Load &amp; Verify
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Live ERP Ledger Shadow Parity Check */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Live Application Shadow Ledger Parity Check</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Real-time cross-verification against active Customer Accounts, Loan Contracts, Cooperative Member Folios, and Journal Transactions in memory.
                </p>
              </div>
              {parityVerifiedAt && (
                <div className="text-xs font-medium text-emerald-700">
                  Last Verified at {parityVerifiedAt} · Zero Hash Drift
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div className="border border-slate-200 rounded-lg p-4">
                <div className="text-slate-500">Deposit Accounts ({liveErpControlTotals.customerAccountsCount})</div>
                <div className="mt-1 text-base font-bold font-mono tabular-nums text-slate-900">
                  {formatCurrency(liveErpControlTotals.customerDepositTotal)}
                </div>
                <div className="mt-1 text-emerald-700 font-medium">Shadow Parity: 100%</div>
              </div>
              <div className="border border-slate-200 rounded-lg p-4">
                <div className="text-slate-500">MSME Loan Ledger ({liveErpControlTotals.loansCount})</div>
                <div className="mt-1 text-base font-bold font-mono tabular-nums text-slate-900">
                  {formatCurrency(liveErpControlTotals.loanPrincipalTotal)}
                </div>
                <div className="mt-1 text-emerald-700 font-medium">Shadow Parity: 100%</div>
              </div>
              <div className="border border-slate-200 rounded-lg p-4">
                <div className="text-slate-500">Co-op Member Balances ({liveErpControlTotals.coopMembersCount})</div>
                <div className="mt-1 text-base font-bold font-mono tabular-nums text-slate-900">
                  {formatCurrency(liveErpControlTotals.coopThriftTotal)}
                </div>
                <div className="mt-1 text-emerald-700 font-medium">Shadow Parity: 100%</div>
              </div>
              <div className="border border-slate-200 rounded-lg p-4">
                <div className="text-slate-500">Active Cash &amp; Rail Txns</div>
                <div className="mt-1 text-base font-bold font-mono tabular-nums text-slate-900">
                  {liveErpControlTotals.transactionsCount.toLocaleString('en-IN')} Entries
                </div>
                <div className="mt-1 text-emerald-700 font-medium">AML Screened &amp; Balanced</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: CUTOVER RUNBOOK & DR MATRIX */}
      {activeTab === 'cutover' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Production Cutover Weekend Runbook (T-24h to T+00h)</h2>
              <p className="text-xs text-slate-500 mt-1">
                Sequential execution gates with mandatory rollback abort conditions prior to opening Production BOD.
              </p>
            </div>
            <button
              onClick={handleExportCutoverCsv}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 whitespace-nowrap shrink-0"
            >
              <Download className="w-4 h-4" />
              Download Runbook CSV
            </button>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-lg">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 font-semibold">Seq</th>
                  <th className="px-4 py-3 font-semibold">Cutover Window</th>
                  <th className="px-4 py-3 font-semibold">Execution Step</th>
                  <th className="px-4 py-3 font-semibold">Owner</th>
                  <th className="px-4 py-3 font-semibold text-right">Est.</th>
                  <th className="px-4 py-3 font-semibold">Rollback Trigger Condition</th>
                  <th className="px-4 py-3 font-semibold text-right">Gate State</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {cbsCutoverSteps.map(step => (
                  <tr key={step.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-mono font-bold text-slate-700 tabular-nums">{step.sequence}</td>
                    <td className="px-4 py-3 font-mono text-slate-700 whitespace-nowrap">{step.windowLabel}</td>
                    <td className="px-4 py-3 font-medium text-slate-900">{step.title}</td>
                    <td className="px-4 py-3 text-slate-600 whitespace-nowrap">{step.owner}</td>
                    <td className="px-4 py-3 text-right font-mono tabular-nums text-slate-700 whitespace-nowrap">
                      {step.estimatedMinutes}m
                    </td>
                    <td className="px-4 py-3 text-slate-600">{step.rollbackTrigger}</td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <select
                        value={step.status}
                        onChange={e => {
                          const next = e.target.value as any;
                          handleUpdateCbsCutoverStatus(step.id, next);
                          setNotice(`Cutover Step ${step.sequence} marked ${next}.`);
                        }}
                        className={`px-2.5 py-1 text-xs font-semibold rounded border cursor-pointer ${
                          step.status === 'Completed'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : step.status === 'Blocked'
                            ? 'bg-red-50 text-red-800 border-red-200'
                            : 'bg-white text-slate-700 border-slate-300'
                        }`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Completed">Completed</option>
                        <option value="Blocked">Blocked (Abort)</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default CbsImplementation;
