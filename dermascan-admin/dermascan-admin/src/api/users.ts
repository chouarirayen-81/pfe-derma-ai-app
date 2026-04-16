import http from "./http";

export interface User {
  id: number | string;
  full_name?: string;
  name?: string;
  email: string;
  phone?: string;
  isActive?: boolean;
  createdAt?: string;
}

const normalizeUsers = (raw: any): User[] => {
  const source = raw?.data ?? raw;

  if (Array.isArray(source)) {
    return source;
  }

  if (Array.isArray(source?.users)) {
    return source.users;
  }

  if (Array.isArray(source?.items)) {
    return source.items;
  }

  return [];
};

export const getUsers = async (): Promise<User[]> => {
  const response = await http.get("/users");
  return normalizeUsers(response.data);
};