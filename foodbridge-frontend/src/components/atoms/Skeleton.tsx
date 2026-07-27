import React from 'react';

export interface SkeletonProps {
  variant?: 'text' | 'card' | 'table-row';
  height?: string;
  width?: string;
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'text',
  height,
  width,
  className = '',
}) => {
  if (variant === 'card') {
    return (
      <div className={`p-5 bg-paper-alt border border-line rounded-sm animate-pulse ${className}`}>
        <div className="h-4 bg-line rounded w-1/3 mb-3"></div>
        <div className="h-6 bg-line rounded w-3/4 mb-4"></div>
        <div className="h-3 bg-line rounded w-1/2"></div>
      </div>
    );
  }

  if (variant === 'table-row') {
    return (
      <div className={`flex items-center justify-between p-4 border-b border-line animate-pulse ${className}`}>
        <div className="h-4 bg-line rounded w-1/4"></div>
        <div className="h-4 bg-line rounded w-1/6"></div>
        <div className="h-4 bg-line rounded w-1/5"></div>
      </div>
    );
  }

  return (
    <div
      style={{ height, width }}
      className={`bg-line/60 animate-pulse rounded-sm ${className}`}
    ></div>
  );
};
