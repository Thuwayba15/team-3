import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enCommon from './locales/en/common.json';
import zuCommon from './locales/zu/common.json';
import stCommon from './locales/st/common.json';
import afCommon from './locales/af/common.json';

const resources = {
  en: {
    common: enCommon,
  },
  zu: {
    common: zuCommon,
  },
  st: {
    common: stCommon,
  },
  af: {
    common: afCommon,
  },
};

if (!i18n.isInitialized) {
  i18n
    .use(initReactI18next)
    .init({
      resources,
      defaultNS: 'common',
      fallbackLng: 'en',
      interpolation: {
        escapeValue: false, // React already handles escaping
      },
      detection: {
        order: ['localStorage', 'navigator'],
        caches: ['localStorage'],
      },
    });
}

export default i18n;
