# DevTools Khori

🌐 **Sprachen:** [Português (Brasil)](../README.md) · [English](README.en-US.md) · [Español](README.es.md) · **Deutsch** · [Français](README.fr.md)

Eine kleine Werkzeugplattform für den Alltag von Entwicklern,
Software-Architekten und Administratoren, gebaut als **Barrierefreiheits-Referenz
(WCAG 2.1 AAA)**, mit Fokus auf sehbehinderte Nutzer.

🔗 **Produktion:** https://dev.tools.khori.com.br
📦 **Repository:** https://github.com/khoriati/devtools-khori

---

## ⚠️ Warum Barrierefreiheit (WCAG) wichtig ist

> Dieses Projekt existiert vor allem als **Beispiel für ein barrierefreies
> Portal**. Die [WCAG](https://www.w3.org/WAI/standards-guidelines/wcag/)-Richtlinien
> umzusetzen ist kein optionales technisches Detail — es ist eine soziale
> Verantwortung und eine kluge Geschäftsentscheidung.

**Aus sozialer Sicht.** Mehr als **1 Milliarde Menschen** — etwa 16% der
Weltbevölkerung, laut Weltgesundheitsorganisation — leben mit einer Behinderung.
Blinde oder sehbehinderte Menschen sind auf Screenreader, hohen Kontrast,
Vergrößerung und Tastaturnavigation angewiesen, um das Web zu nutzen. Ignoriert
eine Website die Barrierefreiheit, verweigert sie diesen Menschen Autonomie,
Information und Teilhabe. Barrierefreiheit ist eine Frage von **Würde, Inklusion
und Menschenrechten** — und mit der alternden Bevölkerung profitiert ein immer
größeres Publikum davon (Seh-, Hör- und Mobilitätsverlust nehmen mit dem Alter
zu).

**Aus kommerzieller Sicht.** Barrierefreiheit ist auch ein Wettbewerbsvorteil:

- **Größerer Markt:** barrierefreie Websites schließen keine Kunden aus — sie
  erhöhen Reichweite und Conversion.
- **Rechtliche Konformität:** in den USA gibt es den **ADA** und **Section 508**;
  in der EU die **EN 301 549** und den **European Accessibility Act**; in
  Brasilien das **Brasilianische Inklusionsgesetz (LBI, Gesetz 13.146/2015)** und
  **eMAG**. Das zu ignorieren schafft rechtliche und Reputationsrisiken.
- **SEO und Performance:** semantisches HTML, Alternativtexte und eine gute
  Struktur helfen Suchmaschinen und verbessern die Performance.
- **Nutzbarkeit für alle (_curb-cut effect_):** für Behinderungen gedachte
  Funktionen (hoher Kontrast, Untertitel, Tastaturnavigation) helfen allen — in
  der Sonne, mit belegten Händen, bei schlechter Verbindung.
- **Reputation und Aufträge:** Barrierefreiheit ist häufig Voraussetzung bei
  Ausschreibungen und Unternehmensverträgen und stärkt die Marke.

Von Anfang an barrierefrei zu bauen kostet wenig; es später zu korrigieren ist
teuer. Dieses Portal zeigt, dass sich eine moderne, ansprechende UX liefern
lässt, die **zu 100% per Tastatur und Screenreader navigierbar** ist, mit einem
Mindestkontrast von 7:1.

---

## 🧰 Werkzeuge

| Kategorie | Werkzeuge |
| --- | --- |
| **Konverter & Daten** | Programmierrechner (hex/dez/okt/bin + Bits), IP-Subnetzrechner (CIDR ↔ Netzmaske), chmod-Rechner (oktal ↔ rwx), JWT-Decoder, Base64, URL-Kodierer, Hash-Generator (SHA-1/256/384/512), UUID-Generator, Timestamp-Konverter, JSON-Formatter |
| **Dokumente (Brasilien)** | **CPF**-Generator + Validator, **CNPJ**-Generator + Validator (Prüfziffer) |
| **Netzwerk** | WHOIS, Ping, Traceroute, DNS-Abfrage, HTTP-Inspektor (curl-Stil) |
| **Schnellreferenz** | **Linux**-Befehle (inkl. Netzwerk & Routing), **Docker**, **Kubernetes** (Namespaces, `kubectl top`), **ffmpeg**, **magick** (ImageMagick), **Paketmanager** (brew/apt/winget, mit Links), **PowerShell** (einfach/mittel/fortgeschritten), **Azure CLI**, **AWS CLI** — alle mit Installationsabschnitt |
| **Barrierefreiheit** | WCAG-Kontrastprüfer, **WCAG-Validatoren per CLI** (Pa11y, axe-core, Lighthouse, IBM Equal Access) |

- Die **Daten-Werkzeuge laufen zu 100% im Browser** (es wird nichts an den Server
  gesendet).
- Die **Netzwerk-Werkzeuge** laufen sicher im Backend (keine Shell,
  Argument-Allowlist, strikte Host-Validierung, Timeouts, Rate-Limiting und
  SSRF-Schutz).
- Die **whois/ping/traceroute**-Ansichten zeigen, wie man den Befehl **lokal**
  ausführt (Windows/macOS/Linux), inkl. Installation des Werkzeugs, wenn es nicht
  zum System gehört. Die Ausgabe von **ping/traceroute, des HTTP-Inspektors und
  jeder API-Antwort maskiert die echte Ursprungs-Serveradresse** (und interne
  Hops) — z. B. den Body von `checkip.amazonaws.com` —, damit der Ursprung nicht
  offengelegt wird.
- Die Gruppe **Barrierefreiheit** enthält einen Block mit **Open-Source-WCAG-
  Validatoren für die Kommandozeile** (Pa11y, axe-core CLI, Lighthouse, IBM Equal
  Access) — gedacht für **Entwickler, Architekten und UX-Designer** — mit
  einsatzbereiten Beispielen und Installationsanleitungen je Betriebssystem. Diese
  Validatoren führen nur eine oberflächliche technische Prüfung durch und
  **ersetzen keine QA-Tests durch qualifizierte Fachleute**, die die Subjektivität
  von Navigation und Kontext beurteilen.
- **Globale Suche**, die sowohl nach Titel als auch nach **Inhalt** filtert
  (z. B. findet die Suche `rollout` die Kubernetes-Befehle; `crf` das ffmpeg).

## ♿ Barrierefreiheit

- **WCAG 2.1 AAA** als Ziel: Mindestkontrast 7:1, drei Designs (hell, dunkel,
  **hoher Kontrast**), 44px-Touch-Ziele, stets sichtbarer Fokus.
- Vollständige Tastaturnavigation, _Skip-Links_, semantische Landmarks
  (`header`, `nav`, `main`, `aside`, `footer`) und genau ein `h1` pro Seite.
- Screenreader-Ansagen über _Live-Regionen_ (`aria-live`).
- **Mehrsprachig:** pt-BR, en-US, es, de, fr — mit `<html lang>` und Semantik
  synchron zur gewählten Sprache.
- **Libras (brasilianische Gebärdensprache):** Ist die Sprache **pt-BR**, zeigt
  das Open-Source-Widget [VLibras](https://www.gov.br/governodigital/pt-br/vlibras)
  (gov.br, ohne Anmeldung/API-Key) einen 3D-Avatar, der den Inhalt in Libras
  gebärdet. Für die übrigen Sprachen gibt es derzeit kein freies, schlüsselloses
  und self-hostbares Äquivalent, daher wird die Option nicht angezeigt.
  Integrationsleitfaden: [VLIBRAS.md](VLIBRAS.md).
- **Richtung AAA:** ein **Glossar** der Begriffe und Abkürzungen (WCAG-Mechanismus
  3.1.3/3.1.4), Touch-Ziele **≥ 44px** (2.5.5), **Fokus nie verdeckt** durch die
  feste Leiste (2.4.12), angenehme Zeilenbreite (1.4.8) und Akkordeon-Navigation.
  Der AAA-Anspruch deckt unsere **eigene UI** ab — der VLibras-Avatar (Drittanbieter)
  und das fortgeschrittene Leseniveau technischer Inhalte (3.1.5) liegen außerhalb,
  und volle Konformität erfordert manuelle Prüfung + assistive Technologie.
- Berücksichtigt `prefers-reduced-motion` und `prefers-color-scheme`; unterstützt
  `forced-colors` (Windows-Modus „Hoher Kontrast").
- Lesbare Typografie (Atkinson Hyperlegible, falls verfügbar).

## 🛡️ Sicherheit / WAF

- **Anwendungs-WAF** (`server/waf.js`): blockiert (403) die wichtigsten Angriffe —
  Path Traversal/LFI, SQL-Injection, XSS, Command-/Template-Injection, sensible
  Dateien (`.git`/`.env`), unzulässige HTTP-Methoden und percent-kodierte
  Payloads (doppelte Dekodierung).
- **Edge-WAF:** Ingress mit **ModSecurity + OWASP Core Rule Set**, beschränkt auf
  diese Website.
- **Verteidigung in der Tiefe:** helmet (CSP, HSTS, `nosniff`, `X-Frame-Options`),
  Rate-Limiting in der App und am Ingress, **Non-root**-Container mit
  schreibgeschütztem Dateisystem und `cap drop ALL` (nur `NET_RAW` für
  ping/traceroute).
- Abgedeckt durch automatisierte Tests in `tests/security.spec.ts`.

## 🏗️ Architektur

- **Frontend:** React 18 + TypeScript + Vite + MUI 5 + react-i18next + react-router
- **Backend:** Node.js + Express (helmet, compression, rate-limit, WAF)
- **Infra:** Docker (Multi-Stage) → Kubernetes (nginx-Ingress + cert-manager,
  automatisches Let's-Encrypt-TLS, 2 Replicas)

## 💻 Entwicklung

```bash
# Backend
cd server && npm install && npm run dev      # :8080

# Frontend (Proxy /api -> :8080)
cd web && npm install && npm run dev          # :5173
```

## 🚀 Build & Deploy

```bash
docker build -t devtools-khori:latest .
# __IMAGE__ durch das veröffentlichte Tag ersetzen und Manifeste anwenden
kubectl apply -f deploy/k8s.yaml
```

## ✅ Tests (Barrierefreiheit + Sicherheit)

```bash
cd tests && npm install && npx playwright install
BASE_URL=https://dev.tools.khori.com.br npm test
```

- **axe-core** prüft die Startseite und jedes Werkzeug mit den Tags WCAG 2/2.1
  A/AA/AAA.
- Validiert den _Skip-Link_, die Tab-Reihenfolge, die Überschriften-/Landmark-
  Struktur sowie den Design- und Sprachwechsel (`<html lang>` + übersetzter
  Inhalt) in allen 5 Sprachen.
- Die **Sicherheits**-Suite prüft die Header, das WAF-Blocking für mehrere
  Angriffsklassen, HTTP-Methoden, den SSRF-Schutz und die Eingabevalidierung.

> Automatisierte Werkzeuge decken einen Teil der AAA-Stufe ab; Punkte, die eine
> manuelle Bewertung erfordern (z. B. 1.4.8, 2.4.10), wurden im Design
> berücksichtigt.

## 📄 Lizenz

MIT.
