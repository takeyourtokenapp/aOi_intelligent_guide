import { Globe } from 'lucide-react';
import { Language, useLanguage } from '../contexts/LanguageContext';
import { useState, useRef, useEffect } from 'react';

export function LanguageSwitcher() {
  const { language, setLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const languages: { value: Language; label: string; flag: string }[] = [
    { value: 'en', label: t('lang.en'), flag: '🇬🇧' },
    { value: 'ru', label: t('lang.ru'), flag: '🇷🇺' },
    { value: 'he', label: t('lang.he'), flag: '🇮🇱' },
  ];

  const currentLang = languages.find(l => l.value === language);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-white/10 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg hover:bg-white/20 dark:hover:bg-gray-700/50 transition-all"
        aria-label={t('lang.label')}
      >
        <Globe className="w-4 h-4 text-gray-600 dark:text-gray-300" />
        <span className="text-xl">{currentLang?.flag}</span>
        <span className="text-sm text-gray-600 dark:text-gray-300 hidden sm:inline">
          {currentLang?.label}
        </span>
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50 min-w-[160px]">
          {languages.map((lang) => (
            <button
              key={lang.value}
              onClick={() => {
                setLanguage(lang.value);
                setIsOpen(false);
              }}
              className={`
                w-full flex items-center gap-3 px-4 py-3 text-left transition-colors
                ${language === lang.value
                  ? 'bg-[#9b87f5] text-white'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }
              `}
            >
              <span className="text-xl">{lang.flag}</span>
              <span className="text-sm font-medium">{lang.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
