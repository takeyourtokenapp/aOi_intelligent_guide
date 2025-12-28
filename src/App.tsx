import { Shield, BookOpen, Heart, ArrowRight, Brain, Cpu, Globe } from 'lucide-react';
import { useState } from 'react';
import { Navigation } from './components/Navigation';
import { CrossDomainBridge } from './components/CrossDomainBridge';
import { AoiAssistant } from './components/AoiAssistant';
import { RealtimeStats } from './components/RealtimeStats';
import { ActivityFeed } from './components/ActivityFeed';
import { HeroSection } from './components/HeroSection';
import { DOMAIN_CONFIG } from './config/navigation';
import { UserProgressProvider } from './contexts/UserProgressContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';

function AppContent() {
  const [aoiOpen, setAoiOpen] = useState(false);
  const { t } = useLanguage();

  const handleAoiClick = () => {
    setAoiOpen(true);
  };

  return (
          <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-[#0A0F1A] dark:via-[#1a1f2e] dark:to-[#0A0F1A] text-gray-900 dark:text-white overflow-hidden relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(155,143,217,0.12),transparent_60%)] animate-breathe"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_80%,rgba(143,166,142,0.08),transparent_60%)] animate-pulse-soft" style={{animationDelay: '2s'}}></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_20%,rgba(123,167,188,0.08),transparent_60%)] animate-pulse-soft" style={{animationDelay: '4s'}}></div>

      <div className="relative z-10">
        <Navigation onAoiClick={handleAoiClick} />

        <main className="container mx-auto px-6 py-20">
          <div className="max-w-6xl mx-auto">
            <HeroSection onAoiClick={handleAoiClick} />

            <RealtimeStats />

            <div className="mb-16 p-10 rounded-3xl bg-white/90 dark:bg-gradient-to-br dark:from-[#9B8FD9]/5 dark:via-[#7BA7BC]/5 dark:to-[#8FA68E]/5 border-2 border-[#9B8FD9]/50 dark:border-[#9B8FD9]/20 backdrop-blur-sm shadow-2xl dark:shadow-none">
              <div className="grid md:grid-cols-3 gap-8 mb-10">
                <div className="text-center p-6 rounded-2xl bg-white dark:bg-[#E8B4B8]/5 border-2 border-[#D97B8F] dark:border-[#E8B4B8]/20 hover:border-[#C7637A] dark:hover:border-[#E8B4B8]/40 transition-all animate-breathe shadow-lg dark:shadow-none">
                  <Brain className="w-14 h-14 text-[#D97B8F] dark:text-[#E8B4B8] mx-auto mb-4" strokeWidth={2} />
                  <h3 className="font-bold text-[#D97B8F] dark:text-[#E8B4B8] mb-3 text-lg">{t('layers.knowledge')}</h3>
                  <p className="text-sm text-slate-900 dark:text-gray-100 leading-relaxed font-bold">{t('layers.knowledgeDesc')}</p>
                </div>
                <div className="text-center p-6 rounded-2xl bg-white dark:bg-[#7BA7BC]/5 border-2 border-[#5B8BA0] dark:border-[#7BA7BC]/20 hover:border-[#3E7C9A] dark:hover:border-[#7BA7BC]/40 transition-all animate-breathe shadow-lg dark:shadow-none" style={{animationDelay: '1s'}}>
                  <Cpu className="w-14 h-14 text-[#5B8BA0] dark:text-[#7BA7BC] mx-auto mb-4" strokeWidth={2} />
                  <h3 className="font-bold text-[#5B8BA0] dark:text-[#7BA7BC] mb-3 text-lg">{t('layers.technology')}</h3>
                  <p className="text-sm text-slate-900 dark:text-gray-100 leading-relaxed font-bold">{t('layers.technologyDesc')}</p>
                </div>
                <div className="text-center p-6 rounded-2xl bg-white dark:bg-[#8FA68E]/5 border-2 border-[#6B9070] dark:border-[#8FA68E]/20 hover:border-[#557F5A] dark:hover:border-[#8FA68E]/40 transition-all animate-breathe shadow-lg dark:shadow-none" style={{animationDelay: '2s'}}>
                  <Globe className="w-14 h-14 text-[#6B9070] dark:text-[#8FA68E] mx-auto mb-4" strokeWidth={2} />
                  <h3 className="font-bold text-[#6B9070] dark:text-[#8FA68E] mb-3 text-lg">{t('layers.connection')}</h3>
                  <p className="text-sm text-slate-900 dark:text-gray-100 leading-relaxed font-bold">{t('layers.connectionDesc')}</p>
                </div>
              </div>
              <div className="text-center p-6 rounded-xl bg-gradient-to-r from-[#9B8FD9]/20 to-[#7BA7BC]/20 dark:bg-[#9B8FD9]/5 border-2 border-[#8B7AC7] dark:border-[#9B8FD9]/10">
                <p className="text-[#2C5F7A] dark:text-white text-lg leading-relaxed italic font-bold">
                  "{t('layers.quote')}"
                </p>
                <p className="text-[#6B5AA6] dark:text-[#9B8FD9] text-sm mt-2 font-black">{t('layers.quoteAuthor')}</p>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <a
                href={`${DOMAIN_CONFIG.app.baseUrl}/academy`}
                className="group relative bg-white dark:bg-gradient-to-br dark:from-[#1B2838] dark:to-[#2a3f54] p-8 rounded-2xl border-2 border-[#5B8BA0] dark:border-[#7BA7BC]/30 hover:border-[#3E7C9A] dark:hover:border-[#7BA7BC]/60 transition-all duration-300 hover:scale-105 animate-breathe shadow-2xl dark:shadow-none"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#7BA7BC]/15 dark:from-[#7BA7BC]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
                <div className="relative z-10">
                  <BookOpen className="w-12 h-12 text-[#5B8BA0] dark:text-[#7BA7BC] mb-4" strokeWidth={2} />
                  <h3 className="text-2xl font-bold mb-3 text-slate-900 dark:text-white">{t('cards.academy')}</h3>
                  <p className="text-slate-900 dark:text-gray-100 mb-4 leading-relaxed font-bold">
                    {t('cards.academyDesc')}
                  </p>
                  <div className="flex items-center gap-2 text-[#5B8BA0] dark:text-[#7BA7BC] font-bold group-hover:gap-4 transition-all">
                    <span>{t('cards.academyBtn')}</span>
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </div>
              </a>

              <a
                href={`${DOMAIN_CONFIG.foundation.baseUrl}/knowledge`}
                className="group relative bg-white dark:bg-gradient-to-br dark:from-[#1B2838] dark:to-[#2a3f54] p-8 rounded-2xl border-2 border-[#D97B8F] dark:border-[#E8B4B8]/30 hover:border-[#C7637A] dark:hover:border-[#E8B4B8]/60 transition-all duration-300 hover:scale-105 animate-breathe shadow-2xl dark:shadow-none" style={{animationDelay: '1s'}}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#E8B4B8]/15 dark:from-[#E8B4B8]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
                <div className="relative z-10">
                  <Brain className="w-12 h-12 text-[#D97B8F] dark:text-[#E8B4B8] mb-4" strokeWidth={2} />
                  <h3 className="text-2xl font-bold mb-3 text-slate-900 dark:text-white">{t('cards.knowledge')}</h3>
                  <p className="text-slate-900 dark:text-gray-100 mb-4 leading-relaxed font-bold">
                    {t('cards.knowledgeDesc')}
                  </p>
                  <div className="flex items-center gap-2 text-[#D97B8F] dark:text-[#E8B4B8] font-bold group-hover:gap-4 transition-all">
                    <span>{t('cards.knowledgeBtn')}</span>
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </div>
              </a>

              <a
                href={`${DOMAIN_CONFIG.foundation.baseUrl}/foundation`}
                className="group relative bg-white dark:bg-gradient-to-br dark:from-[#1B2838] dark:to-[#2a3f54] p-8 rounded-2xl border-2 border-[#6B9070] dark:border-[#8FA68E]/30 hover:border-[#557F5A] dark:hover:border-[#8FA68E]/60 transition-all duration-300 hover:scale-105 animate-breathe shadow-2xl dark:shadow-none" style={{animationDelay: '2s'}}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#8FA68E]/15 dark:from-[#8FA68E]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
                <div className="relative z-10">
                  <Heart className="w-12 h-12 text-[#6B9070] dark:text-[#8FA68E] mb-4" strokeWidth={2} />
                  <h3 className="text-2xl font-bold mb-3 text-slate-900 dark:text-white">{t('cards.foundation')}</h3>
                  <p className="text-slate-900 dark:text-gray-100 mb-4 leading-relaxed font-bold">
                    {t('cards.foundationDesc')}
                  </p>
                  <div className="flex items-center gap-2 text-[#6B9070] dark:text-[#8FA68E] font-bold group-hover:gap-4 transition-all">
                    <span>{t('cards.foundationBtn')}</span>
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </div>
              </a>
            </div>

            <div className="mb-12">
              <ActivityFeed />
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-12">
              <CrossDomainBridge type="to-app" />
              <CrossDomainBridge type="to-foundation" />
            </div>

            <div className="bg-white/90 dark:bg-gradient-to-br dark:from-[#9B8FD9]/8 dark:via-[#7BA7BC]/8 dark:to-[#8FA68E]/8 p-10 rounded-3xl border-2 border-[#8B7AC7] dark:border-[#9B8FD9]/30 backdrop-blur-sm shadow-2xl dark:shadow-none">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0">
                  <div className="relative">
                    <div className="absolute inset-0 bg-[#9B8FD9]/30 rounded-full blur-xl animate-pulse-soft"></div>
                    <Shield className="w-20 h-20 text-[#8B7AC7] dark:text-[#9B8FD9] relative z-10" strokeWidth={2} />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-3xl font-bold bg-gradient-to-r from-[#8B7AC7] to-[#5B8BA0] dark:from-[#9B8FD9] dark:to-[#7BA7BC] bg-clip-text text-transparent mb-4">
                    {t('role.title')}
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4 mb-6">
                    <div className="space-y-3">
                      <p className="flex items-start gap-3 text-slate-900 dark:text-gray-100 leading-relaxed font-bold">
                        <span className="text-[#5B8BA0] dark:text-[#7BA7BC] text-xl flex-shrink-0">✓</span>
                        <span>{t('role.item1')}</span>
                      </p>
                      <p className="flex items-start gap-3 text-slate-900 dark:text-gray-100 leading-relaxed font-bold">
                        <span className="text-[#5B8BA0] dark:text-[#7BA7BC] text-xl flex-shrink-0">✓</span>
                        <span>{t('role.item2')}</span>
                      </p>
                      <p className="flex items-start gap-3 text-slate-900 dark:text-gray-100 leading-relaxed font-bold">
                        <span className="text-[#6B9070] dark:text-[#8FA68E] text-xl flex-shrink-0">✓</span>
                        <span>{t('role.item3')}</span>
                      </p>
                    </div>
                    <div className="space-y-3">
                      <p className="flex items-start gap-3 text-slate-900 dark:text-gray-100 leading-relaxed font-bold">
                        <span className="text-[#6B9070] dark:text-[#8FA68E] text-xl flex-shrink-0">✓</span>
                        <span>{t('role.item4')}</span>
                      </p>
                      <p className="flex items-start gap-3 text-slate-900 dark:text-gray-100 leading-relaxed font-bold">
                        <span className="text-[#8B7AC7] dark:text-[#9B8FD9] text-xl flex-shrink-0">✓</span>
                        <span>{t('role.item5')}</span>
                      </p>
                      <p className="flex items-start gap-3 text-slate-900 dark:text-gray-100 leading-relaxed font-bold">
                        <span className="text-[#8B7AC7] dark:text-[#9B8FD9] text-xl flex-shrink-0">✓</span>
                        <span>{t('role.item6')}</span>
                      </p>
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-[#E8B4B8]/30 dark:bg-[#E8B4B8]/10 border-2 border-[#D97B8F] dark:border-[#E8B4B8]/20">
                    <p className="text-sm text-slate-900 dark:text-gray-100 leading-relaxed font-bold">
                      <span className="font-black text-[#C7637A] dark:text-[#E8B4B8]">{t('role.disclaimerLabel')}</span> {t('role.disclaimer')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

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
