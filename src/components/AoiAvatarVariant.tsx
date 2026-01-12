import { useState, useCallback } from 'react';
import { Sparkles } from 'lucide-react';
import {
  type AoiVariant,
  type AoiSize,
  AOI_VARIANTS,
  AOI_SIZE_CLASSES,
  AOI_GRADIENT_COLORS,
} from '../config/aoiVariants';

interface AoiAvatarVariantProps {
  variant?: AoiVariant;
  size?: AoiSize;
  animated?: boolean;
  className?: string;
  showStatusIndicator?: boolean;
  onClick?: () => void;
}

export function AoiAvatarVariant({
  variant = 'portrait',
  size = 'md',
  animated = false,
  className = '',
  showStatusIndicator = true,
  onClick,
}: AoiAvatarVariantProps) {
  const [imageError, setImageError] = useState(false);
  const [useFallback, setUseFallback] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const config = AOI_VARIANTS[variant];
  const sizeConfig = AOI_SIZE_CLASSES[size];

  const handleImageError = useCallback(() => {
    if (!useFallback) {
      setUseFallback(true);
    } else {
      setImageError(true);
    }
  }, [useFallback]);

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
  }, []);

  const imageSrc = useFallback ? config.fallbackPath : config.path;

  const animationClasses = animated
    ? 'hover:scale-105 hover:ring-[#9B8FD9]/50 transition-all duration-300 cursor-pointer'
    : '';

  const floatAnimation = animated ? 'animate-float' : '';

  return (
    <div
      className={`relative inline-block ${floatAnimation} ${className}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick() : undefined}
    >
      <div
        className={`
          ${sizeConfig.container}
          rounded-full
          bg-gradient-to-br ${AOI_GRADIENT_COLORS.accent}
          flex items-center justify-center
          shadow-lg shadow-[#9B8FD9]/20
          overflow-hidden
          ${sizeConfig.ring} ring-white/30
          ${animationClasses}
        `}
      >
        {!imageError && (
          <img
            src={imageSrc}
            alt={config.alt}
            loading="lazy"
            className={`
              w-full h-full object-cover
              transition-opacity duration-300
              ${imageLoaded ? 'opacity-100' : 'opacity-0'}
            `}
            style={{
              objectPosition: config.objectPosition,
              transform: `scale(${config.scale})`,
            }}
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        )}

        {(!imageLoaded || imageError) && (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#9b87f5] to-[#00F0FF]">
            <span className="text-white font-bold drop-shadow-lg" style={{
              fontSize: size === 'sm' ? '1rem' : size === 'md' ? '1.5rem' : size === 'lg' ? '2rem' : '3rem'
            }}>
              葵
            </span>
          </div>
        )}

        {animated && (
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-full" />
        )}
      </div>

      {showStatusIndicator && (
        <div className="absolute -bottom-0.5 -right-0.5 flex items-center justify-center">
          <div className="w-3 h-3 bg-[#00FF00] border-2 border-white dark:border-[#0A1122] rounded-full animate-pulse" />
        </div>
      )}
    </div>
  );
}

interface AoiAvatarHeroProps {
  animated?: boolean;
  className?: string;
  onClick?: () => void;
}

export function AoiAvatarHero({ animated = true, className = '', onClick }: AoiAvatarHeroProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div
      className={`relative ${animated ? 'animate-float cursor-pointer' : ''} ${className}`}
      onClick={onClick}
    >
      <div className="relative w-40 h-40 md:w-56 md:h-56 lg:w-64 lg:h-64">
        <div className="absolute inset-0 bg-gradient-to-br from-[#9B8FD9]/30 via-[#7BA7BC]/20 to-transparent rounded-full blur-2xl" />

        <div className="relative w-full h-full rounded-full overflow-hidden ring-4 ring-[#9B8FD9]/30 shadow-2xl shadow-[#9B8FD9]/20">
          {!imageError ? (
            <img
              src="/assets/aoi/portrait-close.png"
              alt="aOi - Your AI Guide"
              loading="eager"
              className={`w-full h-full object-cover transition-opacity duration-500 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
            />
          ) : null}

          {(!imageLoaded || imageError) && (
            <div className="absolute inset-0 bg-gradient-to-br from-[#9B8FD9] via-[#7BA7BC] to-[#8FA68E] flex items-center justify-center">
              <div className="text-center">
                <span className="text-white font-bold text-6xl md:text-7xl drop-shadow-lg">葵</span>
                <div className="mt-2">
                  <Sparkles className="w-6 h-6 text-white/80 mx-auto" />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#00FF00] border-3 border-white dark:border-[#0A1122] rounded-full animate-pulse shadow-lg shadow-[#00FF00]/50" />
      </div>
    </div>
  );
}

interface AoiChatAvatarProps {
  size?: 'sm' | 'md';
  showSparkle?: boolean;
  className?: string;
}

export function AoiChatAvatar({ size = 'sm', showSparkle = true, className = '' }: AoiChatAvatarProps) {
  const [imageError, setImageError] = useState(false);

  const sizeClass = size === 'sm' ? 'w-8 h-8' : 'w-12 h-12';
  const textSize = size === 'sm' ? 'text-xs' : 'text-base';

  return (
    <div className={`relative flex-shrink-0 ${className}`}>
      <div className={`${sizeClass} rounded-full bg-gradient-to-br from-[#9b87f5] to-[#00F0FF] flex items-center justify-center overflow-hidden ring-2 ring-white/20`}>
        {!imageError ? (
          <img
            src="/assets/aoi/portrait-close.png"
            alt="aOi"
            loading="lazy"
            className="w-full h-full object-cover object-top scale-125"
            onError={() => setImageError(true)}
          />
        ) : null}

        {imageError && (
          <span className={`text-white font-bold ${textSize}`}>葵</span>
        )}
      </div>

      {showSparkle && (
        <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-[#00FF00] border-2 border-white dark:border-[#0A1122] rounded-full animate-pulse" />
      )}
    </div>
  );
}

interface AoiNavigationAvatarProps {
  onClick?: () => void;
  className?: string;
}

export function AoiNavigationAvatar({ onClick, className = '' }: AoiNavigationAvatarProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <button
      onClick={onClick}
      className={`group relative flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-br from-[#D2A44C]/10 to-[#00F0FF]/10 hover:from-[#D2A44C]/20 hover:to-[#00F0FF]/20 border border-[#D2A44C]/30 hover:border-[#D2A44C]/50 transition-all ${className}`}
      title="Ask aOi AI Guide"
    >
      <div className="relative">
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#9b87f5] to-[#00F0FF] flex items-center justify-center overflow-hidden ring-2 ring-[#D2A44C]/30 group-hover:ring-[#D2A44C]/50 transition-all">
          {!imageError ? (
            <img
              src="/assets/aoi/portrait-close.png"
              alt="aOi"
              loading="lazy"
              className="w-full h-full object-cover object-top scale-125 group-hover:scale-[1.3] transition-transform"
              onError={() => setImageError(true)}
            />
          ) : null}

          {imageError && (
            <span className="text-white font-bold text-xs">葵</span>
          )}
        </div>
        <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-[#00FF00] border-2 border-white dark:border-[#0A1122] rounded-full animate-pulse" />
      </div>
      <span className="text-sm font-bold text-gray-800 dark:text-white group-hover:text-[#D2A44C] transition-colors">aOi</span>
    </button>
  );
}

interface AoiCelebrationProps {
  title?: string;
  subtitle?: string;
  className?: string;
}

export function AoiCelebration({
  title = "Page Not Found",
  subtitle = "Let me help you find what you're looking for!",
  className = ''
}: AoiCelebrationProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div className={`flex flex-col items-center text-center ${className}`}>
      <div className="relative mb-8 animate-bounce-slow">
        <div className="absolute inset-0 bg-gradient-to-br from-[#9B8FD9]/40 to-[#00F0FF]/40 rounded-full blur-3xl scale-150" />

        <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden ring-4 ring-[#D2A44C]/40 shadow-2xl">
          {!imageError ? (
            <img
              src="/assets/aoi/celebration.jpg"
              alt="aOi"
              loading="lazy"
              className={`w-full h-full object-cover object-top transition-opacity duration-500 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
            />
          ) : null}

          {(!imageLoaded || imageError) && (
            <div className="absolute inset-0 bg-gradient-to-br from-[#9B8FD9] via-[#7BA7BC] to-[#8FA68E] flex items-center justify-center">
              <span className="text-white font-bold text-7xl drop-shadow-lg">葵</span>
            </div>
          )}
        </div>

        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
          {[0, 1, 2].map((i) => (
            <Sparkles
              key={i}
              className="w-5 h-5 text-[#D2A44C] animate-pulse"
              style={{ animationDelay: `${i * 200}ms` }}
            />
          ))}
        </div>
      </div>

      <h1 className="text-4xl md:text-5xl font-bold text-slate-800 dark:text-white mb-4">
        {title}
      </h1>
      <p className="text-lg text-slate-600 dark:text-gray-300 max-w-md">
        {subtitle}
      </p>
    </div>
  );
}
