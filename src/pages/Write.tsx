import { Check, X } from 'lucide-react';
import { useContext, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import BlogEditor from '../components/BlogEditor';
import Navbar from '../components/Navbar';
import { AuthContext } from '../context/AuthContext';

const Write = () => {
  const authContext = useContext(AuthContext);
  if (!authContext?.token) {
    return <Navigate to='/login' />;
  }
  const navigate = useNavigate();
  const { token, username, name } = authContext;

  const [title, setTitle] = useState('');
  const [markdownContent, setMarkdownContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [responseStatus, setResponseStatus] = useState('');

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

  const handleSubmit = async () => {
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
      console.log(data.data);
      const story = data.data;

      if (response.ok) {
        setPopupMessage('Your blog has been published!');
        setShowPopup(true);
        setResponseStatus('success');
        setTimeout(() => {
          navigate(`/blog/${story.id}`, { state: story });
        }, 2000);
      } else {
        setPopupMessage('Failed to publish your blog.\nPlease try again.');
        setResponseStatus('error');
        setShowPopup(true);
      }
    } catch (error) {
      console.error('Error:', error);
      setPopupMessage('Something went wrong. Please try again.');
      setResponseStatus('error');
      setShowPopup(true);
    }
  };

  return (
    <div className='flex flex-col min-h-screen'>
      <Navbar />

      <div className='flex flex-col items-center justify-start flex-grow px-4 pt-10 bg-gray-300 dark:bg-gray-600'>
        <h1 className='mb-12 text-3xl font-bold text-gray-800 dark:text-gray-200'>
          Create New Story
        </h1>

        {/* Parent flex container for title/description and tags */}
        <div className='flex w-full gap-8 max-w-7xl'>
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
              <BlogEditor onContentChange={handleContentChange} />
            </div>
          </div>

          {/* Tags section */}
          <div className='flex-shrink-0 w-1/4 p-5 bg-gray-100 rounded-lg shadow-md'>
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
          onClick={handleSubmit}
          className='px-4 py-2 mt-6 font-semibold text-white bg-blue-600 rounded-md shadow-md hover:bg-blue-700 dark:bg-gray-800 dark:hover:bg-gray-900'
        >
          Publish
        </button>
      </div>

      {/* Popup Modal */}
      {showPopup && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-gray-500 bg-opacity-75'>
          <div className='flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-lg w-96 h-76'>
            <div className='flex items-center justify-center mb-4'>
              <div
                className={`flex items-center justify-center w-16 h-16 rounded-full glow-animate ${
                  responseStatus === 'success' ? 'bg-green-500' : 'bg-red-500'
                }`}
              >
                {responseStatus === 'success' ? (
                  <Check color='#ffffff' size={40} />
                ) : (
                  <X color='#ffffff' size={40} />
                )}
              </div>
            </div>
            <p
              className='text-xl font-semibold text-center'
              style={{ whiteSpace: 'pre-line' }}
            >
              {popupMessage}
            </p>
            {responseStatus != 'success' && (
              <button
                onClick={() => setShowPopup(false)}
                className='px-6 py-2 mt-6 font-semibold text-white bg-blue-500 rounded-full shadow-md dark:bg-gray-800 hover:bg-blue-600'
              >
                Close
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Write;
