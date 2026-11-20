import React, { useState } from 'react';
import {
  UserRole,
  WorkflowStage,
  ModuleConfig,
  ClientBankPresetId,
} from './types';
import { useBranding } from '../BrandingContext';
import { useAppContext } from '../AppContext';
import { CheckCircle2, Layers, ShieldCheck, Database, GitBranch, Scale } from 'lucide-react';

type SettingView = 'platform' | 'operations' | 'infrastructure' | 'legal';

interface SaasModuleDescriptor {
  key: keyof ModuleConfig;
  name: string;
  category: 'Core & Payments' | 'Lending & Credit' | 'Finance & Tax' | 'Risk & Governance' | 'AI & Intelligence' | 'HQ & Branch Infra';
  description: string;
  entities: string[];
  lockedCore?: boolean;
}

const SAAS_MODULE_CATALOG: SaasModuleDescriptor[] = [
  {
    key: 'coreBanking',
    name: 'Core Banking Engine (CBS)',
    category: 'Core & Payments',
    description: 'Customer CASA/TD accounts, Teller console, Cards, EOD/BOD batch processing, and CBS implementation suite.',
    entities: ['customerAccounts', 'tellerTransactions', 'coreBatchLogs'],
  },
  {
    key: 'paymentsHub',
    name: 'Payments & SWIFT Hub',
    category: 'Core & Payments',
    description: 'ISO 20022 RTGS/NEFT/IMPS rails, SWIFT FIN MT/MX messaging, GPI tracking, and Nostro/Vostro reconciliation.',
    entities: ['paymentOrders', 'swiftMessages', 'nostroVostroAccounts'],
  },
  {
    key: 'treasury',
    name: 'Treasury & FX Desk',
    category: 'Core & Payments',
    description: 'SLR/CRR investment books, borrowing lines, liquidity desks, and multi-currency exchange settlement.',
    entities: ['investments', 'borrowings'],
  },
  {
    key: 'lms',
    name: 'Retail & MSME Lending (LMS)',
    category: 'Lending & Credit',
    description: 'Lead origination, loan applications, co-lending escrow, vehicle leases, field recovery, and EMI scheduling.',
    entities: ['leads', 'applications', 'loans', 'leases', 'vehicles'],
  },
  {
    key: 'goldAndGroupLoans',
    name: 'Gold & Group Microfinance',
    category: 'Lending & Credit',
    description: 'Jewelry karat appraisal pledge packets, auction workflows, and SHG/JLG group lending rosters.',
    entities: ['goldLoans', 'groups'],
  },
  {
    key: 'accounting',
    name: 'General Ledger, ConfiBooks & Tax',
    category: 'Finance & Tax',
    description: 'Double-entry GL, vouchers, GST/TDS compliance, sales invoices, purchase bills, and NBFC SBR/Ind AS 109.',
    entities: ['accounts', 'vouchers', 'transactions', 'salesInvoices', 'purchaseBills'],
  },
  {
    key: 'coopSociety',
    name: 'Co-operative Credit Society',
    category: 'Finance & Tax',
    description: 'Member share capital, thrift passbooks, DDO payroll recovery batches, dividends, and AGM statutory registers.',
    entities: ['coopMembers', 'coopDeposits', 'coopLoans'],
  },
  {
    key: 'risk',
    name: 'Risk, KYC, AML & Collections',
    category: 'Risk & Governance',
    description: 'Underwriting, CKYC verification, DMS, PDC clearing, NPA asset classification, AML watchlist, and litigation.',
    entities: ['kycCustomers', 'kycCompanies', 'collectionLogs', 'legalCases'],
  },
  {
    key: 'legal',
    name: 'Legal Review & Agreements',
    category: 'Risk & Governance',
    description: 'Digital sanction templates, execution stamps, counsel dockets, and borrower covenant enforcement.',
    entities: ['agreementTemplates', 'generatedAgreements'],
  },
  {
    key: 'aiSuite',
    name: 'Banking AI Suite (Jev / Rillet / Tax / Voice)',
    category: 'AI & Intelligence',
    description: 'Server-encapsulated AI underwriting calibration, autonomous bank reconciliation, GST/TDS advisory, and voice ops.',
    entities: ['jevPipelines', 'taxRecords', 'runamargaCalls'],
  },
  {
    key: 'intelligence',
    name: 'Executive BI & Strategy',
    category: 'AI & Intelligence',
    description: 'Executive corner KPIs, portfolio stress-testing dashboards, and strategy management assistant.',
    entities: ['businessKpis', 'strategicGoals'],
  },
  {
    key: 'analytics',
    name: 'SaaS Tenant Telemetry',
    category: 'HQ & Branch Infra',
    description: 'Active tenant adoption metrics, role utilization, and API throughput observability.',
    entities: ['auditFindings'],
  },
  {
    key: 'branchOps',
    name: 'HQ Central & Branch Ops',
    category: 'HQ & Branch Infra',
    description: 'Centralized HQ server replication, regional branch provisioning, VPN tunnels, and branch HRMS.',
    entities: ['branches', 'employees'],
  },
  {
    key: 'system',
    name: 'Platform Core & Security Plane',
    category: 'HQ & Branch Infra',
    description: 'Always-on SaaS control plane, entity DBMS, backup/recovery, DR failover, and cyber security firewall.',
    entities: ['databaseSettings', 'backupSnapshots', 'migrationBatches'],
    lockedCore: true,
  },
];

