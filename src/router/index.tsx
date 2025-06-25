import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from '../components/Layout';
import PrivateRoute from '../components/PrivateRoute';
import PublicRoute from '../components/PublicRoute';
import About from '../pages/About';
import Home from '../pages/Home';
import NotFound from '../pages/NotFound';
import Profile from '../pages/Profile';
import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';
import StoryCreate from '../pages/StoryCreate';
import StoryEdit from '../pages/StoryEdit';
import StoryView from '../pages/StoryView';

export default function AppRouter() {
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
          </Route>
        </Route>

        <Route path='*' element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
