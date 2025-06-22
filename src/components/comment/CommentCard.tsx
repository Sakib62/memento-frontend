import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { Role } from '../../constants/role';
import { useAuth } from '../../hooks/useAuth';
import { Comment } from '../../types/comment';
import formatDate from '../../utils/formatDate';

interface CommentCardProps {
  comment: Comment;
  onDelete: (commentId: string) => Promise<void>;
  retry: (comment: string, retryId: string) => Promise<void>;
  discardComment: (commentId: string) => void;
  onUpdate: (
    commentId: string,
    comment: string,
    abort?: boolean
  ) => Promise<void>;
}

const CommentCard = ({
  comment,
  onDelete,
  retry,
  discardComment,
  onUpdate,
}: CommentCardProps) => {
  const { role, username } = useAuth();
  const navigate = useNavigate();
  const canModify = role === Role.Admin || comment.authorUsername === username;

  const isPending = comment.status === 'pending' || false;
  const isError = comment.status === 'error' || false;
  const isUpdating = comment.status === 'updating' || false;
  const isUpdateError = comment.status === 'updateError' || false;
  const isDeleting = comment.status === 'deleting' || false;

  const [editedText, setEditedText] = useState(comment.comment);
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    setIsEditing(false);
    setEditedText(editedText.trim());
    onUpdate(comment.id, editedText.trim());
  };

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const TEXTAREA_MAX_HEIGHT = 200;
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height =
        Math.min(textareaRef.current.scrollHeight, TEXTAREA_MAX_HEIGHT) + 'px';
    }
  }, [isEditing]);

  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const commentRef = useRef<HTMLParagraphElement>(null);
  const COMMENT_MAX_HEIGHT = 200;
  useEffect(() => {
    if (commentRef.current && !isExpanded) {
      setIsOverflowing(commentRef.current.scrollHeight > COMMENT_MAX_HEIGHT);
    }
  }, [isExpanded, comment.comment]);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy!');
    }
  };

  return (
    <div className='mb-4'>
      <div
        className={`flex flex-col max-w-full px-4 py-2 break-words ${isEditing ? 'w-full' : 'w-max'} bg-stone-200 dark:bg-stone-500 rounded-2xl dark:text-gray-200 ${isError ? 'border-red-500 border-2' : ''}`}
      >
        <p
          className='font-serif font-semibold w-fit hover:underline hover:cursor-pointer'
          onClick={() => navigate(`/profile/${comment.authorUsername}`)}
        >
          {comment.authorName}
        </p>
        {isEditing ? (
          <>
            <textarea
              ref={textareaRef}
              id={comment.id}
              value={editedText}
              onChange={e => {
                setEditedText(e.target.value);
                e.target.style.height = 'auto';
                e.target.style.height =
                  Math.min(e.target.scrollHeight, TEXTAREA_MAX_HEIGHT) + 'px';
              }}
              onKeyDown={e => {
                if (e.key === 'Escape') {
                  setIsEditing(false);
                  setEditedText(comment.comment);
                }
              }}
              className='p-2 mt-1 overflow-y-auto rounded-md outline-none resize-none'
            />
            <div className='flex justify-end gap-4 m-2 mb-0 font-medium'>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditedText(comment.comment);
                }}
                className='text-red-500 hover:scale-105'
              >
                Cancel
              </button>
              <button
                disabled={editedText.trim() === comment.comment}
                onClick={handleSave}
                className='text-blue-600 hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50'
              >
                Save
              </button>
            </div>
          </>
        ) : (
          <div>
            <p
              ref={commentRef}
              className={`whitespace-pre-wrap overflow-hidden text-ellipsis transition-all duration-300 ${isExpanded ? 'max-h-none' : 'max-h-[200px]'}`}
            >
              {comment.comment}
            </p>
            {isOverflowing && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className='font-medium text-blue-600'
              >
                {isExpanded ? 'See less' : 'See more'}
              </button>
            )}
          </div>
        )}
      </div>
      <div className='flex gap-4 mt-1 ml-4 font-medium dark:text-gray-200'>
        {isDeleting ? (
          <p>Deleting...</p>
        ) : isPending ? (
          <p>Posting...</p>
        ) : isError ? (
          <>
            <p className='text-red-500'>Unable to post comment.</p>
            <button
              onClick={() => retry(comment.comment, comment.id)}
              className='text-blue-500 hover:scale-105'
            >
              Try again
            </button>
            <button
              onClick={() => discardComment(comment.id)}
              className='text-red-300 hover:text-red-500'
            >
              Discard
            </button>
          </>
        ) : (
          !isEditing && (
            <>
              <p className='opacity-80'>
                {formatDate(comment.createdAt)}{' '}
                {!isUpdating &&
                  !isUpdateError &&
                  comment.updatedAt !== comment.createdAt && (
                    <span className='ml-1 text-sm'>(edited)</span>
                  )}
              </p>
              <button
                aria-label='Copy comment to clipboard'
                onClick={() => copyToClipboard(comment.comment)}
                className='opacity-80 hover:opacity-100 hover:scale-105'
              >
                Copy
              </button>

              {isUpdating ? (
                <p>Updating...</p>
              ) : isUpdateError ? (
                <>
                  <p className='text-red-500'>Unable to edit comment.</p>
                  <button
                    onClick={() => onUpdate(comment.id, comment.comment)}
                    className='text-blue-500 hover:scale-105'
                  >
                    Try again
                  </button>
                  <button
                    onClick={() => {
                      setEditedText(comment.prevComment || '');
                      onUpdate(comment.id, comment.comment, true);
                    }}
                    className='text-red-300 hover:text-red-500'
                  >
                    Abort edit
                  </button>
                </>
              ) : (
                canModify && (
                  <>
                    <button
                      onClick={() => setIsEditing(true)}
                      className='opacity-80 hover:opacity-100 hover:scale-105'
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(comment.id)}
                      className='opacity-80 hover:opacity-100 hover:scale-105'
                    >
                      Delete
                    </button>
                  </>
                )
              )}
            </>
          )
        )}
      </div>
    </div>
  );
};

export default CommentCard;
