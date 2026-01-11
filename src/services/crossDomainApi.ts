import { supabase } from '../lib/supabase';

export interface CrossDomainMessage {
  type: 'auth' | 'progress' | 'navigation' | 'aoi_query' | 'sync';
  payload: any;
  timestamp: string;
  sourceDomain: 'app' | 'foundation';
}

export class CrossDomainApi {
  private readonly APP_ORIGIN = import.meta.env.VITE_APP_ORIGIN || 'https://takeyourtoken.app';
  private readonly FOUNDATION_ORIGIN = import.meta.env.VITE_FOUNDATION_ORIGIN || 'https://tyt.foundation';
  private messageListeners: Array<(message: CrossDomainMessage) => void> = [];

  async sendMessage(
    targetDomain: 'app' | 'foundation',
    message: CrossDomainMessage
  ): Promise<void> {
    const targetOrigin = targetDomain === 'app'
      ? this.APP_ORIGIN
      : this.FOUNDATION_ORIGIN;

    if (window.opener || window.parent !== window) {
      window.postMessage(message, targetOrigin);
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();

      await fetch(`${targetOrigin}/api/sync`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': session?.access_token ? `Bearer ${session.access_token}` : ''
        },
        body: JSON.stringify(message)
      });
    } catch (error) {
      console.error('Error sending cross-domain message:', error);
    }
  }

  listen(callback: (message: CrossDomainMessage) => void): () => void {
    this.messageListeners.push(callback);

    const handler = (event: MessageEvent) => {
      if (
        event.origin !== this.APP_ORIGIN &&
        event.origin !== this.FOUNDATION_ORIGIN
      ) {
        return;
      }

      const message = event.data as CrossDomainMessage;
      callback(message);
    };

    window.addEventListener('message', handler);

    return () => {
      const index = this.messageListeners.indexOf(callback);
      if (index > -1) {
        this.messageListeners.splice(index, 1);
      }
      window.removeEventListener('message', handler);
    };
  }

  async syncProgress(userId: string): Promise<void> {
    const { data: progress } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (progress) {
      await this.sendMessage('foundation', {
        type: 'progress',
        payload: progress,
        timestamp: new Date().toISOString(),
        sourceDomain: 'app'
      });
    }
  }

  async syncAuth(session: any): Promise<void> {
    await this.sendMessage('foundation', {
      type: 'auth',
      payload: { session },
      timestamp: new Date().toISOString(),
      sourceDomain: 'app'
    });
  }

  async logNavigation(
    userId: string,
    fromDomain: 'app' | 'foundation',
    toDomain: 'app' | 'foundation',
    fromPath: string,
    toPath: string
  ): Promise<void> {
    await supabase.from('cross_domain_navigation').insert({
      user_id: userId,
      from_domain: fromDomain,
      to_domain: toDomain,
      from_path: fromPath,
      to_path: toPath,
      timestamp: new Date().toISOString()
    });

    await this.sendMessage(toDomain, {
      type: 'navigation',
      payload: {
        userId,
        targetDomain: toDomain,
        targetPath: toPath
      },
      timestamp: new Date().toISOString(),
      sourceDomain: fromDomain
    });
  }

  async getNavigationHistory(userId: string, limit: number = 10): Promise<any[]> {
    const { data, error } = await supabase
      .from('cross_domain_navigation')
      .select('*')
      .eq('user_id', userId)
      .order('timestamp', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching navigation history:', error);
      return [];
    }

    return data || [];
  }

  async navigateToDomain(
    domain: 'app' | 'foundation',
    path: string,
    userId?: string
  ): Promise<void> {
    const targetOrigin = domain === 'app' ? this.APP_ORIGIN : this.FOUNDATION_ORIGIN;
    const targetUrl = `${targetOrigin}${path}`;

    if (userId) {
      const currentDomain = window.location.hostname.includes('foundation') ? 'foundation' : 'app';
      await this.logNavigation(
        userId,
        currentDomain,
        domain,
        window.location.pathname,
        path
      );
    }

    window.location.href = targetUrl;
  }

  async queryAoi(
    question: string,
    userId: string,
    userLevel: string,
    context?: any
  ): Promise<{ response: string; sources?: any[]; queryType?: string; language?: string }> {
    try {
      const currentDomain = window.location.hostname.includes('foundation') ? 'foundation' : 'app';
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      if (!supabaseUrl || !supabaseKey) {
        throw new Error('Supabase configuration missing');
      }

      const response = await fetch(`${supabaseUrl}/functions/v1/aoi-rag-query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseKey}`,
          'X-Client-Info': 'supabase-js-web'
        },
        body: JSON.stringify({
          question,
          userId,
          userLevel,
          domain: currentDomain,
          language: 'en',
          context
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('aOi query failed:', response.status, errorText);
        throw new Error(`Failed to query aOi: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        response: data.response || 'I apologize, but I encountered an error processing your question.',
        sources: data.sources || [],
        queryType: data.queryType,
        language: data.language
      };
    } catch (error) {
      console.error('Error querying aOi:', error);
      return {
        response: 'I apologize, but I\'m having trouble connecting to my knowledge base right now. Please try again in a moment.',
        sources: []
      };
    }
  }

  getCurrentDomain(): 'app' | 'foundation' {
    return window.location.hostname.includes('foundation') ? 'foundation' : 'app';
  }

  getOtherDomain(): 'app' | 'foundation' {
    return this.getCurrentDomain() === 'app' ? 'foundation' : 'app';
  }

  getOtherDomainUrl(path?: string): string {
    const otherDomain = this.getOtherDomain();
    const origin = otherDomain === 'app' ? this.APP_ORIGIN : this.FOUNDATION_ORIGIN;
    return path ? `${origin}${path}` : origin;
  }
}

export const crossDomainApi = new CrossDomainApi();
