import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API = axios.create({
  baseURL: 'http://192.168.1.104:3000', // ← ton IP
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});


export const apiGet = (url: string, config = {}) => API.get(url, config);
export const apiPost = (url: string, data: any, config = {}) => API.post(url, data, config);


// ✅ Ajoute le token à chaque requête automatiquement
API.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ✅ Gestion globale des erreurs
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Token expiré → déconnexion automatique
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
      // Tu peux rediriger vers login ici
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
  // { totalAnalyses, analysesCeMois, scoreSante, recentAnalyses }
};

// ✅ Historique complet avec pagination
export const getAllAnalyses = async (page = 1, limit = 20, tri = 'date') => {
  const res = await API.get(`/analyses?page=${page}&limit=${limit}&tri=${tri}`);
  return res.data;
  // { data: [...], total, page, limit }
};

// ✅ Détail d'une analyse
export const getAnalyseDetail = async (id: number) => {
  const res = await API.get(`/analyses/${id}`);
  return res.data;
};

// ✅ Statut polling (toutes les 2s)
export const getAnalyseStatut = async (id: number) => {
  const res = await API.get(`/analyses/${id}/statut`);
  return res.data;
};

// ✅ Supprimer
export const deleteAnalysis = async (id: number) => {
  const res = await API.delete(`/analyses/${id}`);
  return res.data;
};

// ✅ Envoyer image pour analyse IA
export const analyzeImage = async (imageUri: string) => {
  const formData = new FormData();
  formData.append('image', {
    uri: imageUri,
    type: 'image/jpeg',
    name: 'skin.jpg',
  } as any);

  const res = await API.post('/analyses', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data; // { id, statut: 'en_attente' }
};
export default API;