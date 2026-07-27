import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Check, X, FileText } from 'lucide-react';
import api from '../api/axios';
import { DataTable, Column } from '../components/organisms/DataTable';
import { Button } from '../components/atoms/Button';
import { Badge } from '../components/atoms/Badge';
import { Skeleton } from '../components/atoms/Skeleton';
import { useToast } from '../context/ToastContext';
import { NGOProfile } from '../types';

export const NGOVerificationQueuePage = () => {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  const { data: ngos, isLoading } = useQuery({
    queryKey: ['pending-verifications'],
    queryFn: async () => {
      const res = await api.get('/admin-panel/verifications/pending/');
      return res.data.results || [];
    },
  });

  const approveMutation = useMutation({
    mutationFn: (ngoId: string) => api.post(`/admin-panel/verifications/${ngoId}/approve/`),
    onSuccess: () => {
      addToast({ type: 'success', title: 'NGO Verified', message: 'NGO granted platform access.' });
      queryClient.invalidateQueries({ queryKey: ['pending-verifications'] });
    },
    onError: () => addToast({ type: 'error', title: 'Action Failed' }),
  });

  const rejectMutation = useMutation({
    mutationFn: (ngoId: string) => api.post(`/admin-panel/verifications/${ngoId}/reject/`),
    onSuccess: () => {
      addToast({ type: 'amber', title: 'NGO Rejected', message: 'Verification application rejected.' });
      queryClient.invalidateQueries({ queryKey: ['pending-verifications'] });
    },
    onError: () => addToast({ type: 'error', title: 'Action Failed' }),
  });

  const columns: Column<NGOProfile>[] = [
    {
      header: 'Organization Name',
      accessor: (row) => (
        <div>
          <div className="font-semibold text-ink dark:text-paper">{row.organization_name}</div>
          <div className="font-mono text-xs text-ink-soft">Reg #{row.registration_number}</div>
        </div>
      ),
    },
    {
      header: 'Address',
      accessor: 'address',
    },
    {
      header: 'Daily Capacity',
      accessor: (row) => <span className="font-mono">{row.capacity_per_day} meals</span>,
    },
    {
      header: 'Documents',
      accessor: (row) =>
        row.verification_document_url ? (
          <a
            href={row.verification_document_url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 font-mono text-xs text-teal hover:underline"
          >
            <FileText className="w-3.5 h-3.5" /> View Certificate
          </a>
        ) : (
          <span className="font-mono text-xs text-ink-soft">No Document</span>
        ),
    },
    {
      header: 'Actions',
      accessor: (row) => (
        <div className="flex gap-2">
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Check className="w-3.5 h-3.5" />}
            isLoading={approveMutation.isPending}
            onClick={() => approveMutation.mutate(row.id)}
          >
            Approve
          </Button>
          <Button
            variant="danger"
            size="sm"
            leftIcon={<X className="w-3.5 h-3.5" />}
            isLoading={rejectMutation.isPending}
            onClick={() => rejectMutation.mutate(row.id)}
          >
            Reject
          </Button>
        </div>
      ),
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mb-6">
        <span className="font-mono text-xs text-amber-deep uppercase tracking-wider font-semibold">
          PLATFORM OPS
        </span>
        <h1 className="font-display text-3xl font-bold text-ink dark:text-paper">
          NGO Verification Queue
        </h1>
        <p className="text-sm text-ink-soft dark:text-paper-alt mt-1">
          Review government registration documents and audit legitimacy before granting food claim rights.
        </p>
      </div>

      {isLoading ? (
        <Skeleton variant="table-row" />
      ) : (
        <DataTable columns={columns} data={ngos || []} emptyMessage="No pending NGO verification requests." />
      )}
    </motion.div>
  );
};
