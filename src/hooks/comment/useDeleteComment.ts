import { useTranslation } from 'react-i18next';
import Swal from 'sweetalert2';
import { useAuth } from '../../hooks/useAuth';
import { SetComments } from '../../types/comment';

const useDeleteComment = (setComments: SetComments) => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const { token } = useAuth();
  const { t } = useTranslation();

  const deleteComment = async (commentId: string): Promise<void> => {
    const result = await Swal.fire({
      title: t('comments.delete.modal-title'),
      text: t('comments.delete.modal-text'),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: t('comments.delete.modal-confirm'),
      cancelButtonText: t('comments.delete.modal-cancel'),
      reverseButtons: true,
    });

    if (result.isDismissed) {
      return;
    }

    setComments(prev =>
      prev.map(c => (c.id === commentId ? { ...c, status: 'deleting' } : c))
    );

    try {
      const response = await fetch(`${apiUrl}/api/comments/${commentId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete comment');
      }

      setComments(prev => prev.filter(c => c.id !== commentId));
    } catch (error) {
      setComments(prev =>
        prev.map(c => {
          if (c.id === commentId) {
            const { status, ...rest } = c;
            return rest;
          }
          return c;
        })
      );

      Swal.fire({
        title: t('comments.delete.modal-error-title'),
        text: t('comments.delete.modal-error-text'),
        icon: 'error',
        timer: 2000,
        timerProgressBar: false,
        showConfirmButton: false,
      });
    }
  };

  return deleteComment;
};

export default useDeleteComment;
