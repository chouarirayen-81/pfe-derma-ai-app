import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API = axios.create({
  baseURL: 'http://192.168.1.112:3000',
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

export const apiGet = (url: string, config = {}) => API.get(url, config);
export const apiPost = (url: string, data: any, config = {}) => API.post(url, data, config);

API.interceptors.request.use(async (config) => {
  const token =
    (await AsyncStorage.getItem('accessToken')) ||
    (await AsyncStorage.getItem('token'));

  console.log('TOKEN ENVOYÉ =', token ? 'OUI' : 'NON')


  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem('accessToken');
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('refreshToken');
      await AsyncStorage.removeItem('user');
    }
    return Promise.reject(error);
  }
);

export const submitMedicalForm = async (payload: {
  age: number;
  sexe: string;
  antecedents: string;
  allergies?: string;
  traitements?: string;
  dureeLesion: string;
  symptomes?: string;
  zoneCorps: string;
  observation?: string;
}) => {
  const res = await API.post('/medical-form', payload);
  return res.data;
};

export const getDashboardData = async () => {
  const res = await API.get('/analyses/dashboard');
  return res.data;
};

export const getAllAnalyses = async (page = 1, limit = 20, tri = 'date') => {
  const res = await API.get(`/analyses?page=${page}&limit=${limit}&tri=${tri}`);
  return res.data;
};

export const getAnalyseDetail = async (id: number) => {
  const res = await API.get(`/analyses/${id}`);
  return res.data;
};

export const getAnalyseStatut = async (id: number) => {
  const res = await API.get(`/analyses/${id}/statut`);
  return res.data;
};

export const deleteAnalysis = async (id: number) => {
  const res = await API.delete(`/analyses/${id}`);
  return res.data;
};
//mdpoublie
export const forgotPassword = async (email: string) => {
  const res = await API.post('/auth/forgot-password', { email });
  return res.data;
};

export const verifyResetCode = async (email: string, code: string) => {
  const res = await API.post('/auth/verify-reset-code', { email, code });
  return res.data;
};

export const resetForgottenPassword = async (
  email: string,
  code: string,
  nouveauMotDePasse: string,
) => {
  const res = await API.put('/auth/reset-password', {
    email,
    code,
    nouveauMotDePasse,
  });
  return res.data;
};

export const analyzeImage = async (imageUri: string) => {
  const formData = new FormData();
  formData.append('image', {
    uri:  imageUri,
    type: 'image/jpeg',
    name: 'skin.jpg',
  } as any);
 
  const res = await API.post('/analyses', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
 
  console.log('REPONSE POST /analyses =', res.data);
 
  // ✅ Normaliser la réponse — s'assurer que analyseId est toujours présent
  const data = res.data;
  return {
    ...data,
    analyseId: data.analyseId ?? data.id,
    imageUrl:  data.imageUrl  ?? data.imageMiniature ?? data.imagePath ?? '',
  };
};

export default API;