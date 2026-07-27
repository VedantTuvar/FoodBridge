import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Plus, Trash2, Calendar, Clock } from 'lucide-react';
import { donorApi } from '../api/donorApi';
import { Button } from '../components/atoms/Button';
import { Input } from '../components/atoms/Input';
import { Modal } from '../components/molecules/Modal';
import { Skeleton } from '../components/atoms/Skeleton';
import { useToast } from '../context/ToastContext';

export const RecurringDonationsPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [foodType, setFoodType] = useState('');
  const [quantity, setQuantity] = useState('15');
  const [frequency, setFrequency] = useState('daily');
  const [timeOfDay, setTimeOfDay] = useState('20:00');
  const [address, setAddress] = useState('100 Main St, Bakery Kitchen');

  const queryClient = useQueryClient();
  const { addToast } = useToast();

  const { data: schedules, isLoading } = useQuery({
    queryKey: ['recurring-schedules'],
    queryFn: async () => {
      const res = await donorApi.getRecurringSchedules();
      return res.data.results || [];
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => donorApi.createRecurringSchedule(data),
    onSuccess: () => {
      addToast({ type: 'success', title: 'Schedule Created!', message: 'Automated recurring listings enabled.' });
      queryClient.invalidateQueries({ queryKey: ['recurring-schedules'] });
      setIsModalOpen(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => donorApi.deleteRecurringSchedule(id),
    onSuccess: () => {
      addToast({ type: 'amber', title: 'Schedule Deleted' });
      queryClient.invalidateQueries({ queryKey: ['recurring-schedules'] });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({
      food_type: foodType,
      quantity_kg: Number(quantity),
      frequency,
      time_of_day: timeOfDay,
      pickup_address: address,
      latitude: 37.7749,
      longitude: -122.4194,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between items-center mb-6">
        <div>
          <span className="font-mono text-xs text-amber-deep uppercase tracking-wider font-semibold">
            AUTOMATION ENGINE
          </span>
          <h1 className="font-display text-3xl font-bold text-ink dark:text-paper">
            Recurring Surplus Schedules
          </h1>
          <p className="text-sm text-ink-soft dark:text-paper-alt mt-1">
            Automate daily or weekly surplus listings (e.g. nightly bakery leftovers).
          </p>
        </div>

        <Button variant="amber" leftIcon={<Plus className="w-4 h-4" />} onClick={() => setIsModalOpen(true)}>
          New Recurring Schedule
        </Button>
      </div>

      {isLoading ? (
        <Skeleton variant="card" />
      ) : schedules?.length === 0 ? (
        <div className="bg-paper-alt dark:bg-night-soft border border-line rounded-sm p-12 text-center">
          <Calendar className="w-12 h-12 text-ink-soft mx-auto mb-3 opacity-60" />
          <h3 className="font-display text-lg font-semibold text-ink dark:text-paper mb-1">
            No Recurring Schedules Configured
          </h3>
          <p className="text-sm text-ink-soft dark:text-paper-alt max-w-md mx-auto mb-4">
            Instead of manually creating a listing every day, create an automated schedule to list surplus food automatically.
          </p>
          <Button variant="primary" onClick={() => setIsModalOpen(true)}>
            Set Up First Schedule
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {schedules.map((sch: any) => (
            <div key={sch.id} className="bg-white dark:bg-night-soft border border-line rounded-sm p-6">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className="font-mono text-xs text-teal font-semibold uppercase">
                    {sch.frequency} at {sch.time_of_day}
                  </span>
                  <h3 className="font-display text-xl font-semibold text-ink dark:text-paper">
                    {sch.food_type}
                  </h3>
                </div>
                <button
                  onClick={() => deleteMutation.mutate(sch.id)}
                  className="text-ink-soft hover:text-red-soft p-1 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <p className="font-mono text-xs text-ink-soft mb-2">
                📦 {sch.quantity_kg} kg per batch | 📍 {sch.pickup_address}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Modal Dialog for New Schedule */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create Recurring Surplus Schedule">
        <form onSubmit={handleSubmit} className="space-y-3">
          <Input label="Food Type / Description" placeholder="e.g. Nightly Bakery Bread" value={foodType} onChange={(e) => setFoodType(e.target.value)} required />
          <Input label="Batch Quantity (kg)" type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} required />
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-mono text-xs uppercase text-ink-soft block mb-1">Frequency</label>
              <select value={frequency} onChange={(e) => setFrequency(e.target.value)} className="w-full p-2.5 bg-white border border-line rounded-sm text-sm">
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
              </select>
            </div>
            <Input label="Time of Day" type="time" value={timeOfDay} onChange={(e) => setTimeOfDay(e.target.value)} required />
          </div>

          <Input label="Pickup Location Address" value={address} onChange={(e) => setAddress(e.target.value)} required />

          <Button type="submit" variant="amber" className="w-full mt-4" isLoading={createMutation.isPending}>
            Save Recurring Schedule
          </Button>
        </form>
      </Modal>
    </motion.div>
  );
};
