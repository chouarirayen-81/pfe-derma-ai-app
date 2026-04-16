import http from "./http";

export interface Stats {
  totalUsers: number;
  totalAnalyses: number;
  totalConseils: number;
}

const normalizeStats = (raw: any): Stats => {
  const source = raw?.data ?? raw ?? {};

  return {
    totalUsers: Number(source.totalUsers ?? source.total_users ?? 0),
    totalAnalyses: Number(source.totalAnalyses ?? source.total_analyses ?? 0),
    totalConseils: Number(source.totalConseils ?? source.total_conseils ?? 0),
  };
};

export const getStats = async (): Promise<Stats> => {
  const response = await http.get("/stats");
  return normalizeStats(response.data);
};