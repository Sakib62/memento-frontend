import { useEffect, useState } from 'react';
import { commentService } from '../services/commentService';
import { Comment } from '../types/comment';
import { useAuth } from './useAuth';

interface UseFetchCommentsProps {
  storyId: string;
  token: string;
  onCommentCountChange: (count: number) => void;
}

export const useFetchComments = ({
  storyId,
  token,
  onCommentCountChange,
}: UseFetchCommentsProps) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const { clearAuthData } = useAuth();

  useEffect(() => {
    const fetchComments = async () => {
      if (!storyId) return;

      setLoading(true);
      try {
        const fetchedComments = await commentService.fetchComments(
          storyId,
          token,
          clearAuthData
        );
        setComments(fetchedComments);
        onCommentCountChange(fetchedComments.length);
      } catch (error) {
        console.error('Error fetching comments:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchComments();
  }, [storyId, token, onCommentCountChange]);

  return { comments, setComments, loading };
};
