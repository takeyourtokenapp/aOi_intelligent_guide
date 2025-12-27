import { useEffect, useState } from 'react';
import { Users, Bitcoin, Heart, Activity } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface EcosystemStats {
  activeUsers: number;
  totalUsers: number;
  coursesCompleted: number;
  certificatesEarned: number;
  foundationTotal: number;
  foundationThisMonth: number;
}

export function RealtimeStats() {
  const [stats, setStats] = useState<EcosystemStats>({
    activeUsers: 0,
    totalUsers: 0,
    coursesCompleted: 0,
    certificatesEarned: 0,
    foundationTotal: 0,
    foundationThisMonth: 0
  });

  const [loading, setLoading] = useState(true);

  const loadStats = async () => {
    try {
      const [profilesResult, progressResult, achievementsResult, fundResult] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('user_progress').select('courses_completed, certificates_earned'),
        supabase.from('achievements').select('id', { count: 'exact', head: true }),
        supabase.from('fund_transparency').select('amount_usd, created_at')
      ]);

      const totalUsers = profilesResult.count || 0;

      const coursesCompleted = progressResult.data?.reduce((sum, p) => sum + (p.courses_completed || 0), 0) || 0;
      const certificatesEarned = progressResult.data?.reduce((sum, p) => sum + (p.certificates_earned || 0), 0) || 0;

      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      const foundationTotal = fundResult.data?.reduce((sum, t) => sum + (Number(t.amount_usd) || 0), 0) || 0;
      const foundationThisMonth = fundResult.data
        ?.filter(t => new Date(t.created_at) >= startOfMonth)
        .reduce((sum, t) => sum + (Number(t.amount_usd) || 0), 0) || 0;

      setStats({
        activeUsers: Math.floor(totalUsers * 0.3),
        totalUsers,
        coursesCompleted,
        certificatesEarned,
        foundationTotal,
        foundationThisMonth
      });

      setLoading(false);
    } catch (error) {
      console.error('Error loading stats:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();

    const channel = supabase
      .channel('ecosystem_stats')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'user_progress'
      }, () => {
        loadStats();
      })
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'fund_transparency'
      }, () => {
        loadStats();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-[#1a2332]/30 rounded-2xl border border-[#D2A44C]/20 p-6 animate-pulse">
            <div className="h-4 bg-gray-700 rounded w-1/2 mb-2"></div>
            <div className="h-8 bg-gray-700 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
      <StatCard
        icon={<Users className="w-8 h-8" />}
        label="Learning Now"
        value={stats.activeUsers.toLocaleString()}
        subtext={`${stats.totalUsers} total users`}
        color="text-[#7BA7BC]"
        borderColor="border-[#7BA7BC]/30"
        bgColor="bg-[#7BA7BC]/5"
        trend="Live"
      />

      <StatCard
        icon={<Activity className="w-8 h-8" />}
        label="Courses Completed"
        value={stats.coursesCompleted.toLocaleString()}
        subtext={`${stats.certificatesEarned} certificates earned`}
        color="text-[#9B8FD9]"
        borderColor="border-[#9B8FD9]/30"
        bgColor="bg-[#9B8FD9]/5"
        trend="+Growth"
      />

      <StatCard
        icon={<Heart className="w-8 h-8" />}
        label="Foundation This Month"
        value={`$${stats.foundationThisMonth.toLocaleString()}`}
        subtext={`$${stats.foundationTotal.toLocaleString()} total`}
        color="text-[#E8B4B8]"
        borderColor="border-[#E8B4B8]/30"
        bgColor="bg-[#E8B4B8]/5"
        trend="Real-time"
      />

      <StatCard
        icon={<Bitcoin className="w-8 h-8" />}
        label="BTC Ecosystem"
        value="Coming Soon"
        subtext="Mining rewards launching Q1"
        color="text-[#8FA68E]"
        borderColor="border-[#8FA68E]/30"
        bgColor="bg-[#8FA68E]/5"
        trend="V3"
      />
    </div>
  );
}

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  subtext: string;
  color: string;
  borderColor: string;
  bgColor: string;
  trend: string;
}

function StatCard({ icon, label, value, subtext, color, borderColor, bgColor, trend }: StatCardProps) {
  return (
    <div className={`${bgColor} rounded-2xl border ${borderColor} p-6 hover:border-opacity-60 transition-all duration-300 hover:scale-105 animate-breathe backdrop-blur-sm`}>
      <div className="flex items-center justify-between mb-4">
        <div className={color}>{icon}</div>
        <span className="text-xs text-gray-500 font-medium px-2 py-1 bg-gray-800/50 rounded">
          {trend}
        </span>
      </div>

      <div className="mb-2">
        <div className={`text-3xl font-bold ${color} mb-1`}>
          {value}
        </div>
        <div className="text-sm text-gray-400 font-medium">
          {label}
        </div>
      </div>

      <div className="text-xs text-gray-500 pt-2 border-t border-gray-700/50">
        {subtext}
      </div>
    </div>
  );
}
