import { Shield, BookOpen, Heart, ArrowRight, Brain, Cpu, Globe, FileText, Sparkles } from 'lucide-react';
import { CrossDomainBridge } from '../components/CrossDomainBridge';
import { RealtimeStats } from '../components/RealtimeStats';
import { ActivityFeed } from '../components/ActivityFeed';
import { HeroSection } from '../components/HeroSection';
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
        <HeroSection onAoiClick={onAoiClick} />

        <HeroCarousel />

        <RealtimeStats />

        <div className="mb-16 p-10 rounded-3xl bg-white/90 dark:bg-gradient-to-br dark:from-[#1B2838] dark:via-[#2a3f54] dark:to-[#1B2838] border-2 border-[#9B8FD9]/50 dark:border-[#9B8FD9]/30 backdrop-blur-sm shadow-2xl dark:shadow-none">
          <div className="grid md:grid-cols-3 gap-8 mb-10">
            <div className="text-center p-6 rounded-2xl bg-white dark:bg-[#1B2838] border-2 border-[#D97B8F] dark:border-[#E8B4B8]/30 hover:border-[#C7637A] dark:hover:border-[#E8B4B8]/50 transition-all animate-breathe shadow-lg dark:shadow-none">
              <Brain className="w-14 h-14 text-[#D97B8F] dark:text-[#E8B4B8] mx-auto mb-4" strokeWidth={2} />
              <h3 className="font-bold text-[#D97B8F] dark:text-[#E8B4B8] mb-3 text-lg">{t('layers.knowledge')}</h3>
              <p className="text-sm text-slate-900 dark:text-gray-100 leading-relaxed font-bold">{t('layers.knowledgeDesc')}</p>
            </div>
            <div className="text-center p-6 rounded-2xl bg-white dark:bg-[#1B2838] border-2 border-[#5B8BA0] dark:border-[#7BA7BC]/30 hover:border-[#3E7C9A] dark:hover:border-[#7BA7BC]/50 transition-all animate-breathe shadow-lg dark:shadow-none" style={{animationDelay: '1s'}}>
              <Cpu className="w-14 h-14 text-[#5B8BA0] dark:text-[#7BA7BC] mx-auto mb-4" strokeWidth={2} />
              <h3 className="font-bold text-[#5B8BA0] dark:text-[#7BA7BC] mb-3 text-lg">{t('layers.technology')}</h3>
              <p className="text-sm text-slate-900 dark:text-gray-100 leading-relaxed font-bold">{t('layers.technologyDesc')}</p>
            </div>
            <div className="text-center p-6 rounded-2xl bg-white dark:bg-[#1B2838] border-2 border-[#6B9070] dark:border-[#8FA68E]/30 hover:border-[#557F5A] dark:hover:border-[#8FA68E]/50 transition-all animate-breathe shadow-lg dark:shadow-none" style={{animationDelay: '2s'}}>
              <Globe className="w-14 h-14 text-[#6B9070] dark:text-[#8FA68E] mx-auto mb-4" strokeWidth={2} />
              <h3 className="font-bold text-[#6B9070] dark:text-[#8FA68E] mb-3 text-lg">{t('layers.connection')}</h3>
              <p className="text-sm text-slate-900 dark:text-gray-100 leading-relaxed font-bold">{t('layers.connectionDesc')}</p>
            </div>
          </div>
          <div className="text-center p-6 rounded-xl bg-gradient-to-r from-[#9B8FD9]/20 to-[#7BA7BC]/20 dark:bg-gradient-to-r dark:from-[#2a3f54] dark:to-[#1B2838] border-2 border-[#8B7AC7] dark:border-[#9B8FD9]/30">
            <p className="text-[#2C5F7A] dark:text-white text-lg leading-relaxed italic font-bold">
              "{t('layers.quote')}"
            </p>
            <p className="text-[#6B5AA6] dark:text-[#9B8FD9] text-sm mt-2 font-black">{t('layers.quoteAuthor')}</p>
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 text-center">
            {t('academy.yourProgress') || 'Your Learning Progress'}
          </h2>
          <AcademyStats />
        </div>

        <div className="mb-16">
          <button
            onClick={() => onNavigate?.('foundation', 'manifesto')}
            className="w-full group relative bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 dark:from-purple-900/20 dark:via-blue-900/20 dark:to-cyan-900/20 p-10 rounded-3xl border-4 border-purple-300 dark:border-purple-700 hover:border-purple-500 dark:hover:border-purple-500 transition-all duration-500 hover:scale-[1.02] shadow-2xl hover:shadow-purple-500/20 dark:hover:shadow-purple-500/40 text-left"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-400/10 via-blue-400/10 to-cyan-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <Sparkles className="w-8 h-8 text-purple-600 dark:text-purple-400 animate-pulse" />
                <span className="px-4 py-2 bg-purple-100 dark:bg-purple-900/40 text-purple-800 dark:text-purple-300 rounded-full text-sm font-bold">
                  {language === 'en' ? 'NEW RESEARCH PAPER' : 'НОВОЕ ИССЛЕДОВАНИЕ'}
                </span>
              </div>

              <div className="flex items-start gap-6 mb-6">
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <FileText className="w-10 h-10 text-white" strokeWidth={2} />
                  </div>
                </div>
                <div className="flex-1">
                  <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-3 leading-tight">
                    {language === 'en'
                      ? 'Integration of AI, Quantum Computing & Blockchain/Web3 for Pediatric CNS Tumor Research'
                      : 'Интеграция AI, квантовых вычислений и Blockchain/Web3 в исследованиях опухолей ЦНС у детей'}
                  </h2>
                  <p className="text-lg text-purple-700 dark:text-purple-300 font-semibold mb-4">
                    {language === 'en' ? 'An Open Appeal to I-QCC' : 'Открытое обращение к I-QCC'}
                  </p>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                    {language === 'en'
                      ? 'A comprehensive research paper exploring how artificial intelligence, quantum computing, and blockchain technologies can revolutionize pediatric brain tumor research. This position paper presents an integrated scientific infrastructure model and extends an invitation to the International Quantum Computing Center (I-QCC) to lead this paradigm shift.'
                      : 'Комплексная исследовательская работа, исследующая как искусственный интеллект, квантовые вычисления и блокчейн-технологии могут революционизировать исследования опухолей мозга у детей. Эта работа представляет интегрированную модель научной инфраструктуры и приглашает Международный центр квантовых вычислений (I-QCC) возглавить эту парадигмальную трансформацию.'}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {['AI', 'Quantum Computing', 'Blockchain', 'DeSci', 'Pediatric Oncology', 'I-QCC'].map((tag) => (
                      <span key={tag} className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold">
                    葵
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white">aOi - AI Curator</div>
                    <div className="text-sm">{language === 'en' ? 'TYT Foundation Research' : 'Исследование TYT Foundation'}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-purple-600 dark:text-purple-400 font-bold text-lg group-hover:gap-5 transition-all">
                  <span>{language === 'en' ? 'Read Full Paper' : 'Читать полностью'}</span>
                  <ArrowRight className="w-6 h-6" strokeWidth={3} />
                </div>
              </div>
            </div>
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <button
            onClick={() => onNavigate?.('academy')}
            className="group relative bg-white dark:bg-gradient-to-br dark:from-[#1B2838] dark:to-[#2a3f54] p-8 rounded-2xl border-2 border-[#5B8BA0] dark:border-[#7BA7BC]/30 hover:border-[#3E7C9A] dark:hover:border-[#7BA7BC]/60 transition-all duration-300 hover:scale-105 animate-breathe shadow-2xl dark:shadow-none text-left w-full"
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
          </button>

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
          <CrossDomainBridge
            type="to-foundation-page"
            onClick={() => onNavigate?.('foundation')}
          />
        </div>

        <div className="bg-white/90 dark:bg-gradient-to-br dark:from-[#1B2838] dark:via-[#2a3f54] dark:to-[#1B2838] p-10 rounded-3xl border-2 border-[#8B7AC7] dark:border-[#9B8FD9]/30 backdrop-blur-sm shadow-2xl dark:shadow-none">
          <div className="flex items-start gap-6">
            <div className="flex-shrink-0">
              <div className="relative">
                <div className="absolute inset-0 bg-[#9B8FD9]/30 dark:bg-[#9B8FD9]/20 rounded-full blur-xl animate-pulse-soft"></div>
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
              <div className="p-4 rounded-xl bg-[#E8B4B8]/30 dark:bg-[#1B2838] border-2 border-[#D97B8F] dark:border-[#E8B4B8]/30">
                <p className="text-sm text-slate-900 dark:text-gray-100 leading-relaxed font-bold">
                  <span className="font-black text-[#C7637A] dark:text-[#E8B4B8]">{t('role.disclaimerLabel')}</span> {t('role.disclaimer')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
