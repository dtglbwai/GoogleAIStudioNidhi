import React, { useState } from 'react';
import { useAppContext } from '../AppContext';
import RunamargaIcon from '../components/icons/RunamargaIcon';

const Runamarga: React.FC = () => {
  const {
    runamargaTelemetry,
    runamargaCampaigns,
    runamargaCalls,
    runamargaActiveCallId,
    setRunamargaActiveCallId,
    handleToggleRunamargaCampaign,
    handleDispatchRunamargaWorkflow,
    handleSimulateRunamargaCallTurn
  } = useAppContext();

  const [activeTab, setActiveTab] = useState<'monitoring' | 'softphone' | 'campaigns' | 'logs'>('monitoring');
  const [selectedCallId, setSelectedCallId] = useState<string>(runamargaCalls[0]?.id || '');
  const [softphoneUtterance, setSoftphoneUtterance] = useState<string>('');
  const [isSynthesizing, setIsSynthesizing] = useState<boolean>(false);

  const activeCall = runamargaCalls.find(c => c.id === selectedCallId) || runamargaCalls[0];

  const handleSendUtterance = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!softphoneUtterance.trim() || !activeCall) return;
    setIsSynthesizing(true);
    await handleSimulateRunamargaCallTurn(activeCall.id, softphoneUtterance);
    setSoftphoneUtterance('');
    setIsSynthesizing(false);
  };

  return (
    <div className="space-y-6">
      {/* Runamarga Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-white shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-start space-x-3">
            <div className="p-3 bg-gradient-to-br from-violet-600 to-indigo-800 rounded-lg shadow-md">
              <RunamargaIcon className="w-8 h-8 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl font-bold">Runamarga Voice AI</h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-violet-500/20 text-violet-300 border border-violet-500/30">
                  BFSI Telephony Core
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Sub-650ms Latency
                </span>
              </div>
              <p className="text-slate-400 text-sm mt-1">
                Conversational AI Infrastructure, Real-time Speech-to-Speech & BFSI Monitoring System
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 text-xs">
            <div className="bg-slate-800/90 border border-slate-700 rounded-lg px-3 py-2">
              <span className="text-slate-400 block">ASR Accuracy</span>
              <strong className="text-emerald-400 font-bold">{runamargaTelemetry.asrAccuracyPct}%</strong>
            </div>
            <div className="bg-slate-800/90 border border-slate-700 rounded-lg px-3 py-2">
              <span className="text-slate-400 block">E2E Latency</span>
              <strong className="text-indigo-300 font-bold">{runamargaTelemetry.avgE2eLatencyMs}ms</strong>
            </div>
            <div className="bg-slate-800/90 border border-slate-700 rounded-lg px-3 py-2">
              <span className="text-slate-400 block">FPC Compliance</span>
              <strong className="text-emerald-400 font-bold">{runamargaTelemetry.fpcComplianceRate}%</strong>
            </div>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center space-x-2 mt-6 border-t border-slate-800 pt-3 text-sm">
          {[
            { id: 'monitoring', label: 'Telemetry & Live Stream' },
            { id: 'softphone', label: 'Interactive Voice Simulator' },
            { id: 'campaigns', label: 'Outbound Campaigns' },
            { id: 'logs', label: 'Call Records & Audit' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-violet-600 text-white shadow'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Monitoring Tab */}
      {activeTab === 'monitoring' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Live Call Stream */}
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                  <h3 className="font-bold text-gray-900">Live Telephony Stream Monitor</h3>
                </div>
                <span className="text-xs font-mono text-gray-500">SIP Trunk: sip.in-mum.runamarga.net</span>
              </div>

              {activeCall && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between bg-slate-50 p-3 rounded-lg text-xs">
                    <div>
                      <span className="text-gray-400 block">Customer:</span>
                      <strong className="text-gray-900">{activeCall.customerName} ({activeCall.phoneNumber})</strong>
                    </div>
                    <div>
                      <span className="text-gray-400 block">Language:</span>
                      <strong className="text-indigo-600">{activeCall.language}</strong>
                    </div>
                    <div>
                      <span className="text-gray-400 block">Sentiment:</span>
                      <strong className="text-emerald-600">{activeCall.sentiment}</strong>
                    </div>
                    <div>
                      <span className="text-gray-400 block">QA Score:</span>
                      <strong className="text-gray-900">{activeCall.qaScore}/100</strong>
                    </div>
                  </div>

                  {/* Transcript Feed */}
                  <div className="space-y-2.5 max-h-64 overflow-y-auto p-2 border border-gray-100 rounded-lg">
                    {activeCall.transcript.map((turn, idx) => (
                      <div 
                        key={idx}
                        className={`p-3 rounded-lg text-xs ${
                          turn.speaker === 'agent' 
                            ? 'bg-violet-50/80 border border-violet-100 ml-6 text-violet-950' 
                            : 'bg-gray-100 mr-6 text-gray-900'
                        }`}
                      >
                        <div className="flex items-center justify-between font-bold mb-1">
                          <span className="capitalize">{turn.speaker === 'agent' ? 'Runamarga AI Agent' : activeCall.customerName}</span>
                          <span className="text-[10px] text-gray-400">{turn.timestamp}</span>
                        </div>
                        <p>{turn.text}</p>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-end space-x-2 pt-2">
                    <button
                      onClick={() => handleDispatchRunamargaWorkflow(activeCall.id)}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold cursor-pointer"
                    >
                      Dispatch Auto-Workflow ({activeCall.outcome})
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Metrics Panel */}
          <div className="space-y-4">
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-3">
              <h3 className="text-sm font-bold text-gray-900">Performance Telemetry</h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b">
                  <span className="text-gray-500">Active Concurrent Calls</span>
                  <strong className="text-gray-900">{runamargaTelemetry.activeCallsCount}</strong>
                </div>
                <div className="flex justify-between py-1 border-b">
                  <span className="text-gray-500">Calls Completed Today</span>
                  <strong className="text-gray-900">{runamargaTelemetry.totalCallsToday.toLocaleString()}</strong>
                </div>
                <div className="flex justify-between py-1 border-b">
                  <span className="text-gray-500">Avg Handling Time (AHT)</span>
                  <strong className="text-gray-900">{runamargaTelemetry.avgHandlingTimeSec}s</strong>
                </div>
                <div className="flex justify-between py-1 border-b">
                  <span className="text-gray-500">PTP Conversion Rate</span>
                  <strong className="text-emerald-600">{runamargaTelemetry.ptpConversionRate}%</strong>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-gray-500">Cost Savings vs Human</span>
                  <strong className="text-violet-600">{runamargaTelemetry.costSavingsPct}%</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Simulator Tab */}
      {activeTab === 'softphone' && (
        <div className="max-w-2xl mx-auto bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-gray-900">Interactive BFSI Voice Simulator</h2>
          <p className="text-xs text-gray-500">Test conversational dialog turns, entity extraction, and intent classification.</p>

          <form onSubmit={handleSendUtterance} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Customer Voice Input (Simulated ASR)</label>
              <input
                type="text"
                placeholder="e.g. Haanji, main kal ₹15,000 transfer kar doonga via UPI..."
                value={softphoneUtterance}
                onChange={(e) => setSoftphoneUtterance(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-violet-500"
              />
            </div>
            <button
              type="submit"
              disabled={isSynthesizing}
              className="px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-lg text-xs font-bold cursor-pointer transition-colors"
            >
              {isSynthesizing ? 'Processing Speech Turn...' : 'Transmit Utterance'}
            </button>
          </form>
        </div>
      )}

      {/* Campaigns Tab */}
      {activeTab === 'campaigns' && (
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-gray-900">Outbound Voice AI Campaigns</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {runamargaCampaigns.map(camp => (
              <div key={camp.id} className="border border-gray-200 rounded-xl p-4 bg-gray-50/50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-violet-700 bg-violet-50 px-2 py-0.5 rounded">{camp.id}</span>
                  <button
                    onClick={() => handleToggleRunamargaCampaign(camp.id)}
                    className={`px-2 py-0.5 rounded text-xs font-bold cursor-pointer ${
                      camp.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    {camp.status}
                  </button>
                </div>
                <h3 className="text-sm font-bold text-gray-900">{camp.name}</h3>
                <p className="text-xs text-gray-500">{camp.targetAudience}</p>
                <div className="grid grid-cols-3 gap-2 bg-white p-2 rounded border text-xs">
                  <div>
                    <span className="text-gray-400 block text-[10px]">Calls Made</span>
                    <strong>{camp.completedCalls} / {camp.totalContacts}</strong>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10px]">Connected</span>
                    <strong className="text-emerald-600">{camp.connectedRate}%</strong>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10px]">Conversion</span>
                    <strong className="text-indigo-600">{camp.conversionRate}%</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Logs Tab */}
      {activeTab === 'logs' && (
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Completed Call Records & Compliance QA</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b text-xs font-semibold text-gray-500 uppercase bg-gray-50">
                  <th className="py-2.5 px-3">Call ID</th>
                  <th className="py-2.5 px-3">Customer</th>
                  <th className="py-2.5 px-3">Campaign</th>
                  <th className="py-2.5 px-3">Duration</th>
                  <th className="py-2.5 px-3">Outcome</th>
                  <th className="py-2.5 px-3">QA Score</th>
                  <th className="py-2.5 px-3">Cost</th>
                </tr>
              </thead>
              <tbody className="divide-y text-xs">
                {runamargaCalls.map(call => (
                  <tr key={call.id} className="hover:bg-gray-50">
                    <td className="py-2.5 px-3 font-mono font-bold text-violet-700">{call.id}</td>
                    <td className="py-2.5 px-3 font-medium text-gray-900">{call.customerName}</td>
                    <td className="py-2.5 px-3 text-gray-600">{call.campaignName}</td>
                    <td className="py-2.5 px-3 text-gray-600">{call.durationSec}s</td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded font-bold bg-indigo-50 text-indigo-700">
                        {call.outcome}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-bold text-gray-900">{call.qaScore}/100</td>
                    <td className="py-2.5 px-3 font-mono text-emerald-600">₹{call.costInr.toFixed(2)}</td>
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

export default Runamarga;
