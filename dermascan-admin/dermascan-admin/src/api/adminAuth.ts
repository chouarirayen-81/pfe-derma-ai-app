import http from "./http";

export const loginAdmin = async (payload: {
  email: string;
  password: string;
}) => {
  const { data } = await http.post("/admin-auth/login", payload);
  return data;
};

export const signupAdmin = async (payload: {
  nom: string;
  prenom: string;
  email: string;
  password: string;
}) => {
  const { data } = await http.post("/admin-auth/signup", payload);
  return data;
};