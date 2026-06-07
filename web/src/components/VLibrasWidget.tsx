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

// Load the OFFICIAL gov.br loader. The plugin derives its asset/chunk base
// (webpack publicPath) from its own script URL, so it MUST be loaded from
// vlibras.gov.br for the icon/avatar assets to resolve — self-hosting only the
// entry breaks them. The loader pulls the plugin from cdn.jsdelivr.net and the
// icons/avatar from *.vlibras.gov.br (hence the CSP allowances in server/index.js).
// Note: the "Tracking Prevention blocked storage for jsdelivr" notice some
// browsers log is non-fatal — the button and avatar still render. See docs/VLIBRAS.md.
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

    // IMPORTANT: do not mutate the widget's DOM/styles while the plugin builds
    // it — doing so (e.g. via a MutationObserver) makes the plugin render an
    // empty button. Positioning is handled purely in CSS (index.css `div[vw]`).
    const init = () => {
      if (window.VLibras && !initialized.current) {
        // eslint-disable-next-line no-new
        new window.VLibras.Widget(PLUGIN_APP);
        initialized.current = true;
        // The plugin renders on the window 'load' event — which ALREADY fired in
        // this SPA (the script is injected later). Re-dispatch it so the access
        // button/avatar actually render. Without this the button is an empty box.
        window.dispatchEvent(new Event('load'));
        // Once rendered, pin the widget flush to the right edge (the plugin adds
        // margin:10px). One-shot inline override — no persistent observer, which
        // would interfere with the plugin building the button.
        window.setTimeout(() => {
          document.querySelector<HTMLElement>('[vw]')?.style.setProperty('margin', '0', 'important');
        }, 1200);
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
