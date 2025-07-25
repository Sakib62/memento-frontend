import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaComment, FaHeart } from 'react-icons/fa';
import { MdDeleteOutline, MdOutlineModeEdit } from 'react-icons/md';
import { useNavigate, useParams } from 'react-router-dom';
import CommentSection from '../components/comment/CommentSection';
import SkeletonStoryView from '../components/Skeleton/SkeletonStoryView';
import ButtonWithTooltip from '../components/story/ButtonWithToolTip';
import StoryEditor, {
  StoryEditorHandle,
} from '../components/story/StoryEditor';
import { Role } from '../constants/role';
import useDeleteStory from '../hooks/story/useDeleteStory';
import { useFetchStory } from '../hooks/story/useFetchStory';
import useLike from '../hooks/story/useLike';
import { useAuth } from '../hooks/useAuth';

const StoryView = () => {
  const { username, role } = useAuth();
  const { t } = useTranslation();

  const navigate = useNavigate();
  const { id: storyId } = useParams();
  const { story, loading, error } = useFetchStory(storyId);

  const editorRef = useRef<StoryEditorHandle>(null);
  useEffect(() => {
    if (story) {
      editorRef.current?.setMarkdown(story?.description);
    }
  }, [story]);

  const { hasLiked, likeCount, isLiking, handleLikeClick } = useLike(story?.id);
  const { handleDeleteStory, isDeleting } = useDeleteStory();

  const commentInputRef = useRef<HTMLTextAreaElement>(null);
  const handleCommentButtonClick = () => {
    if (commentInputRef.current) {
      commentInputRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  };

  const [commentCount, setCommentCount] = useState(0);
  const handleCommentCount = (count: number) => {
    setCommentCount(count);
  };

  if (loading) {
    return <SkeletonStoryView />;
  }

  if (error === 'not_found') {
    return (
      <div className='pt-6 pb-6 bg-gray-100 dark:bg-neutral-800'>
        <div className='flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] max-w-5xl p-8 pt-4 mx-auto bg-white dark:bg-stone-700 rounded-lg'>
          <h1 className='mb-4 text-3xl font-bold text-gray-900 dark:text-white'>
            {t('story.not-found-title')}
          </h1>
          <p className='text-gray-600 dark:text-gray-300'>
            {t('story.not-found-message')}
          </p>
          <button
            onClick={() => navigate('/')}
            className='px-4 py-2 mt-4 text-white bg-blue-500 rounded-md hover:bg-blue-600'
          >
            {t('story.go-back-home')}
          </button>
        </div>
      </div>
    );
  }

  if (error === 'generic_error') {
    return (
      <div className='flex items-center justify-center min-h-[calc(100vh-4rem)] bg-gray-100 dark:bg-neutral-800 p-6'>
        <div className='max-w-md p-6 text-center bg-white rounded-md shadow-md dark:bg-stone-700'>
          <p className='text-lg text-gray-700 dark:text-gray-300'>
            {t('story.error-message')}
          </p>
        </div>
      </div>
    );
  }

  if (!story) {
    return null;
  }

  return (
    <div className='flex flex-col min-h-screen bg-gray-100 dark:bg-neutral-800'>
      <div className='flex flex-col flex-grow w-full min-h-[calc(100vh-4rem)] max-w-2xl p-8 mx-auto bg-white  dark:bg-stone-700'>
        {isDeleting && (
          <div className='fixed bottom-0 left-0 right-0 z-50 flex items-start justify-center pt-10 bg-white bg-opacity-50 top-16'>
            <div className='w-6 h-6 border-4 border-blue-500 rounded-full border-t-transparent animate-spin'></div>
          </div>
        )}

        <div className={isDeleting ? 'pointer-events-none opacity-50' : ''}>
          <p className='mb-4 text-3xl font-bold text-gray-900 break-words dark:text-white'>
            {story.title}
          </p>

          {story.tags.length > 0 && (
            <div className='mb-4'>
              <div className='flex flex-wrap gap-2'>
                {story.tags.map((tag: string, index: number) => (
                  <span
                    key={index}
                    className='px-4 py-2 text-sm font-semibold text-white bg-blue-500 rounded-full hover:bg-blue-600'
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className='mb-4'>
            <p
              onClick={() => navigate(`/profile/${story.authorUsername}`)}
              className='font-semibold text-gray-800 cursor-pointer w-fit dark:text-gray-200 hover:underline'
            >
              {story?.authorName}
            </p>
            <p className='text-xs text-gray-500 dark:text-gray-300'>
              {new Date(story.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </p>
          </div>

          <div className='flex items-center justify-between px-0 mb-4 text-gray-600 dark:text-gray-300'>
            <div className='flex gap-4'>
              <button
                onClick={handleLikeClick}
                disabled={isLiking}
                className='relative flex items-center gap-1 group'
              >
                <FaHeart
                  size='23'
                  className={
                    hasLiked
                      ? 'text-red-500'
                      : 'text-gray-600 dark:text-gray-300 group-hover:text-red-500'
                  }
                />{' '}
                {likeCount}
                <span className='absolute invisible px-2 py-1 text-sm text-white -translate-x-1/2 bg-black rounded-md opacity-0 dark:text-black dark:bg-white group-hover:visible group-hover:opacity-100 -top-8 left-1/2'>
                  {hasLiked ? t('story.unlike') : t('story.like')}
                </span>
              </button>

              <button
                onClick={handleCommentButtonClick}
                className='relative flex items-center gap-1 group'
              >
                <FaComment
                  size='23'
                  className='text-gray-600 dark:text-gray-300 group-hover:text-blue-500'
                />{' '}
                {commentCount}
                <span className='absolute invisible px-2 py-1 text-sm text-white -translate-x-1/2 bg-black rounded-md opacity-0 dark:text-black dark:bg-white group-hover:visible group-hover:opacity-100 -top-8 left-1/2'>
                  {t('story.comment')}
                </span>
              </button>
            </div>

            {(story.authorUsername === username || role === Role.Admin) && (
              <div className='flex gap-4'>
                <ButtonWithTooltip
                  icon={<MdOutlineModeEdit size={23} />}
                  tooltipText={t('story.edit')}
                  onClick={() => navigate(`/story/${story.id}/edit`)}
                  buttonClass='hover:scale-105 px-2 py-1 text-white bg-blue-500 rounded-md hover:bg-blue-600'
                />

                <ButtonWithTooltip
                  icon={<MdDeleteOutline size={23} />}
                  tooltipText={t('story.delete.title')}
                  onClick={() => handleDeleteStory(story.id)}
                  buttonClass='hover:scale-105 px-2 py-1 text-white bg-red-500 rounded-md hover:bg-red-600'
                />
              </div>
            )}
          </div>

          <div>
            <StoryEditor ref={editorRef} isViewMode={true} />
          </div>

          <div className='mt-8'>
            <CommentSection
              storyId={story.id}
              onCommentCountChange={handleCommentCount}
              commentInputRef={commentInputRef}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoryView;
