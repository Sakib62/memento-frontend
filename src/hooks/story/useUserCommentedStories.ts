import { useEffect, useState } from 'react';
import { Story } from '../../types/story';
import { useAuth } from '../useAuth';

const useUserCommentedStories = (userId: string) => {
  const [commentedStories, setCommentedStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const apiUrl = import.meta.env.VITE_API_URL;
  const { token } = useAuth();

  const fetchUserCommentedStories = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(
        `${apiUrl}/api/users/${userId}/stories/commented`,
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
      setCommentedStories(data.data);
    } catch (error) {
      setError('' + error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!userId || !token) return;
    fetchUserCommentedStories();
  }, [userId, token]);

  return { commentedStories, loading, error };
};

export default useUserCommentedStories;
