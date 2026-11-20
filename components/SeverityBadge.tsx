import React from 'react';
import { AuditFindingSeverity } from '../views/types';

interface SeverityBadgeProps {
  severity: AuditFindingSeverity;
}

const severityConfig: Record<AuditFindingSeverity, { color: string; }> = {
  [AuditFindingSeverity.CRITICAL]: { color: 'red' },
  [AuditFindingSeverity.HIGH]: { color: 'orange' },
  [AuditFindingSeverity.MEDIUM]: { color: 'yellow' },
  [AuditFindingSeverity.LOW]: { color: 'blue' },
};


const SeverityBadge: React.FC<SeverityBadgeProps> = ({ severity }) => {
  const config = severityConfig[severity] || { color: 'gray' };
  
  const colorClasses = {
    red: 'bg-red-100 text-red-800 border border-red-200',
    orange: 'bg-orange-100 text-orange-800 border border-orange-200',
    yellow: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
    blue: 'bg-blue-100 text-blue-800 border border-blue-200',
  }[config.color] || 'bg-gray-100 text-gray-800';

  const baseClasses = "px-2 py-0.5 text-xs font-bold rounded-full inline-block whitespace-nowrap";

  return <span className={`${baseClasses} ${colorClasses}`}>{severity}</span>;
};

export default SeverityBadge;
