import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { DESIGN_THEMES, DesignThemeId } from './colors';

const BRANDING_STORAGE_KEY = 'fincaplen-branding-settings';

interface BrandingState {
  projectName: string;
  logo: string | null;
  primaryColor: string;
  logoSize: number;
  themeId: DesignThemeId;
}

interface BrandingContextType extends BrandingState {
  setProjectName: (name: string) => void;
  setLogo: (logo: string | null) => void;
  setPrimaryColor: (color: string) => void;
  setLogoSize: (size: number) => void;
  setThemeId: (themeId: DesignThemeId) => void;
  saveBranding: () => boolean;
}

interface BrandingProviderProps {
  children: ReactNode;
}

const DEFAULT_LOGO_SIZE_PX = 116;
const MIN_LOGO_SIZE_PX = 80;
const MAX_LOGO_SIZE_PX = 148;

const normalizeLogoSize = (raw: unknown): number => {
  const num = typeof raw === 'number' ? raw : Number(raw);
  if (!Number.isFinite(num)) return DEFAULT_LOGO_SIZE_PX;
  // Upgrade smaller saved values (< 104px) to the new extra-large 116px default
  if (num < 104) return DEFAULT_LOGO_SIZE_PX;
  return Math.round(Math.min(MAX_LOGO_SIZE_PX, Math.max(MIN_LOGO_SIZE_PX, num)));
};

const getInitialBrandingState = (): BrandingState => {
  const defaultState: BrandingState = {
    projectName: 'fincaplen',
    logo: null,
    primaryColor: DESIGN_THEMES['editorial-slate'].primaryAccent,
    logoSize: DEFAULT_LOGO_SIZE_PX,
    themeId: 'editorial-slate',
  };

  try {
    const storedState = localStorage.getItem(BRANDING_STORAGE_KEY);
    if (storedState) {
      const parsedState = JSON.parse(storedState);
      if (parsedState && typeof parsedState.projectName === 'string' && typeof parsedState.primaryColor === 'string') {
        const themeId: DesignThemeId =
          parsedState.themeId && parsedState.themeId in DESIGN_THEMES
            ? parsedState.themeId
            : 'editorial-slate';
        return {
          ...defaultState,
          ...parsedState,
          themeId,
          logoSize: normalizeLogoSize(parsedState.logoSize),
          logo: parsedState.logo && typeof parsedState.logo === 'string' && parsedState.logo.startsWith('data:image/')
            ? parsedState.logo
            : null,
        };
      }
    }
  } catch (error) {
    console.error('Failed to load branding settings from localStorage:', error);
  }

  return defaultState;
};

const BrandingContext = createContext<BrandingContextType | undefined>(undefined);

export const BrandingProvider: React.FC<BrandingProviderProps> = ({ children }) => {
  const [brandingState, setBrandingState] = useState<BrandingState>(getInitialBrandingState);

  useEffect(() => {
    try {
      localStorage.setItem(BRANDING_STORAGE_KEY, JSON.stringify(brandingState));
    } catch (error) {
      console.error('Failed to save branding settings to localStorage:', error);
    }
  }, [brandingState]);

  const setProjectName = (name: string) => setBrandingState(prev => ({ ...prev, projectName: name }));
  const setLogo = (logo: string | null) => setBrandingState(prev => ({ ...prev, logo }));
  const setPrimaryColor = (color: string) => setBrandingState(prev => ({ ...prev, primaryColor: color }));
  const setLogoSize = (logoSize: number) =>
    setBrandingState(prev => ({
      ...prev,
      logoSize: Math.round(Math.min(MAX_LOGO_SIZE_PX, Math.max(MIN_LOGO_SIZE_PX, Number(logoSize) || DEFAULT_LOGO_SIZE_PX))),
    }));
  const setThemeId = (themeId: DesignThemeId) => {
    const preset = DESIGN_THEMES[themeId];
    setBrandingState(prev => ({
      ...prev,
      themeId,
      primaryColor: preset.primaryAccent,
    }));
  };

  const saveBranding = (): boolean => {
    try {
      localStorage.setItem(BRANDING_STORAGE_KEY, JSON.stringify(brandingState));
      return true;
    } catch (error) {
      console.error('Failed to save branding settings to localStorage:', error);
      return false;
    }
  };

  return (
    <BrandingContext.Provider
      value={{
        ...brandingState,
        setProjectName,
        setLogo,
        setPrimaryColor,
        setLogoSize,
        setThemeId,
        saveBranding,
      }}
    >
      {children}
    </BrandingContext.Provider>
  );
};

export const useBranding = (): BrandingContextType => {
  const context = useContext(BrandingContext);
  if (context === undefined) {
    throw new Error('useBranding must be used within a BrandingProvider');
  }
  return context;
};