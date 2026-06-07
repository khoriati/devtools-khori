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

// The plugin (~17 KB) is SELF-HOSTED (vendored in web/public/vlibras/) instead
// of loaded from cdn.jsdelivr.net. The gov.br loader redirects to jsDelivr, and
// browsers with Tracking Prevention (Edge/Safari) block storage for that
// third-party CDN, breaking the widget. Served first-party, it is not blocked.
// The heavy avatar/dictionary assets are still fetched at runtime from
// *.vlibras.gov.br (a gov domain that is not tracking-prevented). See docs/VLIBRAS.md.
const PLUGIN_SRC = '/vlibras/vlibras-plugin.js';
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
    if (!enabled) return;

    // The plugin sets its own position/margins (and repositions dynamically),
    // leaving a gap from the right edge. We pin it to the right side at top:150px
    // with INLINE !important styles (which beat any stylesheet) and re-apply them
    // whenever the plugin mutates the widget — so the button stays flush at right:0.
    let observer: MutationObserver | null = null;
    const pin = () => {
      observer?.disconnect(); // avoid reacting to our own style writes
      const set = (el: HTMLElement, prop: string, val: string) => el.style.setProperty(prop, val, 'important');
      set(container, 'position', 'fixed');
      set(container, 'top', '150px');
      set(container, 'right', '0');
      set(container, 'left', 'auto');
      set(container, 'bottom', 'auto');
      set(container, 'margin', '0');
      const btn = container.querySelector<HTMLElement>('[vw-access-button]');
      if (btn) {
        set(btn, 'right', '0');
        set(btn, 'left', 'auto');
      }
      if (observer) observer.observe(container, { attributes: true, attributeFilter: ['style'], childList: true, subtree: true });
    };
    observer = new MutationObserver(pin);
    pin();

    const cleanup = () => observer?.disconnect();

    const init = () => {
      if (window.VLibras && !initialized.current) {
        // Mount the avatar/access button inside the `<div vw>` container.
        // eslint-disable-next-line no-new
        new window.VLibras.Widget(PLUGIN_APP);
        initialized.current = true;
        pin(); // re-pin once the avatar/button is mounted
      }
    };

    if (!initialized.current) {
      if (window.VLibras) {
        init();
      } else {
        // Load the official plugin only on demand (first time pt-BR is active).
        const existing = document.getElementById('vlibras-plugin') as HTMLScriptElement | null;
        if (existing) {
          existing.addEventListener('load', init);
        } else {
          const script = document.createElement('script');
          script.id = 'vlibras-plugin';
          script.src = PLUGIN_SRC;
          script.async = true;
          script.onload = init;
          document.body.appendChild(script);
        }
      }
    }

    return cleanup;
  }, [language]);

  // This component renders nothing itself; it drives the index.html `<div vw>`.
  return null;
}
