import http from "./http";

export interface Pathologie {
  id: number;
  code: string;
  nom: string;
  description?: string;
  gravite?: "faible" | "moderee" | "elevee";
}

export const getPathologies = async (): Promise<Pathologie[]> => {
  const { data } = await http.get("/pathologies");
  return Array.isArray(data) ? data : [];
};

export const createPathologie = async (payload: {
  code: string;
  nom: string;
  description?: string;
  gravite?: "faible" | "moderee" | "elevee";
}) => {
  const { data } = await http.post("/pathologies", payload);
  return data;
};