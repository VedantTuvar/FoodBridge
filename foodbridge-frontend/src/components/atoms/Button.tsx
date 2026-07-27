import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends HTMLMotionProps<'button'> {
  variant?: 'primary' | 'amber' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-body font-semibold rounded-sm transition-colors focus:outline-none focus:ring-2 focus:ring-amber focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-teal text-white hover:bg-teal-deep active:bg-teal-deep',
    amber: 'bg-amber text-night hover:bg-amber-deep active:bg-amber-deep',
    secondary: 'bg-paper-alt text-ink border border-line hover:border-ink-soft',
    danger: 'bg-red-soft text-white hover:opacity-90',
    ghost: 'bg-transparent text-ink hover:bg-paper-alt',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3.5 text-base',
  };

  return (
    <motion.button
      whileHover={{ scale: disabled || isLoading ? 1 : 1.01 }}
      whileTap={{ scale: disabled || isLoading ? 1 : 0.98 }}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 mr-2 animate-spin text-current" />
      ) : leftIcon ? (
        <span className="mr-2">{leftIcon}</span>
      ) : null}
      {children}
      {!isLoading && rightIcon && <span className="ml-2">{rightIcon}</span>}
    </motion.button>
  );
};
