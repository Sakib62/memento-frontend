import { useContext, useState } from 'react';
import { Navigate } from 'react-router-dom';
import BlogEditor from '../components/BlogEditor';
import Navbar from '../components/Navbar';
import { AuthContext } from '../context/AuthContext';

const Write = () => {
  const authContext = useContext(AuthContext);
  if (!authContext?.token) {
    return <Navigate to='/login' />;
  }
  const { token, username, name } = authContext;

  const [title, setTitle] = useState('');
  const [markdownContent, setMarkdownContent] = useState('');

  const handleContentChange = (content: string) => {
    setMarkdownContent(content);
  };

  const handleSubmit = async () => {
    const storyData = {
      title: title,
      description: markdownContent,
      authorusername: username,
      authorName: name,
    };

    try {
      const response = await fetch('http://localhost:3000/api/stories/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(storyData),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Story created:', data);
      } else {
        console.error('Error creating story:', data);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className='flex flex-col min-h-screen'>
      <Navbar />

      <div className='flex flex-col items-center justify-start flex-grow px-4 pt-24'>
        <h1 className='text-3xl font-bold mb-6'>Create New Blog</h1>
        <div className='w-full max-w-2xl'>
          <input
            type='text'
            placeholder='Enter blog title...'
            value={title}
            onChange={e => setTitle(e.target.value)}
            className='w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 mb-4 text-lg'
          />
        </div>
        <BlogEditor onContentChange={handleContentChange} />
        <button
          onClick={handleSubmit}
          className='mt-6 px-4 py-2 bg-blue-500 text-white font-semibold rounded-md shadow-md hover:bg-blue-600'
        >
          Submit Blog
        </button>
      </div>
    </div>
  );
};

export default Write;
