import { useEffect, useState } from 'react';
import { fetchAllStories } from '../services/api';
import { Stories } from '../types/story';

export function useStories(
  username: string | undefined,
  userId: string | undefined,
  token: string
) {
  const [stories, setStories] = useState<Stories>({
    created: [],
    liked: [],
    commented: [],
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const loadStories = async () => {
      if (!userId || !username) {
        setStories({ created: [], liked: [], commented: [] });
        setLoading(false);
        setError('');
        return;
      }

      setLoading(true);
      try {
        const data = await fetchAllStories(username, userId, token);
        setStories(data);
        setError('');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    loadStories();
  }, [username, userId, token]);

  return { stories, loading, error };
}
