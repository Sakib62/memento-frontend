import { useEffect, useState } from 'react';
import { Story } from '../../types/story';

interface StoriesResult {
  stories: Story[];
  loading: boolean;
  error: string | null;
  hasNextPage: boolean;
}

export const usePagedStories = (
  currentPage: number,
  limit: number = 6,
  endpoint: string
): StoriesResult => {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [hasNextPage, setHasNextPage] = useState<boolean>(true);

  const apiUrl = import.meta.env.VITE_API_URL;

  const fetchStories = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${apiUrl}${endpoint}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch latest stories');
      }

      const data = await response.json();
      setHasNextPage(data.data.length > limit);
      setStories(data.data.slice(0, limit));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStories();
  }, [currentPage]);

  return { stories, loading, error, hasNextPage };
};
