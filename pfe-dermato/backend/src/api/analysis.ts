import API from './client';

// Envoyer une photo pour analyse
export const analyzeImage = async (imageUri: string) => {
  const formData = new FormData();
  formData.append('image', {
    uri: imageUri,
    type: 'image/jpeg',
    name: 'skin.jpg',
  } as any);

  const res = await API.post('/analysis/scan', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
  // { disease, confidence, advice, recommendation }
};

// Historique
export const getHistory = async () => {
  const res = await API.get('/analysis/history');
  return res.data;
};

// Supprimer
export const deleteAnalysis = async (id: number) => {
  await API.delete(`/analysis/${id}`);
};