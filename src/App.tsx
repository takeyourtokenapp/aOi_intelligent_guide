import { useState } from 'react';
import { Navigation } from './components/Navigation';
import { AoiAssistant } from './components/AoiAssistant';
import { DOMAIN_CONFIG } from './config/navigation';
import { UserProgressProvider } from './contexts/UserProgressContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import HomePage from './pages/HomePage';
import FoundationPage from './pages/FoundationPage';
import AcademyPage from './pages/AcademyPage';
import ContactPage from './pages/ContactPage';
import GrantsPage from './pages/GrantsPage';
import TransparencyPage from './pages/TransparencyPage';

type PageType = 'home' | 'foundation' | 'academy' | 'contact' | 'grants' | 'transparency';
type FoundationTab = 'about' | 'research' | 'manifesto' | 'updates';

function AppContent() {
  const [aoiOpen, setAoiOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const [foundationTab, setFoundationTab] = useState<FoundationTab>('about');
  const { t } = useLanguage();

  const handleAoiClick = () => {
    setAoiOpen(true);
  };

  const handleNavigate = (page: PageType, tab?: FoundationTab) => {
    setCurrentPage(page);
    if (page === 'foundation' && tab) {
      setFoundationTab(tab);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-[#0A0F1A] dark:via-[#1a1f2e] dark:to-[#0A0F1A] text-gray-900 dark:text-white overflow-hidden relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(155,143,217,0.12),transparent_60%)] animate-breathe"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_80%,rgba(143,166,142,0.08),transparent_60%)] animate-pulse-soft" style={{animationDelay: '2s'}}></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_20%,rgba(123,167,188,0.08),transparent_60%)] animate-pulse-soft" style={{animationDelay: '4s'}}></div>

      <div className="relative z-10">
        <Navigation onAoiClick={handleAoiClick} onNavigate={handleNavigate} currentPage={currentPage} />

        {currentPage === 'home' && <HomePage onAoiClick={handleAoiClick} onNavigate={handleNavigate} />}
        {currentPage === 'foundation' && <FoundationPage initialTab={foundationTab} />}
        {currentPage === 'academy' && <AcademyPage />}
        {currentPage === 'contact' && <ContactPage />}
        {currentPage === 'grants' && <GrantsPage />}
        {currentPage === 'transparency' && <TransparencyPage />}

        <footer className="container mx-auto px-6 py-12 border-t-2 border-[#9B8FD9]/40 dark:border-[#9B8FD9]/20">
          <div className="text-center text-slate-600 dark:text-gray-300 text-sm space-y-3">
            <p className="text-[#2C5F7A] dark:text-white font-black text-base">
              {t('footer.tagline')}
            </p>
            <div className="flex items-center justify-center gap-4 text-sm font-bold">
              <a href={DOMAIN_CONFIG.app.baseUrl} className="text-slate-800 dark:text-gray-200 hover:text-[#5B8BA0] dark:hover:text-[#7BA7BC] transition-colors">
                takeyourtoken.app
              </a>
              <span className="text-[#6B5AA6] dark:text-[#9B8FD9] text-lg">葵</span>
              <a href={DOMAIN_CONFIG.foundation.baseUrl} className="text-slate-800 dark:text-gray-200 hover:text-[#D97B8F] dark:hover:text-[#E8B4B8] transition-colors">
                tyt.foundation
              </a>
            </div>
            <p className="text-xs text-slate-700 dark:text-gray-300 mt-4 font-bold">
              {t('footer.mission2')}
            </p>
          </div>
        </footer>
      </div>

      <AoiAssistant isOpen={aoiOpen} onOpenChange={setAoiOpen} />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <UserProgressProvider>
          <AppContent />
        </UserProgressProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
