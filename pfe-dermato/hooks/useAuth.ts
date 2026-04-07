import { useState, useEffect } from 'react';

import { useRouter } from 'expo-router';
import { getToken, getUser, logoutUser,} from '@/backend/src/api/auth';

export const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = await getToken();
      const userData = await getUser();
      if (token && userData) {
        setIsLoggedIn(true);
        setUser(userData);
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await logoutUser();
    setIsLoggedIn(false);
    setUser(null);
    router.replace('/login');
  };

  return { isLoggedIn, user, loading, logout, checkAuth };
};