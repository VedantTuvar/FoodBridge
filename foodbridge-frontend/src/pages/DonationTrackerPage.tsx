import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { MapPin, Navigation } from 'lucide-react';
import { donationApi } from '../api/donationApi';
import { StatusTrackerTimeline } from '../components/organisms/StatusTrackerTimeline';
import { Badge } from '../components/atoms/Badge';
import { Callout } from '../components/molecules/Callout';
import { Skeleton } from '../components/atoms/Skeleton';
import { useWebSocket } from '../hooks/useWebSocket';

export const DonationTrackerPage = () => {
  const { id } = useParams();

  const { data: donation, isLoading } = useQuery({
    queryKey: ['donation-detail', id],
    queryFn: async () => {
      const res = await donationApi.getDonationById(id || '');
      return res.data;
    },
    enabled: !!id,
  });

  const { coordinates } = useWebSocket(id || '');

  if (isLoading) return <Skeleton variant="card" />;
  if (!donation) return <div>Donation not found.</div>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-4xl mx-auto"
    >
      <div className="flex justify-between items-start mb-6">
        <div>
          <span className="font-mono text-xs text-amber-deep uppercase tracking-wider font-semibold">
            REAL-TIME TRACKING
          </span>
          <h1 className="font-display text-3xl font-bold text-ink dark:text-paper">
            {donation.food_type}
          </h1>
          <p className="text-sm text-ink-soft dark:text-paper-alt">
            Donation ID #{donation.id}
          </p>
        </div>
        <Badge status={donation.status} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="md:col-span-1 bg-white dark:bg-night-soft border border-line rounded-sm p-6">
          <h3 className="font-mono text-xs uppercase tracking-wider font-semibold text-ink dark:text-paper mb-4">
            Lifecycle Progress
          </h3>
          <StatusTrackerTimeline currentStatus={donation.status} />
        </div>

        <div className="md:col-span-2 bg-white dark:bg-night-soft border border-line rounded-sm p-6">
          <h3 className="font-mono text-xs uppercase tracking-wider font-semibold text-ink dark:text-paper mb-4">
            Live Delivery Tracking Map
          </h3>

          {coordinates ? (
            <Callout type="teal" title="Volunteer Live GPS Coordinates Received">
              Latitude: {coordinates.latitude}, Longitude: {coordinates.longitude} | Speed: {coordinates.speed} km/h | ETA: {coordinates.etaMinutes} mins
            </Callout>
          ) : (
            <Callout type="amber" title="Awaiting Volunteer Driver">
              Map tracking will activate automatically when a volunteer picks up the food item.
            </Callout>
          )}

          {/* Map Visual Placeholder container */}
          <div className="w-full h-64 bg-paper-alt dark:bg-night rounded-sm border border-line flex flex-col items-center justify-center p-6 text-center">
            <Navigation className="w-10 h-10 text-teal mb-2 animate-bounce" />
            <span className="font-mono text-xs text-ink-soft">
              📍 Pickup: {donation.pickup_address}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
