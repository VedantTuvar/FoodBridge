import React, { useEffect, useState } from 'react';
import { Heading } from '../components/atoms/Typography';
import { StatCard } from '../components/molecules/StatCard';
import { Button } from '../components/atoms/Button';
import { Callout } from '../components/molecules/Callout';
import { analyticsApi, GlobalImpactStats } from '../api/analyticsApi';

export const ImpactDashboardPage: React.FC = () => {
  const [impact, setImpact] = useState<GlobalImpactStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchImpact();
  }, []);

  const fetchImpact = async () => {
    try {
      const data = await analyticsApi.getImpactStats();
      setImpact(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div style={{ padding: '24px' }}>Loading Impact Dashboard...</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '24px', maxWidth: '1100px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--teal)', fontWeight: 600, textTransform: 'uppercase' }}>
            🌱 SOCIAL & ENVIRONMENTAL IMPACT
          </span>
          <Heading level={2}>Platform Impact & Carbon Footprint Ledger</Heading>
          <p style={{ color: 'var(--ink-soft)', marginTop: '4px' }}>
            Quantified metrics on food waste diversion, meals served to communities, and greenhouse gas reduction.
          </p>
        </div>
        <Button variant="primary" onClick={() => alert('Impact Certificate Downloaded!')}>
          📜 Download Impact Certificate
        </Button>
      </div>

      <Callout type="teal" title="Environmental Milestone Achieved">
        Over <strong>{impact?.food_saved_tonnes || 48.2} tonnes</strong> of edible surplus food diverted from city landfills, saving <strong>{impact?.carbon_saved_co2_tonnes || 115.6} CO₂ tonnes</strong> in emissions.
      </Callout>

      {/* Primary Big Numerals */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
        <StatCard label="Total Surplus Food Saved" value={impact?.food_saved_tonnes || 48.2} unit="tonnes" />
        <StatCard label="Nutritious Meals Served" value={impact?.meals_served?.toLocaleString() || '128,450'} unit="meals" />
        <StatCard label="Carbon Avoided" value={impact?.carbon_saved_co2_tonnes || 115.68} unit="CO₂ tonnes" />
        <StatCard label="Water Saved" value={(impact?.water_saved_liters || 40970000).toLocaleString()} unit="liters" />
      </div>

      {/* Network Ecosystem Stats */}
      <div style={{ backgroundColor: 'var(--white)', border: '1px solid var(--line)', borderRadius: '6px', padding: '24px' }}>
        <Heading level={3}>Community & Network Reach</Heading>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginTop: '16px' }}>
          <div style={{ padding: '16px', backgroundColor: 'var(--paper-alt)', borderRadius: '4px', textAlign: 'center' }}>
            <div style={{ fontSize: '28px', fontWeight: 700, color: 'var(--teal)' }}>{impact?.active_donors_count || 142}</div>
            <div style={{ fontSize: '13px', color: 'var(--ink-soft)', marginTop: '4px' }}>Verified Business Donors</div>
          </div>
          <div style={{ padding: '16px', backgroundColor: 'var(--paper-alt)', borderRadius: '4px', textAlign: 'center' }}>
            <div style={{ fontSize: '28px', fontWeight: 700, color: 'var(--amber)' }}>{impact?.verified_ngos_count || 58}</div>
            <div style={{ fontSize: '13px', color: 'var(--ink-soft)', marginTop: '4px' }}>Verified NGO Shelters</div>
          </div>
          <div style={{ padding: '16px', backgroundColor: 'var(--paper-alt)', borderRadius: '4px', textAlign: 'center' }}>
            <div style={{ fontSize: '28px', fontWeight: 700, color: 'var(--green-soft)' }}>{impact?.active_volunteers_count || 215}</div>
            <div style={{ fontSize: '13px', color: 'var(--ink-soft)', marginTop: '4px' }}>Active Logistics Volunteers</div>
          </div>
        </div>
      </div>
    </div>
  );
};
