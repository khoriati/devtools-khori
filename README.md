# DevTools Khori

Uma mini-plataforma de ferramentas para o dia a dia de desenvolvedores e
administradores, construída como **referência de acessibilidade (WCAG 2.1 AAA)**,
com foco no usuário com deficiência visual.

🔗 **Produção:** https://dev.tools.khori.com.br

## Ferramentas

| Categoria | Ferramentas |
| --- | --- |
| Conversores e dados | Calculadora de programador (hex/dec/oct/bin + bits), Decodificador JWT, Base64, Codificador de URL, Gerador de hash (SHA-1/256/384/512), Gerador de UUID, Conversor de timestamp, Formatador JSON |
| Rede | WHOIS, Ping, Traceroute, Consulta DNS, Inspetor HTTP (estilo curl) |
| Acessibilidade | Verificador de contraste WCAG |

As ferramentas de dados rodam 100% no navegador. As ferramentas de rede são
executadas no backend de forma segura (sem shell, com allow-list de argumentos,
validação estrita de host, timeouts, rate-limiting e proteção contra SSRF).

## Acessibilidade

- **WCAG 2.1 AAA** como meta: contraste mínimo de 7:1, três temas (claro, escuro,
  alto contraste), alvos de toque de 44px, foco sempre visível.
- Navegação completa por teclado, _skip links_, marcos semânticos (`header`,
  `nav`, `main`, `aside`, `footer`) e um único `h1` por página.
- Anúncios para leitores de tela via _live regions_ (`aria-live`).
- Multilíngue: **pt-BR** e **en-US** (com `<html lang>` sincronizado).
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
