import React from 'react';
import { Heading } from '../../components/atoms/Typography';
import { StatCard } from '../../components/molecules/StatCard';

export const AdminAnalyticsPage: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <Heading level={2}>Platform Analytics & Data Charts</Heading>
        <p style={{ color: 'var(--ink-soft)', marginTop: '4px' }}>
          Deep-dive telemetry on food redistribution throughput, environmental impact, and user engagement metrics.
        </p>
      </div>

      {/* Top Impact Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        <StatCard label="Total Food Saved" value="48.2" unit="tonnes" />
        <StatCard label="Meals Redistributed" value="128,450" unit="meals" />
        <StatCard label="CO₂ Emissions Avoided" value="115.6" unit="tonnes CO₂" />
        <StatCard label="Water Footprint Saved" value="412,000" unit="liters" />
      </div>

      {/* Interactive Charts Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
        
        {/* Weekly Volume Trend Chart (SVG) */}
        <div style={{ backgroundColor: 'var(--white)', border: '1px solid var(--line)', borderRadius: '6px', padding: '20px' }}>
          <Heading level={3}>Weekly Food Volume Redistributed (kg)</Heading>
          <div style={{ marginTop: '20px' }}>
            <svg viewBox="0 0 500 200" style={{ width: '100%', height: 'auto', overflow: 'visible' }}>
              {/* Grid lines */}
              <line x1="40" y1="20" x2="480" y2="20" stroke="#eee" strokeWidth="1" />
              <line x1="40" y1="70" x2="480" y2="70" stroke="#eee" strokeWidth="1" />
              <line x1="40" y1="120" x2="480" y2="120" stroke="#eee" strokeWidth="1" />
              <line x1="40" y1="170" x2="480" y2="170" stroke="#eee" strokeWidth="1" />

              {/* Y Axis Labels */}
              <text x="30" y="25" fontSize="10" fill="#888" textAnchor="end">1,000</text>
              <text x="30" y="75" fontSize="10" fill="#888" textAnchor="end">750</text>
              <text x="30" y="125" fontSize="10" fill="#888" textAnchor="end">500</text>
              <text x="30" y="175" fontSize="10" fill="#888" textAnchor="end">250</text>

              {/* Area path */}
              <path
                d="M 50 150 Q 120 110, 190 130 T 330 60 T 470 30 L 470 170 L 50 170 Z"
                fill="url(#gradient)"
                opacity="0.3"
              />

              {/* Line path */}
              <path
                d="M 50 150 Q 120 110, 190 130 T 330 60 T 470 30"
                fill="none"
                stroke="var(--teal)"
                strokeWidth="3"
              />

              {/* Data points */}
              <circle cx="50" cy="150" r="4" fill="var(--teal)" />
              <circle cx="120" cy="110" r="4" fill="var(--teal)" />
              <circle cx="190" cy="130" r="4" fill="var(--teal)" />
              <circle cx="260" cy="90" r="4" fill="var(--teal)" />
              <circle cx="330" cy="60" r="4" fill="var(--teal)" />
              <circle cx="400" cy="45" r="4" fill="var(--teal)" />
              <circle cx="470" cy="30" r="4" fill="var(--teal)" />

              {/* Gradient definition */}
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="var(--teal)" />
                  <stop offset="100%" stopColor="white" />
                </linearGradient>
              </defs>

              {/* X Axis Labels */}
              <text x="50" y="190" fontSize="11" fill="#666" textAnchor="middle">Mon</text>
              <text x="120" y="190" fontSize="11" fill="#666" textAnchor="middle">Tue</text>
              <text x="190" y="190" fontSize="11" fill="#666" textAnchor="middle">Wed</text>
              <text x="260" y="190" fontSize="11" fill="#666" textAnchor="middle">Thu</text>
              <text x="330" y="190" fontSize="11" fill="#666" textAnchor="middle">Fri</text>
              <text x="400" y="190" fontSize="11" fill="#666" textAnchor="middle">Sat</text>
              <text x="470" y="190" fontSize="11" fill="#666" textAnchor="middle">Sun</text>
            </svg>
          </div>
        </div>

        {/* Donation Lifecycle Status Distribution */}
        <div style={{ backgroundColor: 'var(--white)', border: '1px solid var(--line)', borderRadius: '6px', padding: '20px' }}>
          <Heading level={3}>Donation Lifecycle Distribution</Heading>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '20px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '4px' }}>
                <span>Delivered & Confirmed</span>
                <span style={{ fontWeight: 600 }}>72% (644 listings)</span>
              </div>
              <div style={{ width: '100%', height: '10px', backgroundColor: 'var(--paper-alt)', borderRadius: '5px' }}>
                <div style={{ width: '72%', height: '100%', backgroundColor: 'var(--green-soft)', borderRadius: '5px' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '4px' }}>
                <span>In Transit / Picked Up</span>
                <span style={{ fontWeight: 600 }}>15% (134 listings)</span>
              </div>
              <div style={{ width: '100%', height: '10px', backgroundColor: 'var(--paper-alt)', borderRadius: '5px' }}>
                <div style={{ width: '15%', height: '100%', backgroundColor: 'var(--amber)', borderRadius: '5px' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '4px' }}>
                <span>Claimed by NGO (Awaiting Pickup)</span>
                <span style={{ fontWeight: 600 }}>9% (80 listings)</span>
              </div>
              <div style={{ width: '100%', height: '10px', backgroundColor: 'var(--paper-alt)', borderRadius: '5px' }}>
                <div style={{ width: '9%', height: '100%', backgroundColor: 'var(--teal)', borderRadius: '5px' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '4px' }}>
                <span>Expired / Unclaimed</span>
                <span style={{ fontWeight: 600 }}>4% (36 listings)</span>
              </div>
              <div style={{ width: '100%', height: '10px', backgroundColor: 'var(--paper-alt)', borderRadius: '5px' }}>
                <div style={{ width: '4%', height: '100%', backgroundColor: 'var(--red-soft)', borderRadius: '5px' }} />
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
