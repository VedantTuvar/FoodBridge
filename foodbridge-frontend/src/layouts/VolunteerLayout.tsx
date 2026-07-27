import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/organisms/Navbar';
import { Sidebar } from '../components/organisms/Sidebar';

export const VolunteerLayout = () => {
  const volunteerLinks = [
    { to: '/volunteer/dashboard', label: '📊 Volunteer Dashboard' },
    { to: '/volunteer/tasks/nearby', label: '🛵 Available Tasks' },
    { to: '/volunteer/tracking', label: '📍 Live Tracking & Navigation' },
    { to: '/volunteer/history', label: '📜 Delivery History' },
    { to: '/volunteer/badges', label: '🏅 Badges & Impact Certificate' },
    { to: '/volunteer/leaderboard', label: '🏆 Volunteer Leaderboard' },
    { to: '/volunteer/ratings', label: '⭐ Ratings & Reviews' },
    { to: '/volunteer/notifications', label: '🔔 Alerts & Notifications' },
  ];

  return (
    <div>
      <Navbar />
      <div style={{ display: 'flex' }}>
        <Sidebar links={volunteerLinks} />
        <main style={{ flex: 1, padding: '32px', backgroundColor: 'var(--paper)', minHeight: 'calc(100vh - 64px)' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

