import { useEffect, useState } from 'react';
import { Story } from '../../types/story';

const useUserStories = (username: string) => {
  const [createdStories, setCreatedStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const apiUrl = import.meta.env.VITE_API_URL;

  const fetchUserStories = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${apiUrl}/api/stories/author/${username}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch stories..');
      }

      const data = await response.json();
      setCreatedStories(data.data);
    } catch (error) {
      setError('' + error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserStories();
  }, [username]);

  return { createdStories, loading, error };
};

export default useUserStories;
