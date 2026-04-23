import http from "./http";

export interface User {
  id: number | string;
  nom?: string;
  prenom?: string;
  full_name?: string;
  name?: string;
  email: string;
  phone?: string;
  age?: number | null;
  sexe?: "homme" | "femme" | "autre" | null;
  allergies?: string;
  antecedents?: string;
  traitements?: string;
  dureeLesion?: string;
  symptomes?: string;
  zoneCorps?: string;
  observation?: string;
  photoProfil?: string;
  isActive?: boolean;
  role?: "user" | "admin";
  createdAt?: string;
}

export interface UpdateUserPayload {
  nom?: string;
  prenom?: string;
  email?: string;
  phone?: string;
  age?: number | null;
  sexe?: "homme" | "femme" | "autre" | null;
  allergies?: string;
  antecedents?: string;
  traitements?: string;
  dureeLesion?: string;
  symptomes?: string;
  zoneCorps?: string;
  observation?: string;
  photoProfil?: string;
  role?: "user" | "admin";
  isActive?: boolean;
}

const normalizeUsers = (raw: any): User[] => {
  const source = raw?.data ?? raw;

  if (Array.isArray(source)) return source;
  if (Array.isArray(source?.users)) return source.users;
  if (Array.isArray(source?.items)) return source.items;

  return [];
};

export const getUsers = async (): Promise<User[]> => {
  const response = await http.get("/users");
  return normalizeUsers(response.data);
};

export const updateUser = async (
  id: number | string,
  payload: UpdateUserPayload
) => {
  const { data } = await http.patch(`/users/${id}`, payload);
  return data;
};

export const deleteUser = async (id: number | string) => {
  const { data } = await http.delete(`/users/${id}`);
  return data;
};