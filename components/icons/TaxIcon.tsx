import React from 'react';

const TaxIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg 
    className={className} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <rect x="3" y="4" width="18" height="16" rx="2" />
    <path d="M7 10h10" />
    <path d="M7 14h10" />
    <path d="M7 18h10" />
    <path d="M12 4v16" />
  </svg>
);

export default TaxIcon;
