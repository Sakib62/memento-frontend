import { useEffect, useState } from 'react';
import { SetComments } from '../../types/comment';

const useGetComments = (storyId: string, setComments: SetComments) => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [loading, setLoading] = useState<boolean>(false);

  const fetchComments = async (): Promise<void> => {
    setLoading(true);
    try {
      const response = await fetch(
        `${apiUrl}/api/stories/${storyId}/comments`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch comments');
      }

      const data = await response.json();
      setComments(data.data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [storyId]);

  return { loading };
};

export default useGetComments;
