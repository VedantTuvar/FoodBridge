import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ShieldCheck, UploadCloud, AlertCircle, FileText, CheckCircle2, Clock } from 'lucide-react';
import { ngoApi } from '../api/ngoApi';
import { Button } from '../components/atoms/Button';
import { Callout } from '../components/molecules/Callout';
import { Skeleton } from '../components/atoms/Skeleton';
import { useToast } from '../context/ToastContext';

export const NGOVerificationPage = () => {
  const queryClient = useQueryClient();
  const { addToast } = useToast();
  const [file, setFile] = useState(null);

  const { data: profile, isLoading } = useQuery({
    queryKey: ['ngo-verification-profile'],
    queryFn: async () => {
      const res = await ngoApi.getProfile();
      return res.data;
    },
  });

  const uploadMutation = useMutation({
    mutationFn: (formData: FormData) => ngoApi.uploadVerificationDocument(formData),
    onSuccess: () => {
      addToast({ type: 'success', title: 'Document Submitted!', message: 'Application queued for admin review.' });
      queryClient.invalidateQueries({ queryKey: ['ngo-verification-profile'] });
      setFile(null);
    },
    onError: () => addToast({ type: 'error', title: 'Upload Failed' }),
  });

  const handleFileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    const formData = new FormData();
    formData.append('document', file);
    uploadMutation.mutate(formData);
  };

  if (isLoading) return <Skeleton variant="card" />;

  const status = profile?.verification_status || 'pending';

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-2xl mx-auto"
    >
      <div className="mb-6">
        <span className="font-mono text-xs text-teal uppercase tracking-wider font-semibold">
          TRUST & AUDIT PORTAL
        </span>
        <h1 className="font-display text-3xl font-bold text-ink dark:text-paper">
          NGO Verification & Audit Status
        </h1>
        <p className="text-sm text-ink-soft dark:text-paper-alt mt-1">
          Government registration verification required before claiming surplus food listings.
        </p>
      </div>

      <div className="bg-white dark:bg-night-soft border border-line rounded-sm p-8 shadow-sm mb-6">
        <div className="flex items-center justify-between border-b border-line pb-4 mb-6">
          <div className="flex items-center gap-3">
            {status === 'approved' ? (
              <CheckCircle2 className="w-8 h-8 text-green-soft" />
            ) : status === 'rejected' ? (
              <AlertCircle className="w-8 h-8 text-red-soft" />
            ) : (
              <Clock className="w-8 h-8 text-amber animate-spin" />
            )}
            <div>
              <span className="font-mono text-xs uppercase tracking-wider text-ink-soft">Current Status</span>
              <h3 className="font-display text-xl font-bold text-ink dark:text-paper capitalize">
                {status === 'pending' ? 'Pending Review' : status}
              </h3>
            </div>
          </div>
        </div>

        {status === 'approved' && (
          <Callout type="teal" title="Verified NGO Partner">
            Your government registration certificate has been audited and approved. You hold full food claim privileges.
          </Callout>
        )}

        {status === 'rejected' && (
          <Callout type="red" title="Verification Application Rejected">
            Reason: {profile?.rejection_reason || 'Certificate document could not be verified.'} Please re-upload a clear copy of your government registration certificate below.
          </Callout>
        )}

        {status === 'pending' && (
          <Callout type="amber" title="Under Review by Platform Operations">
            Our moderation team audits all shelter certificates within 2 business hours.
          </Callout>
        )}

        <form onSubmit={handleFileSubmit} className="mt-6">
          <label className="font-mono text-xs uppercase tracking-wider text-ink-soft block mb-2 font-medium">
            Upload Government 80G / 12A / Registration Certificate
          </label>

          <div className="border-2 border-dashed border-line rounded-sm p-6 text-center hover:border-teal transition-colors relative bg-paper-alt/30 mb-4">
            <input
              type="file"
              accept=".pdf,image/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
            <UploadCloud className="w-8 h-8 text-teal mx-auto mb-2" />
            <p className="text-sm font-medium text-ink dark:text-paper">
              {file ? file.name : 'Click or Drag PDF / Image Certificate'}
            </p>
            <p className="text-xs text-ink-soft mt-1">PDF, PNG, JPG up to 10MB</p>
          </div>

          <Button
            type="submit"
            variant="primary"
            className="w-full"
            disabled={!file}
            isLoading={uploadMutation.isPending}
          >
            Submit Certificate for Review
          </Button>
        </form>
      </div>
    </motion.div>
  );
};
