import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { MapPin, Navigation } from 'lucide-react';
import { donationApi } from '../api/donationApi';
import { DonationCard } from '../components/organisms/DonationCard';
import { Skeleton } from '../components/atoms/Skeleton';
import { Donation } from '../types';

export const NGOBrowseMapPage: React.FC = () => {
  const { data: donations, isLoading } = useQuery({
    queryKey: ['map-donations'],
    queryFn: async () => {
      const res = await donationApi.getDonations();
      return (res.data.results || []) as Donation[];
    },
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mb-6">
        <span className="font-mono text-xs text-teal uppercase tracking-wider font-semibold">
          GEOSPATIAL DISCOVERY
        </span>
        <h1 className="font-display text-3xl font-bold text-ink dark:text-paper">
          Surplus Food Proximity Map
        </h1>
        <p className="text-sm text-ink-soft dark:text-paper-alt mt-1">
          Locate available food listings within your shelter's operational radius.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Canvas Visual Placeholder */}
        <div className="lg:col-span-2 bg-paper-alt dark:bg-night-soft border border-line rounded-sm h-[500px] relative flex flex-col items-center justify-center p-6 text-center">
          <Navigation className="w-12 h-12 text-teal mb-3 animate-pulse" />
          <h3 className="font-display text-lg font-semibold text-ink dark:text-paper">
            Interactive PostGIS Spatial Map
          </h3>
          <p className="text-xs text-ink-soft max-w-sm mt-1">
            Displaying real-time geo-located food listings within 10 km radius of your shelter address.
          </p>
        </div>

        {/* Available Listings Sidebar */}
        <div className="lg:col-span-1 space-y-4 overflow-y-auto max-h-[500px]">
          <h3 className="font-mono text-xs uppercase tracking-wider font-semibold text-ink dark:text-paper">
            Nearby Available Listings ({donations?.length || 0})
          </h3>
          {isLoading ? (
            <Skeleton variant="card" />
          ) : (
            donations?.map((d) => <DonationCard key={d.id} donation={d} isNGO={true} />)
          )}
        </div>
      </div>
    </motion.div>
  );
};
