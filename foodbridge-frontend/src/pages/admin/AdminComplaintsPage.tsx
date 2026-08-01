import React, { useEffect, useState } from 'react';
import { Heading } from '../../components/atoms/Typography';
import { Button } from '../../components/atoms/Button';
import { Callout } from '../../components/molecules/Callout';
import { adminApi, ComplaintItem } from '../../api/adminApi';

export const AdminComplaintsPage: React.FC = () => {
  const [complaints, setComplaints] = useState<ComplaintItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const data = await adminApi.getComplaints();
      setComplaints(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = (id: string, status: 'investigating' | 'resolved' | 'closed') => {
    setComplaints(prev => prev.map(c => c.id === id ? { ...c, status } : c));
    setMsg(`Complaint status updated to "${status}".`);
    setTimeout(() => setMsg(null), 3000);
  };

  if (loading) return <div style={{ padding: '24px' }}>Loading Complaints & Safety Flags...</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <Heading level={2}>Complaints & Hygiene Safety Flags</Heading>
        <p style={{ color: 'var(--ink-soft)', marginTop: '4px' }}>
          Monitor platform feedback, reported food safety concerns, and technical issues.
        </p>
      </div>

      {msg && <Callout type="teal" title="Status Saved">{msg}</Callout>}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {complaints.map(cmp => (
          <div key={cmp.id} style={{ backgroundColor: 'var(--white)', border: '1px solid var(--line)', borderRadius: '6px', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <h3 style={{ margin: 0, fontSize: '18px' }}>{cmp.subject}</h3>
                  <span style={{
                    padding: '2px 10px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: 600,
                    backgroundColor: cmp.status === 'resolved' ? '#e6f4ea' : cmp.status === 'new' ? '#fde8e8' : '#fff3cd',
                    color: cmp.status === 'resolved' ? 'var(--green-soft)' : cmp.status === 'new' ? 'var(--red-soft)' : 'var(--amber)'
                  }}>
                    {cmp.status.toUpperCase()}
                  </span>
                </div>
                <div style={{ fontSize: '13px', color: 'var(--ink-soft)', marginTop: '4px' }}>
                  Category: <code style={{ textTransform: 'uppercase' }}>{cmp.complaint_type}</code> • Submitted by: <strong>{cmp.complainant_name}</strong>
                </div>
                <p style={{ fontSize: '14px', marginTop: '8px', color: 'var(--ink-soft)' }}>
                  {cmp.details}
                </p>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                {cmp.status !== 'investigating' && (
                  <Button size="small" variant="outline" onClick={() => updateStatus(cmp.id, 'investigating')}>
                    🔍 Investigate
                  </Button>
                )}
                {cmp.status !== 'resolved' && (
                  <Button size="small" variant="primary" onClick={() => updateStatus(cmp.id, 'resolved')}>
                    ✓ Mark Resolved
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
