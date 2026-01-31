import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="terminal-border px-4 py-3 flex items-center gap-3 hover:scale-105 transition-all min-w-[140px]"
      style={{
        background: 'var(--surface-normal)',
        color: 'var(--text-primary)',
      }}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {theme === 'dark' ? (
        <>
          <Sun size={20} />
          <span className="ux4g-body-sm font-bold">Light Mode</span>
        </>
      ) : (
        <>
          <Moon size={20} />
          <span className="ux4g-body-sm font-bold">Dark Mode</span>
        </>
      )}
    </button>
  );
}
