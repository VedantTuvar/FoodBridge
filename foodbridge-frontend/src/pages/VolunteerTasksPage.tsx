import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Truck,
  MapPin,
  CheckCircle2,
  XCircle,
  Clock,
  Navigation,
  Map as MapIcon,
  List,
  Filter,
  AlertTriangle,
  Flame,
} from 'lucide-react';
import { taskApi } from '../api/taskApi';
import { Button } from '../components/atoms/Button';
import { Badge } from '../components/atoms/Badge';
import { Skeleton } from '../components/atoms/Skeleton';
import { useToast } from '../context/ToastContext';
import { Task } from '../types';

export const VolunteerTasksPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [rejectingTask, setRejectingTask] = useState<Task | null>(null);
  const [rejectReason, setRejectReason] = useState('Location too far from current route');

  const { data: tasks, isLoading } = useQuery({
    queryKey: ['nearby-tasks'],
    queryFn: async () => {
      const res = await taskApi.getNearbyTasks();
      return res.data.results || [];
    },
  });

  const acceptMutation = useMutation({
    mutationFn: (taskId: string) => taskApi.acceptTask(taskId),
    onSuccess: (res, taskId) => {
      addToast({
        type: 'success',
        title: 'Task Accepted!',
        message: 'Head to pickup address to begin delivery task.',
      });
      queryClient.invalidateQueries({ queryKey: ['nearby-tasks'] });
      queryClient.invalidateQueries({ queryKey: ['active-task'] });
      navigate(`/volunteer/tracking/${taskId}`);
    },
    onError: (err: any) => {
      addToast({
        type: 'error',
        title: 'Accept Failed',
        message: err.response?.data?.message || 'Unable to accept task.',
      });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: ({ taskId, reason }: { taskId: string; reason: string }) =>
      taskApi.rejectTask(taskId, reason),
    onSuccess: () => {
      addToast({
        type: 'amber',
        title: 'Task Declined',
        message: 'Task declined and returned to dispatch queue.',
      });
      setRejectingTask(null);
      queryClient.invalidateQueries({ queryKey: ['nearby-tasks'] });
    },
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="font-mono text-xs text-amber uppercase tracking-wider font-semibold">
            REAL-TIME DISPATCH ENGINE
          </span>
          <h1 className="font-display text-3xl font-bold text-ink dark:text-paper">
            Available Pickup Tasks
          </h1>
          <p className="text-sm text-ink-soft dark:text-paper-alt mt-1">
            Accept nearby surplus food rescue jobs to transport food from donors to local shelters.
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-2 bg-white dark:bg-night-soft p-1 border border-line rounded-sm self-start">
          <button
            onClick={() => setViewMode('list')}
            className={`px-3 py-1.5 font-mono text-xs rounded-xs flex items-center gap-1.5 transition-colors ${
              viewMode === 'list'
                ? 'bg-amber text-white font-semibold'
                : 'text-ink-soft hover:text-ink dark:text-paper-alt'
            }`}
          >
            <List className="w-3.5 h-3.5" /> List View
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={`px-3 py-1.5 font-mono text-xs rounded-xs flex items-center gap-1.5 transition-colors ${
              viewMode === 'map'
                ? 'bg-amber text-white font-semibold'
                : 'text-ink-soft hover:text-ink dark:text-paper-alt'
            }`}
          >
            <MapIcon className="w-3.5 h-3.5" /> Map View
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton variant="card" />
          <Skeleton variant="card" />
        </div>
      ) : tasks?.length === 0 ? (
        <div className="bg-paper-alt dark:bg-night-soft border border-line rounded-sm p-12 text-center">
          <Truck className="w-12 h-12 text-ink-soft mx-auto mb-3 opacity-60" />
          <h3 className="font-display text-lg font-semibold text-ink dark:text-paper mb-1">
            No Active Tasks Nearby
          </h3>
          <p className="text-sm text-ink-soft dark:text-paper-alt max-w-md mx-auto">
            You are currently on standby. As soon as an NGO claims a donation, a new delivery task will appear here.
          </p>
        </div>
      ) : viewMode === 'map' ? (
        <div className="bg-white dark:bg-night-soft border border-line rounded-sm p-6 space-y-4">
          <div className="bg-paper-alt dark:bg-night border border-line rounded-sm h-[400px] flex flex-col items-center justify-center text-center p-6 relative">
            <Navigation className="w-10 h-10 text-amber mb-2 animate-bounce" />
            <h3 className="font-display text-lg font-bold text-ink dark:text-paper">
              Geospatial Dispatch Map Preview
            </h3>
            <p className="text-xs text-ink-soft max-w-sm mt-1">
              Showing {tasks?.length} available food pickup locations indexed by PostGIS within your 5 km radius.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tasks?.map((task) => (
              <div key={task.id} className="border border-line rounded-sm p-4 bg-paper-alt dark:bg-night flex justify-between items-center">
                <div>
                  <h4 className="font-display text-sm font-bold text-ink dark:text-paper">
                    {task.donation_detail?.food_type || 'Surplus Food'} ({task.donation_detail?.quantity_kg} kg)
                  </h4>
                  <span className="text-xs font-mono text-ink-soft">
                    📍 {task.donation_detail?.pickup_address}
                  </span>
                </div>
                <Button
                  variant="amber"
                  size="sm"
                  isLoading={acceptMutation.isPending}
                  onClick={() => acceptMutation.mutate(task.id)}
                >
                  Accept
                </Button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {tasks?.map((task) => (
            <motion.div
              key={task.id}
              whileHover={{ y: -2 }}
              className="bg-white dark:bg-night-soft border border-line rounded-sm p-6 shadow-sm relative overflow-hidden"
            >
              {/* Urgency Progress Bar Header */}
              <div className="h-1.5 bg-line w-full absolute top-0 left-0">
                <div className="h-full bg-gradient-to-r from-teal via-amber to-red-soft w-3/4 animate-pulse" />
              </div>

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 pt-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs text-ink-soft uppercase font-semibold">
                      Task #{task.id.slice(0, 8)}
                    </span>
                    <Badge status={task.status} />
                    <span className="inline-flex items-center gap-1 font-mono text-[11px] bg-amber/15 text-amber px-2 py-0.5 rounded-full font-bold">
                      <Flame className="w-3 h-3" /> Pickup within 45 mins
                    </span>
                  </div>
                  <h3 className="font-display text-xl font-bold text-ink dark:text-paper">
                    {task.donation_detail?.food_type || 'Fresh Prepared Meals'}
                  </h3>
                </div>

                <div className="flex items-center gap-4 text-right">
                  <div>
                    <span className="font-mono text-xs text-ink-soft uppercase">Quantity</span>
                    <div className="font-display text-lg font-bold text-teal">
                      {task.donation_detail?.quantity_kg || 15} kg
                    </div>
                  </div>
                  <div className="border-l border-line pl-4">
                    <span className="font-mono text-xs text-ink-soft uppercase">Est. Meals</span>
                    <div className="font-display text-lg font-bold text-amber">
                      {task.donation_detail?.estimated_meals || 38} meals
                    </div>
                  </div>
                </div>
              </div>

              {/* Route & Address Detail Box */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-paper-alt dark:bg-night p-4 rounded-sm border border-line mb-5 font-mono text-xs">
                <div className="space-y-1">
                  <div className="text-teal font-semibold flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" /> PICKUP FROM (DONOR)
                  </div>
                  <div className="text-ink dark:text-paper font-sans font-medium text-sm">
                    {task.donation_detail?.donor_name || 'Golden Gate Catering'}
                  </div>
                  <div className="text-ink-soft">
                    {task.donation_detail?.pickup_address || '742 Montgomery St, Financial District'}
                  </div>
                </div>

                <div className="space-y-1 md:border-l md:border-line md:pl-4">
                  <div className="text-amber font-semibold flex items-center gap-1">
                    <Navigation className="w-3.5 h-3.5" /> DELIVER TO (DESTINATION NGO)
                  </div>
                  <div className="text-ink dark:text-paper font-sans font-medium text-sm">
                    {task.ngo_name || 'Hope Community Kitchen'}
                  </div>
                  <div className="text-ink-soft">
                    {task.ngo_address || '123 Shelter St, Downtown'}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <Button
                  variant="amber"
                  size="md"
                  className="w-full sm:w-auto flex-1 font-mono text-xs"
                  isLoading={acceptMutation.isPending}
                  onClick={() => acceptMutation.mutate(task.id)}
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" /> Accept Food Rescue Job
                </Button>

                <Button
                  variant="secondary"
                  size="md"
                  className="w-full sm:w-auto font-mono text-xs text-red-soft hover:bg-red-soft/10"
                  onClick={() => setRejectingTask(task)}
                >
                  <XCircle className="w-4 h-4 mr-2" /> Decline / Reject
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Reject Reason Modal */}
      {rejectingTask && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-night-soft border border-line rounded-sm p-6 max-w-md w-full shadow-lg"
          >
            <div className="flex items-center gap-2 text-red-soft mb-2 font-mono text-xs font-bold uppercase">
              <AlertTriangle className="w-4 h-4" /> Reject Task Confirmation
            </div>
            <h3 className="font-display text-lg font-bold text-ink dark:text-paper">
              Decline Task #{rejectingTask.id.slice(0, 8)}?
            </h3>
            <p className="text-xs text-ink-soft mt-1 mb-4">
              Please select a reason for declining this pickup so our dispatch engine can re-assign it to another volunteer.
            </p>

            <div className="space-y-2 mb-6">
              {[
                'Location too far from current route',
                'Vehicle capacity constraint',
                'Schedule conflict / Going offline',
                'Unsuitable food packaging type',
              ].map((reason) => (
                <label
                  key={reason}
                  className={`flex items-center gap-2 p-3 border rounded-sm text-xs cursor-pointer ${
                    rejectReason === reason
                      ? 'border-amber bg-amber/10 font-semibold text-ink dark:text-paper'
                      : 'border-line text-ink-soft hover:bg-paper-alt dark:hover:bg-night'
                  }`}
                >
                  <input
                    type="radio"
                    name="rejectReason"
                    checked={rejectReason === reason}
                    onChange={() => setRejectReason(reason)}
                    className="accent-amber"
                  />
                  <span>{reason}</span>
                </label>
              ))}
            </div>

            <div className="flex justify-end gap-3 font-mono text-xs">
              <Button variant="secondary" size="sm" onClick={() => setRejectingTask(null)}>
                Cancel
              </Button>
              <Button
                variant="amber"
                size="sm"
                isLoading={rejectMutation.isPending}
                onClick={() =>
                  rejectMutation.mutate({
                    taskId: rejectingTask.id,
                    reason: rejectReason,
                  })
                }
              >
                Confirm Decline
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};
