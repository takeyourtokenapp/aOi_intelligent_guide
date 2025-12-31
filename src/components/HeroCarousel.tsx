import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Sparkles, FileText, Network, ArrowRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface Slide {
  id: number;
  type: 'welcome' | 'research' | 'ecosystem';
  titleEn?: string;
  titleRu?: string;
  descEn?: string;
  descRu?: string;
}

interface HeroCarouselProps {
  onAoiClick?: () => void;
  onNavigate?: (page: 'home' | 'foundation' | 'academy', tab?: 'about' | 'research' | 'manifesto' | 'updates') => void;
}

const slides: Slide[] = [
  {
    id: 1,
    type: 'welcome'
  },
  {
    id: 2,
    type: 'research',
    titleEn: "Integration of AI, Quantum Computing & Blockchain/Web3 for Pediatric CNS Tumor Research",
    titleRu: "Интеграция ИИ, квантовых вычислений и Blockchain/Web3 для исследований опухолей ЦНС у детей",
    descEn: "A comprehensive research paper exploring how artificial intelligence, quantum computing, and blockchain technologies can revolutionize pediatric brain tumor research. This position paper presents an integrated scientific infrastructure model and extends an invitation to the International Quantum Computing Center (I-QCC) to lead this paradigm shift.",
    descRu: "Комплексная исследовательская работа, изучающая, как искусственный интеллект, квантовые вычисления и блокчейн-технологии могут революционизировать исследования опухолей мозга у детей. Этот позиционный документ представляет интегрированную модель научной инфраструктуры и приглашает Международный центр квантовых вычислений (I-QCC) возглавить эту смену парадигмы."
  },
  {
    id: 3,
    type: 'ecosystem',
    titleEn: "TakeYourToken Ecosystem",
    titleRu: "Экосистема TakeYourToken",
    descEn: "Foundation provides knowledge and research. Academy teaches Web3 tools. aOi guides you through complex systems: blockchain, quantum computing, and neuro-oncology.",
    descRu: "Foundation предоставляет знания и исследования. Academy обучает Web3-инструментам. aOi ведёт вас через сложные системы: блокчейн, квантовые вычисления и нейроонкологию."
  }
];

