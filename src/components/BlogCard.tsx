const BlogCard = ({ title, description }: { title: string; description: string }) => {
    return (
      <div className='bg-white p-4 rounded-lg shadow-md'>
        <h3 className='text-xl font-bold'>{title}</h3>
        <p className='text-gray-600'>{description}</p>
      </div>
    );
  };
  
  export default BlogCard;
  