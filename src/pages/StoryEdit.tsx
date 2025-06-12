import { useEffect, useRef, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import StoryEditor, {
  StoryEditorHandle,
} from '../components/story/StoryEditor';
import TagInput from '../components/story/TagInput';
import { useAuth } from '../hooks/useAuth';
import { useEditFetchStory } from '../hooks/useEditFetchStory';
import { useUpdateStory } from '../hooks/useUpdateStory';

const StoryEdit = () => {
  const { token } = useAuth();
  if (!token) {
    return <Navigate to='/login' />;
  }

  const navigate = useNavigate();
  const { id: storyId } = useParams();

  const [title, setTitle] = useState<string>('');
  const [tags, setTags] = useState<string[]>([]);

  const { story, loading } = useEditFetchStory({
    storyId,
  });
  useEffect(() => {
    if (story) {
      setTitle(story.title);
      editorRef.current?.setMarkdown(story.description);
      setTags(story.tags);
    }
  }, [story]);

  const editorRef = useRef<StoryEditorHandle>(null);

  const { handleSaveUpdate } = useUpdateStory();
  const onClickSave = () => {
    const markdown = editorRef.current?.getMarkdown();
    handleSaveUpdate({
      title,
      markdownContent: markdown,
      tags,
      storyId: story?.id,
    });
  };

  const handleCancelUpdate = async () => {
    const markdown = editorRef.current?.getMarkdown();

    const isSaveDisabled =
      title === story?.title &&
      markdown === story?.description &&
      JSON.stringify(tags) === JSON.stringify(story?.tags);

    if (!isSaveDisabled) {
      const result = await Swal.fire({
        title: 'Unsaved Changes',
        text: 'Are you sure you want to leave?',
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

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className='flex flex-col min-h-screen'>
      <div className='flex flex-col items-center justify-start flex-grow px-4 pt-10 bg-gray-300 dark:bg-stone-600'>
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
            <div className='max-w-4xl rounded-lg shadow-md'>
              <StoryEditor ref={editorRef} />
            </div>
          </div>

          <TagInput tags={tags} setTags={setTags} />
        </div>

        <div className='flex mt-6 mb-10'>
          <button
            onClick={handleCancelUpdate}
            className='px-4 py-2 mr-4 font-semibold text-white bg-red-600 rounded-md shadow-md hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700'
          >
            Cancel
          </button>

          <button
            onClick={onClickSave}
            className={`px-4 py-2 font-semibold text-white bg-blue-600 rounded-md shadow-md hover:bg-blue-700 dark:bg-gray-800 dark:hover:bg-gray-900`}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default StoryEdit;
