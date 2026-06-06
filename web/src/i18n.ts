import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import ptBR from './locales/pt-BR.json';
import enUS from './locales/en-US.json';
import es from './locales/es.json';
import de from './locales/de.json';
import fr from './locales/fr.json';

export const SUPPORTED_LANGUAGES = ['pt-BR', 'en-US', 'es', 'de', 'fr'] as const;
export type Language = (typeof SUPPORTED_LANGUAGES)[number];

// Map a browser-detected code (e.g. "es-ES", "de-AT") to a supported language.
const convertDetectedLanguage = (lng: string): string => {
  const l = lng.toLowerCase();
  if (l.startsWith('pt')) return 'pt-BR';
  if (l.startsWith('en')) return 'en-US';
  if (l.startsWith('es')) return 'es';
  if (l.startsWith('de')) return 'de';
  if (l.startsWith('fr')) return 'fr';
  return lng;
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      'pt-BR': { translation: ptBR },
      'en-US': { translation: enUS },
      es: { translation: es },
      de: { translation: de },
      fr: { translation: fr },
    },
    fallbackLng: 'pt-BR',
    supportedLngs: SUPPORTED_LANGUAGES as unknown as string[],
    // Initialise synchronously so the very first render already has resources.
    initImmediate: false,
    react: { useSuspense: false },
    interpolation: { escapeValue: false },
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'devtools-lang',
      caches: ['localStorage'],
      convertDetectedLanguage,
    },
  });

// Keep <html lang> in sync for assistive technology (WCAG 3.1.1 / 3.1.2).
const applyLang = (lng: string) => {
  document.documentElement.lang = lng;
};
applyLang(i18n.language);
i18n.on('languageChanged', applyLang);

export default i18n;
