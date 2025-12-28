import { useEffect, useState } from 'react';
import { BookOpen, Award, Target, TrendingUp } from 'lucide-react';
import { academyService, UserXP } from '../services/academyService';
import { useLanguage } from '../contexts/LanguageContext';

export function AcademyStats() {
  const [userXP, setUserXP] = useState<UserXP | null>(null);
  const [loading, setLoading] = useState(true);
  const { language } = useLanguage();

  useEffect(() => {
    loadUserXP();
  }, []);

  const loadUserXP = async () => {
    try {
      const data = await academyService.getUserXP();
      setUserXP(data);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white dark:bg-slate-800 rounded-xl p-4 animate-pulse">
            <div className="h-8 w-8 bg-slate-200 dark:bg-slate-700 rounded-lg mb-3"></div>
            <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded mb-2"></div>
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-20"></div>
          </div>
        ))}
      </div>
    );
  }

  const stats = [
    {
      icon: Target,
      value: userXP?.total_xp || 0,
      label: language === 'en' ? 'Total XP' : 'Всего XP',
      color: 'from-amber-500 to-orange-500',
      bgColor: 'from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20',
      borderColor: 'border-amber-200 dark:border-amber-800',
    },
    {
      icon: BookOpen,
      value: userXP?.tracks_started || 0,
      label: language === 'en' ? 'Tracks Started' : 'Треков начато',
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20',
      borderColor: 'border-blue-200 dark:border-blue-800',
    },
    {
      icon: Award,
      value: userXP?.lessons_completed || 0,
      label: language === 'en' ? 'Lessons Done' : 'Уроков пройдено',
      color: 'from-green-500 to-emerald-500',
      bgColor: 'from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20',
      borderColor: 'border-green-200 dark:border-green-800',
    },
    {
      icon: TrendingUp,
      value: userXP?.certificates_earned || 0,
      label: language === 'en' ? 'Certificates' : 'Сертификатов',
      color: 'from-purple-500 to-pink-500',
      bgColor: 'from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20',
      borderColor: 'border-purple-200 dark:border-purple-800',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className={`bg-gradient-to-br ${stat.bgColor} rounded-xl p-4 border ${stat.borderColor} hover:shadow-lg transition-shadow`}
          >
            <div className={`w-10 h-10 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center mb-3 shadow-md`}>
              <Icon className="w-5 h-5 text-white" />
            </div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
              {stat.value}
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400 leading-tight">
              {stat.label}
            </div>
          </div>
        );
      })}
    </div>
  );
}
