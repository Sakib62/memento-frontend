import Swal from 'sweetalert2';
import { useAuth } from '../../hooks/useAuth';
import { useDeleteAccount } from '../../hooks/profile/useDeleteAccount';
import { Heading, SubmitButton } from './Shared';

const DeleteAccount = () => {
  const { deleteAccount, isLoading } = useDeleteAccount();
  const { id } = useAuth();

  const handleDeleteClick = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This action cannot be undone. Account will be permanently deleted.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
    }).then(result => {
      if (result.isConfirmed) {
        deleteAccount(id || '');
      }
    });
  };

  return (
    <div>
      <Heading title='Delete Account' />
      <p className='mb-3 text-sm text-gray-600'>
        This action cannot be undone. Please confirm to delete your account.
      </p>
      <SubmitButton
        text={isLoading ? 'Deleting...' : 'Delete Account'}
        bgColor='bg-red-600'
        onClick={handleDeleteClick}
        type='button'
        disabled={isLoading}
      />
    </div>
  );
};

export default DeleteAccount;
