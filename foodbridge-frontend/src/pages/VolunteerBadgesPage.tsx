import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Award, ShieldCheck, Printer, Download, Sparkles, CheckCircle2, Star, Flame, Trophy } from 'lucide-react';
import { volunteerApi } from '../api/volunteerApi';
import { Button } from '../components/atoms/Button';
import { Skeleton } from '../components/atoms/Skeleton';
import { VolunteerBadge } from '../types';

export const VolunteerBadgesPage = () => {
  const [showCertModal, setShowCertModal] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['volunteer-badges'],
    queryFn: async () => {
      const res = await volunteerApi.getBadges();
      return res.data;
    },
  });

  const badges = data?.badges || [];
  const cert = data?.certificate;
  const stats = data?.stats;

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
            GAMIFICATION & RECOGNITION
          </span>
          <h1 className="font-display text-3xl font-bold text-ink dark:text-paper">
            Badges & Impact Achievements
          </h1>
          <p className="text-sm text-ink-soft dark:text-paper-alt mt-1">
            Earn badges, build delivery streaks, and generate your official FoodBridge Impact Certificate.
          </p>
        </div>

        <Button
          variant="amber"
          size="md"
          onClick={() => setShowCertModal(true)}
          className="shrink-0 font-mono text-xs flex items-center gap-2"
        >
          <Award className="w-4 h-4" /> View Impact Certificate
        </Button>
      </div>

      {isLoading ? (
        <Skeleton variant="card" />
      ) : (
        <>
          {/* Badge Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {badges.map((badge) => (
              <motion.div
                key={badge.id}
                whileHover={{ y: -3 }}
                className={`border rounded-sm p-6 relative overflow-hidden transition-all shadow-sm ${
                  badge.unlocked
                    ? 'bg-white dark:bg-night-soft border-amber/50'
                    : 'bg-paper-alt/50 dark:bg-night border-line opacity-75'
                }`}
              >
                {badge.unlocked && (
                  <span className="absolute top-0 right-0 bg-amber text-white font-mono text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-bl-sm">
                    UNLOCKED
                  </span>
                )}

                <div className="flex items-start gap-4 mb-4">
                  <div
                    className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl shrink-0 ${
                      badge.unlocked
                        ? 'bg-amber/20 border-2 border-amber shadow-xs'
                        : 'bg-line/40 border border-line text-ink-soft'
                    }`}
                  >
                    {badge.icon}
                  </div>

                  <div>
                    <h3 className="font-display text-lg font-bold text-ink dark:text-paper">
                      {badge.title}
                    </h3>
                    <p className="text-xs text-ink-soft mt-0.5">{badge.description}</p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1 font-mono text-[11px]">
                  <div className="flex justify-between text-ink-soft">
                    <span>Unlock Progress</span>
                    <span className="font-bold text-ink dark:text-paper">{badge.progress}%</span>
                  </div>
                  <div className="h-2 bg-line rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${
                        badge.unlocked ? 'bg-amber' : 'bg-teal'
                      }`}
                      style={{ width: `${badge.progress}%` }}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Printable Digital Certificate Modal */}
          {showCertModal && cert && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white text-ink rounded-sm p-8 max-w-2xl w-full shadow-2xl space-y-6 relative border-4 border-amber print:border-none"
              >
                <button
                  onClick={() => setShowCertModal(false)}
                  className="absolute top-4 right-4 text-xs font-mono text-ink-soft hover:text-ink print:hidden"
                >
                  ✕ Close
                </button>

                <div className="text-center space-y-2 border-b-2 border-amber/30 pb-6">
                  <div className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-amber font-bold">
                    <Award className="w-5 h-5" /> OFFICIAL IMPACT CERTIFICATE
                  </div>
                  <h2 className="font-display text-3xl font-extrabold text-ink">
                    FOODBRIDGE COMMUNITY HERO
                  </h2>
                  <p className="text-xs font-mono text-ink-soft">
                    Certificate ID: {cert.certificate_id} | Issued Date: {cert.issue_date}
                  </p>
                </div>

                <div className="text-center space-y-4 py-2">
                  <p className="text-sm font-sans text-ink-soft">
                    This official certificate is proudly presented to
                  </p>
                  <h3 className="font-display text-3xl font-bold text-teal underline decoration-amber underline-offset-8">
                    {cert.volunteer_name || 'Valued Volunteer'}
                  </h3>
                  <p className="text-sm text-ink-soft max-w-lg mx-auto leading-relaxed">
                    in recognition of outstanding dedication, speed, and service in rescuing surplus food and distributing it to local community shelters and food banks.
                  </p>
                </div>

                {/* Certificate Stats Bar */}
                <div className="grid grid-cols-3 gap-4 bg-paper-alt p-4 rounded-sm border border-line text-center font-mono">
                  <div>
                    <span className="text-[10px] text-ink-soft uppercase block">Missions Completed</span>
                    <span className="font-display text-xl font-bold text-ink">{cert.total_deliveries}</span>
                  </div>
                  <div className="border-x border-line">
                    <span className="text-[10px] text-ink-soft uppercase block">Total Food Rescued</span>
                    <span className="font-display text-xl font-bold text-amber">{cert.total_kg_rescued} kg</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-ink-soft uppercase block">Est. Meals Served</span>
                    <span className="font-display text-xl font-bold text-teal">{cert.estimated_meals_served}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-line font-mono text-xs text-ink-soft">
                  <div className="flex items-center gap-1.5 text-green-soft font-bold">
                    <ShieldCheck className="w-4 h-4" /> {cert.verified_by}
                  </div>
                  <div className="flex items-center gap-3 print:hidden">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => window.print()}
                      className="flex items-center gap-1"
                    >
                      <Printer className="w-3.5 h-3.5" /> Print / Save PDF
                    </Button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </>
      )}
    </motion.div>
  );
};
