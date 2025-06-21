import { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';

const useGetComments = (storyId: string, setComments) => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const { token } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const result = await fetch(`${apiUrl}/api/stories/${storyId}/comments`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await result.json();
      setComments(data.data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  return { loading };
};

export default useGetComments;
