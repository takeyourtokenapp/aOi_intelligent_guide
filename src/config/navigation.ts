export const DOMAIN_CONFIG = {
  foundation: {
    baseUrl: 'https://tyt.foundation',
    name: 'TYT Foundation',
    description: 'Knowledge, Mission, Trust',
  },
  app: {
    baseUrl: 'https://takeyourtoken.app',
    name: 'TakeYourToken',
    description: 'Tools, Skills, Practice',
  },
} as const;

export const NAVIGATION_LINKS = {
  foundation: [
    {
      label: 'Knowledge Hub',
      href: `${DOMAIN_CONFIG.foundation.baseUrl}/knowledge`,
      description: 'Learn about pediatric brain tumors, research, and science',
      icon: 'brain',
    },
    {
      label: 'Foundation',
      href: `${DOMAIN_CONFIG.foundation.baseUrl}/foundation`,
      description: 'Our mission, partnerships, and transparency',
      icon: 'heart',
    },
    {
      label: 'Transparency',
      href: `${DOMAIN_CONFIG.foundation.baseUrl}/foundation/transparency`,
      description: 'Track donations and funding allocations',
      icon: 'eye',
    },
    {
      label: 'For Students',
      href: `${DOMAIN_CONFIG.foundation.baseUrl}/students`,
      description: 'How students can participate and contribute',
      icon: 'users',
    },
  ],
  app: [
    {
      label: 'Academy',
      href: `${DOMAIN_CONFIG.app.baseUrl}/academy`,
      description: 'Learn Web3, blockchain, and crypto infrastructure',
      icon: 'book-open',
    },
    {
      label: 'Dashboard',
      href: `${DOMAIN_CONFIG.app.baseUrl}/dashboard`,
      description: 'Track your progress and achievements',
      icon: 'layout-dashboard',
    },
    {
      label: 'Tools',
      href: `${DOMAIN_CONFIG.app.baseUrl}/tools`,
      description: 'NFT miners, wallet, and governance',
      icon: 'wrench',
    },
    {
      label: 'Fund Support',
      href: `${DOMAIN_CONFIG.app.baseUrl}/fund`,
      description: 'Support children\'s brain cancer research',
      icon: 'heart-handshake',
    },
  ],
} as const;

export function buildCrossLink(
  from: keyof typeof DOMAIN_CONFIG,
  to: keyof typeof DOMAIN_CONFIG,
  path: string
): string {
  const domain = DOMAIN_CONFIG[to];
  return `${domain.baseUrl}${path}`;
}
