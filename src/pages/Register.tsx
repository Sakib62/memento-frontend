import { useState } from 'react';
import { FiUserPlus } from 'react-icons/fi';
import { MdEmail, MdPerson } from 'react-icons/md';
import { RiLockPasswordFill } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { z } from 'zod';
import registerImage from '../assets/register-img.png';
import AuthLayout from '../components/auth/AuthLayout';
import FooterLink from '../components/auth/FooterLink';
import FormInput from '../components/auth/FormInput';
import SubmitButton from '../components/auth/SubmitButton';
import { RegisterData, registerSchema } from '../schemas/authSchema';
import { registerUser } from '../services/authService';

const Register = () => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const registerData: RegisterData = { name, username, email, password };

    try {
      registerSchema.parse(registerData);
      await registerUser(registerData);
      Swal.fire({
        title: 'Success!',
        text: 'Registration successful! Redirecting to login...',
        icon: 'success',
        timer: 3000,
        showConfirmButton: false,
      }).then(() => {
        navigate('/login');
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        Swal.fire({
          title: 'Validation Error',
          text: error.errors.map(e => e.message).join(', '),
          icon: 'error',
        });
      } else {
        Swal.fire({
          title: 'Registration Failed',
          text:
            error instanceof Error ? error.message : 'Something went wrong.',
          icon: 'warning',
          confirmButtonText: 'Try Again',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      imageSrc={registerImage}
      imageAlt='Register'
      maxWidth='md:max-w-5xl'
    >
      <form onSubmit={handleSubmit} className='space-y-6'>
        <FormInput
          label='Username'
          type='text'
          id='username'
          value={username}
          onChange={e => setUsername(e.target.value)}
          placeholder='Enter your username'
          icon={MdPerson}
        />

        <FormInput
          label='Full Name'
          type='text'
          id='name'
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder='Enter your full name'
          icon={MdPerson}
        />

        <FormInput
          label='Email'
          type='email'
          id='email'
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder='Enter your email'
          icon={MdEmail}
        />

        <FormInput
          label='Password'
          type='password'
          id='password'
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder='Enter your password'
          icon={RiLockPasswordFill}
        />

        <SubmitButton text='Register' icon={FiUserPlus} gap='gap-2' loading={loading}/>
      </form>

      <FooterLink
        text='Already have an account?'
        linkText='Login'
        linkTo='/login'
      />
    </AuthLayout>
  );
};

export default Register;
