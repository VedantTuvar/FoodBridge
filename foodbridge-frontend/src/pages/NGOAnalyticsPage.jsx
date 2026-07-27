import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Download, PieChart, Users, Heart } from 'lucide-react';
import { ngoApi } from '../api/ngoApi';
import { StatCard } from '../components/molecules/StatCard';
import { Button } from '../components/atoms/Button';
import { Callout } from '../components/molecules/Callout';

export const NGOAnalyticsPage: React.FC = () => {
  const { data: stats } = useQuery({
    queryKey: ['ngo-analytics'],
    queryFn: async () => {
      const res = await ngoApi.getAnalytics();
      return res.data;
    },
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <span className="font-mono text-xs text-teal uppercase tracking-wider font-semibold">
            SHELTER METRICS
          </span>
          <h1 className="font-display text-3xl font-bold text-ink dark:text-paper">
            Beneficiary Impact & Feed Analytics
          </h1>
          <p className="text-sm text-ink-soft dark:text-paper-alt mt-1">
            Real-time tracking of meals received, beneficiary capacity, and shelter efficiency.
          </p>
        </div>

        <Button variant="secondary" leftIcon={<Download className="w-4 h-4 text-teal" />} onClick={() => window.print()}>
          Export Audit Report (PDF)
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard label="Total Claims Processed" value={stats?.total_claims || 0} unit="donations" />
        <StatCard label="Total Meals Distributed" value={stats?.total_meals_received || 0} unit="meals" />
        <StatCard label="Total Weight Diverted" value={stats?.total_kg_received || 0} unit="kg" />
      </div>

      <Callout type="teal" title="Daily Shelter Capacity Utilization">
        Your current shelter capacity is rated at <strong>{stats?.capacity_per_day || 100} meals/day</strong>. Average beneficiary rating: <strong>★ {stats?.rating_avg || 5.0}</strong>.
      </Callout>
    </motion.div>
  );
};
