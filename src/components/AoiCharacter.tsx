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
    hero: '/assets/aoi/hero-welcome.png',
    avatar: '/assets/aoi/portrait-close.png',
    full: '/assets/aoi/standing-neutral.png'
  };

  const fallbackPaths = {
    hero: '/aoi/img_5162.png',
    avatar: '/aoi/img_5166.png',
    full: '/aoi/files_8303297-1767179378107-image.png'
  };

  const sizeClasses = {
    sm: 'w-20 h-auto max-h-96',
    md: 'w-36 h-auto max-h-[32rem]',
    lg: 'w-52 h-auto max-h-[40rem]',
    xl: 'w-72 h-auto max-h-[48rem]'
  };

  const containerSizeClasses = {
    sm: 'max-w-[80px]',
    md: 'max-w-[144px]',
    lg: 'max-w-[208px]',
    xl: 'max-w-[288px]'
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
          <div className="absolute inset-0 bg-gradient-to-br from-[#9B8FD9]/20 to-[#7BA7BC]/20 blur-3xl animate-pulse" />
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
