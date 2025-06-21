import Swal from 'sweetalert2';
import { useAuth } from '../../hooks/useAuth';

const useDeleteComment = setComments => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const { token } = useAuth();

  const deleteComment = async (commentId: string) => {
    const result = await Swal.fire({
      title: 'Delete Comment?',
      text: 'Are you sure you want to delete this comment?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      cancelButtonText: 'No',
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
        title: 'Error!',
        text: 'Failed to delete comment.',
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
