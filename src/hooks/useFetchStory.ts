import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Story } from '../types/story';
import { useAuth } from './useAuth';

export const useFetchStory = (storyId: string | undefined) => {
  const { token, apiFetch } = useAuth();
  const navigate = useNavigate();

  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchStory = async () => {
      setLoading(true);
      try {
        const response = await apiFetch(`/api/stories/${storyId}`, {
          method: 'GET',
        });

        if (!response.ok) {
          navigate('/not-found');
          return;
        }

        const data = await response.json();
        setStory(data.data);
      } catch (error) {
        setTimeout(() => {
          if (!token) {
            navigate('/not-found');
          }
        }, 0);
      } finally {
        setLoading(false);
      }
    };

    if (token && storyId) {
      fetchStory();
    }
  }, [storyId, token]);

  return { story, loading };
};
