import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaChevronDown } from 'react-icons/fa';
import Flag from 'react-world-flags';

const languages = [
  { code: 'en', label: 'EN', flag: 'US' },
  { code: 'no', label: 'NO', flag: 'NO' },
  { code: 'bn', label: 'BN', flag: 'BD' },
];

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);

  const currentLang =
    languages.find(lang => lang.code === i18n.language) || languages[0];

  const handleLanguageChange = (langCode: string) => {
    i18n.changeLanguage(langCode);
    localStorage.setItem('memento_preferredLang', langCode);
    setOpen(false);
  };

  return (
    <div className='relative inline-block text-left'>
      <button
        onClick={() => setOpen(prev => !prev)}
        className='flex items-center gap-1 p-1 text-white bg-transparent md:gap-2 md:px-2 hover:bg-opacity-20'
      >
        <Flag code={currentLang.flag} className='w-3 h-3 md:h-4 md:w-4' />
        <span className='text-xs md:text-base'>{currentLang.label}</span>
        <FaChevronDown
          className={`w-3 h-3 md:w-4 md:h-4 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div className='absolute z-10 w-16 mt-2 bg-white rounded-md shadow-lg md:w-24 ring-1 ring-black ring-opacity-5'>
          {languages.map(lang => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className='flex items-center w-full p-2 text-sm text-gray-700 rounded-md md:px-2 hover:bg-sky-100'
            >
              <Flag code={lang.flag} className='w-3 h-3 mr-2 md:h-4 md:w-4' />
              <span className='text-xs md:text-base'>{lang.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
