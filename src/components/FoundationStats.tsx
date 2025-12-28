import { useEffect, useState } from 'react';
import { DollarSign, Users, Award, Activity, TrendingUp, Building } from 'lucide-react';
import { foundationDataService, FoundationStatistics } from '../services/foundationDataService';
import { useLanguage } from '../contexts/LanguageContext';

export function FoundationStats() {
  const [stats, setStats] = useState<FoundationStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const { language } = useLanguage();

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await foundationDataService.getStatistics();
      setStats(data);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white dark:bg-slate-800 rounded-xl p-4 animate-pulse">
            <div className="h-8 w-8 bg-slate-200 dark:bg-slate-700 rounded-lg mb-3"></div>
            <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded mb-2"></div>
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-20"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  const statItems = [
    {
      icon: DollarSign,
      value: `$${stats.total_donated.toLocaleString()}`,
      label: language === 'en' ? 'Total Donated' : 'Всего донатов',
      color: 'from-green-500 to-emerald-500',
      bgColor: 'from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20',
      borderColor: 'border-green-200 dark:border-green-800',
    },
    {
      icon: Users,
      value: stats.families_supported.toString(),
      label: language === 'en' ? 'Families Supported' : 'Семей поддержано',
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20',
      borderColor: 'border-blue-200 dark:border-blue-800',
    },
    {
      icon: Award,
      value: stats.research_grants.toString(),
      label: language === 'en' ? 'Research Grants' : 'Исследовательских грантов',
      color: 'from-purple-500 to-pink-500',
      bgColor: 'from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20',
      borderColor: 'border-purple-200 dark:border-purple-800',
    },
    {
      icon: Activity,
      value: stats.clinical_trials.toString(),
      label: language === 'en' ? 'Clinical Trials' : 'Клинических испытаний',
      color: 'from-orange-500 to-red-500',
      bgColor: 'from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20',
      borderColor: 'border-orange-200 dark:border-orange-800',
    },
    {
      icon: Building,
      value: stats.partner_hospitals.toString(),
      label: language === 'en' ? 'Partner Hospitals' : 'Партнёрских клиник',
      color: 'from-indigo-500 to-blue-500',
      bgColor: 'from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20',
      borderColor: 'border-indigo-200 dark:border-indigo-800',
    },
    {
      icon: TrendingUp,
      value: '100%',
      label: language === 'en' ? 'Transparency' : 'Прозрачность',
      color: 'from-teal-500 to-green-500',
      bgColor: 'from-teal-50 to-green-50 dark:from-teal-900/20 dark:to-green-900/20',
      borderColor: 'border-teal-200 dark:border-teal-800',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {statItems.map((item, index) => {
        const Icon = item.icon;
        return (
          <div
            key={index}
            className={`bg-gradient-to-br ${item.bgColor} rounded-xl p-4 border ${item.borderColor} hover:shadow-lg transition-shadow`}
          >
            <div className={`w-10 h-10 bg-gradient-to-br ${item.color} rounded-lg flex items-center justify-center mb-3 shadow-md`}>
              <Icon className="w-5 h-5 text-white" />
            </div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
              {item.value}
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400 leading-tight">
              {item.label}
            </div>
          </div>
        );
      })}
    </div>
  );
}