export function HeroCarousel({ onAoiClick, onNavigate }: HeroCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const { language } = useLanguage();

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const slide = slides[currentSlide];

  const renderWelcomeSlide = () => (
    <div className="relative h-full bg-gradient-to-br from-[#1B2838] via-[#2a3f54] to-[#1B2838] rounded-3xl p-6 md:p-10 lg:p-12 flex items-center justify-center border-2 border-[#9B8FD9]/30">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center max-w-6xl w-full">
        <div className="relative flex items-center justify-center order-2 md:order-1">
          <img
            src="/aoi/image.png"
            alt="aOi AI Guide"
            className="w-full max-w-[280px] md:max-w-sm mx-auto drop-shadow-2xl object-contain"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/aoi/beginner-neutral.png';
            }}
          />
          <div className="absolute top-4 right-4 w-3 h-3 md:w-4 md:h-4 bg-green-400 rounded-full animate-pulse"></div>
        </div>

        <div className="text-white order-1 md:order-2">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6">
            {language === 'en' ? 'Hello, I am' : 'Привет, я'}
            <br />
            <span className="text-[#9B8FD9]">aOi (葵)</span>
          </h1>

          <div className="bg-[#2a3f54] rounded-2xl p-4 md:p-6 mb-4 md:mb-6 border border-[#9B8FD9]/20">
            <p className="text-gray-300 mb-2 text-sm md:text-base">
              {language === 'en' ? 'My name means 葵 — like the mallow flower' : 'Моё имя означает 葵 — как цветок мальвы'}
            </p>
            <div className="flex gap-4 md:gap-6 text-xs md:text-sm">
              <span>🌱 {language === 'en' ? 'Growth' : 'Рост'}</span>
              <span>🧠 {language === 'en' ? 'Wisdom' : 'Мудрость'}</span>
              <span>🧬 {language === 'en' ? 'Intelligence' : 'Интеллект'}</span>
            </div>
          </div>

          <p className="text-gray-200 leading-relaxed mb-3 md:mb-4 text-sm md:text-base">
            {language === 'en'
              ? 'I am the Core AI Orchestrator of TYT ecosystem — routing between Foundation (research & knowledge) and Academy (Web3 tools & infrastructure). I guide you through complex systems: blockchain, quantum computing, and neuro-oncology.'
              : 'Я — основной ИИ-оркестратор экосистемы TYT — маршрутизирую между Foundation (исследования и знания) и Academy (Web3-инструменты и инфраструктура). Я веду вас через сложные системы: блокчейн, квантовые вычисления и нейроонкологию.'}
          </p>

          <p className="text-gray-300 text-xs md:text-sm mb-4 md:mb-6 italic">
            {language === 'en'
              ? "I adapt to 4 levels based on your age and experience. For minors, guardian consent is required. I am NOT a medical advisor — I am your academic system guide."
              : "Я адаптируюсь к 4 уровням в зависимости от вашего возраста и опыта. Для несовершеннолетних требуется согласие опекуна. Я НЕ медицинский консультант — я ваш академический системный гид."}
          </p>

          <p className="text-white text-base md:text-lg font-medium italic mb-6 md:mb-8 hidden md:block">
            {language === 'en'
              ? "You don't need to be a doctor or developer to understand. Let me explain how everything connects."
              : "Вам не нужно быть врачом или разработчиком, чтобы понять. Позвольте мне объяснить, как всё связано."}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
            <button
              onClick={onAoiClick}
              className="px-5 md:px-6 py-2.5 md:py-3 bg-[#9B8FD9] hover:bg-[#8B7AC7] rounded-xl font-bold transition-colors flex items-center justify-center gap-2 text-sm md:text-base"
            >
              {language === 'en' ? 'Talk with aOi' : 'Поговорить с aOi'}
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate?.('foundation')}
              className="px-5 md:px-6 py-2.5 md:py-3 border-2 border-[#9B8FD9] hover:bg-[#9B8FD9]/10 rounded-xl font-bold transition-colors text-sm md:text-base"
            >
              {language === 'en' ? 'Learn About the Foundation' : 'Узнать о Фонде'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderResearchSlide = () => (
    <div className="relative h-full bg-gradient-to-br from-[#2a3f54] via-[#1B2838] to-[#2a3f54] rounded-3xl p-6 md:p-8 lg:p-10 border-2 border-[#9B8FD9]/40 flex items-center">
      <div className="w-full">
        <div className="flex items-center gap-3 mb-4 md:mb-6">
          <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-[#9B8FD9]" />
          <span className="text-[#9B8FD9] font-bold uppercase tracking-wider text-xs md:text-sm">
            {language === 'en' ? 'NEW RESEARCH PAPER' : 'НОВАЯ ИССЛЕДОВАТЕЛЬСКАЯ РАБОТА'}
          </span>
        </div>

        <div className="grid md:grid-cols-[auto_1fr] gap-6 md:gap-8 items-start">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-[#9B8FD9] rounded-2xl flex items-center justify-center flex-shrink-0 mx-auto md:mx-0">
            <FileText className="w-8 h-8 md:w-10 md:h-10 text-white" strokeWidth={2} />
          </div>

          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 md:mb-4 leading-tight">
              {language === 'en' ? slide.titleEn : slide.titleRu}
            </h2>

            <p className="text-[#9B8FD9] font-medium mb-3 md:mb-4 text-sm md:text-base">
              {language === 'en' ? 'An Open Appeal to I-QCC' : 'Открытое обращение к I-QCC'}
            </p>

            <p className="text-gray-300 leading-relaxed mb-4 md:mb-6 text-sm md:text-base">
              {language === 'en' ? slide.descEn : slide.descRu}
            </p>

            <div className="flex flex-wrap gap-2 mb-4 md:mb-6">
              <span className="px-2.5 md:px-3 py-1 bg-[#9B8FD9]/20 text-[#9B8FD9] rounded-lg text-xs md:text-sm border border-[#9B8FD9]/30">AI</span>
              <span className="px-2.5 md:px-3 py-1 bg-[#7BA7BC]/20 text-[#7BA7BC] rounded-lg text-xs md:text-sm border border-[#7BA7BC]/30">Quantum Computing</span>
              <span className="px-2.5 md:px-3 py-1 bg-[#8FA68E]/20 text-[#8FA68E] rounded-lg text-xs md:text-sm border border-[#8FA68E]/30">Blockchain</span>
              <span className="px-2.5 md:px-3 py-1 bg-[#E8B4B8]/20 text-[#E8B4B8] rounded-lg text-xs md:text-sm border border-[#E8B4B8]/30">DeSci</span>
              <span className="px-2.5 md:px-3 py-1 bg-[#D97B8F]/20 text-[#D97B8F] rounded-lg text-xs md:text-sm border border-[#D97B8F]/30">Pediatric Oncology</span>
              <span className="px-2.5 md:px-3 py-1 bg-[#9B8FD9]/20 text-[#9B8FD9] rounded-lg text-xs md:text-sm border border-[#9B8FD9]/30">I-QCC</span>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-[#9B8FD9] rounded-full flex items-center justify-center text-white font-bold text-sm md:text-base">
                  葵
                </div>
                <div>
                  <p className="text-white font-bold text-xs md:text-sm">aOi - AI Curator</p>
                  <p className="text-gray-400 text-xs">TYT Foundation Research</p>
                </div>
              </div>

              <button
                onClick={() => onNavigate?.('foundation', 'manifesto')}
                className="sm:ml-auto px-5 md:px-6 py-2 bg-[#9B8FD9] hover:bg-[#8B7AC7] text-white rounded-xl font-bold transition-colors flex items-center gap-2 text-sm md:text-base"
              >
                {language === 'en' ? 'Read Full Paper' : 'Читать полностью'}
                <ArrowRight className="w-3 h-3 md:w-4 md:h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderEcosystemSlide = () => (
    <div className="relative h-full bg-gradient-to-br from-[#1B2838] via-[#2a3f54] to-[#1B2838] rounded-3xl p-6 md:p-8 lg:p-10 border-2 border-[#7BA7BC]/30 flex items-center">
      <div className="w-full">
        <div className="text-center mb-6 md:mb-8">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3 md:mb-4">
            {language === 'en' ? slide.titleEn : slide.titleRu}
          </h2>
          <p className="text-gray-300 text-sm md:text-base lg:text-lg max-w-3xl mx-auto">
            {language === 'en' ? slide.descEn : slide.descRu}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          <div className="bg-[#2a3f54] border-2 border-[#D97B8F]/30 rounded-2xl p-4 md:p-6 hover:border-[#D97B8F]/60 transition-all">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-[#D97B8F]/20 rounded-2xl flex items-center justify-center mb-3 md:mb-4 mx-auto">
              <FileText className="w-6 h-6 md:w-8 md:h-8 text-[#E8B4B8]" />
            </div>
            <h3 className="text-[#E8B4B8] font-bold text-lg md:text-xl mb-2 md:mb-3 text-center">
              {language === 'en' ? 'Foundation' : 'Фонд'}
            </h3>
            <p className="text-gray-300 text-xs md:text-sm text-center leading-relaxed">
              {language === 'en'
                ? 'Knowledge, research papers, pediatric CNS tumor studies, transparency reports'
                : 'Знания, исследовательские работы, исследования опухолей ЦНС, отчёты о прозрачности'}
            </p>
          </div>

          <div className="bg-[#2a3f54] border-2 border-[#7BA7BC]/30 rounded-2xl p-4 md:p-6 hover:border-[#7BA7BC]/60 transition-all">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-[#7BA7BC]/20 rounded-2xl flex items-center justify-center mb-3 md:mb-4 mx-auto">
              <Network className="w-6 h-6 md:w-8 md:h-8 text-[#7BA7BC]" />
            </div>
            <h3 className="text-[#7BA7BC] font-bold text-lg md:text-xl mb-2 md:mb-3 text-center">
              {language === 'en' ? 'Academy' : 'Академия'}
            </h3>
            <p className="text-gray-300 text-xs md:text-sm text-center leading-relaxed">
              {language === 'en'
                ? 'Web3 education, blockchain tools, smart contracts, transparent funding infrastructure'
                : 'Web3-обучение, блокчейн-инструменты, смарт-контракты, прозрачная инфраструктура финансирования'}
            </p>
          </div>

          <div className="bg-[#2a3f54] border-2 border-[#9B8FD9]/30 rounded-2xl p-4 md:p-6 hover:border-[#9B8FD9]/60 transition-all sm:col-span-2 md:col-span-1">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-[#9B8FD9]/20 rounded-2xl flex items-center justify-center mb-3 md:mb-4 mx-auto text-2xl md:text-4xl">
              葵
            </div>
            <h3 className="text-[#9B8FD9] font-bold text-lg md:text-xl mb-2 md:mb-3 text-center">
              {language === 'en' ? 'aOi Guide' : 'Гид aOi'}
            </h3>
            <p className="text-gray-300 text-xs md:text-sm text-center leading-relaxed">
              {language === 'en'
                ? 'AI orchestrator connecting knowledge with tools, explaining complex systems simply'
                : 'ИИ-оркестратор, соединяющий знания с инструментами, объясняющий сложные системы просто'}
            </p>
          </div>
        </div>

        <div className="mt-6 md:mt-8 text-center">
          <p className="text-white text-base md:text-lg font-medium italic">
            {language === 'en'
              ? 'Web3 becomes a mechanism for funding medical research'
              : 'Web3 становится механизмом финансирования медицинских исследований'}
          </p>
        </div>
      </div>
    </div>
  );

  const renderSlide = () => {
    switch (slide.type) {
      case 'welcome':
        return renderWelcomeSlide();
      case 'research':
        return renderResearchSlide();
      case 'ecosystem':
        return renderEcosystemSlide();
      default:
        return null;
    }
  };

  return (
    <div className="relative mb-16 overflow-hidden">
      <div className="relative h-[500px] md:h-[550px] lg:h-[600px] transition-all duration-700">
        {renderSlide()}

        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 dark:bg-gray-800/90 backdrop-blur-sm border-2 border-white/20 dark:border-gray-600 flex items-center justify-center hover:scale-110 hover:bg-white/20 transition-all shadow-lg z-10"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 dark:bg-gray-800/90 backdrop-blur-sm border-2 border-white/20 dark:border-gray-600 flex items-center justify-center hover:scale-110 hover:bg-white/20 transition-all shadow-lg z-10"
          aria-label="Next slide"
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </button>
      </div>

      <div className="flex items-center justify-center gap-4 mt-6">
        <div className="flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? 'w-8 bg-[#9B8FD9]'
                  : 'w-2 bg-gray-400 dark:bg-gray-600 hover:bg-[#9B8FD9]/60'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        <button
          onClick={() => setIsAutoPlaying(!isAutoPlaying)}
          className="text-sm text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          {isAutoPlaying
            ? (language === 'en' ? '⏸' : '⏸')
            : (language === 'en' ? '▶' : '▶')}
        </button>
      </div>
    </div>
  );
}
