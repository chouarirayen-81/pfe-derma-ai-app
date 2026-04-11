import API from './client';

// Stats dashboard
export const getDashboardStats = async () => {
  const res = await API.get('/analyses/stats');
  return res.data;
};

// Analyses récentes
export const getRecentAnalyses = async () => {
  const res = await API.get('/analyses/recent?limit=2');
  return res.data;
};

// Historique complet
export const getAllAnalyses = async () => {
  const res = await API.get('/analyses/history');
  return res.data;
};

// Supprimer
export const deleteAnalysis = async (id: number) => {
  await API.delete(`/analyses/${id}`);
};

// Envoyer image pour analyse IA
export const analyzeImage = async (imageUri: string) => {
  const formData = new FormData();
  formData.append('image', {
    uri: imageUri,
    type: 'image/jpeg',
    name: 'skin.jpg',
  } as any);

  const res = await API.post('/analyses/scan', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
};