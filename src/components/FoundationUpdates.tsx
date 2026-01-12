import { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Calendar, ArrowRight, Star, Newspaper, Megaphone, Trophy, FlaskConical, Handshake } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Update {
  id: string;
  title_en: string;
  title_ru: string | null;
  title_he: string | null;
  content_en: string;
  content_ru: string | null;
  content_he: string | null;
  summary_en: string | null;
  summary_ru: string | null;
  update_type: 'news' | 'announcement' | 'milestone' | 'research' | 'partnership';
  published_at: string;
  is_featured: boolean;
  image_url: string | null;
  external_link: string | null;
}

const typeIcons = {
  news: Newspaper,
  announcement: Megaphone,
  milestone: Trophy,
  research: FlaskConical,
  partnership: Handshake,
};

const typeColors = {
  news: 'from-blue-500 to-cyan-500',
  announcement: 'from-amber-500 to-orange-500',
  milestone: 'from-green-500 to-emerald-500',
  research: 'from-teal-500 to-cyan-500',
  partnership: 'from-sky-500 to-blue-500',
};

const typeLabels = {
  en: {
    news: 'News',
    announcement: 'Announcement',
    milestone: 'Milestone',
    research: 'Research',
    partnership: 'Partnership',
  },
  ru: {
    news: 'Новости',
    announcement: 'Объявление',
    milestone: 'Веха',
    research: 'Исследование',
    partnership: 'Партнёрство',
  },
  he: {
    news: 'חדשות',
    announcement: 'הודעה',
    milestone: 'אבן דרך',
    research: 'מחקר',
    partnership: 'שותפות',
  },
};

interface FoundationUpdatesProps {
  limit?: number;
  showFeaturedOnly?: boolean;
  filterType?: string;
}

export function FoundationUpdates({ limit = 6, showFeaturedOnly = false, filterType }: FoundationUpdatesProps) {
  const { language } = useLanguage();
  const [updates, setUpdates] = useState<Update[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<string>(filterType || 'all');

  useEffect(() => {
    loadUpdates();
  }, [showFeaturedOnly]);

  const loadUpdates = async () => {
    try {
      let query = supabase
        .from('foundation_updates')
        .select('*')
        .eq('is_published', true)
        .order('published_at', { ascending: false });

      if (showFeaturedOnly) {
        query = query.eq('is_featured', true);
      }

      if (limit > 0) {
        query = query.limit(limit);
      }

      const { data, error } = await query;

      if (error) throw error;
      setUpdates(data || []);
    } catch (error) {
      console.error('Error loading updates:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUpdates = selectedType === 'all'
    ? updates
    : updates.filter(u => u.update_type === selectedType);

  const getTitle = (update: Update) => {
    if (language === 'ru' && update.title_ru) return update.title_ru;
    if (language === 'he' && update.title_he) return update.title_he;
    return update.title_en;
  };

  const getSummary = (update: Update) => {
    if (language === 'ru' && update.summary_ru) return update.summary_ru;
    return update.summary_en;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(
      language === 'en' ? 'en-US' : language === 'ru' ? 'ru-RU' : 'he-IL',
      { year: 'numeric', month: 'long', day: 'numeric' }
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (updates.length === 0) {
    return (
      <div className="text-center py-12">
        <Newspaper className="w-12 h-12 text-slate-400 mx-auto mb-4" />
        <p className="text-slate-600 dark:text-slate-400">
          {language === 'en' ? 'No updates yet' : language === 'ru' ? 'Пока нет обновлений' : 'אין עדכונים עדיין'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {!filterType && (
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          <button
            onClick={() => setSelectedType('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              selectedType === 'all'
                ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-md'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            {language === 'en' ? 'All' : language === 'ru' ? 'Все' : 'הכל'}
          </button>
          {Object.entries(typeLabels[language as keyof typeof typeLabels] || typeLabels.en).map(([type, label]) => {
            const Icon = typeIcons[type as keyof typeof typeIcons];
            return (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                  selectedType === type
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-md'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            );
          })}
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUpdates.map((update) => {
          const Icon = typeIcons[update.update_type];
          const colorClass = typeColors[update.update_type];
          const typeLabel = typeLabels[language as keyof typeof typeLabels]?.[update.update_type] || typeLabels.en[update.update_type];

          return (
            <article
              key={update.id}
              className={`bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 ${
                update.is_featured ? 'ring-2 ring-amber-400 dark:ring-amber-500' : ''
              }`}
            >
              {update.image_url && (
                <div className="aspect-video overflow-hidden">
                  <img
                    src={update.image_url}
                    alt={getTitle(update)}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}

              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${colorClass} text-white`}>
                    <Icon className="w-3 h-3" />
                    {typeLabel}
                  </div>
                  {update.is_featured && (
                    <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                  )}
                </div>

                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 line-clamp-2">
                  {getTitle(update)}
                </h3>

                {getSummary(update) && (
                  <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 line-clamp-3">
                    {getSummary(update)}
                  </p>
                )}

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                  <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                    <Calendar className="w-4 h-4" />
                    {formatDate(update.published_at)}
                  </div>

                  {update.external_link && (
                    <a
                      href={update.external_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline"
                    >
                      {language === 'en' ? 'Read more' : language === 'ru' ? 'Подробнее' : 'קרא עוד'}
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
