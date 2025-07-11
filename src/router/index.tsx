import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from '../components/Layout';
import { useAuth } from '../hooks/useAuth';
import About from '../pages/About';
import Home from '../pages/Home';
import NotFound from '../pages/NotFound';
import Profile from '../pages/Profile';
import Settings from '../pages/Settings';
import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';
import StoryCreate from '../pages/StoryCreate';
import StoryEdit from '../pages/StoryEdit';
import StoryView from '../pages/StoryView';
import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';

export default function AppRouter() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <div className='w-10 h-10 border-4 border-blue-500 rounded-full border-t-transparent animate-spin' />
      </div>
    );
  }
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicRoute />}>
          <Route path='/login' element={<SignIn />} />
          <Route path='/register' element={<SignUp />} />
        </Route>

        <Route element={<Layout />}>
          <Route path='/' element={<Home />} />
          <Route path='/story/:id' element={<StoryView />} />
          <Route path='/profile/:username' element={<Profile />} />
          <Route path='/about' element={<About />} />
        </Route>

        <Route element={<PrivateRoute />}>
          <Route element={<Layout />}>
            <Route path='/new-story' element={<StoryCreate />} />
            <Route path='/story/:id/edit' element={<StoryEdit />} />
            <Route path='/settings' element={<Settings />} />
          </Route>
        </Route>

        <Route path='*' element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
