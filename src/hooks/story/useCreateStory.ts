import { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useAuth } from '../useAuth';

export const useCreateStory = () => {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const apiUrl = import.meta.env.VITE_API_URL;

  const createStory = async (
    title: string,
    markdownContent: string | undefined,
    tags: string[]
  ) => {
    if (!title.trim()) {
      toast.error('Title cannot be empty', {
        position: 'top-center',
      });
      return;
    }
    if (!markdownContent?.trim()) {
      toast.error('Description cannot be empty', {
        position: 'top-center',
      });
      return;
    }

    const storyData = {
      title,
      description: markdownContent,
      tags,
    };

    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/api/stories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(storyData),
      });

      const data = await response.json();
      const story = data.data;

      if (response.ok) {
        Swal.fire({
          title: 'Success!',
          text: 'Story is published!',
          icon: 'success',
          timer: 1000,
          timerProgressBar: false,
          showConfirmButton: false,
          willClose: () => {
            navigate(`/story/${story.id}`, { state: story });
          },
        });
      } else {
        toast.error('Failed to publish story.\nPlease try again.');
        setLoading(false);
      }
    } catch (error) {
      toast.error('Something went wrong!\nPlease try again.');
      setLoading(false);
    }
  };

  return { createStory, loading };
};
