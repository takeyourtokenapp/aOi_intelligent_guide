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
    <div className="flex items-center gap-2 p-2 bg-white/10 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg">
      {themes.map(({ value, icon: Icon, label }) => (
        <button
          key={value}
          onClick={() => setTheme(value)}
          className={`
            flex items-center gap-2 px-3 py-2 rounded-md transition-all
            ${theme === value
              ? 'bg-[#9b87f5] text-white shadow-lg shadow-[#9b87f5]/30'
              : 'text-gray-600 dark:text-gray-300 hover:bg-white/20 dark:hover:bg-gray-700/50'
            }
          `}
          title={label}
          aria-label={label}
        >
          <Icon className="w-4 h-4" />
          <span className="text-sm hidden sm:inline">{label}</span>
        </button>
      ))}
    </div>
  );
}
