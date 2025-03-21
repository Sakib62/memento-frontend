import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { showToast } from '../utils/toast';

const Register = () => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const userData = {
      name,
      username,
      email,
      password,
    };

    try {
      const response = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
        credentials: 'include',
      });

      const data = await response.json();
      if (response.ok) {
        showToast(
          'Registration successful! Redirecting to login...',
          'success'
        );
        setTimeout(() => navigate('/login'), 3000);
      } else {
        showToast(data.message || 'Registration failed', 'warning');
      }
    } catch (error) {
      showToast('Network error. Please try again.', 'error');
    }
  };

  return (
    <div className='flex items-center justify-center min-h-screen bg-gradient-to-r from-indigo-300 via-purple-300 to-blue-300'>
      <div className='w-full max-w-sm p-6 bg-white rounded-lg shadow-lg shadow-blue-400/50'>
        <h2 className='mb-4 text-2xl font-semibold text-center'>Register</h2>

        <form
          onSubmit={handleSubmit}
          className='flex flex-col w-full max-w-sm gap-4'
        >
          <label
            htmlFor='name'
            className='block text-sm font-medium text-gray-700'
          >
            Name
          </label>
          <input
            type='text'
            placeholder='Name'
            id='name'
            name='name'
            value={name}
            onChange={e => setName(e.target.value)}
            className='p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
            required
          />

          <label
            htmlFor='username'
            className='block text-sm font-medium text-gray-700'
          >
            Username
          </label>
          <input
            type='text'
            placeholder='Username'
            id='username'
            name='username'
            value={username}
            onChange={e => setUsername(e.target.value)}
            className='p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
            required
          />

          <label
            htmlFor='email'
            className='block text-sm font-medium text-gray-700'
          >
            Email
          </label>
          <input
            type='email'
            placeholder='Email'
            id='email'
            name='email'
            value={email}
            onChange={e => setEmail(e.target.value)}
            className='p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
            required
          />

          <label
            htmlFor='password'
            className='block text-sm font-medium text-gray-700'
          >
            Password
          </label>
          <input
            type='password'
            placeholder='Password'
            id='password'
            name='password'
            value={password}
            onChange={e => setPassword(e.target.value)}
            className='p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
            required
          />

          <button
            type='submit'
            className='py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600'
          >
            Register
          </button>
        </form>

        <p className='mt-4 text-sm text-center text-gray-600'>
          Already have an account?{' '}
          <button
            onClick={() => navigate('/login')}
            className='font-bold text-blue-600 hover:underline'
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
};

export default Register;
