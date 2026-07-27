import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/organisms/Navbar';
import { Sidebar } from '../components/organisms/Sidebar';
import { Package, PlusCircle, History, RefreshCw, BarChart2, Settings } from 'lucide-react';

export const DonorLayout = () => {
  const donorLinks = [
    { to: '/donor/dashboard', label: '📊 Dashboard', icon: <Package className="w-4 h-4" /> },
    { to: '/donor/donations/new', label: '➕ List Surplus Food', icon: <PlusCircle className="w-4 h-4 text-amber" /> },
    { to: '/donor/history', label: '📜 Donation History', icon: <History className="w-4 h-4" /> },
    { to: '/donor/recurring', label: '🔄 Recurring Schedules', icon: <RefreshCw className="w-4 h-4" /> },
    { to: '/donor/impact', label: '🌱 Impact & ESG', icon: <BarChart2 className="w-4 h-4" /> },
    { to: '/donor/settings', label: '⚙️ Donor Settings', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-paper dark:bg-night flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar links={donorLinks} />
        <main className="flex-1 p-6 md:p-8 max-w-7xl">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
