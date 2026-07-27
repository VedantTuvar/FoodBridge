import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/organisms/Navbar';
import { Sidebar } from '../components/organisms/Sidebar';

export const VolunteerLayout = () => {
  const volunteerLinks = [
    { to: '/volunteer/tasks/nearby', label: '🛵 Available Tasks' },
    { to: '/volunteer/history', label: '📜 Delivery History' },
    { to: '/volunteer/badges', label: '🏅 Badges & Recognition' },
  ];

  return (
    <div>
      <Navbar />
      <div style={{ display: 'flex' }}>
        <Sidebar links={volunteerLinks} />
        <main style={{ flex: 1, padding: '32px', backgroundColor: 'var(--paper)' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};
