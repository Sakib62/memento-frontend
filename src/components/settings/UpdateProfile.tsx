import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { FormInput, Heading, SubmitButton } from './shared';

interface UpdateProfileProps {
  initialName: string;
  initialEmail: string;
  onSubmit: (name: string, email: string) => void;
  isLoading?: boolean;
}

const UpdateProfile: React.FC<UpdateProfileProps> = ({
  initialName,
  initialEmail,
  onSubmit,
  isLoading = false,
}) => {
  const [name, setName] = useState(initialName);
  const [email, setEmail] = useState(initialEmail);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      name.trim() === initialName.trim() &&
      email.trim() === initialEmail.trim()
    ) {
      Swal.fire({
        icon: 'info',
        title: 'Nothing to Update',
        text: 'Please make changes to your name or email before saving.',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'OK',
      });
      return;
    }
    onSubmit(name, email);
  };

  return (
    <div className='mb-6'>
      <Heading title='Update Profile' />
      <form onSubmit={handleSubmit} className='space-y-4'>
        <FormInput
          label='Full Name'
          id='name'
          type='text'
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder='Enter your full name'
        />
        <FormInput
          label='Email'
          id='email'
          type='email'
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder='Enter your email'
        />
        <SubmitButton
          text={isLoading ? 'Saving...' : 'Save Changes'}
          bgColor='bg-blue-600'
          type='submit'
          disabled={isLoading}
        />
      </form>
    </div>
  );
};

export default UpdateProfile;
