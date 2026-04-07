import { useEffect, useState } from 'react';
import { View, Text } from 'react-native';

import { apiGet } from '@/backend/src/api/client';
import API from '@/backend/dist/api/client';
export default function TestScreen() {
  const [message, setMessage] = useState('Chargement...');

  useEffect(() => {
    const load = async () => {
      try {
       const res = await API.get('/test');
setMessage(res.data.message);
      } catch (error) {
        setMessage('Erreur de connexion au backend');
        console.log(error);
      }
    };

    load();
  }, []);

  return (
    <View style={{ padding: 20 }}>
      <Text>{message}</Text>
    </View>
  );
}