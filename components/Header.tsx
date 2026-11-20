import React from 'react';
import { useAppContext } from '../AppContext';
import { useBranding } from '../BrandingContext';
import { DESIGN_THEMES, DesignThemeId } from '../colors';
import { View } from '../views/types';
import LogoutIcon from './icons/LogoutIcon';

const VIEW_LABELS: Partial<Record<View, string>> = {
  dashboard: 'Executive Overview',
  enterpriseCore: 'Enterprise Core Banking Suite',
  cbsImplementation: 'Core Banking Technology & Implementation',
  cyberSecurity: 'AI Encapsulation & Security Safeguards',
  truefincaplincoop: 'Co-operative Banking Ledger',
  nbfcEngine: 'NBFC Prudential & SBR',
  swiftHub: 'SWIFT & International Hub',
  taxAi: 'Strategic Tax AI',
  businessAssistant: 'Business Management Assistant',
  customerAccounts: 'Customer Accounts',
  eodBodOperations: 'EOD / BOD Batch Operations',
  settings: 'Design System & Settings',
};

const Header: React.FC = () => {
  const { currentUser, currentView, handleLogout, branches, activeBranchId, handleSetActiveBranch } = useAppContext();
  const { themeId, setThemeId } = useBranding();

  const handlePrint = () => {
    window.print();
  };

  const viewTitle =
    VIEW_LABELS[currentView] ||
    currentView
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, c => c.toUpperCase());

  return (
    <header className="h-32 shrink-0 bg-[var(--df-surface)] border-b border-[var(--df-border)] flex items-center justify-between gap-8 px-6 lg:px-8">
      {/* Zone 1: Active section title (no duplicate logo or extra brand) */}
      <div className="flex items-center min-w-0">
        <h2 className="font-display text-lg font-bold tracking-tight text-[var(--df-text)] truncate">
          {viewTitle}
        </h2>
      </div>

      {/* Zone 2: HQ / Branch Context, Theme token selector & operator context */}
      <div className="hidden md:flex items-center gap-4 shrink-0">
        <select
          aria-label="HQ or Branch Server Scope"
          value={activeBranchId}
          onChange={e => handleSetActiveBranch(e.target.value)}
          className="px-2.5 py-1.5 text-xs font-medium bg-[var(--df-surface-subtle)] text-[var(--df-text)] border border-[var(--df-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-primary max-w-[210px] truncate"
        >
          <option value="ALL">HQ Consolidated ({branches.length} Nodes)</option>
          {branches.map(b => (
            <option key={b.id} value={b.id}>
              {b.branchCode} · {b.name}
            </option>
          ))}
        </select>

        <div className="flex items-center gap-1 p-1 bg-[var(--df-surface-subtle)] rounded-lg border border-[var(--df-border)]">
          {(Object.keys(DESIGN_THEMES) as DesignThemeId[]).map(id => {
            const preset = DESIGN_THEMES[id];
            const active = themeId === id;
            return (
              <button
                key={id}
                onClick={() => setThemeId(id)}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                  active
                    ? 'bg-[var(--df-surface)] text-[var(--df-text)] border border-[var(--df-border)]'
                    : 'text-[var(--df-muted)] hover:text-[var(--df-text)]'
                }`}
              >
                {preset.name}
              </button>
            );
          })}
        </div>

        <div className="text-xs text-[var(--df-muted)] whitespace-nowrap shrink-0">
          {currentUser || 'Operator'}
        </div>
      </div>

      {/* Zone 3: Print & session reset actions */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={handlePrint}
          className="px-3 py-1.5 text-xs font-medium text-[var(--df-text)] bg-[var(--df-surface)] border border-[var(--df-border)] rounded-lg hover:bg-[var(--df-surface-subtle)] transition-colors whitespace-nowrap shrink-0"
          title="Print Page (A4)"
        >
          Print A4
        </button>

        <button
          onClick={handleLogout}
          className="p-2 text-[var(--df-muted)] hover:text-red-700 bg-[var(--df-surface)] border border-[var(--df-border)] rounded-lg hover:bg-red-50 transition-colors shrink-0"
          title="Reset Session"
          aria-label="Reset Session"
        >
          <LogoutIcon className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
};

export default Header;