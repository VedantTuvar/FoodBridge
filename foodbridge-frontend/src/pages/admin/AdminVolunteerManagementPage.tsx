import React, { useEffect, useState } from 'react';
import { Heading } from '../../components/atoms/Typography';
import { Button } from '../../components/atoms/Button';
import { adminApi, VolunteerItem } from '../../api/adminApi';

export const AdminVolunteerManagementPage: React.FC = () => {
  const [volunteers, setVolunteers] = useState<VolunteerItem[]>([]);
  const [vehicleFilter, setVehicleFilter] = useState<string>('all');
  const [search, setSearch] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [dispatchModal, setDispatchModal] = useState<VolunteerItem | null>(null);
  const [dispatchMsg, setDispatchMsg] = useState<string | null>(null);

  useEffect(() => {
    fetchVolunteers();
  }, []);

  const fetchVolunteers = async () => {
    try {
      const data = await adminApi.getVolunteers();
      setVolunteers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredVolunteers = volunteers.filter(v => {
    const matchesVehicle = vehicleFilter === 'all' || v.vehicle_type === vehicleFilter;
    const matchesSearch = v.user_name.toLowerCase().includes(search.toLowerCase()) || v.user_email.toLowerCase().includes(search.toLowerCase());
    return matchesVehicle && matchesSearch;
  });

  const handleManualDispatch = () => {
    if (!dispatchModal) return;
    setDispatchMsg(`Task manually dispatched to ${dispatchModal.user_name}. Notification dispatched.`);
    setTimeout(() => {
      setDispatchMsg(null);
      setDispatchModal(null);
    }, 3000);
  };

  if (loading) return <div style={{ padding: '24px' }}>Loading Volunteer Fleet Management...</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <Heading level={2}>Volunteer Fleet Management & Dispatch</Heading>
        <p style={{ color: 'var(--ink-soft)', marginTop: '4px' }}>
          Monitor active volunteers, transport vehicles, availability status, and trigger manual task dispatches.
        </p>
      </div>

      {/* Search & Filters */}
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          type="text"
          placeholder="Search volunteer name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: '8px 14px', borderRadius: '4px', border: '1px solid var(--line)', width: '280px' }}
        />
        <div style={{ display: 'flex', gap: '8px' }}>
          {(['all', 'bike', 'car', 'van', 'on_foot'] as const).map(veh => (
            <Button
              key={veh}
              size="small"
              variant={vehicleFilter === veh ? 'primary' : 'outline'}
              onClick={() => setVehicleFilter(veh)}
            >
              {veh.toUpperCase().replace('_', ' ')}
            </Button>
          ))}
        </div>
      </div>

      {/* Volunteer Fleet Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
        {filteredVolunteers.map(vol => (
          <div key={vol.id} style={{ backgroundColor: 'var(--white)', border: '1px solid var(--line)', borderRadius: '6px', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '18px' }}>{vol.user_name}</h3>
                <div style={{ fontSize: '13px', color: 'var(--ink-soft)', marginTop: '4px' }}>
                  {vol.user_phone} • {vol.user_email}
                </div>
              </div>
              <span style={{
                padding: '2px 8px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: 600,
                backgroundColor: vol.is_available ? '#e6f4ea' : '#f1eee3',
                color: vol.is_available ? 'var(--green-soft)' : 'var(--ink-soft)'
              }}>
                {vol.is_available ? 'ONLINE / AVAILABLE' : 'OFFLINE'}
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', margin: '16px 0', padding: '12px', background: 'var(--paper-alt)', borderRadius: '4px' }}>
              <div>
                <div style={{ fontSize: '12px', color: 'var(--ink-soft)' }}>Vehicle Mode</div>
                <div style={{ fontWeight: 600, textTransform: 'capitalize' }}>🛵 {vol.vehicle_type}</div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: 'var(--ink-soft)' }}>Rating Score</div>
                <div style={{ fontWeight: 600 }}>⭐ {vol.rating_avg} / 5.0</div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: 'var(--ink-soft)' }}>Deliveries</div>
                <div style={{ fontWeight: 600 }}>📦 {vol.total_deliveries}</div>
              </div>
            </div>

            <div style={{ fontSize: '13px', color: 'var(--ink-soft)', marginBottom: '16px' }}>
              Current Hub: <strong>{vol.current_location_name || 'Central District'}</strong>
            </div>

            <Button
              variant="outline"
              size="small"
              style={{ width: '100%' }}
              onClick={() => setDispatchModal(vol)}
            >
              🎯 Manual Task Dispatch
            </Button>
          </div>
        ))}
      </div>

      {/* Manual Dispatch Modal */}
      {dispatchModal && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.6)',
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{ backgroundColor: 'var(--white)', padding: '24px', borderRadius: '8px', maxWidth: '500px', width: '90%' }}>
            <Heading level={3}>Manual Task Dispatch</Heading>
            <p style={{ color: 'var(--ink-soft)', marginTop: '4px' }}>
              Assign an open surplus food pickup directly to <strong>{dispatchModal.user_name}</strong>.
            </p>

            {dispatchMsg ? (
              <div style={{ padding: '12px', backgroundColor: '#e6f4ea', color: 'var(--green-soft)', borderRadius: '4px', margin: '16px 0' }}>
                {dispatchMsg}
              </div>
            ) : (
              <>
                <div style={{ margin: '16px 0' }}>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '6px' }}>Select Unassigned Food Listing:</label>
                  <select style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid var(--line)' }}>
                    <option>Listing #891 - Grand Hyatt (30 kg Bakery Goods)</option>
                    <option>Listing #894 - Fresh Market (15 kg Prepared Salads)</option>
                    <option>Listing #899 - City Bistro (50 kg Dinner Meals)</option>
                  </select>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                  <Button variant="outline" onClick={() => setDispatchModal(null)}>Cancel</Button>
                  <Button variant="primary" onClick={handleManualDispatch}>Dispatch Task Now</Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
