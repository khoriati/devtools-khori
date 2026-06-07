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
| Plugin (vendored) | `web/public/vlibras/vlibras-plugin.js` | The ~17 KB plugin, **self-hosted** (see "Why self-hosted" below) |
| CSP | [`server/index.js`](../server/index.js) | Allows the `*.vlibras.gov.br` origins + `wasm-unsafe-eval` |

## Why self-hosted (Tracking Prevention)

The official `https://vlibras.gov.br/app/vlibras-plugin.js` is a *loader* that
pulls the real plugin from **cdn.jsdelivr.net**. Browsers with Tracking
Prevention (Edge, Safari) classify that CDN as third-party and **block its
storage access**, which breaks the widget (`Tracking Prevention blocked access
to storage for https://cdn.jsdelivr.net/...`).

Fix: vendor the small plugin and serve it **first-party** from
`/vlibras/vlibras-plugin.js`. The heavy avatar/dictionary/translation assets are
still fetched at runtime from `*.vlibras.gov.br` (`www`, `dicionario2`,
`traducao2`) — a government domain that is **not** tracking-prevented.

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
// Load once (self-hosted, first-party):  /vlibras/vlibras-plugin.js
new window.VLibras.Widget('https://vlibras.gov.br/app');
```

## Content-Security-Policy requirements

The 3D avatar runs on WebAssembly, so the CSP must allow:

- `script-src`: `'self'` (the vendored plugin), `https://vlibras.gov.br`,
  `https://*.vlibras.gov.br` (Unity loader from `www.vlibras.gov.br`),
  `'wasm-unsafe-eval'` (enables wasm compilation **without** allowing `eval()`)
  and `blob:`;
- `connect-src` / `img-src` / `media-src` / `font-src`: `https://vlibras.gov.br`
  and `https://*.vlibras.gov.br` (translation service, dictionary and assets);
- `worker-src`: `'self' blob:`.

No third-party CDN (jsDelivr) is referenced.

These origins are harmless for the other languages (they are simply never used).

## Other languages — sign.mt

For English, Spanish, German and French we embed **[sign.mt](https://sign.mt)**
(source: [github.com/sign/translate](https://github.com/sign/translate)), an
open-source sign-language translator whose models run **on-device** — so there is
**no API key and no paid SaaS**. It is shown as an accessible dialog opened by a
floating "Sign language" button.

| Piece | File | Role |
| --- | --- | --- |
| Widget | [`web/src/components/SignMtWidget.tsx`](../web/src/components/SignMtWidget.tsx) | Floating button + MUI dialog with the sign.mt `<iframe>` |
| CSP | [`server/index.js`](../server/index.js) | `frame-src 'self' https://sign.mt` |

The language pair is preselected via sign.mt's URL params — `spl` (spoken) and
`sil` (signed, ISO 639-3 sign-language code):

| UI language | `spl` | `sil` | Sign language |
| --- | --- | --- | --- |
| en-US | `en` | `ase` | American SL (ASL) |
| es | `es` | `ssp` | Spanish SL |
| de | `de` | `gsg` | German SL (DGS) |
| fr | `fr` | `fsl` | French SL (LSF) |

Why an iframe (not self-hosted)? sign.mt is a large Angular + TensorFlow.js PWA;
embedding the hosted, open-source app keeps it keyless and current without
vendoring tens of MB of models. The MUI `Dialog` provides a focus trap,
`Esc`-to-close and `aria-modal`; the `<iframe>` has a `title`.

## Extending to other languages

- **VLibras** (`VLibrasWidget.tsx` → `SIGN_LANGUAGE_LANGS`): only for Portuguese.
- **sign.mt** (`SignMtWidget.tsx` → `SIGN_MT`): add a `{ spl, sil }` entry for a
  new UI language. If a language has no free/keyless option, leave it out of both
  and nothing is shown. Avoid overlay widgets that require an account or API key.
