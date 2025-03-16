import { BrowserRouter, Route, Routes } from 'react-router-dom';
import PrivateRoute from '../components/PrivateRoute';
import EditStory from '../pages/EditStory';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Profile from '../pages/Profile';
import Register from '../pages/Register';
import StoryDetails from '../pages/StoryDetails';
import Write from '../pages/Write';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />

        <Route element={<PrivateRoute />}>
          <Route path='/' element={<Home />} />
          <Route path='/write' element={<Write />} />
          <Route path='/story/:id' element={<StoryDetails />} />
          <Route path='/story/:id/edit' element={<EditStory />} />
          <Route path='/profile/:username' element={<Profile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
