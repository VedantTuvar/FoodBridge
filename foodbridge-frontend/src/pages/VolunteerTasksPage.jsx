import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Truck, MapPin, CheckCircle2 } from 'lucide-react';
import { taskApi } from '../api/taskApi';
import { Button } from '../components/atoms/Button';
import { Badge } from '../components/atoms/Badge';
import { Skeleton } from '../components/atoms/Skeleton';
import { useToast } from '../context/ToastContext';
import { Task } from '../types';

export const VolunteerTasksPage: React.FC = () => {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  const { data: tasks, isLoading } = useQuery({
    queryKey: ['nearby-tasks'],
    queryFn: async () => {
      const res = await taskApi.getNearbyTasks();
      return (res.data.results || []) as Task[];
    },
  });

  const acceptMutation = useMutation({
    mutationFn: (taskId: string) => taskApi.acceptTask(taskId),
    onSuccess: () => {
      addToast({
        type: 'success',
        title: 'Task Accepted!',
        message: 'Head to pickup address to begin delivery task.',
      });
      queryClient.invalidateQueries({ queryKey: ['nearby-tasks'] });
    },
    onError: (err: any) => {
      addToast({
        type: 'error',
        title: 'Accept Failed',
        message: err.response?.data?.message || 'Unable to accept task.',
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
        <span className="font-mono text-xs text-amber uppercase tracking-wider font-semibold">
          VOLUNTEER DISPATCH
        </span>
        <h1 className="font-display text-3xl font-bold text-ink dark:text-paper">
          Available Pickup Tasks
        </h1>
        <p className="text-sm text-ink-soft dark:text-paper-alt mt-1">
          Accept nearby tasks to deliver surplus food from donors to shelters.
        </p>
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
      ) : (
        <div className="space-y-4">
          {tasks?.map((task) => (
            <motion.div
              key={task.id}
              whileHover={{ y: -2 }}
              className="bg-white dark:bg-night-soft border border-line rounded-sm p-6 shadow-sm"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <span className="font-mono text-xs text-ink-soft dark:text-paper-alt uppercase">
                    Task #{task.id.slice(0, 8)}
                  </span>
                  <h3 className="font-display text-lg font-semibold text-ink dark:text-paper">
                    {task.donation_detail?.food_type || 'Surplus Food'}
                  </h3>
                </div>
                <Badge status={task.status} />
              </div>

              <div className="flex items-start gap-2 text-xs text-ink-soft dark:text-paper-alt mb-4">
                <MapPin className="w-4 h-4 text-teal shrink-0 mt-0.5" />
                <span>Pickup: {task.donation_detail?.pickup_address}</span>
              </div>

              <Button
                variant="amber"
                size="md"
                className="w-full"
                isLoading={acceptMutation.isPending}
                onClick={() => acceptMutation.mutate(task.id)}
              >
                Accept Delivery Job
              </Button>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};
