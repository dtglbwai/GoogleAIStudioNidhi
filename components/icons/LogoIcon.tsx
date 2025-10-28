import React from 'react';

const LogoIcon: React.FC = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L2 7l10 5 10-5-10-5z" className="fill-primary" />
    <path d="M2 17l10 5 10-5" className="stroke-primary" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M2 12l10 5 10-5" className="stroke-primary" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.6" />
  </svg>
);

export default LogoIcon;