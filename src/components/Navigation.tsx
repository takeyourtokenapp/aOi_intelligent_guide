import { Shield, Menu, X, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { DOMAIN_CONFIG } from '../config/navigation';
import { ThemeSwitcher } from './ThemeSwitcher';
import { LanguageSwitcher } from './LanguageSwitcher';
import { useLanguage } from '../contexts/LanguageContext';

interface NavigationProps {
  onAoiClick?: () => void;
  onNavigate?: (page: 'home' | 'foundation' | 'academy') => void;
  currentPage?: 'home' | 'foundation' | 'academy';
}

export function Navigation({ onAoiClick, onNavigate, currentPage }: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t } = useLanguage();

  return (
    <header className="sticky top-0 z-50 bg-white/90 dark:bg-[#050810]/95 backdrop-blur-lg border-b border-gray-200 dark:border-[#D2A44C]/20 shadow-sm dark:shadow-none">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          <button onClick={() => onNavigate?.('home')} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <Shield className="w-10 h-10 text-[#D2A44C]" strokeWidth={1.5} />
            <div>
              <h1 className="text-xl font-bold text-[#D2A44C]">TakeYourToken</h1>
              <p className="text-xs text-gray-500 dark:text-gray-500">Owl Warrior Platform</p>
            </div>
          </button>

          <nav className="hidden md:flex items-center gap-4">
            <button
              onClick={() => onNavigate?.('academy')}
              className={`text-sm font-medium transition-colors ${
                currentPage === 'academy'
                  ? 'text-[#7BA7BC]'
                  : 'text-gray-700 dark:text-gray-300 hover:text-[#7BA7BC]'
              }`}
            >
              {t('nav.academy')}
            </button>
            <button
              onClick={() => onNavigate?.('foundation')}
              className={`text-sm font-medium transition-colors ${
                currentPage === 'foundation'
                  ? 'text-[#D2A44C]'
                  : 'text-gray-700 dark:text-gray-300 hover:text-[#D2A44C]'
              }`}
            >
              {t('nav.foundation')}
            </button>
            <a
              href={`${DOMAIN_CONFIG.app.baseUrl}/dashboard`}
              className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-[#7BA7BC] transition-colors"
            >
              {t('nav.dashboard')}
            </a>

            <button
              onClick={onAoiClick}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-br from-[#D2A44C]/20 to-[#00F0FF]/20 border border-[#D2A44C]/30 hover:border-[#D2A44C]/60 transition-all group"
            >
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#9b87f5] to-[#00F0FF] flex items-center justify-center overflow-hidden ring-2 ring-[#D2A44C]/30">
                  <img
                    src="/aoi/explorer-thinking.png"
                    alt="aOi"
                    className="w-full h-full object-cover object-top scale-150"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                  <span className="absolute inset-0 flex items-center justify-center text-white font-bold text-sm">
                    葵
                  </span>
                </div>
                <Sparkles className="absolute -top-1 -right-1 w-3 h-3 text-[#D2A44C] animate-pulse" />
              </div>
              <div className="text-left">
                <div className="text-sm font-bold text-white flex items-center gap-1">
                  aOi
                  <div className="w-2 h-2 rounded-full bg-[#00FF00] animate-pulse" />
                </div>
                <div className="text-xs text-gray-400 dark:text-gray-500">AI Guide</div>
              </div>
            </button>

            <div className="flex items-center gap-3 ml-2 border-l border-[#D2A44C]/20 pl-4">
              <LanguageSwitcher />
              <ThemeSwitcher />
            </div>
          </nav>

          <button
            className="md:hidden text-gray-700 dark:text-gray-300"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-6 space-y-4 border-t border-gray-200 dark:border-[#D2A44C]/20">
            <div className="flex gap-2 mb-4">
              <div className="flex-1">
                <LanguageSwitcher />
              </div>
            </div>
            <div className="mb-4">
              <ThemeSwitcher />
            </div>

            <button
              onClick={() => {
                onAoiClick?.();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-3 py-3 px-4 rounded-lg bg-gradient-to-br from-[#D2A44C]/20 to-[#00F0FF]/20 border border-[#D2A44C]/30"
            >
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#9b87f5] to-[#00F0FF] flex items-center justify-center overflow-hidden ring-2 ring-[#D2A44C]/30">
                  <img
                    src="/aoi/explorer-thinking.png"
                    alt="aOi"
                    className="w-full h-full object-cover object-top scale-150"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                  <span className="absolute inset-0 flex items-center justify-center text-white font-bold">
                    葵
                  </span>
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#00FF00] border-2 border-[#0A1122] rounded-full animate-pulse" />
              </div>
              <div className="text-left">
                <div className="text-sm font-bold text-white">aOi - AI Guide</div>
                <div className="text-xs text-gray-400 dark:text-gray-500">{t('aoi.ask')}</div>
              </div>
            </button>

            <button
              onClick={() => {
                onNavigate?.('academy');
                setMobileMenuOpen(false);
              }}
              className={`block w-full text-left py-2 transition-colors ${
                currentPage === 'academy'
                  ? 'text-[#7BA7BC]'
                  : 'text-gray-700 dark:text-gray-300 hover:text-[#7BA7BC]'
              }`}
            >
              {t('nav.academy')}
            </button>
            <button
              onClick={() => {
                onNavigate?.('foundation');
                setMobileMenuOpen(false);
              }}
              className={`block w-full text-left py-2 transition-colors ${
                currentPage === 'foundation'
                  ? 'text-[#D2A44C]'
                  : 'text-gray-700 dark:text-gray-300 hover:text-[#D2A44C]'
              }`}
            >
              {t('nav.foundation')}
            </button>
            <a
              href={`${DOMAIN_CONFIG.app.baseUrl}/dashboard`}
              className="block py-2 text-gray-700 dark:text-gray-300 hover:text-[#7BA7BC] transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t('nav.dashboard')}
            </a>
          </div>
        )}
      </div>
    </header>
  );
}
