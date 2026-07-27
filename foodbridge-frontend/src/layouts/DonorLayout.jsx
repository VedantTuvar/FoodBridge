import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/organisms/Navbar';
import { Sidebar } from '../components/organisms/Sidebar';

export const DonorLayout = () => {
  const donorLinks = [
    { to: '/donor/dashboard', label: '📊 Dashboard' },
    { to: '/donor/donations/new', label: '➕ New Donation' },
    { to: '/donor/history', label: '📜 History' },
    { to: '/donor/impact', label: '🌱 Impact Stats' },
  ];

  return (
    <div>
      <Navbar />
      <div style={{ display: 'flex' }}>
        <Sidebar links={donorLinks} />
        <main style={{ flex: 1, padding: '32px', backgroundColor: 'var(--paper)' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};
