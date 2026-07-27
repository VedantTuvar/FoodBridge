import React from 'react';
import { DonationStatus } from '../../types';
import { CheckCircle2, Clock } from 'lucide-react';

const STAGES: { key: DonationStatus; label: string }[] = [
  { key: 'listed', label: 'Listed' },
  { key: 'claimed', label: 'Claimed by NGO' },
  { key: 'assigned', label: 'Volunteer Assigned' },
  { key: 'picked_up', label: 'Picked Up' },
  { key: 'in_transit', label: 'In Transit' },
  { key: 'delivered', label: 'Delivered' },
  { key: 'confirmed', label: 'Confirmed & Closed' },
];

export interface StatusTrackerTimelineProps {
  currentStatus: DonationStatus;
  className?: string;
}

export const StatusTrackerTimeline: React.FC<StatusTrackerTimelineProps> = ({
  currentStatus = 'listed',
  className = '',
}) => {
  const currentIndex = STAGES.findIndex((s) => s.key === currentStatus);

  return (
    <div className={`py-4 ${className}`}>
      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-line">
        {STAGES.map((stage, idx) => {
          const isPassed = idx < currentIndex;
          const isCurrent = idx === currentIndex;

          return (
            <div key={stage.key} className="relative flex items-center gap-4 group">
              <div
                className={`absolute -left-6 w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                  isPassed
                    ? 'bg-teal text-white ring-4 ring-paper'
                    : isCurrent
                    ? 'bg-amber text-night ring-4 ring-amber/20 animate-pulse'
                    : 'bg-line text-ink-soft'
                }`}
              >
                {isPassed ? (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                ) : isCurrent ? (
                  <Clock className="w-3.5 h-3.5" />
                ) : (
                  <div className="w-2 h-2 rounded-full bg-paper" />
                )}
              </div>

              <span
                className={`text-sm ${
                  isCurrent
                    ? 'font-mono font-bold text-ink dark:text-paper uppercase tracking-wider'
                    : isPassed
                    ? 'font-body font-medium text-teal dark:text-teal-deep'
                    : 'font-body text-ink-soft opacity-60'
                }`}
              >
                {stage.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
