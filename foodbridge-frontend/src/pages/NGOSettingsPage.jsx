import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Save, Bell, Building, MapPin } from 'lucide-react';
import { ngoApi } from '../api/ngoApi';
import { Input } from '../components/atoms/Input';
import { Button } from '../components/atoms/Button';
import { LocationPicker } from '../components/molecules/LocationPicker';
import { useToast } from '../context/ToastContext';

export const NGOSettingsPage: React.FC = () => {
  const { addToast } = useToast();

  const [orgName, setOrgName] = useState('');
  const [regNum, setRegNum] = useState('');
  const [capacity, setCapacity] = useState('100');
  const [address, setAddress] = useState('');
  const [notifyEmail, setNotifyEmail] = useState(true);
  const [notifySms, setNotifySms] = useState(true);

  const { data: profile } = useQuery({
    queryKey: ['ngo-settings-profile'],
    queryFn: async () => {
      const res = await ngoApi.getProfile();
      return res.data;
    },
  });

  useEffect(() => {
    if (profile) {
      setOrgName(profile.organization_name || '');
      setRegNum(profile.registration_number || '');
      setCapacity(String(profile.capacity_per_day || 100));
      setAddress(profile.address || '');
      setNotifyEmail(profile.notify_email !== false);
      setNotifySms(profile.notify_sms !== false);
    }
  }, [profile]);

  const updateMutation = useMutation({
    mutationFn: (data: any) => ngoApi.updateProfile(data),
    onSuccess: () => {
      addToast({ type: 'success', title: 'Settings Saved!', message: 'Shelter capacity and alert preferences updated.' });
    },
    onError: () => addToast({ type: 'error', title: 'Update Failed' }),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate({
      organization_name: orgName,
      registration_number: regNum,
      capacity_per_day: Number(capacity),
      address,
      notify_email: notifyEmail,
      notify_sms: notifySms,
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
        <span className="font-mono text-xs text-teal uppercase tracking-wider font-semibold">
          SHELTER CONFIGURATION
        </span>
        <h1 className="font-display text-3xl font-bold text-ink dark:text-paper">
          NGO Profile & Settings
        </h1>
        <p className="text-sm text-ink-soft dark:text-paper-alt mt-1">
          Configure daily capacity, shelter location, and real-time food claim alert preferences.
        </p>
      </div>

      <div className="bg-white dark:bg-night-soft border border-line rounded-sm p-8 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <h3 className="font-display text-lg font-semibold text-ink dark:text-paper mb-3 flex items-center gap-2">
              <Building className="w-5 h-5 text-teal" /> Shelter Details
            </h3>
            <Input label="Shelter / NGO Organization Name" value={orgName} onChange={(e) => setOrgName(e.target.value)} required />
            <Input label="Government Registration Number" value={regNum} onChange={(e) => setRegNum(e.target.value)} required />
            <Input label="Daily Meal Capacity (beneficiaries/day)" type="number" value={capacity} onChange={(e) => setCapacity(e.target.value)} required />
            
            <LocationPicker address={address} onAddressChange={setAddress} onCoordinatesChange={() => {}} />
          </div>

          <div className="border-t border-line pt-6">
            <h3 className="font-display text-lg font-semibold text-ink dark:text-paper mb-3 flex items-center gap-2">
              <Bell className="w-5 h-5 text-amber" /> Alert Rules
            </h3>
            <div className="space-y-3">
              <label className="flex items-center gap-3 text-sm text-ink-soft cursor-pointer">
                <input type="checkbox" checked={notifyEmail} onChange={(e) => setNotifyEmail(e.target.checked)} className="rounded border-line text-teal" />
                Email Alerts for Nearby Food Listings
              </label>
              <label className="flex items-center gap-3 text-sm text-ink-soft cursor-pointer">
                <input type="checkbox" checked={notifySms} onChange={(e) => setNotifySms(e.target.checked)} className="rounded border-line text-teal" />
                SMS Instant Notifications for High-Urgency Surplus
              </label>
            </div>
          </div>

          <Button type="submit" variant="primary" className="w-full" isLoading={updateMutation.isPending} leftIcon={<Save className="w-4 h-4" />}>
            Save Shelter Configuration
          </Button>
        </form>
      </div>
    </motion.div>
  );
};
