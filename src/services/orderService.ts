import { supabase } from '@/lib/supabase';
import type { Order, OrderItem, OrderStatus } from '@/types/order';

export const orderService = {
  async getAll(): Promise<Order[]> {
    const { data, error } = await supabase
      .from('orders')
      .select('*, items:order_items(*)')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data ?? [];
  },

  async getByToken(token: string): Promise<Order | null> {
    const { data, error } = await supabase
      .from('orders')
      .select('*, items:order_items(*)')
      .eq('token', token)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  async create(order: Partial<Order>, items: Partial<OrderItem>[] = []): Promise<Order> {
    const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    
    const { data: newOrder, error: orderError } = await supabase
      .from('orders')
      .insert({ ...order, token })
      .select()
      .single();
      
    if (orderError) throw orderError;

    if (items.length > 0) {
      const clean = items.filter(i => i.product_name?.trim()).map(i => ({
        product_name: i.product_name!,
        quantity: i.quantity || '1',
        product_id: i.product_id || null,
        notes: i.notes || null,
        order_id: newOrder.id
      }));
      
      if (clean.length > 0) {
        const { error: itemsError } = await supabase.from('order_items').insert(clean);
        if (itemsError) throw itemsError;
      }
    }

    return newOrder;
  },

  async createEmpty(): Promise<Order> {
    return this.create({ client_name: 'Novo Pedido', status: 'pendente' });
  },

  async addItems(orderId: string, items: Partial<OrderItem>[]): Promise<void> {
    const clean = items.filter(i => i.product_name?.trim()).map(i => ({
      product_name: i.product_name!,
      quantity: i.quantity || '1',
      product_id: i.product_id || null,
      notes: i.notes || null,
      order_id: orderId
    }));
    if (clean.length === 0) return;
    const { error } = await supabase.from('order_items').insert(clean);
    if (error) throw error;
  },

  async removeItem(itemId: number): Promise<void> {
    const { error } = await supabase.from('order_items').delete().eq('id', itemId);
    if (error) throw error;
  },

  async updateClientInfo(id: string, data: Partial<Order>): Promise<void> {
    const { error } = await supabase
      .from('orders')
      .update(data)
      .eq('id', id);
    if (error) throw error;
  },

  async submitOrder(id: string, clientData: Partial<Order>, items: Partial<OrderItem>[]): Promise<void> {
    // 1. Update client info + mark as submitted
    const { error: updateError } = await supabase
      .from('orders')
      .update({ ...clientData, submitted_at: new Date().toISOString() })
      .eq('id', id);
    if (updateError) throw updateError;

    // 2. Replace items: delete old, insert new
    await supabase.from('order_items').delete().eq('order_id', id);
    
    const clean = items.filter(i => i.product_name?.trim()).map(i => ({
      product_name: i.product_name!,
      quantity: i.quantity || '1',
      product_id: i.product_id || null,
      notes: i.notes || null,
      order_id: id
    }));
    
    if (clean.length > 0) {
      const { error: itemsError } = await supabase.from('order_items').insert(clean);
      if (itemsError) throw itemsError;
    }
  },

  async updateStatus(id: string, status: OrderStatus): Promise<void> {
    const { error } = await supabase.from('orders').update({ status }).eq('id', id);
    if (error) throw error;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('orders').delete().eq('id', id);
    if (error) throw error;
  }
};
