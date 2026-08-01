import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bell, CheckCircle2, CheckCheck, Truck, Award, Star, Info, ExternalLink } from 'lucide-react';
import { notificationApi } from '../api/notificationApi';
import { Button } from '../components/atoms/Button';
import { Skeleton } from '../components/atoms/Skeleton';
import { useToast } from '../context/ToastContext';
import { NotificationItem } from '../types';

export const VolunteerNotificationsPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  const { data: notifications, isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const res = await notificationApi.getNotifications();
      return res || [];
    },
  });

  const markReadMutation = useMutation({
    mutationFn: (id: string) => notificationApi.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const markAllReadMutation = useMutation({
    mutationFn: () => notificationApi.markAllAsRead(),
    onSuccess: () => {
      addToast({
        type: 'success',
        title: 'Notifications Cleared',
        message: 'All notifications marked as read.',
      });
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const typeIcons: Record<string, React.ReactNode> = {
    task_alert: <Truck className="w-5 h-5 text-amber" />,
    badge_earned: <Award className="w-5 h-5 text-teal" />,
    rating_received: <Star className="w-5 h-5 text-amber fill-amber" />,
    system: <Info className="w-5 h-5 text-ink-soft" />,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="font-mono text-xs text-teal uppercase tracking-wider font-semibold">
            REAL-TIME SYSTEM ALERTS
          </span>
          <h1 className="font-display text-3xl font-bold text-ink dark:text-paper">
            Notifications & Dispatch Alerts
          </h1>
          <p className="text-sm text-ink-soft dark:text-paper-alt mt-1">
            Stay updated on new nearby pickup tasks, ratings received, and milestone badges.
          </p>
        </div>

        <Button
          variant="secondary"
          size="sm"
          onClick={() => markAllReadMutation.mutate()}
          className="shrink-0 font-mono text-xs flex items-center gap-1.5"
        >
          <CheckCheck className="w-4 h-4 text-teal" /> Mark All as Read
        </Button>
      </div>

      {isLoading ? (
        <Skeleton variant="card" />
      ) : notifications?.length === 0 ? (
        <div className="bg-paper-alt dark:bg-night-soft border border-line rounded-sm p-12 text-center">
          <Bell className="w-12 h-12 text-ink-soft mx-auto mb-3 opacity-60" />
          <h3 className="font-display text-lg font-semibold text-ink dark:text-paper mb-1">
            No Notifications
          </h3>
          <p className="text-sm text-ink-soft dark:text-paper-alt max-w-md mx-auto">
            You're all caught up! New dispatch alerts and updates will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications?.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                if (!item.is_read) markReadMutation.mutate(item.id);
                if (item.link) navigate(item.link);
              }}
              className={`p-5 rounded-sm border transition-all cursor-pointer flex items-start gap-4 ${
                !item.is_read
                  ? 'bg-white dark:bg-night-soft border-teal shadow-xs'
                  : 'bg-paper-alt/60 dark:bg-night border-line opacity-80'
              }`}
            >
              <div className="p-2.5 rounded-full bg-paper-alt dark:bg-night border border-line shrink-0">
                {typeIcons[item.notification_type] || <Bell className="w-5 h-5 text-teal" />}
              </div>

              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-display text-base font-bold text-ink dark:text-paper">
                    {item.title}
                  </h4>
                  <span className="font-mono text-[11px] text-ink-soft">
                    {new Date(item.created_at).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                <p className="text-xs text-ink-soft dark:text-paper-alt">{item.body}</p>

                {item.link && (
                  <span className="inline-flex items-center gap-1 font-mono text-[11px] text-teal font-semibold pt-1">
                    Action Target <ExternalLink className="w-3 h-3" />
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};
