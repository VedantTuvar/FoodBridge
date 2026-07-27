import React, { useEffect, useState } from 'react';
import { donationApi } from '../api/donationApi';
import { ngoApi } from '../api/ngoApi';
import { DonationCard } from '../components/organisms/DonationCard';
import { Heading } from '../components/atoms/Typography';

export const NGOBrowseDonationsPage = () => {
  const [donations, setDonations] = useState([]);

  useEffect(() => {
    donationApi.getDonations().then((res) => setDonations(res.data.results || []));
  }, []);

  const handleClaim = async (donationId) => {
    try {
      await ngoApi.claimDonation(donationId);
      alert('Donation claimed! Volunteer task dispatched.');
      setDonations(donations.filter((d) => d.id !== donationId));
    } catch (err) {
      alert('Failed to claim donation.');
    }
  };

  return (
    <div>
      <Heading level={2}>Available Food Listings Nearby</Heading>
      <p style={{ color: 'var(--ink-soft)', marginBottom: '24px' }}>
        Filter and claim surplus food listings in real time.
      </p>

      {donations.map((d) => (
        <DonationCard key={d.id} donation={d} isNGO={true} onClaim={handleClaim} />
      ))}
    </div>
  );
};
