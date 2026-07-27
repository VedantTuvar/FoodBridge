import React from 'react';

export const Heading = ({ level = 1, children, className = '' }) => {
  const Component = `h${level}`;
  const sizes = {
    1: '36px',
    2: '28px',
    3: '22px',
    4: '18px',
  };
  return (
    <Component
      className={className}
      style={{
        fontFamily: 'var(--font-display)',
        fontSize: sizes[level] || '24px',
        color: 'var(--ink)',
        fontWeight: 600,
        marginBottom: '12px',
      }}
    >
      {children}
    </Component>
  );
};

export const Text = ({ children, muted = false, size = '16px' }) => {
  return (
    <p
      style={{
        fontFamily: 'var(--font-body)',
        fontSize: size,
        color: muted ? 'var(--ink-soft)' : 'var(--ink)',
        lineHeight: 1.65,
        marginBottom: '8px',
      }}
    >
      {children}
    </p>
  );
};
