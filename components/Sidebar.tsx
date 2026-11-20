import React, { useState, useEffect } from 'react';
import { View } from '../views/types';
import { useBranding } from '../BrandingContext';
import { useAppContext } from '../AppContext';

// Icons
import LogoIcon from './icons/LogoIcon';
import DashboardIcon from './icons/DashboardIcon';
import KycIcon from './icons/KycIcon';
import ApplicationsIcon from './icons/ApplicationsIcon';
import SettingsIcon from './icons/SettingsIcon';
import VehicleIcon from './icons/VehicleIcon';
import LoanIcon from './icons/LoanIcon';
import LenderIcon from './icons/LenderIcon';
import AccountingIcon from './icons/AccountingIcon';
import ShieldIcon from './icons/ShieldIcon';
import GavelIcon from './icons/GavelIcon';
import AgreementIcon from './icons/AgreementIcon';
import CRMIcon from './icons/CRMIcon';
import SalesIcon from './icons/SalesIcon';
import PurchaseIcon from './icons/PurchaseIcon';
import InventoryIcon from './icons/InventoryIcon';
import ReconciliationIcon from './icons/ReconciliationIcon';
import ComplianceIcon from './icons/ComplianceIcon';
import SuperAdminIcon from './icons/SuperAdminIcon';
import HierarchyIcon from './icons/HierarchyIcon';
import CalculatorIcon from './icons/CalculatorIcon';
import BranchIcon from './icons/BranchIcon';
import HRMSIcon from './icons/HRMSIcon';
import ProductsIcon from './icons/ProductsIcon';
import SupportIcon from './icons/SupportIcon';
import CyberSecurityIcon from './icons/CyberSecurityIcon';
import CashAndBankIcon from './icons/CashAndBankIcon';
import DatabaseIcon from './icons/DatabaseIcon';
import AnalyticsIcon from './icons/AnalyticsIcon';
import CoreBankingIcon from './icons/CoreBankingIcon';
import CardIcon from './icons/CardIcon';
import PaymentsHubIcon from './icons/PaymentsHubIcon';
import CurrencyExchangeIcon from './icons/CurrencyExchangeIcon';
import UnderwritingIcon from './icons/UnderwritingIcon';
import ContactIcon from './icons/ContactIcon';
import DmsIcon from './icons/DmsIcon';
import FieldCollectionIcon from './icons/FieldCollectionIcon';
import AmlIcon from './icons/AmlIcon';
import CoLendingIcon from './icons/CoLendingIcon';
import GrievanceIcon from './icons/GrievanceIcon';
import GroupIcon from './icons/GroupIcon';
import ChequeIcon from './icons/ChequeIcon';
import GoldIcon from './icons/GoldIcon';
import CommunicationIcon from './icons/CommunicationIcon';
import GaugeIcon from './icons/GaugeIcon';
import MoneyIcon from './icons/MoneyIcon';
import UserIcon from './icons/UserIcon';
import CollectionsIcon from './icons/CollectionsIcon';
import ReportsIcon from './icons/ReportsIcon';
import ExecutiveIcon from './icons/ExecutiveIcon';
import QuantumIcon from './icons/QuantumIcon';
import TreasuryIcon from './icons/TreasuryIcon';
import GstIcon from './icons/GstIcon';
import TdsIcon from './icons/TdsIcon';
import ITMSIcon from './icons/ITMSIcon';
import DataBackupIcon from './icons/DataBackupIcon';
import DisasterRecoveryIcon from './icons/DisasterRecoveryIcon';
import PlatformAnalyticsIcon from './icons/PlatformAnalyticsIcon';
import SwiftIcon from './icons/SwiftIcon';
import ConfiBooksIcon from './icons/ConfiBooksIcon';
import RilletIcon from './icons/RilletIcon';
import NbfcIcon from './icons/NbfcIcon';
import JevIcon from './icons/JevIcon';
import RunamargaIcon from './icons/RunamargaIcon';
import WorkspaceIcon from './icons/WorkspaceIcon';
import TaxIcon from './icons/TaxIcon';
import CoopIcon from './icons/CoopIcon';

