import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-night text-white border-t border-line mt-auto py-12 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 bg-teal text-amber font-mono font-bold text-xs rounded-sm flex items-center justify-center">
              FB
            </div>
            <span className="font-display text-xl font-bold text-paper">FoodBridge</span>
          </div>
          <p className="text-xs text-ink-soft max-w-sm">
            Real-time surplus food coordination network connecting verified donors, shelters, and volunteer drivers.
          </p>
        </div>

        <div className="flex flex-wrap gap-8 font-mono text-xs text-code-text">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-soft animate-pulse"></span>
            <span>Platform Status: Operational (99.9% Uptime)</span>
          </div>
          <div>© {new Date().getFullYear()} FoodBridge Inc.</div>
        </div>
      </div>
    </footer>
  );
};
