import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import { useAuth } from './useAuth';

type Params = {
  title: string;
  markdownContent: string;
  tags: string[];
  storyId?: string;
};

export const useUpdateStory = () => {
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;
  const { token } = useAuth();

  const [isUpdating, setIsUpdating] = useState(false);

  const handleSaveUpdate = async ({
    title,
    markdownContent,
    tags,
    storyId,
  }: Params) => {
    if (!storyId) return;

    const updatedData = {
      title,
      description: markdownContent,
      tags,
    };

    try {
      setIsUpdating(true);

      const response = await fetch(`${apiUrl}/api/stories/${storyId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData),
      });

      if (response.ok) {
        Swal.fire({
          title: 'Success!',
          text: 'Story is updated!',
          icon: 'success',
          timer: 1000,
          timerProgressBar: false,
          showConfirmButton: false,
          willClose: () => {
            navigate(`/story/${storyId}`);
          },
        });
      } else {
        toast.error('Failed to update story.\nPlease try again.');
      }
    } catch (error) {
      toast.error('Something went wrong.\nPlease try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  return { handleSaveUpdate, isUpdating };
};
