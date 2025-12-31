import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Sparkles, Heart, Brain, Shield } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface Slide {
  id: number;
  titleEn: string;
  titleRu: string;
  descEn: string;
  descRu: string;
  image: string;
  icon: React.ReactNode;
  gradient: string;
  borderColor: string;
}

const slides: Slide[] = [
  {
    id: 1,
    titleEn: "Meet aOi - Your AI Guide",
    titleRu: "Знакомьтесь с aOi - Ваш AI-наставник",
    descEn: "aOi (葵) connects Web3 technology with medical research. She grows with you from beginner to guardian.",
    descRu: "aOi (葵) связывает Web3-технологии с медицинскими исследованиями. Она растёт вместе с вами от новичка до хранителя.",
    image: "/aoi/beginner-neutral.png",
    icon: <Sparkles className="w-6 h-6" />,
    gradient: "from-[#9B8FD9]/20 to-[#7BA7BC]/20",
    borderColor: "border-[#9B8FD9]/40"
  },
  {
    id: 2,
    titleEn: "Learn Web3 & Blockchain",
    titleRu: "Изучите Web3 и Блокчейн",
    descEn: "Digital-Interactive-Technology Blockchain Crypto Academy teaches you the tools that power transparent science.",
    descRu: "Академия обучает инструментам, которые обеспечивают прозрачную науку.",
    image: "/aoi/explorer-thinking.png",
    icon: <Brain className="w-6 h-6" />,
    gradient: "from-[#7BA7BC]/20 to-[#8FA68E]/20",
    borderColor: "border-[#7BA7BC]/40"
  },
  {
    id: 3,
    titleEn: "Support Children's Brain Cancer Research",
    titleRu: "Поддержите исследования опухолей мозга у детей",
    descEn: "Every transaction helps fund research for pediatric CNS tumors. Web3 becomes a mechanism for saving lives.",
    descRu: "Каждая транзакция помогает финансировать исследования опухолей ЦНС у детей. Web3 становится механизмом спасения жизней.",
    image: "/aoi/builder-excited.png",
    icon: <Heart className="w-6 h-6" />,
    gradient: "from-[#E8B4B8]/20 to-[#9B8FD9]/20",
    borderColor: "border-[#E8B4B8]/40"
  },
  {
    id: 4,
    titleEn: "Become a Guardian",
    titleRu: "Станьте хранителем",
    descEn: "Progress through levels, earn certificates, and join a global ecosystem where technology serves humanity.",
    descRu: "Проходите уровни, получайте сертификаты и присоединяйтесь к глобальной экосистеме, где технология служит человечеству.",
    image: "/aoi/guardian-neutral.png",
    icon: <Shield className="w-6 h-6" />,
    gradient: "from-[#8FA68E]/20 to-[#D2A44C]/20",
    borderColor: "border-[#8FA68E]/40"
  }
];

export function HeroCarousel() {
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

  return (
    <div className="relative mb-16 overflow-hidden">
      <div className="relative rounded-3xl border-2 shadow-2xl dark:shadow-none overflow-hidden"
           style={{
             background: `linear-gradient(to br, ${slide.gradient})`,
             borderColor: `var(--tw-${slide.borderColor})`
           }}>
        <div className={`bg-gradient-to-br ${slide.gradient} backdrop-blur-sm border-2 ${slide.borderColor} rounded-3xl transition-all duration-700`}>
          <div className="grid md:grid-cols-2 gap-8 p-10 items-center">
            <div className="order-2 md:order-1">
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${slide.gradient} border-2 ${slide.borderColor} flex items-center justify-center`}>
                  {slide.icon}
                </div>
                <span className="text-sm font-bold text-slate-700 dark:text-gray-300">
                  {currentSlide + 1} / {slides.length}
                </span>
              </div>

              <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4 leading-tight">
                {language === 'en' ? slide.titleEn : slide.titleRu}
              </h2>

              <p className="text-lg text-slate-800 dark:text-gray-100 leading-relaxed font-bold mb-6">
                {language === 'en' ? slide.descEn : slide.descRu}
              </p>

              <div className="flex gap-2">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      index === currentSlide
                        ? 'w-8 bg-slate-900 dark:bg-white'
                        : 'w-2 bg-slate-400 dark:bg-gray-600 hover:bg-slate-600 dark:hover:bg-gray-400'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>

            <div className="order-1 md:order-2 relative">
              <div className="relative w-64 h-64 mx-auto">
                <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent dark:from-white/10 dark:to-transparent rounded-full blur-2xl animate-pulse-soft"></div>

                <img
                  key={slide.id}
                  src={slide.image}
                  alt={language === 'en' ? slide.titleEn : slide.titleRu}
                  className="relative z-10 w-full h-full object-contain drop-shadow-2xl animate-float transition-opacity duration-700"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent) {
                      const fallback = document.createElement('div');
                      fallback.className = 'w-full h-full flex items-center justify-center text-6xl text-slate-700 dark:text-white';
                      fallback.textContent = '葵';
                      parent.appendChild(fallback);
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-2 border-slate-300 dark:border-gray-600 flex items-center justify-center hover:scale-110 transition-all shadow-lg"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-6 h-6 text-slate-900 dark:text-white" />
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-2 border-slate-300 dark:border-gray-600 flex items-center justify-center hover:scale-110 transition-all shadow-lg"
          aria-label="Next slide"
        >
          <ChevronRight className="w-6 h-6 text-slate-900 dark:text-white" />
        </button>
      </div>

      <div className="text-center mt-4">
        <button
          onClick={() => setIsAutoPlaying(!isAutoPlaying)}
          className="text-sm text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          {isAutoPlaying
            ? (language === 'en' ? '⏸ Pause' : '⏸ Пауза')
            : (language === 'en' ? '▶ Play' : '▶ Воспроизвести')}
        </button>
      </div>
    </div>
  );
}
