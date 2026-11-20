export type DesignThemeId = 'editorial-slate' | 'parchment-ink' | 'nordic-cobalt';

export interface DesignThemePreset {
  id: DesignThemeId;
  name: string;
  subtitle: string;
  canvasBg: string;
  surfaceBg: string;
  surfaceSubtle: string;
  borderHairline: string;
  textPrimary: string;
  textMuted: string;
  primaryAccent: string;
}

export const DESIGN_THEMES: Record<DesignThemeId, DesignThemePreset> = {
  'editorial-slate': {
    id: 'editorial-slate',
    name: 'Editorial Slate',
    subtitle: 'Cool neutral stone canvas with deep sovereign teal accent',
    canvasBg: '#f8fafc',
    surfaceBg: '#ffffff',
    surfaceSubtle: '#f1f5f9',
    borderHairline: '#e2e8f0',
    textPrimary: '#0f172a',
    textMuted: '#475569',
    primaryAccent: '#0f766e',
  },
  'parchment-ink': {
    id: 'parchment-ink',
    name: 'Parchment & Ink',
    subtitle: 'Warm studio paper surfaces with institutional emerald accent',
    canvasBg: '#f9f8f6',
    surfaceBg: '#ffffff',
    surfaceSubtle: '#f3f1ed',
    borderHairline: '#e7e5e4',
    textPrimary: '#1c1917',
    textMuted: '#57534e',
    primaryAccent: '#065f46',
  },
  'nordic-cobalt': {
    id: 'nordic-cobalt',
    name: 'Nordic Cobalt',
    subtitle: 'Precision cool slate grid with deep cobalt interactive focus',
    canvasBg: '#f7f9fc',
    surfaceBg: '#ffffff',
    surfaceSubtle: '#eef2f7',
    borderHairline: '#dbe3ee',
    textPrimary: '#0b1220',
    textMuted: '#475569',
    primaryAccent: '#1d4ed8',
  },
};

// Function to darken a hex color by a given percentage
export const darkenColor = (hex: string, percent: number): string => {
  const safeHex = /^#?[0-9A-Fa-f]{3,6}$/.test(hex) ? hex : '#0f766e';
  const usePound = safeHex.startsWith('#');
  let body = usePound ? safeHex.slice(1) : safeHex;

  if (body.length === 3) {
    body = body.split('').map(char => char + char).join('');
  }

  const num = parseInt(body, 16);

  let r = (num >> 16) & 255;
  let g = (num >> 8) & 255;
  let b = num & 255;

  r = Math.round(r * (1 - percent / 100));
  g = Math.round(g * (1 - percent / 100));
  b = Math.round(b * (1 - percent / 100));

  r = Math.min(255, Math.max(0, r));
  g = Math.min(255, Math.max(0, g));
  b = Math.min(255, Math.max(0, b));

  const newHex = ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0');

  return (usePound ? '#' : '') + newHex;
};
