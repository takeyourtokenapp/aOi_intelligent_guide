export interface AoiAsset {
  id: string;
  path: string;
  level: 'beginner' | 'explorer' | 'builder' | 'guardian';
  emotion?: 'neutral' | 'happy' | 'thinking' | 'concerned' | 'excited';
  description: string;
}

export const AOI_CHARACTER = {
  name: 'aOi',
  kanji: '葵',
  age: '16-18',
  role: 'AI Navigation Assistant',
  personality: ['empathetic', 'intelligent', 'trustworthy', 'warm'],
  colors: {
    primary: '#9b87f5',
    secondary: '#00F0FF',
    accent: '#D2A44C',
  },
  description: 'Modern Japanese anime girl, educational guide character. Soft but confident, smart and empathetic.',
};

export const AOI_ASSETS: AoiAsset[] = [
  {
    id: 'aoi-beginner-neutral',
    path: '/aoi/portrait-close.png',
    level: 'beginner',
    emotion: 'neutral',
    description: 'Beginner level - soft features, maximum empathy',
  },
  {
    id: 'aoi-explorer-thinking',
    path: '/aoi/guiding-left.png',
    level: 'explorer',
    emotion: 'thinking',
    description: 'Explorer level - clearer gaze, schemas appearing',
  },
  {
    id: 'aoi-builder-excited',
    path: '/aoi/presenting-open.png',
    level: 'builder',
    emotion: 'excited',
    description: 'Builder level - more mature, micro-holograms',
  },
  {
    id: 'aoi-guardian-neutral',
    path: '/aoi/standing-neutral.png',
    level: 'guardian',
    emotion: 'neutral',
    description: 'Guardian level - maximum composure, control center',
  },
];

export function getAoiAsset(
  level: 'beginner' | 'explorer' | 'builder' | 'guardian',
  emotion: 'neutral' | 'happy' | 'thinking' | 'concerned' | 'excited' = 'neutral'
): AoiAsset | undefined {
  return AOI_ASSETS.find((asset) => asset.level === level && asset.emotion === emotion);
}

export function getDefaultAoiAsset(): AoiAsset {
  return AOI_ASSETS[1];
}

export const AOI_PROMPTS = {
  master: `A modern Japanese anime girl named Aoi, cute but intelligent, warm and empathetic, designed as an educational guide character. Age appearance: 16–18 (safe, non-sexualized). Big expressive eyes full of kindness and awareness, soft confident smile. Modern anime art style, high quality illustration, clean lines, soft lighting. Wearing a minimalistic hoodie or light jacket in soft pastel colors (lavender, soft blue, white), subtle tech or science details (small badge, bracelet, interface glow). Calm, trustworthy, smart presence — not childish, not sexualized. Background: soft abstract gradient or light futuristic medical/tech interface, very subtle. Mood: hopeful, caring, reassuring. Style keywords: modern anime, kawaii but mature, educational character, empathy, science-friendly, clean aesthetic, high detail, 4k quality.`,

  beginner: `aOi at beginner level: maximum empathy and warmth, very soft features, gentle smile, welcoming posture. Soft lavender hoodie, minimal tech details. Background: soft pastel gradient. Pure kindness in eyes.`,

  explorer: `aOi at explorer level: clearer, more focused gaze, subtle confidence growing. Light blue jacket, small tech badge visible. Background: faint diagrams or schemas appearing. Intelligent curiosity.`,

  builder: `aOi at builder level: more mature appearance, confident posture, sharp intelligent eyes. White jacket with tech details, bracelet with interface glow. Background: subtle holographic elements. Professional warmth.`,

  guardian: `aOi at guardian level: maximum composure and authority, strong but caring presence. Full tech interface, command center background elements. Protective and wise. Leadership aura.`,
};

export const AOI_INSTRUCTIONS = `
VISUAL IDENTITY RULES FOR aOi:

1. ALWAYS non-sexualized, age-appropriate (16-18)
2. Focus: empathy + intelligence + trust
3. Colors: lavender, soft blue, white, gold accents
4. Style: modern anime, clean, high quality
5. Tech elements: subtle badges, bracelets, interface glows
6. Background: soft gradients or minimal futuristic elements
7. Evolution: beginner (soft) → guardian (composed)
8. NO: glamour, lifestyle, sexualization
9. YES: educational, caring, professional, smart

CHARACTER ESSENCE:
- Modern educational AI guide
- Japanese aesthetic (葵 - Aoi)
- Bridges technology and medicine
- Supports children's cancer research
- Trustworthy and warm presence
`;
