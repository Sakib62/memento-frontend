import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const useAuthPromptModal = () => {
  const navigate = useNavigate();

  const showAuthPromptModal = () => {
    Swal.fire({
      title: 'Sign in to continue',
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sign In',
      cancelButtonText: 'Create Account',
      reverseButtons: true,
    }).then(result => {
      if (result.isConfirmed) {
        navigate('/login');
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        navigate('/register');
      }
      return result;
    });
  };

  return showAuthPromptModal;
};

export default useAuthPromptModal;
