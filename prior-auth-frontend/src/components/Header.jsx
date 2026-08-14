import { Sun, Moon, Bell, Menu } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function Header({ onToggleSidebar }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="flex items-center justify-between px-4 sm:px-6 py-3 bg-header border-b border-border">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          aria-label="Open menu"
          className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg text-text-primary hover:bg-surface-secondary transition-colors"
        >
          <Menu size={20} />
        </button>

        <h1 className="text-base font-semibold text-text-primary hidden sm:block">
          Prior Authorization
        </h1>
      </div>

      <div className="flex items-center gap-3">
        <button
          aria-label="Notifications"
          className="w-9 h-9 flex items-center justify-center rounded-lg border border-border bg-bg text-text-secondary hover:bg-surface-secondary hover:text-text-primary transition-colors"
        >
          <Bell size={18} />
        </button>

        <button
          onClick={toggleTheme}
          aria-label="Toggle dark mode"
          className="w-9 h-9 flex items-center justify-center rounded-lg border border-border bg-bg text-text-primary hover:bg-surface-secondary transition-colors"
        >
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </button>
      </div>
    </header>
  );
}