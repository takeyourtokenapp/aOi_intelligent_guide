import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Profile {
  id: string;
  user_id?: string;
  username: string;
  display_name?: string;
  age_group: 'child' | 'teen' | 'adult';
  user_level: 'beginner' | 'explorer' | 'builder' | 'guardian';
  guardian_required: boolean;
  guardian_approved: boolean;
  avatar_variant: number;
  created_at: string;
  updated_at: string;
}

export interface ProgressTracking {
  id: string;
  profile_id: string;
  module_type: 'academy' | 'knowledge' | 'contribution';
  module_id: string;
  module_name: string;
  progress_percent: number;
  completed: boolean;
  completed_at?: string;
  time_spent_minutes: number;
  last_accessed_at: string;
  metadata: Record<string, any>;
}

export interface Achievement {
  id: string;
  profile_id: string;
  achievement_type: 'badge' | 'certificate' | 'milestone' | 'contribution';
  achievement_id: string;
  title: string;
  description?: string;
  icon_name?: string;
  proof_hash?: string;
  metadata: Record<string, any>;
  earned_at: string;
}
