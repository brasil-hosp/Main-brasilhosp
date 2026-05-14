export interface Product {
  id: number;
  name: string;
  category: string;
  subcategory?: string | null;
  description?: string | null;
  image_url?: string | null;
}
