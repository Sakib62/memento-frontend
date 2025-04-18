import MarkdownIt from 'markdown-it';
import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { FaComment, FaHeart } from 'react-icons/fa';
import { MdDeleteOutline, MdOutlineModeEdit } from 'react-icons/md';
import ReactMarkdownEditorLite from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import Comment from '../components/Comment';
import ButtonWithTooltip from '../components/story/ButtonWithToolTip';
import { useAuth } from '../hooks/useAuth';
import { useFetchStory } from '../hooks/useFetchStory';

const StoryView = () => {
  const mdParser = new MarkdownIt();

  const { username, role, token } = useAuth();
  if (!token) {
    return <Navigate to='/login' />;
  }

  const navigate = useNavigate();
  const { id: storyId } = useParams();

  const apiUrl = import.meta.env.VITE_API_URL;
  const { story, loading } = useFetchStory(storyId);

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
        const response = await fetch(`${apiUrl}/api/stories/${storyId}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error('Failed to delete story');

        navigate(`/`);
        Swal.fire({
          title: 'Success!',
          text: 'Story is deleted!',
          icon: 'success',
          timer: 1500,
          timerProgressBar: false,
          showConfirmButton: false,
        });
      } catch (error) {
        toast.error('Error deleting story');
      }
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
          `${apiUrl}/api/stories/${storyId}/likeStatus`,
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
      const response = await fetch(`${apiUrl}/api/stories/${story?.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

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

  if (loading || !story) {
    return <div>Loading...</div>;
  }

  return (
    <div className='pt-6 pb-6 bg-gray-100 dark:bg-neutral-800'>
      <div className='flex flex-col flex-grow min-h-[calc(100vh-4rem)] max-w-5xl p-8 pt-4 mx-auto bg-white  dark:bg-stone-700 rounded-lg'>
        <h1 className='mb-4 text-3xl font-bold text-gray-900 dark:text-white '>
          {story.title}
        </h1>

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

        <div className='flex items-center gap-4 p-2 pt-2 pl-0 mb-4 rounded-lg '>
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
                onClick={() => navigate(`/story/${story.id}/edit`)}
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

        <div className='markdown-body'>
          {/* <MarkdownRenderer content={story?.description} /> */}
          <ReactMarkdownEditorLite
            className='react-markdown-editor-lite editor-content dark:bg-stone-700 dark:text-white'
            value={story?.description}
            style={{ minHeight: '200px', height: 'auto' }}
            renderHTML={text => mdParser.render(text)}
            view={{ menu: false, md: false, html: true }}
          />
        </div>

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
