import React, { useState, useRef, useEffect } from 'react';
import { useAppContext } from '../AppContext';
import { 
  BusinessKpi, 
  BusinessStrategyGoal, 
  BusinessAssistantMessage 
} from './types';
import { 
  TrendingUp, 
  Target, 
  MessageSquare, 
  Zap, 
  ArrowRight, 
  BarChart3, 
  Lightbulb, 
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertCircle,
  BrainCircuit,
  PieChart,
  LayoutDashboard,
  Calendar,
  Send
} from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

const BusinessAssistant: React.FC = () => {
  const { 
    businessKpis, 
    businessStrategyGoals, 
    businessAssistantHistory,
    handleSendBusinessAssistantMessage 
  } = useAppContext();

  const [activeTab, setActiveTab] = useState<'strategy' | 'chat' | 'kpis'>('strategy');
  const [chatMessage, setChatMessage] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [businessAssistantHistory]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    setIsChatLoading(true);
    await handleSendBusinessAssistantMessage(chatMessage);
    setChatMessage('');
    setIsChatLoading(false);
  };

  const getGoalStatusStyle = (status: BusinessStrategyGoal['status']) => {
    switch (status) {
      case 'completed': return 'text-emerald-500 bg-emerald-50 border-emerald-100';
      case 'in_progress': return 'text-blue-500 bg-blue-50 border-blue-100';
      case 'on_hold': return 'text-amber-500 bg-amber-50 border-amber-100';
      default: return 'text-slate-500 bg-slate-50 border-slate-100';
    }
  };

  const getPriorityStyle = (priority: BusinessStrategyGoal['priority']) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-amber-600 bg-amber-50';
      case 'low': return 'text-slate-600 bg-slate-50';
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 overflow-hidden">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-indigo-600 rounded-lg text-white shadow-lg shadow-indigo-200">
            <BrainCircuit className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 leading-none">Business Strategy Assistant</h1>
            <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-semibold">AI-Powered Management & Advisory</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full border border-indigo-100">
            <Zap className="w-4 h-4 mr-1.5" />
            <span className="text-xs font-medium">Real-time Portfolio Analysis Active</span>
          </div>
          <button 
            onClick={() => setActiveTab('chat')}
            className="flex items-center px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors shadow-sm"
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Consult Strategy AI
          </button>
        </div>
      </header>

      {/* Navigation */}
      <div className="bg-white border-b border-slate-200 px-6">
        <div className="flex space-x-8 overflow-x-auto no-scrollbar">
          {[
            { id: 'strategy', label: 'Strategy Board', icon: LayoutDashboard },
            { id: 'kpis', label: 'Performance Metrics', icon: BarChart3 },
            { id: 'chat', label: 'Advisory Chat', icon: MessageSquare }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 py-4 border-b-2 text-sm font-medium transition-all ${
                activeTab === tab.id 
                  ? 'border-indigo-600 text-indigo-600' 
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === 'strategy' && (
          <div className="max-w-7xl mx-auto space-y-6">
            {/* KPI Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {businessKpis.map(kpi => (
                <div key={kpi.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider">{kpi.label}</h3>
                    <div className={`p-1 rounded ${
                      kpi.trend === 'up' ? 'text-emerald-600 bg-emerald-50' : 
                      kpi.trend === 'down' ? 'text-red-600 bg-red-50' : 
                      'text-slate-600 bg-slate-50'
                    }`}>
                      <TrendingUp className={`w-4 h-4 ${kpi.trend === 'down' ? 'rotate-180' : kpi.trend === 'neutral' ? 'rotate-90' : ''}`} />
                    </div>
                  </div>
                  <div className="flex items-baseline space-x-1">
                    <p className="text-2xl font-bold text-slate-900">{kpi.value}{kpi.unit}</p>
                    <p className="text-xs text-slate-400 font-medium">/ {kpi.target}{kpi.unit}</p>
                  </div>
                  <div className="w-full bg-slate-100 h-1 rounded-full mt-3 overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${
                        Number(kpi.value) >= Number(kpi.target) ? 'bg-emerald-500' : 'bg-indigo-600'
                      }`} 
                      style={{ width: `${Math.min(100, (Number(kpi.value) / Number(kpi.target)) * 100)}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Strategic Goals */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <h3 className="font-bold text-slate-900 flex items-center">
                      <Target className="w-4 h-4 mr-2 text-indigo-600" />
                      Active Strategic Objectives
                    </h3>
                    <button className="text-xs font-bold text-indigo-600 hover:text-indigo-700 uppercase">Manage Goals</button>
                  </div>
                  <div className="divide-y divide-slate-100">
                    {businessStrategyGoals.map(goal => (
                      <div key={goal.id} className="p-4 hover:bg-slate-50 transition-colors group">
                        <div className="flex items-center justify-between">
                          <div className="flex items-start space-x-4">
                            <div className={`mt-1 p-1.5 rounded-full border ${getGoalStatusStyle(goal.status)}`}>
                              {goal.status === 'completed' ? <CheckCircle2 className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                            </div>
                            <div>
                              <h4 className="text-sm font-bold text-slate-900 group-hover:text-indigo-900 transition-colors">{goal.title}</h4>
                              <div className="flex items-center space-x-3 mt-1">
                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${getPriorityStyle(goal.priority)}`}>
                                  {goal.priority} Priority
                                </span>
                                <span className="text-slate-300">|</span>
                                <span className="text-xs text-slate-500 flex items-center">
                                  <Calendar className="w-3 h-3 mr-1" />
                                  Target: {goal.dueDate}
                                </span>
                              </div>
                            </div>
                          </div>
                          <button className="p-2 text-slate-300 hover:text-indigo-600 transition-colors">
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* AI Insights Panel */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-indigo-600 rounded-xl p-5 text-white shadow-lg shadow-indigo-100 relative overflow-hidden">
                    <Lightbulb className="absolute -right-4 -bottom-4 w-24 h-24 opacity-10" />
                    <h4 className="font-bold mb-2 flex items-center">
                      <Zap className="w-4 h-4 mr-2" />
                      Smart Opportunity
                    </h4>
                    <p className="text-xs text-indigo-100 leading-relaxed mb-4">
                      Based on current liquidity levels, we recommend increasing co-lending exposure in the MSME sector by 15% to optimize ROA.
                    </p>
                    <button className="px-4 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg text-xs font-bold transition-all">
                      Analyze Impact
                    </button>
                  </div>

                  <div className="bg-slate-900 rounded-xl p-5 text-white shadow-lg relative overflow-hidden">
                    <ShieldCheck className="absolute -right-4 -bottom-4 w-24 h-24 opacity-10" />
                    <h4 className="font-bold mb-2 flex items-center">
                      <ShieldCheck className="w-4 h-4 mr-2 text-emerald-400" />
                      Risk Alert
                    </h4>
                    <p className="text-xs text-slate-400 leading-relaxed mb-4">
                      Collections in the North Zone have dipped by 4.2% this week. Strategic follow-up sequence recommended for Tier-2 buckets.
                    </p>
                    <button className="px-4 py-1.5 bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 rounded-lg text-xs font-bold transition-all border border-emerald-500/30">
                      View Action Plan
                    </button>
                  </div>
                </div>
              </div>

              {/* Advisory Chat Sidebar Preview */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col h-[500px]">
                <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 text-sm">Strategy Consultant</h3>
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-4 text-sm">
                  {businessAssistantHistory.slice(-2).map(msg => (
                    <div key={msg.id} className={`p-3 rounded-xl ${
                      msg.role === 'user' ? 'bg-indigo-50 text-indigo-900 ml-4' : 'bg-slate-50 text-slate-700 mr-4 italic'
                    }`}>
                      {msg.content}
                    </div>
                  ))}
                  {businessAssistantHistory.length === 0 && (
                    <div className="text-center py-8 text-slate-400 italic">
                      No recent strategy consultations.
                    </div>
                  )}
                </div>
                <div className="p-4 border-t border-slate-100">
                  <button 
                    onClick={() => setActiveTab('chat')}
                    className="w-full py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-700 transition-colors"
                  >
                    Open Full Consultation
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'kpis' && (
          <div className="max-w-6xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Performance Intelligence</h2>
                <p className="text-sm text-slate-500">Cross-module KPI tracking and trend analysis</p>
              </div>
              <div className="flex space-x-2">
                <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50">
                  Daily
                </button>
                <button className="px-4 py-2 bg-indigo-50 border border-indigo-200 rounded-lg text-sm font-bold text-indigo-600">
                  Monthly
                </button>
                <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50">
                  Quarterly
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Detailed KPI Cards */}
              <div className="space-y-4">
                {businessKpis.map(kpi => (
                  <div key={kpi.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-slate-900">{kpi.label}</h3>
                        <p className="text-xs text-slate-400 font-medium">Last updated: 10 mins ago</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-black text-indigo-600">{kpi.value}{kpi.unit}</p>
                        <p className={`text-xs font-bold ${kpi.trend === 'up' ? 'text-emerald-600' : 'text-red-600'}`}>
                          {kpi.trend === 'up' ? '▲ 2.4%' : '▼ 1.8%'} vs prev. month
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-bold text-slate-500 uppercase tracking-tighter">
                        <span>Current</span>
                        <span>Goal: {kpi.target}{kpi.unit}</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-indigo-600 rounded-full" 
                          style={{ width: `${Math.min(100, (Number(kpi.value) / Number(kpi.target)) * 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Analysis Charts Placeholders */}
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm h-64 flex flex-col items-center justify-center">
                  <PieChart className="w-12 h-12 text-slate-200 mb-4" />
                  <p className="text-sm font-bold text-slate-400">Portfolio Distribution Analysis</p>
                  <p className="text-xs text-slate-300 italic mt-1">Live data feed connected</p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm h-64 flex flex-col items-center justify-center">
                  <TrendingUp className="w-12 h-12 text-slate-200 mb-4" />
                  <p className="text-sm font-bold text-slate-400">Yield vs Cost of Funds Trend</p>
                  <p className="text-xs text-slate-300 italic mt-1">Strategic margin tracking active</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'chat' && (
          <div className="max-w-4xl mx-auto h-[calc(100vh-18rem)] flex flex-col bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            {/* Chat Header */}
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                    <BrainCircuit className="w-6 h-6 text-indigo-400" />
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></div>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 leading-none">Management Advisor AI</h3>
                  <p className="text-[10px] text-emerald-600 font-bold uppercase mt-1 tracking-wider">Executive Mode • Strategic Reasoning</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="hidden sm:flex flex-col items-end">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider leading-none">Current Focus</span>
                  <span className="text-xs font-bold text-indigo-600 mt-1 uppercase">Portfolio Health</span>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-white custom-scrollbar">
              {businessAssistantHistory.map(msg => (
                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                      msg.role === 'user' ? 'bg-slate-100 text-slate-600 ml-3' : 'bg-slate-900 text-indigo-400 mr-3'
                    }`}>
                      {msg.role === 'user' ? 'ME' : 'AI'}
                    </div>
                    <div className={`p-4 rounded-2xl shadow-sm text-sm leading-relaxed ${
                      msg.role === 'user' 
                        ? 'bg-indigo-600 text-white rounded-tr-none' 
                        : 'bg-slate-50 text-slate-800 border border-slate-100 rounded-tl-none italic'
                    }`}>
                      {msg.content}
                    </div>
                  </div>
                </div>
              ))}
              {isChatLoading && (
                <div className="flex justify-start">
                  <div className="flex items-center space-x-2 p-4 bg-slate-50 rounded-2xl italic text-slate-400 text-sm">
                    <div className="flex space-x-1">
                      <div className="w-1.5 h-1.5 bg-indigo-300 rounded-full animate-bounce"></div>
                      <div className="w-1.5 h-1.5 bg-indigo-300 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                      <div className="w-1.5 h-1.5 bg-indigo-300 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                    </div>
                    <span>Processing business logic...</span>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSendMessage} className="p-4 bg-slate-50 border-t border-slate-100">
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  placeholder="Ask about branch expansion, risk mitigation, or portfolio growth..."
                  className="w-full pl-4 pr-12 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-inner"
                  disabled={isChatLoading}
                />
                <button
                  type="submit"
                  disabled={isChatLoading || !chatMessage.trim()}
                  className={`absolute right-2 p-2 rounded-lg transition-all ${
                    chatMessage.trim() && !isChatLoading 
                      ? 'bg-slate-900 text-white shadow-lg' 
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
              <p className="text-[10px] text-slate-400 mt-2 text-center italic uppercase tracking-wider font-semibold opacity-60">
                Powered by Gemini 3.8 Flash • Global Business Intelligence Mode
              </p>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default BusinessAssistant;
