# DevTools Khori

🌐 **Idiomas:** **Português (Brasil)** · [English](docs/README.en-US.md) · [Español](docs/README.es.md) · [Deutsch](docs/README.de.md) · [Français](docs/README.fr.md)

Uma mini-plataforma de ferramentas para o dia a dia de desenvolvedores,
arquitetos de software e administradores, construída como **referência de
acessibilidade (WCAG 2.1 AAA)**, com foco no usuário com deficiência visual.

🔗 **Produção:** https://dev.tools.khori.com.br
📦 **Repositório:** https://github.com/khoriati/devtools-khori

---

## ⚠️ Por que acessibilidade (WCAG) importa

> Este projeto existe, antes de tudo, para servir de **exemplo de portal
> acessível**. Implementar as diretrizes da [WCAG](https://www.w3.org/WAI/standards-guidelines/wcag/)
> não é um detalhe técnico opcional — é uma responsabilidade social e uma
> decisão de negócio inteligente.

**Do ponto de vista social.** Mais de **1 bilhão de pessoas** — cerca de 16% da
população mundial, segundo a Organização Mundial da Saúde — vivem com alguma
deficiência. Pessoas cegas ou com baixa visão dependem de leitores de tela, alto
contraste, ampliação e navegação por teclado para usar a web. Quando um site
ignora a acessibilidade, ele nega autonomia, informação e participação a essas
pessoas. Acessibilidade é uma questão de **dignidade, inclusão e direitos
humanos** — e, com o envelhecimento da população, beneficia um público cada vez
maior (perda de visão, audição e mobilidade aumentam com a idade).

**Do ponto de vista comercial.** Acessibilidade é também vantagem competitiva:

- **Mercado maior:** sites acessíveis não excluem clientes — ampliam o alcance e
  a conversão.
- **Conformidade legal:** no Brasil, a **Lei Brasileira de Inclusão (LBI, Lei
  13.146/2015)** e o **eMAG** (governo) exigem acessibilidade; nos EUA há a
  **ADA** e a **Section 508**; na União Europeia, a **EN 301 549** e o
  **European Accessibility Act**. Ignorar isso gera risco jurídico e de imagem.
- **SEO e performance:** HTML semântico, textos alternativos e boa estrutura
  ajudam buscadores e melhoram o desempenho.
- **Usabilidade para todos (_curb-cut effect_):** recursos pensados para a
  deficiência (alto contraste, legendas, navegação por teclado) beneficiam todo
  mundo — em telas ao sol, com as mãos ocupadas, em conexões ruins.
- **Reputação e contratos:** acessibilidade é requisito frequente em licitações
  e contratos corporativos e fortalece a marca.

Construir de forma acessível **desde o início** custa pouco; corrigir depois
custa caro. Este portal demonstra que dá para entregar uma UX moderna, bonita e
**100% navegável por teclado e leitor de tela**, com contraste mínimo de 7:1.

---

## 🧰 Ferramentas

| Categoria | Ferramentas |
| --- | --- |
| **Conversores e dados** | Calculadora de programador (hex/dec/oct/bin + bits), Calculadora de sub-rede IP (CIDR ↔ máscara), Calculadora de chmod (octal ↔ rwx), Decodificador JWT, Base64, Codificador de URL, Gerador de hash (SHA-1/256/384/512), Gerador de UUID, Conversor de timestamp, Formatador JSON |
| **Documentos (Brasil)** | Gerador + validador de **CPF**, Gerador + validador de **CNPJ** (dígito verificador) |
| **Rede** | WHOIS, Ping, Traceroute, Consulta DNS, Inspetor HTTP (estilo curl) |
| **Referência rápida** | Comandos **Linux** (incl. rede e roteamento), **Docker**, **Kubernetes** (namespaces, `kubectl top`), **ffmpeg**, **magick** (ImageMagick), **Gerenciadores de pacotes** (brew/apt/winget, com links), **PowerShell** (básico/médio/avançado), **Azure CLI**, **AWS CLI** — todos com seção de instalação |
| **Acessibilidade** | Verificador de contraste WCAG, **Validadores WCAG via CLI** (Pa11y, axe-core, Lighthouse, IBM Equal Access) |

- As ferramentas de **dados rodam 100% no navegador** (nada é enviado ao servidor).
- As ferramentas de **rede** rodam no backend de forma segura (sem shell, com
  allow-list de argumentos, validação estrita de host, timeouts, rate-limiting e
  proteção contra SSRF).
- As telas de **whois/ping/traceroute** mostram como executar o comando
  **localmente** (Windows/macOS/Linux), incluindo como instalar a ferramenta
  quando não é padrão do sistema. A saída de **ping/traceroute, do inspetor HTTP
  e de qualquer resposta da API mascara o endereço real do servidor de origem**
  (e os hops internos) — ex.: o corpo de `checkip.amazonaws.com` —, para não
  expor a origem.
- O grupo **Acessibilidade** inclui um bloco de **validadores WCAG open source via
  linha de comando** (Pa11y, axe-core CLI, Lighthouse, IBM Equal Access) — voltado
  a **desenvolvedores, arquitetos e UX designers** —, com exemplos prontos e
  instruções de instalação por sistema operacional. Esses validadores fazem
  apenas uma checagem técnica superficial e **não substituem testes de QA com
  profissionais capacitados** para avaliar a subjetividade da navegação e do contexto.
- **Busca global** que filtra tanto pelo título quanto pelo **conteúdo do corpo**
  (ex.: buscar `rollout` encontra os comandos Kubernetes; `crf`, o ffmpeg).

## ♿ Acessibilidade

- **WCAG 2.1 AAA** como meta: contraste mínimo de 7:1, três temas (claro,
  escuro, **alto contraste**), alvos de toque de 44px, foco sempre visível.
- Navegação completa por teclado, _skip links_, marcos semânticos (`header`,
  `nav`, `main`, `aside`, `footer`) e um único `h1` por página.
- Anúncios para leitores de tela via _live regions_ (`aria-live`).
- **Multilíngue:** pt-BR, en-US, es, de, fr — com `<html lang>` e a semântica
  sincronizados ao idioma escolhido.
- **Libras (Língua Brasileira de Sinais):** quando o idioma é **pt-BR**, o widget
  open-source [VLibras](https://www.gov.br/governodigital/pt-br/vlibras) (gov.br,
  sem cadastro/API-key) exibe um avatar 3D que traduz o conteúdo para Libras. Os
  demais idiomas não possuem hoje um equivalente livre, sem cadastro e
  self-hostável, então a opção não é exibida. Guia: [docs/VLIBRAS.md](docs/VLIBRAS.md).
- **Reforços rumo ao AAA:** **glossário** de termos e siglas (mecanismo WCAG
  3.1.3/3.1.4), alvos de toque **≥ 44px** (2.5.5), **foco nunca obscurecido** pela
  barra fixa (2.4.12), largura de linha confortável (1.4.8) e navegação em
  accordion. O *claim* AAA cobre a **UI própria** — o avatar VLibras (terceiros) e
  o conteúdo técnico de leitura avançada (3.1.5) ficam fora desse escopo, e a
  conformidade plena exige auditoria manual + tecnologia assistiva.
- Respeita `prefers-reduced-motion` e `prefers-color-scheme`; suporta
  `forced-colors` (Modo de Alto Contraste do Windows).
- Tipografia legível (Atkinson Hyperlegible quando disponível).

## 🛡️ Segurança / WAF

- **WAF de aplicação** (`server/waf.js`): bloqueia (403) os principais ataques —
  path traversal/LFI, SQL injection, XSS, command/template injection, arquivos
  sensíveis (`.git`/`.env`), métodos HTTP não permitidos e payloads
  percent-encoded (decodificação dupla).
- **WAF na borda:** Ingress com **ModSecurity + OWASP Core Rule Set**, com escopo
  restrito a este site.
- **Defesa em profundidade:** helmet (CSP, HSTS, `nosniff`, `X-Frame-Options`),
  rate-limiting na aplicação e no ingress, container **não-root** com filesystem
  somente leitura e `cap drop ALL` (apenas `NET_RAW` para ping/traceroute).
- Cobertura por testes automatizados em `tests/security.spec.ts`.

## 🏗️ Arquitetura

- **Frontend:** React 18 + TypeScript + Vite + MUI 5 + react-i18next + react-router
- **Backend:** Node.js + Express (helmet, compression, rate-limit, WAF)
- **Infra:** Docker (multi-stage) → Kubernetes (Ingress nginx + cert-manager, TLS
  automático Let's Encrypt, 2 réplicas)

## 💻 Desenvolvimento

```bash
# backend
cd server && npm install && npm run dev      # :8080

# frontend (proxy /api -> :8080)
cd web && npm install && npm run dev          # :5173
```

## 🚀 Build & Deploy

```bash
docker build -t devtools-khori:latest .
# substitua __IMAGE__ pela tag publicada e aplique os manifestos
kubectl apply -f deploy/k8s.yaml
```

## ✅ Testes (acessibilidade + segurança)

```bash
cd tests && npm install && npx playwright install
BASE_URL=https://dev.tools.khori.com.br npm test
```

- **axe-core** audita a home e todas as ferramentas com tags WCAG 2/2.1 A/AA/AAA.
- Valida _skip link_, ordem de Tab, estrutura de cabeçalhos/marcos, troca de tema
  e de idioma (`<html lang>` + conteúdo traduzido) nos 5 idiomas.
- A suíte de **segurança** verifica os headers, o bloqueio do WAF para várias
  classes de ataque, métodos HTTP, a proteção SSRF e a validação de entrada.

> Ferramentas automatizadas cobrem parte do nível AAA; itens que exigem avaliação
> manual (ex.: 1.4.8, 2.4.10) foram considerados no design.

## 📄 Licença

MIT.
