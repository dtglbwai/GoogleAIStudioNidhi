import React, { useMemo, useState } from 'react';
import { useAppContext } from '../AppContext';
import {
  CoopMember,
  CoopDeposit,
  CoopLoan,
  CoopDividendRecord,
  CoopAgmRecord,
} from './types';
import CoopIcon from '../components/icons/CoopIcon';
import {
  Users,
  PiggyBank,
  Award,
  FileText,
  Calendar,
  Plus,
  Search,
  CheckCircle2,
  Download,
  Building2,
  Calculator,
  Smartphone,
  ShieldCheck,
  Database,
  Landmark,
  KeyRound,
  ArrowRight,
  X,
} from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

type CoopTab =
  | 'members'
  | 'ddo'
  | 'loans'
  | 'deposits'
  | 'memberApp'
  | 'audit'
  | 'security';

const DDO_DIRECTORY = [
  { code: 'DDO-DEL-01', name: 'Delhi Secretariat HQ' },
  { code: 'DDO-MUM-02', name: 'Mumbai Western Division' },
  { code: 'DDO-BLR-03', name: 'Bangalore IT Directorate' },
];

function computeDaysBetween(fromDateStr: string, toDateStr: string): number {
  const start = new Date(fromDateStr);
  const end = new Date(toDateStr);
  if (isNaN(start.getTime()) || isNaN(end.getTime())) return 30;
  const diff = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  return Math.max(0, diff);
}

