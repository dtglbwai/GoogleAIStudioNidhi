import React from 'react';
import { KycStatus, ApplicationStatus, TransactionStatus, VehicleStatus, LendeeStatus } from '../types';

type Status = KycStatus | ApplicationStatus | TransactionStatus | VehicleStatus | LendeeStatus;

interface StatusBadgeProps {
  status: Status;
}

const statusConfig: Record<string, { color: string; }> = {
  // Green States
  'Verified': { color: 'green' },
  'Approved': { color: 'green' },
  'Disbursed': { color: 'green' },
  'Completed': { color: 'green' },
  'Available': { color: 'green' },
  'Paid': { color: 'green' },
  'Closed': { color: 'green' },
  'Active': { color: 'green' },
  'Paid Off': { color: 'green' },
  'Active Customer': { color: 'green' },

  // Yellow / Orange States
  'Pending': { color: 'yellow' },
  'In Review': { color: 'yellow' },
  'Submitted': { color: 'yellow' },
  'Maintenance': { color: 'yellow' },
  'Unpaid': { color: 'orange' },
  'Open': { color: 'orange' },
  'Overdue': { color: 'orange' },
  'High Risk': { color: 'orange' },

  // Blue States
  'Leased': { color: 'blue' },
  'Partially Paid': { color: 'blue' },

  // Red States
  'Rejected': { color: 'red' },
  'Failed': { color: 'red' },
  'Cancelled': { color: 'red' },
  'Defaulted': { color: 'red' },

  // Gray State
  'Draft': { color: 'gray' },
  'Sold': { color: 'gray' },
  'Inactive': { color: 'gray' },
};


const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const config = statusConfig[status] || { color: 'gray' };
  
  const colorClasses = {
    green: 'bg-green-100 text-green-800',
    yellow: 'bg-yellow-100 text-yellow-800',
    orange: 'bg-orange-100 text-orange-800',
    red: 'bg-red-100 text-red-800',
    blue: 'bg-blue-100 text-blue-800',
    gray: 'bg-gray-100 text-gray-800',
  }[config.color] || 'bg-gray-100 text-gray-800';

  const baseClasses = "px-2.5 py-0.5 text-xs font-semibold rounded-full inline-block whitespace-nowrap";

  return <span className={`${baseClasses} ${colorClasses}`}>{status}</span>;
};

export default StatusBadge;