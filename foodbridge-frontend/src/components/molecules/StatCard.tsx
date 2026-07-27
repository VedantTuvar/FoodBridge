import React from 'react';

export const StatCard = ({ label, value, unit = '' }) => {
  return (
    <div
      style={{
        backgroundColor: 'var(--white)',
        border: 'var(--border-hairline)',
        borderRadius: 'var(--radius-sm)',
        padding: '24px',
        textAlign: 'center',
        flex: 1,
        minWidth: '180px',
      }}
    >
      <span
        style={{
          display: 'block',
          fontFamily: 'var(--font-mono)',
          fontSize: '11px',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          color: 'var(--ink-soft)',
          marginBottom: '8px',
        }}
      >
        {label}
      </span>
      <div
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: '36px',
          fontWeight: 700,
          color: 'var(--ink)',
          lineHeight: 1,
        }}
      >
        {value} <span style={{ fontSize: '18px', fontWeight: 400 }}>{unit}</span>
      </div>
      <div
        style={{
          width: '32px',
          height: '3px',
          backgroundColor: 'var(--amber)',
          margin: '12px auto 0 auto',
        }}
      />
    </div>
  );
};
