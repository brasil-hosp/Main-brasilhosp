import { supabase } from '@/lib/supabase';
import type { Profile, UserType } from '@/types/profile';

export const profileService = {
  async getAll(): Promise<Profile[]> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data ?? [];
  },

  async getById(id: string): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  },

  async getUserType(id: string): Promise<UserType | null> {
    const { data } = await supabase
      .from('profiles')
      .select('user_type')
      .eq('id', id)
      .single();
    return data?.user_type ?? null;
  },

  async update(id: string, updates: Partial<Profile>): Promise<void> {
    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', id);
    if (error) throw error;
  },

  async verifyUser(id: string, verified: boolean): Promise<void> {
    const { error } = await supabase
      .from('profiles')
      .update({ is_verified: verified })
      .eq('id', id);
    if (error) throw error;
  },

  async promoteToAdmin(id: string): Promise<void> {
    const { error } = await supabase
      .from('profiles')
      .update({ user_type: 'ADMIN' })
      .eq('id', id);
    if (error) throw error;
  },
};
