import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import ptBR from './locales/pt-BR.json';
import enUS from './locales/en-US.json';

export const SUPPORTED_LANGUAGES = ['pt-BR', 'en-US'] as const;
export type Language = (typeof SUPPORTED_LANGUAGES)[number];

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      'pt-BR': { translation: ptBR },
      'en-US': { translation: enUS },
    },
    fallbackLng: 'pt-BR',
    supportedLngs: SUPPORTED_LANGUAGES as unknown as string[],
    nonExplicitSupportedLngs: true,
    interpolation: { escapeValue: false },
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'devtools-lang',
      caches: ['localStorage'],
    },
  });

// Keep <html lang> in sync for assistive technology (WCAG 3.1.1 / 3.1.2).
const applyLang = (lng: string) => {
  document.documentElement.lang = lng;
};
applyLang(i18n.language);
i18n.on('languageChanged', applyLang);

export default i18n;
