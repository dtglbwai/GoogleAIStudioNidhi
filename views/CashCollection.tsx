import React from 'react';
import MoneyIcon from '../components/icons/MoneyIcon';

const CashCollection: React.FC = () => {
  return (
    <div className="animate-fade-in">
      <div className="bg-white p-8 rounded-xl shadow-md">
        <div className="flex items-center space-x-4">
          <div className="bg-green-100 text-green-600 p-3 rounded-full">
            <MoneyIcon />
          </div>
          <h2 className="text-3xl font-bold text-gray-800">Cash Collection Services</h2>
        </div>
        <p className="text-gray-600 mt-4 max-w-3xl">
          Secure and efficient doorstep cash collection services for businesses. Our agents handle daily collections, reducing risk and streamlining your cash flow management. This service is ideal for retail businesses, educational institutions, and other entities with high cash transaction volumes.
        </p>
      </div>
    </div>
  );
};

export default CashCollection;