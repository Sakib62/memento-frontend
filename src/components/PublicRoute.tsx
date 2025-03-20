import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const PublicRoute = () => {
  const authContext = useContext(AuthContext);

  if (authContext?.loading) {
    return <div>Loading...</div>;
  }

  // if (!authContext?.token) {
  //   return <Navigate to='/login' />;
  // }

  const { token } = authContext;
  return token ? <Navigate to='/' /> : <Outlet />;
};

export default PublicRoute;
