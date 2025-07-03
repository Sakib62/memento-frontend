import { useEffect, useRef, useState } from 'react';
import { Story } from '../../types/story';

const useUserStories = (username: string) => {
  const [createdStories, setCreatedStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);

  const [error, setError] = useState('');

  const apiUrl = import.meta.env.VITE_API_URL;

  const didInitialFetch = useRef('');
  const limit = 6;

  useEffect(() => {
    setCreatedStories([]);
    setPage(1);
  }, [username]);

  const fetchUserStories = async () => {
    setLoading(true);
    setError('');
    try {
      const offset = (page - 1) * limit;
      const response = await fetch(
        `${apiUrl}/api/stories/author/${username}?offset=${offset}&limit=${limit + 1}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch stories..');
      }

      const data = await response.json();
      setCreatedStories(prev => [...prev, ...data.data.slice(0, limit)]);
      setHasNextPage(data.data.length > limit);
    } catch (error) {
      setError('' + error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!username || !page) return;

    const fetchKey = `${username}-${page}`;
    if (page === 1) {
      if (didInitialFetch.current === fetchKey) return;
      didInitialFetch.current = fetchKey;
    }

    fetchUserStories();
  }, [page, username]);

  const loadMore = () => {
    if (!loading && hasNextPage) {
      setPage(prev => prev + 1);
    }
  };

  return {
    createdStories,
    loading,
    hasNextPage,
    loadMore,
    error,
  };
};

export default useUserStories;
