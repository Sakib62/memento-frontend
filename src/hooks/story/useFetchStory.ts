import { useQuery } from '@tanstack/react-query';
import { Story } from '../../types/story';

export const useFetchStory = (storyId: string | undefined) => {
  const apiUrl = import.meta.env.VITE_API_URL;

  const fetchStory = async (): Promise<Story> => {
    const response = await fetch(`${apiUrl}/api/stories/${storyId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('not_found');
      }
      throw new Error('generic_error');
    }
    const data = await response.json();
    return data.data;
  };

  const { data, error, isLoading } = useQuery<Story, Error>({
    queryKey: ['story', storyId],
    queryFn: fetchStory,
    enabled: !!storyId,
    gcTime: 30 * 60 * 1000,
  });

  let errorString: string | null = null;
  if (error) {
    if (error.message === 'not_found') {
      errorString = 'not_found';
    } else {
      errorString = 'generic_error';
    }
  }

  return { story: data, loading: isLoading, error: errorString };
};
