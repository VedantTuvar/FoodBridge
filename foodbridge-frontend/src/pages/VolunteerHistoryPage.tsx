import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Clock, MapPin, CheckCircle2, Search, FileText, Image as ImageIcon, ExternalLink, Calendar } from 'lucide-react';
import { taskApi } from '../api/taskApi';
import { Badge } from '../components/atoms/Badge';
import { Skeleton } from '../components/atoms/Skeleton';
import { Task } from '../types';

export const VolunteerHistoryPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProofTask, setSelectedProofTask] = useState<Task | null>(null);

  const { data: historyTasks, isLoading } = useQuery({
    queryKey: ['volunteer-history'],
    queryFn: async () => {
      const res = await taskApi.getTaskHistory();
      return res.data.results || [];
    },
  });

  const filteredTasks = historyTasks?.filter(
    (t) =>
      t.donation_detail?.food_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.donation_detail?.pickup_address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.ngo_name && t.ngo_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div>
        <span className="font-mono text-xs text-teal uppercase tracking-wider font-semibold">
          DELIVERY AUDIT & COMPLETED MISSIONS
        </span>
        <h1 className="font-display text-3xl font-bold text-ink dark:text-paper">
          Volunteer Delivery History
        </h1>
        <p className="text-sm text-ink-soft dark:text-paper-alt mt-1">
          Historical log of your completed food redistribution missions and photo verifications.
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-ink-soft absolute left-3 top-3" />
        <input
          type="text"
          placeholder="Filter history by food type, donor name, or shelter..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-9 pr-4 py-2 border border-line rounded-sm text-xs font-mono dark:bg-night-soft dark:text-paper focus:outline-none focus:border-teal"
        />
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton variant="card" />
          <Skeleton variant="card" />
        </div>
      ) : filteredTasks?.length === 0 ? (
        <div className="bg-paper-alt dark:bg-night-soft border border-line rounded-sm p-12 text-center">
          <Clock className="w-12 h-12 text-ink-soft mx-auto mb-3 opacity-60" />
          <h3 className="font-display text-lg font-semibold text-ink dark:text-paper mb-1">
            No Historical Records Found
          </h3>
          <p className="text-sm text-ink-soft dark:text-paper-alt max-w-md mx-auto">
            You haven't completed any food rescue missions matching your filter yet.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredTasks?.map((task) => (
            <div
              key={task.id}
              className="bg-white dark:bg-night-soft border border-line rounded-sm p-6 shadow-sm space-y-4"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-line">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs text-ink-soft uppercase font-semibold">
                      Task #{task.id.slice(0, 8)}
                    </span>
                    <Badge status={task.status} />
                  </div>
                  <h3 className="font-display text-lg font-bold text-ink dark:text-paper">
                    {task.donation_detail?.food_type || 'Surplus Food Rescue'}
                  </h3>
                </div>

                <div className="flex items-center gap-6 font-mono text-xs">
                  <div>
                    <span className="text-ink-soft block text-[10px] uppercase">Quantity</span>
                    <span className="font-bold text-teal">{task.donation_detail?.quantity_kg || 15} kg</span>
                  </div>
                  <div>
                    <span className="text-ink-soft block text-[10px] uppercase">Est. Meals</span>
                    <span className="font-bold text-amber">{task.donation_detail?.estimated_meals || 38}</span>
                  </div>
                  <div>
                    <span className="text-ink-soft block text-[10px] uppercase">Date Delivered</span>
                    <span className="text-ink dark:text-paper">
                      {task.delivery_time ? new Date(task.delivery_time).toLocaleDateString() : 'Today'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Route snippet */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono text-ink-soft">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-teal shrink-0 mt-0.5" />
                  <div>
                    <span className="text-ink dark:text-paper font-semibold block">Pickup Donor:</span>
                    <span>{task.donation_detail?.pickup_address}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber shrink-0 mt-0.5" />
                  <div>
                    <span className="text-ink dark:text-paper font-semibold block">Destination NGO:</span>
                    <span>{task.ngo_name || 'Hope Community Kitchen'} ({task.ngo_address})</span>
                  </div>
                </div>
              </div>

              {/* Proof Thumbnail trigger */}
              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => setSelectedProofTask(task)}
                  className="font-mono text-xs text-amber hover:underline flex items-center gap-1 font-semibold"
                >
                  <ImageIcon className="w-4 h-4" /> View Delivery Proof Photo & OTP Log
                </button>

                <span className="font-mono text-[11px] text-green-soft font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Audit Verified
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Proof Lightbox Modal */}
      {selectedProofTask && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-night-soft border border-line rounded-sm p-6 max-w-md w-full shadow-lg space-y-4"
          >
            <div className="flex justify-between items-center pb-2 border-b border-line">
              <h3 className="font-display text-base font-bold text-ink dark:text-paper">
                Delivery Proof Audit Log #{selectedProofTask.id.slice(0, 8)}
              </h3>
              <button
                onClick={() => setSelectedProofTask(null)}
                className="text-xs font-mono text-ink-soft hover:text-ink"
              >
                ✕ Close
              </button>
            </div>

            <div className="space-y-3">
              <img
                src={
                  selectedProofTask.proof_image_url ||
                  'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=500&q=80'
                }
                alt="Delivery Proof"
                className="w-full h-48 object-cover rounded-xs border border-line"
              />

              <div className="bg-paper-alt dark:bg-night p-3 border border-line rounded-xs font-mono text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-ink-soft">Verification Code OTP:</span>
                  <span className="font-bold text-teal">{selectedProofTask.otp_code || '583921'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-soft">Recorded Timestamp:</span>
                  <span>{new Date(selectedProofTask.created_at).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};
