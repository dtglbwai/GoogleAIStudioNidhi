import React, { useState, useRef, useEffect } from 'react';
import { useAppContext } from '../AppContext';
import TaxIcon from '../components/icons/TaxIcon';
import { 
  TaxComplianceItem, 
  TaxRecord, 
  TaxOptimizationSuggestion, 
  TaxChatMessage,
  TaxType,
  TaxComplianceStatus
} from './types';
import { 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  MessageSquare, 
  FileText, 
  Calendar, 
  ArrowRight,
  Plus,
  Search,
  Filter,
  Download,
  ShieldCheck,
  Zap,
  Info
} from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

const TaxAi: React.FC = () => {
  const { 
    taxComplianceItems, 
    taxRecords, 
    taxOptimizationSuggestions, 
    taxChatHistory,
    handleUpdateTaxComplianceStatus,
    handleFileTaxRecord,
    handleSendTaxChatMessage 
  } = useAppContext();

  const [activeTab, setActiveTab] = useState<'overview' | 'compliance' | 'optimization' | 'chat' | 'records'>('overview');
  const [chatMessage, setChatMessage] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [taxChatHistory]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    setIsChatLoading(true);
    await handleSendTaxChatMessage(chatMessage);
    setChatMessage('');
    setIsChatLoading(false);
  };

  const getStatusColor = (status: TaxComplianceStatus) => {
    switch (status) {
      case 'OVERDUE': return 'text-red-500 bg-red-50 border-red-100';
      case 'DUE_SOON': return 'text-amber-500 bg-amber-50 border-amber-100';
      case 'UPCOMING': return 'text-blue-500 bg-blue-50 border-blue-100';
      case 'COMPLETED': return 'text-emerald-500 bg-emerald-50 border-emerald-100';
      default: return 'text-slate-500 bg-slate-50 border-slate-100';
    }
  };

  const getTaxTypeLabel = (type: TaxType) => {
    switch (type) {
      case 'GST': return 'GST (Goods & Services Tax)';
      case 'INCOME_TAX': return 'Income Tax (ITR)';
      case 'TDS': return 'TDS (Tax Deducted at Source)';
      case 'PROFESSIONAL_TAX': return 'Professional Tax (PT)';
      case 'ROC_FILING': return 'ROC Filing (Companies Act)';
      default: return type;
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 overflow-hidden">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-indigo-600 rounded-lg text-white">
            <TaxIcon className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 leading-none">Tax Compliance AI</h1>
            <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-semibold">Strategic Financial Stewardship Agent</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-100">
            <ShieldCheck className="w-4 h-4 mr-1.5" />
            <span className="text-xs font-medium">Auto-Compliance Guard Active</span>
          </div>
          <button 
            onClick={() => setActiveTab('chat')}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm"
          >
            <Zap className="w-4 h-4 mr-2" />
            Ask Sarthak AI
          </button>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-slate-200 px-6">
        <div className="flex space-x-8 overflow-x-auto no-scrollbar">
          {[
            { id: 'overview', label: 'Overview', icon: TrendingUp },
            { id: 'compliance', label: 'Compliance Calendar', icon: Calendar },
            { id: 'optimization', label: 'Tax Optimization', icon: Zap },
            { id: 'records', label: 'Filing History', icon: FileText },
            { id: 'chat', label: 'AI Tax Assistant', icon: MessageSquare }
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

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === 'overview' && (
          <div className="max-w-7xl mx-auto space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 bg-red-50 rounded-lg text-red-600">
                    <AlertCircle className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded uppercase">Urgent</span>
                </div>
                <h3 className="text-slate-500 text-sm font-medium">Pending Compliances</h3>
                <p className="text-2xl font-bold text-slate-900 mt-1">
                  {taxComplianceItems.filter(i => i.status !== 'COMPLETED').length}
                </p>
                <p className="text-xs text-slate-500 mt-2 flex items-center italic">
                  1 Overdue item requires attention
                </p>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded uppercase">Potential</span>
                </div>
                <h3 className="text-slate-500 text-sm font-medium">Est. Tax Savings</h3>
                <p className="text-2xl font-bold text-slate-900 mt-1">
                  {formatCurrency(taxOptimizationSuggestions.reduce((acc, curr) => acc + curr.estimatedSaving, 0))}
                </p>
                <p className="text-xs text-slate-500 mt-2 flex items-center italic">
                  Based on current data & investment patterns
                </p>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                    <Clock className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded uppercase">Active</span>
                </div>
                <h3 className="text-slate-500 text-sm font-medium">Next Filing Due</h3>
                <p className="text-xl font-bold text-slate-900 mt-1">07 Nov 2026</p>
                <p className="text-xs text-slate-500 mt-2 flex items-center italic">
                  TDS Payment (Section 194C)
                </p>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded uppercase">Verified</span>
                </div>
                <h3 className="text-slate-500 text-sm font-medium">Compliance Score</h3>
                <div className="flex items-end space-x-2 mt-1">
                  <p className="text-2xl font-bold text-slate-900">92%</p>
                  <span className="text-xs font-medium text-emerald-600 mb-1">+4% vs last FY</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
                  <div className="bg-indigo-600 h-full rounded-full" style={{ width: '92%' }}></div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Upcoming Deadlines */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-indigo-600" />
                    Immediate Compliance Deadlines
                  </h3>
                  <button onClick={() => setActiveTab('compliance')} className="text-xs font-bold text-indigo-600 hover:text-indigo-700 uppercase tracking-wider">View All</button>
                </div>
                <div className="divide-y divide-slate-50">
                  {taxComplianceItems.slice(0, 4).map(item => (
                    <div key={item.id} className="p-4 hover:bg-slate-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className={`p-2 rounded-lg border ${getStatusColor(item.status)}`}>
                            {item.status === 'OVERDUE' ? <AlertCircle className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-slate-900">{item.event}</h4>
                            <div className="flex items-center space-x-3 mt-0.5">
                              <span className="text-xs font-medium text-slate-500">{getTaxTypeLabel(item.taxType)}</span>
                              <span className="text-slate-300">•</span>
                              <span className="text-xs text-slate-500">{item.period}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`text-sm font-bold ${item.status === 'OVERDUE' ? 'text-red-600' : 'text-slate-900'}`}>
                            {item.dueDate}
                          </p>
                          <p className="text-[10px] text-slate-400 mt-0.5 uppercase font-bold tracking-tighter">Due Date</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tax Optimization Suggestions */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 flex items-center">
                    <Zap className="w-4 h-4 mr-2 text-amber-500" />
                    Optimization Engine Insights
                  </h3>
                  <button onClick={() => setActiveTab('optimization')} className="text-xs font-bold text-indigo-600 hover:text-indigo-700 uppercase tracking-wider">Analyze All</button>
                </div>
                <div className="p-4 space-y-4">
                  {taxOptimizationSuggestions.map(suggestion => (
                    <div key={suggestion.id} className="group p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50 transition-all cursor-pointer">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <span className="text-[10px] font-bold bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded uppercase tracking-wider">{suggestion.category}</span>
                            <h4 className="text-sm font-bold text-slate-900 group-hover:text-indigo-900">{suggestion.title}</h4>
                          </div>
                          <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed italic">{suggestion.description}</p>
                        </div>
                        <div className="ml-4 text-right">
                          <p className="text-sm font-bold text-emerald-600">+{formatCurrency(suggestion.estimatedSaving)}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5 uppercase font-bold tracking-tighter">Est. Saving</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  <button className="w-full py-3 bg-white border border-dashed border-slate-300 text-slate-500 rounded-xl text-xs font-medium hover:border-indigo-400 hover:text-indigo-600 transition-all">
                    + Link additional income sources for deeper analysis
                  </button>
                </div>
              </div>
            </div>

            {/* AI Assistant Promo */}
            <div className="bg-gradient-to-r from-indigo-600 to-violet-700 rounded-2xl p-8 text-white flex flex-col md:flex-row items-center justify-between shadow-lg shadow-indigo-200 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Zap className="w-32 h-32" />
              </div>
              <div className="relative z-10 text-center md:text-left mb-6 md:mb-0 max-w-xl">
                <h3 className="text-2xl font-bold mb-2">Automate your Tax compliance with Strategic AI</h3>
                <p className="text-indigo-100 text-sm leading-relaxed">
                  "Don't just file taxes; optimize your entire financial life cycle." 
                  <span className="block mt-2 font-medium opacity-80">— Inspired by Sarthak Ahuja's Strategic Frameworks</span>
                </p>
              </div>
              <button 
                onClick={() => setActiveTab('chat')}
                className="relative z-10 px-8 py-3 bg-white text-indigo-600 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all flex items-center shadow-xl shadow-indigo-900/20"
              >
                Chat with Tax Agent
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            </div>
          </div>
        )}

        {activeTab === 'compliance' && (
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between mb-6 space-y-4 md:space-y-0">
              <h2 className="text-xl font-bold text-slate-900">Compliance Calendar & Execution</h2>
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Search deadlines..." 
                    className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-64 transition-all"
                  />
                </div>
                <button className="p-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors">
                  <Filter className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Event / Tax Type</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Filing Period</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Due Date</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Est. Penalty</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {taxComplianceItems.map(item => (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-slate-900">{item.event}</span>
                          <span className="text-xs text-slate-500 mt-0.5">{getTaxTypeLabel(item.taxType)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 font-medium">{item.period}</td>
                      <td className="px-6 py-4 text-sm text-slate-900 font-bold">{item.dueDate}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border ${getStatusColor(item.status)}`}>
                          {item.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-sm font-medium ${item.estimatedPenalty ? 'text-red-600' : 'text-slate-400'}`}>
                          {item.estimatedPenalty ? formatCurrency(item.estimatedPenalty) : 'None'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {item.status === 'COMPLETED' ? (
                          <button className="text-slate-400 cursor-not-allowed flex items-center text-xs font-bold uppercase tracking-wider">
                            <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                            Filed
                          </button>
                        ) : (
                          <button 
                            onClick={() => handleUpdateTaxComplianceStatus(item.id, 'COMPLETED')}
                            className="text-indigo-600 hover:text-indigo-800 flex items-center text-xs font-bold uppercase tracking-wider"
                          >
                            Mark Filed
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {taxComplianceItems.length === 0 && (
                <div className="py-12 flex flex-col items-center justify-center text-slate-400">
                  <Calendar className="w-12 h-12 mb-3 opacity-20" />
                  <p className="text-sm italic">No compliance items found</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'optimization' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="text-center space-y-2 mb-8">
              <h2 className="text-2xl font-bold text-slate-900">Strategic Tax Optimization Engine</h2>
              <p className="text-slate-500 italic">"Wealth creation isn't just about earning more; it's about retaining more of what you earn."</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-indigo-600 text-white p-6 rounded-2xl shadow-lg shadow-indigo-100">
                <p className="text-indigo-100 text-xs font-bold uppercase tracking-wider mb-1">Total Potential Savings</p>
                <p className="text-3xl font-bold">{formatCurrency(30720)}</p>
                <div className="flex items-center mt-4 text-xs font-medium bg-white/10 w-fit px-2 py-1 rounded-full">
                  <Zap className="w-3 h-3 mr-1" />
                  Action Required: 3 Items
                </div>
              </div>
              <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
                <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">80C Utilization</p>
                <p className="text-3xl font-bold text-slate-900">₹1,15,000</p>
                <p className="text-xs text-slate-400 mt-2">₹35,000 remaining until limit</p>
                <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
                  <div className="bg-indigo-600 h-full" style={{ width: '76%' }}></div>
                </div>
              </div>
              <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
                <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Business Deductions</p>
                <p className="text-3xl font-bold text-slate-900">₹2.4L</p>
                <p className="text-xs text-slate-400 mt-2 flex items-center">
                  <TrendingUp className="w-3 h-3 mr-1 text-emerald-500" />
                  +12% vs previous period
                </p>
                <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
                  <div className="bg-emerald-500 h-full" style={{ width: '60%' }}></div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {taxOptimizationSuggestions.map(suggestion => (
                <div key={suggestion.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0 hover:border-indigo-300 transition-all">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-amber-50 rounded-2xl text-amber-600 flex-shrink-0">
                      <Zap className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-bold text-slate-900">{suggestion.title}</h3>
                        <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full uppercase tracking-tighter">{suggestion.category}</span>
                      </div>
                      <p className="text-sm text-slate-500 mt-1 max-w-xl italic leading-relaxed">{suggestion.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-6">
                    <div className="text-right">
                      <p className="text-lg font-bold text-emerald-600">+{formatCurrency(suggestion.estimatedSaving)}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Est. ROI</p>
                    </div>
                    <button className="px-5 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all uppercase tracking-wider">Execute</button>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-6 bg-slate-900 rounded-2xl text-white flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-indigo-500 rounded-xl">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold">Audit Protection Plan</h4>
                  <p className="text-slate-400 text-xs italic">Every suggestion is validated against the latest Income Tax & GST council directives.</p>
                </div>
              </div>
              <Info className="w-5 h-5 text-slate-500 cursor-pointer hover:text-white transition-colors" />
            </div>
          </div>
        )}

        {activeTab === 'chat' && (
          <div className="max-w-4xl mx-auto h-[calc(100vh-18rem)] flex flex-col bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            {/* Chat Header */}
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-lg">SA</div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></div>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 leading-none">Sarthak Tax Agent</h3>
                  <p className="text-[10px] text-emerald-600 font-bold uppercase mt-1 tracking-wider">AI Powered • Online</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="hidden sm:flex flex-col items-end">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider leading-none">Strategy Mode</span>
                  <span className="text-xs font-bold text-indigo-600 mt-1 uppercase">Wealth Retention</span>
                </div>
                <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-white custom-scrollbar">
              {taxChatHistory.map(msg => (
                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                      msg.role === 'user' ? 'bg-slate-200 text-slate-600 ml-3' : 'bg-indigo-600 text-white mr-3'
                    }`}>
                      {msg.role === 'user' ? 'ME' : 'SA'}
                    </div>
                    <div className={`p-4 rounded-2xl shadow-sm text-sm leading-relaxed ${
                      msg.role === 'user' 
                        ? 'bg-slate-900 text-white rounded-tr-none' 
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
                      <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce"></div>
                      <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                      <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                    </div>
                    <span>Analyzing strategic implications...</span>
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
                  placeholder="Ask about GST filing, 80C optimization, or business expenses..."
                  className="w-full pl-4 pr-12 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-inner"
                  disabled={isChatLoading}
                />
                <button
                  type="submit"
                  disabled={isChatLoading || !chatMessage.trim()}
                  className={`absolute right-2 p-2 rounded-lg transition-all ${
                    chatMessage.trim() && !isChatLoading 
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' 
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
              <p className="text-[10px] text-slate-400 mt-2 text-center italic uppercase tracking-wider font-semibold opacity-60">
                Powered by Gemini 3.8 Flash • Strategic Reasoning Enabled
              </p>
            </form>
          </div>
        )}

        {activeTab === 'records' && (
          <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-slate-900">Tax Filing Repository</h2>
              <div className="flex items-center space-x-2">
                <button className="flex items-center px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all">
                  <Download className="w-4 h-4 mr-2" />
                  Export All (CSV/XML)
                </button>
                <button className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 transition-all">
                  <Plus className="w-4 h-4 mr-2" />
                  New Filing Record
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {taxRecords.map(record => (
                <div key={record.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 hover:shadow-md transition-all group">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 bg-slate-100 rounded-xl group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                      <FileText className="w-6 h-6" />
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase ${
                      record.status === 'FILED' ? 'text-blue-600 bg-blue-50 border-blue-100' :
                      record.status === 'VERIFIED' ? 'text-emerald-600 bg-emerald-50 border-emerald-100' :
                      'text-slate-500 bg-slate-50 border-slate-100'
                    }`}>
                      {record.status}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">{getTaxTypeLabel(record.taxType)}</h3>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">FY Period</p>
                      <p className="text-sm font-bold text-slate-700">{record.financialYear}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Filing Amount</p>
                      <p className="text-sm font-bold text-slate-900">{formatCurrency(record.amount)}</p>
                    </div>
                  </div>
                  {record.arnNumber && (
                    <div className="mt-4 p-2 bg-slate-50 rounded-lg border border-slate-100">
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider leading-none">ARN / Ref Number</p>
                      <p className="text-xs font-mono font-bold text-indigo-600 mt-1">{record.arnNumber}</p>
                    </div>
                  )}
                  <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs text-slate-400 italic">Filed on: {record.filingDate}</span>
                    <button className="p-1.5 bg-slate-50 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all">
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaxAi;
