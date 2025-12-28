import { Sun, Moon, Clock } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const { t } = useLanguage();

  const themes = [
    { value: 'light' as const, icon: Sun, label: t('theme.light') },
    { value: 'dark' as const, icon: Moon, label: t('theme.dark') },
    { value: 'auto' as const, icon: Clock, label: t('theme.auto') },
  ];

  return (
    <div className="flex items-center gap-1 p-1 bg-white/5 dark:bg-gray-800/30 backdrop-blur-sm rounded-lg border border-white/10 dark:border-gray-700/50">
      {themes.map(({ value, icon: Icon, label }) => (
        <button
          key={value}
          onClick={() => setTheme(value)}
          className={`
            p-1.5 rounded-md transition-all
            ${theme === value
              ? 'bg-[#9b87f5] text-white shadow-md'
              : 'text-gray-400 dark:text-gray-400 hover:text-gray-200 dark:hover:text-gray-200 hover:bg-white/10 dark:hover:bg-gray-700/50'
            }
          `}
          title={label}
          aria-label={label}
        >
          <Icon className="w-4 h-4" />
        </button>
      ))}
    </div>
  );
}
