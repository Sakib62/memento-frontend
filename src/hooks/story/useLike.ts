import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../useAuth';
import useAuthPromptModal from '../useAuthPrompt';

const useLike = (storyId: string | undefined) => {
  const [hasLiked, sethasLiked] = useState<boolean>(false);
  const [likeCount, setlikeCount] = useState<number>(0);
  const [isLiking, setIsLiking] = useState<boolean>(false);

  const { token } = useAuth();
  const apiUrl = import.meta.env.VITE_API_URL;
  const { t } = useTranslation();

  const authPromptModal = useAuthPromptModal();

  const getLikeStatus = async () => {
    try {
      const response = await fetch(
        `${apiUrl}/api/stories/${storyId}/likes/count`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      const data = await response.json();
      setlikeCount(data.data.likeCount);
    } catch (error) {
      console.error('Error fetching like count:', error);
    }

    if (!token) return;

    try {
      const response = await fetch(
        `${apiUrl}/api/stories/${storyId}/likes/hasLiked`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
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
    if (!token) {
      authPromptModal();
      return;
    }
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
      toast.error(t('story.like-update-failed'));
    } finally {
      setIsLiking(false);
    }
  };

  return { hasLiked, likeCount, isLiking, handleLikeClick };
};

export default useLike;
