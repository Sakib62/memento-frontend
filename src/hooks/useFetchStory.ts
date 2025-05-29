import { useEffect, useState } from 'react';
import { Story } from '../types/story';
import { useAuth } from './useAuth';

export const useFetchStory = (storyId: string | undefined) => {
  const { token, clearAuthData } = useAuth();
  const apiUrl = import.meta.env.VITE_API_URL;

  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchStory = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/api/stories/${storyId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        clearAuthData();
      } else if (response.status === 404) {
        setStory(null);
      } else if (!response.ok) {
        throw new Error('Failed to fetch story');
      } else {
        const data = await response.json();
        setStory(data.data);
      }
    } catch (error) {
      console.error('Error fetching story:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token && storyId) {
      fetchStory();
    }
  }, [storyId, token]);

  return { story, loading };
};
