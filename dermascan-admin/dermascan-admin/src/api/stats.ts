import http from "./http";

export interface Stats {
  totalUsers: number;
  totalAnalyses: number;
  totalConseils: number;
}

export const getStats = async (): Promise<Stats> => {
  const { data } = await http.get("/stats");
  return data;
};