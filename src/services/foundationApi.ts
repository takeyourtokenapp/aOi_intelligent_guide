import { DOMAIN_CONFIG } from '../config/navigation';

export interface FoundationApiConfig {
  baseUrl: string;
  timeout: number;
  retries: number;
}

export interface AoiContext {
  topic: string;
  userLevel?: 'beginner' | 'explorer' | 'builder' | 'guardian';
  language?: string;
  currentDomain?: 'app' | 'foundation';
}

export interface AoiResponse {
  explanation: string;
  relatedTools?: string[];
  foundationLink?: string;
  appLink?: string;
  category: 'navigation' | 'education' | 'context' | 'general';
}

export interface FoundationStatus {
  online: boolean;
  lastChecked: Date;
  apiVersion?: string;
}

class FoundationApiService {
  private config: FoundationApiConfig;
  private status: FoundationStatus;
  private fallbackMode: boolean = false;

  constructor() {
    this.config = {
      baseUrl: `${DOMAIN_CONFIG.foundation.baseUrl}/api`,
      timeout: 10000,
      retries: 3,
    };

    this.status = {
      online: false,
      lastChecked: new Date(),
    };

    this.checkStatus();
  }

  async checkStatus(): Promise<FoundationStatus> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(`${this.config.baseUrl}/health`, {
        signal: controller.signal,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      clearTimeout(timeoutId);

      this.status = {
        online: response.ok,
        lastChecked: new Date(),
        apiVersion: response.headers.get('X-API-Version') || undefined,
      };

      this.fallbackMode = !response.ok;
    } catch (error) {
      this.status = {
        online: false,
        lastChecked: new Date(),
      };
      this.fallbackMode = true;
    }

    return this.status;
  }

  async askAoi(context: AoiContext): Promise<AoiResponse> {
    if (this.fallbackMode) {
      return this.getFallbackResponse(context);
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

      const response = await fetch(`${this.config.baseUrl}/aoi/ask`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(context),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.warn('Foundation API unavailable, using fallback', error);
      this.fallbackMode = true;
      return this.getFallbackResponse(context);
    }
  }

  private getFallbackResponse(context: AoiContext): AoiResponse {
    const { topic, currentDomain } = context;
    const topicLower = topic.toLowerCase();

    if (topicLower.includes('web3') || topicLower.includes('blockchain') || topicLower.includes('crypto')) {
      return {
        explanation: `Web3 and blockchain are decentralized technologies that enable transparent, secure transactions. In the TYT ecosystem, these tools power our infrastructure for medical research funding. ${currentDomain === 'foundation' ? 'You can learn more about these technologies in the Academy.' : 'These technologies directly support children\'s brain cancer research through transparent funding mechanisms.'}`,
        relatedTools: ['academy', 'blockchain-basics', 'web3-intro'],
        category: 'education',
        ...(currentDomain === 'foundation' && {
          appLink: `${DOMAIN_CONFIG.app.baseUrl}/academy`,
        }),
      };
    }

    if (topicLower.includes('brain') || topicLower.includes('cancer') || topicLower.includes('research') || topicLower.includes('medical')) {
      return {
        explanation: `TYT Foundation supports children's brain cancer research through transparent blockchain-based funding. Every transaction in our ecosystem contributes to medical research, equipment, and family support. ${currentDomain === 'app' ? 'Learn more about our mission and research partnerships.' : 'You can contribute by learning Web3 skills and participating in our ecosystem.'}`,
        foundationLink: `${DOMAIN_CONFIG.foundation.baseUrl}/knowledge`,
        category: 'context',
        ...(currentDomain === 'app' && {
          foundationLink: `${DOMAIN_CONFIG.foundation.baseUrl}/foundation`,
        }),
      };
    }

    if (topicLower.includes('aoi') || topicLower.includes('you') || topicLower.includes('who are you')) {
      return {
        explanation: "I'm aOi (葵), your navigation assistant between technology and medicine. I help you understand how Web3 tools enable medical research, guide you through learning paths, and connect the TYT ecosystem. I don't provide medical advice or financial recommendations, but I can explain technology and show you how it supports our mission.",
        category: 'general',
        relatedTools: ['about', 'mission'],
      };
    }

    if (topicLower.includes('nft') || topicLower.includes('mining') || topicLower.includes('token')) {
      return {
        explanation: `TYT uses NFT miners and the TYT token to create a sustainable funding model. NFT miners generate BTC rewards, and maintenance payments in TYT tokens are partially burned, creating deflationary pressure. ${currentDomain === 'foundation' ? 'The Academy teaches how these mechanisms work.' : 'This economic model directly funds medical research through transparent on-chain transactions.'}`,
        category: 'education',
        relatedTools: ['nft-miners', 'tokenomics', 'academy'],
      };
    }

    if (topicLower.includes('learn') || topicLower.includes('study') || topicLower.includes('academy')) {
      return {
        explanation: `The TYT Academy offers comprehensive courses on Web3, blockchain, NFTs, and DeFi. You'll earn verifiable certificates and build skills that support transparent medical research infrastructure. Progress is tracked in your personal ledger, creating a verifiable learning portfolio.`,
        appLink: `${DOMAIN_CONFIG.app.baseUrl}/academy`,
        category: 'navigation',
        relatedTools: ['academy', 'courses', 'certificates'],
      };
    }

    return {
      explanation: `I'm here to help you navigate the TYT ecosystem. You can ask me about:\n\n• Web3 and blockchain technology\n• How our infrastructure supports medical research\n• Learning paths in the Academy\n• The connection between tools and mission\n\nWhat would you like to know?`,
      category: 'general',
      relatedTools: ['academy', 'knowledge', 'foundation'],
    };
  }

  getStatus(): FoundationStatus {
    return this.status;
  }

  isOnline(): boolean {
    return this.status.online;
  }

  isFallbackMode(): boolean {
    return this.fallbackMode;
  }

  async retryConnection(): Promise<boolean> {
    const status = await this.checkStatus();
    return status.online;
  }
}

export const foundationApi = new FoundationApiService();
