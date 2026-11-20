import React from 'react';
import CashAndBankIcon from '../components/icons/CashAndBankIcon';

const CashBankDeposit: React.FC = () => {
  return (
    <div className="animate-fade-in">
      <div className="bg-white p-8 rounded-xl shadow-md">
        <div className="flex items-center space-x-4">
          <div className="bg-blue-100 text-blue-600 p-3 rounded-full">
            <CashAndBankIcon />
          </div>
          <h2 className="text-3xl font-bold text-gray-800">Cash Bank Deposit Services</h2>
        </div>
        <p className="text-gray-600 mt-4 max-w-3xl">
          Reliable cash deposit services at partner banks. We ensure timely and accurate deposits of your collected cash, providing you with deposit slips and reconciled statements for easy accounting. This service eliminates the need for your staff to visit the bank.
        </p>
      </div>
    </div>
  );
};

export default CashBankDeposit;