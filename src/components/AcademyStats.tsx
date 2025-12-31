import { useEffect, useState } from 'react';
import { BookOpen, Award, Target, TrendingUp, Sparkles, Shield, Cpu, Zap } from 'lucide-react';
import { academyService, UserXP } from '../services/academyService';
import { useLanguage } from '../contexts/LanguageContext';
import { supabase } from '../lib/supabase';

export function AcademyStats() {
  const [userXP, setUserXP] = useState<UserXP | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { language } = useLanguage();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setIsAuthenticated(!!session);

    if (session) {
      await loadUserXP();
    } else {
      setLoading(false);
    }
  };

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

  if (!isAuthenticated) {
    return (
      <div className="relative overflow-hidden rounded-3xl border-2 border-purple-300 dark:border-purple-500/40 bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 p-8 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-blue-500/5 to-transparent pointer-events-none"></div>
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-400/10 dark:bg-purple-500/5 rounded-full blur-3xl"></div>

        <div className="relative z-10">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Shield className="w-12 h-12 text-purple-600 dark:text-purple-400" />
            <h3 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 dark:from-purple-400 dark:via-blue-400 dark:to-cyan-400 bg-clip-text text-transparent">
              {language === 'en' ? 'Join Owl Warrior Brotherhood' : 'Присоединяйтесь к Owl Warrior Brotherhood'}
            </h3>
            <Sparkles className="w-8 h-8 text-cyan-600 dark:text-cyan-400 animate-pulse" />
          </div>

          <p className="text-center text-lg text-slate-700 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            {language === 'en'
              ? 'Become part of a global community learning Web3, mastering blockchain technology, and training with modern AI inheritance systems. Start your journey to becoming a digital guardian.'
              : 'Станьте частью глобального сообщества, изучающего Web3, осваивающего технологию блокчейн и обучающегося с помощью современных систем ИИ с наследованием. Начните свой путь к тому, чтобы стать цифровым защитником.'}
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/80 dark:bg-slate-700/50 backdrop-blur-sm rounded-2xl p-6 border border-purple-200 dark:border-purple-500/30 hover:scale-105 transition-transform">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                <Cpu className="w-7 h-7 text-white" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                {language === 'en' ? 'Master Web3' : 'Освойте Web3'}
              </h4>
              <p className="text-sm text-slate-600 dark:text-gray-400">
                {language === 'en'
                  ? 'Learn blockchain, smart contracts, and decentralized systems from the ground up'
                  : 'Изучайте блокчейн, смарт-контракты и децентрализованные системы с нуля'}
              </p>
            </div>

            <div className="bg-white/80 dark:bg-slate-700/50 backdrop-blur-sm rounded-2xl p-6 border border-blue-200 dark:border-blue-500/30 hover:scale-105 transition-transform">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                <Zap className="w-7 h-7 text-white" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                {language === 'en' ? 'AI-Powered Learning' : 'Обучение с ИИ'}
              </h4>
              <p className="text-sm text-slate-600 dark:text-gray-400">
                {language === 'en'
                  ? 'Train with advanced AI systems that adapt to your learning style and progress'
                  : 'Обучайтесь с продвинутыми системами ИИ, адаптирующимися к вашему стилю и прогрессу'}
              </p>
            </div>

            <div className="bg-white/80 dark:bg-slate-700/50 backdrop-blur-sm rounded-2xl p-6 border border-cyan-200 dark:border-cyan-500/30 hover:scale-105 transition-transform">
              <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                <Award className="w-7 h-7 text-white" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                {language === 'en' ? 'Earn Certificates' : 'Получайте сертификаты'}
              </h4>
              <p className="text-sm text-slate-600 dark:text-gray-400">
                {language === 'en'
                  ? 'Build verifiable credentials and achievements recognized across the ecosystem'
                  : 'Создавайте проверяемые учетные данные и достижения, признанные в экосистеме'}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/app"
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              {language === 'en' ? 'Start Your Journey' : 'Начать путешествие'}
            </a>
            <a
              href="/academy"
              className="px-8 py-4 border-2 border-purple-600 dark:border-purple-400 hover:bg-purple-50 dark:hover:bg-slate-700 text-purple-600 dark:text-purple-400 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2"
            >
              <BookOpen className="w-5 h-5" />
              {language === 'en' ? 'Explore Academy' : 'Исследовать Академию'}
            </a>
          </div>
        </div>
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
