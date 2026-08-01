import React, { useEffect, useState } from 'react';
import { Heading } from '../../components/atoms/Typography';
import { Button } from '../../components/atoms/Button';
import { Callout } from '../../components/molecules/Callout';
import { adminApi, AdminUserItem } from '../../api/adminApi';

export const AdminUserManagementPage: React.FC = () => {
  const [users, setUsers] = useState<AdminUserItem[]>([]);
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [search, setSearch] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await adminApi.getUsers();
      setUsers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id: string, name: string) => {
    await adminApi.toggleUserStatus(id);
    setUsers(prev => prev.map(u => u.id === id ? { ...u, is_active: !u.is_active } : u));
    setMsg(`Toggled status for user "${name}".`);
    setTimeout(() => setMsg(null), 3000);
  };

  const filteredUsers = users.filter(u => {
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    const matchesSearch = u.full_name.toLowerCase().includes(search.toLowerCase()) ||
                          u.email.toLowerCase().includes(search.toLowerCase()) ||
                          u.phone_number.includes(search);
    return matchesRole && matchesSearch;
  });

  if (loading) return <div style={{ padding: '24px' }}>Loading User Directory...</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <Heading level={2}>User Directory & Account Governance</Heading>
        <p style={{ color: 'var(--ink-soft)', marginTop: '4px' }}>
          Search, audit, activate, or suspend accounts across all platform roles (Donors, NGOs, Volunteers, Admins).
        </p>
      </div>

      {msg && <Callout type="teal" title="Account Status Updated">{msg}</Callout>}

      {/* Controls */}
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          type="text"
          placeholder="Search name, email, or phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: '8px 14px', borderRadius: '4px', border: '1px solid var(--line)', width: '300px' }}
        />
        <div style={{ display: 'flex', gap: '8px' }}>
          {(['all', 'donor', 'ngo', 'volunteer', 'admin'] as const).map(role => (
            <Button
              key={role}
              size="small"
              variant={roleFilter === role ? 'primary' : 'outline'}
              onClick={() => setRoleFilter(role)}
            >
              {role.toUpperCase()}
            </Button>
          ))}
        </div>
      </div>

      {/* User Directory Table */}
      <div style={{ backgroundColor: 'var(--white)', border: '1px solid var(--line)', borderRadius: '6px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--paper-alt)', borderBottom: '1px solid var(--line)', color: 'var(--ink-soft)', fontSize: '13px' }}>
              <th style={{ padding: '12px 16px' }}>Full Name</th>
              <th style={{ padding: '12px 16px' }}>Contact</th>
              <th style={{ padding: '12px 16px' }}>Role</th>
              <th style={{ padding: '12px 16px' }}>Verification</th>
              <th style={{ padding: '12px 16px' }}>Account Status</th>
              <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(u => (
              <tr key={u.id} style={{ borderBottom: '1px solid var(--line)', fontSize: '14px' }}>
                <td style={{ padding: '12px 16px', fontWeight: 600 }}>{u.full_name}</td>
                <td style={{ padding: '12px 16px', color: 'var(--ink-soft)' }}>
                  {u.email}<br /><small>{u.phone_number}</small>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <code style={{ textTransform: 'uppercase', padding: '2px 6px', background: 'var(--paper-alt)', borderRadius: '4px' }}>{u.role}</code>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{ color: u.is_verified ? 'var(--green-soft)' : 'var(--amber)', fontWeight: 600 }}>
                    {u.is_verified ? '✓ Verified' : '⏳ Pending'}
                  </span>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{
                    padding: '2px 8px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: 600,
                    backgroundColor: u.is_active ? '#e6f4ea' : '#fde8e8',
                    color: u.is_active ? 'var(--green-soft)' : 'var(--red-soft)'
                  }}>
                    {u.is_active ? 'ACTIVE' : 'SUSPENDED'}
                  </span>
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                  <Button
                    size="small"
                    variant={u.is_active ? 'outline' : 'primary'}
                    onClick={() => handleToggleStatus(u.id, u.full_name)}
                  >
                    {u.is_active ? '🚫 Suspend' : '✓ Reactivate'}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
