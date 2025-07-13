import { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from '../components/Layout';
import HomePageSkeleton from '../components/Skeleton/HomePageSkeleton';
import ProfilePageSkeleton from '../components/Skeleton/ProfilePageSkeleton';
import SettingsPageSkeleton from '../components/Skeleton/SettingsPageSkeleton';
import SkeletonStoryEdit from '../components/Skeleton/SkeletonStoryEdit';
import SkeletonStoryView from '../components/Skeleton/SkeletonStoryView';
import { useAuth } from '../hooks/useAuth';
import About from '../pages/About';
import NotFound from '../pages/NotFound';
import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';
import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';

const Home = lazy(() => import('../pages/Home'));
const Profile = lazy(() => import('../pages/Profile'));
const StoryView = lazy(() => import('../pages/StoryView'));
const StoryEdit = lazy(() => import('../pages/StoryEdit'));
const StoryCreate = lazy(() => import('../pages/StoryCreate'));
const Settings = lazy(() => import('../pages/Settings'));

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
          <Route
            path='/'
            element={
              <Suspense fallback={<HomePageSkeleton />}>
                <Home />
              </Suspense>
            }
          />
          <Route
            path='/story/:id'
            element={
              <Suspense fallback={<SkeletonStoryView />}>
                <StoryView />
              </Suspense>
            }
          />
          <Route
            path='/profile/:username'
            element={
              <Suspense fallback={<ProfilePageSkeleton />}>
                <Profile />
              </Suspense>
            }
          />
          <Route path='/about' element={<About />} />
        </Route>

        <Route element={<PrivateRoute />}>
          <Route element={<Layout />}>
            <Route
              path='/new-story'
              element={
                <Suspense fallback={<SkeletonStoryEdit />}>
                  <StoryCreate />
                </Suspense>
              }
            />
            <Route
              path='/story/:id/edit'
              element={
                <Suspense fallback={<SkeletonStoryEdit />}>
                  <StoryEdit />
                </Suspense>
              }
            />
            <Route
              path='/settings'
              element={
                <Suspense fallback={<SettingsPageSkeleton />}>
                  <Settings />
                </Suspense>
              }
            />
          </Route>
        </Route>

        <Route path='*' element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
