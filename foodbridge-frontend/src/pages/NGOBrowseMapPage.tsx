import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { donationApi } from '../api/donationApi';
import { DonationCard } from '../components/organisms/DonationCard';
import { Skeleton } from '../components/atoms/Skeleton';
import { LiveMap } from '../components/organisms/LiveMap';
import { Button } from '../components/atoms/Button';

export const NGOBrowseMapPage = () => {
  const [radiusKm, setRadiusKm] = useState(10);

  const { data: donations, isLoading } = useQuery({
    queryKey: ['map-donations', radiusKm],
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
      style={{ padding: '24px' }}
    >
      <div className="mb-6 flex flex-wrap justify-between items-end gap-4">
        <div>
          <span className="font-mono text-xs text-teal uppercase tracking-wider font-semibold">
            ⚡ GEOSPATIAL NEARBY DISCOVERY
          </span>
          <h1 className="font-display text-3xl font-bold text-ink dark:text-paper">
            Surplus Food Proximity Map
          </h1>
          <p className="text-sm text-ink-soft dark:text-paper-alt mt-1">
            Locate available food listings within your shelter's operational radius.
          </p>
        </div>

        {/* Nearby Radius Selector */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink-soft)' }}>Radius Zone:</span>
          {[1, 5, 10, 25].map((r) => (
            <Button
              key={r}
              size="small"
              variant={radiusKm === r ? 'primary' : 'outline'}
              onClick={() => setRadiusKm(r)}
            >
              {r} km
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interactive Live Map Canvas */}
        <div className="lg:col-span-2 bg-white dark:bg-night-soft border border-line rounded-sm p-4">
          <LiveMap
            pickupLocation={{ lat: 28.6139, lng: 77.2090, title: 'Central Bakery Surplus', address: 'Sector 4' }}
            deliveryLocation={{ lat: 28.6350, lng: 77.2250, title: 'Your NGO Shelter', address: 'Hub Address' }}
            radiusKm={radiusKm}
            height="460px"
          />
        </div>

        {/* Available Listings Sidebar */}
        <div className="lg:col-span-1 space-y-4 overflow-y-auto max-h-[500px]">
          <h3 className="font-mono text-xs uppercase tracking-wider font-semibold text-ink dark:text-paper">
            Listings Within {radiusKm} km ({donations?.length || 0})
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
