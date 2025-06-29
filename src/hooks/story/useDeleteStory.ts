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
      try {
        const response = await fetch(`${apiUrl}/api/stories/${storyId}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error('Failed to delete story');

        navigate(`/`);
        Swal.fire({
          title: t('story.delete.modal-success-title'),
          text: t('story.delete.modal-success-text'),
          icon: 'success',
          timer: 1500,
          timerProgressBar: false,
          showConfirmButton: false,
        });
      } catch (error) {
        toast.error(t('story.delete.modal-error-toast'));
      }
    }
  };

  return handleDeleteStory;
};

export default useDeleteStory;
