import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { Story } from '../../types/story';

interface StoriesResult {
  stories: Story[];
  loading: boolean;
  error: string | null;
  hasNextPage: boolean;
}

type PagedStories = {
  stories: Story[];
  hasNextPage: boolean;
};

export const usePagedStories = (
  currentPage: number,
  limit: number = 6,
  endpoint: string
): StoriesResult => {
  const apiUrl = import.meta.env.VITE_API_URL;

  const fetchStories = async (): Promise<PagedStories> => {
    const response = await fetch(`${apiUrl}${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch latest stories');
    }

    const data = await response.json();
    return {
      stories: data.data.slice(0, limit),
      hasNextPage: data.data.length > limit,
    };
  };

  const { data, error, isLoading } = useQuery<PagedStories, Error>({
    queryKey: ['pagedStories', currentPage, limit, endpoint],
    queryFn: fetchStories,
    placeholderData: keepPreviousData,
    gcTime: 30 * 60 * 1000,
    enabled: !!endpoint,
  });

  return {
    stories: data?.stories || [],
    loading: isLoading,
    error: error ? error.message : null,
    hasNextPage: data?.hasNextPage || false,
  };
};
