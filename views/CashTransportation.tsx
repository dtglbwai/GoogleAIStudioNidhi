import React from 'react';
import VehicleIcon from '../components/icons/VehicleIcon';

const CashTransportation: React.FC = () => {
  return (
    <div className="animate-fade-in">
      <div className="bg-white p-8 rounded-xl shadow-md">
        <div className="flex items-center space-x-4">
          <div className="bg-yellow-100 text-yellow-600 p-3 rounded-full">
            <VehicleIcon />
          </div>
          <h2 className="text-3xl font-bold text-gray-800">Cash Transportation Services</h2>
        </div>
        <p className="text-gray-600 mt-4 max-w-3xl">
          Insured and secure transportation of cash between your business locations, banks, and vaults. Our armored vehicles and trained personnel ensure the safe transit of your valuable assets, minimizing risk of theft or loss during transit.
        </p>
      </div>
    </div>
  );
};

export default CashTransportation;