import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

interface BrandingState {
  projectName: string;
  logo: string | null;
  primaryColor: string;
}

interface BrandingContextType extends BrandingState {
  setProjectName: (name: string) => void;
  setLogo: (logo: string | null) => void;
  setPrimaryColor: (color: string) => void;
}

const defaultState: BrandingState = {
  projectName: 'ifincaplen',
  logo: null,
  primaryColor: '#3b82f6',
};

const BRANDING_STORAGE_KEY = 'ifincaplen-branding-settings';

const BrandingContext = createContext<BrandingContextType | undefined>(undefined);

export const BrandingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  
  const getInitialState = (): BrandingState => {
    try {
      const storedSettings = localStorage.getItem(BRANDING_STORAGE_KEY);
      if (storedSettings) {
        const parsed = JSON.parse(storedSettings);
        // Ensure parsed object has the correct shape, falling back to defaults for missing properties
        return { 
          projectName: parsed.projectName || defaultState.projectName,
          logo: parsed.logo || defaultState.logo,
          primaryColor: parsed.primaryColor || defaultState.primaryColor,
        };
      }
    } catch (error) {
      console.error("Failed to load branding settings from localStorage", error);
    }
    return defaultState;
  };

  const [brandingState, setBrandingState] = useState<BrandingState>(getInitialState);

  // Persist state to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(BRANDING_STORAGE_KEY, JSON.stringify(brandingState));
    } catch (error) {
      console.error("Failed to save branding settings to localStorage", error);
    }
  }, [brandingState]);

  const setProjectName = (name: string) => setBrandingState(prev => ({ ...prev, projectName: name }));
  const setLogo = (logo: string | null) => setBrandingState(prev => ({ ...prev, logo }));
  const setPrimaryColor = (color: string) => setBrandingState(prev => ({ ...prev, primaryColor: color }));


  return (
    <BrandingContext.Provider value={{
      ...brandingState,
      setProjectName,
      setLogo,
      setPrimaryColor,
    }}>
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
