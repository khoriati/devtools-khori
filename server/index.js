import express from 'express';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { whois, ping, traceroute, digLookup, httpInspect, redactDeep } from './tools.js';
import { waf } from './waf.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 8080;
const STATIC_DIR = process.env.STATIC_DIR || path.join(__dirname, 'public');

const app = express();
app.disable('x-powered-by');
app.set('trust proxy', 1);

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        // MUI/Emotion injects styles at runtime; allow inline styles only.
        styleSrc: ["'self'", "'unsafe-inline'"],
        // 'self' for our bundle; the VLibras (Libras sign-language) widget loads
        // its plugin from vlibras.gov.br and its 3D avatar runs on WebAssembly
        // ('wasm-unsafe-eval' enables wasm compilation WITHOUT allowing eval()).
        // See docs/VLIBRAS.md for why each origin/keyword is required.
        // VLibras (Libras): the gov.br loader serves the plugin from jsDelivr and
        // the icons/avatar/dictionary from *.vlibras.gov.br; the 3D avatar runs on
        // WebAssembly ('wasm-unsafe-eval' enables wasm WITHOUT allowing eval()).
        // NOTE: the VLibras 3D avatar is an older Unity (asm.js/.unityweb) build
        // that uses eval(), so it requires 'unsafe-eval' (not just wasm). This is
        // a deliberate trade-off to enable the Libras sign-language avatar; inline
        // scripts remain blocked (no 'unsafe-inline'), and the app WAF + strict
        // input validation still apply. See docs/VLIBRAS.md.
        scriptSrc: ["'self'", "'unsafe-eval'", "'wasm-unsafe-eval'", 'blob:', 'https://vlibras.gov.br', 'https://*.vlibras.gov.br', 'https://cdn.jsdelivr.net'],
        imgSrc: ["'self'", 'data:', 'https://vlibras.gov.br', 'https://*.vlibras.gov.br', 'https://cdn.jsdelivr.net'],
        connectSrc: ["'self'", 'https://vlibras.gov.br', 'https://*.vlibras.gov.br', 'https://cdn.jsdelivr.net'],
        mediaSrc: ["'self'", 'https://vlibras.gov.br', 'https://*.vlibras.gov.br', 'https://cdn.jsdelivr.net'],
        fontSrc: ["'self'", 'data:', 'https://vlibras.gov.br', 'https://*.vlibras.gov.br', 'https://cdn.jsdelivr.net'],
        workerSrc: ["'self'", 'blob:'],
        objectSrc: ["'none'"],
        baseUri: ["'self'"],
        frameAncestors: ["'none'"],
      },
    },
    crossOriginEmbedderPolicy: false,
  }),
);
app.use(compression());
// WAF runs before any routing or body parsing.
app.use(waf());
app.use(express.json({ limit: '64kb' }));

// Rate-limit the API: network probes are relatively expensive.
const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 40,
  standardHeaders: true,
  legacyHeaders: false,
  message: { ok: false, error: 'rate_limited' },
});
app.use('/api/', apiLimiter);

// Redact the real origin address from every API response (defense in depth):
// covers ping/traceroute hops, the HTTP inspector body/headers, etc.
app.use('/api/', (_req, res, next) => {
  const originalJson = res.json.bind(res);
  res.json = (body) => originalJson(redactDeep(body));
  next();
});

const asyncHandler = (fn) => (req, res) =>
  Promise.resolve(fn(req, res)).catch((err) => {
    res.status(500).json({ ok: false, error: 'internal_error', detail: String(err?.message || err) });
  });

app.get('/api/health', (_req, res) => res.json({ ok: true, service: 'devtools-khori', ts: Date.now() }));

app.get('/api/whois', asyncHandler(async (req, res) => res.json(await whois(req.query.host))));
app.get('/api/ping', asyncHandler(async (req, res) => res.json(await ping(req.query.host))));
app.get('/api/traceroute', asyncHandler(async (req, res) => res.json(await traceroute(req.query.host))));
app.get('/api/dns', asyncHandler(async (req, res) => res.json(await digLookup(req.query.host, req.query.type))));
app.post('/api/http', asyncHandler(async (req, res) => {
  const { url, method } = req.body || {};
  res.json(await httpInspect(url, method));
}));

// Static SPA hosting (production build copied into ./public).
app.use(express.static(STATIC_DIR, { index: false, maxAge: '1h' }));
app.get('*', (_req, res) => {
  res.sendFile(path.join(STATIC_DIR, 'index.html'), (err) => {
    if (err) res.status(404).json({ ok: false, error: 'not_found' });
  });
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`devtools-khori listening on :${PORT}`);
});
