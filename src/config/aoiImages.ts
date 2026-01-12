export const AOI_IMAGES = {
  fullbodyWelcome: '/aoi/aoi-fullbody-welcome.png',
  standingNeutral: '/aoi/standing-neutral.png',
  portraitClose: '/aoi/portrait-close.png',
  pointingRight: '/aoi/pointing-right.png',
  guidingLeft: '/aoi/guiding-left.png',
  presentingOpen: '/aoi/presenting-open.png',
  celebration: '/aoi/celebration.jpg',
  heroWelcome: '/aoi/hero-welcome.png',
  placeholder: '/aoi/aoi-placeholder.svg',
} as const;

export type AoiImageKey = keyof typeof AOI_IMAGES;

export const AOI_IMAGE_FALLBACKS: Record<AoiImageKey, AoiImageKey | null> = {
  fullbodyWelcome: 'standingNeutral',
  heroWelcome: 'fullbodyWelcome',
  portraitClose: 'heroWelcome',
  pointingRight: 'presentingOpen',
  guidingLeft: 'fullbodyWelcome',
  presentingOpen: 'standingNeutral',
  standingNeutral: 'fullbodyWelcome',
  celebration: 'presentingOpen',
  placeholder: null,
};

export function getImageWithFallback(key: AoiImageKey): string {
  return AOI_IMAGES[key];
}

export function getFallbackImage(key: AoiImageKey): string | null {
  const fallbackKey = AOI_IMAGE_FALLBACKS[key];
  return fallbackKey ? AOI_IMAGES[fallbackKey] : null;
}
