import React from 'react';

export const Callout = ({ title, children, type = 'amber' }) => {
  const borderColors = {
    amber: 'var(--amber)',
    teal: 'var(--teal)',
    red: 'var(--red-soft)',
  };

  return (
    <div
      style={{
        backgroundColor: 'var(--paper-alt)',
        borderLeft: `3px solid ${borderColors[type]}`,
        borderRadius: 'var(--radius-sm)',
        padding: '16px 20px',
        marginBottom: '16px',
      }}
    >
      {title && (
        <h4
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '12px',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            color: 'var(--ink)',
            marginBottom: '4px',
          }}
        >
          {title}
        </h4>
      )}
      <div style={{ fontSize: '14px', color: 'var(--ink-soft)' }}>{children}</div>
    </div>
  );
};
