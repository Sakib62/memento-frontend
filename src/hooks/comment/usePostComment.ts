import { useTranslation } from 'react-i18next';
import Swal from 'sweetalert2';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from '../../hooks/useAuth';
import { SetComments } from '../../types/comment';

const usePostComment = (storyId: string, setComments: SetComments) => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const { token, id, name, username } = useAuth();
  const { t } = useTranslation();

  const postComment = async (
    comment: string,
    retryId?: string
  ): Promise<void> => {
    const tempComment = {
      id: uuidv4(),
      userId: id,
      comment,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      authorName: name,
      authorUsername: username,
      status: 'pending',
    };

    if (retryId) {
      setComments(prev =>
        prev.map(c =>
          c.id === retryId
            ? {
                ...c,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                status: 'pending',
              }
            : c
        )
      );
    } else {
      setComments(prev => [tempComment, ...prev]);
    }

    const commentId = retryId ? retryId : tempComment.id;

    try {
      const response = await fetch(
        `${apiUrl}/api/stories/${storyId}/comments`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ comment }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to post comment');
      }

      const data = await response.json();
      setComments(prev =>
        prev.map(c => {
          if (c.id === commentId) {
            const { status, ...rest } = c;
            return { ...rest, ...data.data };
          }
          return c;
        })
      );
    } catch (error) {
      setComments(prev =>
        prev.map(c => (c.id === commentId ? { ...c, status: 'error' } : c))
      );
      Swal.fire({
        title: t('comments.post.modal-title'),
        text: t('comments.post.modal-text'),
        icon: 'error',
        timer: 2000,
        timerProgressBar: false,
        showConfirmButton: false,
      });
    }
  };

  return postComment;
};

export default usePostComment;