const CLIENT_BANK_PRESET_CARDS: {
  id: Exclude<ClientBankPresetId, 'custom'>;
  title: string;
  subtitle: string;
}[] = [
  {
    id: 'universal',
    title: 'Universal Bank Suite',
    subtitle: 'All 14 modules active for full-spectrum commercial & retail banking',
  },
  {
    id: 'commercial',
    title: 'Commercial & Core Bank',
    subtitle: 'CBS, SWIFT Payments, Treasury, Accounting, Risk & HQ Branch Ops',
  },
  {
    id: 'nbfc',
    title: 'NBFC Retail & MSME',
    subtitle: 'LMS, Gold/Group Lending, SBR Accounting, Risk, AI & HQ Branches',
  },
  {
    id: 'cooperative',
    title: 'Co-operative Credit Society',
    subtitle: 'Member Shares, DDO Recovery, CBS, LMS, Payments & Branch Ops',
  },
];

const FormRow: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <div className={`grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 ${className}`}>{children}</div>
);
const FormField: React.FC<{ label: string; children: React.ReactNode; description?: string }> = ({ label, children, description }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <div className="mt-1">{children}</div>
    {description && <p className="mt-1 text-xs text-gray-500">{description}</p>}
  </div>
);
const TextInput = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input {...props} className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-sm" />
);
const TextAreaInput = (props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <textarea {...props} className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-sm" />
);
const SelectInput: React.FC<React.SelectHTMLAttributes<HTMLSelectElement>> = ({ children, ...props }) => (
  <select {...props} className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-sm bg-white">
    {children}
  </select>
);

