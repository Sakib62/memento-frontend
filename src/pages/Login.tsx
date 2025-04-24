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
  const [errors, setErrors] = useState<{
    identifier?: string;
    password?: string;
  }>({});
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const { setAuthData } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    setHasSubmitted(true);
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
        const fieldErrors: { identifier?: string; password?: string } = {};
        error.errors.forEach(err => {
          if (err.path[0] === 'identifier') {
            fieldErrors.identifier = err.message;
          } else if (err.path[0] === 'password') {
            fieldErrors.password = err.message;
          }
        });
        setErrors(fieldErrors);
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

  const validateField = (field: keyof LoginData, value: string): string => {
    try {
      const singleFieldSchema = z.object({ [field]: loginSchema.shape[field] });
      singleFieldSchema.parse({ [field]: value });
      return '';
    } catch (err) {
      if (err instanceof z.ZodError) return err.errors[0]?.message || '';
      return '';
    }
  };

  return (
    <AuthLayout imageSrc={loginImage} imageAlt='Login'>
      <form onSubmit={handleSubmit}>
        <div className='mb-4 space-y-1'>
          <FormInput
            label='Email or Username'
            type='text'
            id='identifier'
            value={identifier}
            onChange={e => {
              const val = e.target.value;
              setIdentifier(val);
              if (hasSubmitted) {
                const errorMsg = validateField('identifier', val);
                setErrors(prev => ({ ...prev, identifier: errorMsg }));
              }
            }}
            placeholder='Email or Username'
            icon={MdEmail}
            required={false}
            error={errors.identifier}
          />

          <FormInput
            label='Password'
            type='password'
            id='password'
            value={password}
            onChange={e => {
              const val = e.target.value;
              setPassword(val);
              if (hasSubmitted) {
                const errorMsg = validateField('password', val);
                setErrors(prev => ({ ...prev, password: errorMsg }));
              }
            }}
            placeholder='Enter your password'
            icon={RiLockPasswordFill}
            required={false}
            error={errors.password}
          />
        </div>

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
