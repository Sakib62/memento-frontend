import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../hooks/useAuth';
import useAuthPromptModal from '../../hooks/useAuthPrompt';

interface CommentFormProps {
  commentCount: number;
  onCreate: (comment: string) => Promise<void>;
  commentInputRef: React.RefObject<HTMLTextAreaElement | null>;
}

const CommentForm = ({
  commentCount,
  onCreate,
  commentInputRef,
}: CommentFormProps) => {
  const [comment, setComment] = useState<string>('');

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const TEXTAREA_MAX_HEIGHT = 200;

  const resetTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const { token } = useAuth();
  const { t } = useTranslation();
  const authPromptModal = useAuthPromptModal();

  return (
    <div>
      <p className='mb-4 text-2xl font-semibold'>
        {t('comments.heading')} ({commentCount})
      </p>
      <div
        onClick={() => {
          if (!token) authPromptModal();
        }}
      >
        <textarea
          ref={element => {
            textareaRef.current = element;
            commentInputRef.current = element;
          }}
          placeholder={t('comments.post.placeholder')}
          id='comment-input'
          value={comment}
          readOnly={!token}
          onChange={e => {
            setComment(e.target.value);
            e.target.style.height = 'auto';
            e.target.style.height =
              Math.min(e.target.scrollHeight, TEXTAREA_MAX_HEIGHT) + 'px';
          }}
          className='w-full p-2 mb-2 rounded-md outline-none resize-none bg-stone-200 placeholder:text-stone-400 placeholder:p-0 placeholder:font-medium'
        />
      </div>

      <div className='flex justify-end gap-4'>
        <button
          disabled={!comment.trim()}
          onClick={() => {
            setComment('');
            resetTextareaHeight();
          }}
          className='px-2 py-1 font-semibold rounded-md disabled:opacity-50 disabled:cursor-not-allowed bg-stone-300 hover:bg-stone-400'
        >
          {t('comments.post.cancel')}
        </button>
        <button
          disabled={!comment.trim()}
          onClick={() => {
            onCreate(comment.trim());
            setComment('');
            resetTextareaHeight();
          }}
          className='px-2 py-1 font-semibold bg-blue-500 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600'
        >
          {t('comments.post.post')}
        </button>
      </div>
    </div>
  );
};

export default CommentForm;
