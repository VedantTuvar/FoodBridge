import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Package, MapPin, Clock, ArrowLeft } from 'lucide-react';
import { donationApi } from '../api/donationApi';
import { Input } from '../components/atoms/Input';
import { Button } from '../components/atoms/Button';
import { Callout } from '../components/molecules/Callout';
import { useToast } from '../context/ToastContext';

const createDonationSchema = z.object({
  food_type: z.string().min(2, { message: 'Food type is required (e.g. Rice, Bread, Curries)' }),
  quantity_kg: z.coerce.number().positive({ message: 'Quantity must be a positive number' }),
  perishability_hours: z.coerce.number().min(1, { message: 'Expiry window must be at least 1 hour' }),
  pickup_address: z.string().min(5, { message: 'Pickup address is required' }),
  latitude: z.coerce.number().default(37.7749),
  longitude: z.coerce.number().default(-122.4194),
});

type CreateDonationInputs = z.infer<typeof createDonationSchema>;

export const CreateDonationPage: React.FC = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateDonationInputs>({
    resolver: zodResolver(createDonationSchema),
    defaultValues: {
      quantity_kg: 10,
      perishability_hours: 4,
      latitude: 37.7749,
      longitude: -122.4194,
    },
  });

  const onSubmit = async (data: CreateDonationInputs) => {
    try {
      const perishability_window = new Date(Date.now() + data.perishability_hours * 3600 * 1000).toISOString();

      await donationApi.createDonation({
        food_type: data.food_type,
        quantity_kg: data.quantity_kg,
        perishability_window: perishability_window,
        pickup_address: data.pickup_address,
        latitude: data.latitude,
        longitude: data.longitude,
      });

      addToast({
        type: 'success',
        title: 'Donation Listed Successfully!',
        message: 'Nearby verified NGOs have been notified.',
      });

      navigate('/donor/dashboard');
    } catch (err: any) {
      addToast({
        type: 'error',
        title: 'Failed to Create Listing',
        message: err.response?.data?.message || 'Check form inputs and try again.',
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-2xl mx-auto"
    >
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 font-mono text-xs text-ink-soft hover:text-ink dark:text-paper-alt dark:hover:text-paper mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </button>

      <div className="bg-white dark:bg-night-soft border border-line rounded-sm p-8 shadow-sm">
        <h1 className="font-display text-2xl font-bold text-ink dark:text-paper mb-1">
          List Surplus Food
        </h1>
        <p className="text-sm text-ink-soft dark:text-paper-alt mb-6">
          Listing takes under 60 seconds. Nearby verified shelters will receive an alert to claim.
        </p>

        <Callout type="amber" title="Food Safety Notice">
          Ensure food is freshly prepared or properly refrigerated before listing. FoodBridge requires hygiene compliance.
        </Callout>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Food Description / Type"
            placeholder="e.g. Wedding Banquet Rice, Vegetable Curry, Breads"
            {...register('food_type')}
            error={errors.food_type?.message}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Quantity (in kg)"
              type="number"
              step="0.5"
              placeholder="10.0"
              {...register('quantity_kg')}
              error={errors.quantity_kg?.message}
            />

            <Input
              label="Expiry Window (Hours from now)"
              type="number"
              placeholder="4"
              {...register('perishability_hours')}
              error={errors.perishability_hours?.message}
            />
          </div>

          <Input
            label="Pickup Address"
            placeholder="e.g. 100 Market St, Hotel Loading Dock #2"
            {...register('pickup_address')}
            error={errors.pickup_address?.message}
          />

          <div className="pt-4 flex gap-4">
            <Button
              type="button"
              variant="secondary"
              className="w-1/2"
              onClick={() => navigate(-1)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="w-1/2"
              isLoading={isSubmitting}
            >
              Submit Food Listing
            </Button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};
