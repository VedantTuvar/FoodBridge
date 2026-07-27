import React from 'react';
import { motion } from 'framer-motion';
import { Award, Download, Leaf, HeartHandshake, ShieldCheck } from 'lucide-react';
import { StatCard } from '../components/molecules/StatCard';
import { Button } from '../components/atoms/Button';
import { Callout } from '../components/molecules/Callout';

export const DonorImpactPage: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <span className="font-mono text-xs text-teal uppercase tracking-wider font-semibold">
            ESG & SUSTAINABILITY PORTAL
          </span>
          <h1 className="font-display text-3xl font-bold text-ink dark:text-paper">
            Donation Impact & Carbon Analytics
          </h1>
          <p className="text-sm text-ink-soft dark:text-paper-alt mt-1">
            Quantified environmental and social impact metrics calculated in real-time.
          </p>
        </div>

        <Button
          variant="secondary"
          size="md"
          leftIcon={<Download className="w-4 h-4 text-teal" />}
          onClick={() => window.print()}
        >
          Download ESG Certificate (PDF)
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard label="Total Food Rescued" value="1,250" unit="kg" />
        <StatCard label="Nutritious Meals Served" value="3,571" unit="meals" />
        <StatCard label="CO₂ Emissions Avoided" value="3.125" unit="tons" />
      </div>

      {/* Verified ESG Compliance Card */}
      <div className="bg-white dark:bg-night-soft border-2 border-teal rounded-sm p-8 shadow-floating mb-8 relative overflow-hidden">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-teal text-amber rounded-sm flex items-center justify-center font-display font-bold text-xl">
              FB
            </div>
            <div>
              <span className="font-mono text-xs text-teal uppercase tracking-wider font-semibold">
                VERIFIED SUSTAINABILITY CERTIFICATE
              </span>
              <h3 className="font-display text-2xl font-bold text-ink dark:text-paper">
                Zero Food Waste Certified
              </h3>
            </div>
          </div>
          <ShieldCheck className="w-10 h-10 text-teal" />
        </div>

        <p className="text-sm text-ink-soft dark:text-paper-alt mb-6 max-w-2xl">
          This document certifies that <strong>Metro Restaurant Group</strong> has actively diverted surplus food from landfills via the FoodBridge real-time redistribution network, preventing organic waste decomposition and reducing greenhouse gas footprint.
        </p>

        <div className="grid grid-cols-3 gap-4 border-t border-line pt-4 font-mono text-xs">
          <div>
            <span className="text-ink-soft block">CERTIFICATE ID</span>
            <span className="font-semibold text-ink dark:text-paper">FB-2026-88902</span>
          </div>
          <div>
            <span className="text-ink-soft block">AUDIT METHODOLOGY</span>
            <span className="font-semibold text-ink dark:text-paper">EPA WARM 2.5x Standard</span>
          </div>
          <div>
            <span className="text-ink-soft block">ISSUED ON</span>
            <span className="font-semibold text-ink dark:text-paper">July 27, 2026</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
