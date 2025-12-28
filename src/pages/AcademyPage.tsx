import { useState, useEffect } from 'react';
import { BookOpen, Award, Target, Clock, Sparkles, TrendingUp } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { academyService, OwlRank, LearningTrack, UserXP } from '../services/academyService';
import { AoiAvatar } from '../components/AoiAvatar';

export default function AcademyPage() {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<'tracks' | 'progress'>('tracks');
  const [ranks, setRanks] = useState<OwlRank[]>([]);
  const [tracks, setTracks] = useState<LearningTrack[]>([]);
  const [userXP, setUserXP] = useState<UserXP | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAcademyData();
  }, []);

  const loadAcademyData = async () => {
    try {
      const [ranksData, tracksData, xpData] = await Promise.all([
        academyService.getRanks(),
        academyService.getTracks(),
        academyService.getUserXP(),
      ]);
      setRanks(ranksData);
      setTracks(tracksData);
      setUserXP(xpData);
    } finally {
      setLoading(false);
    }
  };

  const currentRank = ranks.find(r => r.rank_name === (userXP?.current_rank || 'Worker')) || ranks[0];
  const nextRank = currentRank ? academyService.getNextRank(currentRank.rank_name, ranks) : null;

  const tabs = [
    { id: 'tracks' as const, label: language === 'en' ? 'Learning Tracks' : 'Треки обучения', icon: BookOpen },
    { id: 'progress' as const, label: language === 'en' ? 'Progress & Achievements' : 'Прогресс и достижения', icon: Award },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-6">
            <AoiAvatar size="lg" emotion="thinking" level="academic" showKanji={true} />
            <div className="text-left">
              <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
                {language === 'en' ? 'Crypto Academia' : 'Крипто Академия'}
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-400">
                {language === 'en'
                  ? 'Learn blockchain technology and earn XP rewards'
                  : 'Изучайте блокчейн технологии и зарабатывайте XP'}
              </p>
            </div>
          </div>
        </div>

        {currentRank && (
          <div className="mb-8 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-2xl p-8 border-2 border-amber-200 dark:border-amber-800">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="text-6xl">{currentRank.icon_emoji}</div>
                <div>
                  <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                    {language === 'en' ? 'Current Owl Rank' : 'Текущий ранг Совы'}
                  </div>
                  <div className="text-3xl font-bold text-slate-900 dark:text-white">
                    {currentRank.rank_name}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    {language === 'en' ? currentRank.description_en : currentRank.description_ru}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold text-amber-600 dark:text-amber-400 mb-1">
                  {userXP?.total_xp || 0}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  {language === 'en' ? 'Total XP' : 'Всего XP'}
                </div>
              </div>
            </div>

            {nextRank && (
              <div>
                <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-400 mb-2">
                  <span>{language === 'en' ? 'Progress to next rank' : 'Прогресс до следующего ранга'}</span>
                  <span>
                    {userXP?.total_xp || 0} / {nextRank.xp_min} XP
                  </span>
                </div>
                <div className="w-full bg-amber-200 dark:bg-amber-900/30 rounded-full h-3 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-500"
                    style={{
                      width: `${Math.min(100, ((userXP?.total_xp || 0) / nextRank.xp_min) * 100)}%`,
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        <div className="mb-8">
          <AllOwlRanks ranks={ranks} currentRank={currentRank?.rank_name || 'Worker'} language={language} />
        </div>

        <div className="mb-8 flex justify-center">
          <div className="inline-flex bg-white dark:bg-slate-800 rounded-xl shadow-lg p-1.5 gap-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all
                    ${activeTab === tab.id
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8">
          {activeTab === 'tracks' && <TracksSection tracks={tracks} language={language} loading={loading} />}
          {activeTab === 'progress' && <ProgressSection userXP={userXP} language={language} loading={loading} />}
        </div>
      </div>
    </div>
  );
}

interface AllOwlRanksProps {
  ranks: OwlRank[];
  currentRank: string;
  language: string;
}

function AllOwlRanks({ ranks, currentRank, language }: AllOwlRanksProps) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8">
      <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
        <Sparkles className="w-6 h-6 text-amber-500" />
        {language === 'en' ? 'All Owl Ranks' : 'Все ранги Совы'}
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {ranks.map((rank) => {
          const isCurrent = rank.rank_name === currentRank;
          return (
            <div
              key={rank.id}
              className={`p-6 rounded-xl border-2 text-center transition-all ${
                isCurrent
                  ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20 shadow-lg scale-105'
                  : 'border-slate-200 dark:border-slate-700 opacity-60'
              }`}
            >
              <div className="text-5xl mb-3">{rank.icon_emoji}</div>
              <div className="font-bold text-slate-900 dark:text-white mb-1">{rank.rank_name}</div>
              <div className="text-xs text-slate-600 dark:text-slate-400">
                {rank.xp_min}-{rank.xp_max === 999999 ? '∞' : rank.xp_max} XP
              </div>
              {isCurrent && (
                <div className="mt-2 px-3 py-1 bg-amber-500 text-white text-xs font-bold rounded-full inline-block">
                  {language === 'en' ? 'Current' : 'Текущий'}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface TracksSectionProps {
  tracks: LearningTrack[];
  language: string;
  loading: boolean;
}

function TracksSection({ tracks, language, loading }: TracksSectionProps) {
  if (loading) {
    return (
      <div className="grid md:grid-cols-2 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="p-6 bg-slate-100 dark:bg-slate-700 rounded-xl animate-pulse h-48" />
        ))}
      </div>
    );
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20';
      case 'intermediate': return 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20';
      case 'advanced': return 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20';
      default: return 'text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-700';
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
        {language === 'en' ? 'Learning Tracks' : 'Треки обучения'}
      </h2>
      <div className="grid md:grid-cols-2 gap-6">
        {tracks.map((track) => (
          <div
            key={track.id}
            className="p-6 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-700 dark:to-slate-800 rounded-xl border-2 border-slate-200 dark:border-slate-600 hover:border-purple-400 dark:hover:border-purple-600 transition-all hover:shadow-lg cursor-pointer group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="text-4xl">{track.icon}</div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${getDifficultyColor(track.difficulty)}`}>
                {track.difficulty}
              </span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
              {language === 'en' ? track.title_en : track.title_ru}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">
              {language === 'en' ? track.description_en : track.description_ru}
            </p>
            <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{track.estimated_hours}h</span>
              </div>
              <div className="flex items-center gap-1">
                <Target className="w-4 h-4" />
                <span>{track.xp_reward} XP</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

interface ProgressSectionProps {
  userXP: UserXP | null;
  language: string;
  loading: boolean;
}

function ProgressSection({ userXP, language, loading }: ProgressSectionProps) {
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-32 bg-slate-100 dark:bg-slate-700 rounded-xl animate-pulse" />
        <div className="grid md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 bg-slate-100 dark:bg-slate-700 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const stats = [
    {
      icon: BookOpen,
      label: language === 'en' ? 'Tracks Started' : 'Начато треков',
      value: userXP?.tracks_started || 0,
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Award,
      label: language === 'en' ? 'Lessons Completed' : 'Уроков завершено',
      value: userXP?.lessons_completed || 0,
      color: 'from-green-500 to-emerald-500',
    },
    {
      icon: Sparkles,
      label: language === 'en' ? 'Certificates Earned' : 'Получено сертификатов',
      value: userXP?.certificates_earned || 0,
      color: 'from-purple-500 to-pink-500',
    },
  ];

  const completionRate = userXP?.tracks_started
    ? Math.round(((userXP?.lessons_completed || 0) / (userXP.tracks_started * 10)) * 100)
    : 0;

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
        {language === 'en' ? 'Your Progress' : 'Ваш прогресс'}
      </h2>

      <div className="mb-8 p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border-2 border-purple-200 dark:border-purple-800">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            <div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                {language === 'en' ? 'Total XP Earned' : 'Всего заработано XP'}
              </div>
              <div className="text-3xl font-bold text-slate-900 dark:text-white">
                {userXP?.total_xp || 0}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-slate-600 dark:text-slate-400">
              {language === 'en' ? 'Completion Rate' : 'Уровень завершения'}
            </div>
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
              {completionRate}%
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="p-6 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-700 dark:to-slate-800 rounded-xl border-2 border-slate-200 dark:border-slate-600"
            >
              <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center mb-4 shadow-md`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                {stat.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
