import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useAuth } from '../useAuth';

const useDeleteStory = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const { t } = useTranslation();
  const apiUrl = import.meta.env.VITE_API_URL;
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (storyId: string) => {
      const response = await fetch(`${apiUrl}/api/stories/${storyId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Failed to delete story');
      return true;
    },
    onSuccess: (_data, storyId) => {
      const fromHistory =
        document.referrer &&
        new URL(document.referrer).origin === window.location.origin;

      if (fromHistory) {
        navigate(-1);
      } else {
        navigate('/');
      }
      Swal.fire({
        title: t('story.delete.modal-success-title'),
        text: t('story.delete.modal-success-text'),
        icon: 'success',
        timer: 1500,
        timerProgressBar: false,
        showConfirmButton: false,
      });

      queryClient.invalidateQueries({ queryKey: ['pagedStories'] });
      queryClient.removeQueries({ queryKey: ['story', storyId] });
      queryClient.removeQueries({ queryKey: ['editStory', storyId] });
      queryClient.removeQueries({ queryKey: ['likeCount', storyId] });
      queryClient.removeQueries({ queryKey: ['hasLiked', storyId, token] });
    },
    onError: () => {
      toast.error(t('story.delete.modal-error-toast'));
    },
  });

  const handleDeleteStory = async (storyId: string) => {
    const result = await Swal.fire({
      title: t('story.delete.modal-title'),
      text: t('story.delete.modal-text'),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: t('story.delete.modal-confirm'),
      cancelButtonText: t('story.delete.modal-cancel'),
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      mutation.mutate(storyId);
    }
  };

  return { handleDeleteStory, isDeleting: mutation.isPending };
};

export default useDeleteStory;
