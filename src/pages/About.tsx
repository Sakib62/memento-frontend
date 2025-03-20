const About = () => {
  return (
    <div className='flex flex-col h-screen px-6 py-12 mx-auto dark:bg-stone-700'>
      <h1 className='mb-8 text-3xl font-bold text-center dark:text-gray-100'>About Memento</h1>

      <section className='mb-8'>
        <h2 className='mb-4 text-2xl font-semibold dark:text-gray-100'>Why Memento?</h2>
        <p className='text-gray-700 dark:text-gray-300'>
          Memento is a space to share stories, ideas, and experiences. Whether
          you're documenting life moments or expressing your thoughts, this
          platform is designed to make sharing easy and enjoyable.
        </p>
      </section>

      <section className='mb-8'>
        <h2 className='mb-4 text-2xl font-semibold dark:text-gray-100'>What You Can Do</h2>
        <ul className='text-gray-700 list-disc list-inside dark:text-gray-300'>
          <li>Create and share your stories with ease.</li>
          <li>Engage with others through likes and comments.</li>
          <li>Search for stories that interest you.</li>
          <li>Enjoy a smooth experience with light and dark mode.</li>
        </ul>
      </section>

      <section>
        <h2 className='mb-4 text-2xl font-semibold dark:text-white'>Connect With Me</h2>
        <p className='text-gray-700 dark:text-gray-300'>
          Have feedback or ideas? Feel free to{' '}
          <a
            href='https://github.com/sakib62'
            target='_blank'
            rel='noopener noreferrer'
            className='text-blue-500 hover:underline'
          >
            visit my GitHub
          </a>
          .
        </p>
      </section>
    </div>
  );
};

export default About;
