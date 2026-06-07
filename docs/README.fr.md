# DevTools Khori

🌐 **Langues :** [Português (Brasil)](../README.md) · [English](README.en-US.md) · [Español](README.es.md) · [Deutsch](README.de.md) · **Français**

Une mini-plateforme d'outils pour le quotidien des développeurs, architectes
logiciels et administrateurs, conçue comme **référence d'accessibilité (WCAG 2.1
AAA)**, avec un focus sur l'utilisateur malvoyant.

🔗 **Production :** https://dev.tools.khori.com.br
📦 **Dépôt :** https://github.com/khoriati/devtools-khori

---

## ⚠️ Pourquoi l'accessibilité (WCAG) est importante

> Ce projet existe avant tout pour servir d'**exemple de portail accessible**.
> Mettre en œuvre les directives [WCAG](https://www.w3.org/WAI/standards-guidelines/wcag/)
> n'est pas un détail technique optionnel : c'est une responsabilité sociale et
> une décision commerciale judicieuse.

**Du point de vue social.** Plus d'**un milliard de personnes** — environ 16% de
la population mondiale, selon l'Organisation mondiale de la santé — vivent avec
un handicap. Les personnes aveugles ou malvoyantes dépendent des lecteurs
d'écran, du contraste élevé, de l'agrandissement et de la navigation au clavier
pour utiliser le web. Quand un site ignore l'accessibilité, il prive ces
personnes d'autonomie, d'information et de participation. L'accessibilité est une
question de **dignité, d'inclusion et de droits humains** — et, avec le
vieillissement de la population, elle profite à un public toujours plus large (la
perte de vision, d'audition et de mobilité augmente avec l'âge).

**Du point de vue commercial.** L'accessibilité est aussi un avantage
concurrentiel :

- **Marché plus large :** les sites accessibles n'excluent pas de clients — ils
  élargissent l'audience et la conversion.
- **Conformité légale :** aux États-Unis, il y a l'**ADA** et la **Section 508** ;
  dans l'Union européenne, l'**EN 301 549** et l'**European Accessibility Act** ;
  au Brésil, la **Loi brésilienne d'inclusion (LBI, loi 13.146/2015)** et
  l'**eMAG**. L'ignorer crée un risque juridique et de réputation.
- **SEO et performance :** le HTML sémantique, les textes alternatifs et une
  bonne structure aident les moteurs de recherche et améliorent les performances.
- **Utilisabilité pour tous (_curb-cut effect_) :** les fonctions pensées pour le
  handicap (contraste élevé, sous-titres, navigation au clavier) profitent à
  tous — en plein soleil, les mains occupées, avec une mauvaise connexion.
- **Réputation et contrats :** l'accessibilité est une exigence fréquente dans
  les appels d'offres et les contrats d'entreprise et renforce la marque.

Construire de façon accessible **dès le départ** coûte peu ; corriger plus tard
coûte cher. Ce portail démontre qu'on peut livrer une UX moderne et soignée,
**100% navigable au clavier et au lecteur d'écran**, avec un contraste minimum de
7:1.

---

## 🧰 Outils

| Catégorie | Outils |
| --- | --- |
| **Convertisseurs et données** | Calculatrice de programmeur (hex/déc/oct/bin + bits), Calculatrice de sous-réseau IP (CIDR ↔ masque), Calculatrice chmod (octal ↔ rwx), Décodeur JWT, Base64, Encodeur d'URL, Générateur de hachage (SHA-1/256/384/512), Générateur d'UUID, Convertisseur de timestamp, Formateur JSON |
| **Documents (Brésil)** | Générateur + validateur de **CPF**, Générateur + validateur de **CNPJ** (chiffre de contrôle) |
| **Réseau** | WHOIS, Ping, Traceroute, Requête DNS, Inspecteur HTTP (style curl) |
| **Référence rapide** | Commandes **Linux** (incl. réseau et routage), **Docker**, **Kubernetes** (namespaces, `kubectl top`), **ffmpeg**, **magick** (ImageMagick), **Gestionnaires de paquets** (brew/apt/winget, avec liens), **PowerShell** (basique/intermédiaire/avancé), **Azure CLI**, **AWS CLI** — tous avec une section d'installation |
| **Accessibilité** | Vérificateur de contraste WCAG, **Validateurs WCAG en CLI** (Pa11y, axe-core, Lighthouse, IBM Equal Access) |

- Les outils de **données s'exécutent à 100% dans le navigateur** (rien n'est
  envoyé au serveur).
- Les outils **réseau** s'exécutent côté backend de façon sécurisée (sans shell,
  liste blanche d'arguments, validation stricte de l'hôte, timeouts,
  rate-limiting et protection contre la SSRF).
- Les écrans **whois/ping/traceroute** indiquent comment exécuter la commande
  **localement** (Windows/macOS/Linux), y compris comment installer l'outil quand
  il n'est pas fourni avec le système. La sortie de **ping/traceroute, de
  l'inspecteur HTTP et de toute réponse de l'API masque l'adresse réelle du
  serveur d'origine** (et les sauts internes) — p. ex. le corps de
  `checkip.amazonaws.com` — afin de ne pas exposer l'origine.
