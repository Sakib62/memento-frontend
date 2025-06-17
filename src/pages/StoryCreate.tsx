import { useRef, useState } from 'react';
import { Navigate } from 'react-router-dom';
import StoryEditor, {
  StoryEditorHandle,
} from '../components/story/StoryEditor';
import TagInput from '../components/story/TagInput';
import { useAuth } from '../hooks/useAuth';
import { useCreateStory } from '../hooks/useCreateStory';

const StoryCreate = () => {
  const { token } = useAuth();
  if (!token) {
    return <Navigate to='/login' />;
  }

  const [title, setTitle] = useState('');
  const [tags, setTags] = useState<string[]>([]);

  const { createStory, loading } = useCreateStory();
  const editorRef = useRef<StoryEditorHandle>(null);

  const handleSave = () => {
    const markdown = editorRef.current?.getMarkdown();
    createStory(title, markdown, tags);
  };

  return (
    <div className='flex flex-col gap-8 p-8 lg:flex-row'>
      <div className='flex flex-col gap-8 lg:w-3/4'>
        <input
          type='text'
          placeholder='Enter title...'
          required
          value={title}
          onChange={e => setTitle(e.target.value)}
          className='p-2 text-lg border-2 rounded-md outline-none border-neutral-300 focus:ring-blue-400 focus:ring-2'
        />
        <div>
          <StoryEditor ref={editorRef} />
        </div>
      </div>

      <div className='flex flex-col gap-8 lg:w-1/4'>
        <div className=''>
          <TagInput tags={tags} setTags={setTags} />
        </div>
        <div className='flex justify-center'>
          <button
            onClick={handleSave}
            disabled={loading}
            className='px-4 py-2 font-semibold text-white bg-blue-600 rounded-md shadow-md hover:bg-blue-800'
          >
            {loading ? 'Publishing...' : 'Publish'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StoryCreate;
