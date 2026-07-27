import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../atoms/Button';

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <nav
      style={{
        backgroundColor: 'var(--paper)',
        borderBottom: 'var(--border-hairline)',
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
            borderRadius: 'var(--radius-sm)',
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
