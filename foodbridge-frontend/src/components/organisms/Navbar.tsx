import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../atoms/Button';
import { useNotificationSocket } from '../../hooks/useNotificationSocket';
import { useToast } from '../../context/ToastContext';

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { addToast } = useToast();
  const { latestNotification, unreadCount } = useNotificationSocket(user?.id);

  useEffect(() => {
    if (latestNotification) {
      addToast({
        type: latestNotification.level === 'emergency' ? 'error' : latestNotification.level === 'warning' ? 'info' : 'success',
        title: latestNotification.title,
        message: latestNotification.message,
      });
    }
  }, [latestNotification, addToast]);

  return (
    <nav
      style={{
        backgroundColor: 'var(--paper)',
        borderBottom: '1px solid var(--line)',
        padding: '16px 32px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
        <div
          style={{
            width: '28px',
            height: '28px',
            backgroundColor: 'var(--teal)',
            borderRadius: '3px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--amber)',
            fontWeight: 700,
            fontFamily: 'var(--font-mono)',
          }}
        >
          FB
        </div>
        <span
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '22px',
            fontWeight: 700,
            color: 'var(--ink)',
          }}
        >
          FoodBridge
        </span>
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        {isAuthenticated ? (
          <>
            {/* Real-time Notification Bell Indicator */}
            <div style={{ position: 'relative', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
              <span style={{ fontSize: '18px' }}>🔔</span>
              {unreadCount > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-6px',
                    right: '-8px',
                    backgroundColor: 'var(--amber)',
                    color: '#fff',
                    borderRadius: '10px',
                    padding: '1px 5px',
                    fontSize: '10px',
                    fontWeight: 700,
                  }}
                >
                  {unreadCount}
                </span>
              )}
            </div>

            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--ink-soft)' }}>
              {user?.full_name} ({user?.role?.toUpperCase()})
            </span>
            <Button variant="secondary" size="small" onClick={logout}>
              Sign Out
            </Button>
          </>
        ) : (
          <Link to="/login">
            <Button variant="primary" size="small">
              Sign In
            </Button>
          </Link>
        )}
      </div>
    </nav>
  );
};
