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

  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      <div className="relative">
        <div
          className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-[#9b87f5] via-[#00F0FF] to-[#D2A44C] flex items-center justify-center shadow-lg overflow-hidden`}
        >
          {showKanji ? (
            <span className={`text-white font-bold ${textSizes[size]}`}>
              {AOI_CHARACTER.kanji}
            </span>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#9b87f5]/20 to-[#00F0FF]/20 flex items-center justify-center">
              <Sparkles className="w-1/2 h-1/2 text-white" />
            </div>
          )}
        </div>

        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#00FF00] border-2 border-[#0A1122] rounded-full" />

        <div
          className="absolute inset-0 rounded-full bg-gradient-to-br from-white/10 to-transparent opacity-0 hover:opacity-100 transition-opacity"
          title={asset.description}
        />
      </div>

      {showName && (
        <div className="text-center">
          <p className="text-white font-bold text-sm">
            {AOI_CHARACTER.name} <span className="text-[#9b87f5]">{AOI_CHARACTER.kanji}</span>
          </p>
          <p className="text-xs text-gray-400">{AOI_CHARACTER.role}</p>
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
