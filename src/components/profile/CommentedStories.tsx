import useUserCommentedStories from '../../hooks/story/useUserCommentedStories';
import HomeStoryCard from '../story/HomeStoryCard';

const CommentedStories = ({ userId }: { userId: string }) => {
  const { commentedStories, loading, error } = useUserCommentedStories(userId);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <>
      {commentedStories.map(story => (
        <HomeStoryCard key={story.id} story={story} />
      ))}
    </>
  );
};

export default CommentedStories;
