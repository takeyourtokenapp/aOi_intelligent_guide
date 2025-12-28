import { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { BookOpen, Users, Target, FileText, ExternalLink, Sparkles } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { AoiAvatar } from '../components/AoiAvatar';

interface ResearchPost {
  id: string;
  slug: string;
  title_en: string;
  title_ru: string;
  subtitle_en: string | null;
  subtitle_ru: string | null;
  content_en: string;
  content_ru: string;
  excerpt_en: string | null;
  excerpt_ru: string | null;
  post_type: string;
  tags: string[];
  published_at: string;
  author: string;
  featured: boolean;
}

export default function FoundationPage() {
  const { language, t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'about' | 'research' | 'manifesto' | 'updates'>('about');
  const [manifestoPost, setManifestoPost] = useState<ResearchPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadManifesto();
  }, []);

  const loadManifesto = async () => {
    try {
      const { data, error } = await supabase
        .from('research_posts')
        .select('*')
        .eq('post_type', 'manifesto')
        .eq('featured', true)
        .maybeSingle();

      if (error) throw error;
      setManifestoPost(data);
    } catch (error) {
      console.error('Error loading manifesto:', error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'about' as const, label: language === 'en' ? 'About' : 'О фонде', icon: Target },
    { id: 'research' as const, label: language === 'en' ? 'Research Focus' : 'Исследования', icon: BookOpen },
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
          {activeTab === 'research' && <ResearchSection />}
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
        <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
          {language === 'en'
            ? 'TYT Foundation is dedicated to advancing research in pediatric brain tumors, particularly medulloblastoma and related central nervous system tumors. We combine cutting-edge technology with transparent, community-driven funding to accelerate scientific progress and support affected families.'
            : 'Фонд TYT посвящён продвижению исследований опухолей мозга у детей, особенно медуллобластомы и связанных опухолей центральной нервной системы. Мы объединяем передовые технологии с прозрачным, управляемым сообществом финансированием для ускорения научного прогресса и поддержки пострадавших семей.'}
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
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
    </div>
  );
}

function ResearchSection() {
  const { language } = useLanguage();

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
    </div>
  );
}

function ManifestoSection({ post, loading }: { post: ResearchPost | null; loading: boolean }) {
  const { language } = useLanguage();

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">
            {language === 'en' ? 'Loading manifesto...' : 'Загрузка манифеста...'}
          </p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="p-8 text-center">
        <p className="text-slate-600 dark:text-slate-400">
          {language === 'en' ? 'Manifesto not available' : 'Манифест недоступен'}
        </p>
      </div>
    );
  }

  const title = language === 'en' ? post.title_en : post.title_ru;
  const subtitle = language === 'en' ? post.subtitle_en : post.subtitle_ru;
  const excerpt = language === 'en' ? post.excerpt_en : post.excerpt_ru;

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
          {language === 'en' ? 'Key Themes' : 'Ключевые темы'}
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
        <a
          href="/TYT_RESEARCH_MANIFESTO_I-QCC.md"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-medium hover:shadow-lg transition-shadow"
        >
          <FileText className="w-5 h-5" />
          <span>{language === 'en' ? 'Read Full Manifesto' : 'Читать полный манифест'}</span>
          <ExternalLink className="w-4 h-4" />
        </a>
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
