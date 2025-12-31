import { ArrowRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { DOMAIN_CONFIG } from '../config/navigation';
import { AoiCharacterHero } from './AoiCharacterFull';

interface HeroSectionProps {
  onAoiClick: () => void;
}

export function HeroSection({ onAoiClick }: HeroSectionProps) {
  const { t } = useLanguage();

  return (
    <div className="text-center mb-16 max-w-4xl mx-auto">
      <div className="mb-12">
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-8">
          <div className="flex-shrink-0 cursor-pointer" onClick={onAoiClick}>
            <AoiCharacterHero size="md" />
          </div>

          <div className="flex-1 text-center md:text-left">
            <h1 className="text-5xl md:text-7xl font-light mb-6 leading-tight">
              <span className="text-slate-600 dark:text-[#F8F9FA]/60">{t('hero.greeting')}</span>
              <br />
              <span className="bg-gradient-to-r from-[#9B8FD9] via-[#7BA7BC] to-[#8FA68E] bg-clip-text text-transparent font-bold">
                {t('hero.name')}
              </span>
            </h1>
          </div>
        </div>

        <div className="max-w-2xl mx-auto mb-8 p-6 rounded-2xl bg-white/80 dark:bg-[#1B2838] border-2 border-[#9B8FD9]/40 dark:border-[#9B8FD9]/30 backdrop-blur-sm shadow-xl dark:shadow-none">
          <p className="text-xl text-[#5B6C8F] dark:text-white mb-3 leading-relaxed font-bold">
            {t('hero.nameInfo')} <span className="font-bold text-[#8B7AC7] dark:text-[#9B8FD9]">葵</span> {t('hero.nameMeaning')}
          </p>
          <div className="flex items-center justify-center gap-6 text-lg">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🌱</span>
              <span className="text-slate-800 dark:text-white font-bold">{t('hero.trait1')}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🌊</span>
              <span className="text-slate-800 dark:text-white font-bold">{t('hero.trait2')}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🧠</span>
              <span className="text-slate-800 dark:text-white font-bold">{t('hero.trait3')}</span>
            </div>
          </div>
        </div>

        <div className="space-y-4 text-lg text-slate-800 dark:text-gray-100 leading-relaxed mb-8 font-bold">
          <p>
            {t('hero.intro1')} <span className="text-[#5B8BA0] dark:text-[#7BA7BC] font-bold">{t('hero.thinkingSystem')}</span> {t('hero.connects')}{' '}
            <span className="text-[#5B8BA0] dark:text-[#7BA7BC] font-bold">{t('hero.web3')}</span> {t('hero.withText')}{' '}
            <span className="text-[#D97B8F] dark:text-[#E8B4B8] font-bold">{t('hero.medResearch')}</span>.
          </p>
          <p>
            {t('hero.intro2')}
          </p>
          <p className="text-[#3E7C9A] dark:text-white italic font-bold text-xl">
            {t('hero.quote')}
          </p>
        </div>

        <div className="flex gap-4 justify-center flex-wrap">
          <button
            onClick={onAoiClick}
            className="group px-8 py-3.5 bg-gradient-to-r from-[#9B8FD9] to-[#7BA7BC] text-white rounded-xl hover:shadow-lg hover:shadow-[#9B8FD9]/30 transition-all font-medium hover:scale-105"
          >
            <span className="flex items-center gap-2">
              {t('hero.talkBtn')}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
          </button>
          <a
            href={`${DOMAIN_CONFIG.foundation.baseUrl}/foundation`}
            className="px-8 py-3.5 border-2 border-[#E8B4B8] text-[#E8B4B8] rounded-xl hover:bg-[#E8B4B8]/10 hover:shadow-lg hover:shadow-[#E8B4B8]/20 transition-all font-medium hover:scale-105"
          >
            {t('hero.foundationBtn')}
          </a>
        </div>
      </div>
    </div>
  );
}
