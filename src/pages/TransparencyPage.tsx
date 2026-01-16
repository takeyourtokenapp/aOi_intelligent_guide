import { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Shield, DollarSign, TrendingUp, ArrowRight, Eye, CheckCircle2, ExternalLink, Calendar, PieChart } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { AoiAvatar } from '../components/AoiAvatar';

interface FundTransparency {
  id: string;
  transaction_type: 'donation' | 'allocation' | 'grant' | 'report';
  amount_usd: number | null;
  source: string | null;
  destination: string | null;
  description: string;
  proof_url: string | null;
  blockchain_hash: string | null;
  merkle_root: string | null;
  orbital_timestamp: string | null;
  orbital_witness_url: string | null;
  aoi_verified: boolean;
  aoi_verified_at: string | null;
  source_type: string | null;
  source_id: string | null;
  source_url: string | null;
  created_at: string;
  verification_level: string;
  fully_verified: boolean;
}

interface FoundationStats {
  total_donated: number;
  families_supported: number;
  research_grants: number;
  clinical_trials: number;
  partner_hospitals: number;
}

export default function TransparencyPage() {
  const { language } = useLanguage();
  const [transactions, setTransactions] = useState<FundTransparency[]>([]);
  const [stats, setStats] = useState<FoundationStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<'all' | 'donation' | 'grant'>('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [transResult, statsResult] = await Promise.all([
        supabase
          .from('foundation_public_ledger')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(50),
        supabase
          .from('foundation_statistics')
          .select('*')
          .maybeSingle()
      ]);

      if (transResult.error) throw transResult.error;
      if (statsResult.error) throw statsResult.error;

      setTransactions(transResult.data || []);
      setStats(statsResult.data);
    } catch (error) {
      console.error('Error loading transparency data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTransactions = transactions.filter(t => {
    if (filterType === 'all') return true;
    return t.transaction_type === filterType;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'donation': return <DollarSign className="w-5 h-5 text-green-500" />;
      case 'grant': return <TrendingUp className="w-5 h-5 text-blue-500" />;
      case 'allocation': return <PieChart className="w-5 h-5 text-purple-500" />;
      case 'report': return <CheckCircle2 className="w-5 h-5 text-cyan-500" />;
      default: return <Shield className="w-5 h-5 text-gray-500" />;
    }
  };

  const getTypeBadge = (type: string) => {
    const styles = {
      donation: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
      grant: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
      allocation: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
      report: 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300',
    };

    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${styles[type as keyof typeof styles]}`}>
        {language === 'en'
          ? type.charAt(0).toUpperCase() + type.slice(1)
          : type === 'donation' ? 'Пожертвование'
          : type === 'grant' ? 'Грант'
          : type === 'allocation' ? 'Распределение'
          : 'Отчёт'}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">
            {language === 'en' ? 'Loading transparency data...' : 'Загрузка данных о прозрачности...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-6">
            <AoiAvatar size="lg" emotion="neutral" level="guardian" showKanji={true} />
            <div className="text-left">
              <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
                {language === 'en' ? 'Financial Transparency' : 'Финансовая прозрачность'}
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-400">
                {language === 'en'
                  ? 'Every transaction verified on blockchain'
                  : 'Каждая транзакция верифицирована на блокчейне'}
              </p>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 dark:bg-green-900/30 rounded-full text-sm text-green-600 dark:text-green-400 border border-green-200 dark:border-green-800">
            <Shield className="w-4 h-4" />
            <span>
              {language === 'en'
                ? '100% Transparent • Blockchain Verified'
                : '100% прозрачность • Верификация на блокчейне'}
            </span>
          </div>
        </div>

        {/* Statistics Grid */}
        {stats && (
          <div className="grid md:grid-cols-5 gap-4 mb-12">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-6 border border-green-200 dark:border-green-800">
              <DollarSign className="w-8 h-8 text-green-600 dark:text-green-400 mb-3" />
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                {language === 'en' ? 'Total Donated' : 'Всего пожертвований'}
              </p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                ${stats.total_donated.toLocaleString()}
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
              <TrendingUp className="w-8 h-8 text-blue-600 dark:text-blue-400 mb-3" />
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                {language === 'en' ? 'Research Grants' : 'Гранты'}
              </p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {stats.research_grants}
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-800">
              <Eye className="w-8 h-8 text-purple-600 dark:text-purple-400 mb-3" />
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                {language === 'en' ? 'Families Supported' : 'Семьи поддержаны'}
              </p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {stats.families_supported}
              </p>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 rounded-xl p-6 border border-orange-200 dark:border-orange-800">
              <CheckCircle2 className="w-8 h-8 text-orange-600 dark:text-orange-400 mb-3" />
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                {language === 'en' ? 'Clinical Trials' : 'Клин. испытания'}
              </p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {stats.clinical_trials}
              </p>
            </div>

            <div className="bg-gradient-to-br from-cyan-50 to-teal-50 dark:from-cyan-900/20 dark:to-teal-900/20 rounded-xl p-6 border border-cyan-200 dark:border-cyan-800">
              <Shield className="w-8 h-8 text-cyan-600 dark:text-cyan-400 mb-3" />
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                {language === 'en' ? 'Partner Hospitals' : 'Партнёр-больницы'}
              </p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {stats.partner_hospitals}
              </p>
            </div>
          </div>
        )}

        {/* Principles of Transparency */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
            {language === 'en' ? 'Our Transparency Principles' : 'Наши принципы прозрачности'}
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                  {language === 'en' ? 'Blockchain Verification' : 'Блокчейн-верификация'}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  {language === 'en'
                    ? 'Every major transaction recorded immutably on blockchain'
                    : 'Каждая крупная транзакция записывается неизменно на блокчейне'}
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                <Eye className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                  {language === 'en' ? 'Public Ledger' : 'Публичный реестр'}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  {language === 'en'
                    ? 'All fund flows are publicly visible and auditable'
                    : 'Все финансовые потоки публично видимы и проверяемы'}
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                  {language === 'en' ? 'Real-time Updates' : 'Обновления в реальном времени'}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  {language === 'en'
                    ? 'Transaction log updated immediately as events occur'
                    : 'Журнал транзакций обновляется немедленно'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-white dark:bg-slate-800 rounded-xl shadow-lg p-1.5 gap-1">
            {['all', 'donation', 'grant'].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type as any)}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  filterType === type
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                {language === 'en'
                  ? type === 'all' ? 'All' : type.charAt(0).toUpperCase() + type.slice(1) + 's'
                  : type === 'all' ? 'Все' : type === 'donation' ? 'Пожертвования' : 'Гранты'}
              </button>
            ))}
          </div>
        </div>

        {/* Transaction Log */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-slate-200 dark:border-slate-700">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              {language === 'en' ? 'Transaction Log' : 'Журнал транзакций'}
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              {language === 'en'
                ? 'Complete record of foundation financial activity'
                : 'Полная запись финансовой активности фонда'}
            </p>
          </div>

          <div className="divide-y divide-slate-200 dark:divide-slate-700">
            {filteredTransactions.map((tx) => (
              <div key={tx.id} className="p-6 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg">
                      {getTypeIcon(tx.transaction_type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        {getTypeBadge(tx.transaction_type)}
                        {tx.fully_verified && (
                          <span className="text-xs px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full flex items-center gap-1 font-medium">
                            <Shield className="w-3 h-3" />
                            {language === 'en' ? 'Fully Verified' : 'Полностью верифицировано'}
                          </span>
                        )}
                        {tx.blockchain_hash && !tx.fully_verified && (
                          <span className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            {language === 'en' ? 'Blockchain' : 'Блокчейн'}
                          </span>
                        )}
                        {tx.orbital_timestamp && (
                          <span className="text-xs text-purple-600 dark:text-purple-400 flex items-center gap-1">
                            <span className="text-lg">🌌</span>
                            {language === 'en' ? 'Orbital' : 'Орбитал'}
                          </span>
                        )}
                        {tx.aoi_verified && (
                          <span className="text-xs text-blue-600 dark:text-blue-400 flex items-center gap-1">
                            <span className="text-lg">葵</span>
                            {language === 'en' ? 'aOi' : 'aOi'}
                          </span>
                        )}
                        {tx.source_type && (
                          <span className="text-xs px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded">
                            {tx.source_type}
                          </span>
                        )}
                      </div>
                      <p className="text-slate-900 dark:text-white font-medium mb-2">
                        {tx.description}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                        {tx.source && (
                          <div className="flex items-center gap-1">
                            <span className="font-medium">{language === 'en' ? 'From:' : 'От:'}</span>
                            <span>{tx.source}</span>
                          </div>
                        )}
                        {tx.destination && (
                          <>
                            <ArrowRight className="w-4 h-4" />
                            <div className="flex items-center gap-1">
                              <span className="font-medium">{language === 'en' ? 'To:' : 'Кому:'}</span>
                              <span>{tx.destination}</span>
                            </div>
                          </>
                        )}
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-xs text-slate-500 dark:text-slate-400 flex-wrap">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{new Date(tx.created_at).toLocaleString(language === 'en' ? 'en-US' : 'ru-RU')}</span>
                        </div>
                        {tx.blockchain_hash && (
                          <a
                            href={`https://etherscan.io/tx/${tx.blockchain_hash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline"
                          >
                            <ExternalLink className="w-3 h-3" />
                            <span>{language === 'en' ? 'Blockchain' : 'Блокчейн'}</span>
                          </a>
                        )}
                        {tx.orbital_witness_url && (
                          <a
                            href={tx.orbital_witness_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-purple-600 dark:text-purple-400 hover:underline"
                          >
                            <ExternalLink className="w-3 h-3" />
                            <span>{language === 'en' ? 'Orbital Proof' : 'Орбитальное доказательство'}</span>
                          </a>
                        )}
                        {tx.source_url && (
                          <a
                            href={tx.source_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-cyan-600 dark:text-cyan-400 hover:underline"
                          >
                            <ExternalLink className="w-3 h-3" />
                            <span>{language === 'en' ? 'Source in App' : 'Источник в App'}</span>
                          </a>
                        )}
                        {tx.merkle_root && (
                          <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>{language === 'en' ? 'Batched' : 'В пакете'}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  {tx.amount_usd !== null && (
                    <div className="text-right">
                      <p className="text-2xl font-bold text-slate-900 dark:text-white">
                        ${tx.amount_usd.toLocaleString()}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">USD</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {filteredTransactions.length === 0 && (
          <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-2xl">
            <Eye className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-600 dark:text-slate-400">
              {language === 'en' ? 'No transactions found' : 'Транзакции не найдены'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
