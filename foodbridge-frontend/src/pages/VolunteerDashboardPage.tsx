import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Truck,
  MapPin,
  CheckCircle2,
  Award,
  Star,
  Zap,
  TrendingUp,
  Navigation,
  Bell,
  Clock,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  Package,
} from 'lucide-react';
import { volunteerApi } from '../api/volunteerApi';
import { taskApi } from '../api/taskApi';
import { Button } from '../components/atoms/Button';
import { Badge } from '../components/atoms/Badge';
import { Skeleton } from '../components/atoms/Skeleton';
import { useToast } from '../context/ToastContext';
import { Task, VolunteerProfile } from '../types';

export const VolunteerDashboardPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  const { data: profile, isLoading: isProfileLoading } = useQuery({
    queryKey: ['volunteer-profile'],
    queryFn: async () => {
      const res = await volunteerApi.getProfile();
      return res.data;
    },
  });

  const { data: activeTaskData, isLoading: isActiveTaskLoading } = useQuery({
    queryKey: ['active-task'],
    queryFn: async () => {
      const res = await taskApi.getActiveTask();
      return res.data.active_task || null;
    },
  });

  const { data: nearbyTasks } = useQuery({
    queryKey: ['nearby-tasks'],
    queryFn: async () => {
      const res = await taskApi.getNearbyTasks();
      return res.data.results || [];
    },
  });

  const toggleAvailabilityMutation = useMutation({
    mutationFn: (newStatus: boolean) => volunteerApi.toggleAvailability(newStatus),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['volunteer-profile'] });
      addToast({
        type: 'success',
        title: res.data.is_available ? 'You are now ONLINE' : 'You are now OFFLINE',
        message: res.data.is_available
          ? 'You will receive real-time notifications for nearby food rescue tasks.'
          : 'Status set to offline. You will not receive dispatch alerts.',
      });
    },
  });

  const vehicleLabels: Record<string, string> = {
    on_foot: '🚶 On Foot',
    bike: '🚴 Bicycle / Motorbike',
    car: '🚗 Car / Auto',
    van: '🚐 Delivery Van',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      {/* Header Banner with Availability Toggle */}
      <div className="bg-white dark:bg-night-soft border border-line rounded-sm p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-xs text-amber uppercase tracking-wider font-semibold">
              VOLUNTEER COMMAND CENTER
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs font-mono px-2 py-0.5 rounded-full bg-paper-alt border border-line text-ink-soft">
              {profile ? vehicleLabels[profile.vehicle_type] || profile.vehicle_type : '🚴 Bike'}
            </span>
          </div>
          <h1 className="font-display text-3xl font-bold text-ink dark:text-paper">
            Welcome Back, Volunteer Hero!
          </h1>
          <p className="text-sm text-ink-soft dark:text-paper-alt mt-1">
            Ready to connect surplus food donors with local community shelters today.
          </p>
        </div>

        {/* Status Toggle Button */}
        <div className="flex items-center gap-4 bg-paper-alt dark:bg-night p-3 border border-line rounded-sm shrink-0">
          <div className="text-right">
            <div className="text-xs font-mono font-semibold uppercase tracking-wider text-ink dark:text-paper">
              Dispatch Status
            </div>
            <div className="text-xs text-ink-soft flex items-center justify-end gap-1.5 mt-0.5">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  profile?.is_available ? 'bg-green-soft animate-ping' : 'bg-red-soft'
                }`}
              />
              <span className={profile?.is_available ? 'text-green-soft font-medium' : 'text-red-soft font-medium'}>
                {profile?.is_available ? 'ONLINE & READY' : 'OFFLINE'}
              </span>
            </div>
          </div>

          <Button
            variant={profile?.is_available ? 'amber' : 'secondary'}
            size="sm"
            isLoading={toggleAvailabilityMutation.isPending}
            onClick={() => toggleAvailabilityMutation.mutate(!profile?.is_available)}
            className="flex items-center gap-2 font-mono text-xs"
          >
            {profile?.is_available ? (
              <>
                <ToggleRight className="w-4 h-4 text-white" /> Go Offline
              </>
            ) : (
              <>
                <ToggleLeft className="w-4 h-4 text-ink-soft" /> Go Online
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Active Task Highlight Banner (If any task is currently assigned/picked_up/in_transit) */}
      {activeTaskData && (
        <motion.div
          initial={{ scale: 0.98 }}
          animate={{ scale: 1 }}
          className="bg-amber/10 border-2 border-amber rounded-sm p-6 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 bg-amber text-white font-mono text-[10px] uppercase font-bold px-3 py-1 rounded-bl-sm flex items-center gap-1">
            <Zap className="w-3 h-3 animate-bounce" /> TASK IN PROGRESS
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-semibold text-amber uppercase">
                  Task #{activeTaskData.id.slice(0, 8)}
                </span>
                <Badge status={activeTaskData.status} />
              </div>
              <h2 className="font-display text-xl font-bold text-ink dark:text-paper">
                {activeTaskData.donation_detail?.food_type || 'Surplus Food Delivery'}
              </h2>
              <div className="flex flex-wrap items-center gap-4 text-xs text-ink-soft dark:text-paper-alt font-mono">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-teal" /> Pickup: {activeTaskData.donation_detail?.pickup_address}
                </span>
                <span className="flex items-center gap-1">
                  <Navigation className="w-3.5 h-3.5 text-amber" /> Dropoff: {activeTaskData.ngo_name || 'Shelter'}
                </span>
              </div>
            </div>

            <Button
              variant="teal"
              size="md"
              onClick={() => navigate(`/volunteer/tracking/${activeTaskData.id}`)}
              className="shrink-0 font-mono text-xs flex items-center gap-2"
            >
              <Navigation className="w-4 h-4 animate-pulse" /> Live Tracking & Navigation <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </motion.div>
      )}

      {/* Key Metric Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-night-soft border border-line rounded-sm p-5 shadow-sm">
          <div className="flex items-center justify-between text-ink-soft mb-2">
            <span className="font-mono text-xs uppercase font-medium">Deliveries Completed</span>
            <Truck className="w-5 h-5 text-teal" />
          </div>
          <div className="font-display text-3xl font-bold text-ink dark:text-paper">
            {profile?.total_deliveries ?? 0}
          </div>
          <span className="text-[11px] text-green-soft font-mono mt-1 inline-block">
            +100% verified completed
          </span>
        </div>

        <div className="bg-white dark:bg-night-soft border border-line rounded-sm p-5 shadow-sm">
          <div className="flex items-center justify-between text-ink-soft mb-2">
            <span className="font-mono text-xs uppercase font-medium">Food Rescued (Kg)</span>
            <Package className="w-5 h-5 text-amber" />
          </div>
          <div className="font-display text-3xl font-bold text-ink dark:text-paper">
            {((profile?.total_deliveries || 0) * 18.5).toFixed(1)} kg
          </div>
          <span className="text-[11px] text-ink-soft font-mono mt-1 inline-block">
            ~{Math.round((profile?.total_deliveries || 0) * 18.5 * 2.5)} meals provided
          </span>
        </div>

        <div className="bg-white dark:bg-night-soft border border-line rounded-sm p-5 shadow-sm">
          <div className="flex items-center justify-between text-ink-soft mb-2">
            <span className="font-mono text-xs uppercase font-medium">Volunteer Rating</span>
            <Star className="w-5 h-5 text-amber fill-amber" />
          </div>
          <div className="font-display text-3xl font-bold text-ink dark:text-paper">
            {profile?.rating_avg ? Number(profile.rating_avg).toFixed(1) : '5.0'} / 5.0
          </div>
          <span className="text-[11px] text-green-soft font-mono mt-1 inline-block">
            Top 5% Volunteer Rating
          </span>
        </div>

        <div className="bg-white dark:bg-night-soft border border-line rounded-sm p-5 shadow-sm">
          <div className="flex items-center justify-between text-ink-soft mb-2">
            <span className="font-mono text-xs uppercase font-medium">Impact Points</span>
            <Award className="w-5 h-5 text-teal" />
          </div>
          <div className="font-display text-3xl font-bold text-ink dark:text-paper">
            {(profile?.total_deliveries || 0) * 50 + 150} pts
          </div>
          <span className="text-[11px] text-amber font-mono mt-1 inline-block font-semibold">
            Rank #3 in City Leaderboard
          </span>
        </div>
      </div>

      {/* Quick Access Modules Navigation */}
      <div>
        <h3 className="font-mono text-xs text-ink-soft uppercase tracking-wider font-semibold mb-4">
          VOLUNTEER MODULE FEATURES & ACTION SUITE
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            onClick={() => navigate('/volunteer/tasks/nearby')}
            className="bg-white dark:bg-night-soft border border-line rounded-sm p-5 shadow-sm hover:border-amber transition-all cursor-pointer group"
          >
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-sm bg-amber/10 flex items-center justify-center text-amber mb-3 group-hover:scale-110 transition-transform">
                <Truck className="w-5 h-5" />
              </div>
              <span className="font-mono text-xs bg-amber/20 text-amber font-bold px-2 py-0.5 rounded-full">
                {nearbyTasks?.length || 0} Nearby
              </span>
            </div>
            <h4 className="font-display text-base font-bold text-ink dark:text-paper group-hover:text-amber transition-colors">
              Available Pickup Tasks
            </h4>
            <p className="text-xs text-ink-soft dark:text-paper-alt mt-1">
              Browse, filter by perishability window, accept or reject available food rescue jobs.
            </p>
          </div>

          <div
            onClick={() => navigate('/volunteer/tracking')}
            className="bg-white dark:bg-night-soft border border-line rounded-sm p-5 shadow-sm hover:border-teal transition-all cursor-pointer group"
          >
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-sm bg-teal/10 flex items-center justify-center text-teal mb-3 group-hover:scale-110 transition-transform">
                <Navigation className="w-5 h-5" />
              </div>
              <span className="font-mono text-xs bg-teal/20 text-teal font-bold px-2 py-0.5 rounded-full">
                GPS Live
              </span>
            </div>
            <h4 className="font-display text-base font-bold text-ink dark:text-paper group-hover:text-teal transition-colors">
              Live Tracking & Google Maps
            </h4>
            <p className="text-xs text-ink-soft dark:text-paper-alt mt-1">
              Turn-by-turn map navigation, real-time GPS location streaming, pickup & proof upload.
            </p>
          </div>

          <div
            onClick={() => navigate('/volunteer/history')}
            className="bg-white dark:bg-night-soft border border-line rounded-sm p-5 shadow-sm hover:border-ink transition-all cursor-pointer group"
          >
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-sm bg-paper-alt border border-line flex items-center justify-center text-ink mb-3 group-hover:scale-110 transition-transform">
                <Clock className="w-5 h-5" />
              </div>
              <span className="font-mono text-xs bg-paper-alt text-ink-soft font-bold px-2 py-0.5 rounded-full">
                Logs
              </span>
            </div>
            <h4 className="font-display text-base font-bold text-ink dark:text-paper group-hover:text-teal transition-colors">
              Delivery History & Audit
            </h4>
            <p className="text-xs text-ink-soft dark:text-paper-alt mt-1">
              Complete historical record of all completed missions, proof photos, and timestamps.
            </p>
          </div>

          <div
            onClick={() => navigate('/volunteer/badges')}
            className="bg-white dark:bg-night-soft border border-line rounded-sm p-5 shadow-sm hover:border-amber transition-all cursor-pointer group"
          >
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-sm bg-amber/10 flex items-center justify-center text-amber mb-3 group-hover:scale-110 transition-transform">
                <Award className="w-5 h-5" />
              </div>
              <span className="font-mono text-xs bg-amber/20 text-amber font-bold px-2 py-0.5 rounded-full">
                Gamified
              </span>
            </div>
            <h4 className="font-display text-base font-bold text-ink dark:text-paper group-hover:text-amber transition-colors">
              Badges & Impact Certificate
            </h4>
            <p className="text-xs text-ink-soft dark:text-paper-alt mt-1">
              Unlock milestone achievements and generate your official digital FoodBridge certificate.
            </p>
          </div>

          <div
            onClick={() => navigate('/volunteer/leaderboard')}
            className="bg-white dark:bg-night-soft border border-line rounded-sm p-5 shadow-sm hover:border-teal transition-all cursor-pointer group"
          >
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-sm bg-teal/10 flex items-center justify-center text-teal mb-3 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-5 h-5" />
              </div>
              <span className="font-mono text-xs bg-teal/20 text-teal font-bold px-2 py-0.5 rounded-full">
                Rank #3
              </span>
            </div>
            <h4 className="font-display text-base font-bold text-ink dark:text-paper group-hover:text-teal transition-colors">
              City Leaderboard
            </h4>
            <p className="text-xs text-ink-soft dark:text-paper-alt mt-1">
              Compete with fellow volunteers citywide and track your ranking across weekly & all-time charts.
            </p>
          </div>

          <div
            onClick={() => navigate('/volunteer/ratings')}
            className="bg-white dark:bg-night-soft border border-line rounded-sm p-5 shadow-sm hover:border-amber transition-all cursor-pointer group"
          >
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-sm bg-amber/10 flex items-center justify-center text-amber mb-3 group-hover:scale-110 transition-transform">
                <Star className="w-5 h-5 fill-amber" />
              </div>
              <span className="font-mono text-xs bg-amber/20 text-amber font-bold px-2 py-0.5 rounded-full">
                5.0 Stars
              </span>
            </div>
            <h4 className="font-display text-base font-bold text-ink dark:text-paper group-hover:text-amber transition-colors">
              Ratings & Reviews
            </h4>
            <p className="text-xs text-ink-soft dark:text-paper-alt mt-1">
              View reviews received from restaurants and shelters, and rate completed deliveries.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
