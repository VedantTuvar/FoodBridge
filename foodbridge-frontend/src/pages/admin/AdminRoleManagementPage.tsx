import React, { useState } from 'react';
import { Heading } from '../../components/atoms/Typography';
import { Button } from '../../components/atoms/Button';
import { Callout } from '../../components/molecules/Callout';

export const AdminRoleManagementPage: React.FC = () => {
  const [msg, setMsg] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newRoleName, setNewRoleName] = useState('');

  const [roles, setRoles] = useState([
    { id: 'role-1', name: 'Super Admin', usersCount: 3, description: 'Unrestricted root platform permissions across all modules & settings.', isSystem: true },
    { id: 'role-2', name: 'Platform Ops Admin', usersCount: 8, description: 'Can approve NGOs/donors, resolve disputes, manage tasks, and trigger emergency mode.', isSystem: true },
    { id: 'role-3', name: 'Regional Verification Officer', usersCount: 14, description: 'Scoped to reviewing local NGO documentation and physical audit reports.', isSystem: false },
    { id: 'role-4', name: 'Corporate CSR Manager', usersCount: 42, description: 'Manages branch listings, bulk donations, and downloads ESG compliance reports.', isSystem: false },
  ]);

  const handleCreateRole = () => {
    if (!newRoleName) return;
    setRoles(prev => [...prev, {
      id: `role-${Date.now()}`,
      name: newRoleName,
      usersCount: 0,
      description: 'Custom created administrative role.',
      isSystem: false
    }]);
    setMsg(`Created new role "${newRoleName}".`);
    setNewRoleName('');
    setShowCreateModal(false);
    setTimeout(() => setMsg(null), 3000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Heading level={2}>Role Management & Governance</Heading>
          <p style={{ color: 'var(--ink-soft)', marginTop: '4px' }}>
            Define custom administrative roles, assign operational scopes, and manage user distribution.
          </p>
        </div>
        <Button variant="primary" onClick={() => setShowCreateModal(true)}>
          + Create Custom Role
        </Button>
      </div>

      {msg && <Callout type="teal" title="Role Management">{msg}</Callout>}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {roles.map(r => (
          <div key={r.id} style={{ backgroundColor: 'var(--white)', border: '1px solid var(--line)', borderRadius: '6px', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <h3 style={{ margin: 0, fontSize: '18px' }}>🛡 {r.name}</h3>
              <span style={{
                padding: '2px 8px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: 600,
                backgroundColor: 'var(--paper-alt)',
                color: 'var(--ink-soft)'
              }}>
                {r.usersCount} Assigned Users
              </span>
            </div>
            <p style={{ fontSize: '14px', color: 'var(--ink-soft)', marginTop: '8px', minHeight: '40px' }}>
              {r.description}
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--line)' }}>
              <small style={{ color: 'var(--ink-soft)' }}>{r.isSystem ? 'System Core Role' : 'Custom Defined'}</small>
              <Button size="small" variant="outline">Edit Scope</Button>
            </div>
          </div>
        ))}
      </div>

      {showCreateModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.6)',
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{ backgroundColor: 'var(--white)', padding: '24px', borderRadius: '8px', maxWidth: '450px', width: '90%' }}>
            <Heading level={3}>Create Custom Role</Heading>
            <div style={{ margin: '16px 0' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '6px' }}>Role Title:</label>
              <input
                type="text"
                placeholder="e.g. Quality Inspector, Regional Lead"
                value={newRoleName}
                onChange={(e) => setNewRoleName(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid var(--line)' }}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <Button variant="outline" onClick={() => setShowCreateModal(false)}>Cancel</Button>
              <Button variant="primary" onClick={handleCreateRole}>Save Role</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
