import { useState } from 'react';
import toast from 'react-hot-toast';
import { FaPlus } from 'react-icons/fa';
import { MAX_TAG_LENGTH, MAX_TAGS } from '../../constants/story';

interface TagInputProps {
  tags: string[];
  setTags: React.Dispatch<React.SetStateAction<string[]>>;
}

const TagInput: React.FC<TagInputProps> = ({ tags, setTags }) => {
  const [inputValue, setInputValue] = useState('');

  const handleTagInput = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const tag = event.currentTarget.value;
    if (
      tag.length >= MAX_TAG_LENGTH &&
      event.key !== 'Backspace' &&
      event.key !== 'Enter' &&
      event.key !== ' ' &&
      !event.ctrlKey &&
      !event.metaKey &&
      !event.altKey
    ) {
      event.preventDefault();
      return;
    }
    if (tag.length === 0 && event.key === ' ') {
      event.preventDefault();
      return;
    }
    if (tag !== '' && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      addTag(tag);
    }
  };

  const addTag = (tag: string) => {
    if (tag.length == 0) return;

    if (tag.length > MAX_TAG_LENGTH) {
      toast.error(`Tag too long (max ${MAX_TAG_LENGTH} characters)`);
      return;
    }

    if (tags.length >= MAX_TAGS) {
      toast.error(`Maximum ${MAX_TAGS} tags`);
      return;
    }

    if (tags.includes(tag)) {
      toast.error('Tag already exists');
      return;
    }

    setTags(prevTags => [...prevTags, tag]);
    setInputValue('');
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  return (
    <div className='flex-shrink-0 w-full p-4 bg-gray-100 rounded-lg shadow-md '>
      <h3 className='mb-4 text-xl font-semibold text-center text-gray-800 dark:text-gray-500'>
        Add Tags
      </h3>
      <div className='flex items-center gap-2'>
        <input
          type='text'
          placeholder='Story tag'
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          onKeyDown={handleTagInput}
          className={`w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 ${
            tags.length >= MAX_TAGS
              ? 'cursor-not-allowed opacity-95 bg-gray-200'
              : ''
          }`}
          disabled={tags.length >= MAX_TAGS}
        />
        <button
          onClick={() => addTag(inputValue)}
          disabled={tags.length >= MAX_TAGS}
        >
          <FaPlus className='text-lg text-blue-600 shadow-2xl scale-140 hover:text-blue-800' />
        </button>
      </div>

      <p
        className={`text-sm text-right ${inputValue.length >= MAX_TAG_LENGTH ? 'text-red-500 font-semibold' : 'text-gray-500'}`}
      >
        {inputValue.length} / {MAX_TAG_LENGTH}
      </p>

      <p
        className={`mb-2 font-medium ${tags.length == MAX_TAGS ? 'text-red-500' : ''}`}
      >
        {tags.length} / {MAX_TAGS} tags
      </p>

      <div className='flex flex-wrap gap-2'>
        {tags.map((tag, index) => (
          <span
            key={index}
            className='flex items-center gap-2 px-2 py-2 text-white bg-blue-500 rounded-lg dark:bg-gray-800'
          >
            {tag}
            <button
              onClick={() => removeTag(tag)}
              className='px-2 text-base text-gray-700 bg-gray-300 rounded-lg hover:text-black hover:bg-red-500'
            >
              x
            </button>
          </span>
        ))}
      </div>
    </div>
  );
};

export default TagInput;
