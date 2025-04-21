import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { Role } from '../constants/role';
import { Story } from '../types/story';
import { useAuth } from './useAuth';

export const useEditFetchStory = ({
  storyId,
}: {
  storyId: string | undefined;
}) => {
  const { token, username, role, clearAuthData } = useAuth();

  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchStory = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/stories/${storyId}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 401) {
          clearAuthData();
          return;
        }

        if (response.ok) {
          const data = await response.json();
          const fetchedStory = data.data;

          if (fetchedStory.authorUsername !== username && role != Role.Admin) {
            Swal.fire({
              title: 'Access Denied!',
              text: 'You are not authorized to edit this story.',
              icon: 'error',
              confirmButtonText: 'Okay',
            });
            return navigate(`/story/${storyId}`);
          }

          setStory(fetchedStory);
        } else {
          Swal.fire({
            title: 'Error!',
            text: 'Failed to load the story.',
            icon: 'error',
            confirmButtonText: 'Okay',
          });
          navigate('/');
        }
      } catch (error) {
        console.error('Error fetching story:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStory();
  }, [storyId, token, navigate]);

  return { story, loading };
};
