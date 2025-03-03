import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { auth } from './translations/auth';
import { navigation } from './translations/navigation';
import { streams } from './translations/streams';

const resources = {
  ru: {
    translation: {
      ...auth.ru,
      ...navigation.ru,
      ...streams.ru,
    }
  },
  en: {
    translation: {
      ...auth.en,
      ...navigation.en,
      ...streams.en,
    }
  },
  es: {
    translation: {
      ...auth.es,
      ...navigation.es,
      ...streams.es,
    }
  },
  ja: {
    translation: {
      ...auth.ja,
      ...navigation.ja,
      ...streams.ja,
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "ru",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;