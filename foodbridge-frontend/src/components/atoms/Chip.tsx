import React from 'react';

export const Chip = ({ label, variant = 'outlined' }) => {
  const isFilled = variant === 'filled';
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '4px 10px',
        borderRadius: 'var(--radius-sm)',
        fontFamily: 'var(--font-mono)',
        fontSize: '11px',
        border: '1px solid var(--teal)',
        backgroundColor: isFilled ? 'var(--teal)' : 'transparent',
        color: isFilled ? 'var(--white)' : 'var(--teal)',
      }}
    >
      {label}
    </span>
  );
};
