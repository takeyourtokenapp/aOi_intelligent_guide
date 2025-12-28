import { supabase } from '../lib/supabase';

export interface FoundationStatistics {
  id: string;
  total_donated: number;
  families_supported: number;
  research_grants: number;
  clinical_trials: number;
  partner_hospitals: number;
  updated_at: string;
}

export interface FoundationDonation {
  id: string;
  amount: number;
  currency: string;
  usd_equivalent: number;
  donor_id?: string;
  donor_name?: string;
  transaction_hash?: string;
  status: 'pending' | 'completed' | 'failed';
  created_at: string;
}

export interface FoundationGrant {
  id: string;
  title: string;
  description_en?: string;
  description_ru?: string;
  amount_usd: number;
  institution: string;
  status: 'proposed' | 'active' | 'completed';
  started_at?: string;
  completed_at?: string;
  created_at: string;
}

export interface ImpactReport {
  id: string;
  report_type: 'monthly' | 'quarterly' | 'yearly';
  period_start: string;
  period_end: string;
  total_donated: number;
  families_count: number;
  grants_count: number;
  trials_count: number;
  report_data: Record<string, any>;
  published_at: string;
  created_at: string;
}

export const foundationDataService = {
  async getStatistics(): Promise<FoundationStatistics | null> {
    try {
      const { data, error } = await supabase
        .from('foundation_statistics')
        .select('*')
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching foundation statistics:', error);
      return null;
    }
  },

  async getRecentDonations(limit: number = 10): Promise<FoundationDonation[]> {
    try {
      const { data, error } = await supabase
        .from('foundation_donations')
        .select('*')
        .eq('status', 'completed')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching donations:', error);
      return [];
    }
  },

  async getActiveGrants(): Promise<FoundationGrant[]> {
    try {
      const { data, error } = await supabase
        .from('foundation_grants')
        .select('*')
        .in('status', ['active', 'proposed'])
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching grants:', error);
      return [];
    }
  },

  async getImpactReports(type?: 'monthly' | 'quarterly' | 'yearly'): Promise<ImpactReport[]> {
    try {
      let query = supabase
        .from('foundation_impact_reports')
        .select('*')
        .not('published_at', 'is', null)
        .order('period_end', { ascending: false });

      if (type) {
        query = query.eq('report_type', type);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching impact reports:', error);
      return [];
    }
  },

  async getLatestReport(): Promise<ImpactReport | null> {
    try {
      const { data, error } = await supabase
        .from('foundation_impact_reports')
        .select('*')
        .not('published_at', 'is', null)
        .order('period_end', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching latest report:', error);
      return null;
    }
  },

  async createDonation(donation: {
    amount: number;
    currency: string;
    usd_equivalent: number;
    donor_name?: string;
  }): Promise<FoundationDonation | null> {
    try {
      const { data, error } = await supabase
        .from('foundation_donations')
        .insert([
          {
            ...donation,
            status: 'pending',
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating donation:', error);
      return null;
    }
  },
};
