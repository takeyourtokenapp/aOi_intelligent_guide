import { Menu, X, ChevronDown, Heart, Award, FileText, BookOpen, Home, MessageSquare } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { DOMAIN_CONFIG } from '../config/navigation';
import { ThemeSwitcher } from './ThemeSwitcher';
import { LanguageSwitcher } from './LanguageSwitcher';
import { useLanguage } from '../contexts/LanguageContext';
import { AoiNavigationAvatar } from './AoiAvatarVariant';

interface NavigationProps {
  onAoiClick?: () => void;
  onNavigate?: (page: 'home' | 'foundation' | 'academy' | 'contact' | 'grants' | 'transparency') => void;
  currentPage?: 'home' | 'foundation' | 'academy' | 'contact' | 'grants' | 'transparency';
}

export function Navigation({ onAoiClick, onNavigate, currentPage }: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [foundationDropdownOpen, setFoundationDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  const isFoundationSection = currentPage === 'foundation' || currentPage === 'grants' || currentPage === 'transparency';

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setFoundationDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-[#050810]/95 backdrop-blur-lg border-b border-gray-200 dark:border-[#D2A44C]/20 shadow-sm dark:shadow-none">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <button onClick={() => onNavigate?.('home')} className="flex items-center gap-2.5 hover:opacity-80 transition-opacity group">
            <img
              src="/logo.png"
              alt="TYT Logo"
              className="w-9 h-9 object-contain group-hover:scale-105 transition-transform"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const shield = document.createElement('div');
                shield.innerHTML = '<svg class="w-9 h-9 text-[#D2A44C]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>';
                target.parentElement?.insertBefore(shield.firstElementChild!, target);
              }}
            />
            <h1 className="text-lg font-bold text-[#D2A44C] group-hover:text-[#D2A44C]/80 transition-colors">TakeYourToken</h1>
          </button>

          <nav className="hidden lg:flex items-center gap-1">
            <button
              onClick={() => onNavigate?.('home')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                currentPage === 'home'
                  ? 'text-[#D2A44C] bg-[#D2A44C]/10'
                  : 'text-gray-700 dark:text-gray-300 hover:text-[#D2A44C] hover:bg-gray-100 dark:hover:bg-white/5'
              }`}
            >
              <Home size={16} />
              {t('nav.home') || (t('language') === 'en' ? 'Home' : t('language') === 'ru' ? 'Главная' : 'בית')}
            </button>

            <div className="relative" ref={dropdownRef}>
              <button
                onMouseEnter={() => setFoundationDropdownOpen(true)}
                onClick={() => setFoundationDropdownOpen(!foundationDropdownOpen)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  isFoundationSection
                    ? 'text-[#D2A44C] bg-[#D2A44C]/10'
                    : 'text-gray-700 dark:text-gray-300 hover:text-[#D2A44C] hover:bg-gray-100 dark:hover:bg-white/5'
                }`}
              >
                <Heart size={16} />
                {t('nav.foundation')}
                <ChevronDown size={14} className={`transition-transform ${foundationDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {foundationDropdownOpen && (
                <div
                  className="absolute top-full left-0 mt-1 w-56 bg-white dark:bg-[#0A1122] rounded-xl shadow-2xl border border-gray-200 dark:border-[#D2A44C]/20 py-2 z-50"
                  onMouseLeave={() => setFoundationDropdownOpen(false)}
                >
                  <button
                    onClick={() => {
                      onNavigate?.('foundation');
                      setFoundationDropdownOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                      currentPage === 'foundation'
                        ? 'text-[#D2A44C] bg-[#D2A44C]/10'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5'
                    }`}
                  >
                    <Heart size={16} className="flex-shrink-0" />
                    <div className="text-left">
                      <div className="font-medium">{t('nav.foundation.about') || (t('language') === 'en' ? 'About Foundation' : t('language') === 'ru' ? 'О Фонде' : 'אודות הקרן')}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{t('nav.foundation.about.desc') || (t('language') === 'en' ? 'Mission & Impact' : t('language') === 'ru' ? 'Миссия и влияние' : 'משימה והשפעה')}</div>
                    </div>
                  </button>
                  <button
                    onClick={() => {
                      onNavigate?.('grants');
                      setFoundationDropdownOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                      currentPage === 'grants'
                        ? 'text-[#D2A44C] bg-[#D2A44C]/10'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5'
                    }`}
                  >
                    <Award size={16} className="flex-shrink-0" />
                    <div className="text-left">
                      <div className="font-medium">{t('nav.grants') || (t('language') === 'en' ? 'Research Grants' : t('language') === 'ru' ? 'Гранты' : 'מענקי מחקר')}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{t('nav.grants.desc') || (t('language') === 'en' ? 'Active projects' : t('language') === 'ru' ? 'Активные проекты' : 'פרויקטים פעילים')}</div>
                    </div>
                  </button>
                  <button
                    onClick={() => {
                      onNavigate?.('transparency');
                      setFoundationDropdownOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                      currentPage === 'transparency'
                        ? 'text-[#D2A44C] bg-[#D2A44C]/10'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5'
                    }`}
                  >
                    <FileText size={16} className="flex-shrink-0" />
                    <div className="text-left">
                      <div className="font-medium">{t('nav.transparency') || (t('language') === 'en' ? 'Transparency' : t('language') === 'ru' ? 'Прозрачность' : 'שקיפות')}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{t('nav.transparency.desc') || (t('language') === 'en' ? 'Blockchain verified' : t('language') === 'ru' ? 'Блокчейн верификация' : 'מאומת בלוקצ\'יין')}</div>
                    </div>
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={() => onNavigate?.('academy')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                currentPage === 'academy'
                  ? 'text-[#7BA7BC] bg-[#7BA7BC]/10'
                  : 'text-gray-700 dark:text-gray-300 hover:text-[#7BA7BC] hover:bg-gray-100 dark:hover:bg-white/5'
              }`}
            >
              <BookOpen size={16} />
              {t('nav.academy')}
            </button>

            <button
              onClick={() => onNavigate?.('contact')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                currentPage === 'contact'
                  ? 'text-[#7BA7BC] bg-[#7BA7BC]/10'
                  : 'text-gray-700 dark:text-gray-300 hover:text-[#7BA7BC] hover:bg-gray-100 dark:hover:bg-white/5'
              }`}
            >
              <MessageSquare size={16} />
              {t('nav.contact')}
            </button>

            <div className="w-px h-6 bg-gray-300 dark:bg-[#D2A44C]/20 mx-1" />

            <AoiNavigationAvatar onClick={onAoiClick} />

            <div className="flex items-center gap-2 ml-1">
              <LanguageSwitcher />
              <ThemeSwitcher />
            </div>
          </nav>

          <button
            className="lg:hidden text-gray-700 dark:text-gray-300"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden py-4 space-y-2 border-t border-gray-200 dark:border-[#D2A44C]/20">
            <AoiNavigationAvatar
              onClick={() => {
                onAoiClick?.();
                setMobileMenuOpen(false);
              }}
              className="w-full justify-start mb-3"
            />

            <button
              onClick={() => {
                onNavigate?.('home');
                setMobileMenuOpen(false);
              }}
              className={`flex items-center gap-2.5 w-full text-left py-2.5 px-3 rounded-lg transition-all ${
                currentPage === 'home'
                  ? 'text-[#D2A44C] bg-[#D2A44C]/10 font-medium'
                  : 'text-gray-700 dark:text-gray-300'
              }`}
            >
              <Home size={18} />
              {t('nav.home') || (t('language') === 'en' ? 'Home' : t('language') === 'ru' ? 'Главная' : 'בית')}
            </button>

            <div className="space-y-1">
              <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 px-3 py-1">{t('nav.foundation')}</div>
              <button
                onClick={() => {
                  onNavigate?.('foundation');
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center gap-2.5 w-full text-left py-2 px-5 rounded-lg transition-all ${
                  currentPage === 'foundation'
                    ? 'text-[#D2A44C] bg-[#D2A44C]/10 font-medium'
                    : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                <Heart size={16} />
                {t('nav.foundation.about') || (t('language') === 'en' ? 'About Foundation' : t('language') === 'ru' ? 'О Фонде' : 'אודות הקרן')}
              </button>
              <button
                onClick={() => {
                  onNavigate?.('grants');
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center gap-2.5 w-full text-left py-2 px-5 rounded-lg transition-all ${
                  currentPage === 'grants'
                    ? 'text-[#D2A44C] bg-[#D2A44C]/10 font-medium'
                    : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                <Award size={16} />
                {t('nav.grants') || (t('language') === 'en' ? 'Research Grants' : t('language') === 'ru' ? 'Гранты' : 'מענקי מחקר')}
              </button>
              <button
                onClick={() => {
                  onNavigate?.('transparency');
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center gap-2.5 w-full text-left py-2 px-5 rounded-lg transition-all ${
                  currentPage === 'transparency'
                    ? 'text-[#D2A44C] bg-[#D2A44C]/10 font-medium'
                    : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                <FileText size={16} />
                {t('nav.transparency') || (t('language') === 'en' ? 'Transparency' : t('language') === 'ru' ? 'Прозрачность' : 'שקיפות')}
              </button>
            </div>

            <button
              onClick={() => {
                onNavigate?.('academy');
                setMobileMenuOpen(false);
              }}
              className={`flex items-center gap-2.5 w-full text-left py-2.5 px-3 rounded-lg transition-all ${
                currentPage === 'academy'
                  ? 'text-[#7BA7BC] bg-[#7BA7BC]/10 font-medium'
                  : 'text-gray-700 dark:text-gray-300'
              }`}
            >
              <BookOpen size={18} />
              {t('nav.academy')}
            </button>

            <button
              onClick={() => {
                onNavigate?.('contact');
                setMobileMenuOpen(false);
              }}
              className={`flex items-center gap-2.5 w-full text-left py-2.5 px-3 rounded-lg transition-all ${
                currentPage === 'contact'
                  ? 'text-[#7BA7BC] bg-[#7BA7BC]/10 font-medium'
                  : 'text-gray-700 dark:text-gray-300'
              }`}
            >
              <MessageSquare size={18} />
              {t('nav.contact')}
            </button>

            <div className="flex items-center gap-3 pt-3 mt-3 border-t border-gray-200 dark:border-[#D2A44C]/20">
              <LanguageSwitcher />
              <ThemeSwitcher />
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
