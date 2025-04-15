import React, { useContext, useState } from 'react';
import { CiLogin } from 'react-icons/ci';
import { MdEmail } from 'react-icons/md';
import { RiLockPasswordFill } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { z } from 'zod';
import loginImage from '../assets/login-img.png';
import AuthLayout from '../components/auth/AuthLayout';
import FooterLink from '../components/auth/FooterLink';
import FormInput from '../components/auth/FormInput';
import SubmitButton from '../components/auth/SubmitButton';
import AuthContext from '../context/AuthContext';
import { LoginData, loginSchema } from '../schemas/authSchema';
import { loginUser } from '../services/authService';

const Login = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const loginData: LoginData = { identifier, password };
    try {
      loginSchema.parse(loginData);
      const data = await loginUser(loginData);
      const token = data.data.token;
      authContext?.setAuthData(token);
      Swal.fire({
        title: 'Success!',
        text: 'Login successful',
        icon: 'success',
        confirmButtonText: 'OK',
      }).then(() => {
        navigate('/');
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
          title: 'Error!',
          text:
            error instanceof Error ? error.message : 'Please try again later.',
          icon: 'error',
          confirmButtonText: 'Try Again',
        });
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
