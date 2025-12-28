import { supabase } from '../lib/supabase';

export interface OwlRank {
  id: string;
  rank_name: string;
  rank_order: number;
  xp_min: number;
  xp_max: number;
  icon_emoji: string;
  description_en?: string;
  description_ru?: string;
}

export interface LearningTrack {
  id: string;
  slug: string;
  title_en: string;
  title_ru: string;
  description_en?: string;
  description_ru?: string;
  difficulty: string;
  estimated_hours: number;
  xp_reward: number;
  icon?: string;
  track_order: number;
  is_published: boolean;
}

export interface Lesson {
  id: string;
  track_id: string;
  slug: string;
  title_en: string;
  title_ru: string;
  content_en?: string;
  content_ru?: string;
  lesson_type: string;
  duration_minutes: number;
  xp_reward: number;
  lesson_order: number;
  prerequisites: string[];
}

export interface UserXP {
  id: string;
  user_id: string;
  total_xp: number;
  current_rank: string;
  tracks_started: number;
  lessons_completed: number;
  certificates_earned: number;
  created_at: string;
  updated_at: string;
}

export interface UserLessonProgress {
  id: string;
  user_id: string;
  lesson_id: string;
  track_id: string;
  status: 'not_started' | 'in_progress' | 'completed';
  progress_percent: number;
  started_at?: string;
  completed_at?: string;
  xp_earned: number;
}

export interface Certificate {
  id: string;
  user_id: string;
  track_id: string;
  certificate_type: string;
  title_en: string;
  title_ru: string;
  issued_at: string;
  certificate_hash?: string;
}

export const academyService = {
  async getRanks(): Promise<OwlRank[]> {
    try {
      const { data, error } = await supabase
        .from('owl_ranks')
        .select('*')
        .order('rank_order', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching ranks:', error);
      return [];
    }
  },

  async getTracks(): Promise<LearningTrack[]> {
    try {
      const { data, error } = await supabase
        .from('learning_tracks')
        .select('*')
        .eq('is_published', true)
        .order('track_order', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching tracks:', error);
      return [];
    }
  },

  async getTrackLessons(trackId: string): Promise<Lesson[]> {
    try {
      const { data, error } = await supabase
        .from('lessons')
        .select('*')
        .eq('track_id', trackId)
        .eq('is_published', true)
        .order('lesson_order', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching lessons:', error);
      return [];
    }
  },

  async getUserXP(): Promise<UserXP | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('user_xp')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching user XP:', error);
      return null;
    }
  },

  async getUserProgress(): Promise<UserLessonProgress[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('user_lesson_progress')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching user progress:', error);
      return [];
    }
  },

  async getUserCertificates(): Promise<Certificate[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('certificates')
        .select('*')
        .eq('user_id', user.id)
        .order('issued_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching certificates:', error);
      return [];
    }
  },

  getRankForXP(xp: number, ranks: OwlRank[]): OwlRank | null {
    for (let i = ranks.length - 1; i >= 0; i--) {
      if (xp >= ranks[i].xp_min) {
        return ranks[i];
      }
    }
    return ranks[0] || null;
  },

  getNextRank(currentRank: string, ranks: OwlRank[]): OwlRank | null {
    const current = ranks.find(r => r.rank_name === currentRank);
    if (!current) return null;
    return ranks.find(r => r.rank_order === current.rank_order + 1) || null;
  },
};
