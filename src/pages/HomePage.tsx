import { Shield, BookOpen, Heart, ArrowRight, Brain, Cpu, Globe, Sparkles, Zap, Target } from 'lucide-react';
import { CrossDomainBridge } from '../components/CrossDomainBridge';
import { RealtimeStats } from '../components/RealtimeStats';
import { ActivityFeed } from '../components/ActivityFeed';
import { HeroCarousel } from '../components/HeroCarousel';
import { AcademyStats } from '../components/AcademyStats';
import { DOMAIN_CONFIG } from '../config/navigation';
import { useLanguage } from '../contexts/LanguageContext';

interface HomePageProps {
  onAoiClick: () => void;
  onNavigate?: (page: 'home' | 'foundation' | 'academy', tab?: 'about' | 'research' | 'manifesto' | 'updates') => void;
}

export default function HomePage({ onAoiClick, onNavigate }: HomePageProps) {
  const { t, language } = useLanguage();

  return (
    <main className="container mx-auto px-6 py-20">
      <div className="max-w-6xl mx-auto">
        <HeroCarousel onAoiClick={onAoiClick} onNavigate={onNavigate} />

        <RealtimeStats />

        <div className="mb-16 p-8 md:p-10 rounded-3xl bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-[#1B2838] dark:via-[#2a3f54] dark:to-[#1B2838] border-2 border-purple-200 dark:border-purple-500/30 backdrop-blur-sm shadow-2xl dark:shadow-purple-900/20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-blue-500/5 pointer-events-none"></div>

          <div className="relative z-10">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 dark:from-purple-400 dark:via-blue-400 dark:to-cyan-400 bg-clip-text text-transparent mb-3">
                Three-Layer Architecture
              </h2>
              <p className="text-slate-600 dark:text-gray-400 max-w-2xl mx-auto">
                Knowledge, Technology, and Connection working together
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="group text-center p-6 rounded-2xl bg-gradient-to-br from-white to-pink-50 dark:from-slate-800 dark:to-slate-900 border-2 border-pink-200 dark:border-pink-500/30 hover:border-pink-400 dark:hover:border-pink-400/60 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-pink-500/20 cursor-pointer">
                <div className="relative mb-4">
                  <div className="absolute inset-0 bg-pink-400/20 dark:bg-pink-500/20 blur-xl rounded-full group-hover:blur-2xl transition-all"></div>
                  <Brain className="w-14 h-14 text-pink-600 dark:text-pink-400 mx-auto relative z-10 group-hover:scale-110 transition-transform" strokeWidth={2} />
                </div>
                <h3 className="font-bold text-pink-700 dark:text-pink-400 mb-3 text-xl">{t('layers.knowledge')}</h3>
                <p className="text-sm text-slate-700 dark:text-gray-300 leading-relaxed">{t('layers.knowledgeDesc')}</p>
              </div>

              <div className="group text-center p-6 rounded-2xl bg-gradient-to-br from-white to-blue-50 dark:from-slate-800 dark:to-slate-900 border-2 border-blue-200 dark:border-blue-500/30 hover:border-blue-400 dark:hover:border-blue-400/60 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/20 cursor-pointer">
                <div className="relative mb-4">
                  <div className="absolute inset-0 bg-blue-400/20 dark:bg-blue-500/20 blur-xl rounded-full group-hover:blur-2xl transition-all"></div>
                  <Cpu className="w-14 h-14 text-blue-600 dark:text-blue-400 mx-auto relative z-10 group-hover:scale-110 transition-transform" strokeWidth={2} />
                </div>
                <h3 className="font-bold text-blue-700 dark:text-blue-400 mb-3 text-xl">{t('layers.technology')}</h3>
                <p className="text-sm text-slate-700 dark:text-gray-300 leading-relaxed">{t('layers.technologyDesc')}</p>
              </div>

              <div className="group text-center p-6 rounded-2xl bg-gradient-to-br from-white to-green-50 dark:from-slate-800 dark:to-slate-900 border-2 border-green-200 dark:border-green-500/30 hover:border-green-400 dark:hover:border-green-400/60 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-green-500/20 cursor-pointer">
                <div className="relative mb-4">
                  <div className="absolute inset-0 bg-green-400/20 dark:bg-green-500/20 blur-xl rounded-full group-hover:blur-2xl transition-all"></div>
                  <Globe className="w-14 h-14 text-green-600 dark:text-green-400 mx-auto relative z-10 group-hover:scale-110 transition-transform" strokeWidth={2} />
                </div>
                <h3 className="font-bold text-green-700 dark:text-green-400 mb-3 text-xl">{t('layers.connection')}</h3>
                <p className="text-sm text-slate-700 dark:text-gray-300 leading-relaxed">{t('layers.connectionDesc')}</p>
              </div>
            </div>

            <div className="text-center p-6 rounded-2xl bg-gradient-to-r from-purple-100 via-blue-100 to-cyan-100 dark:from-slate-800/80 dark:via-slate-800/60 dark:to-slate-800/80 border-2 border-purple-300 dark:border-purple-500/40 backdrop-blur-sm">
              <Sparkles className="w-6 h-6 text-purple-600 dark:text-purple-400 mx-auto mb-3" />
              <p className="text-slate-800 dark:text-white text-lg md:text-xl leading-relaxed italic font-medium">
                "{t('layers.quote')}"
              </p>
              <p className="text-purple-700 dark:text-purple-400 text-sm mt-3 font-bold flex items-center justify-center gap-2">
                <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                {t('layers.quoteAuthor')}
              </p>
            </div>
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 text-center">
            {t('academy.yourProgress') || 'Your Learning Progress'}
          </h2>
          <AcademyStats />
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <button
            onClick={() => onNavigate?.('academy')}
            className="group relative bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 p-8 rounded-3xl border-2 border-blue-300 dark:border-blue-500/40 hover:border-blue-500 dark:hover:border-blue-400/80 transition-all duration-500 hover:scale-105 hover:-translate-y-2 shadow-xl hover:shadow-2xl hover:shadow-blue-500/30 text-left w-full overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-400/20 dark:bg-blue-500/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>

            <div className="relative z-10">
              <div className="relative mb-5">
                <div className="absolute inset-0 bg-blue-400/30 blur-xl rounded-full group-hover:blur-2xl transition-all"></div>
                <BookOpen className="w-14 h-14 text-blue-600 dark:text-blue-400 relative z-10 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300" strokeWidth={2} />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-slate-900 dark:text-white group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">{t('cards.academy')}</h3>
              <p className="text-slate-700 dark:text-gray-300 mb-6 leading-relaxed">
                {t('cards.academyDesc')}
              </p>
              <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold group-hover:gap-4 transition-all">
                <span>{t('cards.academyBtn')}</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </div>
            </div>
          </button>

          <a
            href={`${DOMAIN_CONFIG.foundation.baseUrl}/knowledge`}
            className="group relative bg-gradient-to-br from-pink-50 via-white to-rose-50 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 p-8 rounded-3xl border-2 border-pink-300 dark:border-pink-500/40 hover:border-pink-500 dark:hover:border-pink-400/80 transition-all duration-500 hover:scale-105 hover:-translate-y-2 shadow-xl hover:shadow-2xl hover:shadow-pink-500/30 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 via-rose-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-pink-400/20 dark:bg-pink-500/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>

            <div className="relative z-10">
              <div className="relative mb-5">
                <div className="absolute inset-0 bg-pink-400/30 blur-xl rounded-full group-hover:blur-2xl transition-all"></div>
                <Brain className="w-14 h-14 text-pink-600 dark:text-pink-400 relative z-10 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300" strokeWidth={2} />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-slate-900 dark:text-white group-hover:text-pink-700 dark:group-hover:text-pink-400 transition-colors">{t('cards.knowledge')}</h3>
              <p className="text-slate-700 dark:text-gray-300 mb-6 leading-relaxed">
                {t('cards.knowledgeDesc')}
              </p>
              <div className="flex items-center gap-2 text-pink-600 dark:text-pink-400 font-bold group-hover:gap-4 transition-all">
                <span>{t('cards.knowledgeBtn')}</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </div>
            </div>
          </a>

          <a
            href={`${DOMAIN_CONFIG.foundation.baseUrl}/foundation`}
            className="group relative bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 p-8 rounded-3xl border-2 border-green-300 dark:border-green-500/40 hover:border-green-500 dark:hover:border-green-400/80 transition-all duration-500 hover:scale-105 hover:-translate-y-2 shadow-xl hover:shadow-2xl hover:shadow-green-500/30 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-green-400/20 dark:bg-green-500/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>

            <div className="relative z-10">
              <div className="relative mb-5">
                <div className="absolute inset-0 bg-green-400/30 blur-xl rounded-full group-hover:blur-2xl transition-all"></div>
                <Heart className="w-14 h-14 text-green-600 dark:text-green-400 relative z-10 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300" strokeWidth={2} />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-slate-900 dark:text-white group-hover:text-green-700 dark:group-hover:text-green-400 transition-colors">{t('cards.foundation')}</h3>
              <p className="text-slate-700 dark:text-gray-300 mb-6 leading-relaxed">
                {t('cards.foundationDesc')}
              </p>
              <div className="flex items-center gap-2 text-green-600 dark:text-green-400 font-bold group-hover:gap-4 transition-all">
                <span>{t('cards.foundationBtn')}</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </div>
            </div>
          </a>
        </div>

        <div className="mb-12">
          <ActivityFeed />
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <CrossDomainBridge type="to-app" />
          <CrossDomainBridge
            type="to-foundation-page"
            onClick={() => onNavigate?.('foundation')}
          />
        </div>

        <div className="relative bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 p-8 md:p-10 rounded-3xl border-2 border-purple-300 dark:border-purple-500/40 backdrop-blur-sm shadow-2xl dark:shadow-purple-900/20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-blue-500/5 to-transparent pointer-events-none"></div>
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-400/10 dark:bg-purple-500/5 rounded-full blur-3xl"></div>

          <div className="relative z-10 flex flex-col md:flex-row items-start gap-8">
            <div className="flex-shrink-0">
              <div className="relative group cursor-pointer">
                <div className="absolute inset-0 bg-purple-400/30 dark:bg-purple-500/20 rounded-full blur-2xl group-hover:blur-3xl transition-all"></div>
                <div className="relative z-10 w-24 h-24 md:w-28 md:h-28 rounded-full bg-gradient-to-br from-purple-100 to-blue-100 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center border-4 border-purple-300 dark:border-purple-500/50 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                  <img
                    src="/aoi/image.png"
                    alt="aOi"
                    className="w-20 h-20 md:w-24 md:h-24 object-contain group-hover:scale-105 transition-transform"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        const text = document.createElement('span');
                        text.textContent = '葵';
                        text.className = 'text-4xl md:text-5xl font-bold text-purple-600 dark:text-purple-400';
                        parent.appendChild(text);
                      }
                    }}
                  />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-400 rounded-full border-4 border-white dark:border-slate-800 animate-pulse"></div>
              </div>
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <h3 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 dark:from-purple-400 dark:via-blue-400 dark:to-cyan-400 bg-clip-text text-transparent">
                  {t('role.title')}
                </h3>
                <Sparkles className="w-7 h-7 text-purple-600 dark:text-purple-400 animate-pulse" />
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="space-y-3">
                  <div className="group flex items-start gap-3 p-3 rounded-xl hover:bg-blue-100/50 dark:hover:bg-slate-700/50 transition-all cursor-default">
                    <Zap className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                    <span className="text-slate-800 dark:text-gray-200 text-sm md:text-base">{t('role.item1')}</span>
                  </div>
                  <div className="group flex items-start gap-3 p-3 rounded-xl hover:bg-blue-100/50 dark:hover:bg-slate-700/50 transition-all cursor-default">
                    <Target className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                    <span className="text-slate-800 dark:text-gray-200 text-sm md:text-base">{t('role.item2')}</span>
                  </div>
                  <div className="group flex items-start gap-3 p-3 rounded-xl hover:bg-green-100/50 dark:hover:bg-slate-700/50 transition-all cursor-default">
                    <Shield className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                    <span className="text-slate-800 dark:text-gray-200 text-sm md:text-base">{t('role.item3')}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="group flex items-start gap-3 p-3 rounded-xl hover:bg-green-100/50 dark:hover:bg-slate-700/50 transition-all cursor-default">
                    <Brain className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                    <span className="text-slate-800 dark:text-gray-200 text-sm md:text-base">{t('role.item4')}</span>
                  </div>
                  <div className="group flex items-start gap-3 p-3 rounded-xl hover:bg-purple-100/50 dark:hover:bg-slate-700/50 transition-all cursor-default">
                    <Cpu className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                    <span className="text-slate-800 dark:text-gray-200 text-sm md:text-base">{t('role.item5')}</span>
                  </div>
                  <div className="group flex items-start gap-3 p-3 rounded-xl hover:bg-purple-100/50 dark:hover:bg-slate-700/50 transition-all cursor-default">
                    <Globe className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                    <span className="text-slate-800 dark:text-gray-200 text-sm md:text-base">{t('role.item6')}</span>
                  </div>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-gradient-to-r from-pink-100 via-rose-100 to-red-100 dark:from-slate-700/80 dark:via-slate-700/60 dark:to-slate-700/80 border-2 border-pink-300 dark:border-pink-500/40 backdrop-blur-sm">
                <div className="flex items-start gap-3">
                  <Heart className="w-5 h-5 text-pink-600 dark:text-pink-400 flex-shrink-0 mt-1" />
                  <p className="text-sm md:text-base text-slate-800 dark:text-gray-200 leading-relaxed">
                    <span className="font-bold text-pink-700 dark:text-pink-400">{t('role.disclaimerLabel')}</span> {t('role.disclaimer')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
