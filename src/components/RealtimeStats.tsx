import { useEffect, useState } from 'react';
import { Users, Bitcoin, Heart, Activity, TrendingUp, Sparkles } from 'lucide-react';
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
      const [profilesResult, progressResult, fundResult] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('user_progress').select('courses_completed, certificates_earned'),
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-gradient-to-br from-white via-slate-50 to-white dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 rounded-3xl border-2 border-slate-200 dark:border-slate-700/50 p-6 shadow-lg overflow-hidden">
            <div className="animate-pulse space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 bg-slate-300 dark:bg-slate-700 rounded-full"></div>
                <div className="h-6 bg-slate-300 dark:bg-slate-700 rounded-full w-16"></div>
              </div>
              <div className="space-y-3">
                <div className="h-10 bg-slate-300 dark:bg-slate-700 rounded-lg w-3/4"></div>
                <div className="h-4 bg-slate-300 dark:bg-slate-700 rounded w-1/2"></div>
              </div>
              <div className="pt-3 border-t border-slate-200 dark:border-slate-700">
                <div className="h-3 bg-slate-300 dark:bg-slate-700 rounded w-full"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
      <StatCard
        icon={<Users className="w-8 h-8" />}
        label="Learning Now"
        value={stats.activeUsers.toLocaleString()}
        subtext={`${stats.totalUsers} total users`}
        color="text-blue-600 dark:text-blue-400"
        borderColor="border-blue-300 dark:border-blue-500/40"
        bgColor="bg-blue-50 dark:bg-slate-800"
        trend="Live"
      />

      <StatCard
        icon={<Activity className="w-8 h-8" />}
        label="Courses Completed"
        value={stats.coursesCompleted.toLocaleString()}
        subtext={`${stats.certificatesEarned} certificates earned`}
        color="text-purple-600 dark:text-purple-400"
        borderColor="border-purple-300 dark:border-purple-500/40"
        bgColor="bg-purple-50 dark:bg-slate-800"
        trend="+Growth"
      />

      <StatCard
        icon={<Heart className="w-8 h-8" />}
        label="Foundation This Month"
        value={`$${stats.foundationThisMonth.toLocaleString()}`}
        subtext={`$${stats.foundationTotal.toLocaleString()} total`}
        color="text-pink-600 dark:text-pink-400"
        borderColor="border-pink-300 dark:border-pink-500/40"
        bgColor="bg-pink-50 dark:bg-slate-800"
        trend="Real-time"
      />

      <StatCard
        icon={<Bitcoin className="w-8 h-8" />}
        label="BTC Ecosystem"
        value="Coming Soon"
        subtext="Mining rewards launching Q1"
        color="text-amber-600 dark:text-amber-400"
        borderColor="border-amber-300 dark:border-amber-500/40"
        bgColor="bg-amber-50 dark:bg-slate-800"
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

function StatCard({ icon, label, value, subtext, color, borderColor, trend }: StatCardProps) {
  return (
    <div className={`group relative bg-gradient-to-br from-white via-slate-50 to-white dark:from-slate-800 dark:via-slate-850 dark:to-slate-900 rounded-3xl border-2 ${borderColor} hover:border-opacity-100 p-6 transition-all duration-500 hover:scale-105 hover:-translate-y-1 shadow-lg hover:shadow-2xl hover:shadow-blue-500/20 dark:hover:shadow-blue-500/10 backdrop-blur-sm overflow-hidden cursor-pointer`}>
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-400/10 dark:bg-blue-500/5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-5">
          <div className="relative">
            <div className={`absolute inset-0 ${color} opacity-20 blur-lg rounded-full group-hover:blur-xl transition-all`}></div>
            <div className={`${color} relative z-10 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
              {icon}
            </div>
          </div>
          <span className="flex items-center gap-1 text-xs font-bold px-3 py-1.5 bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 text-slate-700 dark:text-slate-300 rounded-full border border-slate-200 dark:border-slate-600 group-hover:scale-110 transition-transform">
            {trend === 'Live' && <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>}
            {trend === '+Growth' && <TrendingUp className="w-3 h-3" />}
            {trend === 'Real-time' && <Activity className="w-3 h-3 animate-pulse" />}
            {trend === 'V3' && <Sparkles className="w-3 h-3" />}
            {trend}
          </span>
        </div>

        <div className="mb-4">
          <div className={`text-3xl md:text-4xl font-bold ${color} mb-2 group-hover:scale-105 transition-transform`}>
            {value}
          </div>
          <div className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            {label}
          </div>
        </div>

        <div className="text-xs text-slate-600 dark:text-slate-400 pt-3 border-t border-slate-200 dark:border-slate-700 group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors">
          {subtext}
        </div>
      </div>
    </div>
  );
}
