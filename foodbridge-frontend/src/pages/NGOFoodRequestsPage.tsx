import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Plus, Trash2, HeartHandshake, AlertTriangle } from 'lucide-react';
import { ngoApi } from '../api/ngoApi';
import { Button } from '../components/atoms/Button';
import { Input } from '../components/atoms/Input';
import { Modal } from '../components/molecules/Modal';
import { Skeleton } from '../components/atoms/Skeleton';
import { useToast } from '../context/ToastContext';

export const NGOFoodRequestsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Cooked Meals');
  const [meals, setMeals] = useState('100');
  const [urgency, setUrgency] = useState('high');
  const [address, setAddress] = useState('Hope Community Shelter, 400 5th St');

  const queryClient = useQueryClient();
  const { addToast } = useToast();

  const { data: requests, isLoading } = useQuery({
    queryKey: ['ngo-food-requests'],
    queryFn: async () => {
      const res = await ngoApi.getFoodRequests();
      return res.data.results || [];
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => ngoApi.createFoodRequest(data),
    onSuccess: () => {
      addToast({ type: 'success', title: 'Food Request Broadcasted!', message: 'Nearby donors alerted of your demand.' });
      queryClient.invalidateQueries({ queryKey: ['ngo-food-requests'] });
      setIsModalOpen(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => ngoApi.deleteFoodRequest(id),
    onSuccess: () => {
      addToast({ type: 'amber', title: 'Request Removed' });
      queryClient.invalidateQueries({ queryKey: ['ngo-food-requests'] });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({
      title,
      food_category: category,
      quantity_meals_needed: Number(meals),
      urgency_level: urgency,
      address,
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
            BENEFICIARY DEMAND
          </span>
          <h1 className="font-display text-3xl font-bold text-ink dark:text-paper">
            Beneficiary Food Requests
          </h1>
          <p className="text-sm text-ink-soft dark:text-paper-alt mt-1">
            Broadcast urgent meal demands directly to commercial food donors in your area.
          </p>
        </div>

        <Button variant="amber" leftIcon={<Plus className="w-4 h-4" />} onClick={() => setIsModalOpen(true)}>
          Broadcast Food Request
        </Button>
      </div>

      {isLoading ? (
        <Skeleton variant="card" />
      ) : requests?.length === 0 ? (
        <div className="bg-paper-alt dark:bg-night-soft border border-line rounded-sm p-12 text-center">
          <HeartHandshake className="w-12 h-12 text-ink-soft mx-auto mb-3 opacity-60" />
          <h3 className="font-display text-lg font-semibold text-ink dark:text-paper mb-1">
            No Active Food Demand Requests
          </h3>
          <p className="text-sm text-ink-soft dark:text-paper-alt max-w-md mx-auto mb-4">
            If your shelter is experiencing a surge in beneficiaries, broadcast a food demand request to alert nearby donors.
          </p>
          <Button variant="primary" onClick={() => setIsModalOpen(true)}>
            Post Demand Request
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {requests.map((req: any) => (
            <div key={req.id} className="bg-white dark:bg-night-soft border border-line rounded-sm p-6">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className="font-mono text-xs text-amber font-semibold uppercase">
                    Urgency: {req.urgency_level}
                  </span>
                  <h3 className="font-display text-xl font-semibold text-ink dark:text-paper">
                    {req.title}
                  </h3>
                </div>
                <button
                  onClick={() => deleteMutation.mutate(req.id)}
                  className="text-ink-soft hover:text-red-soft p-1 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <p className="font-mono text-xs text-ink-soft">
                🍱 Needs {req.quantity_meals_needed} meals ({req.food_category}) | 📍 {req.address}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Modal Dialog */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Broadcast Beneficiary Food Request">
        <form onSubmit={handleSubmit} className="space-y-3">
          <Input label="Request Title" placeholder="e.g. 150 Lunch Meals Needed for Shelter" value={title} onChange={(e) => setTitle(e.target.value)} required />
          
          <div className="grid grid-cols-2 gap-3">
            <Input label="Meals Needed" type="number" value={meals} onChange={(e) => setMeals(e.target.value)} required />
            <div>
              <label className="font-mono text-xs uppercase text-ink-soft block mb-1">Urgency</label>
              <select value={urgency} onChange={(e) => setUrgency(e.target.value)} className="w-full p-2.5 bg-white border border-line rounded-sm text-sm">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical / Urgent</option>
              </select>
            </div>
          </div>

          <Input label="Delivery Location Address" value={address} onChange={(e) => setAddress(e.target.value)} required />

          <Button type="submit" variant="amber" className="w-full mt-4" isLoading={createMutation.isPending}>
            Broadcast Request
          </Button>
        </form>
      </Modal>
    </motion.div>
  );
};
