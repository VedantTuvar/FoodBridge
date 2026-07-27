import React from 'react';
import { AlertTriangle, Info, CheckCircle2, AlertCircle } from 'lucide-react';

export interface CalloutProps {
  title?: string;
  children: React.ReactNode;
  type?: 'amber' | 'teal' | 'red' | 'info';
  className?: string;
}

export const Callout: React.FC<CalloutProps> = ({
  title,
  children,
  type = 'amber',
  className = '',
}) => {
  const styles = {
    amber: { border: 'border-l-amber', icon: <AlertTriangle className="w-4 h-4 text-amber shrink-0 mt-0.5" /> },
    teal: { border: 'border-l-teal', icon: <CheckCircle2 className="w-4 h-4 text-teal shrink-0 mt-0.5" /> },
    red: { border: 'border-l-red-soft', icon: <AlertCircle className="w-4 h-4 text-red-soft shrink-0 mt-0.5" /> },
    info: { border: 'border-l-ink-soft', icon: <Info className="w-4 h-4 text-ink-soft shrink-0 mt-0.5" /> },
  };

  const current = styles[type];

  return (
    <div
      className={`bg-paper-alt dark:bg-night-soft border-l-3 ${current.border} rounded-sm p-4 mb-4 flex items-start gap-3 ${className}`}
    >
      {current.icon}
      <div className="flex-1 text-sm text-ink-soft dark:text-paper-alt">
        {title && (
          <h4 className="font-mono text-xs uppercase tracking-wider font-semibold text-ink dark:text-paper mb-1">
            {title}
          </h4>
        )}
        <div>{children}</div>
      </div>
    </div>
  );
};
