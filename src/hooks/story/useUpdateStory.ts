import { useState } from 'react';
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

  const [isUpdating, setIsUpdating] = useState(false);

  const handleSaveUpdate = async ({
    title,
    markdownContent,
    tags,
    storyId,
  }: Params) => {
    if (!storyId) return;

    const updatedData = {
      title,
      description: markdownContent,
      tags,
    };

    try {
      setIsUpdating(true);

      const response = await fetch(`${apiUrl}/api/stories/${storyId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData),
      });

      if (response.ok) {
        Swal.fire({
          title: t('edit-story.modal-success-title'),
          text: t('edit-story.modal-success-text'),
          icon: 'success',
          timer: 1000,
          timerProgressBar: false,
          showConfirmButton: false,
          willClose: () => {
            navigate(`/story/${storyId}`);
          },
        });
      } else {
        toast.error(t('edit-story.toast-failed'));
      }
    } catch (error) {
      toast.error(t('edit-story.toast-error'));
    } finally {
      setIsUpdating(false);
    }
  };

  return { handleSaveUpdate, isUpdating };
};
