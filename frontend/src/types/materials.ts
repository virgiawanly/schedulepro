export interface Material {
  id: number;
  uuid: string;
  name: string;
  description: string | null;
  uom: string | null;
  price: number;
  image: string | null;
  image_url?: string | null;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}