const SuperAdminSettings: React.FC = () => {
  const {
    operationalSettings,
    handleUpdateOperationalSettings,
    moduleConfig,
    clientBankPreset,
    handleToggleModule,
    handleApplyClientBankPreset,
    databaseSettings,
    handleUpdateDatabaseSettings,
    metadataSettings,
    handleUpdateMetadataSettings,
    legalSettings,
    handleUpdateLegalSettings,
  } = useAppContext();

  const [activeSetting, setActiveSetting] = useState<SettingView | null>('operations');
  const [opSettings, setOpSettings] = useState(operationalSettings);
  const [dbSettings, setDbSettings] = useState(databaseSettings);
  const [metaSettings, setMetaSettings] = useState(metadataSettings);
  const [lglSettings, setLglSettings] = useState(legalSettings);
  const [notice, setNotice] = useState<string | null>(null);
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [newStage, setNewStage] = useState<Omit<WorkflowStage, 'id'>>({ name: '', description: '', responsibleRole: 'Admin' });
  const { primaryColor, setPrimaryColor } = useBranding();

  const activeModuleCount = Object.values(moduleConfig).filter(Boolean).length;
  const totalModuleCount = Object.keys(moduleConfig).length;

  const handleOpSettingsSave = (e: React.FormEvent) => {
    e.preventDefault();
    handleUpdateOperationalSettings(opSettings);
    setNotice('Operational workflow stages saved.');
  };
  const handleDbSettingsSave = (e: React.FormEvent) => {
    e.preventDefault();
    handleUpdateDatabaseSettings(dbSettings);
    setNotice('HQ database cluster configuration updated.');
  };
  const handleMetaSettingsSave = (e: React.FormEvent) => {
    e.preventDefault();
    handleUpdateMetadataSettings(metaSettings);
    setNotice('Tenant metadata & branding updated.');
  };
  const handleLegalSettingsSave = (e: React.FormEvent) => {
    e.preventDefault();
    handleUpdateLegalSettings(lglSettings);
    setNotice('Legal & copyright disclosures saved.');
  };

  const handleTestConnection = async () => {
    setTestStatus('testing');
    try {
      const res = await fetch('/api/health');
      setTestStatus(res.ok ? 'success' : 'error');
    } catch {
      setTestStatus('error');
    } finally {
      setTimeout(() => setTestStatus('idle'), 3000);
    }
  };

  const handleAddStage = () => {
    if (!newStage.name || !newStage.description) {
      setNotice('Provide both stage name and description before adding a workflow stage.');
      return;
    }
    const stageToAdd: WorkflowStage = { ...newStage, id: `wf-${Date.now()}` };
    setOpSettings(prev => ({ ...prev, workflowStages: [...prev.workflowStages, stageToAdd] }));
    setNewStage({ name: '', description: '', responsibleRole: 'Admin' });
    setNotice(`Added stage "${stageToAdd.name}" to pending workflow.`);
  };

  const handleRemoveStage = (id: string) =>
    setOpSettings(prev => ({ ...prev, workflowStages: prev.workflowStages.filter(s => s.id !== id) }));

  const SettingCard: React.FC<{ title: string; description: string; view: SettingView; icon: React.ReactNode }> = ({
    title,
    description,
    view,
    icon,
  }) => (
    <button
      onClick={() => setActiveSetting(view)}
      className="bg-white p-6 rounded-xl border border-slate-200 text-left hover:border-primary transition-all w-full h-full flex flex-col"
    >
      <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-800 flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-base font-bold text-slate-900">{title}</h3>
      <p className="text-xs text-slate-600 mt-1.5 flex-grow leading-relaxed">{description}</p>
      <span className="text-xs font-semibold text-primary mt-4">Configure &rarr;</span>
    </button>
  );

  const renderDashboard = () => (
    <div className="animate-fade-in space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">SaaS Platform & Client Bank Control Center</h2>
        <p className="text-xs text-slate-500 mt-1">
          Configure modular SaaS entitlements, HQ database routing, branding, and statutory metadata per client bank.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <SettingCard
          view="operations"
          icon={<Layers className="w-5 h-5" />}
          title="SaaS Modules & Workflow"
          description={`Activate or deactivate ${activeModuleCount}/${totalModuleCount} independent client-bank modules and approval workflows.`}
        />
        <SettingCard
          view="infrastructure"
          icon={<Database className="w-5 h-5" />}
          title="HQ Server & Database"
          description="Manage centralized HQ connection targets and test live API/Firestore health."
        />
        <SettingCard
          view="platform"
          icon={<ShieldCheck className="w-5 h-5" />}
          title="Tenant Metadata & SEO"
          description="Customize title, primary color accent, and search metadata for the client bank."
        />
        <SettingCard
          view="legal"
          icon={<Scale className="w-5 h-5" />}
          title="Legal & Disclosures"
          description="Set legal entity identity, terms links, and regulatory copyright notice."
        />
      </div>
    </div>
  );

  const renderSettingView = (view: SettingView) => {
    const validUserRoles: UserRole[] = ['Super Admin', 'Admin', 'Auditor', 'Sales', 'Legal', 'Accounting'];
    switch (view) {
      case 'platform':
        return (
          <form onSubmit={handleMetaSettingsSave} className="bg-white p-6 lg:p-8 rounded-xl border border-slate-200 space-y-6">
            <h3 className="text-lg font-bold text-slate-900">Tenant Customization & SEO Metadata</h3>
            <FormRow>
              <FormField label="Site Title">
                <TextInput value={metaSettings.siteTitle} onChange={e => setMetaSettings({ ...metaSettings, siteTitle: e.target.value })} />
              </FormField>
              <FormField label="Primary Accent Hex">
                <input type="color" value={primaryColor} onChange={e => setPrimaryColor(e.target.value)} className="w-full h-10 p-1 border rounded-md" />
              </FormField>
            </FormRow>
            <FormField label="Meta Description">
              <TextAreaInput rows={2} value={metaSettings.metaDescription} onChange={e => setMetaSettings({ ...metaSettings, metaDescription: e.target.value })} />
            </FormField>
            <FormField label="Meta Keywords" description="Comma-separated descriptors.">
              <TextInput value={metaSettings.metaKeywords} onChange={e => setMetaSettings({ ...metaSettings, metaKeywords: e.target.value })} />
            </FormField>
            <div className="pt-2 flex justify-end">
              <button type="submit" className="px-5 py-2 bg-primary text-white text-xs font-semibold rounded-lg hover:bg-primary-dark">
                Save Metadata
              </button>
            </div>
          </form>
        );
      case 'operations':
        return (
          <div className="space-y-6">
            {/* Client Bank SaaS Entitlement Profiles */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-5">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b border-slate-200 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Client Bank SaaS Module Activation &amp; Deactivation
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Each module operates over isolated normalized database entities. Enable or disable modules to match client bank licensing cleanly without affecting other modules.
                  </p>
                </div>
                <div className="text-xs font-mono font-semibold text-slate-700 shrink-0 tabular-nums">
                  {activeModuleCount} / {totalModuleCount} Modules Active · Profile: {clientBankPreset.toUpperCase()}
                </div>
              </div>

              <div>
                <div className="text-xs font-semibold text-slate-700 mb-2">
                  Apply Client Bank Charter Preset
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {CLIENT_BANK_PRESET_CARDS.map(preset => {
                    const selected = clientBankPreset === preset.id;
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => {
                          handleApplyClientBankPreset(preset.id);
                          setNotice(`Applied "${preset.title}" SaaS module entitlement preset.`);
                        }}
                        className={`p-3.5 rounded-lg border text-left transition-colors ${
                          selected
                            ? 'border-primary bg-primary-light'
                            : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                        }`}
                      >
                        <div className="text-xs font-bold text-slate-900">{preset.title}</div>
                        <div className="text-[11px] text-slate-600 mt-1 leading-snug">{preset.subtitle}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {SAAS_MODULE_CATALOG.map(mod => {
                  const enabled = moduleConfig[mod.key];
                  return (
                    <div
                      key={mod.key}
                      className={`p-4 rounded-xl border transition-colors flex flex-col justify-between gap-3 ${
                        enabled ? 'bg-white border-slate-200' : 'bg-slate-50 border-slate-200 opacity-80'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1">
                          <div className="text-[11px] font-medium text-slate-500">{mod.category}</div>
                          <div className="text-sm font-bold text-slate-900">{mod.name}</div>
                          <p className="text-xs text-slate-600 leading-relaxed">{mod.description}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
                          <input
                            type="checkbox"
                            checked={enabled}
                            disabled={mod.lockedCore}
                            onChange={() => {
                              handleToggleModule(mod.key);
                              setNotice(`${enabled ? 'Deactivated' : 'Activated'} module "${mod.name}". Sidebar & routes updated immediately.`);
                            }}
                            aria-label={`Toggle ${mod.name}`}
                            className="sr-only peer"
                          />
                          <div
                            className={`w-11 h-6 rounded-full peer transition-colors after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:border-slate-300 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full ${
                              mod.lockedCore
                                ? 'bg-slate-400 cursor-not-allowed'
                                : 'bg-slate-300 peer-checked:bg-primary'
                            }`}
                          />
                        </label>
                      </div>
                      <div className="flex items-center justify-between text-[11px] border-t border-slate-100 pt-2.5 text-slate-500">
                        <span className="font-mono truncate">Entities: {mod.entities.join(', ')}</span>
                        <span className={`font-semibold shrink-0 ml-2 ${enabled ? 'text-emerald-700' : 'text-slate-500'}`}>
                          {mod.lockedCore ? 'Core Locked' : enabled ? 'Active' : 'Deactivated'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Workflow Stages */}
            <form onSubmit={handleOpSettingsSave} className="bg-white p-6 rounded-xl border border-slate-200 space-y-4">
              <div className="flex items-center gap-2">
                <GitBranch className="w-4 h-4 text-slate-700" />
                <h3 className="text-base font-bold text-slate-900">Configurable Credit &amp; Onboarding Workflow Stages</h3>
              </div>
              <div className="divide-y divide-slate-200 border border-slate-200 rounded-lg">
                {opSettings.workflowStages.map((stage, idx) => (
                  <div key={stage.id} className="flex items-center justify-between gap-3 p-3 text-xs">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="font-mono text-slate-400 tabular-nums">{String(idx + 1).padStart(2, '0')}.</span>
                      <div className="min-w-0">
                        <div className="font-semibold text-slate-900">{stage.name}</div>
                        <div className="text-slate-500 truncate">{stage.description}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-slate-700 font-medium">{stage.responsibleRole}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveStage(stage.id)}
                        className="text-red-600 hover:underline font-semibold"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end pt-2">
                <FormField label="Stage Name">
                  <TextInput value={newStage.name} onChange={e => setNewStage({ ...newStage, name: e.target.value })} />
                </FormField>
                <FormField label="Description">
                  <TextInput value={newStage.description} onChange={e => setNewStage({ ...newStage, description: e.target.value })} />
                </FormField>
                <FormField label="Responsible Role">
                  <SelectInput value={newStage.responsibleRole || ''} onChange={e => setNewStage({ ...newStage, responsibleRole: e.target.value as UserRole })}>
                    {validUserRoles.map(r => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </SelectInput>
                </FormField>
                <button
                  type="button"
                  onClick={handleAddStage}
                  className="px-4 py-2 bg-slate-100 text-slate-800 text-xs font-semibold rounded-lg hover:bg-slate-200 h-10"
                >
                  Add Stage
                </button>
              </div>
              <div className="pt-2 flex justify-end">
                <button type="submit" className="px-5 py-2 bg-primary text-white text-xs font-semibold rounded-lg hover:bg-primary-dark">
                  Save Workflow Stages
                </button>
              </div>
            </form>
          </div>
        );
      case 'infrastructure':
        return (
          <form onSubmit={handleDbSettingsSave} className="bg-white p-6 lg:p-8 rounded-xl border border-slate-200 space-y-6">
            <h3 className="text-lg font-bold text-slate-900">HQ Centralized Server &amp; Database Routing</h3>
            <FormRow>
              <FormField label="Primary Database Engine">
                <SelectInput value={dbSettings.type} onChange={e => setDbSettings({ ...dbSettings, type: e.target.value as any })}>
                  <option>PostgreSQL</option>
                  <option>MySQL</option>
                  <option>Oracle</option>
                </SelectInput>
              </FormField>
              <FormField label="Database Instance Name">
                <TextInput value={dbSettings.dbName} onChange={e => setDbSettings({ ...dbSettings, dbName: e.target.value })} />
              </FormField>
            </FormRow>
            <FormRow>
              <FormField label="HQ Server Host">
                <TextInput value={dbSettings.host} onChange={e => setDbSettings({ ...dbSettings, host: e.target.value })} />
              </FormField>
              <FormField label="Port">
                <TextInput type="number" value={dbSettings.port} onChange={e => setDbSettings({ ...dbSettings, port: Number(e.target.value) })} />
              </FormField>
            </FormRow>
            <FormRow>
              <FormField label="Service Account">
                <TextInput value={dbSettings.username} onChange={e => setDbSettings({ ...dbSettings, username: e.target.value })} />
              </FormField>
              <FormField label="Credential Rotation Token">
                <TextInput type="password" placeholder="••••••••" onChange={e => setDbSettings({ ...dbSettings, password: e.target.value })} />
              </FormField>
            </FormRow>
            <div className="flex justify-between items-center pt-2">
              <button
                type="button"
                onClick={handleTestConnection}
                disabled={testStatus !== 'idle'}
                className="px-4 py-2 border border-slate-300 text-xs font-semibold rounded-lg text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                {testStatus === 'testing' && 'Probing HQ Server...'}
                {testStatus === 'success' && 'HQ Gateway Reachable (HTTP 200)'}
                {testStatus === 'error' && 'Probe Failed'}
                {testStatus === 'idle' && 'Verify HQ Server Connectivity'}
              </button>
              <button type="submit" className="px-5 py-2 bg-primary text-white text-xs font-semibold rounded-lg hover:bg-primary-dark">
                Save HQ Connection
              </button>
            </div>
          </form>
        );
      case 'legal':
        return (
          <form onSubmit={handleLegalSettingsSave} className="bg-white p-6 lg:p-8 rounded-xl border border-slate-200 space-y-6">
            <h3 className="text-lg font-bold text-slate-900">Legal Entity &amp; Regulatory Copyright</h3>
            <FormField label="Company Legal Name">
              <TextInput value={lglSettings.companyLegalName} onChange={e => setLglSettings({ ...lglSettings, companyLegalName: e.target.value })} />
            </FormField>
            <FormField label="Copyright Notice">
              <TextInput value={lglSettings.copyrightNotice} onChange={e => setLglSettings({ ...lglSettings, copyrightNotice: e.target.value })} />
            </FormField>
            <FormRow>
              <FormField label="Terms of Service URL">
                <TextInput value={lglSettings.termsOfServiceUrl} onChange={e => setLglSettings({ ...lglSettings, termsOfServiceUrl: e.target.value })} />
              </FormField>
              <FormField label="Privacy Policy URL">
                <TextInput value={lglSettings.privacyPolicyUrl} onChange={e => setLglSettings({ ...lglSettings, privacyPolicyUrl: e.target.value })} />
              </FormField>
            </FormRow>
            <div className="pt-2 flex justify-end">
              <button type="submit" className="px-5 py-2 bg-primary text-white text-xs font-semibold rounded-lg hover:bg-primary-dark">
                Save Legal Info
              </button>
            </div>
          </form>
        );
      default:
        return null;
    }
  };

  return (
    <div className="animate-fade-in space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 p-1 bg-white border border-slate-200 rounded-lg">
          {[
            { id: null, label: 'Control Center' },
            { id: 'operations' as SettingView, label: 'SaaS Modules & Workflow' },
            { id: 'infrastructure' as SettingView, label: 'HQ Server & DB' },
            { id: 'platform' as SettingView, label: 'Metadata & Branding' },
            { id: 'legal' as SettingView, label: 'Legal' },
          ].map(tab => (
            <button
              key={String(tab.id)}
              onClick={() => setActiveSetting(tab.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                activeSetting === tab.id ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {notice && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 px-4 py-2.5 rounded-lg flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>{notice}</span>
          </div>
          <button onClick={() => setNotice(null)} className="font-semibold hover:underline">
            Dismiss
          </button>
        </div>
      )}

      {activeSetting ? renderSettingView(activeSetting) : renderDashboard()}
    </div>
  );
};

export default SuperAdminSettings;