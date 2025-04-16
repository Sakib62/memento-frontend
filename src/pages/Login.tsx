import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { CiLogin } from 'react-icons/ci';
import { MdEmail } from 'react-icons/md';
import { RiLockPasswordFill } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import loginImage from '../assets/login-img.png';
import AuthLayout from '../components/auth/AuthLayout';
import FooterLink from '../components/auth/FooterLink';
import FormInput from '../components/auth/FormInput';
import SubmitButton from '../components/auth/SubmitButton';
import { useAuth } from '../hooks/useAuth';
import { LoginData, loginSchema } from '../schemas/authSchema';
import { loginUser } from '../services/authService';

const Login = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { setAuthData } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const loginData: LoginData = { identifier, password };
    
    try {
      loginSchema.parse(loginData);
      const data = await loginUser(loginData);
      const token = data.data.token;
      setAuthData(token);
      navigate('/');
      toast.success('Logged in successfully!', {
        position: 'top-center',
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors.map(e => e.message).join(', '), {
          position: 'top-center',
        });
      } else {
        toast.error(
          error instanceof Error ? error.message : 'Please try again later.',
          {
            position: 'top-center',
          }
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout imageSrc={loginImage} imageAlt='Login'>
      <form onSubmit={handleSubmit} className='space-y-6'>
        <FormInput
          label='Email or Username'
          type='text'
          id='identifier'
          value={identifier}
          onChange={e => setIdentifier(e.target.value)}
          placeholder='Email or Username'
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

        <SubmitButton
          text='Login'
          icon={CiLogin}
          gap='gap-1'
          loading={loading}
        />
      </form>

      <FooterLink
        text='Don’t have an account?'
        linkText='Register'
        linkTo='/register'
      />
    </AuthLayout>
  );
};

export default Login;
