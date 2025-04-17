import { useState } from 'react';
import { MAX_TAG_LENGTH, MAX_TAGS } from '../../constants/story';

interface TagInputProps {
  tags: string[];
  setTags: React.Dispatch<React.SetStateAction<string[]>>;
}

const TagInput: React.FC<TagInputProps> = ({ tags, setTags }) => {
  const [inputValue, setInputValue] = useState('');

  const handleTagInput = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const input = event.currentTarget.value;
    if (
      input.length >= MAX_TAG_LENGTH &&
      event.key !== 'Backspace' &&
      event.key !== 'Enter' &&
      event.key !== ' '
    ) {
      event.preventDefault();
      return;
    }
    if (input.length === 0 && event.key === ' ') {
      event.preventDefault();
      return;
    }
    if (input !== '' && (event.key === 'Enter' || event.key === ' ')) {
      if (tags.length < MAX_TAGS && !tags.includes(input)) {
        setTags(prevTags => [...prevTags, input]);
        setInputValue('');
      }
      event.preventDefault();
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  return (
    <div className='flex-shrink-0 w-full p-5 bg-gray-100 rounded-lg shadow-md md:w-1/4'>
      <h3 className='mb-4 text-xl font-semibold text-center text-gray-800 dark:text-gray-500'>
        Add Tags
      </h3>
      <input
        type='text'
        placeholder='Story tag'
        value={inputValue}
        onChange={e => setInputValue(e.target.value)}
        onKeyDown={handleTagInput}
        className={`w-full p-2 mb-2 border border-gray-300 rounded-md focus:outline-none ${
          tags.length >= MAX_TAGS
            ? 'cursor-not-allowed opacity-95 bg-gray-200'
            : ''
        }`}
        disabled={tags.length >= MAX_TAGS}
      />

      {tags.length >= MAX_TAGS && (
        <p className='mb-2 text-sm font-medium text-red-500'>
          Maximum {MAX_TAGS} tags
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
  );
};

export default TagInput;
