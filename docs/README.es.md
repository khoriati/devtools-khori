# DevTools Khori

🌐 **Idiomas:** [Português (Brasil)](../README.md) · [English](README.en-US.md) · **Español** · [Deutsch](README.de.md) · [Français](README.fr.md)

Una mini-plataforma de herramientas para el día a día de desarrolladores,
arquitectos de software y administradores, creada como **referencia de
accesibilidad (WCAG 2.1 AAA)**, con foco en el usuario con discapacidad visual.

🔗 **Producción:** https://dev.tools.khori.com.br
📦 **Repositorio:** https://github.com/khoriati/devtools-khori

---

## ⚠️ Por qué importa la accesibilidad (WCAG)

> Este proyecto existe, ante todo, para servir de **ejemplo de portal
> accesible**. Implementar las directrices de la [WCAG](https://www.w3.org/WAI/standards-guidelines/wcag/)
> no es un detalle técnico opcional: es una responsabilidad social y una
> decisión de negocio inteligente.

**Desde el punto de vista social.** Más de **1.000 millones de personas** —
alrededor del 16% de la población mundial, según la Organización Mundial de la
Salud— viven con alguna discapacidad. Las personas ciegas o con baja visión
dependen de lectores de pantalla, alto contraste, ampliación y navegación por
teclado para usar la web. Cuando un sitio ignora la accesibilidad, niega a esas
personas autonomía, información y participación. La accesibilidad es una cuestión
de **dignidad, inclusión y derechos humanos** y, con el envejecimiento de la
población, beneficia a un público cada vez mayor (la pérdida de visión, audición
y movilidad aumenta con la edad).

**Desde el punto de vista comercial.** La accesibilidad también es una ventaja
competitiva:

- **Mercado más amplio:** los sitios accesibles no excluyen clientes, amplían el
  alcance y la conversión.
- **Cumplimiento legal:** en EE. UU. están la **ADA** y la **Section 508**; en la
  Unión Europea, la **EN 301 549** y el **European Accessibility Act**; en
  Brasil, la **Ley Brasileña de Inclusión (LBI, Ley 13.146/2015)** y el **eMAG**.
  Ignorarlo genera riesgo legal y de imagen.
- **SEO y rendimiento:** el HTML semántico, los textos alternativos y una buena
  estructura ayudan a los buscadores y mejoran el rendimiento.
- **Usabilidad para todos (_curb-cut effect_):** las funciones pensadas para la
  discapacidad (alto contraste, subtítulos, navegación por teclado) benefician a
  todos: bajo el sol, con las manos ocupadas, con malas conexiones.
- **Reputación y contratos:** la accesibilidad es un requisito frecuente en
  licitaciones y contratos corporativos y refuerza la marca.

Construir de forma accesible **desde el inicio** cuesta poco; corregirlo después
es caro. Este portal demuestra que se puede entregar una UX moderna y atractiva,
**100% navegable por teclado y lector de pantalla**, con un contraste mínimo de
7:1.

---

## 🧰 Herramientas

| Categoría | Herramientas |
| --- | --- |
| **Conversores y datos** | Calculadora de programador (hex/dec/oct/bin + bits), Calculadora de subred IP (CIDR ↔ máscara), Calculadora de chmod (octal ↔ rwx), Decodificador JWT, Base64, Codificador de URL, Generador de hash (SHA-1/256/384/512), Generador de UUID, Conversor de timestamp, Formateador JSON |
| **Documentos (Brasil)** | Generador + validador de **CPF**, Generador + validador de **CNPJ** (dígito verificador) |
| **Red** | WHOIS, Ping, Traceroute, Consulta DNS, Inspector HTTP (estilo curl) |
| **Referencia rápida** | Comandos **Linux** (incl. red y enrutamiento), **Docker**, **Kubernetes** (namespaces, `kubectl top`), **ffmpeg**, **magick** (ImageMagick), **Gestores de paquetes** (brew/apt/winget, con enlaces), **PowerShell** (básico/intermedio/avanzado), **Azure CLI**, **AWS CLI** — todos con sección de instalación |
| **Accesibilidad** | Verificador de contraste WCAG, **Validadores WCAG por CLI** (Pa11y, axe-core, Lighthouse, IBM Equal Access) |

- Las herramientas de **datos se ejecutan 100% en el navegador** (no se envía
  nada al servidor).
- Las herramientas de **red** se ejecutan en el backend de forma segura (sin
  shell, con allow-list de argumentos, validación estricta de host, timeouts,
  rate-limiting y protección contra SSRF).
- Las pantallas de **whois/ping/traceroute** muestran cómo ejecutar el comando
  **localmente** (Windows/macOS/Linux), incluyendo cómo instalar la herramienta
  cuando no viene con el sistema. La salida de **ping/traceroute, del inspector
  HTTP y de cualquier respuesta de la API enmascara la dirección real del
  servidor de origen** (y los saltos internos) —p. ej. el cuerpo de
  `checkip.amazonaws.com`— para no exponer el origen.
- El grupo **Accesibilidad** incluye un bloque de **validadores WCAG open source
  por línea de comandos** (Pa11y, axe-core CLI, Lighthouse, IBM Equal Access),
  orientado a **desarrolladores, arquitectos y diseñadores UX**, con ejemplos
  listos para usar e instrucciones de instalación por sistema operativo.
- **Búsqueda global** que filtra tanto por el título como por el **contenido del
  cuerpo** (p. ej., buscar `rollout` encuentra los comandos de Kubernetes; `crf`,
  ffmpeg).

## ♿ Accesibilidad

- **WCAG 2.1 AAA** como objetivo: contraste mínimo de 7:1, tres temas (claro,
  oscuro, **alto contraste**), objetivos táctiles de 44px, foco siempre visible.
- Navegación completa por teclado, _skip links_, marcos semánticos (`header`,
  `nav`, `main`, `aside`, `footer`) y un único `h1` por página.
- Anuncios para lectores de pantalla mediante _live regions_ (`aria-live`).
- **Multilingüe:** pt-BR, en-US, es, de, fr — con `<html lang>` y la semántica
  sincronizados con el idioma elegido.
- Respeta `prefers-reduced-motion` y `prefers-color-scheme`; admite
  `forced-colors` (Modo de Alto Contraste de Windows).
- Tipografía legible (Atkinson Hyperlegible cuando está disponible).

## 🛡️ Seguridad / WAF

- **WAF de aplicación** (`server/waf.js`): bloquea (403) los principales ataques:
  path traversal/LFI, inyección SQL, XSS, command/template injection, archivos
  sensibles (`.git`/`.env`), métodos HTTP no permitidos y payloads
  percent-encoded (doble decodificación).
- **WAF en el borde:** Ingress con **ModSecurity + OWASP Core Rule Set**, con
  alcance restringido a este sitio.
- **Defensa en profundidad:** helmet (CSP, HSTS, `nosniff`, `X-Frame-Options`),
  rate-limiting en la app y en el ingress, contenedor **sin root** con sistema de
  archivos de solo lectura y `cap drop ALL` (solo `NET_RAW` para ping/traceroute).
- Cubierto por pruebas automatizadas en `tests/security.spec.ts`.

## 🏗️ Arquitectura

- **Frontend:** React 18 + TypeScript + Vite + MUI 5 + react-i18next + react-router
- **Backend:** Node.js + Express (helmet, compression, rate-limit, WAF)
- **Infra:** Docker (multi-stage) → Kubernetes (Ingress nginx + cert-manager, TLS
  automático Let's Encrypt, 2 réplicas)

## 💻 Desarrollo

```bash
# backend
cd server && npm install && npm run dev      # :8080

# frontend (proxy /api -> :8080)
cd web && npm install && npm run dev          # :5173
```

## 🚀 Build y Deploy

```bash
docker build -t devtools-khori:latest .
# reemplaza __IMAGE__ por la etiqueta publicada y aplica los manifiestos
kubectl apply -f deploy/k8s.yaml
```

## ✅ Pruebas (accesibilidad + seguridad)

```bash
cd tests && npm install && npx playwright install
BASE_URL=https://dev.tools.khori.com.br npm test
```

- **axe-core** audita la home y todas las herramientas con etiquetas WCAG 2/2.1
  A/AA/AAA.
- Valida el _skip link_, el orden de Tab, la estructura de encabezados/marcos, el
  cambio de tema y de idioma (`<html lang>` + contenido traducido) en los 5
  idiomas.
- La suite de **seguridad** verifica los headers, el bloqueo del WAF para varias
  clases de ataque, los métodos HTTP, la protección SSRF y la validación de
  entrada.

> Las herramientas automatizadas cubren parte del nivel AAA; los puntos que
> requieren evaluación manual (p. ej., 1.4.8, 2.4.10) se tuvieron en cuenta en el
> diseño.

## 📄 Licencia

MIT.
