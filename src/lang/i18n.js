import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

const Languages = ['de','en'];

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    backend: {
      loadPath: '/apps/gama-stock/locales/{{lng}}/{{ns}}.json'
    },
    fallbackLng: 'de',
    debug: false,
    whitelist: Languages,
    interpolation: {
      escapeValue: false,
    }
  });


export default i18n;