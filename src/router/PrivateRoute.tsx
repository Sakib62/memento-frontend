import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const PrivateRoute = () => {
  const { token } = useAuth();

  // useEffect(() => {
  //   if (!token) {
  //     toast.error(t('sign-out.auto'));
  //   }
  // }, [token]);

  return token ? <Outlet /> : <Navigate to='/' />;
};

export default PrivateRoute;
