import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Save, Trash2, ArrowLeft } from 'lucide-react';
import { donationApi } from '../api/donationApi';
import { donorApi } from '../api/donorApi';
import { Input } from '../components/atoms/Input';
import { Button } from '../components/atoms/Button';
import { Skeleton } from '../components/atoms/Skeleton';
import { useToast } from '../context/ToastContext';

export const EditDonationPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [foodType, setFoodType] = useState('');
  const [quantity, setQuantity] = useState('');
  const [address, setAddress] = useState('');

  const { data: donation, isLoading } = useQuery({
    queryKey: ['edit-donation', id],
    queryFn: async () => {
      const res = await donationApi.getDonationById(id || '');
      return res.data;
    },
    enabled: !!id,
  });

  useEffect(() => {
    if (donation) {
      setFoodType(donation.food_type || '');
      setQuantity(String(donation.quantity_kg || ''));
      setAddress(donation.pickup_address || '');
    }
  }, [donation]);

  const updateMutation = useMutation({
    mutationFn: (data: any) => donorApi.updateDonation(id || '', data),
    onSuccess: () => {
      addToast({ type: 'success', title: 'Listing Updated!' });
      navigate('/donor/dashboard');
    },
    onError: (err: any) => {
      addToast({ type: 'error', title: 'Update Failed', message: err.response?.data?.message || 'Unable to update listing.' });
    },
  });

  const cancelMutation = useMutation({
    mutationFn: () => donationApi.cancelDonation(id || ''),
    onSuccess: () => {
      addToast({ type: 'amber', title: 'Listing Cancelled' });
      navigate('/donor/dashboard');
    },
  });

  if (isLoading) return <Skeleton variant="card" />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-2xl mx-auto"
    >
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 font-mono text-xs text-ink-soft hover:text-ink mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </button>

      <div className="bg-white dark:bg-night-soft border border-line rounded-sm p-8 shadow-sm">
        <h1 className="font-display text-2xl font-bold text-ink dark:text-paper mb-1">
          Edit Surplus Food Listing
        </h1>
        <p className="text-sm text-ink-soft dark:text-paper-alt mb-6">
          Modify active details before an NGO claims the listing.
        </p>

        <form onSubmit={(e) => { e.preventDefault(); updateMutation.mutate({ food_type: foodType, quantity_kg: Number(quantity), pickup_address: address }); }} className="space-y-4">
          <Input label="Food Description" value={foodType} onChange={(e) => setFoodType(e.target.value)} required />
          <Input label="Quantity (kg)" type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} required />
          <Input label="Pickup Address" value={address} onChange={(e) => setAddress(e.target.value)} required />

          <div className="pt-4 flex gap-4">
            <Button type="button" variant="danger" className="w-1/2" leftIcon={<Trash2 className="w-4 h-4" />} isLoading={cancelMutation.isPending} onClick={() => cancelMutation.mutate()}>
              Cancel Listing
            </Button>
            <Button type="submit" variant="primary" className="w-1/2" leftIcon={<Save className="w-4 h-4" />} isLoading={updateMutation.isPending}>
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};
