import { useState } from 'react';
import Swal from 'sweetalert2';
import { useDeleteComment } from './useDeleteComment';
import { useFetchComments } from './useFetchComments';

interface UseCommentsProps {
  storyId: string;
  token: string;
  userId: string | null;
  username: string | null;
  name: string | null;
  onCommentCountChange: (count: number) => void;
}

export const useComments = ({
  storyId,
  token,
  userId,
  username,
  name,
  onCommentCountChange,
}: UseCommentsProps) => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [comment, setComment] = useState('');
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editedCommentText, setEditedCommentText] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const {
    comments,
    setComments,
    loading: fetchLoading,
  } = useFetchComments({
    storyId,
    token,
    onCommentCountChange,
  });

  const handleCreateComment = async () => {
    if (!comment.trim() || loading) return;
    setLoading(true);

    const tempComment = {
      id: Date.now().toString(),
      userId,
      comment,
      createdAt: new Date(),
      updatedAt: new Date(),
      authorName: name,
      authorUsername: username,
    };

    setComments(prev => [tempComment, ...prev]);
    setComment('');

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
        prev.map(c => (c.id === tempComment.id ? { ...c, ...data.data } : c))
      );
      onCommentCountChange(comments.length + 1);
    } catch (error) {
      console.error('Error posting comment:', error);
      setComments(prev => prev.filter(c => c.id !== tempComment.id));
      onCommentCountChange(comments.length - 1);
    } finally {
      setLoading(false);
    }
  };

  const handleEditComment = (commentId: string, commentText: string) => {
    setEditingCommentId(commentId);
    setEditedCommentText(commentText);
  };

  const handleSaveComment = async (commentId: string) => {
    if (!editedCommentText.trim() || loading) return;
    const prevComments = [...comments];

    setComments(prevComments =>
      prevComments.map(comment =>
        comment.id === commentId
          ? { ...comment, comment: editedCommentText, updatedAt: new Date() }
          : comment
      )
    );

    try {
      setLoading(true);
      const response = await fetch(`${apiUrl}/api/comments/${commentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ comment: editedCommentText }),
      });

      if (!response.ok) throw new Error('Failed to update comment');

      const data = await response.json();

      setComments(prevComments =>
        prevComments.map(comment =>
          comment.id === commentId
            ? {
                ...comment,
                comment: data.data.comment,
                updatedAt: data.data.updatedAt,
              }
            : comment
        )
      );

      setEditingCommentId(null);
      setEditedCommentText('');
    } catch (error) {
      console.error('Error saving comment:', error);
      setComments(prevComments);
      Swal.fire('Error!', 'Failed to update comment.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditedCommentText('');
  };

  const { handleDeleteComment } = useDeleteComment({
    comments,
    setComments,
    onCommentCountChange,
    token,
  });

  return {
    comments,
    comment,
    setComment,
    editingCommentId,
    editedCommentText,
    setEditedCommentText,
    loading,
    handleCreateComment,
    handleEditComment,
    handleSaveComment,
    handleCancelEdit,
    handleDeleteComment,
  };
};
