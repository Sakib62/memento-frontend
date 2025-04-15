import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useDeleteAccount } from '../../hooks/useDeleteAccount';
import { useResetPassword } from '../../hooks/useResetPassword';
import { useUpdateProfile } from '../../hooks/useUpdateProfile';
import { User } from '../../types/user';
import DeleteAccount from '../settings/DeleteAccount';
import ResetPassword from '../settings/ResetPassword';
import UpdateProfile from '../settings/UpdateProfile';

interface ProfileSettingsProps {
  user: User;
  onUserUpdate: (updatedUser: Partial<User>) => void;
}

const ProfileSettings = ({ user, onUserUpdate }: ProfileSettingsProps) => {
  const navigate = useNavigate();
  const { token, clearAuthData, id } = useAuth();
  const { resetPassword, isLoading: isResetLoading } = useResetPassword();
  const { deleteAccount, isLoading: isDeleteLoading } = useDeleteAccount();
  const { updateProfile, isLoading: isUpdateLoading } = useUpdateProfile();

  const handleSaveChanges = async (updates: {
    name?: string;
    email?: string;
  }) => {
    try {
      await updateProfile({
        userId: user.id,
        token,
        updatedData: updates,
      });
      onUserUpdate(updates);
    } catch (err) {
      console.error('Update profile error:', err);
    }
  };

  const handleResetPassword = async (
    currentPassword: string,
    newPassword: string
  ) => {
    try {
      await resetPassword({
        userId: user.id,
        token,
        currentPassword,
        newPassword,
      });
    } catch (err) {
      // Error is already handled in the hook with Swal, but you can add additional logic here if needed
      console.error('Reset password error:', err);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await deleteAccount({
        userId: user.id,
        token,
      });
      if (id === user.id) {
        clearAuthData();
      } else {
        navigate('/');
      }
    } catch (err) {
      console.error('Delete account error:', err);
    }
  };

  return (
    <div className='pb-4 rounded-lg'>
      <h2 className='mb-6 text-xl font-bold text-left text-gray-800'>
        Account Settings
      </h2>

      <UpdateProfile
        initialName={user.name}
        initialEmail={user.email}
        onSubmit={handleSaveChanges}
        isLoading={isUpdateLoading}
      />
      <hr className='my-6 border-t-2 border-gray-400 rounded-full shadow-md' />

      <ResetPassword
        onSubmit={handleResetPassword}
        isLoading={isResetLoading}
      />
      <hr className='my-6 border-t-2 border-gray-400 rounded-full shadow-md' />

      <DeleteAccount
        onDelete={handleDeleteAccount}
        isLoading={isDeleteLoading}
      />
    </div>
  );
};

export default ProfileSettings;
