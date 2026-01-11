import { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Target, Calendar, DollarSign, Users, Award, TrendingUp, Building2, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { AoiAvatar } from '../components/AoiAvatar';

interface Grant {
  id: string;
  title: string;
  description_en: string | null;
  description_ru: string | null;
  amount_usd: number;
  institution: string;
  status: 'proposed' | 'active' | 'completed' | 'paused';
  started_at: string | null;
  completed_at: string | null;
  created_at: string;
}

interface Collaboration {
  id: string;
  name: string;
  type: string;
  status: string;
  description_en: string | null;
  description_ru: string | null;
  logo_url: string | null;
  website: string | null;
  started_at: string | null;
}

export default function GrantsPage() {
  const { language } = useLanguage();
  const [grants, setGrants] = useState<Grant[]>([]);
  const [collaborations, setCollaborations] = useState<Collaboration[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'completed'>('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [grantsResult, collabResult] = await Promise.all([
        supabase
          .from('foundation_grants')
          .select('*')
          .order('created_at', { ascending: false }),
        supabase
          .from('research_collaborations')
          .select('*')
          .eq('type', 'research')
          .order('started_at', { ascending: false })
      ]);

      if (grantsResult.error) throw grantsResult.error;
      if (collabResult.error) throw collabResult.error;

      setGrants(grantsResult.data || []);
      setCollaborations(collabResult.data || []);
    } catch (error) {
      console.error('Error loading grants:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredGrants = grants.filter(g => {
    if (filterStatus === 'all') return true;
    return g.status === filterStatus;
  });

  const activeGrants = grants.filter(g => g.status === 'active');
  const totalFunding = grants.reduce((sum, g) => sum + parseFloat(g.amount_usd.toString()), 0);
  const completedGrants = grants.filter(g => g.status === 'completed');

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <TrendingUp className="w-5 h-5 text-green-500" />;
      case 'completed': return <CheckCircle2 className="w-5 h-5 text-blue-500" />;
      case 'paused': return <Clock className="w-5 h-5 text-yellow-500" />;
      default: return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      active: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
      completed: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
      paused: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300',
      proposed: 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300',
    };

    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${styles[status as keyof typeof styles]}`}>
        {language === 'en' ? status.charAt(0).toUpperCase() + status.slice(1) :
          status === 'active' ? 'Активный' :
          status === 'completed' ? 'Завершён' :
          status === 'paused' ? 'Приостановлен' : 'Предложен'}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">
            {language === 'en' ? 'Loading grants...' : 'Загрузка грантов...'}
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
            <AoiAvatar size="lg" emotion="happy" level="guardian" showKanji={true} />
            <div className="text-left">
              <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
                {language === 'en' ? 'Research Grants' : 'Научные гранты'}
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-400">
                {language === 'en'
                  ? 'Supporting breakthrough research in pediatric brain tumors'
                  : 'Поддержка прорывных исследований опухолей мозга у детей'}
              </p>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <TrendingUp className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {language === 'en' ? 'Active Grants' : 'Активных грантов'}
                </p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">
                  {activeGrants.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <DollarSign className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {language === 'en' ? 'Total Funding' : 'Всего финансирования'}
                </p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">
                  ${(totalFunding / 1000).toFixed(0)}k
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <CheckCircle2 className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {language === 'en' ? 'Completed' : 'Завершено'}
                </p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">
                  {completedGrants.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-white dark:bg-slate-800 rounded-xl shadow-lg p-1.5 gap-1">
            {['all', 'active', 'completed'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status as any)}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  filterStatus === status
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                {language === 'en'
                  ? status.charAt(0).toUpperCase() + status.slice(1)
                  : status === 'all' ? 'Все' : status === 'active' ? 'Активные' : 'Завершённые'}
              </button>
            ))}
          </div>
        </div>

        {/* Grants Grid */}
        <div className="space-y-6 mb-12">
          {filteredGrants.map((grant) => {
            const description = language === 'en' ? grant.description_en : grant.description_ru;
            return (
              <div
                key={grant.id}
                className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {getStatusIcon(grant.status)}
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                          {grant.title}
                        </h3>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400 mb-3">
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4" />
                          <span>{grant.institution}</span>
                        </div>
                        {grant.started_at && (
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>
                              {new Date(grant.started_at).toLocaleDateString(language === 'en' ? 'en-US' : 'ru-RU')}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      {getStatusBadge(grant.status)}
                      <div className="text-right">
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {language === 'en' ? 'Grant Amount' : 'Сумма гранта'}
                        </p>
                        <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                          ${grant.amount_usd.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {description && (
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                      {description}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Research Collaborations */}
        {collaborations.length > 0 && (
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-8 text-center">
              {language === 'en' ? 'Research Collaborations' : 'Исследовательские партнёрства'}
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {collaborations.map((collab) => {
                const description = language === 'en' ? collab.description_en : collab.description_ru;
                return (
                  <div
                    key={collab.id}
                    className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 hover:shadow-2xl transition-shadow"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      {collab.logo_url ? (
                        <img src={collab.logo_url} alt={collab.name} className="w-12 h-12 rounded-lg" />
                      ) : (
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                          <Users className="w-6 h-6 text-white" />
                        </div>
                      )}
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                          {collab.name}
                        </h3>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          collab.status === 'active'
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                            : 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300'
                        }`}>
                          {collab.status}
                        </span>
                      </div>
                    </div>
                    {description && (
                      <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
                        {description}
                      </p>
                    )}
                    {collab.website && (
                      <a
                        href={collab.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 dark:text-blue-400 text-sm hover:underline flex items-center gap-2"
                      >
                        {language === 'en' ? 'Visit website' : 'Посетить сайт'} →
                      </a>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
