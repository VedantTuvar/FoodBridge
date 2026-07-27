import React from 'react';
import { NavLink } from 'react-router-dom';

export const Sidebar = ({ links = [] }) => {
  return (
    <aside
      style={{
        width: '260px',
        backgroundColor: 'var(--night)',
        color: 'var(--white)',
        minHeight: 'calc(100vh - 65px)',
        padding: '24px 16px',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              padding: '10px 16px',
              borderRadius: 'var(--radius-sm)',
              fontFamily: 'var(--font-mono)',
              fontSize: '13px',
              textDecoration: 'none',
              backgroundColor: isActive ? 'var(--night-soft)' : 'transparent',
              color: isActive ? 'var(--amber)' : 'var(--code-text)',
              borderLeft: isActive ? '3px solid var(--amber)' : '3px solid transparent',
            })}
          >
            {link.label}
          </NavLink>
        ))}
      </div>
    </aside>
  );
};
