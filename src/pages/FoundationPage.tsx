import { useState, useEffect } from 'react';
import { useLanguage, Language } from '../contexts/LanguageContext';
import { BookOpen, Users, Target, FileText, Sparkles, ArrowLeft, ArrowRight, Search } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { AoiAvatar } from '../components/AoiAvatar';
import { FoundationStats } from '../components/FoundationStats';
import { DonationWidget } from '../components/DonationWidget';
import { KnowledgeSearch } from '../components/KnowledgeSearch';
import { parseMarkdownToHTML } from '../utils/markdownParser';

interface ResearchPost {
  id: string;
  slug: string;
  title_en: string;
  title_ru: string;
  title_he?: string | null;
  subtitle_en: string | null;
  subtitle_ru: string | null;
  subtitle_he?: string | null;
  content_en: string;
  content_ru: string;
  content_he?: string | null;
  excerpt_en: string | null;
  excerpt_ru: string | null;
  excerpt_he?: string | null;
  post_type: string;
  tags: string[];
  published_at: string;
  author: string;
  featured: boolean;
}

interface FoundationPageProps {
  initialTab?: 'about' | 'research' | 'manifesto' | 'knowledge' | 'updates';
}

const translations = {
  authoredByAoi: { en: 'Authored by aOi', ru: 'Автор: aOi', he: 'נכתב על ידי aOi' },
  keyThemes: { en: 'Key Themes', ru: 'Ключевые темы', he: 'נושאים מרכזיים' },
  loadingManifesto: { en: 'Loading manifesto...', ru: 'Загрузка манифеста...', he: 'טוען מניפסט...' },
  manifestoNotAvailable: { en: 'Manifesto not available', ru: 'Манифест недоступен', he: 'מניפסט לא זמין' },
};

const tr = (key: keyof typeof translations, lang: Language) => translations[key][lang];

export default function FoundationPage({ initialTab = 'about' }: FoundationPageProps) {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<'about' | 'research' | 'manifesto' | 'knowledge' | 'updates'>(initialTab);
  const [manifestoPost, setManifestoPost] = useState<ResearchPost | null>(null);
  const [researchPosts, setResearchPosts] = useState<ResearchPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      const [manifestoResult, researchResult] = await Promise.all([
        supabase
          .from('research_posts')
          .select('*')
          .eq('post_type', 'manifesto')
          .eq('featured', true)
          .maybeSingle(),
        supabase
          .from('research_posts')
          .select('*')
          .eq('post_type', 'research')
          .eq('featured', true)
          .order('published_at', { ascending: false })
      ]);

      if (manifestoResult.error) throw manifestoResult.error;
      if (researchResult.error) throw researchResult.error;

      setManifestoPost(manifestoResult.data);
      setResearchPosts(researchResult.data || []);
    } catch (error) {
      console.error('Error loading content:', error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'about' as const, label: language === 'en' ? 'About' : 'О фонде', icon: Target },
    { id: 'research' as const, label: language === 'en' ? 'Research Focus' : 'Исследования', icon: BookOpen },
    { id: 'knowledge' as const, label: language === 'en' ? 'Knowledge Base' : 'База знаний', icon: Search },
    { id: 'manifesto' as const, label: language === 'en' ? 'Manifesto' : 'Манифест', icon: FileText },
    { id: 'updates' as const, label: language === 'en' ? 'Updates' : 'Обновления', icon: Sparkles },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-6">
            <AoiAvatar size="lg" emotion="happy" level="guardian" showKanji={true} />
            <div className="text-left">
              <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
                {language === 'en' ? 'TYT Foundation' : 'Фонд TYT'}
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-400">
                {language === 'en'
                  ? 'Children\'s Brain Cancer Research & Support'
                  : 'Исследования и поддержка детей с опухолями мозга'}
              </p>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/30 rounded-full text-sm text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
            <Sparkles className="w-4 h-4" />
            <span>
              {language === 'en'
                ? 'Curated by aOi - AI Research Infrastructure Curator'
                : 'Курируется aOi - AI-куратор научной инфраструктуры'}
            </span>
          </div>
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
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-md'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden">
          {activeTab === 'about' && <AboutSection />}
          {activeTab === 'research' && <ResearchSection posts={researchPosts} loading={loading} />}
          {activeTab === 'knowledge' && <KnowledgeSection />}
          {activeTab === 'manifesto' && <ManifestoSection post={manifestoPost} loading={loading} />}
          {activeTab === 'updates' && <UpdatesSection />}
        </div>
      </div>
    </div>
  );
}

