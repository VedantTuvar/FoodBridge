import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Trophy, Award, Flame, Star, Truck, User } from 'lucide-react';
import { volunteerApi } from '../api/volunteerApi';
import { Skeleton } from '../components/atoms/Skeleton';
import { LeaderboardEntry } from '../types';

export const VolunteerLeaderboardPage = () => {
  const [filterPeriod, setFilterPeriod] = useState<'weekly' | 'monthly' | 'all_time'>('weekly');

  const { data: leaderboardData, isLoading } = useQuery({
    queryKey: ['volunteer-leaderboard'],
    queryFn: async () => {
      const res = await volunteerApi.getLeaderboard();
      return res.data.results || [];
    },
  });

  const top3 = leaderboardData?.slice(0, 3) || [];
  const restRank = leaderboardData?.slice(3) || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="font-mono text-xs text-amber uppercase tracking-wider font-semibold">
            CITYWIDE VOLUNTEER RANKINGS
          </span>
          <h1 className="font-display text-3xl font-bold text-ink dark:text-paper">
            Volunteer Leaderboard
          </h1>
          <p className="text-sm text-ink-soft dark:text-paper-alt mt-1">
            Recognizing top surplus food rescuers ranked by total deliveries, kg moved, and 5-star ratings.
          </p>
        </div>

        {/* Filter Period Tabs */}
        <div className="flex items-center gap-1 bg-white dark:bg-night-soft p-1 border border-line rounded-sm self-start font-mono text-xs">
          {(['weekly', 'monthly', 'all_time'] as const).map((period) => (
            <button
              key={period}
              onClick={() => setFilterPeriod(period)}
              className={`px-3 py-1.5 rounded-xs capitalize transition-colors ${
                filterPeriod === period
                  ? 'bg-amber text-white font-bold'
                  : 'text-ink-soft hover:text-ink dark:text-paper-alt'
              }`}
            >
              {period.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <Skeleton variant="card" />
      ) : (
        <>
          {/* Podium Top 3 */}
          {top3.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
              {/* Rank 2 (Silver) */}
              {top3[1] && (
                <motion.div
                  whileHover={{ y: -4 }}
                  className="bg-white dark:bg-night-soft border-2 border-line rounded-sm p-6 text-center space-y-3 relative order-2 md:order-1"
                >
                  <span className="absolute top-2 left-2 font-mono text-xs bg-line/50 text-ink px-2 py-0.5 rounded-full font-bold">
                    🥈 Rank #2
                  </span>
                  <div className="w-16 h-16 rounded-full bg-line/30 text-ink mx-auto flex items-center justify-center text-2xl font-bold border-2 border-line">
                    <User className="w-8 h-8 text-ink-soft" />
                  </div>
                  <h3 className="font-display text-lg font-bold text-ink dark:text-paper">
                    {top3[1].full_name}
                  </h3>
                  <div className="font-mono text-xs text-amber font-bold">
                    {top3[1].total_deliveries} Deliveries • {top3[1].total_kg} kg
                  </div>
                </motion.div>
              )}

              {/* Rank 1 (Gold - Elevated) */}
              {top3[0] && (
                <motion.div
                  whileHover={{ y: -6 }}
                  className="bg-amber/10 dark:bg-night-soft border-2 border-amber rounded-sm p-6 text-center space-y-3 relative order-1 md:order-2 transform md:-translate-y-3 shadow-md"
                >
                  <span className="absolute top-2 left-2 font-mono text-xs bg-amber text-white px-2.5 py-0.5 rounded-full font-bold">
                    🥇 Rank #1 CHAMPION
                  </span>
                  <div className="w-20 h-20 rounded-full bg-amber/20 text-amber mx-auto flex items-center justify-center text-3xl font-bold border-4 border-amber shadow-sm">
                    <Trophy className="w-10 h-10 text-amber" />
                  </div>
                  <h3 className="font-display text-xl font-bold text-ink dark:text-paper">
                    {top3[0].full_name}
                  </h3>
                  <div className="font-mono text-sm text-amber font-bold">
                    {top3[0].total_deliveries} Deliveries • {top3[0].total_kg} kg
                  </div>
                  <span className="inline-block text-[11px] font-mono bg-amber/20 text-amber px-3 py-1 rounded-full font-bold">
                    {top3[0].points} Impact Points
                  </span>
                </motion.div>
              )}

              {/* Rank 3 (Bronze) */}
              {top3[2] && (
                <motion.div
                  whileHover={{ y: -4 }}
                  className="bg-white dark:bg-night-soft border-2 border-line rounded-sm p-6 text-center space-y-3 relative order-3"
                >
                  <span className="absolute top-2 left-2 font-mono text-xs bg-amber/20 text-amber-deep px-2 py-0.5 rounded-full font-bold">
                    🥉 Rank #3
                  </span>
                  <div className="w-16 h-16 rounded-full bg-amber/10 text-amber-deep mx-auto flex items-center justify-center text-2xl font-bold border-2 border-amber/30">
                    <User className="w-8 h-8 text-amber-deep" />
                  </div>
                  <h3 className="font-display text-lg font-bold text-ink dark:text-paper">
                    {top3[2].full_name}
                  </h3>
                  <div className="font-mono text-xs text-amber font-bold">
                    {top3[2].total_deliveries} Deliveries • {top3[2].total_kg} kg
                  </div>
                </motion.div>
              )}
            </div>
          )}

          {/* Full Leaderboard Table */}
          <div className="bg-white dark:bg-night-soft border border-line rounded-sm overflow-hidden shadow-sm">
            <div className="p-4 bg-paper-alt dark:bg-night border-b border-line font-mono text-xs font-semibold text-ink-soft uppercase tracking-wider flex justify-between">
              <span>Volunteer Hero</span>
              <span>Performance Metrics</span>
            </div>

            <div className="divide-y divide-line font-mono text-xs">
              {leaderboardData?.map((entry) => (
                <div
                  key={entry.id}
                  className={`p-4 flex items-center justify-between transition-colors ${
                    entry.is_current_user
                      ? 'bg-amber/10 dark:bg-amber/20 font-bold border-l-4 border-amber'
                      : 'hover:bg-paper-alt dark:hover:bg-night'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 text-center font-bold text-ink-soft">
                      #{entry.rank}
                    </span>
                    <div>
                      <div className="font-sans text-sm font-bold text-ink dark:text-paper flex items-center gap-2">
                        {entry.full_name}
                        {entry.is_current_user && (
                          <span className="text-[10px] bg-amber text-white px-2 py-0.2 rounded-full uppercase">
                            YOU
                          </span>
                        )}
                      </div>
                      <span className="text-ink-soft text-[11px]">
                        Vehicle: {entry.vehicle_type}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <span className="text-ink dark:text-paper font-bold block">
                        {entry.total_deliveries} Jobs
                      </span>
                      <span className="text-ink-soft text-[11px]">{entry.total_kg} kg</span>
                    </div>
                    <div className="text-right min-w-[70px]">
                      <span className="text-amber font-bold flex items-center justify-end gap-1">
                        <Star className="w-3 h-3 fill-amber" /> {entry.rating_avg.toFixed(1)}
                      </span>
                      <span className="text-ink-soft text-[11px]">{entry.points} pts</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
};
