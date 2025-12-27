import { supabase } from '../lib/supabase';

export interface UserProfile {
  id: string;
  user_id: string;
  username: string;
  display_name: string | null;
  age_group: 'child' | 'teen' | 'adult';
  user_level: 'beginner' | 'explorer' | 'builder' | 'guardian';
  guardian_required: boolean;
  guardian_approved: boolean;
  avatar_variant: number;
  created_at: string;
  updated_at: string;
}

export interface UserProgress {
  id: string;
  user_id: string;
  level: 'Beginner' | 'Explorer' | 'Builder' | 'Guardian';
  level_progress: number;
  courses_completed: number;
  courses_in_progress: number;
  certificates_earned: number;
  foundation_contribution: number;
  last_activity: string;
}

export interface ProgressTracking {
  id: string;
  profile_id: string;
  module_type: 'academy' | 'knowledge' | 'contribution';
  module_id: string;
  module_name: string;
  progress_percent: number;
  completed: boolean;
  completed_at: string | null;
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
  description: string | null;
  icon_name: string | null;
  proof_hash: string | null;
  metadata: Record<string, any>;
  earned_at: string;
}

export class ProgressService {
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }

    return data;
  }

  async getUserProgress(userId: string): Promise<UserProgress | null> {
    const { data, error } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching user progress:', error);
      return null;
    }

    return data;
  }

  async getProgressTracking(profileId: string): Promise<ProgressTracking[]> {
    const { data, error } = await supabase
      .from('progress_tracking')
      .select('*')
      .eq('profile_id', profileId)
      .order('last_accessed_at', { ascending: false });

    if (error) {
      console.error('Error fetching progress tracking:', error);
      return [];
    }

    return data || [];
  }

  async getAchievements(profileId: string): Promise<Achievement[]> {
    const { data, error } = await supabase
      .from('achievements')
      .select('*')
      .eq('profile_id', profileId)
      .order('earned_at', { ascending: false });

    if (error) {
      console.error('Error fetching achievements:', error);
      return [];
    }

    return data || [];
  }

  async updateProgressTracking(
    profileId: string,
    moduleType: 'academy' | 'knowledge' | 'contribution',
    moduleId: string,
    moduleName: string,
    progressPercent: number,
    timeSpentMinutes: number = 0
  ): Promise<boolean> {
    const completed = progressPercent >= 100;

    const { error } = await supabase
      .from('progress_tracking')
      .upsert({
        profile_id: profileId,
        module_type: moduleType,
        module_id: moduleId,
        module_name: moduleName,
        progress_percent: progressPercent,
        completed,
        completed_at: completed ? new Date().toISOString() : null,
        time_spent_minutes: timeSpentMinutes,
        last_accessed_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'profile_id,module_id'
      });

    if (error) {
      console.error('Error updating progress tracking:', error);
      return false;
    }

    if (completed) {
      await this.updateUserProgress(profileId, { courses_completed: 1 });
    }

    return true;
  }

  async updateUserProgress(
    userId: string,
    updates: {
      courses_completed?: number;
      courses_in_progress?: number;
      certificates_earned?: number;
      foundation_contribution?: number;
    }
  ): Promise<boolean> {
    const currentProgress = await this.getUserProgress(userId);

    if (!currentProgress) {
      return false;
    }

    const { error } = await supabase
      .from('user_progress')
      .update({
        courses_completed: updates.courses_completed
          ? currentProgress.courses_completed + updates.courses_completed
          : currentProgress.courses_completed,
        courses_in_progress: updates.courses_in_progress !== undefined
          ? currentProgress.courses_in_progress + updates.courses_in_progress
          : currentProgress.courses_in_progress,
        certificates_earned: updates.certificates_earned
          ? currentProgress.certificates_earned + updates.certificates_earned
          : currentProgress.certificates_earned,
        foundation_contribution: updates.foundation_contribution
          ? currentProgress.foundation_contribution + updates.foundation_contribution
          : currentProgress.foundation_contribution,
        last_activity: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId);

    if (error) {
      console.error('Error updating user progress:', error);
      return false;
    }

    return true;
  }

  async addAchievement(
    profileId: string,
    achievementType: 'badge' | 'certificate' | 'milestone' | 'contribution',
    achievementId: string,
    title: string,
    description?: string,
    iconName?: string,
    metadata?: Record<string, any>
  ): Promise<boolean> {
    const { error } = await supabase
      .from('achievements')
      .insert({
        profile_id: profileId,
        achievement_type: achievementType,
        achievement_id: achievementId,
        title,
        description,
        icon_name: iconName,
        metadata: metadata || {},
        earned_at: new Date().toISOString()
      });

    if (error) {
      console.error('Error adding achievement:', error);
      return false;
    }

    if (achievementType === 'certificate') {
      const profile = await this.getUserProfile(profileId);
      if (profile?.user_id) {
        await this.updateUserProgress(profile.user_id, { certificates_earned: 1 });
      }
    }

    return true;
  }

  async getProgressSummary(userId: string) {
    const profile = await this.getUserProfile(userId);
    if (!profile) return null;

    const progress = await this.getUserProgress(userId);
    const tracking = await this.getProgressTracking(profile.id);
    const achievements = await this.getAchievements(profile.id);

    const academyModules = tracking.filter(t => t.module_type === 'academy');
    const knowledgeModules = tracking.filter(t => t.module_type === 'knowledge');
    const contributionModules = tracking.filter(t => t.module_type === 'contribution');

    return {
      profile,
      progress,
      stats: {
        academy: {
          total: academyModules.length,
          completed: academyModules.filter(m => m.completed).length,
          inProgress: academyModules.filter(m => !m.completed && m.progress_percent > 0).length,
          totalTimeMinutes: academyModules.reduce((sum, m) => sum + m.time_spent_minutes, 0)
        },
        knowledge: {
          total: knowledgeModules.length,
          completed: knowledgeModules.filter(m => m.completed).length,
          totalTimeMinutes: knowledgeModules.reduce((sum, m) => sum + m.time_spent_minutes, 0)
        },
        contribution: {
          total: contributionModules.length,
          completed: contributionModules.filter(m => m.completed).length,
          totalAmount: progress?.foundation_contribution || 0
        },
        achievements: {
          total: achievements.length,
          badges: achievements.filter(a => a.achievement_type === 'badge').length,
          certificates: achievements.filter(a => a.achievement_type === 'certificate').length,
          milestones: achievements.filter(a => a.achievement_type === 'milestone').length,
          contributions: achievements.filter(a => a.achievement_type === 'contribution').length
        }
      },
      recentActivity: tracking.slice(0, 5),
      recentAchievements: achievements.slice(0, 5)
    };
  }

  async recordAoiInteraction(
    userId: string,
    interactionType: 'question' | 'audit' | 'recommendation' | 'progress_check',
    question: string,
    response: string,
    platform: 'app' | 'foundation'
  ): Promise<boolean> {
    const { error } = await supabase
      .from('aoi_interactions')
      .insert({
        user_id: userId,
        interaction_type: interactionType,
        question,
        response,
        platform,
        created_at: new Date().toISOString()
      });

    if (error) {
      console.error('Error recording aOi interaction:', error);
      return false;
    }

    return true;
  }

  async getOwlRank(level: string): Promise<string> {
    const rankMap: Record<string, string> = {
      'Beginner': 'Worker',
      'Explorer': 'Academic',
      'Builder': 'Diplomat',
      'Guardian': 'Warrior'
    };
    return rankMap[level] || 'Worker';
  }

  async calculateLevelProgress(
    coursesCompleted: number,
    certificatesEarned: number,
    contribution: number
  ): Promise<{ level: string; progress: number }> {
    const totalScore = (coursesCompleted * 10) + (certificatesEarned * 50) + (contribution / 100);

    if (totalScore < 100) {
      return { level: 'Beginner', progress: Math.min(totalScore, 100) };
    } else if (totalScore < 300) {
      return { level: 'Explorer', progress: Math.min(((totalScore - 100) / 200) * 100, 100) };
    } else if (totalScore < 600) {
      return { level: 'Builder', progress: Math.min(((totalScore - 300) / 300) * 100, 100) };
    } else {
      return { level: 'Guardian', progress: 100 };
    }
  }
}

export const progressService = new ProgressService();
