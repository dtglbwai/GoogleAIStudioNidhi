import React from 'react';
import HomeLoanIcon from '../components/icons/HomeLoanIcon';
import BusinessLoanIcon from '../components/icons/BusinessLoanIcon';
import IndustryLoanIcon from '../components/icons/IndustryLoanIcon';
import LoanIcon from '../components/icons/LoanIcon'; // For MSME

const ProductCard: React.FC<{ title: string; description: string; icon: React.ReactNode; }> = ({ title, description, icon }) => (
    <div className="bg-white p-6 rounded-xl shadow-md text-left hover:shadow-lg transition-shadow flex items-start space-x-4">
        <div className="bg-primary-light p-3 rounded-lg text-primary flex-shrink-0 w-12 h-12 flex items-center justify-center">
            {icon}
        </div>
        <div>
            <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
            <p className="text-sm text-gray-500 mt-1">{description}</p>
        </div>
    </div>
);

const LoanProducts: React.FC = () => {
  return (
    <div className="animate-fade-in">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Loan Products</h2>
      <p className="text-gray-600 mb-8 max-w-3xl">
        A diverse range of credit products designed to meet the specific needs of various customer segments, from small businesses to individuals seeking home financing.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ProductCard
            title="MSME Loans"
            description="Collateral-free loans for micro, small, and medium enterprises to fund expansion, working capital, and equipment purchases."
            icon={<LoanIcon />}
        />
        <ProductCard
            title="Home Loans"
            description="Competitive financing for purchasing or constructing residential properties, with flexible tenure and repayment options."
            icon={<HomeLoanIcon />}
        />
        <ProductCard
            title="Business Loans"
            description="Tailored financing solutions for established businesses to manage cash flow, acquire assets, or scale operations."
            icon={<BusinessLoanIcon />}
        />
        <ProductCard
            title="Industry-Specific Loans"
            description="Specialized credit facilities for specific industrial sectors, addressing unique capital and operational requirements."
            icon={<IndustryLoanIcon />}
        />
      </div>
    </div>
  );
};

export default LoanProducts;