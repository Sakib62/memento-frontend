import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { showToast } from '../utils/toast';

const Login = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const loginData = {
      identifier,
      password,
    };

    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
        credentials: 'include',
      });

      const data = await response.json();

      if (response.ok) {
        //showToast('Login successful!', 'success');
        console.log('hi');
        const token = data.data.token;
        authContext?.setAuthData(token);
        navigate('/');
        // setTimeout(() => {
        //   navigate('/');
        // }, 3000);
      } else {
        showToast(data.message || 'Login failed', 'error');
      }
    } catch (error) {
      showToast('Network error. Please try again later.', 'error');
    }
  };

  return (
    <div className='flex items-center justify-center min-h-screen bg-gradient-to-r from-indigo-300 via-purple-300 to-blue-300'>
      <div className='w-full max-w-sm p-6 bg-white rounded-lg shadow-lg shadow-blue-300/50'>
        <h2 className='mb-6 text-2xl font-semibold text-center'>Login</h2>

        <form onSubmit={handleSubmit}>
          <div className='mb-4'>
            <label
              htmlFor='identifier'
              className='block text-sm font-medium text-gray-700'
            >
              Username or Email
            </label>
            <input
              type='text'
              id='identifier'
              value={identifier}
              onChange={e => setIdentifier(e.target.value)}
              className='w-full p-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500'
              placeholder='Enter your username or email'
              required
            />
          </div>

          <div className='mb-6'>
            <label
              htmlFor='password'
              className='block text-sm font-medium text-gray-700'
            >
              Password
            </label>
            <input
              type='password'
              id='password'
              value={password}
              onChange={e => setPassword(e.target.value)}
              className='w-full p-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500'
              placeholder='Enter your password'
              required
            />
          </div>

          <button
            type='submit'
            className='w-full py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
