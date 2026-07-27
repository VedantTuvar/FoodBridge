import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { donationApi } from '../api/donationApi';
import { DataTable, Column } from '../components/organisms/DataTable';
import { Badge } from '../components/atoms/Badge';
import { Skeleton } from '../components/atoms/Skeleton';
import { formatDate, formatKg } from '../utils/formatters';
import { Donation } from '../types';

export const DonationHistoryPage: React.FC = () => {
  const [filter, setFilter] = useState('all');

  const { data: donations, isLoading } = useQuery({
    queryKey: ['donor-donation-history'],
    queryFn: async () => {
      const res = await donationApi.getDonations();
      return (res.data.results || []) as Donation[];
    },
  });

  const filtered = donations?.filter((d) => {
    if (filter === 'all') return true;
    return d.status === filter;
  });

  const columns: Column<Donation>[] = [
    {
      header: 'Food Type',
      accessor: (row) => (
        <div>
          <div className="font-semibold text-ink dark:text-paper">{row.food_type}</div>
          <div className="font-mono text-xs text-ink-soft">ID #{row.id.slice(0, 8)}</div>
        </div>
      ),
    },
    {
      header: 'Quantity',
      accessor: (row) => <span className="font-mono">{formatKg(row.quantity_kg)} ({row.estimated_meals} meals)</span>,
    },
    {
      header: 'Pickup Address',
      accessor: 'pickup_address',
    },
    {
      header: 'Perishability Window',
      accessor: (row) => <span className="font-mono text-xs">{formatDate(row.perishability_window)}</span>,
    },
    {
      header: 'Status',
      accessor: (row) => <Badge status={row.status} />,
    },
    {
      header: 'Date Listed',
      accessor: (row) => <span className="font-mono text-xs">{formatDate(row.created_at)}</span>,
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
          DONOR AUDIT TRAIL
        </span>
        <h1 className="font-display text-3xl font-bold text-ink dark:text-paper">
          Donation History
        </h1>
        <p className="text-sm text-ink-soft dark:text-paper-alt mt-1">
          Complete historical record of all listed, claimed, and fulfilled surplus food items.
        </p>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {['all', 'listed', 'claimed', 'delivered', 'confirmed', 'cancelled', 'expired'].map((st) => (
          <button
            key={st}
            onClick={() => setFilter(st)}
            className={`px-3 py-1.5 rounded-sm font-mono text-xs uppercase tracking-wider transition-colors ${
              filter === st
                ? 'bg-teal text-white font-semibold'
                : 'bg-paper-alt text-ink-soft hover:bg-line'
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      {isLoading ? (
        <Skeleton variant="table-row" />
      ) : (
        <DataTable columns={columns} data={filtered || []} emptyMessage="No donation records found." />
      )}
    </motion.div>
  );
};
