import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { CheckCircle2, Clock, AlertTriangle, Info, ExternalLink } from 'lucide-react';

interface AoiVerificationBadgeProps {
  verified: boolean;
  verifiedAt?: string | null;
  confidenceScore?: number | null;
  showDetails?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function AoiVerificationBadge({
  verified,
  verifiedAt,
  confidenceScore,
  showDetails = true,
  size = 'md',
}: AoiVerificationBadgeProps) {
  const { language } = useLanguage();
  const [showTooltip, setShowTooltip] = useState(false);

  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-2',
  };

  const iconSize = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const kanjiSize = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-xl',
  };

  const getConfidenceLevel = (score: number) => {
    if (score >= 90) return { label: language === 'en' ? 'High' : 'Высокая', color: 'text-green-600 dark:text-green-400' };
    if (score >= 70) return { label: language === 'en' ? 'Good' : 'Хорошая', color: 'text-blue-600 dark:text-blue-400' };
    if (score >= 50) return { label: language === 'en' ? 'Moderate' : 'Умеренная', color: 'text-amber-600 dark:text-amber-400' };
    return { label: language === 'en' ? 'Low' : 'Низкая', color: 'text-red-600 dark:text-red-400' };
  };

  const getVerificationChecks = () => {
    return [
      { name: language === 'en' ? 'Format validation' : 'Валидация формата', passed: verified },
      { name: language === 'en' ? 'Amount consistency' : 'Согласованность сумм', passed: verified },
      { name: language === 'en' ? 'Source verification' : 'Верификация источника', passed: verified },
      { name: language === 'en' ? 'Blockchain anchoring' : 'Привязка к блокчейну', passed: verified },
      { name: language === 'en' ? 'Proof completeness' : 'Полнота доказательств', passed: verified && confidenceScore ? confidenceScore >= 70 : false },
    ];
  };

  return (
    <div className="relative inline-block">
      <div
        className="relative"
        onMouseEnter={() => showDetails && setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        {verified ? (
          <span className={`flex items-center gap-2 ${sizeClasses[size]} bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full font-medium cursor-help`}>
            <span className={kanjiSize[size]}>葵</span>
            {language === 'en' ? 'aOi Verified' : 'aOi верифицировано'}
            {showDetails && <Info className={iconSize[size]} />}
          </span>
        ) : (
          <span className={`flex items-center gap-2 ${sizeClasses[size]} bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-full font-medium cursor-help`}>
            <Clock className={iconSize[size]} />
            {language === 'en' ? 'Pending aOi' : 'Ожидание aOi'}
            {showDetails && <Info className={iconSize[size]} />}
          </span>
        )}
      </div>

      {showDetails && showTooltip && (
        <div className="absolute z-50 w-80 mt-2 left-1/2 transform -translate-x-1/2">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/30 p-4 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">葵</span>
                <h4 className="font-bold text-slate-900 dark:text-white">
                  {language === 'en' ? 'aOi Verification Details' : 'Детали верификации aOi'}
                </h4>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                {language === 'en'
                  ? 'AI-powered quality checks and integrity validation'
                  : 'Проверки качества и валидации целостности на базе ИИ'}
              </p>
            </div>

            <div className="p-4 space-y-3">
              {verified ? (
                <>
                  {confidenceScore !== null && (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                          {language === 'en' ? 'Confidence Score:' : 'Оценка уверенности:'}
                        </span>
                        <span className={`text-lg font-bold ${getConfidenceLevel(confidenceScore).color}`}>
                          {confidenceScore}/100
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden mb-1">
                        <div
                          className={`h-full rounded-full transition-all ${
                            confidenceScore >= 90
                              ? 'bg-green-600'
                              : confidenceScore >= 70
                              ? 'bg-blue-600'
                              : confidenceScore >= 50
                              ? 'bg-amber-600'
                              : 'bg-red-600'
                          }`}
                          style={{ width: `${confidenceScore}%` }}
                        ></div>
                      </div>
                      <p className={`text-xs font-medium ${getConfidenceLevel(confidenceScore).color}`}>
                        {getConfidenceLevel(confidenceScore).label} {language === 'en' ? 'confidence' : 'уверенность'}
                      </p>
                    </div>
                  )}

                  {verifiedAt && (
                    <div className="text-xs text-slate-600 dark:text-slate-400">
                      <span className="font-medium">{language === 'en' ? 'Verified:' : 'Верифицировано:'}</span>
                      <span className="ml-2">{new Date(verifiedAt).toLocaleString(language === 'en' ? 'en-US' : 'ru-RU')}</span>
                    </div>
                  )}

                  <div className="border-t border-slate-200 dark:border-slate-700 pt-3">
                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                      {language === 'en' ? 'Verification Checks:' : 'Проверки верификации:'}
                    </p>
                    <div className="space-y-1">
                      {getVerificationChecks().map((check, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          {check.passed ? (
                            <CheckCircle2 className="w-3 h-3 text-green-600 dark:text-green-400 flex-shrink-0" />
                          ) : (
                            <AlertTriangle className="w-3 h-3 text-amber-600 dark:text-amber-400 flex-shrink-0" />
                          )}
                          <span className={`text-xs ${check.passed ? 'text-slate-700 dark:text-slate-300' : 'text-slate-500 dark:text-slate-400'}`}>
                            {check.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 p-2 bg-amber-50 dark:bg-amber-900/20 rounded">
                    <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    <p className="text-xs text-amber-700 dark:text-amber-300">
                      {language === 'en'
                        ? 'Verification in progress. Typically completes within minutes.'
                        : 'Верификация в процессе. Обычно завершается в течение минут.'}
                    </p>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {language === 'en'
                      ? 'aOi will automatically validate transaction format, amounts, blockchain anchoring, and proof completeness.'
                      : 'aOi автоматически проверит формат транзакции, суммы, привязку к блокчейну и полноту доказательств.'}
                  </p>
                </div>
              )}

              <div className="border-t border-slate-200 dark:border-slate-700 pt-3">
                <a
                  href="/aoi"
                  className="flex items-center gap-2 text-xs text-blue-600 dark:text-blue-400 hover:underline"
                >
                  <ExternalLink className="w-3 h-3" />
                  {language === 'en' ? 'Learn more about aOi verification' : 'Узнать больше о верификации aOi'}
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
