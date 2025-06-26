import { useState } from 'react';
import toast from 'react-hot-toast';
import { FiUserPlus } from 'react-icons/fi';
import { MdEmail, MdPerson } from 'react-icons/md';
import { RiLockPasswordFill } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import AuthLayout from '../components/auth/AuthLayout';
import FooterLink from '../components/auth/FooterLink';
import FormInput from '../components/auth/FormInput';
import SubmitButton from '../components/auth/SubmitButton';
import { SignUpData, signUpSchema } from '../schemas/authSchema';
import { signUpUser } from '../services/authService';

const SignUp = () => {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState<{
    name?: string;
    username?: string;
    email?: string;
    password?: string;
  }>({});
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setErrors({});
    setHasSubmitted(true);

    const signUpData: SignUpData = { name, username, email, password };

    try {
      signUpSchema.parse(signUpData);
      await signUpUser(signUpData);

      toast.success('Sign Up successful! Redirecting to Sign In page...', {
        position: 'top-center',
      });
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: {
          name?: string;
          username?: string;
          email?: string;
          password?: string;
        } = {};
        error.errors.forEach(err => {
          const field = err.path[0] as keyof SignUpData;
          fieldErrors[field] = err.message;
        });
        setErrors(fieldErrors);
      } else {
        toast.error(
          error instanceof Error ? error.message : 'Something went wrong.',
          {
            position: 'top-center',
          }
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const validateField = (field: keyof SignUpData, value: string): string => {
    try {
      const singleFieldSchema = z.object({
        [field]: signUpSchema.shape[field],
      });
      singleFieldSchema.parse({ [field]: value });
      return '';
    } catch (err) {
      if (err instanceof z.ZodError) return err.errors[0]?.message || '';
      return '';
    }
  };

  return (
    <AuthLayout>
      <form onSubmit={handleSubmit}>
        <div className='mb-4 space-y-1'>
          <FormInput
            label='Username'
            type='text'
            id='username'
            value={username}
            onChange={e => {
              const val = e.target.value;
              setUsername(val);
              if (hasSubmitted) {
                const errorMsg = validateField('username', val);
                setErrors(prev => ({ ...prev, username: errorMsg }));
              }
            }}
            placeholder='Enter your username'
            icon={MdPerson}
            required={false}
            error={errors.username}
          />

          <FormInput
            label='Full Name'
            type='text'
            id='name'
            value={name}
            onChange={e => {
              const val = e.target.value;
              setName(val);
              if (hasSubmitted) {
                const errorMsg = validateField('name', val);
                setErrors(prev => ({ ...prev, name: errorMsg }));
              }
            }}
            placeholder='Enter your full name'
            icon={MdPerson}
            required={false}
            error={errors.name}
          />

          <FormInput
            label='Email'
            type='email'
            id='email'
            value={email}
            onChange={e => {
              const val = e.target.value;
              setEmail(val);
              if (hasSubmitted) {
                const errorMsg = validateField('email', val);
                setErrors(prev => ({ ...prev, email: errorMsg }));
              }
            }}
            placeholder='Enter your email'
            icon={MdEmail}
            required={false}
            error={errors.email}
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
          text='Sign Up'
          icon={FiUserPlus}
          gap='gap-2'
          loading={loading}
        />
      </form>

      <FooterLink
        text='Already have an account?'
        linkText='Sign In'
        linkTo='/login'
      />
    </AuthLayout>
  );
};

export default SignUp;
