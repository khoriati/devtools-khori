# DevTools Khori

🌐 **Languages:** [Português (Brasil)](../README.md) · **English** · [Español](README.es.md) · [Deutsch](README.de.md) · [Français](README.fr.md)

A small platform of everyday tools for developers, software architects and
administrators, built as an **accessibility reference (WCAG 2.1 AAA)**, with a
focus on visually impaired users.

🔗 **Production:** https://dev.tools.khori.com.br
📦 **Repository:** https://github.com/khoriati/devtools-khori

---

## ⚠️ Why accessibility (WCAG) matters

> This project exists, above all, to serve as an **example of an accessible
> portal**. Implementing the [WCAG](https://www.w3.org/WAI/standards-guidelines/wcag/)
> guidelines is not an optional technical detail — it is a social responsibility
> and a smart business decision.

**From a social standpoint.** More than **1 billion people** — about 16% of the
world's population, according to the World Health Organization — live with some
form of disability. Blind or low-vision people rely on screen readers, high
contrast, magnification and keyboard navigation to use the web. When a site
ignores accessibility, it denies those people autonomy, information and
participation. Accessibility is a matter of **dignity, inclusion and human
rights** — and, as the population ages, it benefits an ever-growing audience
(vision, hearing and mobility loss increase with age).

**From a commercial standpoint.** Accessibility is also a competitive advantage:

- **Larger market:** accessible sites don't exclude customers — they widen reach
  and conversion.
- **Legal compliance:** in the US there is the **ADA** and **Section 508**; in
  the European Union, **EN 301 549** and the **European Accessibility Act**; in
  Brazil, the **Brazilian Inclusion Law (LBI, Law 13.146/2015)** and **eMAG**.
  Ignoring this creates legal and reputational risk.
- **SEO and performance:** semantic HTML, alternative text and good structure
  help search engines and improve performance.
- **Usability for everyone (_curb-cut effect_):** features designed for
  disability (high contrast, captions, keyboard navigation) help everyone — in
  sunlight, with busy hands, on poor connections.
- **Reputation and contracts:** accessibility is a frequent requirement in
  tenders and corporate contracts and strengthens the brand.

Building accessibly **from the start** costs little; fixing it later is
expensive. This portal shows that you can deliver a modern, beautiful UX that is
**100% keyboard- and screen-reader-navigable**, with a minimum 7:1 contrast.

---

## 🧰 Tools

| Category | Tools |
| --- | --- |
| **Converters & data** | Programmer calculator (hex/dec/oct/bin + bits), IP subnet calculator (CIDR ↔ netmask), chmod calculator (octal ↔ rwx), JWT decoder, Base64, URL encoder, Hash generator (SHA-1/256/384/512), UUID generator, Timestamp converter, JSON formatter |
| **Documents (Brazil)** | **CPF** generator + validator, **CNPJ** generator + validator (check digit) |
| **Network** | WHOIS, Ping, Traceroute, DNS lookup, HTTP inspector (curl-style) |
| **Quick reference** | **Linux** commands (incl. network & routing), **Docker**, **Kubernetes** (namespaces, `kubectl top`), **ffmpeg**, **magick** (ImageMagick), **Package managers** (brew/apt/winget, with links), **PowerShell** (basic/intermediate/advanced), **Azure CLI**, **AWS CLI** — all with an installation section |
| **Accessibility** | WCAG contrast checker, **WCAG validators via CLI** (Pa11y, axe-core, Lighthouse, IBM Equal Access) |

- The **data tools run 100% in the browser** (nothing is sent to the server).
- The **network tools** run on the backend securely (no shell, argument
  allow-list, strict host validation, timeouts, rate-limiting and SSRF guard).
- The **whois/ping/traceroute** screens show how to run the command **locally**
  (Windows/macOS/Linux), including how to install the tool when it isn't shipped
  with the OS. The **ping/traceroute output masks the real origin server address**
  (and internal hops) so the origin isn't exposed.
- The **Accessibility** group includes a block of **open-source command-line WCAG
  validators** (Pa11y, axe-core CLI, Lighthouse, IBM Equal Access) — aimed at
  **developers, architects and UX designers** — with ready-to-use examples and
  per-OS installation instructions.
- **Global search** that filters by both the title and the **body content**
  (e.g. searching `rollout` finds the Kubernetes commands; `crf`, ffmpeg).

## ♿ Accessibility

- **WCAG 2.1 AAA** as the goal: minimum 7:1 contrast, three themes (light, dark,
  **high contrast**), 44px touch targets, always-visible focus.
- Full keyboard navigation, _skip links_, semantic landmarks (`header`, `nav`,
  `main`, `aside`, `footer`) and a single `h1` per page.
- Screen-reader announcements via _live regions_ (`aria-live`).
- **Multilingual:** pt-BR, en-US, es, de, fr — with `<html lang>` and the
  semantics synced to the chosen language.
- Respects `prefers-reduced-motion` and `prefers-color-scheme`; supports
  `forced-colors` (Windows High Contrast Mode).
- Readable typography (Atkinson Hyperlegible when available).

## 🛡️ Security / WAF

- **Application WAF** (`server/waf.js`): blocks (403) the main attacks — path
  traversal/LFI, SQL injection, XSS, command/template injection, sensitive files
  (`.git`/`.env`), disallowed HTTP methods and percent-encoded payloads (double
  decoding).
- **Edge WAF:** Ingress with **ModSecurity + OWASP Core Rule Set**, scoped to
  this site only.
- **Defense in depth:** helmet (CSP, HSTS, `nosniff`, `X-Frame-Options`),
  rate-limiting in the app and at the ingress, **non-root** container with a
  read-only filesystem and `cap drop ALL` (only `NET_RAW` for ping/traceroute).
- Covered by automated tests in `tests/security.spec.ts`.

## 🏗️ Architecture

- **Frontend:** React 18 + TypeScript + Vite + MUI 5 + react-i18next + react-router
- **Backend:** Node.js + Express (helmet, compression, rate-limit, WAF)
- **Infra:** Docker (multi-stage) → Kubernetes (nginx Ingress + cert-manager,
  automatic Let's Encrypt TLS, 2 replicas)

## 💻 Development

```bash
# backend
cd server && npm install && npm run dev      # :8080

# frontend (proxies /api -> :8080)
cd web && npm install && npm run dev          # :5173
```

## 🚀 Build & Deploy

```bash
docker build -t devtools-khori:latest .
# replace __IMAGE__ with the published tag and apply the manifests
kubectl apply -f deploy/k8s.yaml
```

## ✅ Tests (accessibility + security)

```bash
cd tests && npm install && npx playwright install
BASE_URL=https://dev.tools.khori.com.br npm test
```

- **axe-core** audits the home page and every tool with WCAG 2/2.1 A/AA/AAA tags.
- Validates the _skip link_, Tab order, heading/landmark structure, theme and
  language switching (`<html lang>` + translated content) in all 5 languages.
- The **security** suite checks headers, WAF blocking for several attack
  classes, HTTP methods, the SSRF guard and input validation.

> Automated tools cover part of the AAA level; items that require manual
> evaluation (e.g. 1.4.8, 2.4.10) were considered in the design.

## 📄 License

MIT.
