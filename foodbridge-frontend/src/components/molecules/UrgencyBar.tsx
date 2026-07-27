import React from 'react';

export const UrgencyBar = ({ percentage = 100, label = '' }) => {
  return (
    <div style={{ margin: '12px 0' }}>
      {label && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            color: 'var(--ink-soft)',
            marginBottom: '4px',
          }}
        >
          <span>TIME UNTIL EXPIRY</span>
          <span>{label}</span>
        </div>
      )}
      <div
        style={{
          width: '100%',
          height: '6px',
          backgroundColor: 'var(--paper-alt)',
          borderRadius: 'var(--radius-sm)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${percentage}%`,
            height: '100%',
            background: 'linear-gradient(90deg, var(--teal) 0%, var(--amber) 100%)',
            transition: 'width 0.3s ease',
          }}
        />
      </div>
    </div>
  );
};
