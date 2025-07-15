import { useTranslation } from 'react-i18next';

const About = () => {
  const { t } = useTranslation();

  return (
    <div className='flex items-center justify-center min-h-screen px-2 py-6 bg-gradient-to-br from-stone-100 via-stone-300 to-stone-400'>
      <div className='w-full max-w-2xl p-4 border shadow-xl sm:p-8 bg-white/80 rounded-xl border-stone-200 backdrop-blur'>
        <h1 className='mb-6 text-2xl font-extrabold text-center sm:text-3xl text-stone-800'>
          {t('about.title')}
        </h1>

        <section className='mb-8'>
          <h2 className='mb-2 text-xl font-semibold sm:text-2xl text-stone-700'>
            {t('about.welcomeTitle')}
          </h2>
          <p className='text-base leading-relaxed text-stone-700'>
            {t('about.welcomeParagraph')}
          </p>
        </section>

        <section className='mb-8'>
          <h2 className='mb-2 text-xl font-semibold sm:text-2xl text-stone-700'>
            {t('about.featuresTitle')}
          </h2>
          <ul className='space-y-2 text-base list-disc list-inside text-stone-700'>
            {(t('about.featuresList', { returnObjects: true }) as string[]).map(
              (item: string, idx: number) => (
                <li key={idx}>{item}</li>
              )
            )}
          </ul>
        </section>

        <section className='mb-8'>
          <h2 className='mb-2 text-xl font-semibold sm:text-2xl text-stone-700'>
            {t('about.techTitle')}
          </h2>
          <ul className='space-y-1 text-base list-disc list-inside text-stone-700'>
            <li>Frontend: Vite + React + TypeScript</li>
            <li>Backend: Express + TypeScript</li>
            <li>Database: PostgreSQL</li>
            <li>Editor: MDX Editor</li>
            <li>UI: Tailwind CSS</li>
            <li>State: Fetch API, React Query</li>
            <li>Routing: React Router</li>
            <li>Localization: i18next</li>
            <li>Authentication: JWT-based</li>
          </ul>
        </section>

        <section className='mb-8'>
          <h2 className='mb-2 text-xl font-semibold sm:text-2xl text-stone-700'>
            {t('about.getInvolvedTitle')}
          </h2>
          <p className='text-base text-stone-700'>
            {t('about.getInvolvedText')}&nbsp;
            <a
              href='https://github.com/sakib62/memento-frontend'
              target='_blank'
              rel='noopener noreferrer'
              className='font-medium text-blue-600 underline'
            >
              memento
            </a>
          </p>
        </section>

        <div className='mt-6 text-xs text-center text-stone-500'>
          &copy; {new Date().getFullYear()} Memento. {t('about.footer')}
        </div>
      </div>
    </div>
  );
};

export default About;
