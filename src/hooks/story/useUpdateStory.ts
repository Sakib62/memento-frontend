import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useAuth } from '../useAuth';

type Params = {
  title: string;
  markdownContent: string | undefined;
  tags: string[];
  storyId?: string;
};

export const useUpdateStory = () => {
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;
  const { token } = useAuth();
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const updateStoryApi = async ({
    title,
    markdownContent,
    tags,
    storyId,
  }: Params) => {
    if (!storyId) throw new Error('missing_story_id');
    const updatedData = {
      title,
      description: markdownContent,
      tags,
    };
    const response = await fetch(`${apiUrl}/api/stories/${storyId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updatedData),
    });
    if (!response.ok) {
      throw new Error('failed');
    }
    return await response.json();
  };

  const mutation = useMutation({
    mutationFn: (params: Params) => updateStoryApi(params),
    onSuccess: (_data, params) => {
      Swal.fire({
        title: t('edit-story.modal-success-title'),
        text: t('edit-story.modal-success-text'),
        icon: 'success',
        timer: 1000,
        timerProgressBar: false,
        showConfirmButton: false,
        willClose: () => {
          navigate(`/story/${params.storyId}`);
          setTimeout(() => {
            queryClient.invalidateQueries({
              queryKey: ['story', params.storyId],
            });
            queryClient.invalidateQueries({
              queryKey: ['editStory', params.storyId],
            });
            queryClient.invalidateQueries({ queryKey: ['pagedStories'] });
          }, 50);
        },
      });
    },
    onError: error => {
      if (error?.message === 'failed') {
        toast.error(t('edit-story.toast-failed'));
      } else {
        toast.error(t('edit-story.toast-error'));
      }
    },
  });

  return { handleSaveUpdate: mutation.mutate, isUpdating: mutation.isPending };
};
