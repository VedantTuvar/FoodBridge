import React, { useEffect, useState } from 'react';
import { Heading } from '../../components/atoms/Typography';
import { Button } from '../../components/atoms/Button';
import { adminApi, AuditLogItem } from '../../api/adminApi';

export const AdminLogsPage: React.FC = () => {
  const [logs, setLogs] = useState<AuditLogItem[]>([]);
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [search, setSearch] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const data = await adminApi.getAuditLogs();
      setLogs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = logs.filter(l => {
    const matchesSev = severityFilter === 'all' || l.severity === severityFilter;
    const matchesSearch = l.description.toLowerCase().includes(search.toLowerCase()) ||
                          l.actor_name.toLowerCase().includes(search.toLowerCase()) ||
                          l.action.toLowerCase().includes(search.toLowerCase());
    return matchesSev && matchesSearch;
  });

  if (loading) return <div style={{ padding: '24px' }}>Loading System Audit Log Stream...</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <Heading level={2}>System & Security Audit Logs</Heading>
        <p style={{ color: 'var(--ink-soft)', marginTop: '4px' }}>
          Immutable log stream recording admin actions, verification decisions, security events, and configuration edits.
        </p>
      </div>

      {/* Filter Controls */}
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          type="text"
          placeholder="Filter logs by actor, action, or description..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: '8px 14px', borderRadius: '4px', border: '1px solid var(--line)', width: '320px' }}
        />
        <div style={{ display: 'flex', gap: '8px' }}>
          {(['all', 'INFO', 'WARNING', 'CRITICAL'] as const).map(sev => (
            <Button
              key={sev}
              size="small"
              variant={severityFilter === sev ? 'primary' : 'outline'}
              onClick={() => setSeverityFilter(sev)}
            >
              {sev}
            </Button>
          ))}
        </div>
      </div>

      {/* Logs Table */}
      <div style={{ backgroundColor: 'var(--white)', border: '1px solid var(--line)', borderRadius: '6px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--paper-alt)', borderBottom: '1px solid var(--line)', color: 'var(--ink-soft)', fontSize: '13px' }}>
              <th style={{ padding: '12px 16px' }}>Timestamp</th>
              <th style={{ padding: '12px 16px' }}>Actor</th>
              <th style={{ padding: '12px 16px' }}>Action Type</th>
              <th style={{ padding: '12px 16px' }}>Description</th>
              <th style={{ padding: '12px 16px' }}>Severity</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.map(log => (
              <tr key={log.id} style={{ borderBottom: '1px solid var(--line)', fontSize: '14px' }}>
                <td style={{ padding: '12px 16px', color: 'var(--ink-soft)', whiteSpace: 'nowrap' }}>
                  {new Date(log.created_at).toLocaleString()}
                </td>
                <td style={{ padding: '12px 16px', fontWeight: 600 }}>{log.actor_name}</td>
                <td style={{ padding: '12px 16px' }}>
                  <code style={{ fontSize: '12px', padding: '2px 6px', background: 'var(--paper-alt)', borderRadius: '4px' }}>{log.action}</code>
                </td>
                <td style={{ padding: '12px 16px' }}>{log.description}</td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{
                    padding: '2px 8px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: 600,
                    backgroundColor: log.severity === 'CRITICAL' ? '#fde8e8' : log.severity === 'WARNING' ? '#fff3cd' : '#e6f4ea',
                    color: log.severity === 'CRITICAL' ? 'var(--red-soft)' : log.severity === 'WARNING' ? 'var(--amber)' : 'var(--green-soft)'
                  }}>
                    {log.severity}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
