import { useState } from 'react';
import { AOI_CHARACTER } from '../config/aoiAssets';

interface AoiCharacterFullProps {
  className?: string;
  showGlow?: boolean;
  size?: 'md' | 'lg' | 'xl';
}

export function AoiCharacterFull({
  className = '',
  showGlow = true,
  size = 'lg'
}: AoiCharacterFullProps) {
  const [imageLoaded, setImageLoaded] = useState(false);

  const sizeClasses = {
    md: 'w-48 max-w-[12rem]',
    lg: 'w-64 max-w-[16rem]',
    xl: 'w-96 max-w-[24rem]'
  };

  return (
    <div className={`relative ${sizeClasses[size]} mx-auto ${className}`}>
      {showGlow && imageLoaded && (
        <>
          <div className="absolute inset-0 bg-gradient-to-br from-[#9b87f5]/20 via-[#00F0FF]/15 to-[#D2A44C]/20 blur-3xl animate-pulse-soft -z-10" />
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-32 h-32 bg-[#9b87f5]/30 rounded-full blur-2xl animate-breathe -z-10" />
        </>
      )}

      <div className="relative z-10">
        <img
          src="/aoi/guardian-neutral.png"
          alt={`${AOI_CHARACTER.name} - Full Character`}
          className={`w-full h-auto object-contain drop-shadow-2xl transition-opacity duration-500 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setImageLoaded(true)}
        />
      </div>
    </div>
  );
}

export function AoiCharacterHero({
  className = '',
  size = 'md'
}: {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}) {
  const [imageLoaded, setImageLoaded] = useState(false);

  const sizeClasses = {
    sm: 'w-32 max-w-[8rem]',
    md: 'w-44 max-w-[11rem]',
    lg: 'w-56 max-w-[14rem]'
  };

  return (
    <div className={`relative ${sizeClasses[size]} mx-auto ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-br from-[#9b87f5]/15 via-transparent to-[#00F0FF]/15 blur-2xl -z-10" />

      <div className="relative">
        <img
          src="/aoi/explorer-thinking.png"
          alt={`${AOI_CHARACTER.name} - Welcome`}
          className={`w-full h-auto object-contain drop-shadow-xl animate-float transition-opacity duration-500 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setImageLoaded(true)}
        />

        {imageLoaded && (
          <>
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-20 h-20 bg-[#00F0FF]/20 rounded-full blur-xl animate-pulse-soft -z-10" />
            <div className="absolute -top-1 -right-1 z-20">
              <div className="relative">
                <div className="w-3 h-3 bg-[#00FF00] rounded-full animate-pulse" />
                <div className="absolute inset-0 w-3 h-3 bg-[#00FF00] rounded-full animate-ping opacity-75" />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
