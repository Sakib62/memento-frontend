import { useTranslation } from 'react-i18next';
import Flag from 'react-world-flags'; // Import the Flag component

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'no' : 'en';
    i18n.changeLanguage(newLang);
  };

  return (
    <button
      onClick={toggleLanguage}
      className='flex items-center gap-2 text-white'
    >
      <div className='flex items-center justify-center w-12 h-6'>
        <Flag code={i18n.language === 'no' ? 'NO' : 'US'} className='w-4 h-4' />
        <span className='ml-2'>{i18n.language === 'no' ? 'NO' : 'EN'}</span>
      </div>
    </button>
  );
};

export default LanguageSwitcher;
