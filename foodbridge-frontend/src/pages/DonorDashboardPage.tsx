import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Plus, Package, HeartHandshake, Leaf } from 'lucide-react';
import { Link } from 'react-router-dom';
import { donationApi } from '../api/donationApi';
import { StatCard } from '../components/molecules/StatCard';
import { DonationCard } from '../components/organisms/DonationCard';
import { Button } from '../components/atoms/Button';
import { Skeleton } from '../components/atoms/Skeleton';
import { Donation } from '../types';

export const DonorDashboardPage = () => {
  const { data: donations, isLoading } = useQuery({
    queryKey: ['donor-donations'],
    queryFn: async () => {
      const res = await donationApi.getDonations();
      return res.data.results || [];
    },
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <span className="font-mono text-xs text-amber-deep dark:text-amber uppercase tracking-wider font-semibold">
            DONOR PORTAL
          </span>
          <h1 className="font-display text-3xl font-bold text-ink dark:text-paper">
            Surplus Overview
          </h1>
        </div>

        <Link to="/donor/donations/new">
          <Button variant="amber" size="md" leftIcon={<Plus className="w-4 h-4" />}>
            Create Food Listing
          </Button>
        </Link>
      </div>

      {/* Impact Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard label="Total Food Saved" value="142.5" unit="kg" />
        <StatCard label="Meals Provided" value="407" unit="meals" />
        <StatCard label="CO₂ Avoided" value="356.2" unit="kg" />
      </div>

      <div className="mb-4 flex justify-between items-center">
        <h2 className="font-display text-xl font-semibold text-ink dark:text-paper">
          Active Surplus Listings
        </h2>
        <span className="font-mono text-xs text-ink-soft dark:text-paper-alt">
          Showing {donations?.length || 0} items
        </span>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton variant="card" />
          <Skeleton variant="card" />
        </div>
      ) : donations?.length === 0 ? (
        <div className="bg-paper-alt dark:bg-night-soft border border-line rounded-sm p-12 text-center">
          <Package className="w-12 h-12 text-ink-soft mx-auto mb-3 opacity-60" />
          <h3 className="font-display text-lg font-semibold text-ink dark:text-paper mb-1">
            No Active Food Listings
          </h3>
          <p className="text-sm text-ink-soft dark:text-paper-alt mb-4 max-w-md mx-auto">
            You haven't listed any surplus food yet. Create a listing to instantly notify nearby verified shelters.
          </p>
          <Link to="/donor/donations/new">
            <Button variant="primary" size="md">
              Create Your First Listing
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {donations?.map((donation) => (
            <DonationCard key={donation.id} donation={donation} />
          ))}
        </div>
      )}
    </motion.div>
  );
};
