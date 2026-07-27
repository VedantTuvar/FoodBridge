import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ngoApi } from '../api/ngoApi';
import { DataTable, Column } from '../components/organisms/DataTable';
import { Badge } from '../components/atoms/Badge';
import { Skeleton } from '../components/atoms/Skeleton';
import { formatDate } from '../utils/formatters';

export const NGOClaimHistoryPage = () => {
  const { data: claims, isLoading } = useQuery({
    queryKey: ['ngo-claim-history'],
    queryFn: async () => {
      const res = await ngoApi.getClaimHistory();
      return res.data.results || [];
    },
  });

  const columns: Column<any>[] = [
    {
      header: 'Claim ID',
      accessor: (row) => <span className="font-mono text-xs text-ink dark:text-paper font-semibold">#{row.id.slice(0, 8)}</span>,
    },
    {
      header: 'Food Item',
      accessor: (row) => row.donation_detail?.food_type || 'Surplus Food',
    },
    {
      header: 'Donor Name',
      accessor: (row) => row.donation_detail?.donor_name || 'Verified Donor',
    },
    {
      header: 'Meals Received',
      accessor: (row) => <span className="font-mono">{row.donation_detail?.estimated_meals || 0} meals</span>,
    },
    {
      header: 'Delivery Status',
      accessor: (row) => <Badge status={row.donation_detail?.status || 'claimed'} />,
    },
    {
      header: 'Claim Date',
      accessor: (row) => <span className="font-mono text-xs">{formatDate(row.claimed_at)}</span>,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mb-6">
        <span className="font-mono text-xs text-teal uppercase tracking-wider font-semibold">
          SHELTER LOGS
        </span>
        <h1 className="font-display text-3xl font-bold text-ink dark:text-paper">
          Claimed Food History
        </h1>
        <p className="text-sm text-ink-soft dark:text-paper-alt mt-1">
          Complete audit trail of all food donations claimed and received by your organization.
        </p>
      </div>

      {isLoading ? (
        <Skeleton variant="table-row" />
      ) : (
        <DataTable columns={columns} data={claims || []} emptyMessage="No claimed donations yet." />
      )}
    </motion.div>
  );
};
