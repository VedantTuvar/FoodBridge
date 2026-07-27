import React from 'react';
import { Link } from 'react-router-dom';
import { Sun, Moon, LogOut, Menu } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../context/ThemeContext';
import { Button } from '../atoms/Button';

export interface NavbarProps {
  onToggleSidebar?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <nav className="bg-paper dark:bg-night border-b border-line px-6 py-4 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center gap-4">
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="md:hidden text-ink dark:text-paper p-1.5 rounded-sm hover:bg-paper-alt"
            aria-label="Toggle menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        <Link to="/" className="flex items-center gap-2.5 text-decoration-none group">
          {/* Bridge SVG Logo Mark */}
          <div className="w-8 h-8 bg-teal rounded-sm flex items-center justify-center text-amber font-mono font-bold text-sm shadow-sm group-hover:bg-teal-deep transition-colors">
            FB
          </div>
          <span className="font-display text-2xl font-bold text-ink dark:text-paper tracking-tight">
            FoodBridge
          </span>
        </Link>
      </div>

      <div className="flex items-center gap-4">
        {/* Dark Mode Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-sm text-ink-soft dark:text-paper-alt hover:text-ink dark:hover:text-paper hover:bg-paper-alt dark:hover:bg-night-soft transition-colors"
          aria-label="Toggle color theme"
        >
          {isDarkMode ? <Sun className="w-5 h-5 text-amber" /> : <Moon className="w-5 h-5" />}
        </button>

        {isAuthenticated ? (
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline font-mono text-xs text-ink-soft dark:text-paper-alt">
              {user?.full_name} <span className="text-teal font-semibold">({user?.role?.toUpperCase()})</span>
            </span>
            <Button
              variant="secondary"
              size="sm"
              onClick={logout}
              leftIcon={<LogOut className="w-3.5 h-3.5" />}
            >
              Sign Out
            </Button>
          </div>
        ) : (
          <Link to="/login">
            <Button variant="primary" size="sm">
              Sign In
            </Button>
          </Link>
        )}
      </div>
    </nav>
  );
};
