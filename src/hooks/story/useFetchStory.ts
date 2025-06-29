import { useEffect, useState } from 'react';
import { Story } from '../../types/story';

export const useFetchStory = (storyId: string | undefined) => {
  const apiUrl = import.meta.env.VITE_API_URL;

  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStory = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${apiUrl}/api/stories/${storyId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          setError('not_found');
        } else {
          setError('generic_error');
        }
        setStory(null);
      } else {
        const data = await response.json();
        setStory(data.data);
      }
    } catch (error) {
      console.error('Error fetching story:', error);
      setError('generic_error');
      setStory(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (storyId) {
      fetchStory();
    }
  }, [storyId]);

  return { story, loading, error };
};
