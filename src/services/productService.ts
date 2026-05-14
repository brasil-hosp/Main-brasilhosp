import { supabase } from '@/lib/supabase';
import type { Product } from '@/types/product';

export const productService = {
  async getAll(): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('id', { ascending: false })
      .range(0, 9999);
    if (error) throw error;
    return data ?? [];
  },

  async getById(id: string | number): Promise<Product | null> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  },

  async getRelated(category: string, excludeId: number, limit = 8): Promise<Product[]> {
    const { data } = await supabase
      .from('products')
      .select('*')
      .eq('category', category)
      .neq('id', excludeId)
      .limit(limit);
    return data ?? [];
  },

  async create(product: Omit<Product, 'id'>): Promise<Product> {
    const { data, error } = await supabase
      .from('products')
      .insert(product)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async update(id: number, updates: Partial<Omit<Product, 'id'>>): Promise<void> {
    const { error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', id);
    if (error) throw error;
  },

  async remove(id: number): Promise<void> {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  async bulkInsert(products: Omit<Product, 'id'>[]): Promise<number> {
    const { error } = await supabase
      .from('products')
      .insert(products);
    if (error) throw error;
    return products.length;
  },
};
