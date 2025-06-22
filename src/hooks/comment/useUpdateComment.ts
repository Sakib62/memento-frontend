import Swal from 'sweetalert2';
import { useAuth } from '../../hooks/useAuth';
import { SetComments } from '../../types/comment';

const useUpdateComment = (setComments: SetComments) => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const { token } = useAuth();

  const updatedComment = async (
    commentId: string,
    comment: string,
    abort?: boolean
  ): Promise<void> => {
    if (abort) {
      setComments(prev =>
        prev.map(c => {
          if (c.id === commentId) {
            const { status, prevUpdatedAt, prevComment, ...rest } = c;
            return {
              ...rest,
              comment: prevComment || '',
              updatedAt: prevUpdatedAt || '',
            };
          }
          return c;
        })
      );

      return;
    }

    setComments(prev =>
      prev.map(c => {
        if (c.id === commentId) {
          if (c.status === 'updateError') {
            return {
              ...c,
              updatedAt: new Date().toISOString(),
              status: 'updating',
            };
          }
          return {
            ...c,
            prevUpdatedAt: c.updatedAt,
            prevComment: c.comment,
            status: 'updating',
            comment,
            updatedAt: new Date().toISOString(),
          };
        }
        return c;
      })
    );

    try {
      const response = await fetch(`${apiUrl}/api/comments/${commentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ comment }),
      });

      if (!response.ok) {
        throw new Error('Failed to edit comment');
      }

      const data = await response.json();
      setComments(prev =>
        prev.map(c => {
          if (c.id === commentId) {
            const { status, prevUpdatedAt, prevComment, ...rest } = c;
            return { ...rest, ...data.data };
          }
          return c;
        })
      );
    } catch (error) {
      setComments(prev =>
        prev.map(c =>
          c.id === commentId ? { ...c, status: 'updateError' } : c
        )
      );
      Swal.fire({
        title: 'Error!',
        text: 'Failed to update comment.',
        icon: 'error',
        timer: 2000,
        timerProgressBar: false,
        showConfirmButton: false,
      });
    }
  };

  return updatedComment;
};

export default useUpdateComment;
