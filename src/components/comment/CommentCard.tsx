import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
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
      toast.success(t('comments.item.copy-success'));
    } catch (error) {
      toast.error(t('comments.item.copy-error'));
      console.error(error);
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
                {t('comments.edit.cancel')}
              </button>
              <button
                disabled={editedText.trim() === comment.comment}
                onClick={handleSave}
                className='text-blue-600 hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50'
              >
                {t('comments.edit.save')}
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
                {isExpanded
                  ? t('comments.item.see-less')
                  : t('comments.item.see-more')}
              </button>
            )}
          </div>
        )}
      </div>
      <div className='flex gap-4 mt-1 ml-4 font-medium dark:text-gray-200'>
        {isDeleting ? (
          <p>{t('comments.item.deleting')}.</p>
        ) : isPending ? (
          <p>{t('comments.item.posting')}</p>
        ) : isError ? (
          <>
            <p className='text-red-500'>{t('comments.item.post-unable')}</p>
            <button
              onClick={() => retry(comment.comment, comment.id)}
              className='text-blue-500 hover:scale-105'
            >
              {t('comments.item.post-retry')}
            </button>
            <button
              onClick={() => discardComment(comment.id)}
              className='text-red-300 hover:text-red-500'
            >
              {t('comments.item.post-discard')}
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
                    <span className='ml-1 text-sm'>
                      ({t('comments.item.edited')})
                    </span>
                  )}
              </p>
              <button
                aria-label='Copy comment to clipboard'
                onClick={() => copyToClipboard(comment.comment)}
                className='opacity-80 hover:opacity-100 hover:scale-105'
              >
                {t('comments.item.copy')}
              </button>

              {isUpdating ? (
                <p>{t('comments.item.updating')}.</p>
              ) : isUpdateError ? (
                <>
                  <p className='text-red-500'>
                    {t('comments.item.edit-unable')}
                  </p>
                  <button
                    onClick={() => onUpdate(comment.id, comment.comment)}
                    className='text-blue-500 hover:scale-105'
                  >
                    {t('comments.item.edit-retry')}
                  </button>
                  <button
                    onClick={() => {
                      setEditedText(comment.prevComment || '');
                      onUpdate(comment.id, comment.comment, true);
                    }}
                    className='text-red-300 hover:text-red-500'
                  >
                    {t('comments.item.edit-abort')}
                  </button>
                </>
              ) : (
                canModify && (
                  <>
                    <button
                      onClick={() => setIsEditing(true)}
                      className='opacity-80 hover:opacity-100 hover:scale-105'
                    >
                      {t('comments.item.edit')}
                    </button>
                    <button
                      onClick={() => onDelete(comment.id)}
                      className='opacity-80 hover:opacity-100 hover:scale-105'
                    >
                      {t('comments.item.delete')}
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
