import React, { useState } from 'react';
import { useAppContext } from '../AppContext';
import { SwiftMessage, SwiftMessageType, NostroVostroAccount, BicDirectoryEntry, TradeFinanceDocCredit, StandingOrder, CoreBatchLog } from './types';
import { formatCurrency } from '../utils/formatters';

const SwiftHub: React.FC = () => {
  const {
    swiftMessages,
    nostroVostroAccounts,
    bicDirectory,
    tradeFinanceCredits,
    standingOrders,
    coreBatchLogs,
    handleCreateSwiftMessage,
    handleReleaseSwiftSanctions,
    handleRunCoreBatch,
    handleAddStandingOrder,
    handleToggleStandingOrder,
    handleCreateTradeFinanceCredit,
  } = useAppContext();

  const [activeTab, setActiveTab] = useState<'messages' | 'gpi' | 'nostroVostro' | 'tradeFinance' | 'standingOrders' | 'batchOperations' | 'bicDirectory'>('messages');
  const [selectedMessage, setSelectedMessage] = useState<SwiftMessage | null>(swiftMessages[0] || null);
  const [showNewMsgModal, setShowNewMsgModal] = useState(false);
  const [showNewTradeModal, setShowNewTradeModal] = useState(false);
  const [showNewStandingOrderModal, setShowNewStandingOrderModal] = useState(false);
  const [filterDirection, setFilterDirection] = useState<'ALL' | 'INBOUND' | 'OUTBOUND'>('ALL');
  const [searchBic, setSearchBic] = useState('');

  // Form state for new SWIFT message
  const [newMsgType, setNewMsgType] = useState<SwiftMessageType>('MT103');
  const [newSenderBic, setNewSenderBic] = useState('SBININBBXXX');
  const [newReceiverBic, setNewReceiverBic] = useState('CHASUS33XXX');
  const [newAmount, setNewAmount] = useState<number>(50000);
  const [newCurrency, setNewCurrency] = useState('USD');
  const [newOrdName, setNewOrdName] = useState('Tata Motors Export Division');
  const [newOrdAcc, setNewOrdAcc] = useState('001928472910');
  const [newOrdAddress, setNewOrdAddress] = useState('Mumbai, India');
  const [newBenName, setNewBenName] = useState('Detroit Auto Parts LLC');
  const [newBenAcc, setNewBenAcc] = useState('US99CHAS123456789012');
  const [newBenBank, setNewBenBank] = useState('JPMorgan Chase Bank, N.A.');
  const [newBenAddress, setNewBenAddress] = useState('Detroit, MI, USA');
  const [newRemittance, setNewRemittance] = useState('INV-2026-ENG-491 COMMERCIAL SHIPMENT');
  const [newCharges, setNewCharges] = useState<'OUR' | 'BEN' | 'SHA'>('OUR');

  // Trade finance form state
  const [newTfType, setNewTfType] = useState<'Letter of Credit (LC)' | 'Bank Guarantee (BG)' | 'Standby LC (SBLC)'>('Letter of Credit (LC)');
  const [newTfLcNumber, setNewTfLcNumber] = useState(`LC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`);
  const [newTfApplicant, setNewTfApplicant] = useState('');
  const [newTfBeneficiary, setNewTfBeneficiary] = useState('');
  const [newTfIssuingBank, setNewTfIssuingBank] = useState('fincaplen Core Bank');
  const [newTfAdvisingBank, setNewTfAdvisingBank] = useState('JPMorgan Chase Bank, N.A.');
  const [newTfAmount, setNewTfAmount] = useState(250000);
  const [newTfCurrency, setNewTfCurrency] = useState('USD');
  const [newTfExpiry, setNewTfExpiry] = useState('2026-12-31');
  const [newTfTenor, setNewTfTenor] = useState('90 Days from B/L Date');

  // Standing Order form state
  const [newSoSourceAcc, setNewSoSourceAcc] = useState('ca-1');
  const [newSoSourceName, setNewSoSourceName] = useState('Apex Logistics Corporate Pool');
  const [newSoBenName, setNewSoBenName] = useState('');
  const [newSoBenAcc, setNewSoBenAcc] = useState('');
  const [newSoRouting, setNewSoRouting] = useState('');
  const [newSoAmount, setNewSoAmount] = useState(25000);
  const [newSoFrequency, setNewSoFrequency] = useState<'Daily' | 'Weekly' | 'Monthly' | 'Quarterly'>('Monthly');
  const [newSoRuleType, setNewSoRuleType] = useState<'Fixed Amount' | 'Sweep Excess' | 'Target Balance Maintain'>('Fixed Amount');
  const [newSoThreshold, setNewSoThreshold] = useState(100000);

  const filteredMessages = swiftMessages.filter(msg => {
    if (filterDirection === 'ALL') return true;
    return msg.direction === filterDirection;
  });

  const filteredBicList = bicDirectory.filter(b => 
    b.bic.toLowerCase().includes(searchBic.toLowerCase()) || 
    b.institutionName.toLowerCase().includes(searchBic.toLowerCase()) ||
    b.country.toLowerCase().includes(searchBic.toLowerCase())
  );

  const handleSendSwift = (e: React.FormEvent) => {
    e.preventDefault();
    handleCreateSwiftMessage({
      messageType: newMsgType,
      senderBic: newSenderBic,
      receiverBic: newReceiverBic,
      senderName: 'fincaplen Core Bank Mumbai',
      receiverName: bicDirectory.find(b => b.bic === newReceiverBic)?.institutionName || 'Correspondent Bank',
      amount: Number(newAmount),
      currency: newCurrency,
      direction: 'OUTBOUND',
      valueDate: new Date().toISOString().split('T')[0],
      referenceNumber: `FT${Date.now().toString().slice(-10)}`,
      orderingCustomer: {
        name: newOrdName,
        accountOrIban: newOrdAcc,
        address: newOrdAddress
      },
      beneficiaryCustomer: {
        name: newBenName,
        accountOrIban: newBenAcc,
        bankName: newBenBank,
        address: newBenAddress
      },
      chargeDetails: newCharges,
      remittanceInfo: newRemittance
    });
    setShowNewMsgModal(false);
  };

  const handleCreateTrade = (e: React.FormEvent) => {
    e.preventDefault();
    handleCreateTradeFinanceCredit({
      instrumentType: newTfType,
      lcNumber: newTfLcNumber,
      applicant: newTfApplicant,
      beneficiary: newTfBeneficiary,
      issuingBank: newTfIssuingBank,
      advisingBank: newTfAdvisingBank,
      amount: Number(newTfAmount),
      currency: newTfCurrency,
      issueDate: new Date().toISOString().split('T')[0],
      expiryDate: newTfExpiry,
      tenor: newTfTenor,
      applicableRules: newTfType === 'Bank Guarantee (BG)' ? 'URDG 758' : 'UCP 600'
    });
    setShowNewTradeModal(false);
  };

  const handleCreateSO = (e: React.FormEvent) => {
    e.preventDefault();
    handleAddStandingOrder({
      sourceAccountId: newSoSourceAcc,
      sourceAccountName: newSoSourceName,
      beneficiaryName: newSoBenName,
      beneficiaryAccount: newSoBenAcc,
      beneficiaryRouting: newSoRouting,
      amount: Number(newSoAmount),
      currency: 'INR',
      frequency: newSoFrequency,
      nextRunDate: new Date(Date.now() + 86400000 * 30).toISOString().split('T')[0],
      ruleType: newSoRuleType,
      thresholdAmount: newSoRuleType !== 'Fixed Amount' ? Number(newSoThreshold) : undefined
    });
    setShowNewStandingOrderModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 text-white rounded-xl p-6 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-blue-500/30 border border-blue-400/40 text-blue-200 text-xs font-mono font-semibold rounded-full uppercase tracking-wider">
              SWIFT Alliance Gateway & ISO 20022
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-500/40 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              FIN NETWORK CONNECTED
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold mt-2 tracking-tight">
            International Core Banking & SWIFT Network Hub
          </h1>
          <p className="text-slate-300 text-sm mt-1 max-w-3xl">
            Enterprise multi-currency cross-border messaging (MT103, MT202, MT940, MT700, pacs.008), real-time SWIFT gpi tracker, Nostro/Vostro liquidity management, RMA directory & automated trade finance.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setShowNewMsgModal(true)}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium text-sm transition-all shadow-md hover:shadow-blue-500/25 flex items-center gap-2 cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Compose SWIFT MT/MX
          </button>

          <button
            onClick={() => handleRunCoreBatch('EOD')}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 rounded-lg font-medium text-sm transition-all flex items-center gap-2 cursor-pointer"
          >
            <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Run EOD Cutoff Batch
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">SWIFT Queue</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">{swiftMessages.length}</div>
          <div className="text-xs text-blue-600 mt-1 font-medium">All Direct Channels Live</div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Nostro Accounts</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">
            {nostroVostroAccounts.filter(a => a.accountType === 'NOSTRO').length}
          </div>
          <div className="text-xs text-emerald-600 mt-1 font-medium">100% Reconciled</div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Vostro Accounts</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">
            {nostroVostroAccounts.filter(a => a.accountType === 'VOSTRO').length}
          </div>
          <div className="text-xs text-slate-600 mt-1 font-medium">₹129.7 Cr Inbound Float</div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">gpi Speed Avg</div>
          <div className="text-2xl font-bold text-indigo-600 mt-1">18 mins</div>
          <div className="text-xs text-slate-500 mt-1 font-medium">Fast SLA Tier 1</div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Trade Credits (LC)</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">{tradeFinanceCredits.length}</div>
          <div className="text-xs text-emerald-600 mt-1 font-medium">UCP 600 Compliant</div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Standing Sweeps</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">{standingOrders.length}</div>
          <div className="text-xs text-blue-600 mt-1 font-medium">Auto-executing daily</div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 bg-white rounded-t-xl px-4 pt-2 overflow-x-auto gap-2">
        {[
          { id: 'messages', label: 'SWIFT Messages (MT & MX)', count: swiftMessages.length },
          { id: 'gpi', label: 'SWIFT gpi Real-Time Tracker', badge: 'Live' },
          { id: 'nostroVostro', label: 'Nostro & Vostro Accounts', count: nostroVostroAccounts.length },
          { id: 'tradeFinance', label: 'Trade Finance & LC/BG', count: tradeFinanceCredits.length },
          { id: 'standingOrders', label: 'Standing Orders & Sweeps', count: standingOrders.length },
          { id: 'batchOperations', label: 'Core EOD/BOD Batches', count: coreBatchLogs.length },
          { id: 'bicDirectory', label: 'BIC & RMA Directory', count: bicDirectory.length },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 cursor-pointer ${
              activeTab === tab.id
                ? 'border-blue-600 text-blue-600 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span className={`text-xs px-2 py-0.5 rounded-full ${activeTab === tab.id ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'}`}>
                {tab.count}
              </span>
            )}
            {tab.badge && (
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700">
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* TAB 1: SWIFT MESSAGES */}
      {activeTab === 'messages' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Messages list */}
          <div className="lg:col-span-5 bg-white rounded-xl shadow-sm border border-slate-200 p-4 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <div className="text-sm font-semibold text-slate-700">Message Traffic Feed</div>
              <div className="flex gap-1 text-xs">
                {(['ALL', 'OUTBOUND', 'INBOUND'] as const).map(dir => (
                  <button
                    key={dir}
                    onClick={() => setFilterDirection(dir)}
                    className={`px-2.5 py-1 rounded cursor-pointer ${filterDirection === dir ? 'bg-slate-800 text-white font-medium' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                  >
                    {dir}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2.5 max-h-[620px] overflow-y-auto pr-1">
              {filteredMessages.map(msg => (
                <div
                  key={msg.id}
                  onClick={() => setSelectedMessage(msg)}
                  className={`p-3.5 rounded-lg border text-left cursor-pointer transition-all ${
                    selectedMessage?.id === msg.id
                      ? 'border-blue-500 bg-blue-50/60 shadow-sm ring-1 ring-blue-500'
                      : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100/80'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-0.5 rounded font-mono font-bold ${
                        msg.messageType === 'MT103' ? 'bg-indigo-100 text-indigo-700' :
                        msg.messageType === 'MT700' ? 'bg-purple-100 text-purple-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {msg.messageType}
                      </span>
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                        msg.direction === 'OUTBOUND' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {msg.direction}
                      </span>
                    </div>
                    <span className="text-xs font-mono font-bold text-slate-800">
                      {msg.currency} {msg.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                  </div>

                  <div className="mt-2 text-xs text-slate-700 font-medium truncate">
                    {msg.direction === 'OUTBOUND' ? `To: ${msg.beneficiaryCustomer.name}` : `From: ${msg.orderingCustomer.name}`}
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono mt-0.5 flex justify-between">
                    <span>BIC: {msg.direction === 'OUTBOUND' ? msg.receiverBic : msg.senderBic}</span>
                    <span>{msg.valueDate}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Message Detail & Raw Swift Block */}
          <div className="lg:col-span-7 bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6">
            {selectedMessage ? (
              <>
                <div className="flex justify-between items-start border-b border-slate-200 pb-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <h2 className="text-lg font-bold text-slate-900 font-mono">
                        {selectedMessage.messageType} - Ref: {selectedMessage.referenceNumber}
                      </h2>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                        {selectedMessage.status}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 mt-1 font-mono">
                      UETR: {selectedMessage.uetr}
                    </div>
                  </div>

                  <button
                    onClick={() => alert(`Downloaded MT message payload for ${selectedMessage.referenceNumber}`)}
                    className="px-3 py-1.5 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md font-medium flex items-center gap-1.5 cursor-pointer"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Export Swift FIN File
                  </button>
                </div>

                {/* Sender & Receiver Card */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="text-xs font-semibold text-slate-500 uppercase">Ordering Customer (:50K)</div>
                    <div className="text-sm font-bold text-slate-900 mt-1">{selectedMessage.orderingCustomer.name}</div>
                    <div className="text-xs text-slate-600 font-mono mt-0.5">A/C: {selectedMessage.orderingCustomer.accountOrIban}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{selectedMessage.orderingCustomer.address}</div>
                    <div className="mt-2 text-xs font-mono text-blue-600">Sender BIC: {selectedMessage.senderBic}</div>
                  </div>

                  <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="text-xs font-semibold text-slate-500 uppercase">Beneficiary Customer (:59)</div>
                    <div className="text-sm font-bold text-slate-900 mt-1">{selectedMessage.beneficiaryCustomer.name}</div>
                    <div className="text-xs text-slate-600 font-mono mt-0.5">A/C: {selectedMessage.beneficiaryCustomer.accountOrIban}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{selectedMessage.beneficiaryCustomer.bankName}</div>
                    <div className="mt-2 text-xs font-mono text-blue-600">Receiver BIC: {selectedMessage.receiverBic}</div>
                  </div>
                </div>

                {/* Amount & Settlement Info */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 bg-blue-50/50 rounded-lg border border-blue-100 text-xs">
                  <div>
                    <span className="text-slate-500 font-medium">Interbank Amount:</span>
                    <p className="font-bold text-slate-900 text-sm mt-0.5 font-mono">
                      {selectedMessage.currency} {selectedMessage.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-500 font-medium">Value Date (:32A):</span>
                    <p className="font-bold text-slate-900 text-sm mt-0.5">{selectedMessage.valueDate}</p>
                  </div>
                  <div>
                    <span className="text-slate-500 font-medium">Details of Charges:</span>
                    <p className="font-bold text-slate-900 text-sm mt-0.5 font-mono">{selectedMessage.chargeDetails} (71A)</p>
                  </div>
                  <div>
                    <span className="text-slate-500 font-medium">Remittance Info:</span>
                    <p className="font-bold text-slate-900 truncate mt-0.5">{selectedMessage.remittanceInfo}</p>
                  </div>
                </div>

                {/* Sanctions & OFAC Screening Check */}
                <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm font-bold text-emerald-900">Automated Sanctions, OFAC & PEP Clear</div>
                      <div className="text-xs text-emerald-700">
                        Match Score: {selectedMessage.sanctionsCheck.ofacMatchScore} | Screened at {selectedMessage.sanctionsCheck.screenedAt}
                      </div>
                    </div>
                  </div>

                  {!selectedMessage.sanctionsCheck.isPassed && (
                    <button
                      onClick={() => handleReleaseSwiftSanctions(selectedMessage.id)}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-semibold"
                    >
                      Release Hold
                    </button>
                  )}
                </div>

                {/* Raw SWIFT FIN Block Payload */}
                <div>
                  <div className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                    Raw SWIFT FIN Message Block Payload
                  </div>
                  <pre className="bg-slate-950 text-emerald-400 p-4 rounded-lg font-mono text-xs overflow-x-auto whitespace-pre-wrap leading-relaxed border border-slate-800 shadow-inner">
                    {selectedMessage.rawSwiftBlock}
                  </pre>
                </div>
              </>
            ) : (
              <div className="text-center py-20 text-slate-400 text-sm">Select a SWIFT message to view details</div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: SWIFT GPI REAL TIME TRACKER */}
      {activeTab === 'gpi' && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-200">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping"></span>
                SWIFT gpi (Global Payments Innovation) Live Tracker
              </h2>
              <p className="text-slate-500 text-xs mt-0.5">
                End-to-end tracking with millisecond timestamp verification, intermediary fee deductions, and beneficiary credit confirmations.
              </p>
            </div>

            {selectedMessage && (
              <div className="text-right">
                <span className="text-xs text-slate-500">Active UETR Tracker:</span>
                <p className="font-mono text-xs font-bold text-blue-700">{selectedMessage.uetr}</p>
              </div>
            )}
          </div>

          {selectedMessage && (
            <div className="space-y-6">
              {/* Tracker Banner */}
              <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white p-5 rounded-xl flex flex-wrap justify-between items-center gap-4">
                <div>
                  <div className="text-xs text-blue-200 uppercase font-semibold">Payment Reference</div>
                  <div className="text-lg font-bold font-mono">{selectedMessage.referenceNumber}</div>
                  <div className="text-xs text-slate-300 mt-1">
                    {selectedMessage.orderingCustomer.name} &rarr; {selectedMessage.beneficiaryCustomer.name}
                  </div>
                </div>

                <div className="text-center sm:text-left">
                  <div className="text-xs text-blue-200 uppercase font-semibold">Status</div>
                  <span className="inline-block mt-1 px-3 py-1 bg-emerald-500/30 border border-emerald-400/40 text-emerald-200 rounded-full text-xs font-mono font-bold">
                    {selectedMessage.gpiTracking.trackingStatus}
                  </span>
                </div>

                <div>
                  <div className="text-xs text-blue-200 uppercase font-semibold">Amount & Currency</div>
                  <div className="text-lg font-bold font-mono text-emerald-300">
                    {selectedMessage.currency} {selectedMessage.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </div>
                  <div className="text-xs text-slate-300 mt-1">Total Intermediary Fees: ${selectedMessage.gpiTracking.totalDeductions}</div>
                </div>
              </div>

              {/* Hop-by-Hop Visual Timeline */}
              <div className="relative pl-6 sm:pl-8 space-y-6 before:content-[''] before:absolute before:left-3.5 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-blue-200">
                {selectedMessage.gpiTracking.hops.map((hop, idx) => (
                  <div key={idx} className="relative flex items-start gap-4 group">
                    <div className={`absolute -left-6 sm:-left-8 top-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                      hop.status === 'COMPLETED' ? 'bg-emerald-600 ring-4 ring-emerald-100' :
                      hop.status === 'IN_TRANSIT' ? 'bg-blue-600 ring-4 ring-blue-100 animate-pulse' :
                      'bg-slate-300'
                    }`}>
                      {hop.status === 'COMPLETED' ? '✓' : idx + 1}
                    </div>

                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 w-full shadow-xs">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1">
                        <h4 className="text-sm font-bold text-slate-900">{hop.stage}</h4>
                        <span className="text-xs font-mono text-slate-500">{hop.timestamp}</span>
                      </div>
                      <div className="text-xs text-slate-600 mt-1 flex flex-wrap items-center gap-4">
                        <span className="font-semibold">{hop.bankName}</span>
                        <span className="font-mono bg-slate-200 px-1.5 py-0.5 rounded text-[11px] text-slate-700">BIC: {hop.bic}</span>
                        <span>Location: {hop.location}</span>
                        {hop.deductedFee && (
                          <span className="text-amber-700 font-semibold">Fee Deducted: {hop.deductedFee}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: NOSTRO & VOSTRO ACCOUNTS */}
      {activeTab === 'nostroVostro' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-base font-bold text-slate-900">Correspondent Banking: Nostro & Vostro Accounts</h3>
                <p className="text-xs text-slate-500">Real-time mirror balance reconciliation and foreign currency position</p>
              </div>
              <button
                onClick={() => alert('Initiated automatic MT940 statement sync across all correspondent nostro banks.')}
                className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Sync All MT940 Statements
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 border-b border-slate-200">
                    <th className="p-3 font-semibold">Type</th>
                    <th className="p-3 font-semibold">Correspondent Bank</th>
                    <th className="p-3 font-semibold">BIC</th>
                    <th className="p-3 font-semibold">Currency</th>
                    <th className="p-3 font-semibold text-right">Our Ledger Balance</th>
                    <th className="p-3 font-semibold text-right">Mirror Statement Balance</th>
                    <th className="p-3 font-semibold text-center">Variance</th>
                    <th className="p-3 font-semibold text-center">Status</th>
                    <th className="p-3 font-semibold">Last Reconciled</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {nostroVostroAccounts.map((acc) => {
                    const variance = acc.ourLedgerBalance - acc.mirrorStatementBalance;
                    return (
                      <tr key={acc.id} className="hover:bg-slate-50">
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded font-mono font-bold ${
                            acc.accountType === 'NOSTRO' ? 'bg-indigo-100 text-indigo-700' : 'bg-emerald-100 text-emerald-700'
                          }`}>
                            {acc.accountType}
                          </span>
                        </td>
                        <td className="p-3 font-semibold text-slate-900">{acc.correspondentBank}</td>
                        <td className="p-3 font-mono text-slate-600">{acc.bic}</td>
                        <td className="p-3 font-bold text-slate-800">{acc.currency}</td>
                        <td className="p-3 text-right font-mono font-bold text-slate-900">
                          {acc.currency} {acc.ourLedgerBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </td>
                        <td className="p-3 text-right font-mono text-slate-700">
                          {acc.currency} {acc.mirrorStatementBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </td>
                        <td className="p-3 text-center font-mono">
                          {variance === 0 ? (
                            <span className="text-emerald-600 font-semibold">₹0.00 (Balanced)</span>
                          ) : (
                            <span className="text-amber-600 font-semibold">
                              {acc.currency} {Math.abs(variance).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-center">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            {acc.status}
                          </span>
                        </td>
                        <td className="p-3 text-slate-500 font-mono text-[11px]">{acc.lastReconciledAt}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: TRADE FINANCE & DOCUMENTARY CREDITS */}
      {activeTab === 'tradeFinance' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-base font-bold text-slate-900">Trade Finance & Documentary Credits (LC / BG)</h3>
                <p className="text-xs text-slate-500">UCP 600 & URDG 758 rules enforcement for cross-border export/import financing</p>
              </div>
              <button
                onClick={() => setShowNewTradeModal(true)}
                className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                Issue New LC / BG Instrument
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {tradeFinanceCredits.map((tf) => (
                <div key={tf.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-bold text-blue-700 bg-blue-100 px-2.5 py-0.5 rounded font-mono">
                      {tf.lcNumber}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      {tf.status}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{tf.instrumentType}</h4>
                    <p className="text-xs text-slate-600 mt-1">
                      <strong>Applicant:</strong> {tf.applicant}
                    </p>
                    <p className="text-xs text-slate-600">
                      <strong>Beneficiary:</strong> {tf.beneficiary}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-xs">
                    <div>
                      <span className="text-slate-500">Sanctioned Value:</span>
                      <p className="font-bold text-slate-900 font-mono text-sm">
                        {tf.currency} {tf.amount.toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-slate-500">Rules:</span>
                      <p className="font-semibold text-slate-800">{tf.applicableRules}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: STANDING ORDERS & AUTOMATED SWEEPS */}
      {activeTab === 'standingOrders' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-base font-bold text-slate-900">Standing Orders & Automated Sweep Rules</h3>
                <p className="text-xs text-slate-500">Scheduled automated recurring debits, liquidity sweeps & pool maintenance</p>
              </div>
              <button
                onClick={() => setShowNewStandingOrderModal(true)}
                className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                Create Standing Sweep Rule
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 border-b border-slate-200">
                    <th className="p-3 font-semibold">Source Account</th>
                    <th className="p-3 font-semibold">Beneficiary / Target</th>
                    <th className="p-3 font-semibold">Rule Type</th>
                    <th className="p-3 font-semibold text-right">Amount / Threshold</th>
                    <th className="p-3 font-semibold">Frequency</th>
                    <th className="p-3 font-semibold">Next Execution</th>
                    <th className="p-3 font-semibold text-center">Status</th>
                    <th className="p-3 font-semibold text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {standingOrders.map((so) => (
                    <tr key={so.id} className="hover:bg-slate-50">
                      <td className="p-3 font-semibold text-slate-900">{so.sourceAccountName}</td>
                      <td className="p-3">
                        <div className="font-semibold text-slate-800">{so.beneficiaryName}</div>
                        <div className="text-[11px] text-slate-500 font-mono">A/C: {so.beneficiaryAccount}</div>
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-medium">
                          {so.ruleType}
                        </span>
                      </td>
                      <td className="p-3 text-right font-mono font-bold text-slate-900">
                        {so.ruleType === 'Fixed Amount'
                          ? formatCurrency(so.amount)
                          : `Threshold: ${formatCurrency(so.thresholdAmount || 0)}`}
                      </td>
                      <td className="p-3 text-slate-700 font-medium">{so.frequency}</td>
                      <td className="p-3 font-mono text-slate-600">{so.nextRunDate}</td>
                      <td className="p-3 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          so.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
                        }`}>
                          {so.status}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => handleToggleStandingOrder(so.id)}
                          className="px-2 py-1 text-xs font-semibold rounded bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                        >
                          {so.status === 'ACTIVE' ? 'Pause' : 'Activate'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: CORE BATCH OPERATIONS (EOD & BOD) */}
      {activeTab === 'batchOperations' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-200">
              <div>
                <h3 className="text-base font-bold text-slate-900">Core Banking Automated EOD / BOD Batches</h3>
                <p className="text-xs text-slate-500">Interest accrual engine, dormancy sweeps, FX rate fixer & trial balance reconciler</p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleRunCoreBatch('BOD')}
                  className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold cursor-pointer"
                >
                  Trigger BOD (Beginning of Day)
                </button>
                <button
                  onClick={() => handleRunCoreBatch('EOD')}
                  className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold cursor-pointer"
                >
                  Trigger EOD (End of Day Cutoff)
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {coreBatchLogs.map((batch) => (
                <div key={batch.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded font-mono font-bold text-xs ${
                        batch.batchType === 'EOD' ? 'bg-indigo-100 text-indigo-700' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {batch.batchType} BATCH
                      </span>
                      <span className="text-xs text-slate-500 font-mono">Executed at {batch.executedDate}</span>
                    </div>
                    <span className="text-xs font-semibold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                      Duration: {batch.durationSeconds}s ({batch.status})
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-white p-3 rounded-lg border border-slate-200">
                    <div>
                      <span className="text-slate-500">Interest Accruals:</span>
                      <p className="font-bold text-slate-900 font-mono mt-0.5">{batch.interestAccrualsPosted} accounts</p>
                    </div>
                    <div>
                      <span className="text-slate-500">Standing Orders Executed:</span>
                      <p className="font-bold text-slate-900 font-mono mt-0.5">{batch.standingOrdersFired} sweeps</p>
                    </div>
                    <div>
                      <span className="text-slate-500">Ledger Balanced:</span>
                      <p className="font-bold text-emerald-600 mt-0.5">Yes (0 Variance)</p>
                    </div>
                    <div>
                      <span className="text-slate-500">Executed By:</span>
                      <p className="font-bold text-slate-800 mt-0.5">{batch.executedBy}</p>
                    </div>
                  </div>

                  <div className="space-y-1 pl-2">
                    <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Batch Execution Trace:</div>
                    {batch.details.map((d, i) => (
                      <div key={i} className="text-xs text-slate-600 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                        {d}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: BIC & RMA DIRECTORY */}
      {activeTab === 'bicDirectory' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">SWIFT BIC Directory & RMA Key Authorizations</h3>
                <p className="text-xs text-slate-500">Global Financial Institution Identifier directory and Relationship Management Application status</p>
              </div>

              <div className="w-full sm:w-72">
                <input
                  type="text"
                  placeholder="Search BIC, Bank, or Country..."
                  value={searchBic}
                  onChange={(e) => setSearchBic(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {filteredBicList.map((entry) => (
                <div key={entry.bic} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-mono font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                      {entry.bic}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      {entry.rmaStatus}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{entry.institutionName}</h4>
                    <p className="text-xs text-slate-500">{entry.branchName} • {entry.city}, {entry.country}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-200 text-xs flex justify-between text-slate-600">
                    <span>Cutoff GMT: {entry.cutoffTimeGmt}</span>
                    <span className="text-emerald-600 font-semibold">LIVE</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal: Compose SWIFT MT / MX Message */}
      {showNewMsgModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6 space-y-4 my-8">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-lg font-bold text-slate-900">Compose SWIFT MT / ISO 20022 Cross-Border Message</h3>
              <button onClick={() => setShowNewMsgModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                ✕
              </button>
            </div>

            <form onSubmit={handleSendSwift} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Message Type</label>
                  <select
                    value={newMsgType}
                    onChange={(e) => setNewMsgType(e.target.value as any)}
                    className="w-full p-2 border rounded-lg"
                  >
                    <option value="MT103">MT103 - Customer Credit Transfer</option>
                    <option value="MT202">MT202 - General FI Transfer</option>
                    <option value="MT940">MT940 - Customer Statement</option>
                    <option value="pacs.008">pacs.008 - ISO 20022 FI Credit Transfer</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">Receiver BIC Code</label>
                  <select
                    value={newReceiverBic}
                    onChange={(e) => setNewReceiverBic(e.target.value)}
                    className="w-full p-2 border rounded-lg font-mono"
                  >
                    {bicDirectory.map(b => (
                      <option key={b.bic} value={b.bic}>{b.bic} - {b.institutionName}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-slate-700 font-medium mb-1">Transfer Amount</label>
                  <input
                    type="number"
                    value={newAmount}
                    onChange={(e) => setNewAmount(Number(e.target.value))}
                    required
                    className="w-full p-2 border rounded-lg font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Currency</label>
                  <select
                    value={newCurrency}
                    onChange={(e) => setNewCurrency(e.target.value)}
                    className="w-full p-2 border rounded-lg font-bold"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="AED">AED (د.إ)</option>
                    <option value="SGD">SGD (S$)</option>
                    <option value="JPY">JPY (¥)</option>
                  </select>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border space-y-3">
                <div className="font-semibold text-slate-800">Ordering Customer (:50K)</div>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Customer Full Name"
                    value={newOrdName}
                    onChange={(e) => setNewOrdName(e.target.value)}
                    required
                    className="p-2 border rounded bg-white"
                  />
                  <input
                    type="text"
                    placeholder="Account Number / IBAN"
                    value={newOrdAcc}
                    onChange={(e) => setNewOrdAcc(e.target.value)}
                    required
                    className="p-2 border rounded bg-white font-mono"
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border space-y-3">
                <div className="font-semibold text-slate-800">Beneficiary Customer (:59)</div>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Beneficiary Full Name"
                    value={newBenName}
                    onChange={(e) => setNewBenName(e.target.value)}
                    required
                    className="p-2 border rounded bg-white"
                  />
                  <input
                    type="text"
                    placeholder="Beneficiary IBAN / A/C"
                    value={newBenAcc}
                    onChange={(e) => setNewBenAcc(e.target.value)}
                    required
                    className="p-2 border rounded bg-white font-mono"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Beneficiary Bank & Branch"
                  value={newBenBank}
                  onChange={(e) => setNewBenBank(e.target.value)}
                  className="w-full p-2 border rounded bg-white"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-slate-700 font-medium mb-1">Remittance Info (:70)</label>
                  <input
                    type="text"
                    value={newRemittance}
                    onChange={(e) => setNewRemittance(e.target.value)}
                    required
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Charges (:71A)</label>
                  <select
                    value={newCharges}
                    onChange={(e) => setNewCharges(e.target.value as any)}
                    className="w-full p-2 border rounded-lg font-bold"
                  >
                    <option value="OUR">OUR (Sender Pays All)</option>
                    <option value="SHA">SHA (Shared)</option>
                    <option value="BEN">BEN (Beneficiary Pays)</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowNewMsgModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-md cursor-pointer"
                >
                  Validate & Dispatch to SWIFT FIN
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Issue Trade Finance Credit */}
      {showNewTradeModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 space-y-4 my-8">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-lg font-bold text-slate-900">Issue Trade Finance Instrument</h3>
              <button onClick={() => setShowNewTradeModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTrade} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1">Instrument Type</label>
                <select
                  value={newTfType}
                  onChange={(e) => setNewTfType(e.target.value as any)}
                  className="w-full p-2 border rounded-lg"
                >
                  <option value="Letter of Credit (LC)">Letter of Credit (LC) - UCP 600</option>
                  <option value="Bank Guarantee (BG)">Bank Guarantee (BG) - URDG 758</option>
                  <option value="Standby LC (SBLC)">Standby LC (SBLC) - ISP98</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Applicant (Importer / Buyer)</label>
                  <input
                    type="text"
                    required
                    value={newTfApplicant}
                    onChange={(e) => setNewTfApplicant(e.target.value)}
                    className="w-full p-2 border rounded-lg"
                    placeholder="Company Name"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Beneficiary (Exporter / Seller)</label>
                  <input
                    type="text"
                    required
                    value={newTfBeneficiary}
                    onChange={(e) => setNewTfBeneficiary(e.target.value)}
                    className="w-full p-2 border rounded-lg"
                    placeholder="Beneficiary Name"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Amount</label>
                  <input
                    type="number"
                    required
                    value={newTfAmount}
                    onChange={(e) => setNewTfAmount(Number(e.target.value))}
                    className="w-full p-2 border rounded-lg font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Currency</label>
                  <select
                    value={newTfCurrency}
                    onChange={(e) => setNewTfCurrency(e.target.value)}
                    className="w-full p-2 border rounded-lg font-bold"
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="INR">INR</option>
                    <option value="GBP">GBP</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Expiry Date</label>
                  <input
                    type="date"
                    required
                    value={newTfExpiry}
                    onChange={(e) => setNewTfExpiry(e.target.value)}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Tenor</label>
                  <input
                    type="text"
                    required
                    value={newTfTenor}
                    onChange={(e) => setNewTfTenor(e.target.value)}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowNewTradeModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-md cursor-pointer"
                >
                  Issue Instrument
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Create Standing Order */}
      {showNewStandingOrderModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 space-y-4 my-8">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-lg font-bold text-slate-900">Create Standing Order / Auto Sweep</h3>
              <button onClick={() => setShowNewStandingOrderModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSO} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1">Source Account</label>
                <input
                  type="text"
                  required
                  value={newSoSourceName}
                  onChange={(e) => setNewSoSourceName(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Beneficiary Name</label>
                  <input
                    type="text"
                    required
                    value={newSoBenName}
                    onChange={(e) => setNewSoBenName(e.target.value)}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Beneficiary Account</label>
                  <input
                    type="text"
                    required
                    value={newSoBenAcc}
                    onChange={(e) => setNewSoBenAcc(e.target.value)}
                    className="w-full p-2 border rounded-lg font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Rule Type</label>
                  <select
                    value={newSoRuleType}
                    onChange={(e) => setNewSoRuleType(e.target.value as any)}
                    className="w-full p-2 border rounded-lg"
                  >
                    <option value="Fixed Amount">Fixed Amount</option>
                    <option value="Sweep Excess">Sweep Excess Above Threshold</option>
                    <option value="Target Balance Maintain">Target Balance Maintain</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Frequency</label>
                  <select
                    value={newSoFrequency}
                    onChange={(e) => setNewSoFrequency(e.target.value as any)}
                    className="w-full p-2 border rounded-lg"
                  >
                    <option value="Daily">Daily</option>
                    <option value="Weekly">Weekly</option>
                    <option value="Monthly">Monthly</option>
                    <option value="Quarterly">Quarterly</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">
                  {newSoRuleType === 'Fixed Amount' ? 'Amount (₹)' : 'Threshold Limit (₹)'}
                </label>
                <input
                  type="number"
                  required
                  value={newSoRuleType === 'Fixed Amount' ? newSoAmount : newSoThreshold}
                  onChange={(e) => newSoRuleType === 'Fixed Amount' ? setNewSoAmount(Number(e.target.value)) : setNewSoThreshold(Number(e.target.value))}
                  className="w-full p-2 border rounded-lg font-mono font-bold"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowNewStandingOrderModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-md cursor-pointer"
                >
                  Activate Sweep Rule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SwiftHub;
