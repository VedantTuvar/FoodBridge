import React, { useState } from 'react';
import { Heading } from '../../components/atoms/Typography';
import { Button } from '../../components/atoms/Button';
import { Callout } from '../../components/molecules/Callout';

export const AdminSettingsPage: React.FC = () => {
  const [radius, setRadius] = useState('10');
  const [expiryHours, setExpiryHours] = useState('4');
  const [smsThrottle, setSmsThrottle] = useState('5');
  const [maintenance, setMaintenance] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setMsg('System settings updated successfully.');
    setTimeout(() => setMsg(null), 3000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '800px' }}>
      <div>
        <Heading level={2}>Platform System Settings</Heading>
        <p style={{ color: 'var(--ink-soft)', marginTop: '4px' }}>
          Configure global matching thresholds, notification rules, and operational maintenance modes.
        </p>
      </div>

      {msg && <Callout type="teal" title="Configuration Saved">{msg}</Callout>}

      <form onSubmit={handleSave} style={{ backgroundColor: 'var(--white)', border: '1px solid var(--line)', borderRadius: '6px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div>
          <label style={{ display: 'block', fontWeight: 600, fontSize: '14px', marginBottom: '6px' }}>
            Auto-Matching Radius Threshold (km):
          </label>
          <input
            type="number"
            value={radius}
            onChange={(e) => setRadius(e.target.value)}
            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid var(--line)' }}
          />
          <small style={{ color: 'var(--ink-soft)', marginTop: '4px', display: 'block' }}>
            Maximum distance radius for sending automated pickup notifications to nearby volunteers and verified NGOs.
          </small>
        </div>

        <div>
          <label style={{ display: 'block', fontWeight: 600, fontSize: '14px', marginBottom: '6px' }}>
            Perishability Expiry Warning Window (hours):
          </label>
          <input
            type="number"
            value={expiryHours}
            onChange={(e) => setExpiryHours(e.target.value)}
            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid var(--line)' }}
          />
          <small style={{ color: 'var(--ink-soft)', marginTop: '4px', display: 'block' }}>
            Trigger urgency countdown badges when food perishability window drops below this threshold.
          </small>
        </div>

        <div>
          <label style={{ display: 'block', fontWeight: 600, fontSize: '14px', marginBottom: '6px' }}>
            SMS / OTP Notification Throttle (per user/hour):
          </label>
          <input
            type="number"
            value={smsThrottle}
            onChange={(e) => setSmsThrottle(e.target.value)}
            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid var(--line)' }}
          />
        </div>

        <div style={{ paddingTop: '12px', borderTop: '1px solid var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: '15px' }}>System Maintenance Mode</div>
            <div style={{ fontSize: '13px', color: 'var(--ink-soft)' }}>
              Temporarily pause non-critical donation claims during server maintenance.
            </div>
          </div>
          <input
            type="checkbox"
            checked={maintenance}
            onChange={(e) => setMaintenance(e.target.checked)}
            style={{ width: '20px', height: '20px', cursor: 'pointer' }}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '12px' }}>
          <Button variant="primary" type="submit">Save System Configuration</Button>
        </div>
      </form>
    </div>
  );
};
