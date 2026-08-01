import React, { useEffect, useState } from 'react';
import { Heading } from '../../components/atoms/Typography';
import { Button } from '../../components/atoms/Button';
import { Callout } from '../../components/molecules/Callout';
import { adminApi, DisputeItem } from '../../api/adminApi';

export const AdminDisputesPage: React.FC = () => {
  const [disputes, setDisputes] = useState<DisputeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeModal, setActiveModal] = useState<DisputeItem | null>(null);
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    fetchDisputes();
  }, []);

  const fetchDisputes = async () => {
    try {
      const data = await adminApi.getDisputes();
      setDisputes(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleResolve = async (newStatus: string) => {
    if (!activeModal) return;
    await adminApi.resolveDispute(activeModal.id, resolutionNotes, newStatus);
    setDisputes(prev => prev.map(d => d.id === activeModal.id ? { ...d, status: newStatus as any, resolution_notes: resolutionNotes } : d));
    setMsg(`Dispute #${activeModal.id} marked as ${newStatus}.`);
    setActiveModal(null);
    setResolutionNotes('');
    setTimeout(() => setMsg(null), 4000);
  };

  if (loading) return <div style={{ padding: '24px' }}>Loading Dispute Resolution Queue...</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <Heading level={2}>Dispute Resolution & Case Mediation</Heading>
        <p style={{ color: 'var(--ink-soft)', marginTop: '4px' }}>
          Resolve delivery delays, quantity mismatches, and food quality disputes between Donors, NGOs, and Volunteers.
        </p>
      </div>

      {msg && <Callout type="teal" title="Case Decision Recorded">{msg}</Callout>}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {disputes.map(disp => (
          <div key={disp.id} style={{ backgroundColor: 'var(--white)', border: '1px solid var(--line)', borderRadius: '6px', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <h3 style={{ margin: 0, fontSize: '18px' }}>{disp.subject}</h3>
                  <span style={{
                    padding: '2px 10px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: 600,
                    backgroundColor: disp.status === 'resolved' ? '#e6f4ea' : disp.status === 'open' ? '#fde8e8' : '#fff3cd',
                    color: disp.status === 'resolved' ? 'var(--green-soft)' : disp.status === 'open' ? 'var(--red-soft)' : 'var(--amber)'
                  }}>
                    {disp.status.toUpperCase()}
                  </span>
                </div>
                <div style={{ fontSize: '14px', color: 'var(--ink-soft)', marginTop: '4px' }}>
                  Filer: <strong>{disp.disputer_name}</strong> • Respondent: <strong>{disp.respondent_name}</strong>
                </div>
                <p style={{ fontSize: '14px', marginTop: '8px', color: 'var(--ink-soft)' }}>
                  {disp.description}
                </p>
                {disp.resolution_notes && (
                  <div style={{ padding: '10px', backgroundColor: 'var(--paper-alt)', borderRadius: '4px', fontSize: '13px', marginTop: '8px' }}>
                    <strong>Admin Resolution Note:</strong> {disp.resolution_notes}
                  </div>
                )}
              </div>

              <div>
                <Button variant="primary" size="small" onClick={() => { setActiveModal(disp); setResolutionNotes(disp.resolution_notes || ''); }}>
                  ⚖️ Mediate / Resolve Case
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Resolution Modal */}
      {activeModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.6)',
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{ backgroundColor: 'var(--white)', padding: '24px', borderRadius: '8px', maxWidth: '550px', width: '90%' }}>
            <Heading level={3}>Mediate Case #{activeModal.id}</Heading>
            <p style={{ color: 'var(--ink-soft)', marginTop: '4px' }}>{activeModal.subject}</p>

            <div style={{ margin: '16px 0' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '6px' }}>Resolution Ruling / Notes:</label>
              <textarea
                rows={4}
                value={resolutionNotes}
                onChange={(e) => setResolutionNotes(e.target.value)}
                placeholder="Enter mediation findings, warning issued, or compensation credit granted..."
                style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid var(--line)' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <Button variant="outline" onClick={() => setActiveModal(null)}>Cancel</Button>
              <Button variant="outline" onClick={() => handleResolve('dismissed')}>Dismiss Case</Button>
              <Button variant="primary" onClick={() => handleResolve('resolved')}>Mark Case Resolved</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
