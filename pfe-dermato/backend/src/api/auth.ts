import API from './client';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ── LOGIN ──────────────────────────────────────────────
export const loginUser = async (email: string, password: string) => {
  const res = await API.post('/auth/login', { email, password });

  console.log('✅ LOGIN RESPONSE:', res.data);

  await AsyncStorage.setItem('accessToken', res.data.accessToken);
  await AsyncStorage.setItem('refreshToken', res.data.refreshToken);
  await AsyncStorage.setItem('user', JSON.stringify(res.data.user));

  return res.data;
};
// ── REGISTER ───────────────────────────────────────────
export const registerUser = async (payload: {
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  age: number;
  password: string;
}) => {
  console.log('📤 URL:', API.defaults.baseURL + '/auth/register');
  console.log('📦 Payload envoyé:', payload);

  const res = await API.post('/auth/register', payload);

  console.log('✅ REGISTER RESPONSE:', res.data);

  await AsyncStorage.setItem('token', res.data.accessToken);
  await AsyncStorage.setItem('refreshToken', res.data.refreshToken);
  await AsyncStorage.setItem('user', JSON.stringify(res.data.user));

  return res.data;
};

// ── LOGOUT ─────────────────────────────────────────────
export const logoutUser = async () => {
  try {
    await API.post('/auth/logout');
  } catch (error) {
    console.log('Erreur logout backend:', error);
  } finally {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('refreshToken');
    await AsyncStorage.removeItem('user');
  }
};
// ── VÉRIFIER SI CONNECTÉ ───────────────────────────────
export const getToken = async () => {
  return await AsyncStorage.getItem('token');
};

export const getUser = async () => {
  const user = await AsyncStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};