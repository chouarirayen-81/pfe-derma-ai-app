export interface User {
  id: number | string;
  full_name?: string;
  name?: string;
  email: string;
  phone?: string;
  isActive?: boolean;
  createdAt?: string;
}