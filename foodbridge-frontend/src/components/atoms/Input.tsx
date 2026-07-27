import React, { forwardRef } from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = '', id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="flex flex-col mb-4">
        {label && (
          <label
            htmlFor={inputId}
            className="font-mono text-xs uppercase tracking-wider text-ink-soft dark:text-paper-alt mb-1.5 font-medium"
          >
            {label}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          className={`font-body text-base px-3.5 py-2.5 rounded-sm border bg-white dark:bg-night-soft text-ink dark:text-paper focus:outline-none focus:ring-2 focus:ring-amber transition-colors ${
            error
              ? 'border-red-soft focus:ring-red-soft'
              : 'border-line dark:border-line focus:border-transparent'
          } ${className}`}
          {...props}
        />
        {error ? (
          <span className="text-xs text-red-soft mt-1">{error}</span>
        ) : helperText ? (
          <span className="text-xs text-ink-soft mt-1">{helperText}</span>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';
