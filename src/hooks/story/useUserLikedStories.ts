import { useEffect, useState } from 'react';
import { Story } from '../../types/story';
import { useAuth } from '../useAuth';

const useUserLikedStories = (userId: string) => {
  const [likedStories, setLikedStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const apiUrl = import.meta.env.VITE_API_URL;
  const { token } = useAuth();

  const fetchUserLikedStories = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(
        `${apiUrl}/api/users/${userId}/stories/liked`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch stories..');
      }

      const data = await response.json();
      setLikedStories(data.data);
    } catch (error) {
      setError('' + error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!userId || !token) return;
    fetchUserLikedStories();
  }, [userId, token]);

  return { likedStories, loading, error };
};

export default useUserLikedStories;
