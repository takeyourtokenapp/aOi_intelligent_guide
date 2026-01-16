import { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Shield, CheckCircle2, AlertTriangle, Clock, Brain, Eye, Lock, Zap, ExternalLink } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { AoiAvatar } from '../components/AoiAvatar';

interface AoiVerification {
  id: string;
  transaction_type: string;
  description: string;
  amount_usd: number | null;
  aoi_verified: boolean;
  aoi_verified_at: string | null;
  blockchain_hash: string | null;
  orbital_timestamp: string | null;
  created_at: string;
}

export default function AoiTransparencyPage() {
  const { language } = useLanguage();
  const [verifications, setVerifications] = useState<AoiVerification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<'all' | 'verified' | 'pending'>('all');

  useEffect(() => {
    loadVerifications();
  }, []);

  const loadVerifications = async () => {
    try {
      const { data, error } = await supabase
        .from('foundation_public_ledger')
        .select('id, transaction_type, description, amount_usd, aoi_verified, aoi_verified_at, blockchain_hash, orbital_timestamp, created_at')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setVerifications(data || []);
    } catch (error) {
      console.error('Error loading aOi verifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredVerifications = verifications.filter(v => {
    if (filterStatus === 'all') return true;
    if (filterStatus === 'verified') return v.aoi_verified;
    return !v.aoi_verified;
  });

  const verifiedCount = verifications.filter(v => v.aoi_verified).length;
  const successRate = verifications.length > 0 ? (verifiedCount / verifications.length) * 100 : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 dark:from-slate-900 dark:via-blue-900/20 dark:to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">
            {language === 'en' ? 'Loading aOi transparency data...' : 'Загрузка данных прозрачности aOi...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 dark:from-slate-900 dark:via-blue-900/20 dark:to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-6 mb-6">
            <AoiAvatar size="xl" emotion="neutral" level="guardian" showKanji={true} />
            <div className="text-left">
              <h1 className="text-5xl font-bold text-slate-900 dark:text-white mb-3">
                {language === 'en' ? 'aOi Transparency' : 'Прозрачность aOi'}
              </h1>
              <p className="text-xl text-slate-600 dark:text-slate-400">
                {language === 'en'
                  ? 'AI-powered verification & integrity layer'
                  : 'Слой верификации и честности на базе ИИ'}
              </p>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/30 rounded-full text-sm text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
            <span className="text-lg">葵</span>
            <span>
              {language === 'en'
                ? 'soft + tech + academic • Interpreter & Verifier'
                : 'мягкий + технологичный + академичный • Интерпретатор и верификатор'}
            </span>
          </div>
        </div>

        <div className="space-y-8 mb-12">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Brain className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                  {language === 'en' ? 'What is aOi?' : 'Что такое aOi?'}
                </h2>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  {language === 'en'
                    ? 'aOi (葵, meaning "hollyhock" or "blue/green") is the AI orchestrator and verification assistant of the TYT ecosystem. She is NOT a chatbot or mascot, but a multi-layer AI agent that connects knowledge, tools, and trust across takeyourtoken.app and tyt.foundation.'
                    : 'aOi (葵, означает "мальва" или "синий/зелёный") — это ИИ-оркестратор и ассистент верификации экосистемы TYT. Она НЕ является чат-ботом или маскотом, а представляет собой многоуровневого ИИ-агента, который связывает знания, инструменты и доверие между takeyourtoken.app и tyt.foundation.'}
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-4 gap-4">
              <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
                <Zap className="w-6 h-6 text-purple-600 dark:text-purple-400 mb-2" />
                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                  {language === 'en' ? 'Core AI Orchestrator' : 'Ядро ИИ-логики'}
                </p>
              </div>
              <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                <Eye className="w-6 h-6 text-blue-600 dark:text-blue-400 mb-2" />
                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                  {language === 'en' ? 'Navigation Assistant' : 'Ассистент навигации'}
                </p>
              </div>
              <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200 dark:border-green-800">
                <Brain className="w-6 h-6 text-green-600 dark:text-green-400 mb-2" />
                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                  {language === 'en' ? 'Knowledge Curator' : 'Куратор знаний'}
                </p>
              </div>
              <div className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
                <Shield className="w-6 h-6 text-amber-600 dark:text-amber-400 mb-2" />
                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                  {language === 'en' ? 'Security Auditor' : 'Аудитор безопасности'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                  {language === 'en' ? 'What aOi Verifies' : 'Что верифицирует aOi'}
                </h2>
                <p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
                  {language === 'en'
                    ? 'aOi performs automated integrity checks on foundation transactions to ensure data quality and completeness. She does NOT make financial decisions or approve transactions.'
                    : 'aOi выполняет автоматические проверки целостности транзакций фонда, чтобы обеспечить качество и полноту данных. Она НЕ принимает финансовых решений и не одобряет транзакции.'}
                </p>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                    <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white text-sm">
                        {language === 'en' ? 'Transaction Format' : 'Формат транзакции'}
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        {language === 'en'
                          ? 'Validates required fields, data types, and structure'
                          : 'Проверяет обязательные поля, типы данных и структуру'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                    <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white text-sm">
                        {language === 'en' ? 'Amount Validation' : 'Валидация сумм'}
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        {language === 'en'
                          ? 'Checks for reasonable values, no negative amounts, proper decimals'
                          : 'Проверяет разумные значения, отсутствие отрицательных сумм, правильные десятичные знаки'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                    <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white text-sm">
                        {language === 'en' ? 'Source/Destination Checks' : 'Проверка источника/получателя'}
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        {language === 'en'
                          ? 'Verifies source_type, source_id consistency with takeyourtoken.app'
                          : 'Проверяет согласованность source_type, source_id с takeyourtoken.app'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                    <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white text-sm">
                        {language === 'en' ? 'Blockchain Hash Verification' : 'Верификация хэша блокчейна'}
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        {language === 'en'
                          ? 'Confirms blockchain_hash format matches expected pattern'
                          : 'Подтверждает, что формат blockchain_hash соответствует ожидаемому шаблону'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                    <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white text-sm">
                        {language === 'en' ? 'Proof Completeness' : 'Полнота доказательств'}
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        {language === 'en'
                          ? 'Ensures all expected proof fields are present (merkle_root, orbital_timestamp)'
                          : 'Проверяет наличие всех ожидаемых полей доказательств (merkle_root, orbital_timestamp)'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 border-2 border-red-200 dark:border-red-800">
            <div className="flex items-start gap-4 mb-6">
              <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
                <Lock className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                  {language === 'en' ? 'What aOi Does NOT Do' : 'Что aOi НЕ делает'}
                </h2>
                <p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
                  {language === 'en'
                    ? 'aOi is a verification assistant, NOT a decision-maker. Clear boundaries ensure trust and safety.'
                    : 'aOi — это ассистент верификации, а НЕ орган принятия решений. Чёткие границы обеспечивают доверие и безопасность.'}
                </p>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white text-sm">
                        {language === 'en' ? 'No Medical Advice' : 'Никаких медицинских советов'}
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        {language === 'en'
                          ? 'aOi does NOT diagnose, recommend treatments, or provide medical guidance'
                          : 'aOi НЕ диагностирует, не рекомендует лечение и не предоставляет медицинские консультации'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white text-sm">
                        {language === 'en' ? 'No Financial Decisions' : 'Никаких финансовых решений'}
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        {language === 'en'
                          ? 'aOi does NOT approve grants, allocate funds, or make investment decisions'
                          : 'aOi НЕ одобряет гранты, не распределяет средства и не принимает инвестиционные решения'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white text-sm">
                        {language === 'en' ? 'No Autonomous Transactions' : 'Никаких автономных транзакций'}
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        {language === 'en'
                          ? 'aOi does NOT execute transactions, sign contracts, or control wallets'
                          : 'aOi НЕ выполняет транзакции, не подписывает контракты и не контролирует кошельки'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white text-sm">
                        {language === 'en' ? 'No Access to Private Data' : 'Нет доступа к личным данным'}
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        {language === 'en'
                          ? 'aOi works only with public, anonymized data on tyt.foundation'
                          : 'aOi работает только с публичными, анонимизированными данными на tyt.foundation'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <Brain className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                  {language === 'en' ? 'How Confidence is Computed' : 'Как вычисляется уверенность'}
                </h2>
                <p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
                  {language === 'en'
                    ? 'aOi assigns a confidence score (0-100) based on the completeness and consistency of transaction data. This is a HIGH-LEVEL quality check, NOT a financial audit.'
                    : 'aOi присваивает оценку уверенности (0-100) на основе полноты и согласованности данных транзакции. Это ОБЩАЯ проверка качества, а НЕ финансовый аудит.'}
                </p>
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-800">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                        <span className="text-lg font-bold text-green-700 dark:text-green-300">90+</span>
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white text-sm mb-1">
                          {language === 'en' ? 'High Confidence' : 'Высокая уверенность'}
                        </p>
                        <p className="text-xs text-slate-600 dark:text-slate-400">
                          {language === 'en'
                            ? 'All fields present, blockchain verified, orbital timestamped, no anomalies'
                            : 'Все поля присутствуют, блокчейн верифицирован, орбитальная метка, нет аномалий'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                        <span className="text-lg font-bold text-blue-700 dark:text-blue-300">70-89</span>
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white text-sm mb-1">
                          {language === 'en' ? 'Good Confidence' : 'Хорошая уверенность'}
                        </p>
                        <p className="text-xs text-slate-600 dark:text-slate-400">
                          {language === 'en'
                            ? 'Most fields present, blockchain verified, minor metadata gaps'
                            : 'Большинство полей присутствует, блокчейн верифицирован, небольшие пробелы в метаданных'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center flex-shrink-0">
                        <span className="text-lg font-bold text-amber-700 dark:text-amber-300">50-69</span>
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white text-sm mb-1">
                          {language === 'en' ? 'Moderate Confidence' : 'Умеренная уверенность'}
                        </p>
                        <p className="text-xs text-slate-600 dark:text-slate-400">
                          {language === 'en'
                            ? 'Basic fields present, blockchain pending or metadata incomplete'
                            : 'Базовые поля присутствуют, блокчейн в ожидании или метаданные неполные'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center flex-shrink-0">
                        <span className="text-lg font-bold text-red-700 dark:text-red-300">&lt;50</span>
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white text-sm mb-1">
                          {language === 'en' ? 'Low Confidence / Flagged' : 'Низкая уверенность / Помечено'}
                        </p>
                        <p className="text-xs text-slate-600 dark:text-slate-400">
                          {language === 'en'
                            ? 'Missing critical fields, format errors, or anomalies detected. Requires human review.'
                            : 'Отсутствуют критические поля, ошибки формата или обнаружены аномалии. Требуется проверка человеком.'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 border-2 border-amber-200 dark:border-amber-800">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                <AlertTriangle className="w-8 h-8 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                  {language === 'en' ? 'Limitations' : 'Ограничения'}
                </h2>
                <div className="space-y-3 text-slate-600 dark:text-slate-400">
                  <p className="leading-relaxed">
                    {language === 'en'
                      ? '• aOi is a verification assistant, NOT an authority. Human oversight is always required for critical decisions.'
                      : '• aOi — это ассистент верификации, а НЕ орган власти. Человеческий надзор всегда требуется для критических решений.'}
                  </p>
                  <p className="leading-relaxed">
                    {language === 'en'
                      ? '• aOi cannot guarantee perfection. AI systems can make errors, especially with edge cases or novel patterns.'
                      : '• aOi не может гарантировать совершенство. Системы ИИ могут делать ошибки, особенно с краевыми случаями или новыми паттернами.'}
                  </p>
                  <p className="leading-relaxed">
                    {language === 'en'
                      ? '• Verification checks are automated and rule-based. Complex fraud or sophisticated attacks may bypass these checks.'
                      : '• Проверки верификации автоматизированы и основаны на правилах. Сложное мошенничество или изощрённые атаки могут обойти эти проверки.'}
                  </p>
                  <p className="leading-relaxed font-semibold text-slate-900 dark:text-white">
                    {language === 'en'
                      ? '→ aOi adds a layer of automated quality control, but does NOT replace human judgment, audits, or governance.'
                      : '→ aOi добавляет слой автоматизированного контроля качества, но НЕ заменяет человеческое суждение, аудиты или управление.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  {language === 'en' ? 'aOi Verification Log' : 'Журнал верификации aOi'}
                </h2>
                <p className="text-slate-600 dark:text-slate-400 mt-1">
                  {language === 'en'
                    ? 'Recent transactions verified by aOi'
                    : 'Последние транзакции, верифицированные aOi'}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setFilterStatus('all')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filterStatus === 'all'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                  }`}
                >
                  {language === 'en' ? 'All' : 'Все'}
                </button>
                <button
                  onClick={() => setFilterStatus('verified')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filterStatus === 'verified'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                  }`}
                >
                  {language === 'en' ? 'Verified' : 'Верифицировано'}
                </button>
                <button
                  onClick={() => setFilterStatus('pending')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filterStatus === 'pending'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                  }`}
                >
                  {language === 'en' ? 'Pending' : 'В ожидании'}
                </button>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                <span className="text-slate-600 dark:text-slate-400">
                  {verifiedCount} {language === 'en' ? 'verified' : 'верифицировано'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                <span className="text-slate-600 dark:text-slate-400">
                  {verifications.length - verifiedCount} {language === 'en' ? 'pending' : 'в ожидании'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <span className="text-slate-600 dark:text-slate-400">
                  {successRate.toFixed(1)}% {language === 'en' ? 'success rate' : 'успешность'}
                </span>
              </div>
            </div>
          </div>

          <div className="divide-y divide-slate-200 dark:divide-slate-700 max-h-[600px] overflow-y-auto">
            {filteredVerifications.map((v) => (
              <div key={v.id} className="p-6 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {v.aoi_verified ? (
                        <span className="flex items-center gap-2 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-sm font-medium">
                          <CheckCircle2 className="w-4 h-4" />
                          <span className="text-lg">葵</span>
                          {language === 'en' ? 'Verified' : 'Верифицировано'}
                        </span>
                      ) : (
                        <span className="flex items-center gap-2 px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-full text-sm font-medium">
                          <Clock className="w-4 h-4" />
                          {language === 'en' ? 'Pending' : 'В ожидании'}
                        </span>
                      )}
                      <span className="px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded text-sm">
                        {v.transaction_type}
                      </span>
                    </div>
                    <p className="text-slate-900 dark:text-white font-medium mb-2">{v.description}</p>
                    <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                      <span>{new Date(v.created_at).toLocaleString(language === 'en' ? 'en-US' : 'ru-RU')}</span>
                      {v.aoi_verified_at && (
                        <>
                          <span>→</span>
                          <span>
                            {language === 'en' ? 'Verified:' : 'Верифицировано:'}{' '}
                            {new Date(v.aoi_verified_at).toLocaleString(language === 'en' ? 'en-US' : 'ru-RU')}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  {v.amount_usd !== null && (
                    <div className="text-right">
                      <p className="text-xl font-bold text-slate-900 dark:text-white">${v.amount_usd.toLocaleString()}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">USD</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {filteredVerifications.length === 0 && (
          <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-2xl mt-8">
            <span className="text-6xl mb-4 block">葵</span>
            <p className="text-slate-600 dark:text-slate-400">
              {language === 'en' ? 'No verifications found' : 'Верификации не найдены'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
