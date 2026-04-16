import http from "./http";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  user: {
    id: number | string;
    name?: string;
    full_name?: string;
    email: string;
    role?: string;
  };
}

export const adminLogin = async (
  payload: LoginPayload
): Promise<LoginResponse> => {
  const { data } = await http.post("/auth/login", payload);
  return data;
};