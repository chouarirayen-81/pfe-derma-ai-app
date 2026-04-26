import http from "./http";

export interface Conseil {
  id: number | string;
  title?: string;
  content?: string;
  category?: string;
  createdAt?: string;
  pathologieId?: number | null;
  type?: "prevention" | "traitement" | "urgence" | "information" | null;
  ordre?: number | null;
  valeur?: string;
  emoji?: string;
}

export interface UpdateConseilPayload {
  title?: string;
  content?: string;
  pathologieId?: number | null;
  type?: "prevention" | "traitement" | "urgence" | "information" | null;
  ordre?: number | null;
  valeur?: string;
  emoji?: string;
}

const normalizeConseils = (raw: any): Conseil[] => {
  const source = raw?.data ?? raw;

  if (Array.isArray(source)) return source;
  if (Array.isArray(source?.conseils)) return source.conseils;
  if (Array.isArray(source?.items)) return source.items;

  return [];
};

export const getConseils = async (): Promise<Conseil[]> => {
  const response = await http.get("/conseils");
  return normalizeConseils(response.data);
};

export const updateConseil = async (
  id: number | string,
  payload: UpdateConseilPayload
) => {
  const { data } = await http.patch(`/conseils/${id}`, payload);
  return data;
};

export const createConseil = async (payload: {
  title: string;
  content: string;
  pathologieId: number;
  type?: "prevention" | "traitement" | "urgence" | "information";
  ordre?: number;
  valeur?: string;
  emoji?: string;
}) => {
  const { data } = await http.post("/conseils", payload);
  return data;
}; 

export const deleteConseil = async (id: number | string) => {
  const { data } = await http.delete(`/conseils/${id}`);
  return data;
};