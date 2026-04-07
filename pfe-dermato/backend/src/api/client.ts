import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API = axios.create({
  baseURL: 'http://172.20.10.2:3000', // ← ton IP
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

export default API;