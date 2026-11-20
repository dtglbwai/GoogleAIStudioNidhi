import React from 'react';

const QuantumIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8.25v7.5" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 12h-7.5" />
        <ellipse cx="12" cy="12" rx="4" ry="9.75" transform="rotate(45 12 12)" strokeDasharray="2 2" />
        <ellipse cx="12" cy="12" rx="4" ry="9.75" transform="rotate(-45 12 12)" strokeDasharray="2 2" />
    </svg>
);

export default QuantumIcon;
