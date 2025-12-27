import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { progressService, UserProgress, UserProfile, Achievement, ProgressTracking } from '../services/progressService';
import { supabase } from '../lib/supabase';

interface ProgressStats {
  academy: {
    total: number;
    completed: number;
    inProgress: number;
    totalTimeMinutes: number;
  };
  knowledge: {
    total: number;
    completed: number;
    totalTimeMinutes: number;
  };
  contribution: {
    total: number;
    completed: number;
    totalAmount: number;
  };
  achievements: {
    total: number;
    badges: number;
    certificates: number;
    milestones: number;
    contributions: number;
  };
}

interface UserProgressContextType {
  userId: string | null;
  profile: UserProfile | null;
  progress: UserProgress | null;
  stats: ProgressStats | null;
  recentActivity: ProgressTracking[];
  recentAchievements: Achievement[];
  isLoading: boolean;
  refreshProgress: () => Promise<void>;
  updateProgress: (
    moduleType: 'academy' | 'knowledge' | 'contribution',
    moduleId: string,
    moduleName: string,
    progressPercent: number,
    timeSpentMinutes?: number
  ) => Promise<boolean>;
  addAchievement: (
    achievementType: 'badge' | 'certificate' | 'milestone' | 'contribution',
    achievementId: string,
    title: string,
    description?: string,
    iconName?: string,
    metadata?: Record<string, any>
  ) => Promise<boolean>;
}

const UserProgressContext = createContext<UserProgressContextType | undefined>(undefined);

export function UserProgressProvider({ children }: { children: ReactNode }) {
  const [userId, setUserId] = useState<string | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [stats, setStats] = useState<ProgressStats | null>(null);
  const [recentActivity, setRecentActivity] = useState<ProgressTracking[]>([]);
  const [recentAchievements, setRecentAchievements] = useState<Achievement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        await loadProgressData(user.id);
      }
      setIsLoading(false);
    };

    checkUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUserId(session.user.id);
        await loadProgressData(session.user.id);
      } else {
        setUserId(null);
        clearProgressData();
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const loadProgressData = async (uid: string) => {
    setIsLoading(true);
    try {
      const summary = await progressService.getProgressSummary(uid);
      if (summary) {
        setProfile(summary.profile);
        setProgress(summary.progress);
        setStats(summary.stats);
        setRecentActivity(summary.recentActivity);
        setRecentAchievements(summary.recentAchievements);
      }
    } catch (error) {
      console.error('Error loading progress data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const clearProgressData = () => {
    setProfile(null);
    setProgress(null);
    setStats(null);
    setRecentActivity([]);
    setRecentAchievements([]);
  };

  const refreshProgress = async () => {
    if (userId) {
      await loadProgressData(userId);
    }
  };

  const updateProgress = async (
    moduleType: 'academy' | 'knowledge' | 'contribution',
    moduleId: string,
    moduleName: string,
    progressPercent: number,
    timeSpentMinutes: number = 0
  ): Promise<boolean> => {
    if (!profile) return false;

    const success = await progressService.updateProgressTracking(
      profile.id,
      moduleType,
      moduleId,
      moduleName,
      progressPercent,
      timeSpentMinutes
    );

    if (success) {
      await refreshProgress();
    }

    return success;
  };

  const addAchievement = async (
    achievementType: 'badge' | 'certificate' | 'milestone' | 'contribution',
    achievementId: string,
    title: string,
    description?: string,
    iconName?: string,
    metadata?: Record<string, any>
  ): Promise<boolean> => {
    if (!profile) return false;

    const success = await progressService.addAchievement(
      profile.id,
      achievementType,
      achievementId,
      title,
      description,
      iconName,
      metadata
    );

    if (success) {
      await refreshProgress();
    }

    return success;
  };

  return (
    <UserProgressContext.Provider
      value={{
        userId,
        profile,
        progress,
        stats,
        recentActivity,
        recentAchievements,
        isLoading,
        refreshProgress,
        updateProgress,
        addAchievement,
      }}
    >
      {children}
    </UserProgressContext.Provider>
  );
}

export function useUserProgress() {
  const context = useContext(UserProgressContext);
  if (context === undefined) {
    throw new Error('useUserProgress must be used within a UserProgressProvider');
  }
  return context;
}
