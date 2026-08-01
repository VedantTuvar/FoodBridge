import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { donationApi } from '../api/donationApi';
import { StatusTrackerTimeline } from '../components/organisms/StatusTrackerTimeline';
import { Badge } from '../components/atoms/Badge';
import { Callout } from '../components/molecules/Callout';
import { Skeleton } from '../components/atoms/Skeleton';
import { useWebSocket } from '../hooks/useWebSocket';
import { useLiveStatusSocket } from '../hooks/useLiveStatusSocket';
import { LiveMap } from '../components/organisms/LiveMap';
import { InAppChat } from '../components/organisms/InAppChat';

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
  const { liveStatus } = useLiveStatusSocket(id || '');

  if (isLoading) return <Skeleton variant="card" />;
  if (!donation) return <div style={{ padding: '24px' }}>Donation listing not found.</div>;

  const currentStatus = liveStatus || donation.status || 'listed';

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-4xl mx-auto"
      style={{ padding: '24px' }}
    >
      <div className="flex justify-between items-start mb-6">
        <div>
          <span className="font-mono text-xs text-amber-deep uppercase tracking-wider font-semibold">
            ⚡ INSTANT REAL-TIME TRACKING & CHAT
          </span>
          <h1 className="font-display text-3xl font-bold text-ink dark:text-paper">
            {donation.food_type}
          </h1>
          <p className="text-sm text-ink-soft dark:text-paper-alt">
            Donation Listing #{donation.id || id}
          </p>
        </div>
        <Badge status={currentStatus} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="md:col-span-1 bg-white dark:bg-night-soft border border-line rounded-sm p-6">
          <h3 className="font-mono text-xs uppercase tracking-wider font-semibold text-ink dark:text-paper mb-4">
            Lifecycle Progress
          </h3>
          <StatusTrackerTimeline currentStatus={currentStatus} />
        </div>

        <div className="md:col-span-2 space-y-6">
          <div className="bg-white dark:bg-night-soft border border-line rounded-sm p-6">
            <h3 className="font-mono text-xs uppercase tracking-wider font-semibold text-ink dark:text-paper mb-4">
              Interactive Live GPS Map
            </h3>

            {coordinates ? (
              <Callout type="teal" title="Volunteer Live Driver Telemetry Connected">
                Latitude: {coordinates.latitude}, Longitude: {coordinates.longitude} | Speed: {coordinates.speed} km/h | ETA: {coordinates.etaMinutes} mins
              </Callout>
            ) : (
              <Callout type="amber" title="Driver Active in Radius Zone">
                Live location socket is syncing driver telemetry coordinates in real time.
              </Callout>
            )}

            <div style={{ marginTop: '16px' }}>
              <LiveMap
                pickupLocation={{ lat: 28.6139, lng: 77.2090, title: 'Donation Pickup', address: donation.pickup_address }}
                deliveryLocation={{ lat: 28.6350, lng: 77.2250, title: 'Verified NGO Shelter', address: 'Hope Sanctuary' }}
                driverLocation={coordinates ? {
                  lat: coordinates.latitude,
                  lng: coordinates.longitude,
                  speed: coordinates.speed,
                  etaMinutes: coordinates.etaMinutes
                } : null}
                height="320px"
              />
            </div>
          </div>

          {/* Real-time Coordination In-App Chat */}
          <InAppChat
            roomId={id || 'task-891'}
            roomTitle={`Mission Chat (Listing #${id?.substring(0, 6) || '891'})`}
          />
        </div>
      </div>
    </motion.div>
  );
};
