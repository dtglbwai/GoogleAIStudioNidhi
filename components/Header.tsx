import React from 'react';

const Header: React.FC = () => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <header className="h-20 items-center relative z-10 bg-white shadow-md flex justify-end px-6">
      <div className="flex items-center">
        <button
          onClick={handlePrint}
          className="p-2 mr-4 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
          title="Print Page (A4)"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
        </button>
      </div>
    </header>
  );
};

export default Header;