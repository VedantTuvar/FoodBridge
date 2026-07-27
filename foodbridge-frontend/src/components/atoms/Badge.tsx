import React from 'react';
import { DonationStatus } from '../../types';

export interface BadgeProps {
  status: DonationStatus;
  label?: string;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ status, label, className = '' }) => {
  const statusStyles: Record<DonationStatus, { bg: string; text: string }> = {
    listed: { bg: 'bg-paper-alt text-ink-soft border border-line', text: 'Listed' },
    claimed: { bg: 'bg-teal text-white', text: 'Claimed' },
    assigned: { bg: 'bg-teal text-white', text: 'Assigned' },
    picked_up: { bg: 'bg-amber text-night font-semibold', text: 'Picked Up' },
    in_transit: { bg: 'bg-amber text-night font-semibold', text: 'In Transit' },
    delivered: { bg: 'bg-green-soft text-white', text: 'Delivered' },
    confirmed: { bg: 'bg-green-soft text-white', text: 'Confirmed' },
    closed: { bg: 'bg-paper-alt text-ink-soft', text: 'Closed' },
    cancelled: { bg: 'bg-red-soft text-white', text: 'Cancelled' },
    expired: { bg: 'bg-red-soft text-white', text: 'Expired' },
  };

  const current = statusStyles[status] || statusStyles.listed;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-sm font-mono text-[11px] font-medium uppercase tracking-wider ${current.bg} ${className}`}
    >
      {label || current.text}
    </span>
  );
};
