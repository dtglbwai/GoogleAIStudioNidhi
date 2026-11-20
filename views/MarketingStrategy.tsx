import React from 'react';

const StrategyCard: React.FC<{title: string, description: string, status: string}> = ({title, description, status}) => (
    <div className="bg-white p-6 rounded-xl shadow-md">
        <div className="flex justify-between items-start">
            <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
            <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{status}</span>
        </div>
        <p className="text-sm text-gray-500 mt-2">{description}</p>
    </div>
);

const MarketingStrategy: React.FC = () => {
  return (
    <div className="animate-fade-in">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Marketing Strategy Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StrategyCard 
            title="Q3 Digital Lead Generation"
            description="Targeting MSME owners in Tier-2 cities through targeted Google Ads and LinkedIn campaigns. Goal: 500 qualified leads."
            status="Active"
        />
        <StrategyCard 
            title="Brand Awareness Campaign"
            description="Increase brand recall in key markets through PR activities and partnerships with local business associations."
            status="Active"
        />
        <StrategyCard 
            title="Customer Referral Program"
            description="Launch a new referral program to incentivize existing customers to refer new clients. Goal: 10% of new business from referrals."
            status="Planned"
        />
      </div>
    </div>
  );
};

export default MarketingStrategy;