- Le groupe **Accessibilité** inclut un bloc de **validateurs WCAG open source en
  ligne de commande** (Pa11y, axe-core CLI, Lighthouse, IBM Equal Access) —
  destiné aux **développeurs, architectes et UX designers** — avec des exemples
  prêts à l'emploi et des instructions d'installation par système d'exploitation.
  Ces validateurs n'effectuent qu'une vérification technique superficielle et **ne
  remplacent pas les tests QA menés par des professionnels qualifiés** capables
  d'évaluer la subjectivité de la navigation et du contexte.
- **Recherche globale** qui filtre à la fois sur le titre et sur le **contenu du
  corps** (p. ex. rechercher `rollout` trouve les commandes Kubernetes ; `crf`,
  ffmpeg).

## ♿ Accessibilité

- **WCAG 2.1 AAA** comme objectif : contraste minimum de 7:1, trois thèmes
  (clair, sombre, **contraste élevé**), cibles tactiles de 44px, focus toujours
  visible.
- Navigation complète au clavier, _skip links_, repères sémantiques (`header`,
  `nav`, `main`, `aside`, `footer`) et un seul `h1` par page.
- Annonces pour lecteurs d'écran via des _live regions_ (`aria-live`).
- **Multilingue :** pt-BR, en-US, es, de, fr — avec `<html lang>` et la
  sémantique synchronisés avec la langue choisie.
- **Libras (langue des signes brésilienne) :** lorsque la langue est **pt-BR**, le
  widget open-source [VLibras](https://www.gov.br/governodigital/pt-br/vlibras)
  (gov.br, sans inscription/clé API) affiche un avatar 3D qui traduit le contenu
  en Libras. Pour les autres langues (en/es/de/fr), un bouton ouvre
  [sign.mt](https://sign.mt) — un traducteur de langue des signes open-source,
  sans inscription/clé — dans une boîte de dialogue accessible, avec la paire de
  langues présélectionnée. Guide d'intégration : [VLIBRAS.md](VLIBRAS.md).
- Respecte `prefers-reduced-motion` et `prefers-color-scheme` ; prend en charge
  `forced-colors` (mode Contraste élevé de Windows).
- Typographie lisible (Atkinson Hyperlegible lorsque disponible).

## 🛡️ Sécurité / WAF

- **WAF applicatif** (`server/waf.js`) : bloque (403) les principales attaques —
  path traversal/LFI, injection SQL, XSS, injection de commande/template,
  fichiers sensibles (`.git`/`.env`), méthodes HTTP non autorisées et charges
  percent-encoded (double décodage).
- **WAF en bordure :** Ingress avec **ModSecurity + OWASP Core Rule Set**, limité
  à ce site uniquement.
- **Défense en profondeur :** helmet (CSP, HSTS, `nosniff`, `X-Frame-Options`),
  rate-limiting dans l'app et au niveau de l'ingress, conteneur **non-root** avec
  système de fichiers en lecture seule et `cap drop ALL` (uniquement `NET_RAW`
  pour ping/traceroute).
- Couvert par des tests automatisés dans `tests/security.spec.ts`.

## 🏗️ Architecture

- **Frontend :** React 18 + TypeScript + Vite + MUI 5 + react-i18next + react-router
- **Backend :** Node.js + Express (helmet, compression, rate-limit, WAF)
- **Infra :** Docker (multi-stage) → Kubernetes (Ingress nginx + cert-manager,
  TLS Let's Encrypt automatique, 2 réplicas)

## 💻 Développement

```bash
# backend
cd server && npm install && npm run dev      # :8080

# frontend (proxy /api -> :8080)
cd web && npm install && npm run dev          # :5173
```

## 🚀 Build & Déploiement

```bash
docker build -t devtools-khori:latest .
# remplacez __IMAGE__ par le tag publié et appliquez les manifestes
kubectl apply -f deploy/k8s.yaml
```

## ✅ Tests (accessibilité + sécurité)

```bash
cd tests && npm install && npx playwright install
BASE_URL=https://dev.tools.khori.com.br npm test
```

- **axe-core** audite la page d'accueil et chaque outil avec les tags WCAG 2/2.1
  A/AA/AAA.
- Valide le _skip link_, l'ordre de Tab, la structure des titres/repères, le
  changement de thème et de langue (`<html lang>` + contenu traduit) dans les 5
  langues.
- La suite de **sécurité** vérifie les en-têtes, le blocage du WAF pour
  plusieurs classes d'attaque, les méthodes HTTP, la protection SSRF et la
  validation des entrées.

> Les outils automatisés couvrent une partie du niveau AAA ; les points
> nécessitant une évaluation manuelle (p. ex. 1.4.8, 2.4.10) ont été pris en
> compte dans la conception.

## 📄 Licence

MIT.
