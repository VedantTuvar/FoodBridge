import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Star, MessageSquare, User, CheckCircle2, ShieldCheck, Heart } from 'lucide-react';
import { ratingApi } from '../api/ratingApi';
import { Skeleton } from '../components/atoms/Skeleton';
import { Rating } from '../types';

export const VolunteerRatingsPage = () => {
  const { data: ratingsData, isLoading } = useQuery({
    queryKey: ['volunteer-ratings'],
    queryFn: async () => {
      const res = await ratingApi.getRatings();
      return res.data.results || [];
    },
  });

  const mockFeedback: Rating[] = [
    {
      id: 'r-1',
      task: 't-101',
      rated_by: 'u-99',
      rated_by_name: 'Hope Community Shelter',
      rated_user: 'v-1',
      score: 5,
      comment: 'Prompt delivery! Food was still piping hot upon arrival. Extremely polite volunteer.',
      created_at: new Date().toISOString(),
    },
    {
      id: 'r-2',
      task: 't-102',
      rated_by: 'u-98',
      rated_by_name: 'Golden Gate Catering',
      rated_user: 'v-1',
      score: 5,
      comment: 'Handled 40kg of surplus food with great care. Seamless pickup experience.',
      created_at: new Date(Date.now() - 86400000).toISOString(),
    },
  ];

  const ratingsList = ratingsData && ratingsData.length > 0 ? ratingsData : mockFeedback;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div>
        <span className="font-mono text-xs text-amber uppercase tracking-wider font-semibold">
          COMMUNITY FEEDBACK & REPUTATION
        </span>
        <h1 className="font-display text-3xl font-bold text-ink dark:text-paper">
          Volunteer Ratings & Reviews
        </h1>
        <p className="text-sm text-ink-soft dark:text-paper-alt mt-1">
          Feedback and star ratings submitted by surplus food donors and shelter coordinators.
        </p>
      </div>

      {/* Overview Rating Banner */}
      <div className="bg-white dark:bg-night-soft border border-line rounded-sm p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="text-center bg-amber/10 border border-amber/30 p-4 rounded-sm">
            <div className="font-display text-4xl font-extrabold text-amber">5.0</div>
            <div className="flex justify-center text-amber mt-1">
              {'⭐'.repeat(5)}
            </div>
            <span className="text-[10px] font-mono text-ink-soft mt-1 block">
              100% Positive Feedback
            </span>
          </div>

          <div>
            <h3 className="font-display text-lg font-bold text-ink dark:text-paper">
              Exemplary Service Badge Status
            </h3>
            <p className="text-xs text-ink-soft max-w-md mt-0.5">
              Your consistent 5-star ratings qualify you for priority dispatch on urgent, perishable surplus food listings.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs text-green-soft font-bold bg-paper-alt dark:bg-night p-3 border border-line rounded-sm">
          <ShieldCheck className="w-4 h-4" /> Verified FoodBridge Ambassador
        </div>
      </div>

      {isLoading ? (
        <Skeleton variant="card" />
      ) : (
        <div className="space-y-4">
          <h3 className="font-mono text-xs text-ink-soft uppercase tracking-wider font-semibold">
            FEEDBACK FROM DONORS & NGO SHELTERS ({ratingsList.length})
          </h3>

          {ratingsList.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-night-soft border border-line rounded-sm p-6 shadow-sm space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-teal/10 text-teal flex items-center justify-center font-bold">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-display text-base font-bold text-ink dark:text-paper">
                      {item.rated_by_name || 'Donor / NGO Partner'}
                    </h4>
                    <span className="font-mono text-[11px] text-ink-soft">
                      {new Date(item.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-amber">
                  {'⭐'.repeat(item.score)}
                </div>
              </div>

              {item.comment && (
                <p className="text-xs font-sans text-ink dark:text-paper-alt bg-paper-alt dark:bg-night p-3 rounded-sm border border-line italic">
                  "{item.comment}"
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};
