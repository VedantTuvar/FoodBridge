import React, { useEffect, useState } from 'react';
import { Heading } from '../components/atoms/Typography';
import { Button } from '../components/atoms/Button';
import { Callout } from '../components/molecules/Callout';
import { notificationApi, NotificationPreferences } from '../api/notificationApi';

export const NotificationPreferencesPage: React.FC = () => {
  const [prefs, setPrefs] = useState<NotificationPreferences>({
    email_enabled: true,
    sms_enabled: true,
    push_enabled: true,
    in_app_enabled: true,
    task_alerts: true,
    delivery_updates: true,
    reminders: true,
    marketing_promos: false,
  });
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    fetchPreferences();
  }, []);

  const fetchPreferences = async () => {
    try {
      const data = await notificationApi.getPreferences();
      setPrefs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = (key: keyof NotificationPreferences) => {
    setPrefs(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await notificationApi.updatePreferences(prefs);
    setMsg('Notification delivery preferences updated.');
    setTimeout(() => setMsg(null), 3000);
  };

  if (loading) return <div style={{ padding: '24px' }}>Loading Notification Preferences...</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
      <div>
        <Heading level={2}>⚙️ Notification & Alert Preferences</Heading>
        <p style={{ color: 'var(--ink-soft)', marginTop: '4px' }}>
          Configure delivery channels (In-App, Push, SMS, Email) and alert categories for surplus food rescue missions.
        </p>
      </div>

      {msg && <Callout type="teal" title="Preferences Saved">{msg}</Callout>}

      <form onSubmit={handleSave} style={{ backgroundColor: 'var(--white)', border: '1px solid var(--line)', borderRadius: '6px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* Delivery Channels Section */}
        <div>
          <Heading level={3}>1. Notification Delivery Channels</Heading>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '12px' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'var(--paper-alt)', borderRadius: '4px' }}>
              <div>
                <strong>📱 In-App Notifications</strong>
                <div style={{ fontSize: '13px', color: 'var(--ink-soft)' }}>Show real-time toast popups and navbar bell count badges inside the web app.</div>
              </div>
              <input type="checkbox" checked={prefs.in_app_enabled} onChange={() => handleToggle('in_app_enabled')} style={{ width: '20px', height: '20px', cursor: 'pointer' }} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'var(--paper-alt)', borderRadius: '4px' }}>
              <div>
                <strong>🔔 Mobile Push Notifications (FCM)</strong>
                <div style={{ fontSize: '13px', color: 'var(--ink-soft)' }}>Send instant mobile push alerts when a volunteer claims or delivers food.</div>
              </div>
              <input type="checkbox" checked={prefs.push_enabled} onChange={() => handleToggle('push_enabled')} style={{ width: '20px', height: '20px', cursor: 'pointer' }} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'var(--paper-alt)', borderRadius: '4px' }}>
              <div>
                <strong>💬 SMS Text Alerts (Twilio)</strong>
                <div style={{ fontSize: '13px', color: 'var(--ink-soft)' }}>Send SMS updates for time-critical pickup windows and driver arrival.</div>
              </div>
              <input type="checkbox" checked={prefs.sms_enabled} onChange={() => handleToggle('sms_enabled')} style={{ width: '20px', height: '20px', cursor: 'pointer' }} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'var(--paper-alt)', borderRadius: '4px' }}>
              <div>
                <strong>📧 Email Summary Reports (SendGrid)</strong>
                <div style={{ fontSize: '13px', color: 'var(--ink-soft)' }}>Receive weekly impact summaries, tax certificates, and delivery confirmations via email.</div>
              </div>
              <input type="checkbox" checked={prefs.email_enabled} onChange={() => handleToggle('email_enabled')} style={{ width: '20px', height: '20px', cursor: 'pointer' }} />
            </div>

          </div>
        </div>

        {/* Alert Categories Section */}
        <div>
          <Heading level={3}>2. Alert Categories</Heading>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '12px' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'var(--paper-alt)', borderRadius: '4px' }}>
              <div>
                <strong>🛵 Nearby Task & Pickup Alerts</strong>
                <div style={{ fontSize: '13px', color: 'var(--ink-soft)' }}>Notify me when new surplus food is listed within my operating radius.</div>
              </div>
              <input type="checkbox" checked={prefs.task_alerts} onChange={() => handleToggle('task_alerts')} style={{ width: '20px', height: '20px', cursor: 'pointer' }} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'var(--paper-alt)', borderRadius: '4px' }}>
              <div>
                <strong>📦 Live Delivery Lifecycle Updates</strong>
                <div style={{ fontSize: '13px', color: 'var(--ink-soft)' }}>Notify me on status transitions (Claimed, Picked Up, In Transit, Delivered).</div>
              </div>
              <input type="checkbox" checked={prefs.delivery_updates} onChange={() => handleToggle('delivery_updates')} style={{ width: '20px', height: '20px', cursor: 'pointer' }} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'var(--paper-alt)', borderRadius: '4px' }}>
              <div>
                <strong>⏰ Perishability Countdown Reminders</strong>
                <div style={{ fontSize: '13px', color: 'var(--ink-soft)' }}>Alert me 1 hour before a food listing reaches its perishability expiration.</div>
              </div>
              <input type="checkbox" checked={prefs.reminders} onChange={() => handleToggle('reminders')} style={{ width: '20px', height: '20px', cursor: 'pointer' }} />
            </div>

          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '12px', borderTop: '1px solid var(--line)' }}>
          <Button variant="primary" type="submit">Save Preferences</Button>
        </div>
      </form>
    </div>
  );
};
