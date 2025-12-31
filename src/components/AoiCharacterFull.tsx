import { AOI_CHARACTER } from '../config/aoiAssets';

interface AoiCharacterFullProps {
  className?: string;
  showGlow?: boolean;
}

export function AoiCharacterFull({ className = '', showGlow = true }: AoiCharacterFullProps) {
  return (
    <div className={`relative ${className}`}>
      {showGlow && (
        <>
          <div className="absolute inset-0 bg-gradient-to-br from-[#9b87f5]/30 via-[#00F0FF]/20 to-[#D2A44C]/30 blur-3xl animate-pulse-soft" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(155,135,245,0.2),transparent_70%)] animate-breathe" />
        </>
      )}

      <div className="relative z-10">
        <img
          src="/aoi/guardian-neutral.png"
          alt={`${AOI_CHARACTER.name} - Full Character`}
          className="w-full h-auto object-contain drop-shadow-2xl"
        />
      </div>
    </div>
  );
}

export function AoiCharacterHero({ className = '' }: { className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-br from-[#9b87f5]/20 via-transparent to-[#00F0FF]/20 blur-2xl" />

      <div className="relative">
        <img
          src="/aoi/explorer-thinking.png"
          alt={`${AOI_CHARACTER.name} - Welcome`}
          className="w-full h-auto object-contain drop-shadow-xl animate-float"
        />

        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-24 h-24 bg-[#00F0FF]/20 rounded-full blur-xl animate-pulse-soft" />
      </div>
    </div>
  );
}
