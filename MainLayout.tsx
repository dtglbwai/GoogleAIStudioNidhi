import React, { useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import { useBranding } from './BrandingContext';
import { darkenColor } from './colors';
import type { View } from './types';

interface MainLayoutProps {
  children: React.ReactNode;
  currentView: View;
  setCurrentView: (view: View) => void;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, currentView, setCurrentView }) => {
  const { primaryColor } = useBranding();

  useEffect(() => {
    const styleId = 'dynamic-branding-styles';
    let styleElement = document.getElementById(styleId) as HTMLStyleElement;
    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = styleId;
      document.head.appendChild(styleElement);
    }
    
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', primaryColor);

    const primaryDark = darkenColor(primaryColor, 10);

    styleElement.innerHTML = `
      .bg-primary { background-color: ${primaryColor}; }
      .hover\\:bg-primary-dark:hover { background-color: ${primaryDark}; }
      .text-primary { color: ${primaryColor}; }
      .border-primary { border-color: ${primaryColor}; }
      .ring-primary { --tw-ring-color: ${primaryColor}; }
      .bg-primary-light { background-color: ${primaryColor}1A; }
      .text-primary-dark { color: ${primaryDark}; }
      .fill-primary { fill: ${primaryColor}; }
      .stroke-primary { stroke: ${primaryColor}; }
    `;
  }, [primaryColor]);


  return (
    <div className="flex h-screen bg-gray-50 text-gray-800">
      <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
