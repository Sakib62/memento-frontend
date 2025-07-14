import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../useAuth';
import useAuthPromptModal from '../useAuthPrompt';

const useLike = (storyId: string | undefined) => {
  const { token } = useAuth();
  const apiUrl = import.meta.env.VITE_API_URL;
  const { t } = useTranslation();
  const authPromptModal = useAuthPromptModal();
  const queryClient = useQueryClient();

  // 1. Fetch like count (public)
  const { data: likeCount, isLoading: isCountLoading } = useQuery<number>({
    queryKey: ['likeCount', storyId],
    queryFn: async () => {
      if (!storyId) throw new Error('no_story');
      const response = await fetch(
        `${apiUrl}/api/stories/${storyId}/likes/count`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      const result = await response.json();
      return result.data.likeCount;
    },
    enabled: !!storyId,
  });

  // 2. Fetch hasLiked (private, only if logged in)
  const { data: hasLiked, isLoading: isHasLikedLoading } = useQuery<boolean>({
    queryKey: ['hasLiked', storyId, token],
    queryFn: async () => {
      if (!storyId || !token) throw new Error('auth_required');
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
      const result = await response.json();
      return result.data.hasLiked;
    },
    enabled: !!storyId && !!token,
  });

  // 3. Like/unlike mutation (private)
  const mutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`${apiUrl}/api/stories/${storyId}/likes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Failed to toggle like');
      const result = await response.json();
      return result.data;
    },
    onSuccess: data => {
      queryClient.setQueryData(['likeCount', storyId], data.likeCount);
      queryClient.setQueryData(['hasLiked', storyId, token], data.hasLiked);
      queryClient.invalidateQueries({ queryKey: ['pagedStories'] });
    },
    onError: () => {
      toast.error(t('story.like-update-failed'));
    },
  });

  const handleLikeClick = async () => {
    if (!storyId || mutation.isPending) return;
    if (!token) {
      authPromptModal();
      return;
    }
    mutation.mutate();
  };

  return {
    hasLiked: hasLiked ?? false,
    likeCount: likeCount ?? 0,
    isLiking: mutation.isPending,
    handleLikeClick,
    isLoading: isCountLoading || isHasLikedLoading,
  };
};

export default useLike;
