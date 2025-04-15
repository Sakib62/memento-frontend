import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useComments } from '../hooks/useComments';
import { Story } from '../types/story';
import CommentItem from './CommentItem';

interface CommentProps {
  story: Story;
  onCommentCountChange: (count: number) => void;
  commentInputRef: React.RefObject<HTMLTextAreaElement | null>;
}

const Comment: React.FC<CommentProps> = ({
  story,
  onCommentCountChange,
  commentInputRef,
}) => {
  const { token, username, role, id, name } = useAuth();
  if (!token) {
    return <Navigate to='/login' />;
  }

  const {
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
  } = useComments({
    storyId: story.id,
    token,
    userId: id,
    username,
    name,
    onCommentCountChange,
  });

  return (
    <div className='mt-6'>
      <p className='mb-2 text-2xl font-semibold text-gray-900 dark:text-gray-100'>
        Comments ({comments?.length || 0})
      </p>

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

      <div className='space-y-2'>
        {comments.length > 0 &&
          comments.map(comment => (
            <CommentItem
              key={comment.id}
              comment={comment}
              userId={id}
              role={role}
              editingCommentId={editingCommentId}
              editedCommentText={editedCommentText}
              setEditedCommentText={setEditedCommentText}
              loading={loading}
              handleEditComment={handleEditComment}
              handleSaveComment={handleSaveComment}
              handleCancelEdit={handleCancelEdit}
              handleDeleteComment={handleDeleteComment}
            />
          ))}
      </div>
    </div>
  );
};

export default Comment;
