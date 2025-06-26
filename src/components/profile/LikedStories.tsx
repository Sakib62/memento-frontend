import useUserLikedStories from '../../hooks/story/useUserLikedStories';
import HomeStoryCard from '../story/HomeStoryCard';

const LikedStories = ({ userId }: { userId: string }) => {
  const { likedStories, loading, error } = useUserLikedStories(userId);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <>
      {likedStories.map(story => (
        <HomeStoryCard key={story.id} story={story} />
      ))}
    </>
  );
};

export default LikedStories;