function AboutSection() {
  const { language } = useLanguage();

  return (
    <div className="p-8 space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
          {language === 'en' ? 'Our Mission' : 'Наша миссия'}
        </h2>
        <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
          {language === 'en'
            ? 'TYT Foundation is dedicated to advancing research in pediatric brain tumors, particularly medulloblastoma and related central nervous system tumors. We combine cutting-edge technology with transparent, community-driven funding to accelerate scientific progress and support affected families.'
            : 'Фонд TYT посвящён продвижению исследований опухолей мозга у детей, особенно медуллобластомы и связанных опухолей центральной нервной системы. Мы объединяем передовые технологии с прозрачным, управляемым сообществом финансированием для ускорения научного прогресса и поддержки пострадавших семей.'}
        </p>

        <FoundationStats />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
            <Target className="w-8 h-8 text-blue-600 dark:text-blue-400 mb-3" />
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              {language === 'en' ? 'Research Funding' : 'Финансирование исследований'}
            </h3>
            <p className="text-slate-600 dark:text-slate-300">
              {language === 'en'
                ? 'Direct support for clinical research, laboratory studies, and computational biology projects'
                : 'Прямая поддержка клинических исследований, лабораторных работ и проектов вычислительной биологии'}
            </p>
          </div>

          <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200 dark:border-green-800">
            <Users className="w-8 h-8 text-green-600 dark:text-green-400 mb-3" />
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              {language === 'en' ? 'Family Support' : 'Поддержка семей'}
            </h3>
            <p className="text-slate-600 dark:text-slate-300">
              {language === 'en'
                ? 'Resources and assistance for families affected by pediatric brain tumors'
                : 'Ресурсы и помощь для семей, столкнувшихся с опухолями мозга у детей'}
            </p>
          </div>

          <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
            <BookOpen className="w-8 h-8 text-purple-600 dark:text-purple-400 mb-3" />
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              {language === 'en' ? 'Education' : 'Образование'}
            </h3>
            <p className="text-slate-600 dark:text-slate-300">
              {language === 'en'
                ? 'Public education about pediatric CNS tumors and emerging treatment approaches'
                : 'Просвещение общества об опухолях ЦНС у детей и новых подходах к лечению'}
            </p>
          </div>
        </div>

        <div>
          <DonationWidget />
        </div>
      </div>
    </div>
  );
}