const NavItem: React.FC<{
  viewName: View;
  label: string;
  colorClass?: string;
  children: React.ReactNode;
}> = ({ viewName, label, colorClass = 'bg-indigo-100 text-indigo-600 ring-indigo-200', children }) => {
  const { currentView, setCurrentView } = useAppContext();
  const isActive = currentView === viewName;
  return (
    <li title={label}>
      <button
        onClick={() => setCurrentView(viewName)}
        className={`w-full flex items-center justify-center p-2 my-1 rounded-xl cursor-pointer transition-all duration-200 relative group ${
          isActive
            ? 'bg-slate-900/5 ring-1 ring-slate-300 shadow-sm'
            : 'hover:bg-slate-100/80'
        }`}
        aria-label={label}
        aria-current={isActive ? 'page' : undefined}
      >
        {isActive && <div className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-primary rounded-r-full" />}
        <span
          className={`w-10 h-10 rounded-xl flex items-center justify-center ring-1 transition-transform duration-150 group-hover:scale-105 ${colorClass}`}
        >
          <span className="w-5 h-5">{children}</span>
        </span>
      </button>
    </li>
  );
};

const NestedNavItem: React.FC<{
  viewName: View;
  label: string;
  icon: React.ReactNode;
  colorClass?: string;
}> = ({ viewName, label, icon, colorClass = 'bg-sky-50 text-sky-600 ring-sky-200' }) => {
  const { currentView, setCurrentView } = useAppContext();
  const isActive = currentView === viewName;
  return (
    <li title={label}>
      <button
        onClick={() => setCurrentView(viewName)}
        className={`w-full flex items-center justify-center py-1.5 px-2 my-0.5 rounded-lg cursor-pointer transition-all duration-150 group relative ${
          isActive
            ? 'bg-slate-900/5 ring-1 ring-slate-300 font-semibold shadow-sm'
            : 'hover:bg-slate-100/80'
        }`}
        aria-label={label}
        aria-current={isActive ? 'page' : undefined}
      >
        {isActive && <div className="absolute left-0 top-1 bottom-1 w-1 bg-primary rounded-r-full" />}
        <span
          className={`w-8 h-8 rounded-lg flex items-center justify-center ring-1 transition-transform duration-150 group-hover:scale-105 ${colorClass}`}
        >
          <span className="w-4 h-4">{icon}</span>
        </span>
      </button>
    </li>
  );
};

const CollapsibleNavItem: React.FC<{
  label: string;
  icon: React.ReactNode;
  colorClass?: string;
  children: React.ReactNode;
  initialOpen?: boolean;
}> = ({ label, icon, colorClass = 'bg-slate-100 text-slate-700 ring-slate-200', children, initialOpen = false }) => {
  const [isOpen, setIsOpen] = useState(initialOpen);

  return (
    <li title={label}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        className={`w-full flex items-center justify-center p-2 my-1 rounded-xl cursor-pointer transition-all duration-150 group ${
          isOpen ? 'bg-slate-100/90' : 'hover:bg-slate-100/70'
        }`}
        aria-label={label}
      >
        <span
          className={`w-10 h-10 rounded-xl flex items-center justify-center ring-1 transition-transform duration-150 group-hover:scale-105 ${colorClass}`}
        >
          <span className="w-5 h-5">{icon}</span>
        </span>
      </button>
      {isOpen && (
        <ul className="py-1 border-l-2 border-slate-200 ml-2 pl-0.5">
          {children}
        </ul>
      )}
    </li>
  );
};

const Sidebar: React.FC = () => {
  const { logo, logoSize } = useBranding();
  const { moduleConfig, currentUser } = useAppContext();
  const [logoLoadError, setLogoLoadError] = useState(false);

  useEffect(() => {
    setLogoLoadError(false);
  }, [logo]);

  const safeSidebarPx = Math.min(120, Math.max(80, Number.isFinite(logoSize) ? logoSize : 116));

  return (
    <aside className="w-36 bg-[var(--df-surface)] border-r border-[var(--df-border)] flex-shrink-0 flex flex-col fixed h-screen overflow-y-auto">
      <div className="h-32 px-2 py-2 flex items-center justify-center border-b border-[var(--df-border)] shrink-0 overflow-hidden bg-gradient-to-b from-white via-[var(--df-surface)] to-[var(--df-surface-subtle)]">
        {logo && !logoLoadError ? (
          <div className="relative inline-flex items-center justify-center p-2 rounded-2xl bg-gradient-to-br from-white via-slate-100 to-slate-300 border-t-4 border-l-4 border-white border-b-4 border-r-4 border-slate-500/80 shadow-[0_10px_22px_rgba(15,23,42,0.32),0_3px_0_#334155,inset_0_2px_0_rgba(255,255,255,0.98)] overflow-hidden">
            <img
              src={logo}
              alt="Logo"
              style={{ maxHeight: `${Math.min(104, safeSidebarPx)}px` }}
              className="w-auto max-w-[108px] object-contain drop-shadow-[0_3px_5px_rgba(15,23,42,0.45)] contrast-[1.08]"
              onError={() => setLogoLoadError(true)}
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/55 via-transparent to-transparent" />
          </div>
        ) : (
          <LogoIcon
            style={{ height: `${safeSidebarPx}px`, width: `${safeSidebarPx}px` }}
            className="max-w-full max-h-full"
          />
        )}
      </div>
      <nav className="flex-1 overflow-y-auto p-2">
        <ul className="space-y-1">
          <NavItem
            viewName="dashboard"
            label="Dashboard"
            colorClass="bg-indigo-100 text-indigo-600 ring-indigo-200"
          >
            <DashboardIcon />
          </NavItem>

          <CollapsibleNavItem
            label="Operations"
            icon={<GaugeIcon />}
            colorClass="bg-sky-100 text-sky-600 ring-sky-200"
            initialOpen
          >
            {(moduleConfig.intelligence || moduleConfig.branchOps) && (
              <CollapsibleNavItem
                label="Strategy & Leadership"
                icon={<ExecutiveIcon />}
                colorClass="bg-violet-100 text-violet-600 ring-violet-200"
              >
                {moduleConfig.intelligence && (
                  <>
                    <NestedNavItem viewName="executiveCorner" label="Executive Corner" icon={<ExecutiveIcon />} colorClass="bg-violet-50 text-violet-600 ring-violet-200" />
                    <NestedNavItem viewName="businessAssistant" label="Business Assistant" icon={<QuantumIcon />} colorClass="bg-fuchsia-50 text-fuchsia-600 ring-fuchsia-200" />
                  </>
                )}
                <NestedNavItem viewName="omniWorkspace" label="Omni Workspace" icon={<WorkspaceIcon />} colorClass="bg-cyan-50 text-cyan-600 ring-cyan-200" />
                <NestedNavItem viewName="organization" label="Organization Chart" icon={<HierarchyIcon />} colorClass="bg-blue-50 text-blue-600 ring-blue-200" />
                {moduleConfig.branchOps && (
                  <CollapsibleNavItem
                    label="HQ & Branch Setup"
                    icon={<BranchIcon />}
                    colorClass="bg-teal-100 text-teal-600 ring-teal-200"
                  >
                    <NestedNavItem viewName="hrms" label="HRMS" icon={<HRMSIcon />} colorClass="bg-indigo-50 text-indigo-600 ring-indigo-200" />
                    <NestedNavItem viewName="branchManagement" label="HQ & Branch Management" icon={<BranchIcon />} colorClass="bg-emerald-50 text-emerald-600 ring-emerald-200" />
                  </CollapsibleNavItem>
                )}
              </CollapsibleNavItem>
            )}

            {moduleConfig.lms && (
              <>
                <CollapsibleNavItem
                  label="Lead Management System (LMS)"
                  icon={<SalesIcon />}
                  colorClass="bg-emerald-100 text-emerald-600 ring-emerald-200"
                >
                  <NestedNavItem viewName="leads" label="Leads" icon={<SalesIcon />} colorClass="bg-emerald-50 text-emerald-600 ring-emerald-200" />
                  <NestedNavItem viewName="salesTeam" label="Sales Team" icon={<UserIcon />} colorClass="bg-blue-50 text-blue-600 ring-blue-200" />
                  <NestedNavItem viewName="marketingTeam" label="Marketing Team" icon={<UserIcon />} colorClass="bg-pink-50 text-pink-600 ring-pink-200" />
                  <NestedNavItem viewName="marketingStrategy" label="Marketing Strategy" icon={<AnalyticsIcon />} colorClass="bg-violet-50 text-violet-600 ring-violet-200" />
                </CollapsibleNavItem>

                <CollapsibleNavItem
                  label="Loan Management System"
                  icon={<LoanIcon />}
                  colorClass="bg-amber-100 text-amber-600 ring-amber-200"
                >
                  <NestedNavItem viewName="applications" label="Loan Applications" icon={<ApplicationsIcon />} colorClass="bg-amber-50 text-amber-600 ring-amber-200" />
                  <NestedNavItem viewName="crm" label="Customers (CRM)" icon={<CRMIcon />} colorClass="bg-sky-50 text-sky-600 ring-sky-200" />
                  <NestedNavItem viewName="fieldCollection" label="Field Collection" icon={<FieldCollectionIcon />} colorClass="bg-orange-50 text-orange-600 ring-orange-200" />
                  <NestedNavItem viewName="coLending" label="Co-lending" icon={<CoLendingIcon />} colorClass="bg-teal-50 text-teal-600 ring-teal-200" />
                  <NestedNavItem viewName="vehicleInventory" label="Vehicle Inventory" icon={<VehicleIcon />} colorClass="bg-indigo-50 text-indigo-600 ring-indigo-200" />
                  <NestedNavItem viewName="lenders" label="Lenders" icon={<LenderIcon />} colorClass="bg-emerald-50 text-emerald-600 ring-emerald-200" />
                  <NestedNavItem viewName="loanCalculator" label="EMI Calculator" icon={<CalculatorIcon />} colorClass="bg-violet-50 text-violet-600 ring-violet-200" />
                </CollapsibleNavItem>

                <CollapsibleNavItem
                  label="Products & Services"
                  icon={<ProductsIcon />}
                  colorClass="bg-orange-100 text-orange-600 ring-orange-200"
                >
                  <NestedNavItem viewName="loanProducts" label="Loan Products" icon={<ProductsIcon />} colorClass="bg-orange-50 text-orange-600 ring-orange-200" />
                  <CollapsibleNavItem
                    label="Loan Contracts"
                    icon={<LoanIcon />}
                    colorClass="bg-yellow-100 text-yellow-700 ring-yellow-200"
                  >
                    <NestedNavItem viewName="allLoans" label="General Loans" icon={<LoanIcon />} colorClass="bg-amber-50 text-amber-600 ring-amber-200" />
                    {moduleConfig.goldAndGroupLoans && (
                      <>
                        <NestedNavItem viewName="goldLoan" label="Gold Loans" icon={<GoldIcon />} colorClass="bg-yellow-50 text-yellow-600 ring-yellow-300" />
                        <NestedNavItem viewName="groupLending" label="Group Loans" icon={<GroupIcon />} colorClass="bg-lime-50 text-lime-700 ring-lime-200" />
                      </>
                    )}
                    <NestedNavItem viewName="leases" label="Lease Contracts" icon={<VehicleIcon />} colorClass="bg-blue-50 text-blue-600 ring-blue-200" />
                  </CollapsibleNavItem>
                  <NestedNavItem viewName="cashCollection" label="Cash Collection" icon={<MoneyIcon />} colorClass="bg-emerald-50 text-emerald-600 ring-emerald-200" />
                  <NestedNavItem viewName="cashBankDeposit" label="Bank Deposits" icon={<CashAndBankIcon />} colorClass="bg-teal-50 text-teal-600 ring-teal-200" />
                  <NestedNavItem viewName="cashTransportation" label="Cash Transport" icon={<VehicleIcon />} colorClass="bg-cyan-50 text-cyan-600 ring-cyan-200" />
                </CollapsibleNavItem>
              </>
            )}

            <CollapsibleNavItem
              label="Support"
              icon={<SupportIcon />}
              colorClass="bg-cyan-100 text-cyan-600 ring-cyan-200"
            >
              <NestedNavItem viewName="crmSupport" label="CRM Support" icon={<SupportIcon />} colorClass="bg-cyan-50 text-cyan-600 ring-cyan-200" />
              <NestedNavItem viewName="contactUs" label="Contact Us" icon={<ContactIcon />} colorClass="bg-blue-50 text-blue-600 ring-blue-200" />
            </CollapsibleNavItem>
          </CollapsibleNavItem>

          {(moduleConfig.accounting || moduleConfig.coreBanking || moduleConfig.treasury || moduleConfig.paymentsHub || moduleConfig.aiSuite || moduleConfig.coopSociety) && (
            <CollapsibleNavItem
              label="Financial Accounting & Core"
              icon={<AccountingIcon />}
              colorClass="bg-emerald-100 text-emerald-600 ring-emerald-200"
            >
              {moduleConfig.aiSuite && (
                <>
                  <NestedNavItem viewName="jevAi" label="Jev.ai System One AI" icon={<JevIcon />} colorClass="bg-purple-50 text-purple-600 ring-purple-200" />
                  <NestedNavItem viewName="rilletAi" label="Rillet AI Engine" icon={<RilletIcon />} colorClass="bg-fuchsia-50 text-fuchsia-600 ring-fuchsia-200" />
                  <NestedNavItem viewName="taxAi" label="Strategic Tax AI" icon={<TaxIcon />} colorClass="bg-rose-50 text-rose-600 ring-rose-200" />
                  <NestedNavItem viewName="runamarga" label="Runamarga AI" icon={<RunamargaIcon />} colorClass="bg-violet-50 text-violet-600 ring-violet-200" />
                </>
              )}

              {moduleConfig.accounting && (
                <>
                  <NestedNavItem viewName="nbfcEngine" label="NBFC Prudential & SBR" icon={<NbfcIcon />} colorClass="bg-indigo-50 text-indigo-600 ring-indigo-200" />
                  <NestedNavItem viewName="confiBooks" label="ConfiBooks Suite" icon={<ConfiBooksIcon />} colorClass="bg-teal-50 text-teal-600 ring-teal-200" />
                  <NestedNavItem viewName="accounting" label="General Ledger" icon={<AccountingIcon />} colorClass="bg-emerald-50 text-emerald-600 ring-emerald-200" />
                  <NestedNavItem viewName="gst" label="GST Compliance" icon={<GstIcon />} colorClass="bg-lime-50 text-lime-700 ring-lime-200" />
                  <NestedNavItem viewName="tds" label="TDS Compliance" icon={<TdsIcon />} colorClass="bg-amber-50 text-amber-600 ring-amber-200" />
                  <NestedNavItem viewName="sales" label="Sales" icon={<SalesIcon />} colorClass="bg-sky-50 text-sky-600 ring-sky-200" />
                  <NestedNavItem viewName="purchases" label="Purchases" icon={<PurchaseIcon />} colorClass="bg-orange-50 text-orange-600 ring-orange-200" />
                  <NestedNavItem viewName="items" label="Items & Stock" icon={<InventoryIcon />} colorClass="bg-yellow-50 text-yellow-600 ring-yellow-200" />
                  <NestedNavItem viewName="cashAndBank" label="Cash & Bank" icon={<CashAndBankIcon />} colorClass="bg-cyan-50 text-cyan-600 ring-cyan-200" />
                  <NestedNavItem viewName="reconciliation" label="Reconciliation" icon={<ReconciliationIcon />} colorClass="bg-blue-50 text-blue-600 ring-blue-200" />
                </>
              )}

              {moduleConfig.coopSociety && (
                <NestedNavItem viewName="truefincaplincoop" label="Co-op Credit Society" icon={<CoopIcon />} colorClass="bg-teal-50 text-teal-700 ring-teal-200" />
              )}

              {moduleConfig.treasury && (
                <NestedNavItem viewName="treasury" label="Treasury" icon={<TreasuryIcon />} colorClass="bg-amber-50 text-amber-700 ring-amber-200" />
              )}

              {moduleConfig.paymentsHub && (
                <NestedNavItem viewName="swiftHub" label="SWIFT & International Hub" icon={<SwiftIcon />} colorClass="bg-blue-50 text-blue-700 ring-blue-200" />
              )}

              {moduleConfig.coreBanking && (
                <CollapsibleNavItem
                  label="Core Banking"
                  icon={<CoreBankingIcon />}
                  colorClass="bg-indigo-100 text-indigo-600 ring-indigo-200"
                >
                  <NestedNavItem viewName="enterpriseCore" label="Enterprise Core Suite" icon={<CoreBankingIcon />} colorClass="bg-indigo-50 text-indigo-600 ring-indigo-200" />
                  <NestedNavItem viewName="cbsImplementation" label="CBS Technology & Implementation" icon={<CoreBankingIcon />} colorClass="bg-blue-50 text-blue-600 ring-blue-200" />
                  <NestedNavItem viewName="customerAccounts" label="Customer Accounts" icon={<UserIcon />} colorClass="bg-sky-50 text-sky-600 ring-sky-200" />
                  <NestedNavItem viewName="tellerOperations" label="Teller Operations" icon={<MoneyIcon />} colorClass="bg-emerald-50 text-emerald-600 ring-emerald-200" />
                  <NestedNavItem viewName="cardsManagement" label="Cards Management" icon={<CardIcon />} colorClass="bg-violet-50 text-violet-600 ring-violet-200" />
                  {moduleConfig.paymentsHub && (
                    <NestedNavItem viewName="paymentsHub" label="Payments Hub" icon={<PaymentsHubIcon />} colorClass="bg-teal-50 text-teal-600 ring-teal-200" />
                  )}
                  {moduleConfig.treasury && (
                    <NestedNavItem viewName="currencyExchange" label="Currency Exchange" icon={<CurrencyExchangeIcon />} colorClass="bg-amber-50 text-amber-600 ring-amber-200" />
                  )}
                  <NestedNavItem viewName="eodBodOperations" label="EOD/BOD Operations" icon={<CalculatorIcon />} colorClass="bg-rose-50 text-rose-600 ring-rose-200" />
                </CollapsibleNavItem>
              )}
            </CollapsibleNavItem>
          )}

          {(moduleConfig.risk || moduleConfig.legal || moduleConfig.intelligence) && (
            <CollapsibleNavItem
              label="Administration & Risk"
              icon={<ShieldIcon />}
              colorClass="bg-rose-100 text-rose-600 ring-rose-200"
            >
              {moduleConfig.risk && (
                <>
                  <NestedNavItem viewName="riskDashboard" label="Risk Dashboard" icon={<GaugeIcon />} colorClass="bg-rose-50 text-rose-600 ring-rose-200" />
                  <NestedNavItem viewName="underwriting" label="Underwriting" icon={<UnderwritingIcon />} colorClass="bg-indigo-50 text-indigo-600 ring-indigo-200" />
                  <NestedNavItem viewName="kyc" label="KYC Verification" icon={<KycIcon />} colorClass="bg-teal-50 text-teal-600 ring-teal-200" />
                  <NestedNavItem viewName="dms" label="Document Management" icon={<DmsIcon />} colorClass="bg-sky-50 text-sky-600 ring-sky-200" />
                  <NestedNavItem viewName="pdcManagement" label="PDC Management" icon={<ChequeIcon />} colorClass="bg-blue-50 text-blue-600 ring-blue-200" />
                  <NestedNavItem viewName="communicationHub" label="Communication Hub" icon={<CommunicationIcon />} colorClass="bg-cyan-50 text-cyan-600 ring-cyan-200" />
                  <NestedNavItem viewName="assetQuality" label="Asset Quality (NPA)" icon={<AnalyticsIcon />} colorClass="bg-amber-50 text-amber-600 ring-amber-200" />
                  <NestedNavItem viewName="insuranceCompliance" label="Insurance Compliance" icon={<ComplianceIcon />} colorClass="bg-emerald-50 text-emerald-600 ring-emerald-200" />
                  <NestedNavItem viewName="collections" label="Collections (Follow-up)" icon={<CollectionsIcon />} colorClass="bg-orange-50 text-orange-600 ring-orange-200" />
                  <NestedNavItem viewName="litigation" label="Litigation" icon={<GavelIcon />} colorClass="bg-red-50 text-red-600 ring-red-200" />
                  <NestedNavItem viewName="agreements" label="Agreements" icon={<AgreementIcon />} colorClass="bg-violet-50 text-violet-600 ring-violet-200" />
                  <NestedNavItem viewName="reports" label="Compliance & Reports" icon={<ReportsIcon />} colorClass="bg-fuchsia-50 text-fuchsia-600 ring-fuchsia-200" />
                  <NestedNavItem viewName="aml" label="AML & Fraud" icon={<AmlIcon />} colorClass="bg-red-50 text-red-700 ring-red-200" />
                  <NestedNavItem viewName="grievanceRedressal" label="Grievance Redressal" icon={<GrievanceIcon />} colorClass="bg-pink-50 text-pink-600 ring-pink-200" />
                </>
              )}
              {moduleConfig.legal && <NestedNavItem viewName="legalReview" label="Legal Review" icon={<GavelIcon />} colorClass="bg-amber-50 text-amber-700 ring-amber-200" />}
              {moduleConfig.intelligence && <NestedNavItem viewName="dataAnalytics" label="Business Intelligence" icon={<AnalyticsIcon />} colorClass="bg-purple-50 text-purple-600 ring-purple-200" />}
            </CollapsibleNavItem>
          )}

          {currentUser === 'Super Admin' && moduleConfig.system && (
            <CollapsibleNavItem
              label="Platform Super Admin"
              icon={<SuperAdminIcon />}
              colorClass="bg-orange-100 text-orange-600 ring-orange-200"
            >
              <NestedNavItem viewName="settings" label="Tenant Settings" icon={<SettingsIcon />} colorClass="bg-sky-50 text-sky-600 ring-sky-200" />
              <NestedNavItem viewName="superAdminSettings" label="SaaS Modules & HQ Control" icon={<SuperAdminIcon />} colorClass="bg-indigo-50 text-indigo-600 ring-indigo-200" />
              {moduleConfig.analytics && (
                <NestedNavItem viewName="platformAnalytics" label="Platform Analytics" icon={<PlatformAnalyticsIcon />} colorClass="bg-violet-50 text-violet-600 ring-violet-200" />
              )}
              <NestedNavItem viewName="cyberSecurity" label="Anti-Hacking & Security" icon={<CyberSecurityIcon />} colorClass="bg-rose-50 text-rose-600 ring-rose-200" />
              <NestedNavItem viewName="itms" label="Infrastructure Mgmt" icon={<ITMSIcon />} colorClass="bg-blue-50 text-blue-600 ring-blue-200" />
              <NestedNavItem viewName="dbms" label="Entity DB & Migration" icon={<DatabaseIcon />} colorClass="bg-amber-50 text-amber-600 ring-amber-200" />
              <NestedNavItem viewName="dataBackup" label="Data Backup & Recovery" icon={<DataBackupIcon />} colorClass="bg-emerald-50 text-emerald-600 ring-emerald-200" />
              <NestedNavItem viewName="disasterRecovery" label="Disaster Recovery" icon={<DisasterRecoveryIcon />} colorClass="bg-orange-50 text-orange-600 ring-orange-200" />
            </CollapsibleNavItem>
          )}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
