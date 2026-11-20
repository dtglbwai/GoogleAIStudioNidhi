import React from 'react';
import { CheckCircle2, Clock, AlertTriangle, XCircle, Info, MinusCircle } from 'lucide-react';
import {
  KycStatus,
  ApplicationStatus,
  TransactionStatus,
  VehicleStatus,
  LeaseStatus,
  InvoiceStatus,
  OrderStatus,
  LoanStatus,
  InstallmentStatus,
  ComplianceTaskStatus,
  VoucherStatus,
  SupportTicketStatus,
  CollectionStatus,
  LegalCaseStatus,
  EmployeeStatus,
  CardStatus,
  PaymentOrderStatus,
  AmlStatus,
  GrievanceStatus,
  PdcStatus,
  CommunicationStatus,
} from '../views/types';

type Status =
  | KycStatus
  | ApplicationStatus
  | TransactionStatus
  | VehicleStatus
  | LeaseStatus
  | InvoiceStatus
  | OrderStatus
  | LoanStatus
  | InstallmentStatus
  | ComplianceTaskStatus
  | VoucherStatus
  | SupportTicketStatus
  | CollectionStatus
  | LegalCaseStatus
  | EmployeeStatus
  | CardStatus
  | PaymentOrderStatus
  | AmlStatus
  | GrievanceStatus
  | PdcStatus
  | CommunicationStatus;

interface StatusBadgeProps {
  status: Status;
}

const statusConfig: Record<string, { tone: 'green' | 'amber' | 'red' | 'blue' | 'slate' }> = {
  Verified: { tone: 'green' },
  Approved: { tone: 'green' },
  Disbursed: { tone: 'green' },
  'Vehicle Disbursed': { tone: 'green' },
  Completed: { tone: 'green' },
  Available: { tone: 'green' },
  Paid: { tone: 'green' },
  Active: { tone: 'green' },
  'Paid Off': { tone: 'green' },
  'Active Customer': { tone: 'green' },
  'Paid (Late)': { tone: 'green' },
  Resolved: { tone: 'green' },
  Settled: { tone: 'green' },
  Clean: { tone: 'green' },
  Cleared: { tone: 'green' },
  Sent: { tone: 'green' },

  Pending: { tone: 'amber' },
  'In Review': { tone: 'amber' },
  Submitted: { tone: 'amber' },
  'Pending Credit Check': { tone: 'amber' },
  'Agreement Pending': { tone: 'amber' },
  'Awaiting Delivery': { tone: 'amber' },
  Maintenance: { tone: 'amber' },
  'Pending Approval': { tone: 'amber' },
  'In Progress': { tone: 'amber' },
  'Return in Progress': { tone: 'amber' },
  Hearing: { tone: 'amber' },
  'On Leave': { tone: 'amber' },
  'Pending Activation': { tone: 'amber' },
  Unpaid: { tone: 'amber' },
  Overdue: { tone: 'amber' },
  'High Risk': { tone: 'amber' },
  Legal: { tone: 'amber' },
  Flagged: { tone: 'amber' },
  'Awaiting Customer Response': { tone: 'amber' },
  Open: { tone: 'amber' },

  Leased: { tone: 'blue' },
  'Partially Paid': { tone: 'blue' },
  'Uploaded to CKYC': { tone: 'blue' },
  'Approved, Pending Contract': { tone: 'blue' },
  Sanctioned: { tone: 'blue' },
  Reconciled: { tone: 'blue' },
  Filed: { tone: 'blue' },
  Processing: { tone: 'blue' },
  'Under Investigation': { tone: 'blue' },
  Deposited: { tone: 'blue' },

  Rejected: { tone: 'red' },
  Failed: { tone: 'red' },
  Defaulted: { tone: 'red' },
  Seized: { tone: 'red' },
  'Vehicle Seized': { tone: 'red' },
  Terminated: { tone: 'red' },
  Blocked: { tone: 'red' },
  Reported: { tone: 'red' },
  Escalated: { tone: 'red' },
  Bounced: { tone: 'red' },

  Draft: { tone: 'slate' },
  Sold: { tone: 'slate' },
  Inactive: { tone: 'slate' },
  Closed: { tone: 'slate' },
  None: { tone: 'slate' },
  Ended: { tone: 'slate' },
  Resigned: { tone: 'slate' },
  Expired: { tone: 'slate' },
};

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const tone = statusConfig[status]?.tone || 'slate';

  const toneStyle = {
    green: 'text-emerald-700',
    amber: 'text-amber-700',
    red: 'text-red-700',
    blue: 'text-sky-700',
    slate: 'text-slate-600',
  }[tone];

  const Icon =
    tone === 'green'
      ? CheckCircle2
      : tone === 'amber'
      ? Clock
      : tone === 'red'
      ? XCircle
      : tone === 'blue'
      ? Info
      : MinusCircle;

  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold whitespace-nowrap ${toneStyle}`}>
      <Icon className="w-3.5 h-3.5 shrink-0" />
      <span>{status}</span>
    </span>
  );
};

export default StatusBadge;