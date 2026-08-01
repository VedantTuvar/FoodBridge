import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/organisms/Navbar';
import { Sidebar } from '../components/organisms/Sidebar';

export const AdminLayout = () => {
  const adminLinks = [
    { to: '/admin/dashboard', label: '🎛 Dashboard Overview' },
    { to: '/admin/ngo-verification', label: '🏢 NGO Verification' },
    { to: '/admin/donor-verification', label: '🏬 Donor Verification' },
    { to: '/admin/volunteers', label: '🛵 Volunteer Management' },
    { to: '/admin/analytics', label: '📊 Analytics & Charts' },
    { to: '/admin/reports', label: '📄 Reports Generator' },
    { to: '/admin/disputes', label: '⚠️ Dispute Resolution' },
    { to: '/admin/complaints', label: '🚨 Complaints Log' },
    { to: '/admin/users', label: '👥 User Management' },
    { to: '/admin/roles', label: '🛡 Role Management' },
    { to: '/admin/settings', label: '⚙️ System Settings' },
    { to: '/admin/emergency', label: '📢 Emergency Mode' },
    { to: '/admin/logs', label: '📜 Logs & Audit Logs' },
    { to: '/admin/permissions', label: '🔐 Permissions Matrix' },
    { to: '/admin/monitoring', label: '🖥 Platform Monitoring' },
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <div style={{ display: 'flex', flex: 1 }}>
        <Sidebar links={adminLinks} />
        <main style={{ flex: 1, padding: '32px', backgroundColor: 'var(--paper)', minWidth: 0 }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};
