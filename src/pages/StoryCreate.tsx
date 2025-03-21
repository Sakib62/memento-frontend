import { useContext, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import StoryEditor from '../components/StoryEditor';
import { AuthContext } from '../context/AuthContext';

const StoryCreate = () => {
  const authContext = useContext(AuthContext);
  if (!authContext?.token) {
    return <Navigate to='/login' />;
  }
  const navigate = useNavigate();
  const { token, username, name } = authContext;

  const [title, setTitle] = useState('');
  const [markdownContent, setMarkdownContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);

  const maxTagLength = 20;
  const maxTags = 10;

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

  const handleCreateStory = async () => {
    const storyData = {
      title: title,
      description: markdownContent,
      authorusername: username,
      authorName: name,
      tags: tags,
    };

    try {
      const response = await fetch('http://localhost:3000/api/stories/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(storyData),
      });

      const data = await response.json();
      const story = data.data;

      if (response.ok) {
        Swal.fire({
          title: 'Success!',
          text: 'Story has been published!',
          icon: 'success',
          confirmButtonText: 'Okay',
        }).then(() => {
          navigate(`/story/${story.id}`, { state: story });
        });
      } else {
        Swal.fire({
          title: 'Failed!',
          text: 'Please try again.',
          icon: 'error',
          confirmButtonText: 'Okay',
        });
      }
    } catch (error) {
      Swal.fire({
        title: 'Something went wrong!',
        text: 'Please try again.',
        icon: 'error',
        confirmButtonText: 'Okay',
      });
    }
  };

  return (
    <div className='flex flex-col min-h-screen'>
      <div className='flex flex-col items-center justify-start flex-grow px-4 pt-10 bg-gray-300 dark:bg-stone-600'>
        <h1 className='mb-12 text-3xl font-bold text-gray-800 dark:text-gray-200'>
          Create New Story
        </h1>

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
              <StoryEditor onContentChange={handleContentChange} />
            </div>
          </div>

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

        <button
          onClick={handleCreateStory}
          className='px-4 py-2 mt-6 font-semibold text-white bg-blue-600 rounded-md shadow-md hover:bg-blue-700 dark:bg-gray-800 dark:hover:bg-gray-900'
        >
          Publish
        </button>
      </div>
    </div>
  );
};

export default StoryCreate;
