import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import StoryEditor, {
  StoryEditorHandle,
} from '../components/story/StoryEditor';
import TagInput from '../components/story/TagInput';
import { useCreateStory } from '../hooks/story/useCreateStory';

const StoryCreate = () => {
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const { t } = useTranslation();

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
          placeholder={t('create-story.title-placeholder')}
          required
          value={title}
          onChange={e => setTitle(e.target.value)}
          className='p-2 text-lg border-2 rounded-md outline-none border-neutral-300 focus:ring-blue-400 focus:ring-2'
        />
        <div>
          <StoryEditor ref={editorRef} />
        </div>
      </div>

      <div className='sticky flex flex-col h-full gap-8 lg:w-1/4 top-24'>
        <div className=''>
          <TagInput tags={tags} setTags={setTags} />
        </div>
        <div className='flex justify-center'>
          <button
            onClick={handleSave}
            disabled={loading}
            className='px-4 py-2 font-semibold text-white bg-blue-600 rounded-md shadow-md hover:bg-blue-800'
          >
            {loading
              ? t('create-story.publish-loading')
              : t('create-story.publish')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StoryCreate;
