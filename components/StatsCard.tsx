
import React from 'react';

interface StatsCardProps {
  title: string;
  value: string;
  change: string;
  changeType: 'increase' | 'decrease';
  icon: React.ReactNode;
  color: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, change, changeType, icon, color }) => {
  const isIncrease = changeType === 'increase';
  return (
    <div className="bg-white p-6 rounded-xl shadow-md flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-3xl font-bold text-gray-800 mt-1">{value}</p>
        <div className="flex items-center mt-2">
          <span className={`flex items-center text-xs font-semibold ${isIncrease ? 'text-green-500' : 'text-red-500'}`}>
             {isIncrease ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            )}
            {change}
          </span>
          <span className="text-xs text-gray-400 ml-1">vs last month</span>
        </div>
      </div>
      <div className={`p-4 rounded-full`} style={{ backgroundColor: color + '20' }}>
        <div className="w-8 h-8" style={{ color: color }}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