function downloadFile(filename: string, content: string, mimeType = 'text/csv;charset=utf-8;') {
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

const TrueFincaplinCoop: React.FC = () => {
  const {
    coopMembers,
    coopDeposits,
    coopLoans,
    coopDdoBatches,
    coopPassbookTxns,
    coopBackupSnapshots,
    coopDividends,
    coopAgms,
    handleAddCoopMember,
    handleAddCoopDeposit,
    handleAddCoopLoan,
    handleApproveCoopLoan,
    handlePostCoopLoanRepayment,
    handlePostDdoRecovery,
    handleCreateCoopBackupSnapshot,
    handleAddDividendRecord,
    handleAddAgmRecord,
  } = useAppContext();

  const [activeTab, setActiveTab] = useState<CoopTab>('members');
  const [notice, setNotice] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [ddoFilter, setDdoFilter] = useState<string>('ALL');

  // Modals & Drawers
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showLoanModal, setShowLoanModal] = useState(false);
  const [passbookMemberId, setPassbookMemberId] = useState<string | null>(null);

  // Member Form
  const [newMemberName, setNewMemberName] = useState('');
  const [newEmployeeCode, setNewEmployeeCode] = useState('');
  const [newDesignation, setNewDesignation] = useState('');
  const [newDdoCode, setNewDdoCode] = useState('DDO-DEL-01');
  const [newMemberPan, setNewMemberPan] = useState('');
  const [newMemberAadhaar, setNewMemberAadhaar] = useState('');
  const [newMemberShares, setNewMemberShares] = useState(50);
  const [newMonthlyThrift, setNewMonthlyThrift] = useState(3000);
  const [newMemberNominee, setNewMemberNominee] = useState('');
  const [newMemberBranch, setNewMemberBranch] = useState('Delhi Main Branch');
  const [newMemberPhone, setNewMemberPhone] = useState('');

  // Deposit Form + Automated Maturity Calculator
  const [depMemberId, setDepMemberId] = useState(coopMembers[0]?.id || '');
  const [depType, setDepType] = useState<CoopDeposit['depositType']>('Fixed Deposit (FD)');
  const [depAmount, setDepAmount] = useState(100000);
  const [depRate, setDepRate] = useState(8.5);
  const [depTenure, setDepTenure] = useState(36);

  // Loan Sanction Form
  const [loanMemberId, setLoanMemberId] = useState(coopMembers[0]?.id || '');
  const [loanScheme, setLoanScheme] = useState<CoopLoan['loanScheme']>('Regular Member Loan');
  const [loanAmount, setLoanAmount] = useState(250000);
  const [loanRate, setLoanRate] = useState(10.5);
  const [loanTenure, setLoanTenure] = useState(36);
  const [surety1Name, setSurety1Name] = useState(coopMembers[1]?.memberName || 'Pooja V. Nair');
  const [surety2Name, setSurety2Name] = useState(coopMembers[3]?.memberName || 'Anil Gupta');

  // Day-Based Interest & Repayment Console
  const [selectedLoanId, setSelectedLoanId] = useState<string>(coopLoans[0]?.id || '');
  const [settlementDate, setSettlementDate] = useState<string>('2026-11-18');
  const [repayAmount, setRepayAmount] = useState<number>(12896);
  const [repayMode, setRepayMode] = useState<'DDO Salary Deduction' | 'NEFT/UPI' | 'Cash Counter'>('NEFT/UPI');

  // DDO Recovery Batch Builder
  const [selectedDdoCode, setSelectedDdoCode] = useState<string>('DDO-DEL-01');
  const [billingMonth, setBillingMonth] = useState<string>('2026-11');

  // Member Self-Service Mobile App Preview
  const [portalMemberId, setPortalMemberId] = useState<string>(coopMembers[0]?.id || '');
  const [portalLoanAmt, setPortalLoanAmt] = useState<number>(150000);
  const [portalLoanScheme, setPortalLoanScheme] = useState<CoopLoan['loanScheme']>('Emergency Loan');
  const [portalLoanTenure, setPortalLoanTenure] = useState<number>(24);

  // Security & 2FA State
  const [otpLoginRequired, setOtpLoginRequired] = useState(true);
  const [totpEnabled, setTotpEnabled] = useState(true);
  const [autoBackupDaily, setAutoBackupDaily] = useState(true);
  const [totpCodeInput, setTotpCodeInput] = useState('');
  const [totpVerified, setTotpVerified] = useState<boolean | null>(null);

  const showToast = (msg: string) => {
    setNotice(msg);
    setTimeout(() => setNotice(null), 5000);
  };

  // KPIs
  const totalShareCapital = coopMembers.reduce((s, m) => s + m.shareCapitalAmount, 0);
  const totalThriftCorpus = coopMembers.reduce((s, m) => s + (m.thriftBalance || 0), 0);
  const totalDepositsCorpus = coopDeposits.reduce((s, d) => s + d.principalAmount, 0);
  const totalLoanPortfolio = coopLoans
    .filter((l) => l.status === 'Active' || l.status === 'NPA Watch')
    .reduce((s, l) => s + l.outstandingPrincipal, 0);

  const filteredMembers = coopMembers.filter((m) => {
    const matchesSearch =
      m.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.folioNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (m.employeeCode || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.pan.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDdo = ddoFilter === 'ALL' || m.ddoCode === ddoFilter;
    return matchesSearch && matchesDdo;
  });

  // Automated FD / RD Maturity Estimator
  const estimatedDepositMaturity = useMemo(() => {
    const r = depRate / 100;
    const years = depTenure / 12;
    if (depType === 'Recurring Deposit (RD)' || depType === 'Daily Pigmy Deposit') {
      const n = 4; // quarterly compounding
      const monthly = depType === 'Daily Pigmy Deposit' ? depAmount * 30 : depAmount;
      let total = 0;
      for (let i = 1; i <= depTenure; i++) {
        total += monthly * Math.pow(1 + r / n, (n * (depTenure - i + 1)) / 12);
      }
      return Math.round(total);
    }
    return Math.round(depAmount * Math.pow(1 + r / 4, 4 * years));
  }, [depAmount, depRate, depTenure, depType]);

  // Selected Loan Day-Based Interest Computation
  const selectedLoan = coopLoans.find((l) => l.id === selectedLoanId) || coopLoans[0];
  const dayInterestCalc = useMemo(() => {
    if (!selectedLoan) return { days: 0, interest: 0, principalPortion: 0 };
    const days = computeDaysBetween(selectedLoan.lastPaymentDate, settlementDate);
    const interest = Math.round(
      selectedLoan.outstandingPrincipal * (selectedLoan.interestRate / 100) * (days / 365)
    );
    const principalPortion = Math.max(
      0,
      Math.min(selectedLoan.outstandingPrincipal, repayAmount - interest)
    );
    return { days, interest, principalPortion };
  }, [selectedLoan, settlementDate, repayAmount]);

  // DDO Demand Sheet Builder
  const ddoDemandRows = useMemo(() => {
    const targetMembers = coopMembers.filter(
      (m) => m.ddoCode === selectedDdoCode && m.status === 'Active'
    );
    return targetMembers.map((member) => {
      const thriftDue = member.monthlyThriftContribution || 2500;
      const memberLoans = coopLoans.filter(
        (l) => l.memberId === member.id && (l.status === 'Active' || l.status === 'NPA Watch')
      );
      const loanInterestDue = memberLoans.reduce((sum, l) => {
        const days = computeDaysBetween(l.lastPaymentDate, `${billingMonth}-25`);
        return sum + Math.round(l.outstandingPrincipal * (l.interestRate / 100) * (days / 365));
      }, 0);
      const loanEmiTotal = memberLoans.reduce((sum, l) => sum + l.emiAmount, 0);
      const loanPrincipalDue = Math.max(0, loanEmiTotal - loanInterestDue);
      const rdDue = coopDeposits
        .filter((d) => d.memberId === member.id && d.depositType === 'Recurring Deposit (RD)' && d.status === 'Active')
        .reduce((sum, d) => sum + d.principalAmount, 0);
      const totalRecovery = thriftDue + loanPrincipalDue + loanInterestDue + rdDue;
      return {
        member,
        thriftDue,
        loanPrincipalDue,
        loanInterestDue,
        rdDue,
        totalRecovery,
      };
    });
  }, [coopMembers, coopLoans, coopDeposits, selectedDdoCode, billingMonth]);

  const ddoTotals = useMemo(() => {
    return ddoDemandRows.reduce(
      (acc, r) => ({
        thrift: acc.thrift + r.thriftDue,
        principal: acc.principal + r.loanPrincipalDue,
        interest: acc.interest + r.loanInterestDue,
        rd: acc.rd + r.rdDue,
        grand: acc.grand + r.totalRecovery,
      }),
      { thrift: 0, principal: 0, interest: 0, rd: 0, grand: 0 }
    );
  }, [ddoDemandRows]);

  const handleCreateMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName || !newMemberPan) return;
    const ddo = DDO_DIRECTORY.find((d) => d.code === newDdoCode);
    const newMember: Omit<CoopMember, 'id'> = {
      folioNumber: `FOLIO-2026-${String(coopMembers.length + 1).padStart(3, '0')}`,
      employeeCode: newEmployeeCode || `EMP-${Math.floor(4000 + Math.random() * 5000)}`,
      memberName: newMemberName,
      designation: newDesignation || 'Officer',
      ddoCode: newDdoCode,
      ddoName: ddo?.name || 'Headquarters',
      pan: newMemberPan.toUpperCase(),
      aadhaar: newMemberAadhaar || '999988887777',
      shareCount: Number(newMemberShares),
      shareCapitalAmount: Number(newMemberShares) * 1000,
      thriftBalance: Number(newMonthlyThrift),
      monthlyThriftContribution: Number(newMonthlyThrift),
      savingsBalance: 5000,
      admissionDate: new Date().toISOString().split('T')[0],
      retirementDate: '2040-06-30',
      status: 'Active',
      nomineeName: newMemberNominee || 'Nominee',
      branch: newMemberBranch,
      phone: newMemberPhone || '9800000000',
    };
    handleAddCoopMember(newMember);
    setShowMemberModal(false);
    setNewMemberName('');
    setNewEmployeeCode('');
    setNewDesignation('');
    setNewMemberPan('');
    setNewMemberAadhaar('');
    setNewMemberNominee('');
    setNewMemberPhone('');
    showToast(`Enrolled member ${newMember.memberName} (${newMember.folioNumber}) under ${newDdoCode}.`);
  };

  const handleCreateDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    const member = coopMembers.find((m) => m.id === depMemberId);
    if (!member) return;
    const prefix =
      depType === 'Fixed Deposit (FD)'
        ? 'FD'
        : depType === 'Recurring Deposit (RD)'
        ? 'RD'
        : depType === 'Daily Pigmy Deposit'
        ? 'PIG'
        : 'THR';
    const newDep: Omit<CoopDeposit, 'id'> = {
      depositNumber: `${prefix}-2026-${Math.floor(100 + Math.random() * 900)}`,
      memberId: member.id,
      memberName: member.memberName,
      depositType: depType,
      principalAmount: Number(depAmount),
      interestRate: Number(depRate),
      tenureMonths: Number(depTenure),
      maturityDate: new Date(Date.now() + depTenure * 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0],
      maturityAmount: estimatedDepositMaturity,
      status: 'Active',
    };
    handleAddCoopDeposit(newDep);
    setShowDepositModal(false);
    showToast(`Opened ${newDep.depositType} ${newDep.depositNumber} for ${member.memberName}.`);
  };

  const handleCreateLoan = (e: React.FormEvent) => {
    e.preventDefault();
    const member = coopMembers.find((m) => m.id === loanMemberId);
    if (!member) return;
    const monthlyRate = loanRate / 12 / 100;
    const emi = Math.round(
      (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, loanTenure)) /
        (Math.pow(1 + monthlyRate, loanTenure) - 1)
    );
    const today = new Date().toISOString().split('T')[0];
    const newLoan: Omit<CoopLoan, 'id'> = {
      loanAccountNo: `ECCS-LN-2026-${Math.floor(200 + Math.random() * 799)}`,
      memberId: member.id,
      memberName: member.memberName,
      ddoCode: member.ddoCode || 'DDO-DEL-01',
      loanScheme,
      sanctionedAmount: Number(loanAmount),
      outstandingPrincipal: Number(loanAmount),
      interestRate: Number(loanRate),
      tenureMonths: Number(loanTenure),
      emiAmount: emi,
      disbursedDate: today,
      lastPaymentDate: today,
      surety1Name,
      surety2Name,
      dpdDays: 0,
      status: 'Active',
    };
    handleAddCoopLoan(newLoan);
    setShowLoanModal(false);
    showToast(`Sanctioned ${newLoan.loanScheme} (${newLoan.loanAccountNo}) with EMI ${formatCurrency(emi)}.`);
  };

  const handleExportDdoCsv = () => {
    const header = 'Folio,EmployeeCode,MemberName,DDO,ThriftDue,LoanPrincipal,DayBasedInterest,RDDue,TotalRecovery\n';
    const rows = ddoDemandRows
      .map(
        (r) =>
          `${r.member.folioNumber},${r.member.employeeCode || ''},"${r.member.memberName}",${selectedDdoCode},${r.thriftDue},${r.loanPrincipalDue},${r.loanInterestDue},${r.rdDue},${r.totalRecovery}`
      )
      .join('\n');
    downloadFile(`truefincaplincoop_ddo_${selectedDdoCode}_${billingMonth}.csv`, header + rows);
    showToast(`Exported DDO salary deduction demand sheet for ${selectedDdoCode} (${billingMonth}).`);
  };

  const handleExportFormMCsv = () => {
    const header = 'Folio,EmployeeCode,MemberName,DDO,PAN,Shares,ShareCapital,ThriftBalance,SavingsBalance,Nominee,Status\n';
    const rows = coopMembers
      .map(
        (m) =>
          `${m.folioNumber},${m.employeeCode || ''},"${m.memberName}",${m.ddoCode || ''},${m.pan},${m.shareCount},${m.shareCapitalAmount},${m.thriftBalance || 0},${m.savingsBalance},"${m.nomineeName}",${m.status}`
      )
      .join('\n');
    downloadFile('truefincaplincoop_form_m_member_register.csv', header + rows);
    showToast('Downloaded Statutory Form M (Register of Members) CSV.');
  };

  const handleExportAuditBalanceSheet = () => {
    const lines = [
      'Schedule,Particulars,Amount_INR',
      `Liabilities,Member Share Capital,${totalShareCapital}`,
      `Liabilities,Member Thrift Fund Corpus,${totalThriftCorpus}`,
      `Liabilities,Fixed & Recurring Deposits,${totalDepositsCorpus}`,
      `Liabilities,Statutory Reserve Fund (25%),5137500`,
      `Liabilities,Cooperative Education Fund (5%),1027500`,
      `Assets,Member Loans Outstanding,${totalLoanPortfolio}`,
      `Assets,Cash & Cooperative Bank Balances,${Math.max(0, totalShareCapital + totalThriftCorpus + totalDepositsCorpus - totalLoanPortfolio)}`,
    ].join('\n');
    downloadFile('truefincaplincoop_audit_trial_balance.csv', lines);
    showToast('Downloaded Audit Trial Balance & Balance Sheet Schedules.');
  };

  const portalMember = coopMembers.find((m) => m.id === portalMemberId) || coopMembers[0];
  const portalLoans = coopLoans.filter((l) => l.memberId === portalMember?.id);
  const portalDeposits = coopDeposits.filter((d) => d.memberId === portalMember?.id);
  const portalTxns = coopPassbookTxns.filter((t) => t.memberId === portalMember?.id);
  const passbookMember = coopMembers.find((m) => m.id === passbookMemberId);

  return (
    <div className="space-y-6 pb-12">
      {/* Inline Notification Banner */}
      {notice && (
        <div className="bg-emerald-900 text-white px-4 py-3 rounded-lg flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
            <span>{notice}</span>
          </div>
          <button onClick={() => setNotice(null)} className="text-emerald-200 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header Workspace Banner */}
      <div className="bg-slate-900 rounded-xl p-6 text-white border border-slate-800">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-5 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-emerald-600/20 rounded-lg border border-emerald-500/30 text-emerald-400">
              <CoopIcon className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white">truefincaplincoop</h1>
              <p className="text-sm text-slate-300">
                Employee Credit Co-operative Society & Thrift Cloud Platform · DDO Payroll Recovery · Day-Based Interest · Member Portal
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setActiveTab('ddo')}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-100 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 transition-colors"
            >
              DDO Salary Demand
            </button>
            <button
              onClick={() => setShowMemberModal(true)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap shrink-0 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Enroll Member</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 pt-5">
          <div>
            <div className="text-xs text-slate-400">Registered Members</div>
            <div className="text-xl font-bold font-mono tabular-nums mt-1">{coopMembers.length} Folios</div>
          </div>
          <div>
            <div className="text-xs text-slate-400">Share Capital</div>
            <div className="text-xl font-bold font-mono tabular-nums mt-1">{formatCurrency(totalShareCapital)}</div>
          </div>
          <div>
            <div className="text-xs text-slate-400">Thrift Fund Corpus</div>
            <div className="text-xl font-bold font-mono tabular-nums text-emerald-400 mt-1">
              {formatCurrency(totalThriftCorpus)}
            </div>
          </div>
          <div>
            <div className="text-xs text-slate-400">FD / RD / Pigmy Book</div>
            <div className="text-xl font-bold font-mono tabular-nums mt-1">{formatCurrency(totalDepositsCorpus)}</div>
          </div>
          <div>
            <div className="text-xs text-slate-400">Loan Outstanding</div>
            <div className="text-xl font-bold font-mono tabular-nums text-amber-300 mt-1">
              {formatCurrency(totalLoanPortfolio)}
            </div>
          </div>
        </div>
      </div>

      {/* Single-Line Navigation Tabs */}
      <div className="bg-white border border-slate-200 rounded-xl px-4 overflow-x-auto">
        <div className="flex items-center space-x-6">
          {[
            { id: 'members', label: 'Members & Thrift', icon: Users },
            { id: 'ddo', label: 'DDO Salary Deductions', icon: Building2 },
            { id: 'loans', label: 'Loans & Day Interest', icon: Calculator },
            { id: 'deposits', label: 'FD / RD & Calculators', icon: PiggyBank },
            { id: 'memberApp', label: 'Member Mobile Portal', icon: Smartphone },
            { id: 'audit', label: 'Dividends, AGM & Audit', icon: Landmark },
            { id: 'security', label: '2FA, OTP & Backups', icon: ShieldCheck },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as CoopTab)}
                className={`py-3.5 border-b-2 text-xs font-semibold flex items-center space-x-2 whitespace-nowrap shrink-0 transition-colors ${
                  active
                    ? 'border-emerald-600 text-emerald-700'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB 1: MEMBERS & THRIFT */}
      {activeTab === 'members' && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search folio, employee ID, name, or PAN..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>
              <select
                value={ddoFilter}
                onChange={(e) => setDdoFilter(e.target.value)}
                className="px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white"
              >
                <option value="ALL">All DDO Units</option>
                {DDO_DIRECTORY.map((d) => (
                  <option key={d.code} value={d.code}>
                    {d.code} — {d.name}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={() => setShowMemberModal(true)}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700 flex items-center space-x-1.5 whitespace-nowrap shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Enroll New Member</span>
            </button>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 font-semibold text-xs border-b border-slate-200">
                    <th className="py-3 px-4">Folio & Member</th>
                    <th className="py-3 px-4">Employee & DDO Unit</th>
                    <th className="py-3 px-4 text-right">Share Capital</th>
                    <th className="py-3 px-4 text-right">Thrift Fund</th>
                    <th className="py-3 px-4 text-right">Savings</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Passbook</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {filteredMembers.map((m) => (
                    <tr key={m.id} className="hover:bg-slate-50">
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-900">{m.memberName}</div>
                        <div className="text-xs text-slate-500 font-mono tabular-nums">
                          {m.folioNumber} · PAN {m.pan}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-slate-800 font-medium">{m.designation || 'Member'}</div>
                        <div className="text-xs text-slate-500">
                          {m.employeeCode || 'EMP-NEW'} · {m.ddoCode || 'DDO-HQ'}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right font-mono tabular-nums">
                        <div className="font-semibold text-slate-900">{formatCurrency(m.shareCapitalAmount)}</div>
                        <div className="text-xs text-slate-500">{m.shareCount} shares</div>
                      </td>
                      <td className="py-3 px-4 text-right font-mono tabular-nums">
                        <div className="font-semibold text-emerald-700">{formatCurrency(m.thriftBalance || 0)}</div>
                        <div className="text-xs text-slate-500">+{formatCurrency(m.monthlyThriftContribution || 2500)}/mo</div>
                      </td>
                      <td className="py-3 px-4 text-right font-mono tabular-nums text-slate-900">
                        {formatCurrency(m.savingsBalance)}
                      </td>
                      <td className="py-3 px-4 text-xs font-semibold text-emerald-700">{m.status}</td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => setPassbookMemberId(m.id)}
                          className="px-3 py-1.5 text-xs font-semibold text-slate-700 border border-slate-200 rounded-md hover:bg-slate-100 whitespace-nowrap"
                        >
                          View Passbook
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredMembers.length === 0 && (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-sm text-slate-500">
                        No members match your current filter.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DDO SALARY DEDUCTIONS */}
      {activeTab === 'ddo' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">DDO-Wise Monthly Salary Recovery Engine</h2>
                <p className="text-xs text-slate-500">
                  Generate automated Drawing & Disbursing Officer payroll deduction demand sheets and post bulk recoveries.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <select
                  value={selectedDdoCode}
                  onChange={(e) => setSelectedDdoCode(e.target.value)}
                  className="px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white"
                >
                  {DDO_DIRECTORY.map((d) => (
                    <option key={d.code} value={d.code}>
                      {d.code} — {d.name}
                    </option>
                  ))}
                </select>
                <input
                  type="month"
                  value={billingMonth}
                  onChange={(e) => setBillingMonth(e.target.value)}
                  className="px-3 py-2 border border-slate-200 rounded-lg text-sm font-mono"
                />
                <button
                  onClick={handleExportDdoCsv}
                  className="px-4 py-2 border border-slate-200 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-50 flex items-center space-x-1.5 whitespace-nowrap"
                >
                  <Download className="w-4 h-4" />
                  <span>Export Demand CSV</span>
                </button>
                <button
                  onClick={() => {
                    const ddo = DDO_DIRECTORY.find((d) => d.code === selectedDdoCode);
                    handlePostDdoRecovery({
                      ddoCode: selectedDdoCode,
                      ddoName: ddo?.name || selectedDdoCode,
                      billingMonth,
                      memberCount: ddoDemandRows.length,
                      totalThriftDemand: ddoTotals.thrift,
                      totalLoanPrincipalDemand: ddoTotals.principal,
                      totalDayBasedInterestDemand: ddoTotals.interest,
                      totalRdDemand: ddoTotals.rd,
                      grandTotalDemand: ddoTotals.grand,
                      status: 'Posted to Ledger',
                    });
                    showToast(
                      `Posted ${formatCurrency(ddoTotals.grand)} DDO recovery batch for ${selectedDdoCode} (${billingMonth}) to member ledgers.`
                    );
                  }}
                  disabled={ddoDemandRows.length === 0}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700 disabled:opacity-50 whitespace-nowrap"
                >
                  Post Recovery to Ledger
                </button>
              </div>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-lg">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 text-xs font-semibold border-b border-slate-200">
                    <th className="py-3 px-4">Employee & Folio</th>
                    <th className="py-3 px-4 text-right">Thrift Deduction</th>
                    <th className="py-3 px-4 text-right">Loan Principal</th>
                    <th className="py-3 px-4 text-right">Day-Based Interest</th>
                    <th className="py-3 px-4 text-right">RD Installment</th>
                    <th className="py-3 px-4 text-right">Total Salary Recovery</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {ddoDemandRows.map((row) => (
                    <tr key={row.member.id} className="hover:bg-slate-50">
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-900">{row.member.memberName}</div>
                        <div className="text-xs text-slate-500 font-mono">
                          {row.member.employeeCode} · {row.member.folioNumber}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right font-mono tabular-nums">{formatCurrency(row.thriftDue)}</td>
                      <td className="py-3 px-4 text-right font-mono tabular-nums">{formatCurrency(row.loanPrincipalDue)}</td>
                      <td className="py-3 px-4 text-right font-mono tabular-nums text-amber-700">
                        {formatCurrency(row.loanInterestDue)}
                      </td>
                      <td className="py-3 px-4 text-right font-mono tabular-nums">{formatCurrency(row.rdDue)}</td>
                      <td className="py-3 px-4 text-right font-mono tabular-nums font-bold text-emerald-700">
                        {formatCurrency(row.totalRecovery)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-slate-50 font-bold text-sm border-t border-slate-200">
                    <td className="py-3 px-4">Total Demand ({ddoDemandRows.length} Employees)</td>
                    <td className="py-3 px-4 text-right font-mono tabular-nums">{formatCurrency(ddoTotals.thrift)}</td>
                    <td className="py-3 px-4 text-right font-mono tabular-nums">{formatCurrency(ddoTotals.principal)}</td>
                    <td className="py-3 px-4 text-right font-mono tabular-nums">{formatCurrency(ddoTotals.interest)}</td>
                    <td className="py-3 px-4 text-right font-mono tabular-nums">{formatCurrency(ddoTotals.rd)}</td>
                    <td className="py-3 px-4 text-right font-mono tabular-nums text-emerald-700">
                      {formatCurrency(ddoTotals.grand)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
            <h3 className="font-bold text-slate-900 text-sm">Posted DDO Recovery Batches</h3>
            <div className="divide-y divide-slate-100">
              {coopDdoBatches.map((b) => (
                <div key={b.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-sm">
                  <div>
                    <div className="font-semibold text-slate-900">
                      {b.ddoCode} · {b.ddoName} ({b.billingMonth})
                    </div>
                    <div className="text-xs text-slate-500">
                      {b.memberCount} members · Posted {b.postedAt || 'Just now'}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-mono tabular-nums font-bold text-slate-900">
                      {formatCurrency(b.grandTotalDemand)}
                    </span>
                    <span className="text-xs font-semibold text-emerald-700">{b.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: LOANS & DAY-BASED INTEREST */}
      {activeTab === 'loans' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-5 space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="font-bold text-slate-900 text-lg">Member Loan Portfolio & Surety Register</h2>
                <p className="text-xs text-slate-500">
                  Tracks Regular, Emergency, Festival, and Surety loans with guarantor verification.
                </p>
              </div>
              <button
                onClick={() => setShowLoanModal(true)}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700 flex items-center space-x-1.5 whitespace-nowrap"
              >
                <Plus className="w-4 h-4" />
                <span>Sanction Loan</span>
              </button>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-lg">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 text-xs font-semibold border-b border-slate-200">
                    <th className="py-3 px-4">Loan A/c & Member</th>
                    <th className="py-3 px-4">Scheme & Guarantors</th>
                    <th className="py-3 px-4 text-right">Outstanding</th>
                    <th className="py-3 px-4 text-right">Rate / EMI</th>
                    <th className="py-3 px-4">Last Paid</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {coopLoans.map((l) => (
                    <tr
                      key={l.id}
                      onClick={() => {
                        setSelectedLoanId(l.id);
                        setRepayAmount(l.emiAmount);
                      }}
                      className={`cursor-pointer hover:bg-slate-50 ${
                        selectedLoan?.id === l.id ? 'bg-emerald-50/50' : ''
                      }`}
                    >
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-900">{l.memberName}</div>
                        <div className="text-xs font-mono text-slate-500">{l.loanAccountNo}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-slate-800 font-medium">{l.loanScheme}</div>
                        <div className="text-xs text-slate-500">
                          Surety: {l.surety1Name}
                          {l.surety2Name ? `, ${l.surety2Name}` : ''}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right font-mono tabular-nums font-bold text-slate-900">
                        {formatCurrency(l.outstandingPrincipal)}
                      </td>
                      <td className="py-3 px-4 text-right font-mono tabular-nums">
                        <div>{l.interestRate}%</div>
                        <div className="text-xs text-slate-500">EMI {formatCurrency(l.emiAmount)}</div>
                      </td>
                      <td className="py-3 px-4 text-xs font-mono text-slate-600">{l.lastPaymentDate}</td>
                      <td className="py-3 px-4 text-xs font-semibold">
                        {l.status === 'Pending Approval' ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleApproveCoopLoan(l.id);
                              showToast(`Approved and disbursed ${l.loanAccountNo}.`);
                            }}
                            className="px-2.5 py-1 bg-amber-100 text-amber-800 rounded hover:bg-amber-200"
                          >
                            Approve Now
                          </button>
                        ) : (
                          <span className={l.status === 'NPA Watch' ? 'text-red-600' : 'text-emerald-700'}>
                            {l.status}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Automated Day-Based Interest Calculator */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
            <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
              <Calculator className="w-5 h-5 text-emerald-600" />
              <h3 className="font-bold text-slate-900 text-base">Day-Based Interest Engine</h3>
            </div>
            {selectedLoan && (
              <div className="space-y-4 text-sm">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Active Loan Account</label>
                  <select
                    value={selectedLoan.id}
                    onChange={(e) => {
                      setSelectedLoanId(e.target.value);
                      const next = coopLoans.find((x) => x.id === e.target.value);
                      if (next) setRepayAmount(next.emiAmount);
                    }}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white"
                  >
                    {coopLoans.map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.loanAccountNo} — {l.memberName}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-lg text-xs">
                  <div>
                    <span className="text-slate-500 block">Outstanding Principal</span>
                    <strong className="font-mono tabular-nums text-slate-900">
                      {formatCurrency(selectedLoan.outstandingPrincipal)}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Last Payment Date</span>
                    <strong className="font-mono text-slate-900">{selectedLoan.lastPaymentDate}</strong>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Collection / Value Date</label>
                  <input
                    type="date"
                    value={settlementDate}
                    onChange={(e) => setSettlementDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm font-mono"
                  />
                </div>

                <div className="bg-slate-900 text-white p-4 rounded-lg space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Days Since Last Payment</span>
                    <span className="font-mono tabular-nums font-bold">{dayInterestCalc.days} Days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Accrued Day-Based Interest ({selectedLoan.interestRate}%)</span>
                    <span className="font-mono tabular-nums font-bold text-amber-300">
                      {formatCurrency(dayInterestCalc.interest)}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-slate-800">
                    <span className="text-slate-300">Principal Reduction</span>
                    <span className="font-mono tabular-nums font-bold text-emerald-400">
                      {formatCurrency(dayInterestCalc.principalPortion)}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Amount Collected (₹)</label>
                    <input
                      type="number"
                      value={repayAmount}
                      onChange={(e) => setRepayAmount(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Receipt Mode</label>
                    <select
                      value={repayMode}
                      onChange={(e: any) => setRepayMode(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white"
                    >
                      <option value="NEFT/UPI">NEFT / UPI</option>
                      <option value="DDO Salary Deduction">DDO Salary Deduction</option>
                      <option value="Cash Counter">Cash Counter</option>
                    </select>
                  </div>
                </div>

                <button
                  onClick={() => {
                    handlePostCoopLoanRepayment(
                      selectedLoan.id,
                      repayAmount,
                      dayInterestCalc.interest,
                      dayInterestCalc.principalPortion,
                      repayMode
                    );
                    showToast(
                      `Posted ${formatCurrency(repayAmount)} to ${selectedLoan.loanAccountNo} (${dayInterestCalc.days} days interest settled).`
                    );
                  }}
                  disabled={selectedLoan.outstandingPrincipal <= 0}
                  className="w-full py-2.5 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700 disabled:opacity-50"
                >
                  Post Day-Calculated Recovery
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: FD / RD / PIGMY & MATURITY CALCULATORS */}
      {activeTab === 'deposits' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white border border-slate-200 rounded-xl p-4 flex justify-between items-center">
              <div>
                <h2 className="font-bold text-slate-900 text-lg">Member Deposits (FD / RD / Thrift / Pigmy)</h2>
                <p className="text-xs text-slate-500">Automated quarterly compounding interest and maturity schedules</p>
              </div>
              <button
                onClick={() => setShowDepositModal(true)}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700 flex items-center space-x-1.5 whitespace-nowrap"
              >
                <Plus className="w-4 h-4" />
                <span>Open Deposit Account</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {coopDeposits.map((dep) => (
                <div key={dep.id} className="bg-white border border-slate-200 rounded-xl p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-xs font-mono text-emerald-700 font-semibold">{dep.depositNumber}</div>
                      <div className="font-bold text-slate-900 text-sm">{dep.memberName}</div>
                    </div>
                    <span className="text-xs font-medium text-slate-600">{dep.depositType}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-lg text-xs">
                    <div>
                      <span className="text-slate-500 block">Principal / Installment</span>
                      <strong className="font-mono tabular-nums text-slate-900">
                        {formatCurrency(dep.principalAmount)}
                      </strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Rate & Tenure</span>
                      <strong className="font-mono tabular-nums text-emerald-700">
                        {dep.interestRate}% · {dep.tenureMonths}m
                      </strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Maturity Amount</span>
                      <strong className="font-mono tabular-nums text-slate-900">
                        {formatCurrency(dep.maturityAmount)}
                      </strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Maturity Date</span>
                      <strong className="font-mono text-slate-800">{dep.maturityDate}</strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 h-fit">
            <h3 className="font-bold text-slate-900 text-base">Automated FD / RD Interest Calculator</h3>
            <div className="space-y-3 text-sm">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Scheme Type</label>
                <select
                  value={depType}
                  onChange={(e: any) => setDepType(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white"
                >
                  <option value="Fixed Deposit (FD)">Fixed Deposit (FD)</option>
                  <option value="Recurring Deposit (RD)">Recurring Deposit (RD)</option>
                  <option value="Daily Pigmy Deposit">Daily Pigmy Deposit</option>
                  <option value="Thrift Deposit">Thrift Deposit</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  {depType === 'Fixed Deposit (FD)' ? 'Deposit Amount (₹)' : 'Periodic Installment (₹)'}
                </label>
                <input
                  type="number"
                  value={depAmount}
                  onChange={(e) => setDepAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm font-mono"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Interest Rate (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={depRate}
                    onChange={(e) => setDepRate(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Tenure (Months)</label>
                  <input
                    type="number"
                    value={depTenure}
                    onChange={(e) => setDepTenure(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm font-mono"
                  />
                </div>
              </div>

              <div className="bg-slate-900 text-white p-4 rounded-lg space-y-1">
                <div className="text-xs text-slate-400">Projected Maturity Value (Quarterly Compounding)</div>
                <div className="text-2xl font-bold font-mono tabular-nums text-emerald-400">
                  {formatCurrency(estimatedDepositMaturity)}
                </div>
              </div>
              <button
                onClick={() => setShowDepositModal(true)}
                className="w-full py-2 border border-emerald-600 text-emerald-700 rounded-lg text-xs font-semibold hover:bg-emerald-50"
              >
                Open Account with These Terms
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: MEMBER SELF-SERVICE MOBILE PORTAL PREVIEW */}
      {activeTab === 'memberApp' && portalMember && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 h-fit">
            <h3 className="font-bold text-slate-900 text-base">truefincaplincoop Member App Console</h3>
            <p className="text-xs text-slate-500">
              Preview the member mobile experience: view balances, inspect passbook statements, track loans, and submit loan applications.
            </p>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Act As Member</label>
              <select
                value={portalMember.id}
                onChange={(e) => setPortalMemberId(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white"
              >
                {coopMembers.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.memberName} ({m.folioNumber})
                  </option>
                ))}
              </select>
            </div>

            <div className="pt-4 border-t border-slate-100 space-y-3">
              <h4 className="font-semibold text-slate-900 text-sm">Submit New Member Loan Request</h4>
              <select
                value={portalLoanScheme}
                onChange={(e: any) => setPortalLoanScheme(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white"
              >
                <option value="Emergency Loan">Emergency Loan</option>
                <option value="Festival Advance">Festival Advance</option>
                <option value="Regular Member Loan">Regular Member Loan</option>
                <option value="Loan Against Thrift/FD">Loan Against Thrift/FD</option>
              </select>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  value={portalLoanAmt}
                  onChange={(e) => setPortalLoanAmt(Number(e.target.value))}
                  className="px-3 py-2 border border-slate-200 rounded-lg text-sm font-mono"
                  placeholder="Amount"
                />
                <input
                  type="number"
                  value={portalLoanTenure}
                  onChange={(e) => setPortalLoanTenure(Number(e.target.value))}
                  className="px-3 py-2 border border-slate-200 rounded-lg text-sm font-mono"
                  placeholder="Months"
                />
              </div>
              <button
                onClick={() => {
                  const rate = 10.0;
                  const r = rate / 12 / 100;
                  const emi = Math.round(
                    (portalLoanAmt * r * Math.pow(1 + r, portalLoanTenure)) /
                      (Math.pow(1 + r, portalLoanTenure) - 1)
                  );
                  const today = new Date().toISOString().split('T')[0];
                  handleAddCoopLoan({
                    loanAccountNo: `ECCS-REQ-${Math.floor(100 + Math.random() * 899)}`,
                    memberId: portalMember.id,
                    memberName: portalMember.memberName,
                    ddoCode: portalMember.ddoCode || 'DDO-DEL-01',
                    loanScheme: portalLoanScheme,
                    sanctionedAmount: portalLoanAmt,
                    outstandingPrincipal: portalLoanAmt,
                    interestRate: rate,
                    tenureMonths: portalLoanTenure,
                    emiAmount: emi,
                    disbursedDate: today,
                    lastPaymentDate: today,
                    surety1Name: coopMembers.find((m) => m.id !== portalMember.id)?.memberName || 'Member Surety',
                    dpdDays: 0,
                    status: 'Pending Approval',
                  });
                  showToast(`Loan application submitted by ${portalMember.memberName} for officer review in Loans tab.`);
                }}
                className="w-full py-2 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700 flex items-center justify-center gap-1.5"
              >
                <span>Submit Loan Application</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Mobile App Frame Preview */}
          <div className="lg:col-span-2 flex justify-center">
            <div className="w-full max-w-md bg-slate-900 rounded-3xl p-4 border-4 border-slate-800 shadow-lg space-y-4 text-white">
              <div className="flex justify-between items-center px-2 pt-1">
                <div>
                  <div className="text-xs text-emerald-400 font-semibold">truefincaplincoop Mobile</div>
                  <div className="text-base font-bold">{portalMember.memberName}</div>
                  <div className="text-[11px] text-slate-400 font-mono">
                    {portalMember.folioNumber} · {portalMember.ddoCode}
                  </div>
                </div>
                <span className="text-xs px-2 py-1 bg-slate-800 rounded text-emerald-300 font-mono">OTP Verified</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-800 p-3 rounded-xl">
                  <div className="text-[11px] text-slate-400">Thrift Fund Balance</div>
                  <div className="text-lg font-bold font-mono tabular-nums text-emerald-400">
                    {formatCurrency(portalMember.thriftBalance || 0)}
                  </div>
                </div>
                <div className="bg-slate-800 p-3 rounded-xl">
                  <div className="text-[11px] text-slate-400">Share Capital</div>
                  <div className="text-lg font-bold font-mono tabular-nums">
                    {formatCurrency(portalMember.shareCapitalAmount)}
                  </div>
                </div>
                <div className="bg-slate-800 p-3 rounded-xl">
                  <div className="text-[11px] text-slate-400">Active Deposits ({portalDeposits.length})</div>
                  <div className="text-base font-bold font-mono tabular-nums">
                    {formatCurrency(portalDeposits.reduce((s, d) => s + d.principalAmount, 0))}
                  </div>
                </div>
                <div className="bg-slate-800 p-3 rounded-xl">
                  <div className="text-[11px] text-slate-400">Loan Outstanding ({portalLoans.length})</div>
                  <div className="text-base font-bold font-mono tabular-nums text-amber-300">
                    {formatCurrency(portalLoans.reduce((s, l) => s + l.outstandingPrincipal, 0))}
                  </div>
                </div>
              </div>

              {portalLoans.map((l) => {
                const repaidPct = Math.min(
                  100,
                  Math.round(((l.sanctionedAmount - l.outstandingPrincipal) / l.sanctionedAmount) * 100)
                );
                return (
                  <div key={l.id} className="bg-slate-800 p-3 rounded-xl space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold">{l.loanScheme}</span>
                      <span className="font-mono text-slate-300">{l.status}</span>
                    </div>
                    <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-2" style={{ width: `${repaidPct}%` }} />
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                      <span>{repaidPct}% Repaid</span>
                      <span>Bal: {formatCurrency(l.outstandingPrincipal)}</span>
                    </div>
                  </div>
                );
              })}

              <div className="bg-white text-slate-900 rounded-xl p-3 space-y-2">
                <div className="text-xs font-bold text-slate-700 border-b border-slate-100 pb-1.5">
                  Recent Digital Passbook Entries
                </div>
                {portalTxns.length === 0 ? (
                  <div className="text-xs text-slate-500 py-3 text-center">No recent entries recorded yet.</div>
                ) : (
                  portalTxns.slice(0, 4).map((t) => (
                    <div key={t.id} className="flex justify-between items-center text-xs py-1 border-b border-slate-50 last:border-0">
                      <div>
                        <div className="font-medium text-slate-900">{t.particulars}</div>
                        <div className="text-[11px] text-slate-500">
                          {t.date} · {t.mode}
                        </div>
                      </div>
                      <span className="font-mono tabular-nums font-bold text-emerald-700">
                        +{formatCurrency(t.credit)}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: DIVIDENDS, AGM & AUDIT REPORTS */}
      {activeTab === 'audit' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-4">
              <div>
                <h2 className="font-bold text-slate-900 text-lg">Audit-Ready Statements & Statutory Registers</h2>
                <p className="text-xs text-slate-500">
                  Export Form M Member Register, Trial Balance, NPA Overdue Schedule, and Cooperative Profit Appropriation.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={handleExportFormMCsv}
                  className="px-3 py-2 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5"
                >
                  <Download className="w-4 h-4" />
                  <span>Export Form M CSV</span>
                </button>
                <button
                  onClick={handleExportAuditBalanceSheet}
                  className="px-3 py-2 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700 flex items-center gap-1.5"
                >
                  <FileText className="w-4 h-4" />
                  <span>Export Audit Trial Balance</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Dividend Appropriation */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-emerald-600" />
                    <span>Dividend & Statutory Fund Distribution</span>
                  </h3>
                  <button
                    onClick={() => {
                      handleAddDividendRecord({
                        financialYear: '2026-27',
                        totalProfit: 14500000,
                        dividendRatePct: 15.0,
                        statutoryReserveFund: 3625000,
                        educationFund: 725000,
                        status: 'Declared',
                      });
                      showToast('Computed FY 2026-27 dividend appropriation (25% Statutory Reserve + 5% Coop Education).');
                    }}
                    className="text-xs font-semibold text-emerald-700 hover:underline"
                  >
                    + Compute FY 2026-27
                  </button>
                </div>
                {coopDividends.map((d) => (
                  <div key={d.id} className="border border-slate-200 rounded-lg p-4 space-y-2 text-xs">
                    <div className="flex justify-between font-bold text-slate-900">
                      <span>FY {d.financialYear}</span>
                      <span className="text-emerald-700">{d.status}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-slate-600">
                      <div>Net Surplus: <strong className="font-mono text-slate-900">{formatCurrency(d.totalProfit)}</strong></div>
                      <div>Dividend Rate: <strong className="font-mono text-emerald-700">{d.dividendRatePct}%</strong></div>
                      <div>Statutory Reserve (25%): <strong className="font-mono text-slate-900">{formatCurrency(d.statutoryReserveFund)}</strong></div>
                      <div>Education Fund (5%): <strong className="font-mono text-slate-900">{formatCurrency(d.educationFund)}</strong></div>
                    </div>
                  </div>
                ))}
              </div>

              {/* AGM & Elections */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-emerald-600" />
                    <span>Annual General Meeting (AGM) Records</span>
                  </h3>
                  <button
                    onClick={() => {
                      handleAddAgmRecord({
                        meetingTitle: '14th Annual General Meeting',
                        financialYear: '2026-27',
                        meetingDate: '2027-09-20',
                        quorumMet: true,
                        resolutionsPassed: 0,
                        totalVotesCasted: 0,
                        status: 'Scheduled',
                      });
                      showToast('Scheduled 14th AGM notice for FY 2026-27.');
                    }}
                    className="text-xs font-semibold text-emerald-700 hover:underline"
                  >
                    + Schedule AGM
                  </button>
                </div>
                {coopAgms.map((a) => (
                  <div key={a.id} className="border border-slate-200 rounded-lg p-4 flex justify-between items-center text-xs">
                    <div>
                      <div className="font-bold text-slate-900">{a.meetingTitle}</div>
                      <div className="text-slate-500">
                        {a.meetingDate} · {a.resolutionsPassed} Resolutions · {a.totalVotesCasted} Votes
                      </div>
                    </div>
                    <span className="font-semibold text-emerald-700">{a.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: SECURITY, 2FA/OTP & AUTOMATED BACKUPS */}
      {activeTab === 'security' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
            <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
              <KeyRound className="w-5 h-5 text-emerald-600" />
              <h3 className="font-bold text-slate-900 text-base">Authentication, OTP & 2-Step Verification</h3>
            </div>

            <div className="space-y-3 text-sm">
              <label className="flex items-center justify-between p-3 border border-slate-200 rounded-lg cursor-pointer">
                <div>
                  <div className="font-semibold text-slate-900">OTP-Based Member & Officer Login</div>
                  <div className="text-xs text-slate-500">Enforce SMS/Email one-time passcode before ledger edits</div>
                </div>
                <input
                  type="checkbox"
                  checked={otpLoginRequired}
                  onChange={(e) => setOtpLoginRequired(e.target.checked)}
                  className="w-4 h-4 accent-emerald-600"
                />
              </label>

              <label className="flex items-center justify-between p-3 border border-slate-200 rounded-lg cursor-pointer">
                <div>
                  <div className="font-semibold text-slate-900">2-Step Verification (Authenticator TOTP)</div>
                  <div className="text-xs text-slate-500">Require TOTP token for DDO bulk recovery & dividend approval</div>
                </div>
                <input
                  type="checkbox"
                  checked={totpEnabled}
                  onChange={(e) => setTotpEnabled(e.target.checked)}
                  className="w-4 h-4 accent-emerald-600"
                />
              </label>

              <div className="p-3 bg-slate-50 rounded-lg space-y-2">
                <div className="text-xs font-semibold text-slate-700">Verify 6-Digit Authenticator Token</div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="Enter 6-digit code (e.g. 482910)"
                    value={totpCodeInput}
                    onChange={(e) => {
                      setTotpCodeInput(e.target.value);
                      setTotpVerified(null);
                    }}
                    className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm font-mono bg-white"
                  />
                  <button
                    onClick={() => setTotpVerified(/^\d{6}$/.test(totpCodeInput))}
                    className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800"
                  >
                    Verify 2FA
                  </button>
                </div>
                {totpVerified === true && (
                  <div className="text-xs text-emerald-700 font-semibold">2FA TOTP Token Verified</div>
                )}
                {totpVerified === false && (
                  <div className="text-xs text-red-600 font-semibold">Please enter a valid 6-digit numeric code</div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <Database className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-slate-900 text-base">Automated Cloud Backups & Snapshots</h3>
              </div>
              <button
                onClick={() => {
                  handleCreateCoopBackupSnapshot('Manual Pre-Audit Encrypted Snapshot');
                  showToast('Created verified SHA-256 backup snapshot of all truefincaplincoop ledgers.');
                }}
                className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700"
              >
                Create Snapshot
              </button>
            </div>

            <label className="flex items-center justify-between p-3 border border-slate-200 rounded-lg cursor-pointer text-sm">
              <div>
                <div className="font-semibold text-slate-900">Automated Nightly EOD Backup</div>
                <div className="text-xs text-slate-500">Encrypted daily snapshot at 23:00 IST with SHA-256 checksum</div>
              </div>
              <input
                type="checkbox"
                checked={autoBackupDaily}
                onChange={(e) => setAutoBackupDaily(e.target.checked)}
                className="w-4 h-4 accent-emerald-600"
              />
            </label>

            <div className="divide-y divide-slate-100">
              {coopBackupSnapshots.map((snap) => (
                <div key={snap.id} className="py-3 flex justify-between items-center text-xs">
                  <div>
                    <div className="font-semibold text-slate-900">{snap.label}</div>
                    <div className="text-slate-500 font-mono">
                      {snap.timestamp} · {snap.recordsCount} records · {snap.sizeKb} KB · {snap.checksum}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      downloadFile(
                        `truefincaplincoop_backup_${snap.id}.json`,
                        JSON.stringify({ members: coopMembers, deposits: coopDeposits, loans: coopLoans }, null, 2),
                        'application/json'
                      );
                      showToast(`Downloaded backup archive ${snap.id}.json`);
                    }}
                    className="px-2.5 py-1 border border-slate-200 rounded hover:bg-slate-50 font-semibold text-slate-700"
                  >
                    Export JSON
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* PASSBOOK DRAWER MODAL */}
      {passbookMember && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 space-y-4 border border-slate-200">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-lg text-slate-900">Member Digital Passbook — {passbookMember.memberName}</h3>
                <p className="text-xs text-slate-500 font-mono">
                  {passbookMember.folioNumber} · {passbookMember.employeeCode} · {passbookMember.ddoCode}
                </p>
              </div>
              <button onClick={() => setPassbookMemberId(null)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 text-sm">
              {coopPassbookTxns
                .filter((t) => t.memberId === passbookMember.id)
                .map((t) => (
                  <div key={t.id} className="py-2.5 flex justify-between items-center">
                    <div>
                      <div className="font-medium text-slate-900">{t.particulars}</div>
                      <div className="text-xs text-slate-500">
                        {t.date} · {t.accountType} · {t.mode}
                      </div>
                    </div>
                    <div className="font-mono tabular-nums font-bold text-emerald-700">
                      +{formatCurrency(t.credit)}
                    </div>
                  </div>
                ))}
              {coopPassbookTxns.filter((t) => t.memberId === passbookMember.id).length === 0 && (
                <div className="py-6 text-center text-slate-500 text-xs">No passbook transactions yet.</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ENROLL MEMBER MODAL */}
      {showMemberModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 space-y-4 border border-slate-200">
            <h3 className="font-bold text-lg text-slate-900">Enroll Employee Society Member</h3>
            <form onSubmit={handleCreateMember} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Full Member Name</label>
                  <input
                    type="text"
                    required
                    value={newMemberName}
                    onChange={(e) => setNewMemberName(e.target.value)}
                    placeholder="e.g. Anand Verma"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Employee Code</label>
                  <input
                    type="text"
                    value={newEmployeeCode}
                    onChange={(e) => setNewEmployeeCode(e.target.value)}
                    placeholder="EMP-4012"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">DDO Payroll Unit</label>
                  <select
                    value={newDdoCode}
                    onChange={(e) => setNewDdoCode(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white"
                  >
                    {DDO_DIRECTORY.map((d) => (
                      <option key={d.code} value={d.code}>
                        {d.code} — {d.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Designation</label>
                  <input
                    type="text"
                    value={newDesignation}
                    onChange={(e) => setNewDesignation(e.target.value)}
                    placeholder="Accounts Officer"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">PAN Number</label>
                  <input
                    type="text"
                    required
                    value={newMemberPan}
                    onChange={(e) => setNewMemberPan(e.target.value)}
                    placeholder="ABCDE1234F"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono uppercase"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Aadhaar Number</label>
                  <input
                    type="text"
                    value={newMemberAadhaar}
                    onChange={(e) => setNewMemberAadhaar(e.target.value)}
                    placeholder="123456789012"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Shares (₹1,000 / share)</label>
                  <input
                    type="number"
                    min="10"
                    value={newMemberShares}
                    onChange={(e) => setNewMemberShares(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Monthly Thrift (₹)</label>
                  <input
                    type="number"
                    min="500"
                    value={newMonthlyThrift}
                    onChange={(e) => setNewMonthlyThrift(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Nominee</label>
                  <input
                    type="text"
                    value={newMemberNominee}
                    onChange={(e) => setNewMemberNominee(e.target.value)}
                    placeholder="Nominee Name"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Phone</label>
                  <input
                    type="text"
                    value={newMemberPhone}
                    onChange={(e) => setNewMemberPhone(e.target.value)}
                    placeholder="9876543210"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowMemberModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-sm text-slate-700 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-semibold hover:bg-emerald-700"
                >
                  Confirm & Allot Shares
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* OPEN DEPOSIT MODAL */}
      {showDepositModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 space-y-4 border border-slate-200">
            <h3 className="font-bold text-lg text-slate-900">Open Cooperative Deposit Account</h3>
            <form onSubmit={handleCreateDeposit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Member</label>
                <select
                  value={depMemberId}
                  onChange={(e) => setDepMemberId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                >
                  {coopMembers.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.memberName} ({m.folioNumber})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Scheme</label>
                <select
                  value={depType}
                  onChange={(e: any) => setDepType(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                >
                  <option value="Fixed Deposit (FD)">Fixed Deposit (FD)</option>
                  <option value="Recurring Deposit (RD)">Recurring Deposit (RD)</option>
                  <option value="Daily Pigmy Deposit">Daily Pigmy Deposit</option>
                  <option value="Thrift Deposit">Thrift Deposit</option>
                </select>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Amount (₹)</label>
                  <input
                    type="number"
                    value={depAmount}
                    onChange={(e) => setDepAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Rate (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={depRate}
                    onChange={(e) => setDepRate(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Months</label>
                  <input
                    type="number"
                    value={depTenure}
                    onChange={(e) => setDepTenure(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono"
                  />
                </div>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg flex justify-between text-xs">
                <span className="text-slate-600">Auto-Calculated Maturity Amount</span>
                <strong className="font-mono text-emerald-700">{formatCurrency(estimatedDepositMaturity)}</strong>
              </div>
              <div className="flex justify-end space-x-3 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowDepositModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-sm text-slate-700 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-semibold hover:bg-emerald-700"
                >
                  Create Deposit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SANCTION LOAN MODAL */}
      {showLoanModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 space-y-4 border border-slate-200">
            <h3 className="font-bold text-lg text-slate-900">Sanction Cooperative Member Loan</h3>
            <form onSubmit={handleCreateLoan} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Borrower Member</label>
                <select
                  value={loanMemberId}
                  onChange={(e) => setLoanMemberId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                >
                  {coopMembers.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.memberName} ({m.folioNumber} · {m.ddoCode})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Loan Scheme</label>
                <select
                  value={loanScheme}
                  onChange={(e: any) => setLoanScheme(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                >
                  <option value="Regular Member Loan">Regular Member Loan</option>
                  <option value="Surety Loan">Surety Loan</option>
                  <option value="Emergency Loan">Emergency Loan</option>
                  <option value="Festival Advance">Festival Advance</option>
                  <option value="Loan Against Thrift/FD">Loan Against Thrift/FD</option>
                </select>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Principal (₹)</label>
                  <input
                    type="number"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Rate (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={loanRate}
                    onChange={(e) => setLoanRate(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Tenure (M)</label>
                  <input
                    type="number"
                    value={loanTenure}
                    onChange={(e) => setLoanTenure(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Surety / Guarantor 1</label>
                  <input
                    type="text"
                    value={surety1Name}
                    onChange={(e) => setSurety1Name(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Surety / Guarantor 2</label>
                  <input
                    type="text"
                    value={surety2Name}
                    onChange={(e) => setSurety2Name(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowLoanModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-sm text-slate-700 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-semibold hover:bg-emerald-700"
                >
                  Sanction & Disburse
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrueFincaplinCoop;
