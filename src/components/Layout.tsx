import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Footer from './Footer';
import Navbar from './Navbar';

const Layout = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <div className='flex flex-col min-h-screen'>
      <Navbar />
      <main className='flex-grow pt-16'>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
