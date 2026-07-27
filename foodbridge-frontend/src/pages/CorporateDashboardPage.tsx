import React from 'react';
import { Heading } from '../components/atoms/Typography';
import { StatCard } from '../components/molecules/StatCard';
import { Callout } from '../components/molecules/Callout';

export const CorporateDashboardPage = () => {
  return (
    <div>
      <Heading level={2}>Corporate CSR Dashboard</Heading>

      <Callout type="teal" title="ESG Compliance & Sustainability Portal">
        Consolidated metrics across all corporate food donation branches. Downloadable ISO/ESG impact certificates available.
      </Callout>

      <div style={{ display: 'flex', gap: '20px', margin: '24px 0', flexWrap: 'wrap' }}>
        <StatCard label="Corporate Branches" value="12" unit="locations" />
        <StatCard label="Total Meals Saved" value="12,450" unit="meals" />
        <StatCard label="CO₂ Avoided" value="10.8" unit="tons" />
      </div>
    </div>
  );
};
