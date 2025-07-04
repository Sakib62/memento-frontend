import { useEffect, useState } from 'react';
import { UserWithStoryCount } from '../../types/user';
import { useAuth } from '../useAuth';

const useUserInfo = (username: string, isStoryCount: boolean = false) => {
  const [userInfo, setUserInfo] = useState<UserWithStoryCount>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const apiUrl = import.meta.env.VITE_API_URL;
  const { token } = useAuth();

  const fetchUserInfo = async () => {
    setLoading(true);
    setError('');
    try {
      let endpoint = `${apiUrl}/api/users/username/${username}`;
      if (isStoryCount) endpoint += `?storyCount=${isStoryCount}`;

      const response = await fetch(`${endpoint}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user info');
      }

      const data = await response.json();
      setUserInfo(data.data);
    } catch (error) {
      setError('' + error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!username) return;
    fetchUserInfo();
  }, [username, token]);

  return { userInfo, loading, error };
};

export default useUserInfo;
