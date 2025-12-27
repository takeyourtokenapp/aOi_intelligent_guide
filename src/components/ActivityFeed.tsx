import { useEffect, useState } from 'react';
import { Trophy, BookOpen, Heart, Sparkles, Award } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Activity {
  id: string;
  type: 'achievement' | 'donation' | 'course' | 'certificate';
  icon: React.ReactNode;
  message: string;
  timeAgo: string;
  aoiComment?: string;
  color: string;
}

export function ActivityFeed() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  const loadActivities = async () => {
    try {
      const [achievementsResult, fundResult] = await Promise.all([
        supabase
          .from('achievements')
          .select('id, title, achievement_type, earned_at')
          .order('earned_at', { ascending: false })
          .limit(5),
        supabase
          .from('fund_transparency')
          .select('id, transaction_type, amount_usd, created_at')
          .order('created_at', { ascending: false })
          .limit(5)
      ]);

      const formattedActivities: Activity[] = [];

      if (achievementsResult.data) {
        achievementsResult.data.forEach((achievement) => {
          formattedActivities.push({
            id: achievement.id,
            type: 'achievement',
            icon: achievement.achievement_type === 'certificate' ? <Award className="w-5 h-5" /> : <Trophy className="w-5 h-5" />,
            message: `User earned: ${achievement.title}`,
            timeAgo: getTimeAgo(achievement.earned_at),
            aoiComment: getAoiComment('achievement', achievement.achievement_type),
            color: 'text-[#D2A44C]'
          });
        });
      }

      if (fundResult.data) {
        fundResult.data.forEach((fund) => {
          if (fund.transaction_type === 'donation') {
            formattedActivities.push({
              id: fund.id,
              type: 'donation',
              icon: <Heart className="w-5 h-5" />,
              message: `Foundation received $${Number(fund.amount_usd).toLocaleString()}`,
              timeAgo: getTimeAgo(fund.created_at),
              aoiComment: getAoiComment('donation'),
              color: 'text-[#FF00FF]'
            });
          }
        });
      }

      formattedActivities.sort((a, b) => {
        const timeA = new Date(a.timeAgo).getTime() || 0;
        const timeB = new Date(b.timeAgo).getTime() || 0;
        return timeB - timeA;
      });

      setActivities(formattedActivities.slice(0, 8));
      setLoading(false);
    } catch (error) {
      console.error('Error loading activities:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadActivities();

    const channel = supabase
      .channel('activity_feed')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'achievements'
      }, (payload) => {
        const newActivity: Activity = {
          id: payload.new.id,
          type: 'achievement',
          icon: payload.new.achievement_type === 'certificate' ? <Award className="w-5 h-5" /> : <Trophy className="w-5 h-5" />,
          message: `User earned: ${payload.new.title}`,
          timeAgo: 'Just now',
          aoiComment: getAoiComment('achievement', payload.new.achievement_type),
          color: 'text-[#D2A44C]'
        };
        setActivities(prev => [newActivity, ...prev].slice(0, 8));
      })
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'fund_transparency'
      }, (payload) => {
        if (payload.new.transaction_type === 'donation') {
          const newActivity: Activity = {
            id: payload.new.id,
            type: 'donation',
            icon: <Heart className="w-5 h-5" />,
            message: `Foundation received $${Number(payload.new.amount_usd).toLocaleString()}`,
            timeAgo: 'Just now',
            aoiComment: getAoiComment('donation'),
            color: 'text-[#FF00FF]'
          };
          setActivities(prev => [newActivity, ...prev].slice(0, 8));
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (loading) {
    return (
      <div className="bg-[#1a2332]/30 rounded-2xl border border-[#D2A44C]/20 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-[#D2A44C]" />
          <h3 className="text-xl font-bold text-[#D2A44C]">Live Ecosystem Activity</h3>
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-4 p-3 bg-[#0A1122]/50 rounded-lg animate-pulse">
              <div className="w-8 h-8 bg-gray-700 rounded"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-700 rounded w-1/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="bg-[#1a2332]/30 rounded-2xl border border-[#D2A44C]/20 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-[#D2A44C]" />
          <h3 className="text-xl font-bold text-[#D2A44C]">Live Ecosystem Activity</h3>
        </div>
        <div className="text-center py-8">
          <p className="text-gray-400 mb-2">No activity yet</p>
          <p className="text-sm text-gray-500">
            Be the first to earn an achievement or contribute to the foundation!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#1a2332]/30 rounded-2xl border border-[#D2A44C]/20 p-6 hover:border-[#D2A44C]/40 transition-all">
      <div className="flex items-center gap-2 mb-6">
        <Sparkles className="w-5 h-5 text-[#D2A44C]" />
        <h3 className="text-xl font-bold text-[#D2A44C]">Live Ecosystem Activity</h3>
        <span className="ml-auto text-xs text-gray-500 px-2 py-1 bg-green-500/10 text-green-400 rounded animate-pulse">
          ● Live
        </span>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-start gap-4 p-4 bg-[#0A1122]/50 rounded-lg hover:bg-[#0A1122]/70 transition-all border border-transparent hover:border-[#D2A44C]/20"
          >
            <div className={`${activity.color} flex-shrink-0 mt-1`}>
              {activity.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-gray-200 text-sm mb-1">{activity.message}</p>
              <p className="text-xs text-gray-500">{activity.timeAgo}</p>
              {activity.aoiComment && (
                <div className="mt-2 text-xs text-[#00F0FF] italic bg-[#00F0FF]/5 px-3 py-2 rounded border border-[#00F0FF]/10">
                  <span className="font-semibold">aOi: </span>
                  {activity.aoiComment}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function getTimeAgo(timestamp: string): string {
  const now = new Date();
  const past = new Date(timestamp);
  const diffMs = now.getTime() - past.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
}

function getAoiComment(type: string, subtype?: string): string {
  const comments = {
    achievement: [
      "Another step forward in the journey! 葵",
      "Knowledge grows with each achievement. 葵",
      "Well done! Every milestone matters. 葵",
      "Progress is the path to mastery. 葵"
    ],
    certificate: [
      "A verified skill - this opens new doors! 葵",
      "Certificate earned. Your expertise is growing. 葵",
      "Official recognition of dedication! 葵"
    ],
    donation: [
      "Every contribution helps children fighting brain tumors. 葵",
      "Web3 technology directly funding medical research. 葵",
      "This is why we build - to save lives. 葵",
      "From crypto to care. Thank you. 葵"
    ]
  };

  if (type === 'achievement' && subtype === 'certificate') {
    return comments.certificate[Math.floor(Math.random() * comments.certificate.length)];
  }

  const categoryComments = comments[type as keyof typeof comments] || comments.achievement;
  return categoryComments[Math.floor(Math.random() * categoryComments.length)];
}
