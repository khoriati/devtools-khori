# DevTools Khori

Uma mini-plataforma de ferramentas para o dia a dia de desenvolvedores e
administradores, construída como **referência de acessibilidade (WCAG 2.1 AAA)**,
com foco no usuário com deficiência visual.

🔗 **Produção:** https://dev.tools.khori.com.br

## Ferramentas

| Categoria | Ferramentas |
| --- | --- |
| Conversores e dados | Calculadora de programador (hex/dec/oct/bin + bits), Calculadora de sub-rede IP (CIDR ↔ máscara), Calculadora de chmod (octal ↔ rwx), Decodificador JWT, Base64, Codificador de URL, Gerador de hash (SHA-1/256/384/512), Gerador de UUID, Conversor de timestamp, Formatador JSON |
| Documentos (Brasil) | Gerador + validador de CPF, Gerador + validador de CNPJ |
| Rede | WHOIS, Ping, Traceroute, Consulta DNS, Inspetor HTTP (estilo curl) |
| Referência rápida | Linux, Docker, Kubernetes, ffmpeg, magick, Gerenciadores de pacotes (brew/apt/winget), PowerShell, Azure CLI, AWS CLI — cheat sheets com instruções de instalação e links |
| Acessibilidade | Verificador de contraste WCAG |

As telas de **whois/ping/traceroute** também mostram como rodar o comando localmente
(Windows/macOS/Linux), incluindo como instalar a ferramenta quando não é padrão.

As ferramentas de dados rodam 100% no navegador. As ferramentas de rede são
executadas no backend de forma segura (sem shell, com allow-list de argumentos,
validação estrita de host, timeouts, rate-limiting e proteção contra SSRF).

### Segurança / WAF

- **WAF de aplicação** (`server/waf.js`): bloqueia (403) os principais ataques —
  path traversal/LFI, SQLi, XSS, command/template injection, arquivos sensíveis
  (`.git`/`.env`), métodos HTTP não permitidos e payloads percent-encoded.
- **WAF na borda**: Ingress com **ModSecurity + OWASP Core Rule Set** habilitados
  por anotação, com escopo restrito a este site (o controller é compartilhado).
- Defesa em profundidade: helmet (CSP/HSTS/nosniff/frame), rate-limiting na app e
  no ingress, container não-root com filesystem somente leitura e `cap drop ALL`.
- Cobertura por testes automatizados em `tests/security.spec.ts`.

Há uma **busca global** de ferramentas que filtra tanto pelo título quanto pelo
conteúdo do corpo (ex.: buscar `rollout` encontra os comandos Kubernetes).

## Acessibilidade

- **WCAG 2.1 AAA** como meta: contraste mínimo de 7:1, três temas (claro, escuro,
  alto contraste), alvos de toque de 44px, foco sempre visível.
- Navegação completa por teclado, _skip links_, marcos semânticos (`header`,
  `nav`, `main`, `aside`, `footer`) e um único `h1` por página.
- Anúncios para leitores de tela via _live regions_ (`aria-live`).
- Multilíngue: **pt-BR, en-US, es, de, fr** (com `<html lang>` e semântica sincronizados ao idioma).
- Respeita `prefers-reduced-motion` e `prefers-color-scheme`.
- Fonte com boa legibilidade (Atkinson Hyperlegible quando disponível).

## Stack

- **Frontend:** React 18 + TypeScript + Vite + MUI 5 + react-i18next + react-router
- **Backend:** Node.js + Express (helmet, compression, rate-limit)
- **Infra:** Docker (multi-stage) → Kubernetes (Ingress nginx + cert-manager)

## Desenvolvimento

```bash
# backend
cd server && npm install && npm run dev      # :8080

# frontend (proxy /api -> :8080)
cd web && npm install && npm run dev          # :5173
```

## Build & Deploy

```bash
docker build -t devtools-khori:latest .
# manifests em deploy/k8s.yaml (substitua __IMAGE__ pela tag publicada)
kubectl apply -f deploy/k8s.yaml
```

## Testes de acessibilidade

```bash
cd tests && npm install && npx playwright install
BASE_URL=https://dev.tools.khori.com.br npm test
```

Os testes auditam a home e todas as ferramentas com **axe-core** (tags WCAG 2/2.1
A/AA/AAA), validam _skip link_, estrutura de cabeçalhos/marcos, troca de tema e de
idioma. Ferramentas automatizadas cobrem uma parte do AAA; itens que exigem
avaliação manual (ex.: 1.4.8, 2.4.10) foram considerados no design.

## Licença

MIT.
