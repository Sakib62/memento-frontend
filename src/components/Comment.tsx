import { useContext, useEffect, useState } from 'react';
import { MdDeleteOutline, MdOutlineEdit } from 'react-icons/md';
import { Navigate, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { AuthContext } from '../context/AuthContext';
import { showToast } from '../utils/toast';
import ButtonWithTooltip from './ButtonWithToolTip';

interface CommentProps {
  story: any;
  onCommentCountChange: (count: number) => void;
  commentInputRef: React.RefObject<HTMLTextAreaElement | null>;
}

const Comment: React.FC<CommentProps> = ({
  story,
  onCommentCountChange,
  commentInputRef,
}) => {
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);
  if (!authContext?.token) {
    return <Navigate to='/login' />;
  }
  const { username, role, token, id, name } = authContext;

  interface CommentDTO {
    id: string;
    userId: string;
    comment: string;
    createdAt: Date;
    updatedAt: Date;
    authorName: string;
    authorUsername: string;
  }

  const [comments, setComments] = useState<CommentDTO[]>([]);

  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchComments = async () => {
      if (!story.id) return;

      try {
        const response = await fetch(
          `${apiUrl}/api/stories/${story.id}/comments`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error('Failed to fetch comments');
        }
        const data = await response.json();
        setComments(data.data);
        onCommentCountChange(data.data.length);
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };
    fetchComments();
  }, [story.id, token, onCommentCountChange]);

  const [comment, setComment] = useState('');

  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editedCommentText, setEditedCommentText] = useState<string>('');
  const [loading, setLoading] = useState(false);

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
      showToast('Failed to update comment.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditedCommentText('');
  };

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
      setComments(prev => prev.filter(c => c.id !== commentId));
      onCommentCountChange(comments.length);

      try {
        const response = await fetch(`${apiUrl}/api/comments/${commentId}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error('Failed to delete comment');

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

  const handleCreateComment = async () => {
    if (!comment.trim() || loading) return;
    setLoading(true);

    const tempComment = {
      id: Date.now().toString(),
      userId: id as string,
      comment,
      createdAt: new Date(),
      updatedAt: new Date(),
      authorName: name as string,
      authorUsername: username as string,
    };

    setComments(prev => [tempComment, ...prev]);
    setComment('');

    try {
      const response = await fetch(
        `${apiUrl}/api/stories/${story.id}/comments`,
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
      onCommentCountChange(data.data.length);
    } catch (error) {
      console.error('Error posting comment:', error);
      setComments(prev => prev.filter(c => c.id !== tempComment.id));
      onCommentCountChange(comments.length - 1);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='mt-6'>
      <p className='mb-2 text-2xl font-semibold text-gray-900 dark:text-gray-100'>
        Comments ({comments?.length || 0})
      </p>

      {/* Comment Input Form */}
      <div className='mt-2'>
        <textarea
          ref={commentInputRef}
          className='w-full p-3 text-gray-800 border border-gray-300 rounded-lg resize-none dark:border-gray-400 dark:bg-gray-500 dark:text-gray-200 focus:outline-none'
          placeholder='Write a comment...'
          value={comment}
          onChange={e => setComment(e.target.value)}
        ></textarea>
        <div className='flex justify-end gap-4 mt-2 mb-4'>
          <button
            className={`px-2 py-1 font-medium text-gray-700 bg-gray-300 rounded-md dark:text-gray-200 dark:bg-stone-600 hover:bg-gray-400 dark:hover:bg-stone-700 ${
              (!comment.trim() || loading) && 'opacity-50'
            }`}
            onClick={() => setComment('')}
            disabled={!comment.trim() || loading}
          >
            Cancel
          </button>
          <button
            className={`font-medium px-2 py-1 text-white bg-blue-600 rounded-md hover:bg-blue-800 ${
              (!comment.trim() || loading) && 'opacity-50 cursor-not-allowed'
            }`}
            onClick={handleCreateComment}
            disabled={!comment.trim() || loading}
          >
            {loading ? 'Posting...' : 'Comment'}
          </button>
        </div>
      </div>

      {/* Comments List */}
      <div className='space-y-2'>
        {comments.length > 0 &&
          comments.map(comment => (
            <div
              key={comment.id}
              className='p-4 pl-0 border-b border-gray-400 dark:border-gray-600'
            >
              <div className='flex items-start justify-between'>
                <div className='flex items-start'>
                  <div className='flex flex-col'>
                    <p
                      onClick={() =>
                        navigate(`/profile/${comment.authorUsername}`)
                      }
                      className='text-sm font-semibold text-gray-800 cursor-pointer dark:text-gray-200 hover:underline'
                    >
                      {comment.authorName}
                    </p>
                    <p className='text-xs text-gray-500 dark:text-gray-300'>
                      {new Date(comment.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                </div>

                {(role === 1 || comment.userId === id) && (
                  <div className='flex gap-2'>
                    <ButtonWithTooltip
                      icon={<MdOutlineEdit size={16} />}
                      tooltipText='Edit'
                      onClick={() =>
                        handleEditComment(comment.id, comment.comment)
                      }
                      buttonClass='hover:scale-105 px-2 py-1 text-white bg-blue-500 rounded-md hover:bg-blue-600'
                    />

                    <ButtonWithTooltip
                      icon={<MdDeleteOutline size={16} />}
                      tooltipText='Delete'
                      onClick={() => handleDeleteComment(comment.id)}
                      buttonClass='hover:scale-105 px-2 py-1 text-white bg-red-500 rounded-md hover:bg-red-600'
                    />
                  </div>
                )}
              </div>

              {editingCommentId === comment.id ? (
                <div className='mt-2'>
                  <textarea
                    className='w-full p-3 text-gray-800 border border-gray-300 rounded-lg resize-none dark:border-gray-400 dark:bg-gray-500 dark:text-gray-200 focus:outline-none'
                    value={editedCommentText}
                    onChange={e => setEditedCommentText(e.target.value)}
                  />
                  <div className='flex justify-end gap-4 mt-2'>
                    <button
                      onClick={handleCancelEdit}
                      className='px-2 py-1 text-gray-700 bg-gray-200 rounded-md dark:text-gray-200 dark:bg-gray-600 hover:bg-gray-300'
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleSaveComment(comment.id)}
                      className={`px-2 py-1 text-white bg-blue-600 rounded-md hover:bg-blue-700 ${
                        !editedCommentText.trim() ||
                        loading ||
                        editedCommentText.trim() == comment.comment.trim()
                          ? 'opacity-50 cursor-not-allowed'
                          : ''
                      }`}
                      disabled={
                        !editedCommentText.trim() ||
                        loading ||
                        editedCommentText.trim() == comment.comment.trim()
                      }
                    >
                      {loading ? 'Saving...' : 'Save'}
                    </button>
                  </div>
                </div>
              ) : (
                <p className='mt-2 font-normal text-gray-800 text-m dark:text-gray-300'>
                  {comment.comment}
                </p>
              )}
            </div>
          ))}
      </div>
    </div>
  );
};

export default Comment;
