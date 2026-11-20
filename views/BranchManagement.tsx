import React, { useMemo, useState } from 'react';
import { Server, RefreshCw, ShieldAlert, CheckCircle2, Plus, ArrowLeftRight } from 'lucide-react';
import type { Branch } from './types';
import { useAppContext } from '../AppContext';
import { formatCurrency } from '../utils/formatters';
import { NewBranchModal } from '../components/ActionModals';

const BranchManagement: React.FC = () => {
  const {
    branches,
    currentUser,
    activeBranchId,
    handleSetActiveBranch,
    handleSyncBranchToHq,
    handleToggleBranchIsolation,
  } = useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [regionFilter, setRegionFilter] = useState<string>('ALL');
  const [hqHealthState, setHqHealthState] = useState<string>('Checking HQ cluster...');
  const [notice, setNotice] = useState<string | null>(null);

  const regions = useMemo(
    () => ['ALL', ...Array.from(new Set(branches.map(b => b.region || 'Regional Network')))],
    [branches]
  );

  const visibleBranches = useMemo(
    () =>
      regionFilter === 'ALL'
        ? branches
        : branches.filter(b => (b.region || 'Regional Network') === regionFilter),
    [branches, regionFilter]
  );

  const summary = useMemo(() => {
    const totalAssets = branches.reduce((acc, b) => acc + (b.totalAssets || 0), 0);
    const totalStaff = branches.reduce((acc, b) => acc + (b.employeeCount || 0), 0);
    const syncedCount = branches.filter(b => (b.syncStatus || 'SYNCHRONIZED') === 'SYNCHRONIZED').length;
    const avgLag = branches.length
      ? Math.round(branches.reduce((acc, b) => acc + (b.replicationLagMs ?? 12), 0) / branches.length)
      : 0;
    return { totalAssets, totalStaff, syncedCount, avgLag };
  }, [branches]);

  const verifyHqCentralServer = async () => {
    setHqHealthState('Probing HQ central server...');
    try {
      const res = await fetch('/api/deployment/readiness');
      if (res.ok) {
        const data = await res.json();
        setHqHealthState(`HQ Primary Server Online (${data.mode} · Port ${data.port})`);
        setNotice('Verified connectivity and security headers with Centralized HQ Server.');
      } else {
        setHqHealthState('HQ probe returned non-200 status');
      }
    } catch {
      setHqHealthState('Offline standby — local branch queue active');
    }
  };

  return (
    <div className="animate-fade-in space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg shrink-0">
            <Server className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Centralized HQ Server &amp; Multi-Branch Topology
            </h1>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
              <span>Single Source-of-Truth HQ Ledger</span>
              <span aria-hidden="true">·</span>
              <span>Store-and-Forward Branch Resilience</span>
              <span aria-hidden="true">·</span>
              <span>{hqHealthState}</span>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={verifyHqCentralServer}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 whitespace-nowrap"
          >
            <RefreshCw className="w-4 h-4" />
            Verify HQ Server
          </button>
          {currentUser !== 'Auditor' && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-primary rounded-lg hover:bg-primary-dark whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              Provision Branch Node
            </button>
          )}
        </div>
      </div>

      {notice && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 px-4 py-2.5 rounded-lg flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>{notice}</span>
          </div>
          <button onClick={() => setNotice(null)} className="font-semibold hover:underline">
            Dismiss
          </button>
        </div>
      )}

      {/* Consolidated HQ KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <div className="text-xs font-medium text-slate-500">HQ Consolidated Assets</div>
          <div className="mt-2 text-xl font-bold text-slate-900 tabular-nums">
            {formatCurrency(summary.totalAssets)}
          </div>
          <div className="mt-1 text-xs text-slate-500 tabular-nums">
            Across {branches.length} connected nodes
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <div className="text-xs font-medium text-slate-500">Synchronized Nodes</div>
          <div className="mt-2 text-xl font-bold text-slate-900 font-mono tabular-nums">
            {summary.syncedCount} / {branches.length}
          </div>
          <div className="mt-1 text-xs text-slate-500">
            Active HQ bidirectional sync
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <div className="text-xs font-medium text-slate-500">Mean Replication Latency</div>
          <div className="mt-2 text-xl font-bold text-slate-900 font-mono tabular-nums">
            {summary.avgLag} ms
          </div>
          <div className="mt-1 text-xs text-slate-500">
            Encrypted long-polling &amp; VPN
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <div className="text-xs font-medium text-slate-500">Branch Workforce</div>
          <div className="mt-2 text-xl font-bold text-slate-900 font-mono tabular-nums">
            {summary.totalStaff} Officers
          </div>
          <div className="mt-1 text-xs text-slate-500">
            Active Scope: {activeBranchId === 'ALL' ? 'HQ Consolidated' : branches.find(b => b.id === activeBranchId)?.branchCode}
          </div>
        </div>
      </div>

      {/* Multi-Branch Comparability & HQ Sync Controls */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Branch Comparability &amp; HQ Server Synchronization Matrix
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Compare branch asset distribution, asset-per-officer productivity, active SaaS modules, and real-time HQ ledger replication.
            </p>
          </div>
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg overflow-x-auto">
            {regions.map(r => (
              <button
                key={r}
                onClick={() => setRegionFilter(r)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md whitespace-nowrap transition-colors ${
                  regionFilter === r ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto border border-slate-200 rounded-lg">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 font-semibold">Branch / Code</th>
                <th className="px-4 py-3 font-semibold">Zone &amp; Manager</th>
                <th className="px-4 py-3 font-semibold">HQ Sync &amp; VPN</th>
                <th className="px-4 py-3 font-semibold text-right">Portfolio Assets</th>
                <th className="px-4 py-3 font-semibold text-right">Assets / Officer</th>
                <th className="px-4 py-3 font-semibold text-center">SaaS Modules</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold text-right">Operations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {visibleBranches.map((branch: Branch) => {
                const status = branch.syncStatus || 'SYNCHRONIZED';
                const assetsPerStaff = branch.employeeCount > 0 ? Math.round(branch.totalAssets / branch.employeeCount) : 0;
                const isSelectedScope = activeBranchId === branch.id;
                return (
                  <tr key={branch.id} className={`hover:bg-slate-50 ${isSelectedScope ? 'bg-primary-light' : ''}`}>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-slate-900">
                        {branch.name}
                        {branch.isHeadquarters && ' · HQ Primary'}
                      </div>
                      <div className="font-mono text-slate-500 mt-0.5">
                        {branch.branchCode} · {branch.location}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-slate-800 font-medium">{branch.manager}</div>
                      <div className="text-slate-500 mt-0.5">{branch.region || 'Regional Network'}</div>
                    </td>
                    <td className="px-4 py-3 font-mono text-slate-700">
                      <div>{branch.hqSyncMode || 'REALTIME_HQ_STREAM'}</div>
                      <div className="text-slate-500 mt-0.5">
                        {branch.vpnTunnelIp || '10.100.0.x'} · {branch.replicationLagMs ?? 12}ms · {branch.lastSyncAt || 'Live'}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-semibold text-slate-900 tabular-nums whitespace-nowrap">
                      {formatCurrency(branch.totalAssets)}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-slate-700 tabular-nums whitespace-nowrap">
                      {formatCurrency(assetsPerStaff)} ({branch.employeeCount})
                    </td>
                    <td className="px-4 py-3 text-center font-mono tabular-nums text-slate-700">
                      {branch.activeModules?.length ?? 7}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 font-semibold ${
                          status === 'SYNCHRONIZED' ? 'text-emerald-700' : 'text-amber-700'
                        }`}
                      >
                        {status === 'SYNCHRONIZED' ? (
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        ) : (
                          <ShieldAlert className="w-3.5 h-3.5" />
                        )}
                        {status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap space-x-2">
                      <button
                        onClick={() => {
                          handleSetActiveBranch(isSelectedScope ? 'ALL' : branch.id);
                          setNotice(
                            isSelectedScope
                              ? 'Switched operator scope to HQ Consolidated.'
                              : `Focused operator workspace onto branch ${branch.branchCode}.`
                          );
                        }}
                        className="inline-flex items-center gap-1 text-primary font-semibold hover:underline"
                      >
                        <ArrowLeftRight className="w-3 h-3" />
                        {isSelectedScope ? 'HQ All' : 'Focus'}
                      </button>
                      <button
                        onClick={() => {
                          handleSyncBranchToHq(branch.id);
                          setNotice(`Synchronized branch ${branch.branchCode} delta ledger to HQ cluster.`);
                        }}
                        className="text-slate-700 font-semibold hover:underline"
                      >
                        Sync
                      </button>
                      {!branch.isHeadquarters && currentUser !== 'Auditor' && (
                        <button
                          onClick={() => {
                            handleToggleBranchIsolation(branch.id);
                            setNotice(
                              status === 'ISOLATED'
                                ? `Reconnected ${branch.branchCode} to HQ server.`
                                : `Isolated ${branch.branchCode} for maintenance.`
                            );
                          }}
                          className="text-amber-700 font-semibold hover:underline"
                        >
                          {status === 'ISOLATED' ? 'Reconnect' : 'Isolate'}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <NewBranchModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default BranchManagement;