import { useTranslation } from 'react-i18next';
import Swal from 'sweetalert2';
import { useDeleteAccount } from '../../hooks/profile/useDeleteAccount';
import { useAuth } from '../../hooks/useAuth';
import { Heading, SubmitButton } from './Shared';

const DeleteAccount = () => {
  const { deleteAccount, isLoading } = useDeleteAccount();
  const { id } = useAuth();
  const { t } = useTranslation();

  const handleDeleteClick = () => {
    Swal.fire({
      title: t('settings.delete-account.modal-title'),
      text: t('settings.delete-account.modal-text'),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: t('settings.delete-account.modal-confirm'),
      cancelButtonText: t('settings.delete-account.modal-cancel'),
      reverseButtons: true,
    }).then(result => {
      if (result.isConfirmed) {
        deleteAccount(id || '');
      }
    });
  };

  return (
    <div>
      <Heading title={t('settings.delete-account.heading')} />
      <p className='mb-4 text-sm text-gray-600'>
        {t('settings.delete-account.message-line-1')}
        <br />
        <span className='italic font-bold text-gray-500'>
          {t('settings.delete-account.message-line-2')}
        </span>
      </p>

      <SubmitButton
        text={
          isLoading
            ? `${t('settings.delete-account.submit-btn-loading')}...`
            : `${t('settings.delete-account.submit-btn')}`
        }
        bgColor='bg-red-600'
        onClick={handleDeleteClick}
        type='button'
        disabled={isLoading}
      />
    </div>
  );
};

export default DeleteAccount;
