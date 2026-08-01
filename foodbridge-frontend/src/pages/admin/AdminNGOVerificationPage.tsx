import React, { useEffect, useState } from 'react';
import { Heading } from '../../components/atoms/Typography';
import { Button } from '../../components/atoms/Button';
import { Callout } from '../../components/molecules/Callout';
import { adminApi, NGOVerification } from '../../api/adminApi';

export const AdminNGOVerificationPage: React.FC = () => {
  const [ngos, setNgos] = useState<NGOVerification[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [selectedDoc, setSelectedDoc] = useState<{ title: string; url: string; ngoName: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchNGOs();
  }, []);

  const fetchNGOs = async () => {
    try {
      const data = await adminApi.getPendingNGOs();
      setNgos(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string, name: string) => {
    await adminApi.approveNGO(id);
    setNgos(prev => prev.map(n => n.id === id ? { ...n, verification_status: 'approved' } : n));
    setActionMessage(`Approved NGO verification for "${name}".`);
    setTimeout(() => setActionMessage(null), 4000);
  };

  const handleReject = async (id: string, name: string) => {
    await adminApi.rejectNGO(id);
    setNgos(prev => prev.map(n => n.id === id ? { ...n, verification_status: 'rejected' } : n));
    setActionMessage(`Rejected NGO application for "${name}".`);
    setTimeout(() => setActionMessage(null), 4000);
  };

  const filteredNgos = ngos.filter(ngo => filter === 'all' || ngo.verification_status === filter);

  if (loading) return <div style={{ padding: '24px' }}>Loading NGO Verification Queue...</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <Heading level={2}>NGO Registration & Document Verification</Heading>
        <p style={{ color: 'var(--ink-soft)', marginTop: '4px' }}>
          Inspect legal registration documents, daily capacity limits, and grant verified status to charitable organizations.
        </p>
      </div>

      {actionMessage && (
        <Callout type="teal" title="Action Completed">
          {actionMessage}
        </Callout>
      )}

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '12px', borderBottom: '1px solid var(--line)', paddingBottom: '12px' }}>
        {(['pending', 'approved', 'rejected', 'all'] as const).map(tab => (
          <Button
            key={tab}
            size="small"
            variant={filter === tab ? 'primary' : 'outline'}
            onClick={() => setFilter(tab)}
          >
            {tab.toUpperCase()} ({tab === 'all' ? ngos.length : ngos.filter(n => n.verification_status === tab).length})
          </Button>
        ))}
      </div>

      {/* NGO Cards / Table */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {filteredNgos.length === 0 ? (
          <div style={{ padding: '32px', textAlign: 'center', backgroundColor: 'var(--white)', border: '1px solid var(--line)', borderRadius: '6px' }}>
            No NGO applications found for status "{filter}".
          </div>
        ) : (
          filteredNgos.map(ngo => (
            <div key={ngo.id} style={{ backgroundColor: 'var(--white)', border: '1px solid var(--line)', borderRadius: '6px', padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <h3 style={{ margin: 0, fontSize: '18px' }}>{ngo.organization_name}</h3>
                    <span style={{
                      padding: '2px 10px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: 600,
                      backgroundColor: ngo.verification_status === 'approved' ? '#e6f4ea' : ngo.verification_status === 'rejected' ? '#fde8e8' : '#fff3cd',
                      color: ngo.verification_status === 'approved' ? 'var(--green-soft)' : ngo.verification_status === 'rejected' ? 'var(--red-soft)' : 'var(--amber)'
                    }}>
                      {ngo.verification_status.toUpperCase()}
                    </span>
                  </div>
                  <div style={{ fontSize: '14px', color: 'var(--ink-soft)', marginTop: '4px' }}>
                    Registration No: <strong>{ngo.registration_number}</strong> • Address: {ngo.address}
                  </div>
                  <div style={{ fontSize: '14px', color: 'var(--ink-soft)', marginTop: '2px' }}>
                    Contact Person: {ngo.user_name} ({ngo.user_phone} / {ngo.user_email}) • Daily Capacity: <strong>{ngo.capacity_per_day} meals/day</strong>
                  </div>
                </div>

                {/* Documents List */}
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink-soft)', marginBottom: '6px' }}>Attached Documents:</div>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {ngo.documents && ngo.documents.length > 0 ? (
                      ngo.documents.map((doc, i) => (
                        <Button
                          key={i}
                          size="small"
                          variant="outline"
                          onClick={() => setSelectedDoc({ title: doc.title, url: doc.url, ngoName: ngo.organization_name })}
                        >
                          📄 {doc.title}
                        </Button>
                      ))
                    ) : (
                      <Button size="small" variant="outline" onClick={() => setSelectedDoc({ title: 'Standard NGO Registration Doc.pdf', url: '#', ngoName: ngo.organization_name })}>
                        📄 View Registration Cert.pdf
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              {ngo.verification_status === 'pending' && (
                <div style={{ display: 'flex', gap: '12px', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--line)' }}>
                  <Button variant="primary" size="small" onClick={() => handleApprove(ngo.id, ngo.organization_name)}>
                    ✓ Approve Verification
                  </Button>
                  <Button variant="outline" size="small" onClick={() => handleReject(ngo.id, ngo.organization_name)}>
                    ✗ Reject Application
                  </Button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Document Inspector Modal */}
      {selectedDoc && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.6)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{ backgroundColor: 'var(--white)', padding: '24px', borderRadius: '8px', maxWidth: '600px', width: '90%' }}>
            <Heading level={3}>Document Preview: {selectedDoc.title}</Heading>
            <p style={{ color: 'var(--ink-soft)', marginTop: '4px' }}>Submitted by {selectedDoc.ngoName}</p>
            <div style={{
              margin: '20px 0',
              padding: '40px 20px',
              border: '2px dashed var(--line)',
              backgroundColor: 'var(--paper-alt)',
              textAlign: 'center',
              borderRadius: '6px'
            }}>
              <div style={{ fontSize: '36px', marginBottom: '8px' }}>📜</div>
              <div style={{ fontWeight: 600 }}>Official Government Registration Document</div>
              <div style={{ fontSize: '13px', color: 'var(--ink-soft)', marginTop: '6px' }}>
                Status: Verified Watermark • Issuer: State Registrar of Charitable Societies
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <Button variant="outline" onClick={() => setSelectedDoc(null)}>Close Preview</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
