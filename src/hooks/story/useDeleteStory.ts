import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useAuth } from '../useAuth';

const useDeleteStory = () => {
  const navigate = useNavigate();

  const { token } = useAuth();
  const apiUrl = import.meta.env.VITE_API_URL;

  const handleDeleteStory = async (storyId: string) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to delete this story?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(`${apiUrl}/api/stories/${storyId}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error('Failed to delete story');

        navigate(`/`);
        Swal.fire({
          title: 'Success!',
          text: 'Story is deleted!',
          icon: 'success',
          timer: 1500,
          timerProgressBar: false,
          showConfirmButton: false,
        });
      } catch (error) {
        toast.error('Error deleting story');
      }
    }
  };

  return handleDeleteStory;
};

export default useDeleteStory;
