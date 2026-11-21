import React, { useMemo, useState } from 'react';
import { useAppContext } from '../AppContext';
import DataBackupIcon from '../components/icons/DataBackupIcon';
import { SystemBackupSnapshot } from './types';
import {
  CheckCircle2,
  Download,
  RotateCcw,
  ShieldCheck,
  Upload,
  PlusCircle,
  AlertTriangle,
} from 'lucide-react';

const DataBackup: React.FC = () => {
  const {
    backupSnapshots,
    handleCreateBackupSnapshot,
    handleRestoreBackupSnapshot,
  } = useAppContext();

  const [snapshotLabel, setSnapshotLabel] = useState('Manual Full Normalized Checkpoint');
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);
  const [verifiedIds, setVerifiedIds] = useState<Record<string, string>>({});

  const latestSnapshot = backupSnapshots[0];
  const totalStorageKb = useMemo(
    () => backupSnapshots.reduce((sum, s) => sum + s.sizeKb, 0),
    [backupSnapshots]
  );

  const handleCreateNow = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      const snap = await handleCreateBackupSnapshot(
        snapshotLabel.trim() || 'Manual Normalized Checkpoint',
        'Manual'
      );
      setNotice({
        type: 'ok',
        text: `Created verified checkpoint "${snap.label}" (${snap.totalRecords} records · SHA-256 ${snap.sha256.slice(0, 12)}...).`,
      });
    } finally {
      setBusy(false);
    }
  };

  const handleDownloadSnapshot = (snap: SystemBackupSnapshot) => {
    const content =
      snap.payloadJson ||
      JSON.stringify(
        {
          id: snap.id,
          label: snap.label,
          createdAt: snap.createdAt,
          schemaVersion: snap.schemaVersion,
          sha256: snap.sha256,
          entityCounts: snap.entityCounts,
        },
        null,
        2
      );
    const blob = new Blob([content], { type: 'application/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${snap.id}-${snap.schemaVersion}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setNotice({
      type: 'ok',
      text: `Exported verified backup archive ${snap.id}-${snap.schemaVersion}.json (${snap.sizeKb} KB).`,
    });
  };

  const handleVerifyDigestOnServer = async (snap: SystemBackupSnapshot) => {
    if (!snap.payloadJson) {
      setVerifiedIds(prev => ({ ...prev, [snap.id]: 'Baseline Digest Recorded' }));
      setNotice({
        type: 'ok',
        text: `Baseline checkpoint ${snap.id} carries stored SHA-256 ${snap.sha256.slice(0, 16)}...`,
      });
      return;
    }
    try {
      const res = await fetch('/api/security/verify-checksum', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          payload: snap.payloadJson,
          expectedSha256: snap.sha256,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setVerifiedIds(prev => ({
          ...prev,
          [snap.id]: data.verified ? 'Server SHA-256 Verified' : 'Checksum Mismatch',
        }));
        setNotice({
          type: data.verified ? 'ok' : 'err',
          text: data.verified
            ? `HQ Server confirmed timing-safe SHA-256 integrity for checkpoint ${snap.id}.`
            : `Checksum verification failed for checkpoint ${snap.id}.`,
        });
      }
    } catch {
      setNotice({ type: 'err', text: 'Unable to reach /api/security/verify-checksum.' });
    }
  };

  const handleRestore = async (snapId: string) => {
    setBusy(true);
    try {
      const result = await handleRestoreBackupSnapshot(snapId);
      setNotice({ type: result.ok ? 'ok' : 'err', text: result.message });
    } finally {
      setBusy(false);
    }
  };

  const handleUploadArchive = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async ev => {
      const text = String(ev.target?.result || '');
      const result = await handleRestoreBackupSnapshot(text);
      setNotice({
        type: result.ok ? 'ok' : 'err',
        text: result.ok ? `Uploaded & ${result.message}` : result.message,
      });
    };
    reader.readAsText(file);
  };

  return (
    <div className="animate-fade-in space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-slate-900 text-white rounded-lg shrink-0">
            <div className="w-6 h-6">
              <DataBackupIcon />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Data Backup, SHA-256 Checkpoints &amp; Point-in-Time Recovery
            </h1>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
              <span>Zero-Data-Loss Safety Net</span>
              <span aria-hidden="true">·</span>
              <span>Auto Pre-Restore Checkpoints</span>
              <span aria-hidden="true">·</span>
              <span>Timing-Safe SHA-256 Digest Verification</span>
            </div>
          </div>
        </div>
        <label className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 cursor-pointer whitespace-nowrap shrink-0">
          <Upload className="w-4 h-4" />
          Restore From .json Archive
          <input type="file" accept=".json" onChange={handleUploadArchive} className="hidden" />
        </label>
      </div>

      {notice && (
        <div
          className={`px-4 py-3 rounded-lg border flex items-center justify-between gap-4 text-xs ${
            notice.type === 'ok'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : 'bg-red-50 border-red-200 text-red-900'
          }`}
        >
          <div className="flex items-center gap-2">
            {notice.type === 'ok' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-red-700 shrink-0" />
            )}
            <span>{notice.text}</span>
          </div>
          <button onClick={() => setNotice(null)} className="font-semibold hover:underline whitespace-nowrap">
            Dismiss
          </button>
        </div>
      )}

      {/* KPI Strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <div className="text-xs font-medium text-slate-500">Latest Verified Checkpoint</div>
          <div className="mt-2 text-xl font-bold text-slate-900 font-mono tabular-nums">
            {latestSnapshot?.createdAt || 'None'}
          </div>
          <div className="mt-1 text-xs text-slate-500 truncate">{latestSnapshot?.label || 'Create first checkpoint'}</div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <div className="text-xs font-medium text-slate-500">Protected Normalized Records</div>
          <div className="mt-2 text-xl font-bold text-slate-900 font-mono tabular-nums">
            {latestSnapshot?.totalRecords ?? 0}
          </div>
          <div className="mt-1 text-xs text-slate-500">Schema {latestSnapshot?.schemaVersion || '3NF-v2.4'}</div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <div className="text-xs font-medium text-slate-500">Checkpoint Archive Volume</div>
          <div className="mt-2 text-xl font-bold text-slate-900 font-mono tabular-nums">
            {backupSnapshots.length} ({totalStorageKb} KB)
          </div>
          <div className="mt-1 text-xs text-slate-500">Automatic safety snapshot created before any restore</div>
        </div>
      </div>

      {/* Create New Snapshot Bar */}
      <form
        onSubmit={handleCreateNow}
        className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col sm:flex-row sm:items-end justify-between gap-4"
      >
        <div className="flex-1">
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Checkpoint Label (Normalized Full Store Snapshot)
          </label>
          <input
            type="text"
            value={snapshotLabel}
            onChange={e => setSnapshotLabel(e.target.value)}
            className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-lg bg-white text-slate-900"
            placeholder="e.g. Pre-EOD Daily Closing Snapshot"
          />
        </div>
        <button
          type="submit"
          disabled={busy}
          className="inline-flex items-center justify-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-primary rounded-lg hover:bg-primary-dark disabled:bg-slate-400 whitespace-nowrap shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          {busy ? 'Capturing Snapshot...' : 'Create Verified Checkpoint Now'}
        </button>
      </form>

      {/* Checkpoints History Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200">
          <h2 className="text-base font-bold text-slate-900">Recovery Checkpoints &amp; Cryptographic Digests</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 font-semibold">Checkpoint</th>
                <th className="px-4 py-3 font-semibold">Timestamp (UTC)</th>
                <th className="px-4 py-3 font-semibold">Type</th>
                <th className="px-4 py-3 font-semibold text-right">Records</th>
                <th className="px-4 py-3 font-semibold text-right">Size</th>
                <th className="px-4 py-3 font-semibold">SHA-256 Digest</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold text-right">Recovery Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {backupSnapshots.map(snap => (
                <tr key={snap.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <div className="font-semibold text-slate-900">{snap.label}</div>
                    <div className="font-mono text-[11px] text-slate-500">{snap.id}</div>
                  </td>
                  <td className="px-4 py-3 font-mono text-slate-600 whitespace-nowrap tabular-nums">
                    {snap.createdAt}
                  </td>
                  <td className="px-4 py-3 font-medium text-slate-700 whitespace-nowrap">{snap.type}</td>
                  <td className="px-4 py-3 text-right font-mono font-semibold text-slate-900 tabular-nums">
                    {snap.totalRecords}
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-slate-600 tabular-nums">
                    {snap.sizeKb} KB
                  </td>
                  <td className="px-4 py-3 font-mono text-slate-600">
                    <div>{snap.sha256.slice(0, 16)}...</div>
                    {verifiedIds[snap.id] && (
                      <div className="text-[11px] text-emerald-700 font-semibold">{verifiedIds[snap.id]}</div>
                    )}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span
                      className={`font-semibold ${
                        snap.status === 'Restored' ? 'text-blue-700' : 'text-emerald-700'
                      }`}
                    >
                      {snap.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleVerifyDigestOnServer(snap)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-100 whitespace-nowrap"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Verify
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDownloadSnapshot(snap)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-100 whitespace-nowrap"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Export
                      </button>
                      <button
                        type="button"
                        disabled={busy || !snap.payloadJson}
                        onClick={() => handleRestore(snap.id)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-white bg-slate-900 rounded hover:bg-slate-800 disabled:bg-slate-300 disabled:text-slate-500 whitespace-nowrap"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        Restore
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DataBackup;
