export interface AdminUser {
  id: number | string;
  full_name?: string;
  name?: string;
  email: string;
  role?: string;
}

export interface LoginResponse {
  access_token: string;
  user: AdminUser;
}