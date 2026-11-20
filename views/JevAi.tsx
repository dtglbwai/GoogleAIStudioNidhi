import React, { useState } from 'react';
import { useAppContext } from '../AppContext';
import { JevPipeline, JevQuestion, JevBatchRecord, JevEvaluationOutput } from './types';
import JevIcon from '../components/icons/JevIcon';
import AiIcon from '../components/icons/AiIcon';
import ShieldIcon from '../components/icons/ShieldIcon';
import AccountingIcon from '../components/icons/AccountingIcon';

const JevAi: React.FC = () => {
  const {
    jevPipelines,
    jevBatchRecords,
    jevCalibrationBuckets,
    jevRecentEvaluations,
    jevActivePipelineId,
    setJevActivePipelineId,
    handleExecuteJevEvaluation,
    handleRunJevBatchSimulation,
    handleCommitStpRecord,
    handleTriggerSystem2Escalation,
    handleUpdateJevPipelineStatus,
    handleUpdateStpThreshold,
  } = useAppContext();

  const [activeTab, setActiveTab] = useState<'studio' | 'sentinels' | 'hybrid' | 'batch' | 'sdk'>('studio');

  // Studio State
  const activePipeline = jevPipelines.find(p => p.id === jevActivePipelineId) || jevPipelines[0];
  const [selectedQuestionId, setSelectedQuestionId] = useState<string>(activePipeline.questions[0].id);
  const selectedQuestion = activePipeline.questions.find(q => q.id === selectedQuestionId) || activePipeline.questions[0];
  const [customStateJson, setCustomStateJson] = useState<string>(JSON.stringify(activePipeline.sampleState, null, 2));
  const [isExecutingStudio, setIsExecutingStudio] = useState(false);
  const [latestStudioResult, setLatestStudioResult] = useState<JevEvaluationOutput | null>(
    jevRecentEvaluations.length > 0 ? jevRecentEvaluations[0] : null
  );

  // Batch Filter State
  const [batchFilter, setBatchFilter] = useState<'ALL' | 'STP_COMMITTED' | 'ESCALATED_TO_SYSTEM2' | 'PENDING_HUMAN_REVIEW'>('ALL');
  const [batchStpThreshold, setBatchStpThreshold] = useState<number>(0.95);
  const [isSimulatingBatch, setIsSimulatingBatch] = useState(false);
  const [batchFeedbackMsg, setBatchFeedbackMsg] = useState<string | null>(null);

  // Hybrid Tab Escalation State
  const [selectedEscalationRecordId, setSelectedEscalationRecordId] = useState<string>(jevBatchRecords[2].id);
  const [system2CustomMemo, setSystem2CustomMemo] = useState<string>('');
  const [isGeneratingSystem2, setIsGeneratingSystem2] = useState(false);
  const [system2OutputMemo, setSystem2OutputMemo] = useState<string | null>(null);

  // Code Tab Language
  const [sdkLanguage, setSdkLanguage] = useState<'typescript' | 'python' | 'curl'>('typescript');

  // Handle Pipeline switch in Studio
  const handleSelectPipeline = (pipelineId: string) => {
    setJevActivePipelineId(pipelineId);
    const p = jevPipelines.find(pipe => pipe.id === pipelineId);
    if (p) {
      setSelectedQuestionId(p.questions[0].id);
      setCustomStateJson(JSON.stringify(p.sampleState, null, 2));
    }
  };

  // Run Studio Evaluation
  const handleRunStudioInference = async () => {
    try {
      setIsExecutingStudio(true);
      const parsedState = JSON.parse(customStateJson);
      const result = await handleExecuteJevEvaluation(activePipeline.id, parsedState, selectedQuestion);
      setLatestStudioResult(result);
    } catch (err: any) {
      alert(`Invalid JSON State: ${err.message}`);
    } finally {
      setIsExecutingStudio(false);
    }
  };

  // Run Batch Simulation
  const handleTriggerBatchSimulation = () => {
    setIsSimulatingBatch(true);
    setTimeout(() => {
      handleRunJevBatchSimulation(batchStpThreshold);
      setIsSimulatingBatch(false);
      setBatchFeedbackMsg(`Evaluated 16 transactions across non-autoregressive nodes at ${(batchStpThreshold * 100).toFixed(0)}% STP threshold.`);
      setTimeout(() => setBatchFeedbackMsg(null), 4000);
    }, 350);
  };

  // Run System 2 Escalation
  const handleRunSystem2Escalation = async () => {
    setIsGeneratingSystem2(true);
    const memo = await handleTriggerSystem2Escalation(selectedEscalationRecordId, system2CustomMemo || undefined);
    setSystem2OutputMemo(memo);
    setIsGeneratingSystem2(false);
  };

  // Filtered batch records
  const filteredBatchRecords = jevBatchRecords.filter(r => {
    if (batchFilter === 'ALL') return true;
    return r.stpStatus === batchFilter;
  });

  // Batch Statistics
  const totalBatchCount = jevBatchRecords.length;
  const stpCommittedCount = jevBatchRecords.filter(r => r.stpStatus === 'STP_COMMITTED').length;
  const escalatedCount = jevBatchRecords.filter(r => r.stpStatus === 'ESCALATED_TO_SYSTEM2').length;
  const pendingCount = jevBatchRecords.filter(r => r.stpStatus === 'PENDING_HUMAN_REVIEW').length;
  const stpRate = ((stpCommittedCount / totalBatchCount) * 100).toFixed(1);
  const avgBatchLatency = (jevBatchRecords.reduce((acc, r) => acc + r.latencyMs, 0) / totalBatchCount).toFixed(0);
  const totalBatchCost = (jevBatchRecords.reduce((acc, r) => acc + r.executionCostUsd, 0)).toFixed(6);

  // Formatter for Currency
  const fmtInr = (amt: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amt);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Telemetry Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 text-white shadow-xl border border-indigo-500/20">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-400 to-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                <JevIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="text-2xl font-bold tracking-tight text-white">Jev.ai System One Engine</h1>
                  <span className="px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    TypeSafe Non-Autoregressive
                  </span>
                  <span className="px-2 py-0.5 text-xs font-mono rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    v1.0.4 Production
                  </span>
                </div>
                <p className="text-sm text-slate-300 mt-0.5">
                  High-speed, calibrated decision layer trained with RLCD. Single-pass inference for autonomous accounting, STP ledger routing & NBFC regulatory guardrails.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Metrics Ribbon */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-800/80 backdrop-blur-md p-3 rounded-xl border border-slate-700/60">
            <div className="px-3 py-1">
              <div className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Latency (Single Pass)</div>
              <div className="text-lg font-bold text-amber-400 flex items-center gap-1">
                <span>&lt; 42 ms</span>
                <span className="text-[10px] text-emerald-400 font-normal">(-98% vs LLM)</span>
              </div>
            </div>
            <div className="px-3 py-1 border-l border-slate-700">
              <div className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Pricing Structure</div>
              <div className="text-lg font-bold text-emerald-400">
                $0.042 <span className="text-xs text-slate-300 font-normal">/ 1M in (Free Out)</span>
              </div>
            </div>
            <div className="px-3 py-1 border-l border-slate-700">
              <div className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">RLCD Calibration</div>
              <div className="text-lg font-bold text-cyan-400">
                ECE 0.018 <span className="text-[10px] text-slate-300 font-normal">(99.2% match)</span>
              </div>
            </div>
            <div className="px-3 py-1 border-l border-slate-700">
              <div className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Autonomous STP</div>
              <div className="text-lg font-bold text-indigo-300">
                {stpRate}% <span className="text-xs text-slate-400 font-normal">Rate</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mt-6 pt-5 border-t border-slate-800">
          <button
            onClick={() => setActiveTab('studio')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center space-x-2 ${
              activeTab === 'studio'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <JevIcon className="w-4 h-4 text-amber-400" />
            <span>System One Decision Studio</span>
          </button>

          <button
            onClick={() => setActiveTab('sentinels')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center space-x-2 ${
              activeTab === 'sentinels'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <ShieldIcon className="w-4 h-4 text-emerald-400" />
            <span>Autonomous Sentinels ({jevPipelines.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('hybrid')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center space-x-2 ${
              activeTab === 'hybrid'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <AiIcon className="w-4 h-4 text-cyan-400" />
            <span>System 1 + System 2 Orchestrator</span>
          </button>

          <button
            onClick={() => setActiveTab('batch')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center space-x-2 ${
              activeTab === 'batch'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <AccountingIcon className="w-4 h-4 text-indigo-400" />
            <span>Batch Simulation & Calibration Matrix</span>
          </button>

          <button
            onClick={() => setActiveTab('sdk')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center space-x-2 ${
              activeTab === 'sdk'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <span className="font-mono text-xs font-bold text-amber-400">&lt;/&gt;</span>
            <span>TypeSafe Jev SDK & Hub</span>
          </button>
        </div>
      </div>

      {/* ========================================================== */}
      {/* TAB 1: SYSTEM ONE DECISION STUDIO (INTERACTIVE PLAYGROUND) */}
      {/* ========================================================== */}
      {activeTab === 'studio' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Panel: State & Schema Configuration */}
          <div className="lg:col-span-6 space-y-5">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <span>1. Select Jev Pipeline & State Preset</span>
                  </h2>
                  <p className="text-xs text-slate-500">Pick an enterprise accounting or NBFC domain state</p>
                </div>
                <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                  {activePipeline.category}
                </span>
              </div>

              {/* Pipeline Selector */}
              <div className="mt-4 space-y-2">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Target Evaluation Pipeline
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {jevPipelines.map(pipe => (
                    <button
                      key={pipe.id}
                      onClick={() => handleSelectPipeline(pipe.id)}
                      className={`text-left p-3 rounded-xl border transition-all ${
                        pipe.id === activePipeline.id
                          ? 'border-indigo-600 bg-indigo-50/60 shadow-sm ring-1 ring-indigo-500'
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="font-semibold text-xs text-slate-900 line-clamp-1">{pipe.name}</div>
                      <div className="text-[11px] text-slate-500 mt-1 flex items-center justify-between">
                        <span>Tag: {pipe.tag}</span>
                        <span className="font-mono text-emerald-600">{pipe.latencyAvgMs}ms</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Typed Question Selection */}
              <div className="mt-5 space-y-2">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider flex items-center justify-between">
                  <span>2. Typed Question Schema</span>
                  <span className="text-indigo-600 lowercase font-mono">primitive: {selectedQuestion.type}</span>
                </label>
                <div className="space-y-2">
                  {activePipeline.questions.map(q => (
                    <button
                      key={q.id}
                      onClick={() => setSelectedQuestionId(q.id)}
                      className={`w-full text-left p-3 rounded-xl border flex items-center justify-between transition-all ${
                        q.id === selectedQuestion.id
                          ? 'border-indigo-600 bg-indigo-50/40 shadow-sm'
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="pr-3">
                        <div className="text-xs font-medium text-slate-800">{q.question}</div>
                        <div className="text-[11px] text-slate-500 mt-0.5">{q.description}</div>
                      </div>
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase tracking-wider font-mono ${
                        q.type === 'choice'
                          ? 'bg-blue-100 text-blue-800'
                          : q.type === 'noul'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {q.type}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* State JSON Payload Editor */}
              <div className="mt-5 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    3. Payload State (JSON or Unstructured State)
                  </label>
                  <button
                    onClick={() => setCustomStateJson(JSON.stringify(activePipeline.sampleState, null, 2))}
                    className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
                  >
                    Reset to Default State
                  </button>
                </div>
                <textarea
                  value={customStateJson}
                  onChange={e => setCustomStateJson(e.target.value)}
                  rows={8}
                  className="w-full font-mono text-xs p-3.5 rounded-xl border border-slate-300 bg-slate-900 text-emerald-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-inner"
                  spellCheck={false}
                />
              </div>

              {/* Action Buttons */}
              <div className="mt-5 flex items-center justify-between pt-4 border-t border-slate-100">
                <div className="text-xs text-slate-500 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>Non-Autoregressive Jev Node Ready</span>
                </div>
                <button
                  onClick={handleRunStudioInference}
                  disabled={isExecutingStudio}
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/30 flex items-center space-x-2 transition-all disabled:opacity-50"
                >
                  <JevIcon className="w-4 h-4 text-amber-400" />
                  <span>{isExecutingStudio ? 'Evaluating (Single-Pass)...' : 'Execute System One Inference'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Panel: Instant Execution Trace & Probability Calibration */}
          <div className="lg:col-span-6 space-y-5">
            {latestStudioResult ? (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-5">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Jev System One Execution Result
                    </span>
                    <h3 className="text-base font-bold text-slate-900 line-clamp-1 mt-0.5">
                      {latestStudioResult.title}
                    </h3>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    latestStudioResult.stpStatus === 'STP_APPROVED'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : latestStudioResult.stpStatus === 'REJECTED_BY_GUARDRAIL'
                      ? 'bg-red-100 text-red-800 border border-red-300'
                      : 'bg-amber-100 text-amber-800 border border-amber-300'
                  }`}>
                    {latestStudioResult.stpStatus.replace(/_/g, ' ')}
                  </span>
                </div>

                {/* Primary Decision Banner */}
                <div className="p-4 rounded-xl bg-slate-900 text-white space-y-3 shadow-md">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="font-semibold uppercase tracking-wider">Deterministic Output</span>
                    <span className="font-mono text-amber-400">{latestStudioResult.decisionType.toUpperCase()} PRIMITIVE</span>
                  </div>

                  <div className="text-xl font-bold text-emerald-400">
                    {String(latestStudioResult.answer)}
                  </div>

                  <div className="grid grid-cols-3 gap-3 pt-3 border-t border-slate-800 text-xs">
                    <div>
                      <div className="text-slate-400">Calibrated Confidence</div>
                      <div className="text-base font-bold text-cyan-300">
                        {(latestStudioResult.confidence * 100).toFixed(1)}%
                      </div>
                    </div>
                    <div>
                      <div className="text-slate-400">Execution Latency</div>
                      <div className="text-base font-bold text-amber-400">
                        {latestStudioResult.latencyMs} ms
                      </div>
                    </div>
                    <div>
                      <div className="text-slate-400">Inference Cost</div>
                      <div className="text-base font-bold text-emerald-300">
                        ${latestStudioResult.costUsd.toFixed(6)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Calibrated Probability Distribution Graph */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                    <span>RLCD Calibrated Probability Distribution</span>
                    <span className="text-slate-500 font-normal">Sum: 1.000 (100%)</span>
                  </div>

                  <div className="space-y-2.5">
                    {Object.entries(latestStudioResult.probabilities).map(([key, prob]) => {
                      const pct = Math.min(100, Math.max(0, (prob as any) * 100));
                      const isWinning = String(latestStudioResult.answer) === key;
                      return (
                        <div key={key} className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className={`font-medium line-clamp-1 ${isWinning ? 'text-indigo-950 font-bold' : 'text-slate-600'}`}>
                              {key}
                            </span>
                            <span className="font-mono font-semibold text-slate-800">
                              {((prob as any) * 100).toFixed(2)}%
                            </span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                            <div
                              className={`h-2 rounded-full transition-all duration-500 ${
                                isWinning
                                  ? 'bg-gradient-to-r from-indigo-500 to-emerald-500'
                                  : 'bg-slate-300'
                              }`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* System 2 Hybrid Escalation Notice if triggered */}
                {latestStudioResult.system2Triggered && (
                  <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 space-y-2">
                    <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-amber-800">
                      <AiIcon className="w-4 h-4 text-amber-600" />
                      <span>System 2 (Gemini Deep Reasoning) Auto-Triggered</span>
                    </div>
                    <p className="text-xs leading-relaxed text-amber-800">
                      {latestStudioResult.system2Explanation}
                    </p>
                  </div>
                )}

                {/* Audit & Compliance Trace */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-600 space-y-1.5 font-mono">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Timestamp:</span>
                    <span>{latestStudioResult.timestamp}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Input Tokens:</span>
                    <span>{latestStudioResult.inputTokens} Tokens</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Pricing Model:</span>
                    <span>Jev Single-Pass @ $0.042/1M (Free Output Tokens)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Architecture:</span>
                    <span>Non-Autoregressive Transformer with RLCD Calibration</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-slate-200 space-y-4">
                <div className="w-16 h-16 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
                  <JevIcon className="w-8 h-8 text-amber-500" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-800">No Studio Run Executed Yet</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                    Select a pipeline and click "Execute System One Inference" to evaluate live non-autoregressive decisions in sub-50ms.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================== */}
      {/* TAB 2: AUTONOMOUS ACCOUNTING & NBFC SENTINEL PIPELINES     */}
      {/* ========================================================== */}
      {activeTab === 'sentinels' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-slate-100">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Configured Jev Production Sentinels
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Pre-compiled System One pipelines executing continuous policy enforcement, STP GL coding, and RBI prudential checks.
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  {jevPipelines.filter(p => p.status === 'Active').length} Active Pipelines
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-6">
              {jevPipelines.map(pipeline => (
                <div
                  key={pipeline.id}
                  className="p-5 rounded-2xl border border-slate-200 hover:border-indigo-400 transition-all bg-white hover:shadow-md flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <span className="px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                        {pipeline.tag}
                      </span>
                      <button
                        onClick={() =>
                          handleUpdateJevPipelineStatus(
                            pipeline.id,
                            pipeline.status === 'Active' ? 'Paused' : 'Active'
                          )
                        }
                        className={`px-2.5 py-0.5 text-xs font-semibold rounded-full transition-all ${
                          pipeline.status === 'Active'
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {pipeline.status}
                      </button>
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-slate-900 line-clamp-1">{pipeline.name}</h3>
                      <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                        {pipeline.description}
                      </p>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl space-y-1.5 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Domain Category:</span>
                        <span className="font-semibold text-slate-800">{pipeline.category}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Inference Speed:</span>
                        <span className="font-mono font-bold text-amber-600">{pipeline.latencyAvgMs} ms</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Cost Savings vs LLM:</span>
                        <span className="font-mono font-bold text-emerald-600">+{pipeline.costSavingsPct}%</span>
                      </div>
                      <div className="flex justify-between items-center pt-1 border-t border-slate-200/60">
                        <span className="text-slate-500">STP Threshold:</span>
                        <span className="font-bold text-indigo-700">
                          {(pipeline.stpConfidenceThreshold * 100).toFixed(0)}% Confidence
                        </span>
                      </div>
                    </div>

                    {/* Questions in Pipeline */}
                    <div className="space-y-1">
                      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        Active Questions ({pipeline.questions.length})
                      </div>
                      {pipeline.questions.map(q => (
                        <div key={q.id} className="text-xs text-slate-700 flex items-center justify-between py-0.5">
                          <span className="truncate pr-2">• {q.question}</span>
                          <span className="font-mono text-[10px] text-slate-500 uppercase">{q.type}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <button
                      onClick={() => {
                        handleSelectPipeline(pipeline.id);
                        setActiveTab('studio');
                      }}
                      className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                    >
                      <span>Open in Studio</span>
                      <span>→</span>
                    </button>

                    <div className="flex items-center space-x-1.5">
                      <button
                        onClick={() => {
                          const newThresh = Math.max(0.85, Number((pipeline.stpConfidenceThreshold - 0.02).toFixed(2)));
                          handleUpdateStpThreshold(pipeline.id, newThresh);
                        }}
                        className="w-6 h-6 rounded bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 flex items-center justify-center"
                        title="Decrease STP threshold"
                      >
                        -
                      </button>
                      <button
                        onClick={() => {
                          const newThresh = Math.min(0.99, Number((pipeline.stpConfidenceThreshold + 0.02).toFixed(2)));
                          handleUpdateStpThreshold(pipeline.id, newThresh);
                        }}
                        className="w-6 h-6 rounded bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 flex items-center justify-center"
                        title="Increase STP threshold"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================== */}
      {/* TAB 3: SYSTEM 1 + SYSTEM 2 DUAL-ENGINE ORCHESTRATOR       */}
      {/* ========================================================== */}
      {activeTab === 'hybrid' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                System 1 (Jev) + System 2 (Gemini) Dual-Engine Framework
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Inspired by Daniel Kahneman's cognitive architecture: Jev acts as the instant, reflexive System 1 for high-volume deterministic triage, while Gemini acts as the deliberative System 2 for complex exception reasoning.
              </p>
            </div>

            {/* Architecture Flow Diagram */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white">
              {/* Box 1: Ingestion & System 1 */}
              <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 space-y-2">
                <div className="flex items-center space-x-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
                  <JevIcon className="w-4 h-4 text-amber-400" />
                  <span>Phase 1: System 1 (Jev)</span>
                </div>
                <div className="text-sm font-semibold text-white">Non-Autoregressive Triage</div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Evaluates 100% of incoming vouchers, bank feeds & loan origination events in single pass (&lt;50ms, $0.042/1M tokens).
                </p>
                <div className="text-[11px] text-emerald-400 font-mono">
                  ✓ ~90-95% Straight-Through-Processed (STP)
                </div>
              </div>

              {/* Box 2: Guardrail & Calibrated Threshold */}
              <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 space-y-2">
                <div className="flex items-center space-x-2 text-xs font-bold text-cyan-400 uppercase tracking-wider">
                  <ShieldIcon className="w-4 h-4 text-cyan-400" />
                  <span>Phase 2: RLCD Guardrail</span>
                </div>
                <div className="text-sm font-semibold text-white">Confidence & Noul Gatekeeper</div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  If confidence &ge; 95% and Noul (Risk Flag) = False &rarr; Instant ledger commit. If confidence &lt; 95% or Noul = True &rarr; Escalate!
                </p>
                <div className="text-[11px] text-amber-400 font-mono">
                  ⚠ ~5-10% Selective Escalation
                </div>
              </div>

              {/* Box 3: System 2 Deep Reasoning */}
              <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 space-y-2">
                <div className="flex items-center space-x-2 text-xs font-bold text-indigo-400 uppercase tracking-wider">
                  <AiIcon className="w-4 h-4 text-indigo-400" />
                  <span>Phase 3: System 2 (Gemini)</span>
                </div>
                <div className="text-sm font-semibold text-white">Deliberative Audit Memo</div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Synthesizes statutory reasoning, citations (RBI/IND AS 109/TDS), and compiles human-in-the-loop audit documentation.
                </p>
                <div className="text-[11px] text-indigo-300 font-mono">
                  ✓ Full Legal & Regulatory Compliance
                </div>
              </div>
            </div>

            {/* Interactive Escalation Simulator */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-4 border-t border-slate-100">
              <div className="lg:col-span-5 space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Select Flagged Record to Escalate
                  </label>
                  <select
                    value={selectedEscalationRecordId}
                    onChange={e => setSelectedEscalationRecordId(e.target.value)}
                    className="w-full text-xs p-3 rounded-xl border border-slate-300 bg-white font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    {jevBatchRecords.map(rec => (
                      <option key={rec.id} value={rec.id}>
                        {rec.referenceNumber} - {rec.partyName} ({fmtInr(rec.amount)}) [Risk: {rec.riskScore}/100]
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Auditor / Compliance Custom Prompt Overlay (Optional)
                  </label>
                  <textarea
                    value={system2CustomMemo}
                    onChange={e => setSystem2CustomMemo(e.target.value)}
                    placeholder="e.g. Cross-examine FEMA Section 10(4) compliance and check beneficial ownership against MCA registry..."
                    rows={4}
                    className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <button
                  onClick={handleRunSystem2Escalation}
                  disabled={isGeneratingSystem2}
                  className="w-full py-3 rounded-xl text-sm font-semibold bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white shadow-md shadow-indigo-600/30 flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
                >
                  <AiIcon className="w-4 h-4 text-cyan-300" />
                  <span>{isGeneratingSystem2 ? 'Synthesizing Deliberative Audit Memo...' : 'Trigger System 2 Deliberative Reasoning'}</span>
                </button>
              </div>

              <div className="lg:col-span-7">
                <div className="h-full bg-slate-900 rounded-2xl p-5 text-white flex flex-col justify-between border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <span className="text-xs font-mono uppercase text-slate-400">
                      System 2 Statutory Reasoning Output
                    </span>
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      Chain of Thought Synthesis
                    </span>
                  </div>

                  <div className="flex-1 font-mono text-xs text-slate-200 whitespace-pre-wrap leading-relaxed overflow-y-auto max-h-72 p-2">
                    {system2OutputMemo || (
                      <span className="text-slate-500 italic">
                        Select an escalated record and click "Trigger System 2 Deliberative Reasoning" to generate deep statutory and accounting rationale.
                      </span>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                    <span>Integration: System 1 (Jev Fast) + System 2 (Gemini Deep)</span>
                    <span className="text-emerald-400">Audit-Ready Documentation</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================== */}
      {/* TAB 4: BATCH SIMULATION & CALIBRATION MATRIX              */}
      {/* ========================================================== */}
      {activeTab === 'batch' && (
        <div className="space-y-6">
          {/* Batch Controls & Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Evaluated Batch</div>
              <div className="text-2xl font-bold text-slate-900">{totalBatchCount} Records</div>
              <div className="text-xs text-slate-500 font-mono">100% Ingested in &lt; 700ms</div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">STP Auto-Committed</div>
              <div className="text-2xl font-bold text-emerald-600">{stpCommittedCount} ({stpRate}%)</div>
              <div className="text-xs text-emerald-700">Straight-Through to General Ledger</div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">System 2 Escalations</div>
              <div className="text-2xl font-bold text-amber-600">{escalatedCount} Flags</div>
              <div className="text-xs text-amber-700">Noul Guardrail / High Risk Breaches</div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Batch Inference Cost</div>
              <div className="text-2xl font-bold text-indigo-600">${totalBatchCost}</div>
              <div className="text-xs text-slate-500">vs $0.48 on GPT-4 / Claude (99.98% savings)</div>
            </div>
          </div>

          {/* Interactive Batch Toolbar */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-5">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block">
                    STP Confidence Threshold: {(batchStpThreshold * 100).toFixed(0)}%
                  </label>
                  <input
                    type="range"
                    min="0.80"
                    max="0.99"
                    step="0.01"
                    value={batchStpThreshold}
                    onChange={e => setBatchStpThreshold(parseFloat(e.target.value))}
                    className="w-48 accent-indigo-600 mt-1 cursor-pointer"
                  />
                </div>

                <button
                  onClick={handleTriggerBatchSimulation}
                  disabled={isSimulatingBatch}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-all disabled:opacity-50"
                >
                  {isSimulatingBatch ? 'Simulating...' : 'Re-Evaluate Batch Pipeline'}
                </button>
              </div>

              {/* Status Filter */}
              <div className="flex flex-wrap gap-1.5">
                {(['ALL', 'STP_COMMITTED', 'ESCALATED_TO_SYSTEM2', 'PENDING_HUMAN_REVIEW'] as const).map(flt => (
                  <button
                    key={flt}
                    onClick={() => setBatchFilter(flt)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      batchFilter === flt
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {flt.replace(/_/g, ' ')}
                  </button>
                ))}
              </div>
            </div>

            {batchFeedbackMsg && (
              <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200 flex items-center justify-between">
                <span>✓ {batchFeedbackMsg}</span>
                <span className="font-mono text-[10px]">Avg Latency: {avgBatchLatency}ms</span>
              </div>
            )}

            {/* Batch Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase tracking-wider text-[11px]">
                    <th className="py-3 px-3">Voucher Ref</th>
                    <th className="py-3 px-3">Counterparty & Transaction</th>
                    <th className="py-3 px-3">Amount</th>
                    <th className="py-3 px-3">Predicted GL Account</th>
                    <th className="py-3 px-3">Calibrated Conf</th>
                    <th className="py-3 px-3">Risk Score</th>
                    <th className="py-3 px-3">STP Status</th>
                    <th className="py-3 px-3">Latency</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredBatchRecords.map(rec => (
                    <tr key={rec.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-3 font-mono text-indigo-700 font-bold">
                        {rec.referenceNumber}
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-bold text-slate-900">{rec.partyName}</div>
                        <div className="text-[11px] text-slate-500">{rec.transactionType}</div>
                      </td>
                      <td className="py-3 px-3 font-semibold text-slate-900">
                        {fmtInr(rec.amount)}
                      </td>
                      <td className="py-3 px-3 text-slate-700 max-w-xs truncate">
                        {rec.predictedGlAccount}
                      </td>
                      <td className="py-3 px-3">
                        <span className={`font-mono font-bold ${
                          rec.choiceConfidence >= 0.95 ? 'text-emerald-600' : 'text-amber-600'
                        }`}>
                          {(rec.choiceConfidence * 100).toFixed(1)}%
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                          rec.riskScore > 70
                            ? 'bg-red-100 text-red-800'
                            : rec.riskScore > 30
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {rec.riskScore}/100
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          rec.stpStatus === 'STP_COMMITTED'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : rec.stpStatus === 'ESCALATED_TO_SYSTEM2'
                            ? 'bg-red-100 text-red-800 border border-red-200'
                            : 'bg-amber-100 text-amber-800 border border-amber-200'
                        }`}>
                          {rec.stpStatus.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-mono text-slate-500">
                        {rec.latencyMs}ms
                      </td>
                      <td className="py-3 px-3 text-right">
                        {rec.stpStatus === 'STP_COMMITTED' ? (
                          <button
                            onClick={() => handleCommitStpRecord(rec.id)}
                            className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
                          >
                            Commit to GL
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              setSelectedEscalationRecordId(rec.id);
                              setActiveTab('hybrid');
                            }}
                            className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700"
                          >
                            Investigate
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* RLCD Reliability & Calibration Matrix */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-slate-100 gap-2">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  RLCD Probability Calibration Curve & Reliability Matrix
                </h3>
                <p className="text-xs text-slate-500">
                  Reinforcement Learning for Calibrated Decisions (RLCD): When Jev outputs 92% confidence, it is empirically correct 92% of the time.
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  Expected Calibration Error (ECE): 0.018 (Top-Tier)
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase text-[10px]">
                      <th className="py-2.5 px-3">Confidence Bin</th>
                      <th className="py-2.5 px-3">Midpoint P(Y)</th>
                      <th className="py-2.5 px-3">Observed Accuracy</th>
                      <th className="py-2.5 px-3">Sample Count</th>
                      <th className="py-2.5 px-3 text-right">Delta</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                    {jevCalibrationBuckets.map(bin => {
                      const delta = Math.abs(bin.confidenceMidpoint - bin.empiricalAccuracy);
                      return (
                        <tr key={bin.binRange} className="hover:bg-slate-50">
                          <td className="py-2 px-3 font-semibold text-slate-800">{bin.binRange}</td>
                          <td className="py-2 px-3 text-indigo-700">{(bin.confidenceMidpoint * 100).toFixed(1)}%</td>
                          <td className="py-2 px-3 font-bold text-emerald-700">{(bin.empiricalAccuracy * 100).toFixed(1)}%</td>
                          <td className="py-2 px-3 text-slate-500">{bin.sampleCount.toLocaleString()}</td>
                          <td className="py-2 px-3 text-right text-slate-600 font-semibold">
                            {(delta * 100).toFixed(2)}%
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Calibration Bar Visualizer */}
              <div className="p-4 bg-slate-50 rounded-xl space-y-3 flex flex-col justify-center">
                <div className="text-xs font-bold text-slate-800">Reliability Alignment Visualizer</div>
                <div className="space-y-2">
                  {jevCalibrationBuckets.slice(4).map(bin => (
                    <div key={bin.binRange} className="space-y-1">
                      <div className="flex justify-between text-[11px]">
                        <span className="font-semibold text-slate-700">Bin: {bin.binRange}</span>
                        <span className="font-mono text-emerald-700 font-bold">
                          Actual: {(bin.empiricalAccuracy * 100).toFixed(1)}% (Target: {(bin.confidenceMidpoint * 100).toFixed(1)}%)
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2.5 flex overflow-hidden">
                        <div
                          className="bg-indigo-600 h-2.5"
                          style={{ width: `${bin.confidenceMidpoint * 100}%` }}
                        />
                        <div
                          className="bg-emerald-500 h-2.5 -ml-1 opacity-80"
                          style={{ width: `${bin.empiricalAccuracy * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-[11px] text-slate-500 italic mt-2">
                  * Indigo bar: Predicted confidence | Green overlay: Observed empirical accuracy. Tight alignment guarantees safe automated financial actions.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================== */}
      {/* TAB 5: TYPESAFE JEV SDK & DEVELOPER API HUB               */}
      {/* ========================================================== */}
      {activeTab === 'sdk' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-slate-100 gap-3">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  TypeSafe Jev SDK & API Integration
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Embed sub-50ms deterministic decisions into your core banking, ERP, loan origination, and accounting pipelines.
                </p>
              </div>

              {/* Language Selector */}
              <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl">
                {(['typescript', 'python', 'curl'] as const).map(lang => (
                  <button
                    key={lang}
                    onClick={() => setSdkLanguage(lang)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                      sdkLanguage === lang
                        ? 'bg-white text-indigo-700 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>

            {/* Code Snippet Box */}
            <div className="rounded-2xl bg-slate-950 p-5 text-emerald-400 font-mono text-xs overflow-x-auto shadow-inner border border-slate-800">
              {sdkLanguage === 'typescript' && (
                <pre>{`// 1. Install TypeSafe Jev Client
// npm install @typesafe/jev

import { JevClient } from '@typesafe/jev';

const jev = new JevClient({
  apiKey: process.env.JEV_API_KEY, // Typesafe API token
  endpoint: 'https://api.typesafe.ai/v1'
});

// 2. Execute Sub-50ms System One Single-Pass Inference
async function runAutonomousGeneralLedgerTriage(transactionPayload: any) {
  const result = await jev.evaluate({
    state: transactionPayload,
    questions: [
      {
        id: 'q1',
        question: 'Predict Standard Chart of Accounts (COA) Account Code for inbound transaction',
        type: 'choice',
        options: [
          '5100 - Cloud Infrastructure & Server Hosting',
          '5200 - Software Subscriptions & SaaS Licenses',
          '2100 - Trade Accounts Payable',
          '4100 - Operating Revenue'
        ]
      },
      {
        id: 'q2',
        question: 'Requires manual senior controller review (P > 0.05 indicates exception)?',
        type: 'noul',
        threshold: 0.50
      },
      {
        id: 'q3',
        question: 'Audit Confidence & Documentation Quality Score (0-100)',
        type: 'score',
        scale: [0, 100]
      }
    ]
  });

  console.log('Jev Latency:', result.latencyMs, 'ms');
  console.log('Calibrated Confidence:', result.decisions['q1'].confidence);

  // 3. Autonomous Straight-Through-Processing (STP) Guardrail
  if (result.decisions['q1'].confidence >= 0.95 && !result.decisions['q2'].answer) {
    await commitToLedger({
      account: result.decisions['q1'].answer,
      amount: transactionPayload.amount,
      stp: true
    });
  } else {
    // Escalate edge case to System 2 (Gemini) for deep reasoning
    await routeToSeniorAuditor(transactionPayload, result);
  }
}`}</pre>
              )}

              {sdkLanguage === 'python' && (
                <pre>{`# 1. Install TypeSafe AI Python Library
# pip install typesafe-ai

from typesafe_ai import JevClient

client = JevClient(api_key="typesafe_sk_live_99481")

# 2. Evaluate State with Typed Questions
response = client.evaluate(
    state={
        "borrower_pan": "AAACF9821K",
        "proposed_sanction": 45000000,
        "existing_exposure": 82000000,
        "tier1_capital": 750000000,
        "sector": "Infrastructure"
    },
    questions=[
        {
            "id": "rbi_ceiling",
            "question": "Violates RBI Single Borrower Exposure Limit (20% Tier 1 Capital)?",
            "type": "noul"
        },
        {
            "id": "asset_class",
            "question": "Asset Classification Bucket under SBR Scale Based Regulation",
            "type": "choice",
            "options": ["Standard - Performing", "SMA-0", "SMA-1", "SMA-2", "NPA"]
        }
    ]
)

# 3. Handle High-Speed Deterministic Result
print("P(Ceiling Violation):", response["rbi_ceiling"].probabilities["Yes"])
print("Latency:", response.latency_ms, "ms")`}</pre>
              )}

              {sdkLanguage === 'curl' && (
                <pre>{`curl -X POST https://api.typesafe.ai/v1/jev/evaluate \\
  -H "Authorization: Bearer \${JEV_API_KEY}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "state": {
      "narration": "ACH AWS CLOUD EMEA EUR 14,200",
      "amount": 1285000,
      "counterparty": "Amazon Web Services Inc"
    },
    "questions": [
      {
        "id": "gl_code",
        "question": "Predict Standard Chart of Accounts (COA) Account Code",
        "type": "choice",
        "options": [
          "5100 - Cloud Infrastructure & Server Hosting",
          "5200 - Software Subscriptions & SaaS Licenses",
          "2100 - Trade Accounts Payable"
        ]
      }
    ]
  }'`}</pre>
              )}
            </div>

            {/* Architecture Comparison Table */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <h3 className="text-sm font-bold text-slate-900">
                Architectural Benchmark: Jev System One vs Traditional Autoregressive LLMs
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 uppercase text-[10px]">
                      <th className="py-2 px-3">Metric / Capability</th>
                      <th className="py-2 px-3 font-bold text-indigo-700">Jev.ai (System One)</th>
                      <th className="py-2 px-3">Autoregressive LLM (GPT-4 / Claude)</th>
                      <th className="py-2 px-3">Rule Engines / Regex</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    <tr>
                      <td className="py-2.5 px-3 font-semibold">Inference Latency</td>
                      <td className="py-2.5 px-3 font-mono font-bold text-emerald-600">&lt; 40 - 70 ms</td>
                      <td className="py-2.5 px-3 text-slate-500">1,200 - 4,500 ms (Token-by-token)</td>
                      <td className="py-2.5 px-3 text-slate-500">&lt; 10 ms</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-semibold">Pricing Model</td>
                      <td className="py-2.5 px-3 font-mono font-bold text-emerald-600">$0.042/1M in (Free Out)</td>
                      <td className="py-2.5 px-3 text-slate-500">$5.00 - $30.00 / 1M tokens</td>
                      <td className="py-2.5 px-3 text-slate-500">Free CPU compute</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-semibold">Probability Calibration (RLCD)</td>
                      <td className="py-2.5 px-3 font-bold text-cyan-700">Calibrated Empirical Accuracy</td>
                      <td className="py-2.5 px-3 text-slate-500">Uncalibrated Logits / Overconfident</td>
                      <td className="py-2.5 px-3 text-slate-500">Binary 0 or 1 (No Uncertainty)</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-semibold">Hallucination Risk</td>
                      <td className="py-2.5 px-3 font-bold text-emerald-700">0.00% (Strict Typed Enums)</td>
                      <td className="py-2.5 px-3 text-slate-500">2% - 8% Text Hallucinations</td>
                      <td className="py-2.5 px-3 text-slate-500">0.00%</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-semibold">Unstructured Semantic Handling</td>
                      <td className="py-2.5 px-3 font-bold text-indigo-700">High (Transformer Embedded)</td>
                      <td className="py-2.5 px-3 text-slate-500">Very High</td>
                      <td className="py-2.5 px-3 text-slate-500">Brittle (Breaks on Variations)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JevAi;
