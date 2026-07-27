import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/organisms/Navbar';
import { Sidebar } from '../components/organisms/Sidebar';

export const CorporateLayout = () => {
  const corporateLinks = [
    { to: '/corporate/dashboard', label: '📊 CSR Overview' },
    { to: '/corporate/branches', label: '🏢 Branch Donors' },
    { to: '/corporate/reports', label: '📈 ESG Compliance Reports' },
  ];

  return (
    <div>
      <Navbar />
      <div style={{ display: 'flex' }}>
        <Sidebar links={corporateLinks} />
        <main style={{ flex: 1, padding: '32px', backgroundColor: 'var(--paper)' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};
