import React from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme, Theme } from '../../context/ThemeContext';

interface ThemeToggleProps {
  className?: string;
  variant?: 'compact' | 'expanded';
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '', variant = 'compact' }) => {
  const { theme, setTheme } = useTheme();

  const options: { id: Theme; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'light', label: 'Light theme', icon: Sun },
    { id: 'dark', label: 'Dark theme', icon: Moon },
    { id: 'system', label: 'System theme', icon: Monitor },
  ];

  if (variant === 'expanded') {
    return (
      <div
        role="radiogroup"
        aria-label="Color theme selection"
        className={`flex items-center gap-1 p-1 rounded-2xl bg-black/30 dark:bg-black/50 border border-black/10 dark:border-white/10 ${className}`}
      >
        {options.map((opt) => {
          const isSelected = theme === opt.id;
          const Icon = opt.icon;
          return (
            <button
              key={opt.id}
              role="radio"
              aria-checked={isSelected}
              onClick={() => setTheme(opt.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-mono font-medium transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 ${
                isSelected
                  ? 'bg-white text-black dark:bg-white/95 dark:text-black font-bold shadow-sm'
                  : 'text-neutral-600 dark:text-white/60 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
              }`}
            >
              <Icon className="w-3.5 h-3.5 shrink-0" />
              <span>{opt.id.charAt(0).toUpperCase() + opt.id.slice(1)}</span>
            </button>
          );
        })}
      </div>
    );
  }

  // Compact variant for floating pill header
  return (
    <div
      role="radiogroup"
      aria-label="Color theme selection"
      className={`inline-flex items-center p-0.5 rounded-full bg-black/10 dark:bg-white/10 border border-black/10 dark:border-white/15 backdrop-blur-md ${className}`}
    >
      {options.map((opt) => {
        const isSelected = theme === opt.id;
        const Icon = opt.icon;
        return (
          <button
            key={opt.id}
            role="radio"
            aria-checked={isSelected}
            aria-label={opt.label}
            title={opt.label}
            onClick={() => setTheme(opt.id)}
            className={`p-1.5 rounded-full transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 ${
              isSelected
                ? 'bg-white text-black dark:bg-white dark:text-black shadow-sm'
                : 'text-neutral-700 dark:text-white/70 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10'
            }`}
          >
            <Icon className="w-3 h-3" />
          </button>
        );
      })}
    </div>
  );
};
