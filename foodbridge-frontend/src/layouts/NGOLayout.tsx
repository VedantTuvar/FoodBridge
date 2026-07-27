import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/organisms/Navbar';
import { Sidebar } from '../components/organisms/Sidebar';
import { Search, Map, ShieldCheck, History, HeartHandshake, BarChart2, Star, Settings } from 'lucide-react';

export const NGOLayout = () => {
  const ngoLinks = [
    { to: '/ngo/browse', label: '🍲 Browse & Claim Surplus', icon: <Search className="w-4 h-4 text-amber" /> },
    { to: '/ngo/map', label: '🗺️ Proximity Map', icon: <Map className="w-4 h-4" /> },
    { to: '/ngo/verification', label: '🛡️ Verification Audit', icon: <ShieldCheck className="w-4 h-4 text-teal" /> },
    { to: '/ngo/history', label: '📜 Claimed History', icon: <History className="w-4 h-4" /> },
    { to: '/ngo/food-requests', label: '🤝 Beneficiary Requests', icon: <HeartHandshake className="w-4 h-4" /> },
    { to: '/ngo/analytics', label: '📊 Impact Analytics', icon: <BarChart2 className="w-4 h-4" /> },
    { to: '/ngo/ratings', label: '⭐ Rate Deliveries', icon: <Star className="w-4 h-4" /> },
    { to: '/ngo/settings', label: '⚙️ Shelter Settings', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-paper dark:bg-night flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar links={ngoLinks} />
        <main className="flex-1 p-6 md:p-8 max-w-7xl">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
