import http from "./http";

export interface Conseil {
  id: number | string;
  title?: string;
  content: string;
  category?: string;
  createdAt?: string;
}

const normalizeConseils = (raw: any): Conseil[] => {
  const source = raw?.data ?? raw;

  if (Array.isArray(source)) {
    return source;
  }

  if (Array.isArray(source?.conseils)) {
    return source.conseils;
  }

  if (Array.isArray(source?.items)) {
    return source.items;
  }

  return [];
};

export const getConseils = async (): Promise<Conseil[]> => {
  const response = await http.get("/conseils");
  return normalizeConseils(response.data);
};