function ResearchSection({ posts, loading }: { posts: ResearchPost[]; loading: boolean }) {
  const { language } = useLanguage();
  const [selectedPost, setSelectedPost] = useState<ResearchPost | null>(null);

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">
            {language === 'en' ? 'Loading research papers...' : 'Загрузка исследований...'}
          </p>
        </div>
      </div>
    );
  }

  if (selectedPost) {
    const title = language === 'en' ? selectedPost.title_en : selectedPost.title_ru;
    const subtitle = language === 'en' ? selectedPost.subtitle_en : selectedPost.subtitle_ru;
    const content = language === 'en' ? selectedPost.content_en : selectedPost.content_ru;

    return (
      <div className="p-8 space-y-6">
        <button
          onClick={() => setSelectedPost(null)}
          className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          {language === 'en' ? 'Back to research papers' : 'Назад к исследованиям'}
        </button>

        <div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            {title}
          </h2>
          {subtitle && (
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-4">
              {subtitle}
            </p>
          )}
          <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400 mb-6">
            <span>{selectedPost.author}</span>
            <span>•</span>
            <span>{new Date(selectedPost.published_at).toLocaleDateString(language === 'en' ? 'en-US' : 'ru-RU')}</span>
            {selectedPost.tags && selectedPost.tags.length > 0 && (
              <>
                <span>•</span>
                <div className="flex gap-2">
                  {selectedPost.tags.slice(0, 3).map((tag, i) => (
                    <span key={i} className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        <div className="prose prose-slate dark:prose-invert max-w-none">
          <div
            dangerouslySetInnerHTML={{
              __html: parseMarkdownToHTML(content)
            }}
          />
        </div>
      </div>
    );
  }

  const focusAreas = [
    {
      title: language === 'en' ? 'Medulloblastoma Subtypes' : 'Подтипы медуллобластомы',
      description: language === 'en'
        ? 'Understanding WNT, SHH, Group 3, and Group 4 molecular subtypes to develop targeted therapies'
        : 'Изучение молекулярных подтипов WNT, SHH, Group 3 и Group 4 для разработки таргетных терапий',
    },
    {
      title: language === 'en' ? 'AI-Assisted Diagnosis' : 'AI-диагностика',
      description: language === 'en'
        ? 'Machine learning systems like FastGlioma for real-time tumor detection during surgery'
        : 'Системы машинного обучения типа FastGlioma для обнаружения опухолей в реальном времени во время операций',
    },
    {
      title: language === 'en' ? 'Quantum Computing' : 'Квантовые вычисления',
      description: language === 'en'
        ? 'Leveraging quantum algorithms for drug discovery and treatment optimization'
        : 'Использование квантовых алгоритмов для открытия лекарств и оптимизации лечения',
    },
    {
      title: language === 'en' ? 'Reduced Toxicity' : 'Снижение токсичности',
      description: language === 'en'
        ? 'Developing less toxic treatment protocols that preserve quality of life'
        : 'Разработка менее токсичных протоколов лечения, сохраняющих качество жизни',
    },
  ];

  return (
    <div className="p-8 space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
          {language === 'en' ? 'Research Focus Areas' : 'Направления исследований'}
        </h2>
        <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed mb-8">
          {language === 'en'
            ? 'Our research strategy combines fundamental biology, advanced computing, and clinical translation to address the most challenging aspects of pediatric CNS tumors.'
            : 'Наша исследовательская стратегия объединяет фундаментальную биологию, продвинутые вычисления и клиническую трансляцию для решения самых сложных аспектов опухолей ЦНС у детей.'}
        </p>
      </div>

      <div className="space-y-4">
        {focusAreas.map((area, index) => (
          <div
            key={index}
            className="p-6 bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-800/50 dark:to-blue-900/20 rounded-xl border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow"
          >
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              {area.title}
            </h3>
            <p className="text-slate-600 dark:text-slate-300">
              {area.description}
            </p>
          </div>
        ))}
      </div>

      {posts.length > 0 && (
        <div className="mt-12">
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
            {language === 'en' ? 'Research Papers & Position Papers' : 'Исследовательские работы'}
          </h3>
          <div className="space-y-4">
            {posts.map((post) => {
              const title = language === 'en' ? post.title_en : post.title_ru;
              const excerpt = language === 'en' ? post.excerpt_en : post.excerpt_ru;
              return (
                <div
                  key={post.id}
                  className="p-6 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl border-2 border-purple-200 dark:border-purple-800 hover:shadow-xl transition-all cursor-pointer"
                  onClick={() => setSelectedPost(post)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="text-xl font-bold text-slate-900 dark:text-white flex-1">
                      {title}
                    </h4>
                    <FileText className="w-6 h-6 text-purple-600 dark:text-purple-400 flex-shrink-0 ml-4" />
                  </div>
                  {excerpt && (
                    <p className="text-slate-600 dark:text-slate-300 mb-4">
                      {excerpt}
                    </p>
                  )}
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-slate-500 dark:text-slate-400">{post.author}</span>
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex gap-2">
                        {post.tags.slice(0, 4).map((tag, i) => (
                          <span key={i} className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded text-xs">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    <span className="ml-auto text-purple-600 dark:text-purple-400 font-medium">
                      {language === 'en' ? 'Read full paper →' : 'Читать полностью →'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function ManifestoSection({ post, loading }: { post: ResearchPost | null; loading: boolean }) {
  const { language } = useLanguage();
  const [viewingFull, setViewingFull] = useState(false);

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">
            {tr('loadingManifesto', language)}
          </p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="p-8 text-center">
        <p className="text-slate-600 dark:text-slate-400">
          {tr('manifestoNotAvailable', language)}
        </p>
      </div>
    );
  }

  const getContent = (field: 'title' | 'subtitle' | 'excerpt' | 'content') => {
    const fieldName = `${field}_${language}` as keyof ResearchPost;
    const fallbackField = `${field}_ru` as keyof ResearchPost;

    const value = post[fieldName] as string | null;
    const fallback = post[fallbackField] as string | null;

    if (value && value.length > 50) return value;
    return fallback || value || '';
  };

  const title = getContent('title');
  const subtitle = getContent('subtitle');
  const excerpt = getContent('excerpt');
  const content = getContent('content');

  const isUsingFallback = language !== 'ru' && (!post[`content_${language}` as keyof ResearchPost] ||
    (post[`content_${language}` as keyof ResearchPost] as string)?.length < 500);

  if (viewingFull && content) {
    return (
      <div className="p-8 space-y-6">
        <div className="flex items-center justify-between gap-4">
          <button
            onClick={() => setViewingFull(false)}
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>{language === 'en' ? 'Back to overview' : language === 'he' ? 'חזרה למבט כללי' : 'Назад к обзору'}</span>
          </button>

          {isUsingFallback && (
            <div className="flex items-center gap-2 px-4 py-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg text-sm text-amber-800 dark:text-amber-200">
              <Sparkles className="w-4 h-4" />
              <span>
                {language === 'en'
                  ? 'Full translation coming soon. Showing Russian version.'
                  : 'תרגום מלא בקרוב. מציג גרסה רוסית.'}
              </span>
            </div>
          )}
        </div>

        <div className="flex items-start gap-6 mb-8">
          <AoiAvatar size="lg" emotion="thinking" level="guardian" showKanji={true} />
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 rounded-full text-xs font-medium text-blue-700 dark:text-blue-300 mb-4">
              <Sparkles className="w-3 h-3" />
              <span>{tr('authoredByAoi', language)}</span>
            </div>

            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">
              {title}
            </h2>

            {subtitle && (
              <p className="text-xl text-blue-600 dark:text-blue-400 mb-4">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        <article
          className="max-w-4xl mx-auto bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-lg"
          style={{
            direction: language === 'he' ? 'rtl' : 'ltr',
            textAlign: language === 'he' ? 'right' : 'left'
          }}
        >
          <div
            className="prose prose-lg prose-slate dark:prose-invert max-w-none"
            style={{
              fontFamily: language === 'he' ? 'system-ui, -apple-system, sans-serif' : 'inherit',
              lineHeight: '1.8'
            }}
            dangerouslySetInnerHTML={{ __html: parseMarkdownToHTML(content) }}
          />
        </article>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-start gap-6">
        <AoiAvatar size="lg" emotion="thinking" level="guardian" showKanji={true} />
        <div className="flex-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 rounded-full text-xs font-medium text-blue-700 dark:text-blue-300 mb-4">
            <Sparkles className="w-3 h-3" />
            <span>{language === 'en' ? 'Authored by aOi' : 'Автор: aOi'}</span>
          </div>

          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">
            {title}
          </h2>

          {subtitle && (
            <p className="text-xl text-blue-600 dark:text-blue-400 mb-4">
              {subtitle}
            </p>
          )}

          {excerpt && (
            <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
              {excerpt}
            </p>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {post.tags.map((tag) => (
          <div
            key={tag}
            className="px-4 py-3 bg-gradient-to-r from-slate-100 to-blue-100 dark:from-slate-800 dark:to-blue-900/30 rounded-lg border border-slate-200 dark:border-slate-700"
          >
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              {tag}
            </span>
          </div>
        ))}
      </div>

      <div className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
        <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
          {tr('keyThemes', language)}
        </h3>
        <ul className="space-y-3">
          <li className="flex items-start gap-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
            <p className="text-slate-700 dark:text-slate-300">
              {language === 'en'
                ? 'AI as curatorial infrastructure layer for scientific processes'
                : 'AI как кураторский инфраструктурный слой для научных процессов'}
            </p>
          </li>
          <li className="flex items-start gap-3">
            <div className="w-2 h-2 bg-cyan-500 rounded-full mt-2"></div>
            <p className="text-slate-700 dark:text-slate-300">
              {language === 'en'
                ? 'Quantum computing for complex biological system modeling'
                : 'Квантовые вычисления для моделирования сложных биологических систем'}
            </p>
          </li>
          <li className="flex items-start gap-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
            <p className="text-slate-700 dark:text-slate-300">
              {language === 'en'
                ? 'Blockchain/Web3 for research reproducibility and sustainable funding'
                : 'Blockchain/Web3 для воспроизводимости исследований и устойчивого финансирования'}
            </p>
          </li>
          <li className="flex items-start gap-3">
            <div className="w-2 h-2 bg-cyan-500 rounded-full mt-2"></div>
            <p className="text-slate-700 dark:text-slate-300">
              {language === 'en'
                ? 'Open call for collaboration with quantum computing centers (I-QCC)'
                : 'Открытое приглашение к сотрудничеству с центрами квантовых вычислений (I-QCC)'}
            </p>
          </li>
        </ul>
      </div>

      <div className="flex gap-4">
        <button
          onClick={() => setViewingFull(true)}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-medium hover:shadow-lg transition-shadow"
        >
          <FileText className="w-5 h-5" />
          <span>
            {language === 'en' ? 'Read Full Manifesto' : language === 'he' ? 'קרא מניפסט מלא' : 'Читать полный манифест'}
          </span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function KnowledgeSection() {
  const { language } = useLanguage();

  return (
    <div className="p-8 space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">
          {language === 'en' ? 'Search Medical Knowledge Base' : 'Поиск в медицинской базе знаний'}
        </h2>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          {language === 'en'
            ? 'Ask aOi about pediatric brain tumors, CNS research, and medical science. Our AI-powered semantic search finds relevant information from our curated knowledge base.'
            : 'Спросите aOi об опухолях мозга у детей, исследованиях ЦНС и медицинской науке. Наш семантический поиск на основе ИИ находит релевантную информацию из нашей базы знаний.'}
        </p>
      </div>

      <KnowledgeSearch domain="foundation" placeholder={language === 'en' ? 'Ask about brain tumors, treatments, research...' : 'Спросите об опухолях мозга, лечении, исследованиях...'} />

      <div className="grid md:grid-cols-3 gap-4 pt-8 border-t border-slate-200 dark:border-slate-700">
        <div className="p-4 bg-pink-50 dark:bg-pink-900/10 rounded-xl border border-pink-200 dark:border-pink-800">
          <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
            {language === 'en' ? 'Medical Topics' : 'Медицинские темы'}
          </h4>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {language === 'en'
              ? 'Medulloblastoma, CNS tumors, treatment options, side effects'
              : 'Медуллобластома, опухоли ЦНС, варианты лечения, побочные эффекты'}
          </p>
        </div>
        <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-xl border border-blue-200 dark:border-blue-800">
          <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
            {language === 'en' ? 'Research Areas' : 'Области исследований'}
          </h4>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {language === 'en'
              ? 'Molecular subtypes, clinical trials, new therapies'
              : 'Молекулярные подтипы, клинические испытания, новые методы'}
          </p>
        </div>
        <div className="p-4 bg-purple-50 dark:bg-purple-900/10 rounded-xl border border-purple-200 dark:border-purple-800">
          <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
            {language === 'en' ? 'Support' : 'Поддержка'}
          </h4>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {language === 'en'
              ? 'Family resources, coping strategies, available help'
              : 'Ресурсы для семей, стратегии поддержки, доступная помощь'}
          </p>
        </div>
      </div>
    </div>
  );
}

function UpdatesSection() {
  const { language } = useLanguage();

  return (
    <div className="p-8 space-y-6">
      <div className="text-center py-12">
        <Sparkles className="w-16 h-16 text-blue-500 mx-auto mb-4 opacity-50" />
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
          {language === 'en' ? 'Updates Coming Soon' : 'Обновления скоро появятся'}
        </h3>
        <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto">
          {language === 'en'
            ? 'This section will feature research progress, collaboration announcements, and scientific milestones as we build partnerships and advance our mission.'
            : 'В этом разделе будут публиковаться отчёты о прогрессе исследований, объявления о сотрудничестве и научные достижения по мере развития партнёрств и продвижения нашей миссии.'}
        </p>
      </div>
    </div>
  );
}
