import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useAuth } from '../useAuth';

export const useCreateStory = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const apiUrl = import.meta.env.VITE_API_URL;
  const queryClient = useQueryClient();

  const postStory = async (storyData: {
    title: string;
    description: string;
    tags: string[];
  }) => {
    const response = await fetch(`${apiUrl}/api/stories`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(storyData),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'failed');
    }
    return data.data;
  };

  const mutation = useMutation({
    mutationFn: (storyData: {
      title: string;
      description: string;
      tags: string[];
    }) => postStory(storyData),
    onSuccess: story => {
      queryClient.invalidateQueries({ queryKey: ['pagedStories'] });
      Swal.fire({
        title: t('create-story.modal-success-title'),
        text: t('create-story.modal-success-text'),
        icon: 'success',
        timer: 1000,
        timerProgressBar: false,
        showConfirmButton: false,
        willClose: () => {
          navigate(`/story/${story.id}`, { state: story });
        },
      });
    },
    onError: error => {
      toast.error(
        error?.message === 'failed'
          ? t('create-story.toast-failed')
          : error?.message || t('create-story.toast-error'),
        { position: 'top-center' }
      );
    },
  });

  const createStory = async (
    title: string,
    markdownContent: string | undefined,
    tags: string[]
  ) => {
    if (!title.trim()) {
      toast.error(t('create-story.no-empty-title'), {
        position: 'top-center',
      });
      return;
    }
    if (!markdownContent?.trim()) {
      toast.error(t('create-story.no-empty-description'), {
        position: 'top-center',
      });
      return;
    }
    mutation.mutate({ title, description: markdownContent, tags });
  };

  return { createStory, loading: mutation.isPending };
};
