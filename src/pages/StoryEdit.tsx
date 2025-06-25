import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import SkeletonStoryEdit from '../components/Skeleton/SkeletonStoryEdit';
import StoryEditor, {
  StoryEditorHandle,
} from '../components/story/StoryEditor';
import TagInput from '../components/story/TagInput';
import { useEditFetchStory } from '../hooks/useEditFetchStory';
import { useUpdateStory } from '../hooks/useUpdateStory';

const StoryEdit = () => {
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
    return <SkeletonStoryEdit />;
  }

  return (
    <div className='flex flex-col gap-8 p-8 lg:flex-row'>
      <div className='flex flex-col gap-8 lg:w-3/4'>
        <input
          type='text'
          required
          placeholder={story?.title}
          value={title}
          onChange={e => setTitle(e.target.value)}
          className='p-2 text-lg border-2 rounded-md outline-none border-neutral-300 focus:ring-2 focus:ring-blue-400'
        />
        <StoryEditor ref={editorRef} />
      </div>

      <div className='sticky flex flex-col h-full gap-8 lg:w-1/4 top-24'>
        <TagInput tags={tags} setTags={setTags} />
        <div className='flex justify-center gap-8'>
          <button
            className='px-4 py-2 font-semibold text-white bg-red-600 rounded-md shadow-md hover:bg-red-800'
            onClick={handleCancelUpdate}
          >
            Cancel
          </button>
          <button
            className='px-4 py-2 font-semibold text-white bg-blue-600 rounded-md shadow-md hover:bg-blue-800'
            onClick={onClickSave}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default StoryEdit;
