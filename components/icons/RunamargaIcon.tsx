import React from 'react';

const RunamargaIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    {/* Voice audio waves combined with financial check/nodes */}
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 2a3 3 0 00-3 3v6a3 3 0 006 0V5a3 3 0 00-3-3z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 10v1a7 7 0 01-14 0v-1" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 18v4m-4 0h8" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M22 10a9.97 9.97 0 01-1.5 5.2M2 10a9.97 9.97 0 001.5 5.2" />
  </svg>
);

export default RunamargaIcon;
