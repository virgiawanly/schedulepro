import { Gender, User } from './users';

export interface Employee {
  id: number;
  uuid: string;
  company_id: number;
  location_id: number;
  first_name: string;
  last_name: string;
  phone: string | null;
  email: string | null;
  join_date: string | null;
  gender: Gender | null;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
  user?: User;
}
