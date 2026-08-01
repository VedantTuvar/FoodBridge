import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heading } from '../components/atoms/Typography';
import { Button } from '../components/atoms/Button';
import { Callout } from '../components/molecules/Callout';
import { notificationApi, NotificationItem } from '../api/notificationApi';

export const NotificationCenterPage: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread' | 'delivery_update' | 'task_alert' | 'reminder'>('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const data = await notificationApi.getNotifications();
      setNotifications(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkRead = async (id: string) => {
    await notificationApi.markAsRead(id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
  };

  const handleMarkAllRead = async () => {
    await notificationApi.markAllAsRead();
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    setMsg('All notifications marked as read.');
    setTimeout(() => setMsg(null), 3000);
  };

  const filteredNotifications = notifications.filter(n => {
    const matchesFilter = filter === 'all' ? true : filter === 'unread' ? !n.is_read : n.notification_type === filter;
    const matchesSearch = n.title.toLowerCase().includes(search.toLowerCase()) || n.body.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (loading) return <div style={{ padding: '24px' }}>Loading Notification Center...</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '24px', maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <Heading level={2}>🔔 Notification Center</Heading>
          <p style={{ color: 'var(--ink-soft)', marginTop: '4px' }}>
            View and manage in-app alerts, delivery status updates, and perishability reminders.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Button variant="outline" size="small" onClick={() => navigate('/notifications/preferences')}>
            ⚙️ Preferences
          </Button>
          <Button variant="primary" size="small" onClick={handleMarkAllRead}>
            ✓ Mark All Read
          </Button>
        </div>
      </div>

      {msg && <Callout type="teal" title="Notifications Updated">{msg}</Callout>}

      {/* Filter Tabs & Search */}
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          type="text"
          placeholder="Search notifications..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: '8px 14px', borderRadius: '4px', border: '1px solid var(--line)', width: '260px' }}
        />
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {(['all', 'unread', 'delivery_update', 'task_alert', 'reminder'] as const).map(t => (
            <Button
              key={t}
              size="small"
              variant={filter === t ? 'primary' : 'outline'}
              onClick={() => setFilter(t)}
            >
              {t.toUpperCase().replace('_', ' ')}
            </Button>
          ))}
        </div>
      </div>

      {/* Notifications Feed */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {filteredNotifications.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', backgroundColor: 'var(--white)', border: '1px solid var(--line)', borderRadius: '6px', color: 'var(--ink-soft)' }}>
            No notifications match your current filter.
          </div>
        ) : (
          filteredNotifications.map(n => (
            <div
              key={n.id}
              style={{
                backgroundColor: n.is_read ? 'var(--white)' : '#fffdf5',
                borderLeft: n.is_read ? '1px solid var(--line)' : '4px solid var(--amber)',
                borderTop: '1px solid var(--line)',
                borderRight: '1px solid var(--line)',
                borderBottom: '1px solid var(--line)',
                borderRadius: '6px',
                padding: '16px 20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '16px'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h4 style={{ margin: 0, fontSize: '16px', fontWeight: n.is_read ? 600 : 700 }}>{n.title}</h4>
                  {!n.is_read && (
                    <span style={{ fontSize: '10px', fontWeight: 700, backgroundColor: 'var(--amber)', color: '#fff', padding: '1px 6px', borderRadius: '8px' }}>
                      NEW
                    </span>
                  )}
                </div>
                <p style={{ margin: '6px 0 0 0', fontSize: '14px', color: 'var(--ink-soft)' }}>{n.body}</p>
                <div style={{ fontSize: '12px', color: '#999', marginTop: '6px' }}>
                  {new Date(n.created_at).toLocaleString()}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                {n.link && (
                  <Button size="small" variant="outline" onClick={() => navigate(n.link!)}>
                    View Details
                  </Button>
                )}
                {!n.is_read && (
                  <Button size="small" variant="primary" onClick={() => handleMarkRead(n.id)}>
                    ✓ Mark Read
                  </Button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
