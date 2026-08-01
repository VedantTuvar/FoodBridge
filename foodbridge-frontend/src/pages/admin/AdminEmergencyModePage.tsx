import React, { useState } from 'react';
import { Heading } from '../../components/atoms/Typography';
import { Button } from '../../components/atoms/Button';
import { Callout } from '../../components/molecules/Callout';
import { adminApi } from '../../api/adminApi';

export const AdminEmergencyModePage: React.FC = () => {
  const [emergencyActive, setEmergencyActive] = useState(false);
  const [alertMessage, setAlertMessage] = useState('CRISIS ALERT: High-priority shelter demand active in North District. All available volunteers please check pickup tasks.');
  const [broadcastTarget, setBroadcastTarget] = useState('all');
  const [msg, setMsg] = useState<string | null>(null);

  const handleToggleEmergency = async () => {
    const nextState = !emergencyActive;
    await adminApi.toggleEmergencyMode(nextState, alertMessage);
    setEmergencyActive(nextState);
    setMsg(nextState ? '🚨 DISASTER EMERGENCY MODE ACTIVATED PLATFORM-WIDE.' : 'Emergency mode deactivated. Restored normal operations.');
    setTimeout(() => setMsg(null), 4000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <Heading level={2}>Disaster Response & Emergency Mode</Heading>
        <p style={{ color: 'var(--ink-soft)', marginTop: '4px' }}>
          Mobilize maximum volunteer capacity and prioritize emergency food requests during natural disasters or urban crises.
        </p>
      </div>

      {msg && (
        <Callout type={emergencyActive ? 'amber' : 'teal'} title="Emergency Protocol Update">
          {msg}
        </Callout>
      )}

      {/* Emergency Toggle Card */}
      <div style={{
        backgroundColor: emergencyActive ? '#fff8f0' : 'var(--white)',
        border: emergencyActive ? '2px solid var(--amber)' : '1px solid var(--line)',
        borderRadius: '6px',
        padding: '24px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '20px', color: emergencyActive ? 'var(--amber)' : 'var(--ink)' }}>
              {emergencyActive ? '🚨 Emergency Mode Status: ACTIVE' : 'Emergency Mode Status: STANDBY (INACTIVE)'}
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--ink-soft)', marginTop: '6px', maxWidth: '600px' }}>
              Activating emergency mode overrides standard distance limits, prioritizes disaster shelter food requests, and triggers push broadcasts to all active volunteers.
            </p>
          </div>
          <Button
            variant={emergencyActive ? 'outline' : 'primary'}
            style={{ backgroundColor: emergencyActive ? 'var(--red-soft)' : 'var(--amber)', color: 'white', border: 'none' }}
            onClick={handleToggleEmergency}
          >
            {emergencyActive ? '⏹ Deactivate Emergency Protocol' : '🚨 ACTIVATE EMERGENCY MODE'}
          </Button>
        </div>
      </div>

      {/* Broadcast Alert Creator */}
      <div style={{ backgroundColor: 'var(--white)', border: '1px solid var(--line)', borderRadius: '6px', padding: '24px' }}>
        <Heading level={3}>Crisis Push Broadcast Dispatcher</Heading>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '6px' }}>Broadcast Message Text:</label>
            <textarea
              rows={3}
              value={alertMessage}
              onChange={(e) => setAlertMessage(e.target.value)}
              style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid var(--line)' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '6px' }}>Target Audience:</label>
            <select
              value={broadcastTarget}
              onChange={(e) => setBroadcastTarget(e.target.value)}
              style={{ padding: '10px', borderRadius: '4px', border: '1px solid var(--line)', width: '250px' }}
            >
              <option value="all">All Platform Users (Push + In-App)</option>
              <option value="volunteers">Volunteers Only (Pickup Mobilization)</option>
              <option value="ngos">NGO Shelters & Food Banks</option>
              <option value="donors">Commercial Food Donors</option>
            </select>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="primary"
              onClick={() => {
                setMsg(`Broadcast alert sent to ${broadcastTarget.toUpperCase()} target audience.`);
                setTimeout(() => setMsg(null), 3000);
              }}
            >
              📢 Dispatch Crisis Broadcast
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
