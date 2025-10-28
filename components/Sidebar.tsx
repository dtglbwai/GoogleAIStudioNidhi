import React from 'react';
import { View } from '../types';
import { useBranding } from '../BrandingContext';
import LogoIcon from './icons/LogoIcon';
import DashboardIcon from './icons/DashboardIcon';
import KycIcon from './icons/KycIcon';
import ApplicationsIcon from './icons/ApplicationsIcon';
import TransactionsIcon from './icons/TransactionsIcon';
import SettingsIcon from './icons/SettingsIcon';
import VehicleIcon from './icons/VehicleIcon';
import ReportsIcon from './icons/ReportsIcon';
import LoanIcon from './icons/LoanIcon';
import LenderIcon from './icons/LenderIcon';
import LendeeIcon from './icons/LendeeIcon';
import AccountingIcon from './icons/AccountingIcon';

// New Icons
import PartyIcon from './icons/PartyIcon';
import CashAndBankIcon from './icons/CashAndBankIcon';

interface SidebarProps {
  currentView: View;
  setCurrentView: (view: View) => void;
}

const NavItem: React.FC<{
  viewName: View;
  label: string;
  currentView: View;
  setCurrentView: (view: View) => void;
  children: React.ReactNode;
}> = ({ viewName, label, currentView, setCurrentView, children }) => {
  const isActive = currentView === viewName;
  return (
    <li>
      <button
        onClick={() => setCurrentView(viewName)}
        className={`w-full flex items-center p-3 my-1 rounded-lg cursor-pointer transition-colors duration-200 text-left relative ${
          isActive
            ? 'bg-primary-light text-primary-dark'
            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
        }`}
        aria-current={isActive ? 'page' : undefined}
      >
        {isActive && <div className="absolute left-0 top-0 h-full w-1 bg-primary rounded-r-full"></div>}
        <span className="w-6 h-6">{children}</span>
        <span className="ml-4 font-semibold">{label}</span>
      </button>
    </li>
  );
};

const NavGroup: React.FC<{ title: string }> = ({ title }) => (
    <h3 className="px-3 pt-4 pb-1 text-xs font-bold uppercase text-gray-400 tracking-wider">
        {title}
    </h3>
);


const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView }) => {
  const { projectName, logo } = useBranding();
  
  return (
    <aside className="w-64 bg-white shadow-lg flex-shrink-0 h-full flex flex-col">
      <div className="flex items-center justify-center h-20 border-b px-4">
        {logo ? (
          <img src={logo} alt="Project Logo" className="h-10 w-auto" />
        ) : (
          <LogoIcon />
        )}
        <h1 className="text-xl font-bold text-gray-800 ml-3 truncate">{projectName}</h1>
      </div>
      <nav className="flex-1 px-4 py-2 overflow-y-auto">
        <ul>
          <NavItem viewName="dashboard" label="Dashboard" currentView={currentView} setCurrentView={setCurrentView}>
            <DashboardIcon />
          </NavItem>
                    
          <NavGroup title="Lending" />
           <NavItem viewName="applicants" label="Applicants" currentView={currentView} setCurrentView={setCurrentView}>
            <PartyIcon />
          </NavItem>
          <NavItem viewName="applications" label="Lease Applications" currentView={currentView} setCurrentView={setCurrentView}>
            <ApplicationsIcon />
          </NavItem>
          <NavItem viewName="loans" label="Loan Management" currentView={currentView} setCurrentView={setCurrentView}>
            <LoanIcon />
          </NavItem>
          <NavItem viewName="lenders" label="Lenders" currentView={currentView} setCurrentView={setCurrentView}>
            <LenderIcon />
          </NavItem>
          <NavItem viewName="lendees" label="Lendees" currentView={currentView} setCurrentView={setCurrentView}>
            <LendeeIcon />
          </NavItem>
           <NavItem viewName="vehicleInventory" label="Vehicle Inventory" currentView={currentView} setCurrentView={setCurrentView}>
            <VehicleIcon />
          </NavItem>
          
          <NavGroup title="Finance" />
           <NavItem viewName="accounting" label="Accounting" currentView={currentView} setCurrentView={setCurrentView}>
            <AccountingIcon />
          </NavItem>
          <NavItem viewName="cashAndBank" label="Cash & Bank" currentView={currentView} setCurrentView={setCurrentView}>
            <CashAndBankIcon />
          </NavItem>
           <NavItem viewName="transactions" label="Transactions" currentView={currentView} setCurrentView={setCurrentView}>
            <TransactionsIcon />
          </NavItem>
          <NavItem viewName="reports" label="Reports" currentView={currentView} setCurrentView={setCurrentView}>
            <ReportsIcon />
          </NavItem>

        </ul>
      </nav>
      <div className="px-4 py-4 border-t">
         <ul>
          <NavGroup title="Platform Settings" />
          <NavItem viewName="kyc" label="KYC Management" currentView={currentView} setCurrentView={setCurrentView}>
            <KycIcon />
          </NavItem>
          <NavItem viewName="settings" label="Settings" currentView={currentView} setCurrentView={setCurrentView}>
            <SettingsIcon />
          </NavItem>
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;