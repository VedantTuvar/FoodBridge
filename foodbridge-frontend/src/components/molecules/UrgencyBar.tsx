import React from 'react';

export interface UrgencyBarProps {
  percentage?: number; // 0 to 100
  label?: string;
  className?: string;
}

export const UrgencyBar: React.FC<UrgencyBarProps> = ({
  percentage = 100,
  label = '',
  className = '',
}) => {
  const safePercentage = Math.min(100, Math.max(0, percentage));

  return (
    <div className={`my-3 ${className}`}>
      {label && (
        <div className="flex justify-between font-mono text-[11px] text-ink-soft dark:text-paper-alt mb-1">
          <span>TIME UNTIL EXPIRY</span>
          <span className="font-semibold text-amber-deep dark:text-amber">{label}</span>
        </div>
      )}
      <div className="w-full h-1.5 bg-paper-alt dark:bg-night rounded-sm overflow-hidden border border-line/30">
        <div
          style={{ width: `${safePercentage}%` }}
          className="h-full bg-gradient-to-r from-teal via-amber to-amber-deep transition-all duration-300"
        />
      </div>
    </div>
  );
};
