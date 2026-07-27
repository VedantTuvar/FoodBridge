import React, { useEffect, useState } from 'react';
import { donationApi } from '../api/donationApi';
import { StatCard } from '../components/molecules/StatCard';
import { DonationCard } from '../components/organisms/DonationCard';
import { Heading } from '../components/atoms/Typography';

export const DonorDashboardPage = () => {
  const [donations, setDonations] = useState([]);

  useEffect(() => {
    donationApi.getDonations().then((res) => setDonations(res.data.results || []));
  }, []);

  return (
    <div>
      <Heading level={2}>Donor Dashboard</Heading>

      <div style={{ display: 'flex', gap: '20px', marginBottom: '32px', flexWrap: 'wrap' }}>
        <StatCard label="Total Food Saved" value="142.5" unit="kg" />
        <StatCard label="Meals Provided" value="407" unit="meals" />
        <StatCard label="CO₂ Avoided" value="356.2" unit="kg" />
      </div>

      <Heading level={3}>Your Active Surplus Listings</Heading>

      {donations.length === 0 ? (
        <div className="card-paper-alt" style={{ textAlign: 'center', padding: '40px' }}>
          <p style={{ color: 'var(--ink-soft)' }}>No active food listings. Create one to get started!</p>
        </div>
      ) : (
        donations.map((d) => <DonationCard key={d.id} donation={d} />)
      )}
    </div>
  );
};
