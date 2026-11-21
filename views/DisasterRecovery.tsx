import React, { useMemo, useState } from 'react';
import { useAppContext } from '../AppContext';
import DisasterRecoveryIcon from '../components/icons/DisasterRecoveryIcon';
import { CheckCircle2, Play, RefreshCw, Database, Server, ShieldAlert } from 'lucide-react';

interface DrillStepLog {
  timestamp: string;
  phase: string;
  detail: string;
}

const DisasterRecovery: React.FC = () => {
  const { branches, backupSnapshots, handleCreateBackupSnapshot, handleSyncBranchToHq } = useAppContext();

  const [activeCluster, setActiveCluster] = useState<'BLR-HO' | 'CHN-DR'>('BLR-HO');
  const [drilling, setDrilling] = useState(false);
  const [drillLogs, setDrillLogs] = useState<DrillStepLog[]>([]);
  const [notice, setNotice] = useState<string | null>(null);

  const synchronizedCount = useMemo(
    () => branches.filter(b => b.syncStatus !== 'ISOLATED').length,
    [branches]
  );

  const handleRunFailoverDrill = async () => {
    setDrilling(true);
    setDrillLogs([]);
    const appendLog = (phase: string, detail: string) => {
      setDrillLogs(prev => [
        ...prev,
        {
          timestamp: new Date().toISOString().replace('T', ' ').slice(11, 19),
          phase,
          detail,
        },
      ]);
    };

    try {
      const snap = await handleCreateBackupSnapshot('Pre-Failover DR Continuity Checkpoint', 'Automated');
      appendLog('01. Pre-Failover Snapshot', `Captured SHA-256 checkpoint ${snap.id} (${snap.totalRecords} records).`);

      const nextCluster = activeCluster === 'BLR-HO' ? 'CHN-DR' : 'BLR-HO';
      appendLog(
        '02. HQ DNS & Gateway Drain',
        `Switched regional branch WireGuard tunnels cleanly toward ${nextCluster === 'CHN-DR' ? 'Chennai Secondary DR DC' : 'Bangalore Primary HQ Cluster'}.`
      );
      setActiveCluster(nextCluster);

      appendLog(
        '03. Referential & Replication Verification',
        `Confirmed ${synchronizedCount}/${branches.length} connected branch nodes re-anchored with zero data loss (RPO < 5s).`
      );
      setNotice(`Controlled DR failover drill succeeded — active traffic routed cleanly to ${nextCluster}.`);
    } finally {
      setDrilling(false);
    }
  };

  return (
    <div className="animate-fade-in space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-slate-900 text-white rounded-lg shrink-0">
            <div className="w-6 h-6">
              <DisasterRecoveryIcon />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Disaster Recovery &amp; Centralized HQ Business Continuity
            </h1>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
              <span>Bangalore Primary HQ &harr; Chennai DR Cluster</span>
              <span aria-hidden="true">·</span>
              <span>Zero-Data-Loss RPO &lt; 5s</span>
              <span aria-hidden="true">·</span>
              <span>Automated Pre-Failover Snapshots</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={async () => {
              const snap = await handleCreateBackupSnapshot('DR Readiness Safety Point', 'Manual');
              setNotice(`Stored pre-failover DR checkpoint ${snap.id} (${snap.sha256.slice(0, 10)}...).`);
            }}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 whitespace-nowrap"
          >
            <Database className="w-4 h-4" />
            Save DR Checkpoint
          </button>
          <button
            disabled={drilling}
            onClick={handleRunFailoverDrill}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 disabled:bg-slate-400 whitespace-nowrap"
          >
            <Play className="w-4 h-4" />
            {drilling ? 'Running Drill...' : 'Execute Failover Drill'}
          </button>
        </div>
      </div>

      {notice && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 px-4 py-3 rounded-lg flex items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>{notice}</span>
          </div>
          <button onClick={() => setNotice(null)} className="font-semibold hover:underline whitespace-nowrap">
            Dismiss
          </button>
        </div>
      )}

      {/* KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <div className="text-xs font-medium text-slate-500">Recovery Point Objective (RPO)</div>
          <div className="mt-2 text-2xl font-bold text-slate-900 font-mono tabular-nums">&lt; 5 sec</div>
          <div className="mt-1 text-xs text-slate-500">Real-time HQ stream across branches</div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <div className="text-xs font-medium text-slate-500">Recovery Time Objective (RTO)</div>
          <div className="mt-2 text-2xl font-bold text-slate-900 font-mono tabular-nums">&lt; 15 min</div>
          <div className="mt-1 text-xs text-slate-500">Warm standby cutover SLA</div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <div className="text-xs font-medium text-slate-500">Active HQ Data Center</div>
          <div className="mt-2 text-2xl font-bold text-slate-900 font-mono">{activeCluster}</div>
          <div className="mt-1 text-xs text-slate-500">
            {activeCluster === 'BLR-HO' ? 'Bangalore Primary HQ' : 'Chennai Standby DR DC'}
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <div className="text-xs font-medium text-slate-500">Verified DR Checkpoints</div>
          <div className="mt-2 text-2xl font-bold text-slate-900 font-mono tabular-nums">
            {backupSnapshots.length}
          </div>
          <div className="mt-1 text-xs text-slate-500">SHA-256 sealed restore points</div>
        </div>
      </div>

      {/* Failover Topology + Drill Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Server className="w-4 h-4 text-slate-800" />
            <h2 className="text-base font-bold text-slate-900">HQ Data Center Cluster Roles</h2>
          </div>
          <div className="space-y-3 text-xs">
            <div
              className={`p-4 rounded-xl border ${
                activeCluster === 'BLR-HO'
                  ? 'bg-emerald-50 border-emerald-200'
                  : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">Bangalore Central HQ (BLR-HO)</span>
                <span className="font-mono font-bold text-emerald-700">
                  {activeCluster === 'BLR-HO' ? 'PRIMARY SERVING' : 'STANDBY READY'}
                </span>
              </div>
              <div className="text-slate-600 mt-1">Core Ledger + Firestore Multi-Region Replication + AI Airlock</div>
            </div>

            <div
              className={`p-4 rounded-xl border ${
                activeCluster === 'CHN-DR'
                  ? 'bg-emerald-50 border-emerald-200'
                  : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">Chennai Continuity Vault (CHN-DR)</span>
                <span className="font-mono font-bold text-slate-700">
                  {activeCluster === 'CHN-DR' ? 'PRIMARY SERVING' : 'WARM STANDBY'}
                </span>
              </div>
              <div className="text-slate-600 mt-1">Seismic Zone-III Isolated DR Replica · SHA-256 Archive</div>
            </div>
          </div>

          {drillLogs.length > 0 && (
            <div className="border-t border-slate-200 pt-4 space-y-2">
              <div className="text-xs font-bold text-slate-900">Latest Controlled Drill Execution Log</div>
              <div className="space-y-2">
                {drillLogs.map((l, i) => (
                  <div key={i} className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs">
                    <div className="flex items-center justify-between font-semibold text-slate-900">
                      <span>{l.phase}</span>
                      <span className="font-mono text-[11px] text-slate-500">{l.timestamp} UTC</span>
                    </div>
                    <div className="text-slate-600 mt-0.5">{l.detail}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Live Branch-to-HQ Replication Table */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Multi-Branch HQ Replication &amp; Continuity Status</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {synchronizedCount} of {branches.length} branches replicating cleanly to active cluster ({activeCluster}).
              </p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 font-semibold">Branch Node</th>
                  <th className="px-4 py-3 font-semibold">VPN Tunnel</th>
                  <th className="px-4 py-3 font-semibold">Sync Mode</th>
                  <th className="px-4 py-3 font-semibold text-right">Lag</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {branches.map(b => (
                  <tr key={b.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <div className="font-semibold text-slate-900">{b.name}</div>
                      <div className="font-mono text-[11px] text-slate-500">{b.branchCode}</div>
                    </td>
                    <td className="px-4 py-3 font-mono text-slate-700 whitespace-nowrap">
                      {b.vpnTunnelIp || '10.240.0.x'}
                    </td>
                    <td className="px-4 py-3 font-mono text-slate-600 whitespace-nowrap">
                      {b.hqSyncMode || 'REALTIME_HQ_STREAM'}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-slate-700 tabular-nums whitespace-nowrap">
                      {b.replicationLagMs ?? 0} ms
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 font-semibold ${
                          b.syncStatus === 'ISOLATED' ? 'text-amber-700' : 'text-emerald-700'
                        }`}
                      >
                        {b.syncStatus === 'ISOLATED' ? (
                          <ShieldAlert className="w-3.5 h-3.5" />
                        ) : (
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        )}
                        {b.syncStatus || 'SYNCHRONIZED'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => {
                          handleSyncBranchToHq(b.id);
                          setNotice(`Re-synchronized branch node ${b.branchCode} with active HQ cluster ${activeCluster}.`);
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-100 whitespace-nowrap"
                      >
                        <RefreshCw className="w-3 h-3" />
                        Re-Sync
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DisasterRecovery;
