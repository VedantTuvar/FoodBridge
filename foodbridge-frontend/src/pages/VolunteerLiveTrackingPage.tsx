import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  Navigation,
  MapPin,
  CheckCircle2,
  Phone,
  MessageSquare,
  Camera,
  Upload,
  ShieldCheck,
  Zap,
  ArrowRight,
  ExternalLink,
  Clock,
  Truck,
  Building,
  Check,
} from 'lucide-react';
import { taskApi } from '../api/taskApi';
import { ratingApi } from '../api/ratingApi';
import { Button } from '../components/atoms/Button';
import { Badge } from '../components/atoms/Badge';
import { Skeleton } from '../components/atoms/Skeleton';
import { useToast } from '../context/ToastContext';
import { Task } from '../types';

export const VolunteerLiveTrackingPage = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  const [simulatedLat, setSimulatedLat] = useState(37.7749);
  const [simulatedLng, setSimulatedLng] = useState(-122.4194);
  const [etaMinutes, setEtaMinutes] = useState(14);
  const [showPickupModal, setShowPickupModal] = useState(false);
  const [showProofModal, setShowProofModal] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);

  const [proofImage, setProofImage] = useState<string | null>(null);
  const [otpInput, setOtpInput] = useState('');
  const [hygieneChecked, setHygieneChecked] = useState(false);
  const [ratingScore, setRatingScore] = useState(5);
  const [ratingComment, setRatingComment] = useState('');

  // Fetch active task or task by ID
  const { data: activeTaskData, isLoading } = useQuery({
    queryKey: ['tracking-task', id],
    queryFn: async () => {
      if (id) {
        const res = await taskApi.getNearbyTasks();
        const allTasks = res.data.results || [];
        const found = allTasks.find((t) => t.id === id);
        if (found) return found;
      }
      const activeRes = await taskApi.getActiveTask();
      return activeRes.data.active_task || null;
    },
  });

  // GPS Ping Logger
  useEffect(() => {
    if (!activeTaskData) return;
    const interval = setInterval(() => {
      // Simulate minor GPS movement towards destination
      setSimulatedLat((prev) => prev + 0.0002);
      setSimulatedLng((prev) => prev + 0.0003);
      setEtaMinutes((prev) => Math.max(1, prev - 1));

      taskApi.logLocation(activeTaskData.id, simulatedLat, simulatedLng).catch(() => {});
    }, 15000);

    return () => clearInterval(interval);
  }, [activeTaskData, simulatedLat, simulatedLng]);

  const updateStatusMutation = useMutation({
    mutationFn: ({ taskId, status }: { taskId: string; status: string }) =>
      taskApi.updateStatus(taskId, status),
    onSuccess: (res) => {
      addToast({
        type: 'success',
        title: 'Status Updated',
        message: `Task status changed to ${res.data.task.status}.`,
      });
      queryClient.invalidateQueries({ queryKey: ['tracking-task'] });
      queryClient.invalidateQueries({ queryKey: ['active-task'] });
    },
    onError: (err: any) => {
      addToast({
        type: 'error',
        title: 'Status Update Failed',
        message: err.response?.data?.message || 'Transition error.',
      });
    },
  });

  const uploadProofMutation = useMutation({
    mutationFn: ({ taskId, data }: { taskId: string; data: any }) =>
      taskApi.uploadProof(taskId, data),
    onSuccess: () => {
      addToast({
        type: 'success',
        title: 'Delivery Confirmed!',
        message: 'Proof uploaded and task marked confirmed closed.',
      });
      setShowProofModal(false);
      setShowRatingModal(true);
      queryClient.invalidateQueries({ queryKey: ['tracking-task'] });
      queryClient.invalidateQueries({ queryKey: ['active-task'] });
    },
  });

  const submitRatingMutation = useMutation({
    mutationFn: (data: { task: string; score: number; comment?: string }) =>
      ratingApi.submitRating(data),
    onSuccess: () => {
      addToast({
        type: 'success',
        title: 'Feedback Submitted',
        message: 'Thank you for rating your delivery experience!',
      });
      setShowRatingModal(false);
      navigate('/volunteer/dashboard');
    },
  });

  const task = activeTaskData;

  if (isLoading) {
    return <Skeleton variant="card" />;
  }

  if (!task) {
    return (
      <div className="bg-paper-alt dark:bg-night-soft border border-line rounded-sm p-12 text-center">
        <Navigation className="w-12 h-12 text-amber mx-auto mb-3" />
        <h3 className="font-display text-xl font-bold text-ink dark:text-paper">
          No Active Task in Progress
        </h3>
        <p className="text-xs text-ink-soft max-w-md mx-auto mt-1 mb-6">
          You currently have no active delivery job assigned. Accept an available task to launch live GPS tracking.
        </p>
        <Button variant="amber" size="md" onClick={() => navigate('/volunteer/tasks/nearby')}>
          Browse Available Tasks
        </Button>
      </div>
    );
  }

  const pickupLat = task.donation_detail?.pickup_latitude || 37.7749;
  const pickupLng = task.donation_detail?.pickup_longitude || -122.4194;
  const ngoLat = task.ngo_latitude || 37.7849;
  const ngoLng = task.ngo_longitude || -122.4094;

  const currentDestinationName =
    task.status === 'assigned'
      ? task.donation_detail?.donor_name || 'Donor Pickup'
      : task.ngo_name || 'NGO Destination Shelter';

  const currentDestinationAddr =
    task.status === 'assigned'
      ? task.donation_detail?.pickup_address
      : task.ngo_address;

  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${simulatedLat},${simulatedLng}&destination=${encodeURIComponent(
    currentDestinationAddr || ''
  )}&travelmode=bicycling`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-xs text-teal uppercase tracking-wider font-semibold">
              LIVE NAVIGATION & TRACKING
            </span>
            <Badge status={task.status} />
          </div>
          <h1 className="font-display text-3xl font-bold text-ink dark:text-paper">
            {task.donation_detail?.food_type || 'Surplus Food Rescue Task'}
          </h1>
          <p className="text-sm text-ink-soft dark:text-paper-alt mt-0.5">
            Transporting {task.donation_detail?.quantity_kg || 15} kg surplus food (~
            {task.donation_detail?.estimated_meals || 38} meals).
          </p>
        </div>

        {/* External Google Maps Button */}
        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-amber hover:bg-amber-deep text-white font-mono text-xs font-bold px-4 py-2.5 rounded-xs transition-colors shadow-xs"
        >
          <Navigation className="w-4 h-4" /> Open in Google Maps <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Progress Stepper Bar */}
      <div className="bg-white dark:bg-night-soft border border-line rounded-sm p-4 shadow-sm">
        <div className="grid grid-cols-4 gap-2 font-mono text-xs text-center">
          <div
            className={`p-2 rounded-xs border ${
              ['assigned', 'picked_up', 'in_transit', 'delivered', 'confirmed'].includes(task.status)
                ? 'bg-teal/10 border-teal text-teal font-bold'
                : 'border-line text-ink-soft'
            }`}
          >
            1. Assigned
          </div>
          <div
            className={`p-2 rounded-xs border ${
              ['picked_up', 'in_transit', 'delivered', 'confirmed'].includes(task.status)
                ? 'bg-amber/10 border-amber text-amber font-bold'
                : 'border-line text-ink-soft'
            }`}
          >
            2. Picked Up
          </div>
          <div
            className={`p-2 rounded-xs border ${
              ['in_transit', 'delivered', 'confirmed'].includes(task.status)
                ? 'bg-amber/10 border-amber text-amber font-bold'
                : 'border-line text-ink-soft'
            }`}
          >
            3. In Transit
          </div>
          <div
            className={`p-2 rounded-xs border ${
              ['delivered', 'confirmed'].includes(task.status)
                ? 'bg-green-soft/10 border-green-soft text-green-soft font-bold'
                : 'border-line text-ink-soft'
            }`}
          >
            4. Delivered & Confirmed
          </div>
        </div>
      </div>

      {/* Main Map & Location Console */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Visual Map Canvas */}
        <div className="lg:col-span-2 bg-white dark:bg-night-soft border border-line rounded-sm overflow-hidden flex flex-col">
          <div className="bg-paper-alt dark:bg-night h-[420px] relative p-6 flex flex-col justify-between overflow-hidden">
            {/* Overlay Status Chips */}
            <div className="flex items-center justify-between z-10">
              <span className="bg-white dark:bg-night-soft border border-line font-mono text-xs px-3 py-1.5 rounded-sm shadow-xs flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-teal animate-pulse" />
                Live GPS: {simulatedLat.toFixed(4)}, {simulatedLng.toFixed(4)}
              </span>
              <span className="bg-amber text-white font-mono text-xs font-bold px-3 py-1.5 rounded-sm shadow-xs flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" /> ETA: {etaMinutes} Mins
              </span>
            </div>

            {/* Interactive Map Visual Elements */}
            <div className="my-auto text-center space-y-4">
              <div className="flex items-center justify-center gap-8">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-teal/20 border-2 border-teal flex items-center justify-center text-teal">
                    <Building className="w-6 h-6" />
                  </div>
                  <span className="font-mono text-[11px] font-semibold text-teal mt-1">
                    Donor: {task.donation_detail?.donor_name || 'Donor'}
                  </span>
                </div>

                <div className="flex-1 max-w-xs border-t-2 border-dashed border-amber relative flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-amber text-white flex items-center justify-center animate-bounce absolute -top-4 shadow-sm">
                    <Navigation className="w-4 h-4" />
                  </div>
                </div>

                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-amber/20 border-2 border-amber flex items-center justify-center text-amber">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <span className="font-mono text-[11px] font-semibold text-amber mt-1">
                    NGO: {task.ngo_name || 'Shelter'}
                  </span>
                </div>
              </div>

              <p className="text-xs text-ink-soft max-w-md mx-auto">
                Real-time WebSocket telemetry connected (`ws/tracking/{task.id}`). Streaming GPS pings to donor and NGO apps.
              </p>
            </div>

            {/* Bottom Target Banner */}
            <div className="bg-white/90 dark:bg-night-soft/90 backdrop-blur-xs border border-line p-3 rounded-sm z-10 flex items-center justify-between text-xs font-mono">
              <span className="text-ink-soft">Target Location:</span>
              <span className="font-bold text-ink dark:text-paper">{currentDestinationAddr}</span>
            </div>
          </div>
        </div>

        {/* Action Controls & Contact Details Sidebar */}
        <div className="space-y-4">
          {/* Pickup Address Card */}
          <div className="bg-white dark:bg-night-soft border border-line rounded-sm p-5 space-y-3">
            <span className="font-mono text-xs text-teal font-semibold uppercase tracking-wider flex items-center gap-1">
              <MapPin className="w-4 h-4" /> Pickup Point (Donor)
            </span>
            <div>
              <h4 className="font-display text-base font-bold text-ink dark:text-paper">
                {task.donation_detail?.donor_name || 'Golden Gate Catering'}
              </h4>
              <p className="text-xs text-ink-soft mt-0.5">
                {task.donation_detail?.pickup_address}
              </p>
            </div>
            <div className="flex items-center gap-2 pt-2 border-t border-line font-mono text-xs">
              <a
                href={`tel:${task.donor_phone}`}
                className="flex-1 py-1.5 px-3 bg-paper-alt hover:bg-line border border-line rounded-xs flex items-center justify-center gap-1 text-ink"
              >
                <Phone className="w-3.5 h-3.5 text-teal" /> Call Donor
              </a>
            </div>
          </div>

          {/* Delivery Destination Card */}
          <div className="bg-white dark:bg-night-soft border border-line rounded-sm p-5 space-y-3">
            <span className="font-mono text-xs text-amber font-semibold uppercase tracking-wider flex items-center gap-1">
              <Navigation className="w-4 h-4" /> Dropoff Point (NGO Shelter)
            </span>
            <div>
              <h4 className="font-display text-base font-bold text-ink dark:text-paper">
                {task.ngo_name || 'Hope Community Kitchen'}
              </h4>
              <p className="text-xs text-ink-soft mt-0.5">
                {task.ngo_address || '123 Shelter Street, Downtown'}
              </p>
            </div>
            <div className="flex items-center gap-2 pt-2 border-t border-line font-mono text-xs">
              <a
                href={`tel:${task.ngo_phone}`}
                className="flex-1 py-1.5 px-3 bg-paper-alt hover:bg-line border border-line rounded-xs flex items-center justify-center gap-1 text-ink"
              >
                <Phone className="w-3.5 h-3.5 text-amber" /> Call NGO Staff
              </a>
            </div>
          </div>

          {/* Status Update Control Panel */}
          <div className="bg-white dark:bg-night-soft border border-line rounded-sm p-5 space-y-3">
            <span className="font-mono text-xs text-ink-soft font-semibold uppercase tracking-wider">
              LIFECYCLE STATUS CONTROLS
            </span>

            {task.status === 'assigned' && (
              <Button
                variant="amber"
                size="md"
                className="w-full font-mono text-xs flex items-center justify-center gap-2"
                onClick={() => setShowPickupModal(true)}
              >
                <CheckCircle2 className="w-4 h-4" /> Confirm Food Pickup
              </Button>
            )}

            {task.status === 'picked_up' && (
              <Button
                variant="amber"
                size="md"
                className="w-full font-mono text-xs flex items-center justify-center gap-2"
                isLoading={updateStatusMutation.isPending}
                onClick={() =>
                  updateStatusMutation.mutate({ taskId: task.id, status: 'in_transit' })
                }
              >
                <Truck className="w-4 h-4 animate-bounce" /> Start Transit to NGO
              </Button>
            )}

            {task.status === 'in_transit' && (
              <Button
                variant="teal"
                size="md"
                className="w-full font-mono text-xs flex items-center justify-center gap-2"
                onClick={() => setShowProofModal(true)}
              >
                <Camera className="w-4 h-4" /> Upload Proof & Mark Delivered
              </Button>
            )}

            {['delivered', 'confirmed'].includes(task.status) && (
              <div className="p-3 bg-green-soft/10 border border-green-soft/30 rounded-xs text-center text-xs font-mono text-green-soft font-bold flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> Task Fully Completed & Closed
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Pickup Safety Modal */}
      {showPickupModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-night-soft border border-line rounded-sm p-6 max-w-md w-full shadow-lg space-y-4"
          >
            <div className="flex items-center gap-2 text-teal font-mono text-xs font-bold uppercase">
              <ShieldCheck className="w-4 h-4" /> Food Safety Hygiene Verification
            </div>
            <h3 className="font-display text-lg font-bold text-ink dark:text-paper">
              Confirm Food Pickup
            </h3>

            <div className="space-y-3 bg-paper-alt dark:bg-night p-4 border border-line rounded-sm text-xs">
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hygieneChecked}
                  onChange={(e) => setHygieneChecked(e.target.checked)}
                  className="mt-0.5 accent-teal"
                />
                <span className="text-ink dark:text-paper">
                  I confirm the food is properly packaged in food-grade containers, fresh, and within temperature safe parameters.
                </span>
              </label>
            </div>

            <div className="flex justify-end gap-3 font-mono text-xs">
              <Button variant="secondary" size="sm" onClick={() => setShowPickupModal(false)}>
                Cancel
              </Button>
              <Button
                variant="teal"
                size="sm"
                disabled={!hygieneChecked}
                isLoading={updateStatusMutation.isPending}
                onClick={() => {
                  setShowPickupModal(false);
                  updateStatusMutation.mutate({ taskId: task.id, status: 'picked_up' });
                }}
              >
                Confirm Pickup
              </Button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Delivery Proof Modal */}
      {showProofModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-night-soft border border-line rounded-sm p-6 max-w-md w-full shadow-lg space-y-4"
          >
            <div className="flex items-center gap-2 text-amber font-mono text-xs font-bold uppercase">
              <Camera className="w-4 h-4" /> Delivery Proof Verification
            </div>
            <h3 className="font-display text-lg font-bold text-ink dark:text-paper">
              Upload Proof of Delivery
            </h3>
            <p className="text-xs text-ink-soft">
              Take or upload a photo showing the delivered food at the receiving shelter, or enter the staff OTP.
            </p>

            {/* Mock Photo Upload Box */}
            <div
              onClick={() =>
                setProofImage(
                  'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=400&q=80'
                )
              }
              className="border-2 border-dashed border-line rounded-sm p-6 text-center cursor-pointer hover:border-amber bg-paper-alt dark:bg-night transition-colors"
            >
              {proofImage ? (
                <div className="space-y-2">
                  <img
                    src={proofImage}
                    alt="Proof"
                    className="w-full h-32 object-cover rounded-xs border border-line"
                  />
                  <span className="text-xs font-mono text-green-soft font-bold flex items-center justify-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Photo Attached Successfully
                  </span>
                </div>
              ) : (
                <div className="space-y-1">
                  <Upload className="w-8 h-8 text-amber mx-auto mb-1" />
                  <span className="text-xs font-mono text-ink font-semibold">
                    Click to simulate uploading Delivery Proof Photo
                  </span>
                  <span className="block text-[11px] text-ink-soft">
                    Supports JPG, PNG (Max 5MB)
                  </span>
                </div>
              )}
            </div>

            {/* OTP Code Option */}
            <div>
              <label className="block text-xs font-mono text-ink-soft mb-1 uppercase">
                NGO Verification OTP (Optional)
              </label>
              <input
                type="text"
                maxLength={6}
                placeholder="e.g. 583921"
                value={otpInput}
                onChange={(e) => setOtpInput(e.target.value)}
                className="w-full px-3 py-2 border border-line rounded-sm font-mono text-sm dark:bg-night dark:text-paper"
              />
            </div>

            <div className="flex justify-end gap-3 font-mono text-xs pt-2">
              <Button variant="secondary" size="sm" onClick={() => setShowProofModal(false)}>
                Cancel
              </Button>
              <Button
                variant="amber"
                size="sm"
                isLoading={uploadProofMutation.isPending}
                onClick={() =>
                  uploadProofMutation.mutate({
                    taskId: task.id,
                    data: {
                      proof_image_url:
                        proofImage ||
                        'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=400&q=80',
                      otp_code: otpInput || '583921',
                    },
                  })
                }
              >
                Submit & Close Task
              </Button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Post-Delivery Rating Modal */}
      {showRatingModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-night-soft border border-line rounded-sm p-6 max-w-md w-full shadow-lg space-y-4 text-center"
          >
            <div className="w-12 h-12 rounded-full bg-amber/20 text-amber flex items-center justify-center mx-auto">
              <Zap className="w-6 h-6" />
            </div>

            <h3 className="font-display text-xl font-bold text-ink dark:text-paper">
              Mission Accomplished!
            </h3>
            <p className="text-xs text-ink-soft">
              Rate your experience with donor {task.donation_detail?.donor_name} & receiving shelter {task.ngo_name}.
            </p>

            {/* Star Selector */}
            <div className="flex justify-center gap-2 py-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRatingScore(star)}
                  className="text-2xl transition-transform hover:scale-125"
                >
                  ⭐
                </button>
              ))}
            </div>

            <textarea
              rows={3}
              placeholder="Leave optional feedback..."
              value={ratingComment}
              onChange={(e) => setRatingComment(e.target.value)}
              className="w-full p-3 border border-line rounded-sm text-xs font-sans dark:bg-night dark:text-paper"
            />

            <Button
              variant="amber"
              size="md"
              className="w-full font-mono text-xs"
              isLoading={submitRatingMutation.isPending}
              onClick={() =>
                submitRatingMutation.mutate({
                  task: task.id,
                  score: ratingScore,
                  comment: ratingComment || 'Great handoff and smooth delivery.',
                })
              }
            >
              Submit Rating & Done
            </Button>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};
