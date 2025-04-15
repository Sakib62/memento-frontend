import { Story } from '../../types/story';
import StoryCard from '../StoryCard';

const ProfileStories = ({ stories }: { stories: Story[] }) => {
  if (!stories?.length) return <p>No stories found.</p>;

  return (
    <div className='grid grid-cols-1 gap-6 pb-4 rounded-lg md:grid-cols-2'>
      {stories.map((story: Story) => (
        <div className='py-0' key={story.id}>
          <StoryCard story={story} />
        </div>
      ))}
    </div>
  );
};

export default ProfileStories;
