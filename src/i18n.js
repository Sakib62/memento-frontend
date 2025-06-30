import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import no from './locales/no.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      no: { translation: no },
    },
    //lng: localStorage.getItem('memento_preferredLang') || 'en',
    fallbackLng: 'en',
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'memento_preferredLang',
      caches: [],
    },
    interpolation: { escapeValue: false },
  });

export default i18n;
