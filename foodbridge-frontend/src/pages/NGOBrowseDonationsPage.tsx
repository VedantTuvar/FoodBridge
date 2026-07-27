import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { MapPin, Search } from 'lucide-react';
import { donationApi } from '../api/donationApi';
import { ngoApi } from '../api/ngoApi';
import { DonationCard } from '../components/organisms/DonationCard';
import { Skeleton } from '../components/atoms/Skeleton';
import { Input } from '../components/atoms/Input';
import { useToast } from '../context/ToastContext';
import { Donation } from '../types';

export const NGOBrowseDonationsPage = () => {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  const { data: donations, isLoading } = useQuery({
    queryKey: ['available-donations'],
    queryFn: async () => {
      const res = await donationApi.getDonations();
      return res.data.results || [];
    },
  });

  const claimMutation = useMutation({
    mutationFn: (donationId: string) => ngoApi.claimDonation(donationId),
    onSuccess: () => {
      addToast({
        type: 'success',
        title: 'Donation Claimed!',
        message: 'Volunteer task automatically dispatched for pickup.',
      });
      queryClient.invalidateQueries({ queryKey: ['available-donations'] });
    },
    onError: (err: any) => {
      addToast({
        type: 'error',
        title: 'Claim Failed',
        message: err.response?.data?.message || 'Unable to claim donation.',
      });
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
          NGO PORTAL
        </span>
        <h1 className="font-display text-3xl font-bold text-ink dark:text-paper">
          Browse & Claim Food
        </h1>
        <p className="text-sm text-ink-soft dark:text-paper-alt mt-1">
          Real-time surplus food listings available for claim by verified shelters.
        </p>
      </div>

      <div className="mb-6">
        <Input
          placeholder="Filter by food type or location..."
          className="max-w-md"
        />
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton variant="card" />
          <Skeleton variant="card" />
        </div>
      ) : donations?.length === 0 ? (
        <div className="bg-paper-alt dark:bg-night-soft border border-line rounded-sm p-12 text-center">
          <MapPin className="w-12 h-12 text-ink-soft mx-auto mb-3 opacity-60" />
          <h3 className="font-display text-lg font-semibold text-ink dark:text-paper mb-1">
            No Available Food Listings Nearby
          </h3>
          <p className="text-sm text-ink-soft dark:text-paper-alt max-w-md mx-auto">
            Check back shortly. As soon as a donor lists surplus food, nearby approved NGOs will receive an instant notification.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {donations?.map((d) => (
            <DonationCard
              key={d.id}
              donation={d}
              isNGO={true}
              onClaim={(id) => claimMutation.mutate(id)}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
};
