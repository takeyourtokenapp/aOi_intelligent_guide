import { supabase } from '../lib/supabase';

export interface KnowledgeEntry {
  id: string;
  category: string;
  topic: string;
  content: string;
  summary?: string;
  level: string;
  source_type?: string;
  source_url?: string;
  source_citation?: string;
  trustworthiness_score?: number;
  tags?: string[];
  similarity?: number;
}

export interface KnowledgeSubmission {
  submitter_id: string;
  knowledge_type: 'cns' | 'web3';
  category: string;
  topic: string;
  content: string;
  source_url?: string;
  source_citation?: string;
}

export interface SubmissionReview {
  submission_id: string;
  curator_id: string;
  status: 'approved' | 'rejected' | 'needs_revision';
  notes: string;
  trustworthiness_score?: number;
}

export class KnowledgeService {
  async getCNSKnowledge(
    filters?: {
      category?: string;
      level?: string;
      tags?: string[];
      limit?: number;
    }
  ): Promise<KnowledgeEntry[]> {
    let query = supabase
      .from('knowledge_base_cns')
      .select('*')
      .eq('age_appropriate', true)
      .order('created_at', { ascending: false });

    if (filters?.category) {
      query = query.eq('category', filters.category);
    }

    if (filters?.level) {
      query = query.eq('level', filters.level);
    }

    if (filters?.tags && filters.tags.length > 0) {
      query = query.overlaps('tags', filters.tags);
    }

    if (filters?.limit) {
      query = query.limit(filters.limit);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching CNS knowledge:', error);
      return [];
    }

    return data || [];
  }

  async getWeb3Knowledge(
    filters?: {
      category?: string;
      level?: string;
      tags?: string[];
      limit?: number;
    }
  ): Promise<KnowledgeEntry[]> {
    let query = supabase
      .from('knowledge_base_web3')
      .select('*')
      .order('created_at', { ascending: false });

    if (filters?.category) {
      query = query.eq('category', filters.category);
    }

    if (filters?.level) {
      query = query.eq('level', filters.level);
    }

    if (filters?.tags && filters.tags.length > 0) {
      query = query.overlaps('tags', filters.tags);
    }

    if (filters?.limit) {
      query = query.limit(filters.limit);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching Web3 knowledge:', error);
      return [];
    }

    return data || [];
  }

  async submitKnowledge(submission: KnowledgeSubmission): Promise<string | null> {
    const { data, error } = await supabase
      .from('knowledge_submissions')
      .insert({
        ...submission,
        submitter_type: 'user',
        status: 'pending',
        created_at: new Date().toISOString()
      })
      .select('id')
      .maybeSingle();

    if (error) {
      console.error('Error submitting knowledge:', error);
      return null;
    }

    return data?.id || null;
  }

  async getPendingSubmissions(curatorId: string): Promise<any[]> {
    const isCurator = await this.checkCuratorRole(curatorId);

    if (!isCurator) {
      return [];
    }

    const { data, error } = await supabase
      .from('knowledge_submissions')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching submissions:', error);
      return [];
    }

    return data || [];
  }

  async reviewSubmission(review: SubmissionReview): Promise<boolean> {
    const isCurator = await this.checkCuratorRole(review.curator_id);

    if (!isCurator) {
      console.error('User is not a verified curator');
      return false;
    }

    const { error } = await supabase
      .from('knowledge_submissions')
      .update({
        status: review.status,
        curator_id: review.curator_id,
        curator_notes: review.notes,
        trustworthiness_score: review.trustworthiness_score,
        reviewed_at: new Date().toISOString()
      })
      .eq('id', review.submission_id);

    if (error) {
      console.error('Error reviewing submission:', error);
      return false;
    }

    if (review.status === 'approved') {
      await this.approveAndPublish(review.submission_id, review.trustworthiness_score || 80);
    }

    return true;
  }

  private async approveAndPublish(
    submissionId: string,
    trustworthinessScore: number
  ): Promise<void> {
    const { data: submission } = await supabase
      .from('knowledge_submissions')
      .select('*')
      .eq('id', submissionId)
      .maybeSingle();

    if (!submission) return;

    const table = submission.knowledge_type === 'cns'
      ? 'knowledge_base_cns'
      : 'knowledge_base_web3';

    const entry: any = {
      category: submission.category,
      topic: submission.topic,
      content: submission.content,
      source_url: submission.source_url,
      source_citation: submission.source_citation,
      curator_id: submission.curator_id,
      curator_notes: submission.curator_notes,
      created_at: new Date().toISOString()
    };

    if (submission.knowledge_type === 'cns') {
      entry.source_type = 'curated';
      entry.trustworthiness_score = trustworthinessScore;
      entry.age_appropriate = true;
      entry.level = 'student';
    } else {
      entry.level = 'beginner';
    }

    await supabase.from(table).insert(entry);
  }

  private async checkCuratorRole(userId: string): Promise<boolean> {
    const { data } = await supabase
      .from('user_roles')
      .select('*')
      .eq('user_id', userId)
      .eq('role', 'curator')
      .eq('verified', true)
      .maybeSingle();

    return !!data;
  }

  async searchKnowledge(
    query: string,
    type: 'cns' | 'web3',
    _userLevel: string
  ): Promise<KnowledgeEntry[]> {
    const table = type === 'cns' ? 'knowledge_base_cns' : 'knowledge_base_web3';

    const { data, error } = await supabase
      .from(table)
      .select('*')
      .or(`topic.ilike.%${query}%,content.ilike.%${query}%`)
      .limit(10);

    if (error) {
      console.error('Error searching knowledge:', error);
      return [];
    }

    return data || [];
  }

  async getKnowledgeById(id: string, type: 'cns' | 'web3'): Promise<KnowledgeEntry | null> {
    const table = type === 'cns' ? 'knowledge_base_cns' : 'knowledge_base_web3';

    const { data, error } = await supabase
      .from(table)
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      console.error('Error fetching knowledge entry:', error);
      return null;
    }

    return data;
  }

  async recordKnowledgeView(
    userId: string,
    knowledgeId: string,
    knowledgeType: 'cns' | 'web3'
  ): Promise<void> {
    await supabase.from('aoi_interactions').insert({
      user_id: userId,
      interaction_type: 'knowledge_view',
      question: `Viewed ${knowledgeType} knowledge: ${knowledgeId}`,
      response: '',
      platform: 'foundation',
      created_at: new Date().toISOString()
    });
  }
}

export const knowledgeService = new KnowledgeService();
