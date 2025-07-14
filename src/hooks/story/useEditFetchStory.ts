import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { Role } from '../../constants/role';
import { Story } from '../../types/story';
import { useAuth } from '../useAuth';

export const useEditFetchStory = ({
  storyId,
}: {
  storyId: string | undefined;
}) => {
  const { token, username, role, clearAuthData } = useAuth();
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;

  const {
    data: story,
    isLoading: loading,
    error,
  } = useQuery<Story, Error>({
    queryKey: ['editStory', storyId],
    queryFn: async (): Promise<Story> => {
      const response = await fetch(`${apiUrl}/api/stories/${storyId}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        throw new Error('unauthorized');
      }

      if (!response.ok) {
        throw new Error('failed');
      }

      const data = await response.json();
      return data.data;
    },
    enabled: !!storyId && !!token,
  });

  if (error) {
    if (error.message === 'unauthorized') {
      clearAuthData();
      return { story: null, loading: false };
    }
    Swal.fire({
      title: 'Error!',
      text: 'Failed to load the story.',
      icon: 'error',
      confirmButtonText: 'Okay',
    });
    navigate(`/story/${storyId}`);
    return { story: null, loading: false };
  }

  if (story && story.authorUsername !== username && role !== Role.Admin) {
    Swal.fire({
      title: 'Access Denied!',
      text: 'You are not authorized to edit this story.',
      icon: 'error',
      confirmButtonText: 'Okay',
    });
    navigate(`/story/${storyId}`);
    return { story: null, loading: false };
  }

  return { story, loading };
};
