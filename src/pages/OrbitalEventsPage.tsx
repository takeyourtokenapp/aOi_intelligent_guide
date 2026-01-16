import { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Shield, ExternalLink, CheckCircle2, Clock, AlertCircle, Search, Filter, TrendingUp } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { AoiAvatar } from '../components/AoiAvatar';

interface OrbitalEvent {
  id: string;
  event_type: 'report' | 'transaction_batch' | 'burn_event' | 'grant_approval' | 'snapshot';
  event_id: string;
  event_table: string;
  event_hash: string;
  orbital_timestamp: string;
  orbital_witness_url: string;
  witness_node: string;
  blockchain_network: string;
  blockchain_tx: string | null;
  verification_status: 'pending' | 'confirmed' | 'failed';
  verified_at: string | null;
  created_at: string;
  verification_time_minutes: number | null;
}

interface OrbitalStats {
  total_events: number;
  confirmed_events: number;
  avg_verification_time: number;
  success_rate: number;
}

export default function OrbitalEventsPage() {
  const { language } = useLanguage();
  const [events, setEvents] = useState<OrbitalEvent[]>([]);
  const [stats, setStats] = useState<OrbitalStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<'all' | string>('all');
  const [searchHash, setSearchHash] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const { data: eventsData, error: eventsError } = await supabase
        .from('orbital_witness_log')
        .select('*')
        .order('orbital_timestamp', { ascending: false })
        .limit(50);

      if (eventsError) throw eventsError;

      setEvents(eventsData || []);

      const totalEvents = eventsData?.length || 0;
      const confirmedEvents = eventsData?.filter(e => e.verification_status === 'confirmed').length || 0;
      const avgTime = eventsData
        ?.filter(e => e.verification_time_minutes !== null && e.verification_time_minutes > 0)
        .reduce((sum, e) => sum + (e.verification_time_minutes || 0), 0) / (confirmedEvents || 1);

      setStats({
        total_events: totalEvents,
        confirmed_events: confirmedEvents,
        avg_verification_time: avgTime || 0,
        success_rate: totalEvents > 0 ? (confirmedEvents / totalEvents) * 100 : 0,
      });
    } catch (error) {
      console.error('Error loading orbital events:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredEvents = events.filter(e => {
    const matchesType = filterType === 'all' || e.event_type === filterType;
    const matchesHash = !searchHash || e.event_hash.toLowerCase().includes(searchHash.toLowerCase());
    return matchesType && matchesHash;
  });

  const getEventTypeLabel = (type: string) => {
    const labels = {
      en: {
        report: 'Impact Report',
        transaction_batch: 'Transaction Batch',
        burn_event: 'Burn Event',
        grant_approval: 'Grant Approval',
        snapshot: 'Snapshot',
      },
      ru: {
        report: 'Отчёт',
        transaction_batch: 'Пакет транзакций',
        burn_event: 'Событие сжигания',
        grant_approval: 'Одобрение гранта',
        snapshot: 'Снимок',
      },
    };
    return labels[language as 'en' | 'ru'][type as keyof typeof labels['en']] || type;
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      confirmed: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
      pending: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300',
      failed: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
    };

    const icons = {
      confirmed: <CheckCircle2 className="w-4 h-4" />,
      pending: <Clock className="w-4 h-4" />,
      failed: <AlertCircle className="w-4 h-4" />,
    };

    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 ${styles[status as keyof typeof styles]}`}>
        {icons[status as keyof typeof icons]}
        {language === 'en'
          ? status.charAt(0).toUpperCase() + status.slice(1)
          : status === 'confirmed' ? 'Подтверждено'
          : status === 'pending' ? 'В ожидании'
          : 'Ошибка'}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-slate-100 dark:from-slate-900 dark:via-purple-900/20 dark:to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">
            {language === 'en' ? 'Loading orbital events...' : 'Загрузка орбитальных событий...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-slate-100 dark:from-slate-900 dark:via-purple-900/20 dark:to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="text-6xl">🌌</div>
            <div className="text-left">
              <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
                {language === 'en' ? 'Orbital Witness Events' : 'Орбитальные события-свидетели'}
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-400">
                {language === 'en'
                  ? 'Immutable timestamps on Bitcoin blockchain'
                  : 'Неизменяемые временные метки на блокчейне Bitcoin'}
              </p>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-50 dark:bg-purple-900/30 rounded-full text-sm text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800">
            <Shield className="w-4 h-4" />
            <span>
              {language === 'en'
                ? 'OpenTimestamps • Bitcoin Notarization'
                : 'OpenTimestamps • Нотаризация Bitcoin'}
            </span>
          </div>
        </div>

        {stats && (
          <div className="grid md:grid-cols-4 gap-4 mb-12">
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-800">
              <Shield className="w-8 h-8 text-purple-600 dark:text-purple-400 mb-3" />
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                {language === 'en' ? 'Total Events' : 'Всего событий'}
              </p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {stats.total_events}
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-6 border border-green-200 dark:border-green-800">
              <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400 mb-3" />
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                {language === 'en' ? 'Confirmed' : 'Подтверждено'}
              </p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {stats.confirmed_events}
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
              <TrendingUp className="w-8 h-8 text-blue-600 dark:text-blue-400 mb-3" />
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                {language === 'en' ? 'Success Rate' : 'Успешность'}
              </p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {stats.success_rate.toFixed(1)}%
              </p>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl p-6 border border-amber-200 dark:border-amber-800">
              <Clock className="w-8 h-8 text-amber-600 dark:text-amber-400 mb-3" />
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                {language === 'en' ? 'Avg Time' : 'Среднее время'}
              </p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {stats.avg_verification_time.toFixed(0)} min
              </p>
            </div>
          </div>
        )}

        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2 flex-1 min-w-[200px]">
              <Search className="w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={searchHash}
                onChange={(e) => setSearchHash(e.target.value)}
                placeholder={language === 'en' ? 'Search by hash...' : 'Поиск по хэшу...'}
                className="flex-1 px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-slate-400" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">{language === 'en' ? 'All Types' : 'Все типы'}</option>
                <option value="report">{getEventTypeLabel('report')}</option>
                <option value="transaction_batch">{getEventTypeLabel('transaction_batch')}</option>
                <option value="burn_event">{getEventTypeLabel('burn_event')}</option>
                <option value="grant_approval">{getEventTypeLabel('grant_approval')}</option>
                <option value="snapshot">{getEventTypeLabel('snapshot')}</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-slate-200 dark:border-slate-700">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              {language === 'en' ? 'Witness Log' : 'Журнал свидетельств'}
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              {language === 'en'
                ? 'All events timestamped on Bitcoin via OpenTimestamps'
                : 'Все события с временными метками на Bitcoin через OpenTimestamps'}
            </p>
          </div>

          <div className="divide-y divide-slate-200 dark:divide-slate-700">
            {filteredEvents.map((event) => (
              <div key={event.id} className="p-6 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm font-medium">
                        {getEventTypeLabel(event.event_type)}
                      </span>
                      {getStatusBadge(event.verification_status)}
                    </div>

                    <div className="mb-3">
                      <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">
                        {language === 'en' ? 'Event Hash:' : 'Хэш события:'}
                      </p>
                      <p className="text-slate-900 dark:text-white font-mono text-sm break-all">
                        {event.event_hash}
                      </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-slate-500 dark:text-slate-400 mb-1">
                          {language === 'en' ? 'Orbital Timestamp:' : 'Орбитальная метка:'}
                        </p>
                        <p className="text-slate-900 dark:text-white">
                          {new Date(event.orbital_timestamp).toLocaleString(language === 'en' ? 'en-US' : 'ru-RU')}
                        </p>
                      </div>
                      {event.verified_at && (
                        <div>
                          <p className="text-slate-500 dark:text-slate-400 mb-1">
                            {language === 'en' ? 'Verified At:' : 'Верифицировано:'}
                          </p>
                          <p className="text-slate-900 dark:text-white">
                            {new Date(event.verified_at).toLocaleString(language === 'en' ? 'en-US' : 'ru-RU')}
                          </p>
                        </div>
                      )}
                      <div>
                        <p className="text-slate-500 dark:text-slate-400 mb-1">
                          {language === 'en' ? 'Witness Node:' : 'Узел-свидетель:'}
                        </p>
                        <p className="text-slate-900 dark:text-white">{event.witness_node}</p>
                      </div>
                      <div>
                        <p className="text-slate-500 dark:text-slate-400 mb-1">
                          {language === 'en' ? 'Blockchain:' : 'Блокчейн:'}
                        </p>
                        <p className="text-slate-900 dark:text-white">{event.blockchain_network}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 mt-4 text-xs text-slate-500 dark:text-slate-400 flex-wrap">
                      <a
                        href={event.orbital_witness_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-purple-600 dark:text-purple-400 hover:underline"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>{language === 'en' ? 'View Proof' : 'Смотреть доказательство'}</span>
                      </a>
                      {event.blockchain_tx && (
                        <a
                          href={`https://blockstream.info/tx/${event.blockchain_tx}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-orange-600 dark:text-orange-400 hover:underline"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>{language === 'en' ? 'Bitcoin TX' : 'Bitcoin транзакция'}</span>
                        </a>
                      )}
                      {event.verification_time_minutes !== null && event.verification_time_minutes > 0 && (
                        <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                          <Clock className="w-3 h-3" />
                          <span>{event.verification_time_minutes.toFixed(0)} min</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {filteredEvents.length === 0 && (
          <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-2xl">
            <div className="text-6xl mb-4">🌌</div>
            <p className="text-slate-600 dark:text-slate-400">
              {language === 'en' ? 'No orbital events found' : 'Орбитальные события не найдены'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
