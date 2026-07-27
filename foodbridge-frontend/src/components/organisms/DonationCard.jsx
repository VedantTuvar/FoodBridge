import React from 'react';
import { Badge } from '../atoms/Badge';
import { Button } from '../atoms/Button';
import { UrgencyBar } from '../molecules/UrgencyBar';
import { formatDate, formatKg } from '../../utils/formatters';

export const DonationCard = ({ donation, onClaim, isNGO = false }) => {
  return (
    <div
      style={{
        backgroundColor: 'var(--white)',
        border: 'var(--border-hairline)',
        borderRadius: 'var(--radius-sm)',
        padding: '20px',
        marginBottom: '16px',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              color: 'var(--ink-soft)',
              textTransform: 'uppercase',
            }}
          >
            {donation.donor_name || 'Verified Donor'}
          </span>
          <h3
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '20px',
              color: 'var(--ink)',
              margin: '4px 0',
            }}
          >
            {donation.food_type}
          </h3>
        </div>
        <Badge status={donation.status} />
      </div>

      <div
        style={{
          display: 'flex',
          gap: '16px',
          margin: '12px 0',
          fontFamily: 'var(--font-mono)',
          fontSize: '13px',
          color: 'var(--ink-soft)',
        }}
      >
        <div>📦 {formatKg(donation.quantity_kg)} ({donation.estimated_meals} meals)</div>
        <div>⏰ Expires: {formatDate(donation.perishability_window)}</div>
      </div>

      <UrgencyBar percentage={75} label="2 hours remaining" />

      <p style={{ fontSize: '13px', color: 'var(--ink-soft)', margin: '8px 0' }}>
        📍 {donation.pickup_address}
      </p>

      {isNGO && donation.status === 'listed' && (
        <div style={{ marginTop: '16px' }}>
          <Button variant="primary" onClick={() => onClaim(donation.id)}>
            Claim Donation
          </Button>
        </div>
      )}
    </div>
  );
};
