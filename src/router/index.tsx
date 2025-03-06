import { BrowserRouter, Route, Routes } from 'react-router-dom';
import PrivateRoute from '../components/PrivateRoute';
import Dashboard from '../pages/Dashboard';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        
        <Route element={<PrivateRoute />}>
          <Route path='/' element={<Home />} />
          <Route path='/dashboard' element={<Dashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
