import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/organisms/Navbar';
import { Sidebar } from '../components/organisms/Sidebar';

export const NGOLayout = () => {
  const ngoLinks = [
    { to: '/ngo/browse', label: '🗺 Browse & Claim' },
    { to: '/ngo/deliveries/incoming', label: '🚚 Incoming Deliveries' },
    { to: '/ngo/verification-pending', label: '📑 Verification Status' },
    { to: '/ngo/impact', label: '📈 Impact Metrics' },
  ];

  return (
    <div>
      <Navbar />
      <div style={{ display: 'flex' }}>
        <Sidebar links={ngoLinks} />
        <main style={{ flex: 1, padding: '32px', backgroundColor: 'var(--paper)' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};
