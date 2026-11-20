import React from 'react';
import MainLayout from './MainLayout';
import { BrandingProvider } from './BrandingContext';
import { AppProvider } from './AppContext';
import ErrorBoundary from './components/ErrorBoundary';

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <BrandingProvider>
        <AppProvider>
          <MainLayout />
        </AppProvider>
      </BrandingProvider>
    </ErrorBoundary>
  );
};

export default App;