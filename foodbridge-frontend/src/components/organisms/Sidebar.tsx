import React from 'react';
import { NavLink } from 'react-router-dom';

export interface SidebarLink {
  to: string;
  label: string;
  icon?: React.ReactNode;
}

export interface SidebarProps {
  links: SidebarLink[];
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ links, isOpen = true, onClose }) => {
  return (
    <aside
      className={`fixed md:sticky top-[65px] left-0 z-30 w-[292px] bg-night text-white min-h-[calc(100vh-65px)] p-6 transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}
    >
      <div className="flex flex-col gap-2">
        <span className="font-mono text-[10px] uppercase tracking-widest text-ink-soft mb-2 font-bold px-3">
          NAVIGATION MENU
        </span>
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-sm font-mono text-xs text-decoration-none transition-all ${
                isActive
                  ? 'bg-night-soft text-amber border-l-3 border-amber font-semibold'
                  : 'text-code-text hover:bg-night-soft/50 hover:text-white border-l-3 border-transparent'
              }`
            }
          >
            {link.icon}
            <span>{link.label}</span>
          </NavLink>
        ))}
      </div>
    </aside>
  );
};
