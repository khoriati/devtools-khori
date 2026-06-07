import { useEffect, useRef } from 'react';
import { useSettings } from '../context/SettingsContext';

/**
 * VLibras integration — Brazilian Portuguese Sign Language (Libras).
 *
 * VLibras (https://www.gov.br/governodigital/pt-br/vlibras) is the official,
 * open-source, *keyless* sign-language widget from the Brazilian government. It
 * adds a floating accessibility button that opens a 3D avatar which signs the
 * page's Portuguese text in Libras — essential for many Deaf users, for whom
 * Portuguese is a second language.
 *
 * Why only pt-BR? VLibras translates *Portuguese*. There is no comparable free,
 * no-signup, no-API-key sign-language widget for en/es/de/fr, so for those
 * languages we simply omit the feature (the button never appears).
 *
 * How it works here:
 *  - The required markup (`<div vw>…`) lives in index.html, OUTSIDE the React
 *    tree, because the plugin mutates that DOM directly (React must not own it).
 *  - This component only (a) toggles the widget's visibility based on the chosen
 *    language and (b) lazy-loads the official plugin once, then initialises it.
 *
 * Integration & CSP notes (didactic): docs/VLIBRAS.md
 *   https://github.com/khoriati/devtools-khori/blob/main/docs/VLIBRAS.md
 */

// Languages that have an integrated, free, no-signup sign-language solution.
const SIGN_LANGUAGE_LANGS = new Set<string>(['pt-BR']);

const PLUGIN_SRC = 'https://vlibras.gov.br/app/vlibras-plugin.js';
const PLUGIN_APP = 'https://vlibras.gov.br/app';

// The plugin attaches a global `VLibras` with a `Widget` constructor.
declare global {
  interface Window {
    VLibras?: { Widget: new (appUrl: string) => unknown };
  }
}

export default function VLibrasWidget() {
  const { language } = useSettings();
  // Guard so the widget is initialised exactly once for the page lifetime.
  const initialized = useRef(false);

  useEffect(() => {
    const container = document.querySelector<HTMLElement>('[vw]');
    if (!container) return;

    const enabled = SIGN_LANGUAGE_LANGS.has(language);
    // Show/hide the whole widget — including its floating access button —
    // without destroying the plugin's DOM (so it survives language switches).
    container.style.display = enabled ? 'block' : 'none';
    if (!enabled || initialized.current) return;

    const init = () => {
      if (window.VLibras && !initialized.current) {
        // Mount the avatar/access button inside the `<div vw>` container.
        // eslint-disable-next-line no-new
        new window.VLibras.Widget(PLUGIN_APP);
        initialized.current = true;
      }
    };

    if (window.VLibras) {
      init();
      return;
    }

    // Load the official plugin only on demand (first time pt-BR is active).
    const existing = document.getElementById('vlibras-plugin') as HTMLScriptElement | null;
    if (existing) {
      existing.addEventListener('load', init);
      return;
    }
    const script = document.createElement('script');
    script.id = 'vlibras-plugin';
    script.src = PLUGIN_SRC;
    script.async = true;
    script.onload = init;
    document.body.appendChild(script);
  }, [language]);

  // This component renders nothing itself; it drives the index.html `<div vw>`.
  return null;
}
