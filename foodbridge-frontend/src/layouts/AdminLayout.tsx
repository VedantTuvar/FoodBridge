import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/organisms/Navbar';
import { Sidebar } from '../components/organisms/Sidebar';

export const AdminLayout = () => {
  const adminLinks = [
    { to: '/admin/dashboard', label: '🎛 System Overview' },
    { to: '/admin/verifications', label: '✅ NGO Verification Queue' },
    { to: '/admin/disputes', label: '⚠️ Dispute Resolution' },
    { to: '/admin/analytics', label: '📊 Platform Analytics' },
    { to: '/admin/emergency', label: '🚨 Emergency Mode' },
  ];

  return (
    <div>
      <Navbar />
      <div style={{ display: 'flex' }}>
        <Sidebar links={adminLinks} />
        <main style={{ flex: 1, padding: '32px', backgroundColor: 'var(--paper)' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};
