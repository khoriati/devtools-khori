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
  `https://cdn.jsdelivr.net` (the plugin is served from jsDelivr), `blob:`,
  `'wasm-unsafe-eval'` **and `'unsafe-eval'`** — the avatar is an older Unity
  (asm.js/`.unityweb`) build that calls `eval()`, so `'unsafe-eval'` is required
  for it to run. Inline scripts stay blocked (no `'unsafe-inline'`), and the app
  WAF + input validation still apply, so this is a scoped trade-off to enable the
  Libras avatar;
- **Note:** the plugin renders on the `window` `load` event; since this is an SPA
  (the script is injected after `load` fired), `VLibrasWidget` re-dispatches a
  `load` event after `new VLibras.Widget()` so the avatar/button actually render.
- `connect-src` / `img-src` / `media-src` / `font-src`: `https://vlibras.gov.br`,
  `https://*.vlibras.gov.br` and `https://cdn.jsdelivr.net` (translation service,
  dictionary, icons and assets).
- `worker-src`: `'self' blob:`.

These origins are harmless for the other languages (they are simply never used).

## Other languages — no sign-language layer (for now)

VLibras translates **Portuguese** only. For English, Spanish, German and French
there is currently **no free, keyless and self-hostable** sign-language avatar
that meets this project's bar, so the feature is simply **omitted** for those
languages (no button is shown).

> A previous embed of the hosted sign.mt translator was removed: it was not
> practical as an inline widget, and a fully self-hosted pipeline is not viable
> (its core text→pose step is an external proprietary service and the project is
> not freely licensed for commercial use). See the feasibility study for details.

## Extending to other languages

Add a language code to `SIGN_LANGUAGE_LANGS` in `VLibrasWidget.tsx` **only** if a
free, keyless, embeddable sign-language solution exists for it, and wire its
loader analogously. Avoid overlay widgets that require an account or API key.
