import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Shield, CheckCircle2, Clock, AlertTriangle, ExternalLink, Copy, Check, Hash, Users } from 'lucide-react';

interface ReportIntegrityPanelProps {
  reportId: string;
  reportHash?: string | null;
  merkleRoot?: string | null;
  orbitalTimestamp?: string | null;
  orbitalWitnessUrl?: string | null;
  aoiVerified?: boolean;
  aoiVerifiedAt?: string | null;
  aoiConfidenceScore?: number | null;
  multiSigThreshold?: number;
  multiSigSignatures?: any[];
}

export function ReportIntegrityPanel({
  reportHash,
  merkleRoot,
  orbitalTimestamp,
  orbitalWitnessUrl,
  aoiVerified = false,
  aoiVerifiedAt,
  aoiConfidenceScore,
  multiSigThreshold = 3,
  multiSigSignatures = [],
}: ReportIntegrityPanelProps) {
  const { language } = useLanguage();
  const [copiedHash, setCopiedHash] = useState(false);
  const [copiedMerkle, setCopiedMerkle] = useState(false);

  const copyToClipboard = (text: string, type: 'hash' | 'merkle') => {
    navigator.clipboard.writeText(text);
    if (type === 'hash') {
      setCopiedHash(true);
      setTimeout(() => setCopiedHash(false), 2000);
    } else {
      setCopiedMerkle(true);
      setTimeout(() => setCopiedMerkle(false), 2000);
    }
  };

  const getConfidenceColor = (score: number) => {
    if (score >= 90) return 'text-green-600 dark:text-green-400';
    if (score >= 70) return 'text-blue-600 dark:text-blue-400';
    if (score >= 50) return 'text-amber-600 dark:text-amber-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getConfidenceBg = (score: number) => {
    if (score >= 90) return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
    if (score >= 70) return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
    if (score >= 50) return 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800';
    return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
  };

  const multiSigProgress = (multiSigSignatures.length / multiSigThreshold) * 100;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border-2 border-blue-200 dark:border-blue-800 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/30 p-6 border-b border-blue-200 dark:border-blue-700">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600 dark:bg-blue-500 rounded-lg">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              {language === 'en' ? 'Report Integrity Panel' : 'Панель целостности отчёта'}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {language === 'en' ? 'Multi-layer verification proof stack' : 'Многоуровневый стек доказательств верификации'}
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4 border border-slate-200 dark:border-slate-600">
          <div className="flex items-start justify-between gap-4 mb-3">
            <div className="flex items-center gap-2">
              <Hash className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              <h4 className="font-semibold text-slate-900 dark:text-white">
                {language === 'en' ? 'Report Hash' : 'Хэш отчёта'}
              </h4>
            </div>
            {reportHash ? (
              <button
                onClick={() => copyToClipboard(reportHash, 'hash')}
                className="flex items-center gap-1 px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
              >
                {copiedHash ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                {copiedHash ? (language === 'en' ? 'Copied' : 'Скопировано') : (language === 'en' ? 'Copy' : 'Копировать')}
              </button>
            ) : (
              <span className="px-2 py-1 text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded">
                {language === 'en' ? 'Pending' : 'В ожидании'}
              </span>
            )}
          </div>
          {reportHash ? (
            <p className="text-xs font-mono text-slate-700 dark:text-slate-300 break-all bg-white dark:bg-slate-800 p-3 rounded border border-slate-200 dark:border-slate-600">
              {reportHash}
            </p>
          ) : (
            <p className="text-sm text-slate-500 dark:text-slate-400 italic">
              {language === 'en' ? 'Report hash will be generated after publication' : 'Хэш отчёта будет сгенерирован после публикации'}
            </p>
          )}
        </div>

        <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4 border border-slate-200 dark:border-slate-600">
          <div className="flex items-start justify-between gap-4 mb-3">
            <div className="flex items-center gap-2">
              <div className="text-lg">📦</div>
              <h4 className="font-semibold text-slate-900 dark:text-white">
                {language === 'en' ? 'Merkle Root (Batch)' : 'Merkle Root (пакет)'}
              </h4>
            </div>
            {merkleRoot ? (
              <button
                onClick={() => copyToClipboard(merkleRoot, 'merkle')}
                className="flex items-center gap-1 px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
              >
                {copiedMerkle ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                {copiedMerkle ? (language === 'en' ? 'Copied' : 'Скопировано') : (language === 'en' ? 'Copy' : 'Копировать')}
              </button>
            ) : (
              <span className="px-2 py-1 text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 rounded">
                {language === 'en' ? 'Not batched' : 'Не в пакете'}
              </span>
            )}
          </div>
          {merkleRoot ? (
            <>
              <p className="text-xs font-mono text-slate-700 dark:text-slate-300 break-all bg-white dark:bg-slate-800 p-3 rounded border border-slate-200 dark:border-slate-600 mb-2">
                {merkleRoot}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {language === 'en'
                  ? 'This report is included in a cryptographic batch for collective verification'
                  : 'Этот отчёт включён в криптографический пакет для коллективной верификации'}
              </p>
            </>
          ) : (
            <p className="text-sm text-slate-500 dark:text-slate-400 italic">
              {language === 'en'
                ? 'Report is standalone, not part of a batch'
                : 'Отчёт самостоятельный, не является частью пакета'}
            </p>
          )}
        </div>

        <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4 border border-slate-200 dark:border-slate-600">
          <div className="flex items-start justify-between gap-4 mb-3">
            <div className="flex items-center gap-2">
              <div className="text-lg">🌌</div>
              <h4 className="font-semibold text-slate-900 dark:text-white">
                {language === 'en' ? 'Orbital Witness' : 'Орбитальное свидетельство'}
              </h4>
            </div>
            {orbitalTimestamp ? (
              <span className="flex items-center gap-1 px-2 py-1 text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded">
                <CheckCircle2 className="w-3 h-3" />
                {language === 'en' ? 'Timestamped' : 'Метка'}
              </span>
            ) : (
              <span className="flex items-center gap-1 px-2 py-1 text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded">
                <Clock className="w-3 h-3" />
                {language === 'en' ? 'Pending' : 'В ожидании'}
              </span>
            )}
          </div>
          {orbitalTimestamp ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-400">
                  {language === 'en' ? 'Timestamp:' : 'Метка времени:'}
                </span>
                <span className="font-mono text-slate-900 dark:text-white">
                  {new Date(orbitalTimestamp).toLocaleString(language === 'en' ? 'en-US' : 'ru-RU')}
                </span>
              </div>
              {orbitalWitnessUrl && (
                <a
                  href={orbitalWitnessUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-xs text-purple-600 dark:text-purple-400 hover:underline"
                >
                  <ExternalLink className="w-3 h-3" />
                  {language === 'en' ? 'View OpenTimestamps proof' : 'Смотреть доказательство OpenTimestamps'}
                </a>
              )}
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {language === 'en'
                  ? 'Immutable timestamp anchored to Bitcoin blockchain'
                  : 'Неизменяемая метка времени, привязанная к блокчейну Bitcoin'}
              </p>
            </div>
          ) : (
            <p className="text-sm text-slate-500 dark:text-slate-400 italic">
              {language === 'en'
                ? 'Orbital timestamp will be created within 24 hours'
                : 'Орбитальная метка будет создана в течение 24 часов'}
            </p>
          )}
        </div>

        <div className={`rounded-xl p-4 border ${aoiVerified ? getConfidenceBg(aoiConfidenceScore || 0) : 'bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600'}`}>
          <div className="flex items-start justify-between gap-4 mb-3">
            <div className="flex items-center gap-2">
              <span className="text-lg">葵</span>
              <h4 className="font-semibold text-slate-900 dark:text-white">
                {language === 'en' ? 'aOi Verification' : 'Верификация aOi'}
              </h4>
            </div>
            {aoiVerified ? (
              <span className="flex items-center gap-1 px-2 py-1 text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded">
                <CheckCircle2 className="w-3 h-3" />
                {language === 'en' ? 'Verified' : 'Верифицировано'}
              </span>
            ) : (
              <span className="flex items-center gap-1 px-2 py-1 text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded">
                <Clock className="w-3 h-3" />
                {language === 'en' ? 'Pending' : 'В ожидании'}
              </span>
            )}
          </div>
          {aoiVerified ? (
            <div className="space-y-3">
              {aoiConfidenceScore !== null && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      {language === 'en' ? 'Confidence Score:' : 'Оценка уверенности:'}
                    </span>
                    <span className={`text-lg font-bold ${getConfidenceColor(aoiConfidenceScore)}`}>
                      {aoiConfidenceScore}/100
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        aoiConfidenceScore >= 90
                          ? 'bg-green-600'
                          : aoiConfidenceScore >= 70
                          ? 'bg-blue-600'
                          : aoiConfidenceScore >= 50
                          ? 'bg-amber-600'
                          : 'bg-red-600'
                      }`}
                      style={{ width: `${aoiConfidenceScore}%` }}
                    ></div>
                  </div>
                </div>
              )}
              {aoiVerifiedAt && (
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600 dark:text-slate-400">
                    {language === 'en' ? 'Verified at:' : 'Верифицировано:'}
                  </span>
                  <span className="font-mono text-slate-900 dark:text-white">
                    {new Date(aoiVerifiedAt).toLocaleString(language === 'en' ? 'en-US' : 'ru-RU')}
                  </span>
                </div>
              )}
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {language === 'en'
                  ? 'AI verification checks: format, completeness, consistency, and blockchain anchoring'
                  : 'Проверки ИИ-верификации: формат, полнота, согласованность и привязка к блокчейну'}
              </p>
            </div>
          ) : (
            <p className="text-sm text-slate-500 dark:text-slate-400 italic">
              {language === 'en'
                ? 'aOi verification will be performed automatically after publication'
                : 'Верификация aOi будет выполнена автоматически после публикации'}
            </p>
          )}
        </div>

        <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4 border border-slate-200 dark:border-slate-600">
          <div className="flex items-start justify-between gap-4 mb-3">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              <h4 className="font-semibold text-slate-900 dark:text-white">
                {language === 'en' ? 'Multi-Signature Approval' : 'Многоподписное одобрение'}
              </h4>
            </div>
            <span className="px-2 py-1 text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 rounded">
              {multiSigSignatures.length}/{multiSigThreshold}
            </span>
          </div>
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between mb-2 text-sm">
                <span className="text-slate-600 dark:text-slate-400">
                  {language === 'en' ? 'Progress:' : 'Прогресс:'}
                </span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {multiSigProgress.toFixed(0)}%
                </span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    multiSigProgress >= 100 ? 'bg-green-600' : 'bg-blue-600'
                  }`}
                  style={{ width: `${multiSigProgress}%` }}
                ></div>
              </div>
            </div>
            {multiSigProgress >= 100 ? (
              <div className="flex items-center gap-2 p-2 bg-green-50 dark:bg-green-900/20 rounded border border-green-200 dark:border-green-800">
                <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                <p className="text-sm text-green-700 dark:text-green-300 font-medium">
                  {language === 'en'
                    ? 'Report approved by required signatories'
                    : 'Отчёт одобрен требуемыми подписантами'}
                </p>
              </div>
            ) : (
              <div className="flex items-center gap-2 p-2 bg-amber-50 dark:bg-amber-900/20 rounded border border-amber-200 dark:border-amber-800">
                <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <p className="text-sm text-amber-700 dark:text-amber-300">
                  {language === 'en'
                    ? `Awaiting ${multiSigThreshold - multiSigSignatures.length} more signature(s)`
                    : `Ожидание ещё ${multiSigThreshold - multiSigSignatures.length} подписи(ей)`}
                </p>
              </div>
            )}
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {language === 'en'
                ? 'Foundation reports require multi-signature approval from board members for added security'
                : 'Отчёты фонда требуют многоподписного одобрения от членов совета для дополнительной безопасности'}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-800 dark:to-blue-900/20 p-4 border-t border-slate-200 dark:border-slate-700">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            {language === 'en'
              ? 'This integrity panel provides multi-layer verification: cryptographic hashing, orbital timestamping on Bitcoin, AI-powered quality checks, and governance approval. Together, these create an immutable proof chain that ensures report authenticity and transparency.'
              : 'Эта панель целостности обеспечивает многоуровневую верификацию: криптографическое хеширование, орбитальные метки времени на Bitcoin, проверки качества на базе ИИ и одобрение управлением. Вместе они создают неизменяемую цепь доказательств, которая обеспечивает подлинность и прозрачность отчёта.'}
          </p>
        </div>
      </div>
    </div>
  );
}
