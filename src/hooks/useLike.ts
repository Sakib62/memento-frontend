import { useEffect, useState } from 'react';
import { useAuth } from './useAuth';

const useLike = (storyId: string | undefined) => {
  const [hasLiked, sethasLiked] = useState<boolean>(false);
  const [likeCount, setlikeCount] = useState<number>(0);
  const [isLiking, setIsLiking] = useState<boolean>(false);

  const { token } = useAuth();
  const apiUrl = import.meta.env.VITE_API_URL;

  const getLikeStatus = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/stories/${storyId}/likes`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setlikeCount(data.data.likeCount);
      sethasLiked(data.data.hasLiked);
    } catch (error) {
      console.error('Error fetching like data:', error);
    }
  };

  useEffect(() => {
    if (!storyId) return;
    getLikeStatus();
  }, [storyId, token, apiUrl]);

  const handleLikeClick = async () => {
    if (!storyId || isLiking) return;
    setIsLiking(true);
    try {
      const response = await fetch(`${apiUrl}/api/stories/${storyId}/likes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to toggle like');
      }
      const data = await response.json();
      setlikeCount(data.data.likeCount);
      sethasLiked(data.data.hasLiked);
    } catch (error) {
      console.error('Error toggling like:', error);
    } finally {
      setIsLiking(false);
    }
  };

  return { hasLiked, likeCount, isLiking, handleLikeClick };
};

export default useLike;
