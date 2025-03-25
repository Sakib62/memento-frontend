import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import no from './locales/no.json';

i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    resources: {
      en: { translation: en },
      no: { translation: no },
    },
    lng: 'en', // Default language
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
  });

export default i18n;
