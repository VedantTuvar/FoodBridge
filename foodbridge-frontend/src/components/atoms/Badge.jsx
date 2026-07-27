import React from 'react';

export const Badge = ({ status = 'listed', children }) => {
  const statusColors = {
    listed: { bg: 'var(--paper-alt)', color: 'var(--ink-soft)' },
    claimed: { bg: 'var(--teal)', color: 'var(--white)' },
    assigned: { bg: 'var(--teal)', color: 'var(--white)' },
    picked_up: { bg: 'var(--amber)', color: 'var(--night)' },
    in_transit: { bg: 'var(--amber)', color: 'var(--night)' },
    delivered: { bg: 'var(--green-soft)', color: 'var(--white)' },
    confirmed: { bg: 'var(--green-soft)', color: 'var(--white)' },
    closed: { bg: 'var(--paper-alt)', color: 'var(--ink-soft)' },
    cancelled: { bg: 'var(--red-soft)', color: 'var(--white)' },
    expired: { bg: 'var(--red-soft)', color: 'var(--white)' },
  };

  const style = statusColors[status] || statusColors.listed;

  return (
    <span
      style={{
        display: 'inline-block',
        padding: '3px 8px',
        borderRadius: 'var(--radius-sm)',
        fontFamily: 'var(--font-mono)',
        fontSize: '11px',
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
        backgroundColor: style.bg,
        color: style.color,
      }}
    >
      {children || status.replace('_', ' ')}
    </span>
  );
};
