import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const PrivateRoute = () => {
  const authContext = useContext(AuthContext);

  if (authContext?.loading) {
    return <div>Loading...</div>; // Or a spinner while checking the token
  }

  if (!authContext?.token) {
    console.log('Redirecting to login...');
    return <Navigate to='/login' />;
  }

  return <Outlet />;
};

export default PrivateRoute;
