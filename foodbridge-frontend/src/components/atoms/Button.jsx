import React from 'react';

export const Button = ({ children, variant = 'primary', size = 'medium', className = '', ...props }) => {
  const baseStyle = {
    fontFamily: 'var(--font-body)',
    fontWeight: 600,
    border: 'none',
    borderRadius: 'var(--radius-sm)',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
  };

  const variants = {
    primary: {
      backgroundColor: 'var(--teal)',
      color: 'var(--white)',
    },
    amber: {
      backgroundColor: 'var(--amber)',
      color: 'var(--night)',
    },
    secondary: {
      backgroundColor: 'var(--paper-alt)',
      color: 'var(--ink)',
      border: 'var(--border-hairline)',
    },
    danger: {
      backgroundColor: 'var(--red-soft)',
      color: 'var(--white)',
    },
  };

  const sizes = {
    small: { padding: '6px 12px', fontSize: '13px' },
    medium: { padding: '10px 18px', fontSize: '15px' },
    large: { padding: '14px 24px', fontSize: '16px' },
  };

  const combinedStyle = {
    ...baseStyle,
    ...variants[variant],
    ...sizes[size],
  };

  return (
    <button style={combinedStyle} className={className} {...props}>
      {children}
    </button>
  );
};
