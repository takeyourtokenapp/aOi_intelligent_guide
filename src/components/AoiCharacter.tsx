import { useState } from 'react';

interface AoiCharacterProps {
  variant?: 'hero' | 'avatar' | 'full';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showLabel?: boolean;
  animate?: boolean;
  onClick?: () => void;
}

export function AoiCharacter({
  variant = 'hero',
  size = 'md',
  className = '',
  showLabel = false,
  animate = true,
  onClick
}: AoiCharacterProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const imagePaths = {
    hero: '/aoi/explorer-thinking.png',
    avatar: '/aoi/beginner-neutral.png',
    full: '/aoi/guardian-neutral.png'
  };

  const fallbackPaths = {
    hero: '/aoi/aoi-hero.png.svg',
    avatar: '/aoi/aoi-avatar.png.svg',
    full: '/aoi/aoi-full.png.svg'
  };

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-32 h-32',
    lg: 'w-48 h-48',
    xl: 'w-64 h-64'
  };

  const containerSizeClasses = {
    sm: 'max-w-[80px]',
    md: 'max-w-[150px]',
    lg: 'max-w-[220px]',
    xl: 'max-w-[300px]'
  };

  return (
    <div
      className={`relative ${containerSizeClasses[size]} ${className}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <div className={`relative ${animate ? 'transition-transform hover:scale-105' : ''}`}>
        {animate && (
          <div className="absolute inset-0 bg-gradient-to-br from-[#9B8FD9]/20 to-[#7BA7BC]/20 rounded-full blur-2xl animate-pulse" />
        )}

        <img
          src={imageError ? fallbackPaths[variant] : imagePaths[variant]}
          alt="aOi - AI Guide and Mentor"
          className={`relative z-10 ${sizeClasses[size]} object-contain drop-shadow-2xl transition-opacity duration-300 ${
            imageLoaded || imageError ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setImageLoaded(true)}
          onError={() => {
            if (!imageError) {
              setImageError(true);
              setImageLoaded(true);
            }
          }}
        />

        {animate && (
          <div className="absolute -top-2 -right-2 z-20">
            <div className="relative">
              <div className="w-4 h-4 bg-[#00FF00] rounded-full animate-pulse" />
              <div className="absolute inset-0 w-4 h-4 bg-[#00FF00] rounded-full animate-ping opacity-75" />
            </div>
          </div>
        )}
      </div>

      {showLabel && (
        <div className="mt-4 text-center">
          <p className="text-lg font-bold bg-gradient-to-r from-[#9B8FD9] to-[#7BA7BC] bg-clip-text text-transparent">
            aOi (葵)
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            AI Guide & Mentor
          </p>
        </div>
      )}
    </div>
  );
}
