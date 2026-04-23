import http from "./http";

export interface Analyse {
  id: number | string;
  userId: number | string;
  userName?: string | null;
  userEmail?: string | null;
  imageUrl?: string;
  predictedClass?: string;
  confidence?: number;
  createdAt?: string;
  status?: string;
  qualityScore?: number;
  urgence?: string;
}

const normalizeAnalyses = (raw: any): Analyse[] => {
  const source = raw?.data ?? raw;

  if (Array.isArray(source)) return source;
  if (Array.isArray(source?.analyses)) return source.analyses;
  if (Array.isArray(source?.items)) return source.items;

  return [];
};

export const getAnalyses = async (): Promise<Analyse[]> => {
  const response = await http.get("/analyses");
  return normalizeAnalyses(response.data);
};

export const deleteAnalyse = async (id: number | string) => {
  const { data } = await http.delete(`/analyses/${id}`);
  return data;
};