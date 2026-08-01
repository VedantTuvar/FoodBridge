import React, { useEffect, useState } from 'react';
import { Heading } from '../../components/atoms/Typography';
import { Button } from '../../components/atoms/Button';
import { Callout } from '../../components/molecules/Callout';
import { adminApi, DonorVerification } from '../../api/adminApi';

export const AdminDonorVerificationPage: React.FC = () => {
  const [donors, setDonors] = useState<DonorVerification[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    fetchDonors();
  }, []);

  const fetchDonors = async () => {
    try {
      const data = await adminApi.getDonorVerifications();
      setDonors(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string, name: string) => {
    await adminApi.approveDonor(id);
    setDonors(prev => prev.map(d => d.id === id ? { ...d, is_verified: true } : d));
    setMsg(`Approved business verification for "${name}".`);
    setTimeout(() => setMsg(null), 4000);
  };

  if (loading) return <div style={{ padding: '24px' }}>Loading Donor Verification Queue...</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <Heading level={2}>Donor Business Credentials & Verification</Heading>
        <p style={{ color: 'var(--ink-soft)', marginTop: '4px' }}>
          Verify food safety compliance, commercial catering licenses, and tax IDs for corporate and commercial donors.
        </p>
      </div>

      {msg && <Callout type="teal" title="Status Updated">{msg}</Callout>}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {donors.map(donor => (
          <div key={donor.id} style={{ backgroundColor: 'var(--white)', border: '1px solid var(--line)', borderRadius: '6px', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <h3 style={{ margin: 0, fontSize: '18px' }}>{donor.organization_name || donor.user_name}</h3>
                  <span style={{
                    padding: '2px 10px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: 600,
                    backgroundColor: donor.is_verified ? '#e6f4ea' : '#fff3cd',
                    color: donor.is_verified ? 'var(--green-soft)' : 'var(--amber)'
                  }}>
                    {donor.is_verified ? 'VERIFIED DONOR' : 'VERIFICATION PENDING'}
                  </span>
                </div>
                <div style={{ fontSize: '14px', color: 'var(--ink-soft)', marginTop: '4px' }}>
                  Donor Category: <strong style={{ textTransform: 'capitalize' }}>{donor.donor_type}</strong> • Location: {donor.address}
                </div>
                <div style={{ fontSize: '14px', color: 'var(--ink-soft)', marginTop: '2px' }}>
                  Primary Contact: {donor.user_name} ({donor.user_phone} / {donor.user_email})
                </div>
                <div style={{ fontSize: '13px', marginTop: '6px' }}>
                  Tax ID: <code>{donor.tax_id || 'TAX-NOT-PROVIDED'}</code> • Food Hygiene Cert: <code>{donor.compliance_cert || 'STANDARD-HYGIENE-VALIDATED'}</code>
                </div>
              </div>

              <div>
                {!donor.is_verified ? (
                  <Button variant="primary" size="small" onClick={() => handleApprove(donor.id, donor.organization_name || donor.user_name)}>
                    ✓ Verify Business License
                  </Button>
                ) : (
                  <Button variant="outline" size="small" disabled>
                    ✓ Verified & Compliant
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
