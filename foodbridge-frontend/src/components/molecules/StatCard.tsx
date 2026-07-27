import React from 'react';
import { motion } from 'framer-motion';

export interface StatCardProps {
  label: string;
  value: string | number;
  unit?: string;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ label, value, unit = '', className = '' }) => {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className={`bg-white dark:bg-night-soft border border-line rounded-sm p-6 text-center flex-1 min-w-[200px] shadow-sm ${className}`}
    >
      <span className="block font-mono text-[11px] uppercase tracking-wider text-ink-soft dark:text-paper-alt mb-2 font-medium">
        {label}
      </span>
      <div className="font-display text-4xl font-bold text-ink dark:text-paper leading-none">
        {value} <span className="text-lg font-normal text-ink-soft dark:text-paper-alt">{unit}</span>
      </div>
      <div className="w-8 h-1 bg-amber mx-auto mt-3 rounded-full"></div>
    </motion.div>
  );
};
