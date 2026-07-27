import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Save, Bell, MapPin, Building } from 'lucide-react';
import { donorApi } from '../api/donorApi';
import { Input } from '../components/atoms/Input';
import { Button } from '../components/atoms/Button';
import { Callout } from '../components/molecules/Callout';
import { LocationPicker } from '../components/molecules/LocationPicker';
import { useToast } from '../context/ToastContext';

export const DonorSettingsPage: React.FC = () => {
  const { addToast } = useToast();

  const [orgName, setOrgName] = useState('');
  const [donorType, setDonorType] = useState('restaurant');
  const [address, setAddress] = useState('');
  const [notifyEmail, setNotifyEmail] = useState(true);
  const [notifySms, setNotifySms] = useState(true);
  const [notifyPush, setNotifyPush] = useState(true);

  const { data: profile } = useQuery({
    queryKey: ['donor-profile'],
    queryFn: async () => {
      const res = await donorApi.getProfile();
      return res.data;
    },
  });

  useEffect(() => {
    if (profile) {
      setOrgName(profile.organization_name || '');
      setDonorType(profile.donor_type || 'restaurant');
      setAddress(profile.address || '');
      setNotifyEmail(profile.notify_email !== false);
      setNotifySms(profile.notify_sms !== false);
      setNotifyPush(profile.notify_push !== false);
    }
  }, [profile]);

  const updateMutation = useMutation({
    mutationFn: (data: any) => donorApi.updateProfile(data),
    onSuccess: () => {
      addToast({ type: 'success', title: 'Settings Updated!', message: 'Donor profile and notification preferences saved.' });
    },
    onError: () => addToast({ type: 'error', title: 'Update Failed' }),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate({
      organization_name: orgName,
      donor_type: donorType,
      address,
      notify_email: notifyEmail,
      notify_sms: notifySms,
      notify_push: notifyPush,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-2xl mx-auto"
    >
      <div className="mb-6">
        <span className="font-mono text-xs text-amber-deep uppercase tracking-wider font-semibold">
          ACCOUNT PREFERENCES
        </span>
        <h1 className="font-display text-3xl font-bold text-ink dark:text-paper">
          Donor Settings & Profile
        </h1>
        <p className="text-sm text-ink-soft dark:text-paper-alt mt-1">
          Manage organization information, default pickup location, and notification dispatch rules.
        </p>
      </div>

      <div className="bg-white dark:bg-night-soft border border-line rounded-sm p-8 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <h3 className="font-display text-lg font-semibold text-ink dark:text-paper mb-3 flex items-center gap-2">
              <Building className="w-5 h-5 text-teal" /> Organization Details
            </h3>
            <Input label="Organization / Donor Name" value={orgName} onChange={(e) => setOrgName(e.target.value)} required />

            <div className="mb-4">
              <label className="font-mono text-xs uppercase text-ink-soft block mb-1">Donor Classification</label>
              <select
                value={donorType}
                onChange={(e) => setDonorType(e.target.value)}
                className="w-full p-2.5 bg-white border border-line rounded-sm text-sm"
              >
                <option value="restaurant">Restaurant / Bistro</option>
                <option value="hotel">Hotel & Convention Center</option>
                <option value="grocery">Supermarket / Grocery</option>
                <option value="corporate">Corporate Office / Cafeteria</option>
                <option value="event">Event Catering</option>
                <option value="individual">Individual Donor</option>
              </select>
            </div>

            <LocationPicker
              address={address}
              onAddressChange={setAddress}
              onCoordinatesChange={() => {}}
            />
          </div>

          <div className="border-t border-line pt-6">
            <h3 className="font-display text-lg font-semibold text-ink dark:text-paper mb-3 flex items-center gap-2">
              <Bell className="w-5 h-5 text-amber" /> Notification Preferences
            </h3>

            <div className="space-y-3">
              <label className="flex items-center gap-3 text-sm text-ink-soft cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifyEmail}
                  onChange={(e) => setNotifyEmail(e.target.checked)}
                  className="rounded border-line text-teal focus:ring-teal"
                />
                Email Notifications (Claim alerts & delivery receipts)
              </label>

              <label className="flex items-center gap-3 text-sm text-ink-soft cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifySms}
                  onChange={(e) => setNotifySms(e.target.checked)}
                  className="rounded border-line text-teal focus:ring-teal"
                />
                SMS Notifications (Urgent driver arrival alerts)
              </label>

              <label className="flex items-center gap-3 text-sm text-ink-soft cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifyPush}
                  onChange={(e) => setNotifyPush(e.target.checked)}
                  className="rounded border-line text-teal focus:ring-teal"
                />
                Web Push Alerts (Browser real-time tracking updates)
              </label>
            </div>
          </div>

          <Button type="submit" variant="primary" className="w-full" isLoading={updateMutation.isPending} leftIcon={<Save className="w-4 h-4" />}>
            Save Profile Settings
          </Button>
        </form>
      </div>
    </motion.div>
  );
};
