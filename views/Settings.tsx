import React, { useState } from 'react';
import type { CommunicationTemplate } from './types';
import { useBranding } from '../BrandingContext';
import { DESIGN_THEMES, DesignThemeId } from '../colors';
import LogoIcon from '../components/icons/LogoIcon';
import { useAppContext } from '../AppContext';
import { CheckCircle2 } from 'lucide-react';

const CommunicationSettings: React.FC<{ onNotify: (msg: string) => void }> = ({ onNotify }) => {
  const { communicationTemplates, handleUpdateCommunicationTemplate } = useAppContext();
  const [templates, setTemplates] = useState<CommunicationTemplate[]>(communicationTemplates);

  const handleTemplateChange = (id: string, field: 'content' | 'isActive', value: string | boolean) => {
    setTemplates(prev => prev.map(t => (t.id === id ? { ...t, [field]: value } : t)));
  };

  const handleSave = (template: CommunicationTemplate) => {
    handleUpdateCommunicationTemplate(template);
    onNotify(`Saved template "${template.event}" (${template.channel}).`);
  };

  return (
    <div className="bg-[var(--df-surface)] border border-[var(--df-border)] p-6 rounded-xl animate-fade-in">
      <h3 className="font-display text-base font-bold text-[var(--df-text)] mb-1">Communication Templates</h3>
      <p className="text-xs text-[var(--df-muted)] mb-6">
        Manage automated notifications sent to borrowers and members using placeholders like {'{{customerName}}'}.
      </p>
      <div className="space-y-4">
        {templates.map(template => (
          <div key={template.id} className="p-4 border border-[var(--df-border)] rounded-lg bg-[var(--df-surface-subtle)]/50">
            <div className="flex justify-between items-center mb-2">
              <div className="text-xs font-semibold text-[var(--df-text)]">
                {template.event} · <span className="text-primary">{template.channel}</span>
              </div>
              <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-medium text-[var(--df-text)]">
                <input
                  type="checkbox"
                  checked={template.isActive}
                  onChange={e => handleTemplateChange(template.id, 'isActive', e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300"
                />
                <span>{template.isActive ? 'Active' : 'Inactive'}</span>
              </label>
            </div>
            {template.subject !== undefined && (
              <input
                type="text"
                value={template.subject}
                readOnly
                className="w-full p-2 border border-[var(--df-border)] rounded-md bg-[var(--df-surface-subtle)] text-xs font-mono mb-2 text-[var(--df-text)]"
              />
            )}
            <textarea
              value={template.content}
              onChange={e => handleTemplateChange(template.id, 'content', e.target.value)}
              rows={template.channel === 'SMS' ? 2 : 4}
              className="w-full p-2.5 border border-[var(--df-border)] rounded-md bg-[var(--df-surface)] text-xs font-mono text-[var(--df-text)]"
            />
            <div className="text-right mt-2">
              <button
                onClick={() => handleSave(template)}
                className="px-3.5 py-1.5 bg-primary text-white font-semibold text-xs rounded-lg hover:bg-primary-dark"
              >
                Save Template
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Settings: React.FC = () => {
  const { operationalSettings, handleUpdateOperationalSettings } = useAppContext();

  const [activeSetting, setActiveSetting] = useState<'branding' | 'operational' | 'communication'>('branding');
  const [opSettings, setOpSettings] = useState(operationalSettings);
  const [notice, setNotice] = useState<string | null>(null);

  const {
    logo,
    setLogo,
    primaryColor,
    setPrimaryColor,
    logoSize,
    setLogoSize,
    themeId,
    setThemeId,
    saveBranding,
  } = useBranding();

  const activeTheme = DESIGN_THEMES[themeId];

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = event => setLogo(event.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleOpSettingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setOpSettings(prev => ({
      ...prev,
      [name]: name.includes('Rate') || name.includes('Fee') ? parseFloat(value) : value,
    }));
  };

  const handleOpSettingsSave = (e: React.FormEvent) => {
    e.preventDefault();
    handleUpdateOperationalSettings(opSettings);
    setNotice('Operational penalty and overdue settings updated.');
  };

  const handleBrandingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = saveBranding();
    setNotice(ok ? 'Design system theme and branding tokens saved.' : 'Unable to save branding preferences.');
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-[var(--df-text)] tracking-tight">
          Design System &amp; Platform Settings
        </h1>
        <p className="text-xs text-[var(--df-muted)] mt-1">
          Configure 60-30-10 color theme presets, typography tokens, tenant identity, and operational parameters.
        </p>
      </div>

      {notice && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 px-4 py-3 rounded-lg flex items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>{notice}</span>
          </div>
          <button onClick={() => setNotice(null)} className="font-semibold hover:underline">
            Dismiss
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <aside className="lg:col-span-3">
          <div className="bg-[var(--df-surface)] border border-[var(--df-border)] p-3 rounded-xl space-y-1">
            {[
              { id: 'branding', label: 'Figma Theme & Branding' },
              { id: 'operational', label: 'Operational Rules' },
              { id: 'communication', label: 'Communication Templates' },
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setActiveSetting(item.id as any)}
                className={`w-full text-left px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-colors ${
                  activeSetting === item.id
                    ? 'bg-primary text-white'
                    : 'text-[var(--df-muted)] hover:bg-[var(--df-surface-subtle)] hover:text-[var(--df-text)]'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </aside>

        <main className="lg:col-span-9">
          {activeSetting === 'branding' && (
            <div className="bg-[var(--df-surface)] border border-[var(--df-border)] p-6 rounded-xl space-y-6">
              <div>
                <h2 className="font-display text-base font-bold text-[var(--df-text)]">
                  Curated Design Theme Presets (60-30-10 Token Architecture)
                </h2>
                <p className="text-xs text-[var(--df-muted)] mt-1">
                  Switch active canvas, hairline surface, and accent tokens cleanly across all banking modules.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {(Object.keys(DESIGN_THEMES) as DesignThemeId[]).map(id => {
                  const preset = DESIGN_THEMES[id];
                  const selected = themeId === id;
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => {
                        setThemeId(id);
                        setNotice(`Applied "${preset.name}" design theme tokens.`);
                      }}
                      className={`text-left p-4 rounded-xl border transition-colors ${
                        selected
                          ? 'border-slate-900 bg-[var(--df-surface-subtle)]'
                          : 'border-[var(--df-border)] bg-[var(--df-surface)] hover:bg-[var(--df-surface-subtle)]/60'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-display text-sm font-bold text-[var(--df-text)]">{preset.name}</span>
                        {selected && <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />}
                      </div>
                      <p className="text-xs text-[var(--df-muted)] mt-1 leading-relaxed">{preset.subtitle}</p>
                      <div className="mt-3 flex items-center gap-2">
                        <span
                          className="w-5 h-5 rounded border border-slate-300"
                          style={{ backgroundColor: preset.canvasBg }}
                          title={`Canvas ${preset.canvasBg}`}
                        />
                        <span
                          className="w-5 h-5 rounded border border-slate-300"
                          style={{ backgroundColor: preset.surfaceBg }}
                          title={`Surface ${preset.surfaceBg}`}
                        />
                        <span
                          className="w-5 h-5 rounded border border-slate-300"
                          style={{ backgroundColor: preset.primaryAccent }}
                          title={`Accent ${preset.primaryAccent}`}
                        />
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Typography & Design Token Spec Strip */}
              <div className="bg-[var(--df-surface-subtle)] border border-[var(--df-border)] rounded-lg p-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div>
                  <div className="text-[var(--df-muted)]">Display Font</div>
                  <div className="font-display font-bold text-[var(--df-text)] mt-0.5">Plus Jakarta Sans</div>
                </div>
                <div>
                  <div className="text-[var(--df-muted)]">UI &amp; Body Font</div>
                  <div className="font-sans font-semibold text-[var(--df-text)] mt-0.5">DM Sans</div>
                </div>
                <div>
                  <div className="text-[var(--df-muted)]">Tabular Financial Data</div>
                  <div className="font-mono font-semibold text-[var(--df-text)] mt-0.5 tabular-nums">
                    IBM Plex Mono · {activeTheme.primaryAccent}
                  </div>
                </div>
              </div>

              <form className="space-y-4 border-t border-[var(--df-border)] pt-5" onSubmit={handleBrandingSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="primaryColor" className="block text-xs font-semibold text-[var(--df-text)] mb-1">
                      Accent Hex Override
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        id="primaryColor"
                        value={primaryColor}
                        onChange={e => setPrimaryColor(e.target.value)}
                        className="h-9 w-12 p-0.5 bg-[var(--df-surface)] border border-[var(--df-border)] rounded-lg cursor-pointer"
                      />
                      <span className="font-mono text-xs text-[var(--df-muted)]">{primaryColor}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-start">
                  <div>
                    <label className="block text-xs font-semibold text-[var(--df-text)] mb-1.5">Top-Left Corner 3D Logo</label>
                    <div className="flex items-center gap-3 flex-wrap">
                      <div className="relative inline-flex items-center justify-center min-h-[144px] min-w-[180px] max-w-[300px] rounded-2xl bg-gradient-to-br from-white via-slate-100 to-slate-300 border-t-4 border-l-4 border-white border-b-4 border-r-4 border-slate-500/80 shadow-[0_10px_24px_rgba(15,23,42,0.24),0_3px_0_#475569,inset_0_2px_0_rgba(255,255,255,0.98)] px-6 py-4 overflow-hidden shrink-0">
                        {logo ? (
                          <img
                            src={logo}
                            alt="Top-Left Logo Preview"
                            style={{ height: `${Math.min(120, logoSize)}px` }}
                            className="w-auto max-w-full object-contain drop-shadow-[0_3px_5px_rgba(15,23,42,0.45)] contrast-[1.08]"
                          />
                        ) : (
                          <LogoIcon
                            style={{ height: `${Math.min(120, logoSize)}px`, width: `${Math.min(120, logoSize)}px` }}
                          />
                        )}
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/50 via-transparent to-transparent" />
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="file" id="logoUpload" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                        <label
                          htmlFor="logoUpload"
                          className="px-3 py-1.5 bg-[var(--df-surface)] border border-[var(--df-border)] rounded-lg text-xs font-semibold text-[var(--df-text)] hover:bg-[var(--df-surface-subtle)] cursor-pointer"
                        >
                          Upload Logo
                        </label>
                        {logo && (
                          <button
                            type="button"
                            onClick={() => setLogo(null)}
                            className="px-2.5 py-1.5 bg-[var(--df-surface)] border border-[var(--df-border)] rounded-lg text-xs font-medium text-[var(--df-muted)] hover:text-red-700 hover:border-red-200 transition-colors"
                          >
                            Reset
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label htmlFor="logoSize" className="block text-xs font-semibold text-[var(--df-text)]">
                        Logo Display Size
                      </label>
                      <span className="font-mono text-xs tabular-nums text-[var(--df-muted)]">{logoSize}px</span>
                    </div>
                    <input
                      type="range"
                      min={80}
                      max={148}
                      step={4}
                      id="logoSize"
                      value={logoSize}
                      onChange={e => setLogoSize(Number(e.target.value))}
                      className="w-full accent-primary cursor-pointer"
                    />
                    <div className="flex items-center gap-2 flex-wrap mt-2.5">
                      {[
                        { label: 'Bold (88px)', value: 88 },
                        { label: 'Large (104px)', value: 104 },
                        { label: 'Thick 3D (116px)', value: 116 },
                        { label: 'Max (136px)', value: 136 },
                      ].map(preset => (
                        <button
                          key={preset.value}
                          type="button"
                          onClick={() => setLogoSize(preset.value)}
                          className={`px-2.5 py-1 text-[11px] font-medium rounded-md border transition-colors ${
                            logoSize === preset.value
                              ? 'bg-primary text-white border-primary'
                              : 'bg-[var(--df-surface)] text-[var(--df-muted)] border-[var(--df-border)] hover:text-[var(--df-text)]'
                          }`}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-lg text-xs font-semibold text-white bg-primary hover:bg-primary-dark transition-colors"
                  >
                    Save Design System &amp; Branding
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeSetting === 'operational' && (
            <div className="bg-[var(--df-surface)] border border-[var(--df-border)] p-6 rounded-xl">
              <h2 className="font-display text-base font-bold text-[var(--df-text)] mb-1">Operational Rules</h2>
              <p className="text-xs text-[var(--df-muted)] mb-5">Define late payment fees and overdue interest schedules.</p>
              <form className="space-y-4" onSubmit={handleOpSettingsSave}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="latePaymentFee" className="block text-xs font-semibold text-[var(--df-text)] mb-1">
                      Flat Late Payment Fee (INR)
                    </label>
                    <input
                      type="number"
                      id="latePaymentFee"
                      name="latePaymentFee"
                      value={opSettings.latePaymentFee}
                      onChange={handleOpSettingsChange}
                      className="w-full px-3 py-2 text-xs font-mono tabular-nums bg-[var(--df-surface)] border border-[var(--df-border)] rounded-lg text-[var(--df-text)]"
                    />
                  </div>
                  <div>
                    <label htmlFor="overdueInterestRate" className="block text-xs font-semibold text-[var(--df-text)] mb-1">
                      Overdue Interest Rate (% p.a.)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      id="overdueInterestRate"
                      name="overdueInterestRate"
                      value={opSettings.overdueInterestRate}
                      onChange={handleOpSettingsChange}
                      className="w-full px-3 py-2 text-xs font-mono tabular-nums bg-[var(--df-surface)] border border-[var(--df-border)] rounded-lg text-[var(--df-text)]"
                    />
                  </div>
                </div>
                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-lg text-xs font-semibold text-white bg-primary hover:bg-primary-dark transition-colors"
                  >
                    Save Operational Rules
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeSetting === 'communication' && <CommunicationSettings onNotify={msg => setNotice(msg)} />}
        </main>
      </div>
    </div>
  );
};

export default Settings;