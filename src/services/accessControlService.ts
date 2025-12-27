import { supabase } from '../lib/supabase';
import { UserProfile, UserProgress } from './progressService';

export interface AccessCheck {
  allowed: boolean;
  reason?: string;
  requiresUpgrade?: boolean;
  nextLevel?: string;
}

export interface AccessLevel {
  level: 'student' | 'advanced_student' | 'researcher' | 'supporter';
  owlRank: 'Worker' | 'Academic' | 'Diplomat' | 'Warrior';
  capabilities: string[];
  restrictions: string[];
}

export const ACCESS_LEVELS: Record<string, AccessLevel> = {
  student: {
    level: 'student',
    owlRank: 'Worker',
    capabilities: [
      'view_knowledge_school',
      'view_knowledge_student',
      'take_academy_basics',
      'earn_certificates',
      'view_foundation_transparency'
    ],
    restrictions: [
      'no_real_crypto_access',
      'no_testnet_access',
      'guardian_required_under_18',
      'content_filtered'
    ]
  },

  advanced_student: {
    level: 'advanced_student',
    owlRank: 'Academic',
    capabilities: [
      'view_knowledge_advanced',
      'access_testnet_tools',
      'participate_quests',
      'earn_advanced_certificates',
      'view_research_papers'
    ],
    restrictions: [
      'no_mainnet_access',
      'limited_fund_contribution'
    ]
  },

  researcher: {
    level: 'researcher',
    owlRank: 'Diplomat',
    capabilities: [
      'access_mainnet_tools',
      'participate_mining',
      'contribute_to_foundation',
      'access_research_infrastructure',
      'participate_governance_limited'
    ],
    restrictions: [
      'dao_voting_limited'
    ]
  },

  supporter: {
    level: 'supporter',
    owlRank: 'Warrior',
    capabilities: [
      'full_dao_participation',
      'governance_voting',
      'proposal_creation',
      'access_all_tools',
      'mentor_other_users'
    ],
    restrictions: []
  }
};

export class AccessControlService {
  async checkAccess(
    userId: string,
    resource: string,
    action: string
  ): Promise<AccessCheck> {
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (!profile) {
      await this.logAccessAttempt(userId, resource, action, false, 'User not found');
      return { allowed: false, reason: 'User not found' };
    }

    const { data: progress } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (profile.age_group === 'child' || profile.age_group === 'teen') {
      if (profile.guardian_required && !profile.guardian_approved) {
        await this.logAccessAttempt(userId, resource, action, false, 'Guardian approval required');
        return {
          allowed: false,
          reason: 'Guardian approval required for users under 18'
        };
      }
    }

    const accessLevel = this.determineAccessLevel(profile, progress);
    const capabilities = ACCESS_LEVELS[accessLevel].capabilities;
    const restrictions = ACCESS_LEVELS[accessLevel].restrictions;

    if (resource === 'mainnet_tools' && restrictions.includes('no_mainnet_access')) {
      await this.logAccessAttempt(userId, resource, action, false, 'Requires Researcher level');
      return {
        allowed: false,
        reason: 'Mainnet access requires Researcher level or higher',
        requiresUpgrade: true,
        nextLevel: 'researcher'
      };
    }

    if (resource === 'dao_voting' && restrictions.includes('dao_voting_limited')) {
      await this.logAccessAttempt(userId, resource, action, false, 'Requires Supporter level');
      return {
        allowed: false,
        reason: 'Full DAO voting requires Supporter level',
        requiresUpgrade: true,
        nextLevel: 'supporter'
      };
    }

    if (resource.startsWith('knowledge_')) {
      const contentLevel = resource.split('_')[1];
      const requiredCapability = `view_knowledge_${contentLevel}`;

      if (!capabilities.includes(requiredCapability)) {
        await this.logAccessAttempt(userId, resource, action, false, `Requires ${contentLevel} level`);
        return {
          allowed: false,
          reason: `This content requires ${contentLevel} level access`,
          requiresUpgrade: true
        };
      }
    }

    await this.logAccessAttempt(userId, resource, action, true);
    return { allowed: true };
  }

  async getUserAccessLevel(userId: string): Promise<string> {
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    const { data: progress } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    return this.determineAccessLevel(profile, progress);
  }

  private determineAccessLevel(
    profile: UserProfile | null,
    progress: UserProgress | null
  ): string {
    if (!profile || !progress) return 'student';

    const score =
      (progress.courses_completed * 10) +
      (progress.certificates_earned * 50) +
      (progress.foundation_contribution / 100);

    if (score >= 600 && progress.foundation_contribution >= 1000) {
      return 'supporter';
    }

    if (score >= 300 && progress.courses_completed >= 10) {
      return 'researcher';
    }

    if (score >= 100) {
      return 'advanced_student';
    }

    return 'student';
  }

  async logAccessAttempt(
    userId: string,
    resource: string,
    action: string,
    allowed: boolean,
    reason?: string
  ): Promise<void> {
    const { data: profile } = await supabase
      .from('profiles')
      .select('user_level')
      .eq('user_id', userId)
      .maybeSingle();

    await supabase.from('access_logs').insert({
      user_id: userId,
      resource,
      action,
      allowed,
      reason,
      user_level: profile?.user_level || 'unknown',
      timestamp: new Date().toISOString()
    });
  }

  async checkRole(userId: string, role: string): Promise<boolean> {
    const { data } = await supabase
      .from('user_roles')
      .select('*')
      .eq('user_id', userId)
      .eq('role', role)
      .eq('verified', true)
      .maybeSingle();

    return !!data;
  }
}

export const accessControlService = new AccessControlService();
