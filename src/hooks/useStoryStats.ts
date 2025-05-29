import { useEffect, useState } from 'react';
import { useAuth } from './useAuth';

interface StoryStats {
  likeCount: number;
  isLiked: boolean;
  commentCount: number;
  loading: boolean;
  error: string | null;
}

export const useStoryStats = (storyId: string): StoryStats => {
  const { token } = useAuth();

  const [likeCount, setLikeCount] = useState<number>(0);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [commentCount, setCommentCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const apiUrl = import.meta.env.VITE_API_URL;

  const fetchLikeData = async () => {
    try {
      const response = await fetch(
        `${apiUrl}/api/stories/${storyId}/likeStatus`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error('Failed to fetch like data');
      }
      const data = await response.json();
      setLikeCount(data.data.likeCount);
      setIsLiked(data.data.hasLiked);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const fetchCommentCount = async () => {
    try {
      const response = await fetch(
        `${apiUrl}/api/stories/${storyId}/commentCount`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error('Failed to fetch comment count');
      }
      const data = await response.json();
      setCommentCount(data.data.commentCount);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      await Promise.all([fetchLikeData(), fetchCommentCount()]);
      setLoading(false);
    };
    fetchData();
  }, [storyId, token]);

  return { likeCount, isLiked, commentCount, loading, error };
};
