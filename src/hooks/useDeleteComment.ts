import Swal from 'sweetalert2';
import { commentService } from '../services/commentService';
import { Comment } from '../types/comment';

interface UseDeleteCommentProps {
  comments: Comment[];
  setComments: React.Dispatch<React.SetStateAction<Comment[]>>;
  onCommentCountChange: (count: number) => void;
  token: string;
}

export const useDeleteComment = ({
  comments,
  setComments,
  onCommentCountChange,
  token,
}: UseDeleteCommentProps) => {
  const handleDeleteComment = async (commentId: string) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to delete this comment?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      const previousComments = [...comments];
      const updatedComments = comments.filter(c => c.id !== commentId);
      const newCommentCount = updatedComments.length;

      setComments(updatedComments);
      onCommentCountChange(newCommentCount);

      try {
        await commentService.deleteComment(commentId, token);
        Swal.fire('Deleted!', 'Your comment has been deleted.', 'success');
      } catch (error) {
        console.error('Error deleting comment:', error);
        setComments(previousComments);
        onCommentCountChange(previousComments.length);
        Swal.fire(
          'Error!',
          'There was a problem deleting the comment.',
          'error'
        );
      }
    } else {
      console.log('Comment deletion canceled');
    }
  };

  return { handleDeleteComment };
};
