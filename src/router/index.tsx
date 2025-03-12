import { BrowserRouter, Route, Routes } from 'react-router-dom';
import PrivateRoute from '../components/PrivateRoute';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Profile from '../pages/Profile';
import Register from '../pages/Register';
import Write from '../pages/Write';
import BlogDetail from '../pages/BlogDetail';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />

        <Route path='/blog/:id' element={<BlogDetail />} />

        <Route element={<PrivateRoute />}>
          <Route path='/' element={<Home />} />
          <Route path='/profile' element={<Profile />} />
          <Route path="/write" element={<Write />} /> 
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
