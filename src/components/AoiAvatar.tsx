import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { getAoiAsset, getDefaultAoiAsset, AOI_CHARACTER } from '../config/aoiAssets';

interface AoiAvatarProps {
  level?: 'beginner' | 'explorer' | 'builder' | 'guardian';
  emotion?: 'neutral' | 'happy' | 'thinking' | 'concerned' | 'excited';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showName?: boolean;
  showKanji?: boolean;
  className?: string;
}

export function AoiAvatar({
  level = 'explorer',
  emotion = 'neutral',
  size = 'md',
  showName = false,
  showKanji = true,
  className = '',
}: AoiAvatarProps) {
  const asset = getAoiAsset(level, emotion) || getDefaultAoiAsset();
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
    xl: 'w-32 h-32',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-4xl',
    xl: 'text-5xl',
  };

  const levelColors = {
    beginner: 'from-[#9b87f5] via-[#e0b4ff] to-[#c4b5fd]',
    explorer: 'from-[#00F0FF] via-[#7dd3fc] to-[#38bdf8]',
    builder: 'from-[#D2A44C] via-[#fbbf24] to-[#f59e0b]',
    guardian: 'from-[#FF00FF] via-[#e879f9] to-[#d946ef]',
  };

  const gradientColor = levelColors[level];

  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      <div className="relative">
        <div
          className={`${sizeClasses[size]} rounded-full bg-gradient-to-br ${gradientColor} flex items-center justify-center shadow-lg overflow-hidden ring-2 ring-white/20`}
        >
          <img
            src={asset.path}
            alt={asset.description}
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              imageLoaded && !imageError ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
          />

          {(!imageLoaded || imageError) && (
            <div className="absolute inset-0 flex items-center justify-center">
              {showKanji ? (
                <span className={`text-white font-bold ${textSizes[size]} drop-shadow-lg`}>
                  {AOI_CHARACTER.kanji}
                </span>
              ) : (
                <Sparkles className="w-1/2 h-1/2 text-white drop-shadow-lg" />
              )}
            </div>
          )}
        </div>

        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#00FF00] border-2 border-white dark:border-[#0A1122] rounded-full animate-pulse-soft" />

        <div
          className="absolute inset-0 rounded-full bg-gradient-to-br from-white/10 to-transparent opacity-0 hover:opacity-100 transition-opacity cursor-help"
          title={asset.description}
        />
      </div>

      {showName && (
        <div className="text-center">
          <p className="text-slate-800 dark:text-white font-bold text-sm">
            {AOI_CHARACTER.name} <span className="text-[#9b87f5]">{AOI_CHARACTER.kanji}</span>
          </p>
          <p className="text-xs text-slate-600 dark:text-gray-400">{AOI_CHARACTER.role}</p>
        </div>
      )}
    </div>
  );
}

export function AoiLevelBadge({ level }: { level: 'beginner' | 'explorer' | 'builder' | 'guardian' }) {
  const badges = {
    beginner: { label: 'Beginner', color: '#9b87f5', emoji: '🌱' },
    explorer: { label: 'Explorer', color: '#00F0FF', emoji: '🔍' },
    builder: { label: 'Builder', color: '#D2A44C', emoji: '🔨' },
    guardian: { label: 'Guardian', color: '#FF00FF', emoji: '🛡️' },
  };

  const badge = badges[level];

  return (
    <div
      className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium"
      style={{
        background: `${badge.color}20`,
        border: `1px solid ${badge.color}40`,
        color: badge.color,
      }}
    >
      <span>{badge.emoji}</span>
      <span>{badge.label}</span>
    </div>
  );
}

export function AoiConnectionStatus({ isOnline }: { isOnline: boolean }) {
  return (
    <div className="flex items-center gap-2 text-xs">
      <div
        className={`w-2 h-2 rounded-full ${isOnline ? 'bg-[#00FF00] animate-pulse' : 'bg-[#FF6600]'}`}
      />
      <span className="text-gray-400">
        {isOnline ? 'Connected to Foundation' : 'Basic Mode'}
      </span>
    </div>
  );
}
