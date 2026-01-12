export type AoiVariant = 'hero' | 'pointing' | 'presenting' | 'portrait' | 'celebration' | 'guiding' | 'standing' | 'fullbody';
export type AoiSize = 'sm' | 'md' | 'lg' | 'xl';

export interface AoiVariantConfig {
  variant: AoiVariant;
  path: string;
  fallbackPath: string;
  alt: string;
  objectPosition: string;
  scale: string;
}

export const AOI_SVG_FALLBACK = '/aoi/aoi-placeholder.svg';

export const AOI_VARIANTS: Record<AoiVariant, AoiVariantConfig> = {
  hero: {
    variant: 'hero',
    path: '/aoi/hero-welcome.png',
    fallbackPath: '/aoi/aoi-fullbody-welcome.png',
    alt: 'aOi - Your AI Guide',
    objectPosition: 'center top',
    scale: '1',
  },
  pointing: {
    variant: 'pointing',
    path: '/aoi/pointing-right.png',
    fallbackPath: '/aoi/presenting-open.png',
    alt: 'aOi pointing to information',
    objectPosition: 'center top',
    scale: '1',
  },
  presenting: {
    variant: 'presenting',
    path: '/aoi/presenting-open.png',
    fallbackPath: '/aoi/standing-neutral.png',
    alt: 'aOi presenting content',
    objectPosition: 'center top',
    scale: '1',
  },
  portrait: {
    variant: 'portrait',
    path: '/aoi/portrait-close.png',
    fallbackPath: '/aoi/hero-welcome.png',
    alt: 'aOi portrait',
    objectPosition: 'center top',
    scale: '1',
  },
  celebration: {
    variant: 'celebration',
    path: '/aoi/celebration.jpg',
    fallbackPath: '/aoi/presenting-open.png',
    alt: 'aOi celebrating',
    objectPosition: 'center top',
    scale: '1',
  },
  guiding: {
    variant: 'guiding',
    path: '/aoi/guiding-left.png',
    fallbackPath: '/aoi/aoi-fullbody-welcome.png',
    alt: 'aOi guiding you',
    objectPosition: 'center top',
    scale: '1',
  },
  standing: {
    variant: 'standing',
    path: '/aoi/standing-neutral.png',
    fallbackPath: '/aoi/aoi-fullbody-welcome.png',
    alt: 'aOi standing',
    objectPosition: 'center top',
    scale: '1',
  },
  fullbody: {
    variant: 'fullbody',
    path: '/aoi/aoi-fullbody-welcome.png',
    fallbackPath: '/aoi/standing-neutral.png',
    alt: 'aOi full body welcome',
    objectPosition: 'center top',
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
