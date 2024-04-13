export enum UserRole {
  ADMIN = 'Admin',
  EMPLOYEE = 'Employee',
}

export interface User {
  id: number;
  company_id: number;
  uuid: string;
  first_name: string;
  last_name: string;
  full_name?: string;
  email: string | null;
  phone: string | null;
  image: string | null;
  role: UserRole | null;
  is_active: boolean;
  last_login_at: string | null;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}

export enum Gender {
  MALE = 'M',
  FEMALE = 'F',
}
