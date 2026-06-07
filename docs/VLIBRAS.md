# VLibras (Libras / Brazilian Sign Language) — integration guide

> Repository: https://github.com/khoriati/devtools-khori

[VLibras](https://www.gov.br/governodigital/pt-br/vlibras) is the Brazilian
government's **open-source, keyless** widget that translates Portuguese text into
**Libras** (Brazilian Sign Language) using a 3D avatar. Many Deaf people use
Libras as a first language and Portuguese as a second, so a sign-language layer
is a meaningful accessibility win — not just captions or contrast.

This project enables VLibras **only when the chosen language is `pt-BR`**. There
is no comparable free, no-signup, no-API-key sign-language widget for English,
Spanish, German or French, so for those languages the feature is simply **omitted**
(no button is shown), as required.

## How it is wired here

| Piece | File | Role |
| --- | --- | --- |
| Markup | [`web/index.html`](../web/index.html) | The official `<div vw>` container, kept **outside** the React root |
| Controller | [`web/src/components/VLibrasWidget.tsx`](../web/src/components/VLibrasWidget.tsx) | Loads the plugin once and shows/hides it by language |
| CSP | [`server/index.js`](../server/index.js) | Allows the `vlibras.gov.br` origins + `wasm-unsafe-eval` |

The widget DOM lives in `index.html` because the plugin **mutates that DOM
directly** — React must not own it (it would fight the plugin over the subtree).
The React component only toggles visibility and lazy-loads the script.

### The required markup and its attributes

```html
<div vw class="enabled" lang="pt-BR">      <!-- vw: root container; "enabled" activates it; lang marks the PT content -->
  <div vw-access-button class="active"></div><!-- the floating accessibility button -->
  <div vw-plugin-wrapper>                     <!-- where the plugin injects the 3D avatar/player -->
    <div class="vw-plugin-top-wrapper"></div> <!-- internal anchor used by the plugin -->
  </div>
</div>
```

### Initialisation

```js
// Load once:  https://vlibras.gov.br/app/vlibras-plugin.js
new window.VLibras.Widget('https://vlibras.gov.br/app');
```

## Content-Security-Policy requirements

The 3D avatar runs on WebAssembly, so the CSP must allow:

- `script-src`: `https://vlibras.gov.br`, `https://cdn.jsdelivr.net` and
  `'wasm-unsafe-eval'` (enables wasm compilation **without** allowing `eval()`),
  plus `blob:`. The gov.br loader pulls the real plugin + Unity/WASM assets from
  jsDelivr, so that CDN must be allowed as well;
- `connect-src` / `img-src` / `media-src` / `font-src`: `https://vlibras.gov.br`,
  `https://*.vlibras.gov.br` and `https://cdn.jsdelivr.net` (translation service,
  dictionary and assets);
- `worker-src`: `'self' blob:`.

These origins are harmless for the other languages (they are simply never used).

## Extending to other languages

Add the language code to `SIGN_LANGUAGE_LANGS` in `VLibrasWidget.tsx` **only** if
a free, keyless, embeddable sign-language solution exists for it, and wire its
loader analogously. Avoid overlay widgets that require an account or API key.
