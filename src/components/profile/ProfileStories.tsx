import { Story } from '../../types/story';
import StoryCard from '../story/StoryCard';

const ProfileStories = ({ stories }: { stories: Story[] }) => {
  if (!stories?.length) return <p>No stories found.</p>;

  const handleDownload = () => {
    const dataStr = JSON.stringify(stories, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'data.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className='grid grid-cols-1 gap-6 pb-4 rounded-lg md:grid-cols-2'>
      {/* <button
        onClick={handleDownload}
        className='px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600'
      >
        Download JSON
      </button> */}
      {stories.map((story: Story) => (
        <div className='py-0' key={story.id}>
          <StoryCard story={story} />
        </div>
      ))}
    </div>
  );
};

export default ProfileStories;
