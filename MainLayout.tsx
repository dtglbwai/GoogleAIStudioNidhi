
import React, { useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import { useBranding } from './BrandingContext';
import { darkenColor, DESIGN_THEMES } from './colors';
import { useAppContext } from './AppContext';
import { View, AppModule } from './views/types';

// Import all views
import Dashboard from './views/Dashboard';
import KycManagement from './views/KycManagement';
import Applications from './views/Applications';
import Leases from './views/Leases';
import Transactions from './views/Transactions';
import Settings from './views/Settings';
import AllLoans from './views/AllLoans';
import Reports from './views/Reports';
import Accounting from './views/Accounting';
import CashAndBank from './views/CashAndBank';
import VehicleInventory from './views/VehicleInventory';
import Lenders from './views/Lenders';
import CRM from './views/CRM';
import Sales from './views/Sales';
import Purchases from './views/Purchases';
import Items from './views/Inventory';
import Reconciliation from './views/Reconciliation';
import AssetQuality from './views/AssetQuality';
import InsuranceCompliance from './views/InsuranceCompliance';
import Collections from './views/Collections';
import Litigation from './views/Litigation';
import Agreements from './views/Agreements';
import DataAnalytics from './views/DataAnalytics';
import SuperAdminSettings from './views/SuperAdminSettings';
import OrganizationChart from './views/OrganizationChart';
import LoanCalculator from './views/LoanCalculator';
import BranchManagement from './views/BranchManagement';
import HRMS from './views/HRMS';
import LoanProducts from './views/LoanProducts';
import CashCollection from './views/CashCollection';
import CashBankDeposit from './views/CashBankDeposit';
import CashTransportation from './views/CashTransportation';
import SalesTeam from './views/SalesTeam';
import MarketingTeam from './views/MarketingTeam';
import MarketingStrategy from './views/MarketingStrategy';
import CrmSupport from './views/CrmSupport';
import CyberSecurity from './views/CyberSecurity';
import DBMS from './views/DBMS';
import CustomerAccounts from './views/CustomerAccounts';
import TellerOperations from './views/TellerOperations';
import EodBodOperations from './views/EodBodOperations';
import Leads from './views/Leads';
import LegalReview from './views/LegalReview';
import Underwriting from './views/Underwriting';
import CardsManagement from './views/CardsManagement';
import PaymentsHub from './views/PaymentsHub';
import CurrencyExchange from './views/CurrencyExchange';
import ContactUs from './views/ContactUs';
import DMS from './views/DMS';
import Portal from './views/Portal';
import FieldCollection from './views/FieldCollection';
import AML from './views/AML';
import CoLending from './views/CoLending';
import GrievanceRedressal from './views/GrievanceRedressal';
import GroupLending from './views/GroupLending';
import PdcManagement from './views/PdcManagement';
import GoldLoan from './views/GoldLoan';
import CommunicationHub from './views/CommunicationHub';
import RiskDashboard from './views/RiskDashboard';
import ExecutiveCorner from './views/ExecutiveCorner';
import Treasury from './views/Treasury';
import GST from './views/GST';
import TDS from './views/TDS';
import ITMS from './views/ITMS';
import DataBackup from './views/DataBackup';
import DisasterRecovery from './views/DisasterRecovery';
import PlatformAnalytics from './views/PlatformAnalytics';
import SwiftHub from './views/SwiftHub';
import ConfiBooks from './views/ConfiBooks';
import RilletAi from './views/RilletAi';
import NbfcAccountingEngine from './views/NbfcAccountingEngine';
import JevAi from './views/JevAi';
import Runamarga from './views/Runamarga';
import OmniWorkspace from './views/OmniWorkspace';
import TaxAi from './views/TaxAi';
import BusinessAssistant from './views/BusinessAssistant';
import TrueFincaplinCoop from './views/TrueFincaplinCoop';
import CbsImplementation from './views/CbsImplementation';
import EnterpriseCoreBanking from './views/EnterpriseCoreBanking';



const MainLayout: React.FC = () => {
  const { primaryColor, themeId } = useBranding();
  const { currentView, moduleConfig, currentUser, setCurrentView } = useAppContext();

  useEffect(() => {
    const theme = DESIGN_THEMES[themeId] || DESIGN_THEMES['editorial-slate'];
    const safePrimaryColor = /^#[0-9A-Fa-f]{6}$/.test(primaryColor) ? primaryColor : theme.primaryAccent;
    const styleId = 'dynamic-branding-styles';
    let styleElement = document.getElementById(styleId) as HTMLStyleElement;
    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = styleId;
      document.head.appendChild(styleElement);
    }

    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', safePrimaryColor);

    const primaryDark = darkenColor(safePrimaryColor, 12);
    const primaryDeep = darkenColor(safePrimaryColor, 22);

    styleElement.textContent = `
      :root {
        --df-canvas: ${theme.canvasBg};
        --df-surface: ${theme.surfaceBg};
        --df-surface-subtle: ${theme.surfaceSubtle};
        --df-border: ${theme.borderHairline};
        --df-text: ${theme.textPrimary};
        --df-muted: ${theme.textMuted};
        --df-accent: ${safePrimaryColor};
      }
      .bg-primary { background-color: ${safePrimaryColor}; }
      .hover\\:bg-primary-dark:hover { background-color: ${primaryDark}; }
      .text-primary { color: ${safePrimaryColor}; }
      .border-primary { border-color: ${safePrimaryColor}; }
      .ring-primary { --tw-ring-color: ${safePrimaryColor}; }
      .bg-primary-light { background-color: ${safePrimaryColor}14; }
      .text-primary-dark { color: ${primaryDeep}; }
      .fill-primary { fill: ${safePrimaryColor}; }
      .stroke-primary { stroke: ${safePrimaryColor}; }
    `;
  }, [primaryColor, themeId]);

  const getViewModule = (view: View): AppModule => {
    const viewMap: Record<View, AppModule> = {
        'dashboard': 'system',
        'allLoans': 'lms',
        'goldLoan': 'goldAndGroupLoans',
        'groupLending': 'goldAndGroupLoans',
        'crm': 'lms',
        'lenders': 'lms',
        'loanCalculator': 'lms',
        'loanProducts': 'lms',
        'cashCollection': 'lms',
        'cashBankDeposit': 'lms',
        'cashTransportation': 'lms',
        'leads': 'lms',
        'salesTeam': 'lms',
        'marketingTeam': 'lms',
        'marketingStrategy': 'lms',
        'applications': 'lms',
        'leases': 'lms',
        'vehicleInventory': 'lms',
        'fieldCollection': 'lms',
        'coLending': 'lms',
        'accounting': 'accounting',
        'sales': 'accounting',
        'purchases': 'accounting',
        'items': 'accounting',
        'cashAndBank': 'accounting',
        'reconciliation': 'accounting',
        'transactions': 'accounting',
        'gst': 'accounting',
        'tds': 'accounting',
        'confiBooks': 'accounting',
        'nbfcEngine': 'accounting',
        'treasury': 'treasury',
        'currencyExchange': 'treasury',
        'assetQuality': 'risk',
        'collections': 'risk',
        'insuranceCompliance': 'risk',
        'litigation': 'risk',
        'agreements': 'risk',
        'kyc': 'risk',
        'underwriting': 'risk',
        'reports': 'risk',
        'crmSupport': 'risk',
        'contactUs': 'risk',
        'dms': 'risk',
        'aml': 'risk',
        'grievanceRedressal': 'risk',
        'pdcManagement': 'risk',
        'communicationHub': 'risk',
        'riskDashboard': 'risk',
        'legalReview': 'legal',
        'dataAnalytics': 'intelligence',
        'executiveCorner': 'intelligence',
        'organization': 'system',
        'branchManagement': 'branchOps',
        'hrms': 'branchOps',
        'superAdminSettings': 'system',
        'settings': 'system',
        'cyberSecurity': 'system',
        'dbms': 'system',
        'itms': 'system',
        'dataBackup': 'system',
        'disasterRecovery': 'system',
        'platformAnalytics': 'analytics',
        'customerAccounts': 'coreBanking',
        'tellerOperations': 'coreBanking',
        'eodBodOperations': 'coreBanking',
        'cardsManagement': 'coreBanking',
        'cbsImplementation': 'coreBanking',
        'enterpriseCore': 'coreBanking',
        'paymentsHub': 'paymentsHub',
        'swiftHub': 'paymentsHub',
        'rilletAi': 'aiSuite',
        'jevAi': 'aiSuite',
        'taxAi': 'aiSuite',
        'runamarga': 'aiSuite',
        'businessAssistant': 'intelligence',
        'omniWorkspace': 'system',
        'truefincaplincoop': 'coopSociety',
        'portal': 'system',
    };

    return viewMap[view] || 'system';
  };
  
  const renderView = () => {
    const viewModule = getViewModule(currentView);
    if (viewModule !== 'system' && !moduleConfig[viewModule] && currentView !== 'dashboard' && currentView !== 'settings' && currentView !== 'superAdminSettings') {
        return (
          <div className="bg-[var(--df-surface)] border border-[var(--df-border)] rounded-xl p-8 max-w-2xl mx-auto mt-6 space-y-4">
            <h2 className="font-display text-xl font-bold text-slate-900">
              Module Deactivated for Client Bank
            </h2>
            <p className="text-sm text-slate-600">
              The <span className="font-mono font-semibold text-slate-900">{viewModule}</span> SaaS module is currently deactivated under this client bank&apos;s feature entitlement profile. Activate it in Platform Super Admin whenever required.
            </p>
            <div className="flex items-center gap-3 pt-2">
              {currentUser === 'Super Admin' && (
                <button
                  onClick={() => setCurrentView('superAdminSettings')}
                  className="px-4 py-2 text-xs font-semibold text-white bg-primary rounded-lg hover:bg-primary-dark"
                >
                  Open SaaS Module Manager
                </button>
              )}
              <button
                onClick={() => setCurrentView('dashboard')}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200"
              >
                Return to Overview
              </button>
            </div>
          </div>
        );
    }

    switch (currentView) {
      case 'dashboard': return <Dashboard />;
      case 'jevAi': return <JevAi />;
      case 'nbfcEngine': return <NbfcAccountingEngine />;
      case 'rilletAi': return <RilletAi />;
      case 'swiftHub': return <SwiftHub />;
      case 'confiBooks': return <ConfiBooks />;
      case 'kyc': return <KycManagement />;
      case 'applications': return <Applications />;
      case 'leases': return <Leases />;
      case 'transactions': return <Transactions />;
      case 'settings': return <Settings />;
      case 'allLoans': return <AllLoans />;
      case 'accounting': return <Accounting />;
      case 'cashAndBank': return <CashAndBank />;
      case 'vehicleInventory': return <VehicleInventory />;
      case 'lenders': return <Lenders />;
      case 'crm': return <CRM />;
      case 'sales': return <Sales />;
      case 'purchases': return <Purchases />;
      case 'items': return <Items />;
      case 'reconciliation': return <Reconciliation />;
      case 'assetQuality': return <AssetQuality />;
      case 'insuranceCompliance': return <InsuranceCompliance />;
      case 'collections': return <Collections />;
      case 'litigation': return <Litigation />;
      case 'agreements': return <Agreements />;
      case 'dataAnalytics': return <DataAnalytics />;
      case 'reports': return <Reports />;
      case 'superAdminSettings': return <SuperAdminSettings />;
      case 'organization': return <OrganizationChart />;
      case 'loanCalculator': return <LoanCalculator />;
      case 'branchManagement': return <BranchManagement />;
      case 'hrms': return <HRMS />;
      case 'loanProducts': return <LoanProducts />;
      case 'cashCollection': return <CashCollection />;
      case 'cashBankDeposit': return <CashBankDeposit />;
      case 'cashTransportation': return <CashTransportation />;
      case 'salesTeam': return <SalesTeam />;
      case 'marketingTeam': return <MarketingTeam />;
      case 'marketingStrategy': return <MarketingStrategy />;
      case 'crmSupport': return <CrmSupport />;
      case 'cyberSecurity': return <CyberSecurity />;
      case 'dbms': return <DBMS />;
      case 'customerAccounts': return <CustomerAccounts />;
      case 'tellerOperations': return <TellerOperations />;
      case 'eodBodOperations': return <EodBodOperations />;
      case 'leads': return <Leads />;
      case 'legalReview': return <LegalReview />;
      case 'underwriting': return <Underwriting />;
      case 'cardsManagement': return <CardsManagement />;
      case 'paymentsHub': return <PaymentsHub />;
      case 'currencyExchange': return <CurrencyExchange />;
      case 'contactUs': return <ContactUs />;
      case 'dms': return <DMS />;
      case 'portal': return <Portal />;
      case 'fieldCollection': return <FieldCollection />;
      case 'aml': return <AML />;
      case 'coLending': return <CoLending />;
      case 'grievanceRedressal': return <GrievanceRedressal />;
      case 'groupLending': return <GroupLending />;
      case 'pdcManagement': return <PdcManagement />;
      case 'goldLoan': return <GoldLoan />;
      case 'communicationHub': return <CommunicationHub />;
      case 'riskDashboard': return <RiskDashboard />;
      case 'executiveCorner': return <ExecutiveCorner />;
      case 'treasury': return <Treasury />;
      case 'gst': return <GST />;
      case 'tds': return <TDS />;
      case 'itms': return <ITMS />;
      case 'dataBackup': return <DataBackup />;
      case 'disasterRecovery': return <DisasterRecovery />;
      case 'platformAnalytics': return <PlatformAnalytics />;
      case 'runamarga': return <Runamarga />;
      case 'omniWorkspace': return <OmniWorkspace />;
      case 'taxAi': return <TaxAi />;
      case 'businessAssistant': return <BusinessAssistant />;
      case 'truefincaplincoop': return <TrueFincaplinCoop />;
      case 'cbsImplementation': return <CbsImplementation />;
      case 'enterpriseCore': return <EnterpriseCoreBanking />;
      default:
        // This should not happen with TypeScript, but as a fallback:
        // FIX: The type error here indicates not all cases of 'View' are handled.
        // After inspection, they all seem to be present. The error is likely a side-effect
        // of `useAppContext` failing to import, causing `currentView` to be typed as `any`.
        // The fix in `AppContext.tsx` should resolve this. The line below is kept for exhaustive checks.
        const _exhaustiveCheck: never = currentView;
        return <p>View not found: {currentView}</p>;
    }
  };
  
  if (currentView === 'portal') {
    return <Portal />;
  }

  return (
    <div className="flex h-screen bg-[var(--df-canvas)] text-[var(--df-text)]">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden ml-36">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-[var(--df-canvas)] p-6 lg:p-8">
          <div className="max-w-[1440px] mx-auto">
            {renderView()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
