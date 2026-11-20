import React from 'react';

const WorkspaceIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg 
    className={className} 
    fill="none" 
    viewBox="0 0 24 24" 
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    {/* Enterprise Workspace: Multi-tier desk, task matrix, interconnected nodes */}
    <rect x="3" y="3" width="7" height="7" rx="1.5" />
    <rect x="14" y="3" width="7" height="7" rx="1.5" />
    <rect x="14" y="14" width="7" height="7" rx="1.5" />
    <path d="M6.5 14v4a2 2 0 0 0 2 2h2" />
    <circle cx="6.5" cy="14" r="1.5" />
    <path d="M10 6.5h4" />
    <path d="M17.5 10v4" />
  </svg>
);

export default WorkspaceIcon;
