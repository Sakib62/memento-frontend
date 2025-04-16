import { MdDeleteOutline, MdOutlineEdit } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import ButtonWithTooltip from './ButtonWithToolTip';
import { Role } from '../constants/role';

interface CommentDTO {
  id: string;
  userId: string | null;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
  authorName: string | null;
  authorUsername: string | null;
}

interface CommentItemProps {
  comment: CommentDTO;
  userId: string | null;
  role: number | null;
  editingCommentId: string | null;
  editedCommentText: string;
  setEditedCommentText: (text: string) => void;
  loading: boolean;
  handleEditComment: (commentId: string, commentText: string) => void;
  handleSaveComment: (commentId: string) => void;
  handleCancelEdit: () => void;
  handleDeleteComment: (commentId: string) => void;
}

const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  userId,
  role,
  editingCommentId,
  editedCommentText,
  setEditedCommentText,
  loading,
  handleEditComment,
  handleSaveComment,
  handleCancelEdit,
  handleDeleteComment,
}) => {
  const navigate = useNavigate();

  return (
    <div
      key={comment.id}
      className='p-4 pl-0 border-b border-gray-400 dark:border-gray-600'
    >
      <div className='flex items-start justify-between'>
        <div className='flex items-start'>
          <div className='flex flex-col'>
            <p
              onClick={() => navigate(`/profile/${comment.authorUsername}`)}
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

        {(role === Role.Admin || comment.userId === userId) && (
          <div className='flex gap-2'>
            <ButtonWithTooltip
              icon={<MdOutlineEdit size={16} />}
              tooltipText='Edit'
              onClick={() => handleEditComment(comment.id, comment.comment)}
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
                editedCommentText.trim() === comment.comment.trim()
                  ? 'opacity-50 cursor-not-allowed'
                  : ''
              }`}
              disabled={
                !editedCommentText.trim() ||
                loading ||
                editedCommentText.trim() === comment.comment.trim()
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
  );
};

export default CommentItem;
