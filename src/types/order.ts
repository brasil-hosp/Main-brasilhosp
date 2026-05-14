export interface OrderItem {
  id?: number;
  order_id?: string;
  product_name: string;
  quantity: string;
  product_id?: number;
  notes?: string;
}

export type OrderStatus = 'pendente' | 'aprovado' | 'rejeitado' | 'concluido';

export interface Order {
  id: string;
  token: string;
  client_name: string;
  client_cnpj?: string;
  client_email?: string;
  client_phone?: string;
  reference_month?: string;
  status: OrderStatus;
  notes?: string;
  created_at: string;
  submitted_at?: string;
  created_by?: string;
  items?: OrderItem[]; // Relação 1:N preenchida opcionalmente
}
