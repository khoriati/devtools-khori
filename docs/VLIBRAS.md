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
| CSP | [`server/index.js`](../server/index.js) | Allows `*.vlibras.gov.br` + `cdn.jsdelivr.net` + `wasm-unsafe-eval` |

## Why load it from the official gov.br URL (not self-hosted)

The plugin derives its asset/chunk base (webpack `publicPath`) from **its own
script URL** (`document.currentScript.src`). So it must be loaded from
`https://vlibras.gov.br/app/vlibras-plugin.js` for the icon/avatar assets to
resolve (e.g. `…/app/assets/access_icon.svg`). Self-hosting only the entry script
breaks this — the plugin then looks for `…/assets/…` and chunks under our origin
and renders an **empty (invisible) button**.

The gov.br loader pulls the plugin from `cdn.jsdelivr.net` and the
icons/avatar/dictionary from `*.vlibras.gov.br`, so the CSP allows both. Some
browsers log `Tracking Prevention blocked access to storage for cdn.jsdelivr.net`
— this is **non-fatal**: it only denies third-party *storage*, the button and
avatar still render. Fully vendoring is impractical (the avatar is a large Unity
app).

The widget DOM lives in `index.html` because the plugin **mutates that DOM
directly** — React must not own it (it would fight the plugin over the subtree).
The React component only toggles visibility, lazy-loads the script and pins the
button to the right edge.

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
// Load once from the official URL (publicPath is derived from this script's src):
//   https://vlibras.gov.br/app/vlibras-plugin.js
new window.VLibras.Widget('https://vlibras.gov.br/app');
```

## Content-Security-Policy requirements

The 3D avatar runs on WebAssembly, so the CSP must allow:

- `script-src`: `https://vlibras.gov.br`, `https://*.vlibras.gov.br`,
  `https://cdn.jsdelivr.net` (the plugin is served from jsDelivr),
  `'wasm-unsafe-eval'` (enables wasm compilation **without** allowing `eval()`)
  and `blob:`;
- `connect-src` / `img-src` / `media-src` / `font-src`: `https://vlibras.gov.br`,
  `https://*.vlibras.gov.br` and `https://cdn.jsdelivr.net` (translation service,
  dictionary, icons and assets).
- `worker-src`: `'self' blob:`.

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

It opens **pre-filled with what is on screen**: the user's current text selection
(captured on pointer-down, since the click can clear it) or, as a fallback, the
main content text. The text stays **editable and re-translatable** inside the
dialog, so a Deaf user can immediately translate the current page dynamically.

The language pair + text are passed via sign.mt's URL params — `spl` (spoken),
`sil` (signed, ISO 639-3 sign-language code) and `text`:

| UI language | `spl` | `sil` | Sign language |
| --- | --- | --- | --- |
| en-US | `en` | `ase` | American SL (ASL) |
| es | `es` | `ssp` | Spanish SL |
| de | `de` | `gsg` | German SL (DGS) |
| fr | `fr` | `fsl` | French SL (LSF) |

Why an iframe (not self-hosted/vendored)? The sign.mt repo
([github.com/sign/translate](https://github.com/sign/translate)) is a **~1.2 GB**
Ionic/Angular + Capacitor app (native projects + on-device ML models, custom
license) — impractical and license-uncertain to freeze in this repo. Embedding
the hosted, open-source app keeps it keyless, current and lightweight; we depend
only on the stable `spl`/`sil`/`text` URL contract. The MUI `Dialog` provides a
focus trap, `Esc`-to-close and `aria-modal`; the `<iframe>` has a `title`.

## Extending to other languages

- **VLibras** (`VLibrasWidget.tsx` → `SIGN_LANGUAGE_LANGS`): only for Portuguese.
- **sign.mt** (`SignMtWidget.tsx` → `SIGN_MT`): add a `{ spl, sil }` entry for a
  new UI language. If a language has no free/keyless option, leave it out of both
  and nothing is shown. Avoid overlay widgets that require an account or API key.
