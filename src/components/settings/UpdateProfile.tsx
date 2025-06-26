import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { useUpdateProfile } from '../../hooks/profile/useUpdateProfile';
import useUserInfo from '../../hooks/profile/useUserInfo';
import { useAuth } from '../../hooks/useAuth';
import { User } from '../../types/user';
import { FormInput, Heading, SubmitButton } from './Shared';

const UpdateProfile = () => {
  const { username } = useAuth();

  const [localUserInfo, setLocalUserInfo] = useState<User | null>(null);
  const { userInfo } = useUserInfo(username!);
  const { updateProfile, isLoading } = useUpdateProfile();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (userInfo) {
      setLocalUserInfo(userInfo);
      setName(userInfo.name ?? '');
      setEmail(userInfo.email ?? '');
    }
  }, [userInfo]);

  const isUnchanged =
    name.trim() === (localUserInfo?.name?.trim() ?? '') &&
    email.trim() === (localUserInfo?.email?.trim() ?? '');

  if (!localUserInfo) return <div>Loading...</div>;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const updates: { name?: string; email?: string } = {};

    if (name.trim() !== localUserInfo.name.trim()) {
      updates.name = name.trim();
    }
    if (email.trim() !== localUserInfo.email.trim()) {
      updates.email = email.trim();
    }

    if (Object.keys(updates).length === 0) {
      Swal.fire({
        icon: 'info',
        title: 'Nothing to Update',
        text: 'Make changes before saving.',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'OK',
      });
      return;
    }

    try {
      const updatedUser = await updateProfile({
        userId: localUserInfo.id,
        updatedData: updates,
      });
      setLocalUserInfo(updatedUser);
      setName(updatedUser.name ?? name);
      setEmail(updatedUser.email ?? email);
    } catch (error) {}
  };

  return (
    <div className='mb-6'>
      <Heading title='Update Profile' />
      <form onSubmit={handleSubmit} className='space-y-4'>
        <FormInput
          label='Full Name'
          id='name'
          type='text'
          value={name!}
          onChange={e => setName(e.target.value)}
          placeholder='Enter your full name'
        />
        <FormInput
          label='Email'
          id='email'
          type='email'
          value={email!}
          onChange={e => setEmail(e.target.value)}
          placeholder='Enter your email'
        />
        <SubmitButton
          text={isLoading ? 'Saving...' : 'Save Changes'}
          bgColor='bg-blue-600'
          type='submit'
          disabled={isLoading || isUnchanged}
        />
      </form>
    </div>
  );
};

export default UpdateProfile;
