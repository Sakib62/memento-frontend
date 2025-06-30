import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const useAuthPromptModal = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const showAuthPromptModal = () => {
    Swal.fire({
      title: t('auth-prompt-modal.text'),
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#3085d6',
      confirmButtonText: t('auth-prompt-modal.confirm'),
      cancelButtonText: t('auth-prompt-modal.cancel'),
      reverseButtons: true,
      focusConfirm: true,
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
