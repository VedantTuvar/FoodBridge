import React from 'react';

const STAGES = [
  { key: 'listed', label: 'Listed' },
  { key: 'claimed', label: 'Claimed by NGO' },
  { key: 'assigned', label: 'Volunteer Assigned' },
  { key: 'picked_up', label: 'Picked Up' },
  { key: 'in_transit', label: 'In Transit' },
  { key: 'delivered', label: 'Delivered' },
  { key: 'confirmed', label: 'Confirmed & Closed' },
];

export const StatusTrackerTimeline = ({ currentStatus = 'listed' }) => {
  const currentIndex = STAGES.findIndex((s) => s.key === currentStatus);

  return (
    <div style={{ padding: '20px 0' }}>
      {STAGES.map((stage, idx) => {
        const isPassed = idx <= currentIndex;
        const isCurrent = idx === currentIndex;

        return (
          <div
            key={stage.key}
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: idx === STAGES.length - 1 ? 0 : '16px',
              position: 'relative',
            }}
          >
            <div
              style={{
                width: '14px',
                height: '14px',
                borderRadius: '50%',
                backgroundColor: isCurrent
                  ? 'var(--amber)'
                  : isPassed
                  ? 'var(--teal)'
                  : 'var(--line)',
                border: isCurrent ? '3px solid var(--paper)' : 'none',
                boxShadow: isCurrent ? '0 0 0 2px var(--amber)' : 'none',
                marginRight: '16px',
                zIndex: 2,
              }}
            />
            <span
              style={{
                fontFamily: isCurrent ? 'var(--font-mono)' : 'var(--font-body)',
                fontSize: '14px',
                fontWeight: isCurrent ? 600 : 400,
                color: isPassed ? 'var(--ink)' : 'var(--ink-soft)',
              }}
            >
              {stage.label}
            </span>
          </div>
        );
      })}
    </div>
  );
};
