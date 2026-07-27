import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Package, Clock } from 'lucide-react';
import { Donation } from '../../types';
import { Badge } from '../atoms/Badge';
import { Button } from '../atoms/Button';
import { UrgencyBar } from '../molecules/UrgencyBar';
import { formatDate, formatKg } from '../../utils/formatters';

export interface DonationCardProps {
  donation: Donation;
  onClaim?: (id: string) => void;
  isNGO?: boolean;
  className?: string;
}

export const DonationCard: React.FC<DonationCardProps> = ({
  donation,
  onClaim,
  isNGO = false,
  className = '',
}) => {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className={`bg-white dark:bg-night-soft border border-line rounded-sm p-6 mb-4 shadow-sm transition-all ${className}`}
    >
      <div className="flex justify-between items-start mb-2">
        <div>
          <span className="font-mono text-xs text-ink-soft dark:text-paper-alt uppercase tracking-wider">
            {donation.donor_name || 'Verified Donor'}
          </span>
          <h3 className="font-display text-xl font-semibold text-ink dark:text-paper mt-0.5">
            {donation.food_type}
          </h3>
        </div>
        <Badge status={donation.status} />
      </div>

      <div className="flex flex-wrap gap-4 my-3 font-mono text-xs text-ink-soft dark:text-paper-alt">
        <div className="flex items-center gap-1.5">
          <Package className="w-4 h-4 text-teal" />
          <span>{formatKg(donation.quantity_kg)} ({donation.estimated_meals} meals)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock className="w-4 h-4 text-amber" />
          <span>Expires: {formatDate(donation.perishability_window)}</span>
        </div>
      </div>

      <UrgencyBar percentage={75} label="2 hours remaining" />

      <div className="flex items-start gap-1.5 text-xs text-ink-soft dark:text-paper-alt my-2">
        <MapPin className="w-4 h-4 text-teal shrink-0 mt-0.5" />
        <span>{donation.pickup_address}</span>
      </div>

      {isNGO && donation.status === 'listed' && onClaim && (
        <div className="mt-4 pt-3 border-t border-line">
          <Button variant="primary" size="md" className="w-full" onClick={() => onClaim(donation.id)}>
            Claim Donation
          </Button>
        </div>
      )}
    </motion.div>
  );
};
