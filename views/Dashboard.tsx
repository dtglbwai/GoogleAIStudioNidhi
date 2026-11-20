import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import StatsCard from '../components/StatsCard';
import { useBranding } from '../BrandingContext';
import { useAppContext } from '../AppContext';
import { formatCurrency } from '../utils/formatters';
import { TrendingUp, Wallet, Banknote, CalendarDays, Landmark } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { primaryColor } = useBranding();
  const { transactions, nbfcCrar, setCurrentView } = useAppContext();

  const stats = useMemo(() => {
    const totalIncome = transactions.filter(t => t.type === 'Income').reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = transactions.filter(t => t.type === 'Expense').reduce((sum, t) => sum + t.amount, 0);
    const profit = totalIncome - totalExpenses;
    const averageDailyRate = totalIncome / 30;

    return { totalIncome, totalExpenses, profit, averageDailyRate };
  }, [transactions]);

  const chartData = useMemo(() => {
    return [
      { name: 'Jan', Income: 4000, Expenses: 2400 },
      { name: 'Feb', Income: 3000, Expenses: 1398 },
      { name: 'Mar', Income: 2000, Expenses: 9800 },
      { name: 'Apr', Income: 2780, Expenses: 3908 },
      { name: 'May', Income: 1890, Expenses: 4800 },
      { name: 'Jun', Income: 2390, Expenses: 3800 },
    ];
  }, []);

  const profitMarginData = useMemo(() => {
    const margin = Math.max(0, Math.min(100, (stats.profit / (stats.totalIncome || 1)) * 100));
    return [
      { name: 'Profit Margin', value: margin },
      { name: 'Cost Ratio', value: 100 - margin },
    ];
  }, [stats]);

  const accentHex = /^#[0-9A-Fa-f]{6}$/.test(primaryColor) ? primaryColor : '#0f766e';

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
        <div>
          <h1 className="font-display text-2xl font-bold text-[var(--df-text)] tracking-tight">
            Executive Portfolio Overview
          </h1>
          <p className="text-xs text-[var(--df-muted)] mt-1">
            Unified NBFC, Co-operative Society &amp; Core Banking financial posture
          </p>
        </div>
        <div className="text-xs font-mono text-[var(--df-muted)] tabular-nums">
          CRAR {nbfcCrar.crarPercentage}% · Regulatory Nominal
        </div>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Income"
          value={formatCurrency(stats.totalIncome)}
          change="+12%"
          changeType="increase"
          isChangeGood={true}
          icon={<Banknote />}
          color={accentHex}
        />
        <StatsCard
          title="Total Expenses"
          value={formatCurrency(stats.totalExpenses)}
          change="-5%"
          changeType="decrease"
          isChangeGood={true}
          icon={<Wallet />}
          color="#b91c1c"
        />
        <StatsCard
          title="Net Operating Surplus"
          value={formatCurrency(stats.profit)}
          change="+8%"
          changeType="increase"
          isChangeGood={true}
          icon={<TrendingUp />}
          color="#1d4ed8"
        />
        <StatsCard
          title="Average Daily Rate"
          value={formatCurrency(stats.averageDailyRate)}
          change="0%"
          changeType="none"
          isChangeGood={true}
          icon={<CalendarDays />}
          color="#475569"
        />
      </div>

      {/* Architectural Command Strip (Zero gradient / zero pill clutter) */}
      <div className="bg-[var(--df-surface)] border border-[var(--df-border)] rounded-xl p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 bg-[var(--df-surface-subtle)] border border-[var(--df-border)] rounded-lg text-[var(--df-text)] shrink-0">
            <Landmark className="w-5 h-5" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-display text-sm font-bold text-[var(--df-text)]">
                Core Banking, AI Safeguards &amp; NBFC Regulatory Suite
              </h2>
              <span className="text-xs text-[var(--df-muted)]">·</span>
              <span className="text-xs font-semibold text-emerald-700 tabular-nums">
                CRAR {nbfcCrar.crarPercentage}% Verified
              </span>
            </div>
            <p className="text-xs text-[var(--df-muted)] mt-1">
              Direct workbenches for AI Egress Encapsulation, 6-Phase Core Banking Implementation, and RBI Scale-Based Prudential Engines.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={() => setCurrentView('cyberSecurity')}
            className="px-3.5 py-2 text-xs font-semibold text-[var(--df-text)] bg-[var(--df-surface)] border border-[var(--df-border)] rounded-lg hover:bg-[var(--df-surface-subtle)] transition-colors whitespace-nowrap shrink-0"
          >
            AI Security Airlock
          </button>
          <button
            onClick={() => setCurrentView('enterpriseCore')}
            className="px-3.5 py-2 text-xs font-semibold text-[var(--df-text)] bg-[var(--df-surface)] border border-[var(--df-border)] rounded-lg hover:bg-[var(--df-surface-subtle)] transition-colors whitespace-nowrap shrink-0"
          >
            Enterprise Core Suite
          </button>
          <button
            onClick={() => setCurrentView('cbsImplementation')}
            className="px-3.5 py-2 text-xs font-semibold text-[var(--df-text)] bg-[var(--df-surface)] border border-[var(--df-border)] rounded-lg hover:bg-[var(--df-surface-subtle)] transition-colors whitespace-nowrap shrink-0"
          >
            CBS Implementation
          </button>
          <button
            onClick={() => setCurrentView('truefincaplincoop')}
            className="px-3.5 py-2 text-xs font-semibold text-[var(--df-text)] bg-[var(--df-surface)] border border-[var(--df-border)] rounded-lg hover:bg-[var(--df-surface-subtle)] transition-colors whitespace-nowrap shrink-0"
          >
            truefincaplincoop
          </button>
          <button
            onClick={() => setCurrentView('nbfcEngine')}
            className="px-4 py-2 text-xs font-semibold text-white bg-primary hover:bg-primary-dark rounded-lg transition-colors whitespace-nowrap shrink-0"
          >
            Open NBFC Hub
          </button>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[var(--df-surface)] border border-[var(--df-border)] p-6 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-base font-bold text-[var(--df-text)]">
              Income &amp; Operating Expense Trajectory
            </h3>
            <span className="text-xs text-[var(--df-muted)] font-mono">6-Month Window</span>
          </div>
          <ResponsiveContainer width="100%" height={290}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#475569' }} axisLine={{ stroke: '#e2e8f0' }} />
              <YAxis tick={{ fontSize: 12, fill: '#475569' }} axisLine={false} tickLine={false} />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Bar dataKey="Income" fill={accentHex} radius={[4, 4, 0, 0]} />
              <Bar dataKey="Expenses" fill="#94a3b8" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="lg:col-span-1 bg-[var(--df-surface)] border border-[var(--df-border)] p-6 rounded-xl flex flex-col justify-between">
          <div>
            <h3 className="font-display text-base font-bold text-[var(--df-text)]">Net Profit Margin</h3>
            <p className="text-xs text-[var(--df-muted)] mt-0.5">Surplus efficiency over total income</p>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={profitMarginData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={58}
                outerRadius={78}
                stroke="none"
              >
                {profitMarginData.map((_entry, index) => (
                  <Cell key={`cell-${index}`} fill={index === 0 ? accentHex : '#e2e8f0'} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="text-center border-t border-[var(--df-border)] pt-4">
            <div className="font-display text-3xl font-bold text-[var(--df-text)] tabular-nums">
              {profitMarginData[0].value.toFixed(2)}%
            </div>
            <div className="text-xs text-[var(--df-muted)] mt-1">Realized Margin Ratio</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
