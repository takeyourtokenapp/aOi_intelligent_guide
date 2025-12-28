import { ExternalLink, ArrowRight } from 'lucide-react';
import { DOMAIN_CONFIG } from '../config/navigation';
import { useLanguage } from '../contexts/LanguageContext';

interface CrossDomainBridgeProps {
  type: 'to-foundation' | 'to-app';
  context?: string;
  className?: string;
}

export function CrossDomainBridge({ type, context, className = '' }: CrossDomainBridgeProps) {
  const { t } = useLanguage();
  const isToFoundation = type === 'to-foundation';

  const config = isToFoundation
    ? {
        title: t('bridge.toFoundation.title'),
        description: t('bridge.toFoundation.desc'),
        url: `${DOMAIN_CONFIG.foundation.baseUrl}/knowledge`,
        buttonText: t('bridge.toFoundation.button'),
        color: '#E8B4B8',
        lightColor: '#D97B8F',
      }
    : {
        title: t('bridge.toApp.title'),
        description: t('bridge.toApp.desc'),
        url: `${DOMAIN_CONFIG.app.baseUrl}/academy`,
        buttonText: t('bridge.toApp.button'),
        color: '#7BA7BC',
        lightColor: '#5B8BA0',
      };

  return (
    <div
      className={`
        relative overflow-hidden rounded-2xl border-2 p-8 backdrop-blur-sm shadow-xl dark:shadow-none
        ${isToFoundation
          ? 'bg-white/80 dark:bg-[#1B2838] border-[#D97B8F] dark:border-[#E8B4B8]/30'
          : 'bg-white/80 dark:bg-[#1B2838] border-[#5B8BA0] dark:border-[#7BA7BC]/30'
        }
        ${className}
      `}
    >
      <div className="absolute top-4 right-4">
        <ExternalLink
          size={20}
          style={{ color: isToFoundation ? config.lightColor : config.lightColor }}
          className="opacity-50 dark:opacity-100"
        />
      </div>

      <div className="space-y-4">
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
          {config.title}
        </h3>

        <p className="text-slate-900 dark:text-gray-100 leading-relaxed font-bold">
          {config.description}
        </p>

        {context && (
          <p
            className="text-sm text-slate-800 dark:text-gray-200 italic border-l-4 pl-4 font-bold"
            style={{ borderColor: isToFoundation ? config.lightColor : config.lightColor }}
          >
            {t('bridge.context')} {context}
          </p>
        )}

        <a
          href={config.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all hover:scale-105 shadow-md ${
            isToFoundation
              ? 'bg-[#E8B4B8]/20 dark:bg-[#E8B4B8]/20 text-[#D97B8F] dark:text-[#E8B4B8] border-2 border-[#D97B8F] dark:border-[#E8B4B8]/40 hover:bg-[#E8B4B8]/30 dark:hover:bg-[#E8B4B8]/30'
              : 'bg-[#7BA7BC]/20 dark:bg-[#7BA7BC]/20 text-[#5B8BA0] dark:text-[#7BA7BC] border-2 border-[#5B8BA0] dark:border-[#7BA7BC]/40 hover:bg-[#7BA7BC]/30 dark:hover:bg-[#7BA7BC]/30'
          }`}
        >
          <span>{config.buttonText}</span>
          <ArrowRight size={18} />
        </a>
      </div>

      <div className="mt-6 pt-6 border-t-2 border-slate-300 dark:border-gray-800">
        <div className="flex items-center gap-2 text-xs text-slate-800 dark:text-gray-200 font-bold">
          <div
            className="w-2 h-2 rounded-full animate-pulse"
            style={{ backgroundColor: isToFoundation ? config.lightColor : config.lightColor }}
          />
          <span>{t('bridge.connection')}</span>
        </div>
      </div>
    </div>
  );
}
