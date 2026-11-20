import React from 'react';

interface StatsCardProps {
  title: string;
  value: string;
  change: string;
  changeType: 'increase' | 'decrease' | 'none';
  isChangeGood: boolean;
  icon: React.ReactNode;
  color: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  change,
  changeType,
  isChangeGood,
  icon,
  color,
}) => {
  const deltaColor =
    changeType === 'none'
      ? 'text-[var(--df-muted)]'
      : isChangeGood
      ? 'text-emerald-700'
      : 'text-red-700';

  return (
    <div className="bg-[var(--df-surface)] border border-[var(--df-border)] p-5 rounded-xl flex items-start justify-between gap-4">
      <div className="min-w-0">
        <p className="text-xs font-medium text-[var(--df-muted)] truncate">{title}</p>
        <p className="font-display text-2xl font-bold text-[var(--df-text)] mt-1.5 tabular-nums tracking-tight">
          {value}
        </p>
        <div className="flex items-center gap-1.5 mt-2 text-xs">
          <span className={`inline-flex items-center font-semibold tabular-nums ${deltaColor}`}>
            {changeType === 'increase' && (
              <svg className="h-3.5 w-3.5 mr-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 19V5M5 12l7-7 7 7" />
              </svg>
            )}
            {changeType === 'decrease' && (
              <svg className="h-3.5 w-3.5 mr-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14m7-7l-7 7-7-7" />
              </svg>
            )}
            {change}
          </span>
          <span className="text-[var(--df-muted)]">vs last month</span>
        </div>
      </div>
      <div
        className="p-2.5 rounded-lg border border-[var(--df-border)] bg-[var(--df-surface-subtle)] shrink-0"
        style={{ color }}
      >
        <div className="w-5 h-5">{icon}</div>
      </div>
    </div>
  );
};

export default StatsCard;
