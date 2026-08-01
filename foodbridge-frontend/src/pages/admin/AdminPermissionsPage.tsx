import React, { useState } from 'react';
import { Heading } from '../../components/atoms/Typography';
import { Button } from '../../components/atoms/Button';
import { Callout } from '../../components/molecules/Callout';

export const AdminPermissionsPage: React.FC = () => {
  const [msg, setMsg] = useState<string | null>(null);

  const permissionsList = [
    { key: 'view_dashboard', label: 'View Dashboard & Telemetry' },
    { key: 'approve_ngo', label: 'Approve / Reject NGO Verifications' },
    { key: 'approve_donor', label: 'Verify Commercial Donors' },
    { key: 'manage_volunteers', label: 'Volunteer Fleet & Manual Dispatch' },
    { key: 'resolve_disputes', label: 'Resolve Disputes & Case Claims' },
    { key: 'manage_users', label: 'Suspend / Activate Accounts' },
    { key: 'trigger_emergency', label: 'Activate Emergency Disaster Mode' },
    { key: 'export_reports', label: 'Generate & Export Compliance Reports' },
    { key: 'update_settings', label: 'Modify Platform System Settings' },
    { key: 'access_logs', label: 'Inspect Security Audit Logs' },
  ];

  const roles = ['Super Admin', 'Platform Ops Admin', 'Regional Moderator', 'Corporate CSR'];

  // Permission matrix state
  const [matrix, setMatrix] = useState<Record<string, Record<string, boolean>>>({
    'Super Admin': permissionsList.reduce((acc, p) => ({ ...acc, [p.key]: true }), {}),
    'Platform Ops Admin': {
      view_dashboard: true, approve_ngo: true, approve_donor: true, manage_volunteers: true,
      resolve_disputes: true, manage_users: true, trigger_emergency: true, export_reports: true,
      update_settings: false, access_logs: true
    },
    'Regional Moderator': {
      view_dashboard: true, approve_ngo: true, approve_donor: false, manage_volunteers: true,
      resolve_disputes: false, manage_users: false, trigger_emergency: false, export_reports: false,
      update_settings: false, access_logs: false
    },
    'Corporate CSR': {
      view_dashboard: true, approve_ngo: false, approve_donor: false, manage_volunteers: false,
      resolve_disputes: false, manage_users: false, trigger_emergency: false, export_reports: true,
      update_settings: false, access_logs: false
    }
  });

  const togglePermission = (role: string, permKey: string) => {
    setMatrix(prev => ({
      ...prev,
      [role]: {
        ...prev[role],
        [permKey]: !prev[role]?.[permKey]
      }
    }));
  };

  const handleSave = () => {
    setMsg('Granular role permissions matrix saved.');
    setTimeout(() => setMsg(null), 3000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Heading level={2}>Role Permission Matrix (RBAC)</Heading>
          <p style={{ color: 'var(--ink-soft)', marginTop: '4px' }}>
            Configure explicit capability privileges and resource access controls per role.
          </p>
        </div>
        <Button variant="primary" onClick={handleSave}>
          💾 Save Permission Matrix
        </Button>
      </div>

      {msg && <Callout type="teal" title="Permissions Matrix Updated">{msg}</Callout>}

      <div style={{ backgroundColor: 'var(--white)', border: '1px solid var(--line)', borderRadius: '6px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--paper-alt)', borderBottom: '1px solid var(--line)', color: 'var(--ink-soft)', fontSize: '13px' }}>
              <th style={{ padding: '14px 16px' }}>Capability / Permission</th>
              {roles.map(r => (
                <th key={r} style={{ padding: '14px 16px', textAlign: 'center' }}>{r}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {permissionsList.map(perm => (
              <tr key={perm.key} style={{ borderBottom: '1px solid var(--line)', fontSize: '14px' }}>
                <td style={{ padding: '12px 16px', fontWeight: 600 }}>
                  {perm.label}
                  <div style={{ fontSize: '12px', color: 'var(--ink-soft)', fontWeight: 400 }}>
                    <code>{perm.key}</code>
                  </div>
                </td>
                {roles.map(r => (
                  <td key={r} style={{ padding: '12px 16px', textAlign: 'center' }}>
                    <input
                      type="checkbox"
                      checked={!!matrix[r]?.[perm.key]}
                      disabled={r === 'Super Admin'} // Root is immutable
                      onChange={() => togglePermission(r, perm.key)}
                      style={{ width: '18px', height: '18px', cursor: r === 'Super Admin' ? 'not-allowed' : 'pointer' }}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
