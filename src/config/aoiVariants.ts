export type AoiVariant = 'hero' | 'pointing' | 'presenting' | 'portrait' | 'celebration';
export type AoiSize = 'sm' | 'md' | 'lg' | 'xl';

export interface AoiVariantConfig {
  variant: AoiVariant;
  path: string;
  fallbackPath: string;
  alt: string;
  objectPosition: string;
  scale: string;
}

export const AOI_VARIANTS: Record<AoiVariant, AoiVariantConfig> = {
  hero: {
    variant: 'hero',
    path: '/assets/aoi/hero-welcome.svg',
    fallbackPath: '/aoi/aoi-hero.png',
    alt: 'aOi - Your AI Guide',
    objectPosition: 'center',
    scale: '1',
  },
  pointing: {
    variant: 'pointing',
    path: '/assets/aoi/pointing-right.svg',
    fallbackPath: '/aoi/explorer-thinking.png',
    alt: 'aOi pointing to information',
    objectPosition: 'center',
    scale: '1',
  },
  presenting: {
    variant: 'presenting',
    path: '/assets/aoi/presenting-open.svg',
    fallbackPath: '/aoi/builder-excited.png',
    alt: 'aOi presenting content',
    objectPosition: 'center',
    scale: '1',
  },
  portrait: {
    variant: 'portrait',
    path: '/assets/aoi/portrait-close.svg',
    fallbackPath: '/aoi/image.png',
    alt: 'aOi portrait',
    objectPosition: 'center',
    scale: '1',
  },
  celebration: {
    variant: 'celebration',
    path: '/assets/aoi/celebration.svg',
    fallbackPath: '/aoi/builder-excited.png',
    alt: 'aOi celebrating',
    objectPosition: 'center',
    scale: '1',
  },
};

export const AOI_SIZE_CLASSES: Record<AoiSize, { container: string; ring: string }> = {
  sm: { container: 'w-10 h-10', ring: 'ring-1' },
  md: { container: 'w-16 h-16', ring: 'ring-2' },
  lg: { container: 'w-24 h-24', ring: 'ring-2' },
  xl: { container: 'w-40 h-40 md:w-48 md:h-48', ring: 'ring-4' },
};

export const AOI_GRADIENT_COLORS = {
  primary: 'from-[#9B8FD9] via-[#7BA7BC] to-[#8FA68E]',
  accent: 'from-[#9b87f5] to-[#00F0FF]',
  warm: 'from-[#D2A44C] to-[#fbbf24]',
};
