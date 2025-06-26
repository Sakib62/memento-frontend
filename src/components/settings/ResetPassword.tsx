import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { z } from 'zod';
import { useAuth } from '../../hooks/useAuth';
import { useResetPassword } from '../../hooks/useResetPassword';
import { FormInput, Heading, SubmitButton } from './Shared';

const ResetPassword = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const { resetPassword, isLoading } = useResetPassword();
  const { id } = useAuth();

  const passwordSchema = z.object({
    currentPassword: z
      .string()
      .min(6, 'Current password must be at least 6 characters long'),
    newPassword: z
      .string()
      .min(6, 'New password must be at least 6 characters long'),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationResult = passwordSchema.safeParse({
      currentPassword,
      newPassword,
      confirmNewPassword,
    });

    if (!validationResult.success) {
      const errors = validationResult.error.errors;
      const errorMessage = errors.map(err => err.message).join('\n');
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: errorMessage,
      });
      return;
    }
    if (newPassword !== confirmNewPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Password Mismatch',
        text: "Password confirmation doesn't match the password",
        timer: 1000,
        timerProgressBar: false,
        showConfirmButton: false,
      });
      return;
    }

    await resetPassword({ userId: id || '', currentPassword, newPassword });
    setCurrentPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
  };

  return (
    <div className='mb-6'>
      <Heading title='Reset Password' />
      <form onSubmit={handleSubmit} className='space-y-4'>
        <FormInput
          label='Current Password'
          id='currentPassword'
          type='password'
          value={currentPassword}
          onChange={e => setCurrentPassword(e.target.value)}
          placeholder='Enter current password'
          required={true}
        />
        <FormInput
          label='New Password'
          id='newPassword'
          type='password'
          value={newPassword}
          onChange={e => setNewPassword(e.target.value)}
          placeholder='Enter new password'
          required={true}
        />
        <FormInput
          label='Confirm New Password'
          id='confirmNewPassword'
          type='password'
          value={confirmNewPassword}
          onChange={e => setConfirmNewPassword(e.target.value)}
          placeholder='Confirm new password'
          required={true}
        />
        <SubmitButton
          text={isLoading ? 'Resetting...' : 'Reset Password'}
          bgColor='bg-gray-600'
          type='submit'
          disabled={isLoading}
        />
      </form>
    </div>
  );
};

export default ResetPassword;
