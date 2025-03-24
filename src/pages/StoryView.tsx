import { useContext, useEffect, useRef, useState } from 'react';
import { FaComment, FaHeart } from 'react-icons/fa';
import { MdDeleteOutline, MdOutlineModeEdit } from 'react-icons/md';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import ButtonWithTooltip from '../components/ButtonWithToolTip';
import Comment from '../components/Comment';
import MarkdownRenderer from '../components/MarkdownRenderer';
import { AuthContext } from '../context/AuthContext';

const StoryView = () => {
  const authContext = useContext(AuthContext);
  if (!authContext?.token) {
    return <Navigate to='/login' />;
  }

  const { username, role, token } = authContext;

  const navigate = useNavigate();

  // const location = useLocation();
  // const initialStory = location.state || null;
  const { id: storyId } = useParams();

  interface Story {
    id: string;
    title: string;
    description: string;
    authorUsername: string;
    authorName: string;
    createdAt: Date;
    tags: string[];
  }

  const [story, setStory] = useState<Story>({
    id: '',
    title: 'Loading...',
    description: '',
    authorUsername: '',
    authorName: '',
    createdAt: new Date(),
    tags: [],
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchStory = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/stories/${storyId}`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          navigate('/not-found');
          return;
        }
        const data = await response.json();
        setStory(data.data);
      } catch (error) {
        navigate('/not-found');
      } finally {
        setLoading(false);
      }
    };

    fetchStory();
  }, [storyId, token, navigate]);

  const handleDeleteStory = async (storyId: string) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to delete this story?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(
          `http://localhost:3000/api/stories/${storyId}`,
          {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!response.ok) throw new Error('Failed to delete story');

        Swal.fire('Deleted!', 'Your story has been deleted.', 'success');
        navigate('/');
      } catch (error) {
        console.error('Error deleting story:', error);
        Swal.fire('Error!', 'There was a problem deleting the story.', 'error');
      }
    } else {
      console.log('Story deletion canceled');
    }
  };

  const commentInputRef = useRef<HTMLTextAreaElement>(null);
  const handleCommentButtonClick = () => {
    if (commentInputRef.current) {
      //commentInputRef.current.focus();
      commentInputRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  };

  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [totalLike, setTotalLike] = useState<number>(0);
  const [isLiking, setIsLiking] = useState<boolean>(false);

  useEffect(() => {
    const fetchLikeData = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/stories/${storyId}/likeStatus`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        setTotalLike(data.data?.likeCount);
        setIsLiked(data.data?.likedByUser);
      } catch (error) {
        console.error('Error fetching like data:', error);
      }
    };

    fetchLikeData();
  }, [storyId]);

  const handleLikeClick = async () => {
    if (isLiking) return;

    setIsLiking(true);
    setIsLiked(prevStatus => !prevStatus);

    try {
      const response = await fetch(
        `http://localhost:3000/api/stories/${story.id}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to toggle like');
      }
      const data = await response.json();
      setTotalLike(data.data.likeCount);
    } catch (error) {
      console.error('Error toggling like:', error);
      setIsLiked(prevStatus => !prevStatus);
    } finally {
      setIsLiking(false);
    }
  };

  const [commentCount, setCommentCount] = useState(0);
  const handleCommentCount = (count: number) => {
    setCommentCount(count);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className='bg-gray-100 dark:bg-stone-600'>
      <div className='flex flex-col flex-grow min-h-[calc(100vh-4rem)] max-w-3xl p-8 pt-4 mx-auto bg-white dark:bg-neutral-500'>
        <div className='flex items-center gap-4 p-2 pt-4 pl-0 mb-4 rounded-lg '>
          <div>
            <p
              onClick={() => navigate(`/profile/${story.authorUsername}`)}
              className='text-xl font-semibold text-gray-800 cursor-pointer dark:text-gray-200 hover:underline'
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
        </div>

        {/* Interaction Buttons */}
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
                  isLiked
                    ? 'text-red-500'
                    : 'text-gray-600 dark:text-gray-300 group-hover:text-red-500'
                }
              />{' '}
              {totalLike}
              <span className='absolute invisible px-2 py-1 text-sm text-white -translate-x-1/2 bg-black rounded-md opacity-0 dark:text-black dark:bg-white group-hover:visible group-hover:opacity-100 -top-8 left-1/2'>
                {isLiked ? 'Unlike' : 'Like'}
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
                Comment
              </span>
            </button>
          </div>

          {(story.authorUsername == username || role == 1) && (
            <div className='flex gap-4'>
              <ButtonWithTooltip
                icon={<MdOutlineModeEdit size={23} />}
                tooltipText='Edit'
                onClick={() =>
                  navigate(`/story/${story.id}/edit`, { state: story })
                }
                buttonClass='hover:scale-105 px-2 py-1 text-white bg-blue-500 rounded-md hover:bg-blue-600'
              />

              <ButtonWithTooltip
                icon={<MdDeleteOutline size={23} />}
                tooltipText='Delete'
                onClick={() => handleDeleteStory(story.id)}
                buttonClass='hover:scale-105 px-2 py-1 text-white bg-red-500 rounded-md hover:bg-red-600'
              />
            </div>
          )}
        </div>

        <h1 className='mb-4 text-3xl font-bold text-gray-900 dark:text-gray-100'>
          {story.title}
        </h1>
        <div className='text-lg leading-relaxed text-gray-700 dark:text-gray-300'>
          <MarkdownRenderer content={story?.description} />
        </div>

        {story.tags.length > 0 && (
          <div className='mt-6'>
            <div className='flex flex-wrap gap-2 mt-2'>
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

        <Comment
          story={story}
          onCommentCountChange={handleCommentCount}
          commentInputRef={commentInputRef}
        />
      </div>
    </div>
  );
};

export default StoryView;
