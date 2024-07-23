export interface Customer {
  id: number;
  uuid: string;
  company_id: number;
  location_id: number;
  name: string;
  phone: string | null;
  email: string | null;
  address: string | null;
  zip_code: string | null;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}
