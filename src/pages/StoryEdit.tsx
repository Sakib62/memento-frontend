import { useContext, useEffect, useState } from 'react';
import {
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom';
import Swal from 'sweetalert2';
import StoryEditor from '../components/StoryEditor';
import { AuthContext } from '../context/AuthContext';

const StoryEdit = () => {
  const authContext = useContext(AuthContext);
  if (!authContext?.token) {
    return <Navigate to='/login' />;
  }

  const { username, role, token } = authContext;

  const navigate = useNavigate();

  const location = useLocation();
  const initialStory = location.state || null;
  const { id: storyId } = useParams();

  const [story, setStory] = useState(initialStory);
  const [loading, setLoading] = useState(!initialStory);

  const [title, setTitle] = useState(initialStory?.title || '');
  const [markdownContent, setMarkdownContent] = useState(
    initialStory?.description || ''
  );
  const [tags, setTags] = useState<string[]>(initialStory?.tags || []);

  const maxTagLength = 20;
  const maxTags = 10;

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

        if (response.ok) {
          const data = await response.json();
          const fetchedStory = data.data;

          if (fetchedStory.authorUsername !== username && role != 1) {
            Swal.fire({
              title: 'Access Denied!',
              text: 'You are not authorized to edit this story.',
              icon: 'error',
              confirmButtonText: 'Okay',
            });
            return navigate(`/story/${storyId}`);
          }

          setStory(fetchedStory);
          setTitle(fetchedStory.title);
          setMarkdownContent(fetchedStory.description);
          setTags(fetchedStory.tags);
        } else {
          Swal.fire({
            title: 'Error!',
            text: 'Failed to load the story.',
            icon: 'error',
            confirmButtonText: 'Okay',
          });
          navigate('/');
        }
      } catch (error) {
        console.error('Error fetching story:', error);
      } finally {
        setLoading(false);
      }
    };

    // if (!initialStory) {
    fetchStory();
    // }
  }, [storyId, token, navigate, initialStory]);

  const handleContentChange = (content: string) => {
    setMarkdownContent(content);
  };

  const handleTagInput = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const input = event.currentTarget.value;

    if (
      input.length >= maxTagLength &&
      event.key !== 'Backspace' &&
      event.key !== 'Enter' &&
      event.key !== ' '
    ) {
      event.preventDefault();
      return;
    }

    if (input.length == 0 && event.key === ' ') {
      event.preventDefault();
      return;
    }

    if (input !== '' && (event.key === 'Enter' || event.key === ' ')) {
      if (tags.length < maxTags && !tags.includes(input)) {
        setTags(prevTags => [...prevTags, input]);

        event.currentTarget.value = '';
      }
      event.preventDefault(); // Prevent space/enter from being added
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  const handleSaveUpdate = async () => {
    const updatedData = {
      title: title,
      description: markdownContent,
      tags: tags,
    };

    try {
      const response = await fetch(
        `http://localhost:3000/api/stories/${story.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedData),
        }
      );

      const data = await response.json();
      const updatedStory = data.data;

      if (response.ok) {
        Swal.fire({
          title: 'Success!',
          text: 'Story has been updated!',
          icon: 'success',
          confirmButtonText: 'Okay',
        }).then(() => {
          navigate(`/story/${story.id}`, { state: updatedStory });
        });
      } else {
        Swal.fire({
          title: 'Error!',
          text: 'Failed to update story. Please try again.',
          icon: 'error',
          confirmButtonText: 'Okay',
        });
      }
    } catch (error) {
      console.error('Error:', error);
      Swal.fire({
        title: 'Error!',
        text: 'Something went wrong. Please try again.',
        icon: 'error',
        confirmButtonText: 'Okay',
      });
    }
  };

  const handleCancelUpdate = async () => {
    if (!isSaveDisabled) {
      const result = await Swal.fire({
        title: 'Unsaved Changes',
        text: 'You have unsaved changes. Are you sure you want to leave?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Leave',
        cancelButtonText: 'Stay',
        reverseButtons: true,
        focusCancel: true,
        customClass: {
          confirmButton:
            'bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg',
          cancelButton:
            'bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg',
          popup: 'dark:bg-gray-700 dark:text-white',
        },
      });

      if (result.isConfirmed) {
        navigate(-1);
      }
    } else {
      navigate(-1);
    }
  };

  const isSaveDisabled =
    title === story?.title &&
    markdownContent === story?.description &&
    JSON.stringify(tags) === JSON.stringify(story?.tags);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className='flex flex-col min-h-screen'>
      <div className='flex flex-col items-center justify-start flex-grow px-4 pt-10 bg-gray-300 dark:bg-stone-600'>
        <h1 className='mb-12 text-3xl font-bold text-gray-800 dark:text-gray-200'>
          Edit Story
        </h1>

        {/* Parent flex container for title/description and tags */}
        <div className='flex flex-col w-full gap-8 max-w-7xl md:flex-row'>
          <div className='flex-1 w-full max-w-4xl'>
            <input
              required
              type='text'
              placeholder='Story title'
              value={title}
              onChange={e => setTitle(e.target.value)}
              className='w-full p-3 mb-4 text-lg border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400'
            />
            <div className='rounded-lg shadow-md'>
              <StoryEditor
                onContentChange={handleContentChange}
                initialContent={story.description}
              />
            </div>
          </div>

          {/* Tags section */}
          <div className='flex-shrink-0 w-full p-5 bg-gray-100 rounded-lg shadow-md md:w-1/4'>
            <h3 className='mb-4 text-xl font-semibold text-center text-gray-800 dark:text-gray-500'>
              Add Tags
            </h3>
            <input
              type='text'
              placeholder='Story tag'
              onKeyDown={handleTagInput}
              className={`w-full p-2 mb-2 border border-gray-300 rounded-md focus:outline-none ${
                tags.length >= maxTags
                  ? 'cursor-not-allowed opacity-95 bg-gray-200'
                  : ''
              }`}
              disabled={tags.length >= maxTags}
            />
            {/* 
            <p
              className={`text-sm font-medium mb-2 ${
                charCount >= maxTagLength ? 'text-red-500' : 'text-gray-600'
              }`}
            >
              {charCount}/{maxTagLength}
            </p> */}

            {tags.length >= maxTags && (
              <p className='mb-2 text-sm font-medium text-red-500'>
                Maximum 10 tags
              </p>
            )}

            <div className='flex flex-wrap gap-2'>
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className='flex items-center gap-2 px-4 py-2 text-white bg-blue-500 rounded-full dark:bg-gray-800'
                >
                  {tag}
                  <button
                    onClick={() => removeTag(tag)}
                    className='text-sm text-gray-300 hover:text-white'
                  >
                    x
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className='flex mt-6'>
          <button
            onClick={handleCancelUpdate}
            className='px-4 py-2 mr-4 font-semibold text-white bg-red-600 rounded-md shadow-md hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700'
          >
            Cancel
          </button>

          <button
            onClick={handleSaveUpdate}
            disabled={isSaveDisabled}
            className={`px-4 py-2 font-semibold text-white bg-blue-600 rounded-md shadow-md hover:bg-blue-700 dark:bg-gray-800 dark:hover:bg-gray-900 ${
              isSaveDisabled ? 'cursor-not-allowed opacity-50' : ''
            }`}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default StoryEdit;
