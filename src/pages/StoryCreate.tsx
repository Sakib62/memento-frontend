import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import StoryEditor from '../components/story/StoryEditor';
import TagInput from '../components/story/TagInput';
import { useAuth } from '../hooks/useAuth';
import { useCreateStory } from '../hooks/useCreateStory';

const StoryCreate = () => {
  const { token } = useAuth();
  if (!token) {
    return <Navigate to='/login' />;
  }

  const [title, setTitle] = useState('');
  const [markdownContent, setMarkdownContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);

  const { createStory, loading } = useCreateStory();

  const handleContentChange = (content: string) => {
    setMarkdownContent(content);
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

          <TagInput tags={tags} setTags={setTags} />
        </div>

        <button
          onClick={() => createStory(title, markdownContent, tags)}
          disabled={loading}
          className='px-4 py-2 mt-6 mb-6 font-semibold text-white bg-blue-600 rounded-md shadow-md hover:bg-blue-700 dark:bg-gray-800 dark:hover:bg-gray-900'
        >
          {loading ? 'Publishing...' : 'Publish'}
        </button>
      </div>
    </div>
  );
};

export default StoryCreate;
