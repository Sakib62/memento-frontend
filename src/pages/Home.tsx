import Navbar from '../components/Navbar';

const Home = () => {
  return (
    <div className='flex flex-col min-h-screen bg-cyan-300'>
      <Navbar />

      {/* Main Layout */}
      <div className='flex flex-1 w-full justify-center p-6 mt-5'>
        {/* Main Content */}
        <div className='w-full max-w-3xl bg-white p-6 rounded-lg shadow-md'>
          <h2 className='text-2xl font-semibold mb-4'>Latest Blogs</h2>
          {/* Dummy Blog Cards (Replace with actual data later) */}
          <div className='space-y-4'>
            <div className='p-4 bg-gray-200 rounded-md shadow'>
              <h3 className='text-xl font-bold'>Blog Title 1</h3>
              <p className='text-gray-700'>Short description of the blog...</p>
            </div>
            <div className='p-4 bg-gray-200 rounded-md shadow'>
              <h3 className='text-xl font-bold'>Blog Title 2</h3>
              <p className='text-gray-700'>Another blog description...</p>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className='w-1/4 p-4 bg-gray-200 ml-6 rounded-lg shadow-md'>
          <h3 className='text-lg font-semibold'>Trending</h3>
          <ul className='mt-2 text-gray-700'>
            <li>🔥 Trending Blog 1</li>
            <li>📖 Trending Blog 2</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Home;
