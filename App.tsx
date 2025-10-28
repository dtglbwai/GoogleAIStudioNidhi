
import React, { useState } from 'react';
import Dashboard from './views/Dashboard';
import KycManagement from './views/KycManagement';
import Applications from './views/Applications';
import Transactions from './views/Transactions';
import VehicleInventory from './views/VehicleInventory';
import Reports from './views/Reports';
import Settings from './views/Settings';
import Loans from './views/Loans';
import Lenders from './views/Lenders';
import Lendees from './views/Lendees';
import Accounting from './views/Accounting';
import MainLayout from './MainLayout';
import { BrandingProvider } from './BrandingContext';
import type { View, Application, Loan, Lendee } from './types';
import Applicants from './views/Parties';
import CashAndBank from './views/CashAndBank';
import { ApplicationStatus, ApplicationType, LendeeStatus, LoanStatus } from './types';


// MOCK DATA - MOVED HERE FOR GLOBAL STATE MANAGEMENT
const mockApplicationsData: Application[] = [
  { id: 'app-1', applicant: { name: 'Ramesh Kumar', type: 'Individual', phone: '9876543210', email: 'ramesh@email.com', pan: 'JKLMN0987P', address: 'A-10, Green Avenue, Chennai'}, type: ApplicationType.AUTO_LEASE, amount: 800000, submittedDate: '2023-06-01', status: ApplicationStatus.APPROVED, documents: [] },
  { id: 'app-2', applicant: { name: 'Innovate Solutions Pvt. Ltd.', type: 'Company', phone: '9123456789', email: 'contact@innovate.com', pan: 'ABCDE1234F', gstin: '29ABCDE1234F1Z5', address: '123 Tech Park, Bangalore'}, type: ApplicationType.MSME_LOAN, amount: 5000000, submittedDate: '2023-05-28', status: ApplicationStatus.DISBURSED, documents: [] },
  { id: 'app-3', applicant: { name: 'Sunita Sharma', type: 'Individual', phone: '9876543211', email: 'sunita@email.com', pan: 'PQRST4321U', address: 'B-20, Royal Apartments, Pune'}, type: ApplicationType.AUTO_LEASE, amount: 1200000, submittedDate: '2023-06-02', status: ApplicationStatus.IN_REVIEW, documents: [] },
  { id: 'app-4', applicant: { name: 'Bharat Enterprises', type: 'Company', phone: '9234567890', email: 'info@bharat.com', pan: 'FGHIJ5678K', gstin: '27FGHIJ5678K1Z9', address: '456 Commerce St, Mumbai'}, type: ApplicationType.MSME_LOAN, amount: 2500000, submittedDate: '2023-05-30', status: ApplicationStatus.SUBMITTED, documents: [] },
  { id: 'app-5', applicant: { name: 'Amit Patel', type: 'Individual', phone: '9876543212', email: 'amit@email.com', pan: 'VWXYZ5678A', address: 'C-30, Sky Towers, Ahmedabad'}, type: ApplicationType.AUTO_LEASE, amount: 1500000, submittedDate: '2023-06-03', status: ApplicationStatus.REJECTED, documents: [] },
  { id: 'app-6', applicant: { name: 'Sunrise Textiles', type: 'Company', phone: '9345678901', email: 'accounts@sunrise.com', pan: 'LMNOP9012Q', gstin: '24LMNOP9012Q1Z3', address: '789 Industrial Area, Surat'}, type: ApplicationType.MSME_LOAN, amount: 7500000, submittedDate: '2023-06-05', status: ApplicationStatus.PENDING, documents: [] },
];

const mockLoansData: Loan[] = [
    { id: 'loan-1', applicantId: 'comp-1', applicantName: 'Innovate Solutions Pvt. Ltd.', principalAmount: 5000000, disbursedDate: '2023-06-01', interestRate: 12.5, tenureMonths: 36, status: LoanStatus.ACTIVE, repaymentSchedule: [] },
    { id: 'loan-3', applicantId: 'comp-3', applicantName: 'Sunrise Textiles', principalAmount: 7500000, disbursedDate: '2022-11-10', interestRate: 11.0, tenureMonths: 60, status: LoanStatus.PAID_OFF, repaymentSchedule: [] },
];

const mockLendeesData: Lendee[] = [
    { id: 'lendee-1', name: 'Innovate Solutions Pvt. Ltd.', type: 'Company', totalBorrowed: 5000000, outstandingBalance: 3200000, activeLoans: 1, status: LendeeStatus.ACTIVE, creditScore: 780 },
    { id: 'lendee-3', name: 'Sunrise Textiles', type: 'Company', totalBorrowed: 7500000, outstandingBalance: 0, activeLoans: 0, status: LendeeStatus.INACTIVE, creditScore: 810 },
    { id: 'lendee-5', name: 'Ramesh Kumar', type: 'Individual', totalBorrowed: 800000, outstandingBalance: 800000, activeLoans: 1, status: LendeeStatus.ACTIVE, creditScore: 720 },
];


const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  
  // Lifted state
  const [applications, setApplications] = useState<Application[]>(mockApplicationsData);
  const [loans, setLoans] = useState<Loan[]>(mockLoansData);
  const [lendees, setLendees] = useState<Lendee[]>(mockLendeesData);

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'kyc':
        return <KycManagement />;
      
      // Lending Modules
      case 'applicants':
        return <Applicants 
                  applications={applications} 
                  setApplications={setApplications}
                  setLoans={setLoans}
                  setLendees={setLendees}
                />;
      case 'applications':
        return <Applications applications={applications} />;
      case 'loans':
        return <Loans loans={loans} />;
      case 'lenders':
        return <Lenders />;
      case 'lendees':
        return <Lendees lendees={lendees} />;
      case 'vehicleInventory':
        return <VehicleInventory />;

      // Finance & System
      case 'cashAndBank':
        return <CashAndBank />;
      case 'transactions':
        return <Transactions />;
      case 'accounting':
        return <Accounting />;
      case 'reports':
        return <Reports />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <BrandingProvider>
      <MainLayout currentView={currentView} setCurrentView={setCurrentView}>
        {renderView()}
      </MainLayout>
    </BrandingProvider>
  );
};

export default App;
