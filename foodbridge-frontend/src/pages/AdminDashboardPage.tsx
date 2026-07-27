import React from 'react';
import { StatCard } from '../components/molecules/StatCard';
import { Heading } from '../components/atoms/Typography';
import { Callout } from '../components/molecules/Callout';

export const AdminDashboardPage = () => {
  return (
    <div>
      <Heading level={2}>Platform Operations Dashboard</Heading>

      <Callout type="amber" title="System Status: Normal Operations">
        All API clusters, Celery workers, and WebSocket channel layers operating within normal parameters.
      </Callout>

      <div style={{ display: 'flex', gap: '20px', margin: '24px 0', flexWrap: 'wrap' }}>
        <StatCard label="Pending NGO Vettings" value="4" unit="requests" />
        <StatCard label="Active Deliveries" value="12" unit="in transit" />
        <StatCard label="Active Volunteers" value="38" unit="online" />
      </div>
    </div>
  );
};
