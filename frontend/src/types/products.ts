export interface Product {
  id: number;
  uuid: string;
  name: string;
  description: string | null;
  price: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}
