import React from 'react';

export interface ChipProps {
  label: string;
  variant?: 'filled' | 'outlined';
  className?: string;
}

export const Chip: React.FC<ChipProps> = ({ label, variant = 'outlined', className = '' }) => {
  const isFilled = variant === 'filled';
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-sm font-mono text-[11px] font-medium border border-teal ${
        isFilled ? 'bg-teal text-white' : 'bg-transparent text-teal'
      } ${className}`}
    >
      {label}
    </span>
  );
};
