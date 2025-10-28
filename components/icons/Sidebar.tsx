import React from 'react';
import { View } from '../types';
import LogoIcon from './icons/LogoIcon';
import DashboardIcon from './icons/DashboardIcon';
import KycIcon from './icons/KycIcon';
import ApplicationsIcon from './icons/ApplicationsIcon';
import TransactionsIcon from './icons/TransactionsIcon';
import SettingsIcon from './icons/SettingsIcon';

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
        className={`w-full flex items-center p-3 my-1 rounded-lg cursor-pointer transition-colors duration-200 text-left ${
          isActive
            ? 'bg-blue-600 text-white shadow-md'
            : 'text-gray-600 hover:bg-blue-100 hover:text-blue-700'
        }`}
        aria-current={isActive ? 'page' : undefined}
      >
        <span className="w-6 h-6">{children}</span>
        <span className="ml-4 font-medium">{label}</span>
      </button>
    </li>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView }) => {
  return (
    <div className="w-64 bg-white shadow-lg flex-shrink-0 h-full flex flex-col">
      <div className="flex items-center justify-center h-20 border-b">
        <LogoIcon />
        <h1 className="text-2xl font-bold text-blue-700 ml-2">ifincaplen</h1>
      </div>
      <nav className="flex-1 px-4 py-4">
        <ul>
          <NavItem viewName="dashboard" label="Dashboard" currentView={currentView} setCurrentView={setCurrentView}>
            <DashboardIcon />
          </NavItem>
          <NavItem viewName="kyc" label="KYC Management" currentView={currentView} setCurrentView={setCurrentView}>
            <KycIcon />
          </NavItem>
          <NavItem viewName="applications" label="Applications" currentView={currentView} setCurrentView={setCurrentView}>
            <ApplicationsIcon />
          </NavItem>
          <NavItem viewName="transactions" label="Transactions" currentView={currentView} setCurrentView={setCurrentView}>
            <TransactionsIcon />
          </NavItem>
        </ul>
      </nav>
      <div className="px-4 py-4 border-t">
        <ul>
          <NavItem viewName="settings" label="Settings" currentView={currentView} setCurrentView={setCurrentView}>
            <SettingsIcon />
          </NavItem>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;