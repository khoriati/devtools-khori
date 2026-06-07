// Network tool handlers. Every external command is run with execFile (never a
// shell), with a strict allow-list of arguments and a hard timeout, so that no
// user input can ever reach a shell or inject extra flags.
import { execFile } from 'node:child_process';
import dns from 'node:dns/promises';
import net from 'node:net';

const EXEC_TIMEOUT_MS = 15000;
const MAX_OUTPUT = 256 * 1024; // 256 KiB cap on command output

// A hostname or IP literal. Deliberately conservative: letters, digits, dot,
// hyphen and colon (IPv6) only, never starting with a hyphen (no flag injection).
const HOST_RE = /^(?![-:])[A-Za-z0-9.\-:]{1,253}$/;

export function isValidHost(value) {
  return typeof value === 'string' && HOST_RE.test(value) && !value.includes('..');
}

function run(cmd, args) {
  return new Promise((resolve) => {
    execFile(
      cmd,
      args,
      { timeout: EXEC_TIMEOUT_MS, maxBuffer: MAX_OUTPUT, windowsHide: true },
      (error, stdout, stderr) => {
        if (error && error.killed) {
          resolve({ ok: false, error: 'timeout', output: stdout || '' });
          return;
        }
        const output = (stdout || '') + (stderr ? `\n${stderr}` : '');
        resolve({ ok: !error || !!stdout, output: output.trim(), code: error?.code ?? 0 });
      },
    );
  });
}

// --- Origin masking ----------------------------------------------------------
// Hide the real origin server address (and internal hops) from ping/traceroute
// output so the non-Cloudflare origin is not exposed. The host/pod IPs are
// injected at runtime via the Kubernetes Downward API (never committed).
const MASK = '[oculto]';
const EXACT_IPS = [process.env.HOST_IP, process.env.POD_IP].filter(Boolean);
const PRIVATE_RE = [
  /\b(?:10|127)\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g,
  /\b169\.254\.\d{1,3}\.\d{1,3}\b/g,
  /\b192\.168\.\d{1,3}\.\d{1,3}\b/g,
  /\b172\.(?:1[6-9]|2\d|3[01])\.\d{1,3}\.\d{1,3}\b/g,
  /\b100\.(?:6[4-9]|[7-9]\d|1[01]\d|12[0-7])\.\d{1,3}\.\d{1,3}\b/g,
];

export function redactOrigin(text) {
  if (!text) return text;
  let out = text;
  for (const ip of EXACT_IPS) {
    out = out.split(ip).join(MASK); // dotted form, e.g. 154.53.48.84
    out = out.split(ip.replace(/\./g, '-')).join(MASK); // reverse-DNS form, e.g. 154-53-48-84
  }
  for (const re of PRIVATE_RE) out = out.replace(re, MASK);
  return out;
}

// Recursively apply redactOrigin to every string in an API response. This
// catches the origin address anywhere it might surface — e.g. the body of
// https://checkip.amazonaws.com in the HTTP inspector, or any header value.
export function redactDeep(value) {
  if (typeof value === 'string') return redactOrigin(value);
  if (Array.isArray(value)) return value.map(redactDeep);
  if (value && typeof value === 'object') {
    const out = {};
    for (const k of Object.keys(value)) out[k] = redactDeep(value[k]);
    return out;
  }
  return value;
}

export async function whois(host) {
  if (!isValidHost(host)) return { ok: false, error: 'invalid_host' };
  return run('whois', [host]);
}

export async function ping(host) {
  if (!isValidHost(host)) return { ok: false, error: 'invalid_host' };
  // -c 4 packets, -w 10s deadline. Works with iputils-ping (Linux).
  const r = await run('ping', ['-c', '4', '-w', '10', '-n', host]);
  return { ...r, output: redactOrigin(r.output) };
}

export async function traceroute(host) {
  if (!isValidHost(host)) return { ok: false, error: 'invalid_host' };
  // -m 20 max hops, -w 2 wait, -n numeric (no rDNS slowdown).
  const r = await run('traceroute', ['-m', '20', '-w', '2', '-q', '2', '-n', host]);
  return { ...r, output: redactOrigin(r.output) };
}

export async function digLookup(host, type) {
  if (!isValidHost(host)) return { ok: false, error: 'invalid_host' };
  const TYPES = new Set(['A', 'AAAA', 'MX', 'TXT', 'NS', 'CNAME', 'SOA', 'CAA', 'ANY']);
  const rtype = TYPES.has(String(type).toUpperCase()) ? String(type).toUpperCase() : 'A';
  return run('dig', ['+noall', '+answer', '+stats', host, rtype]);
}

// --- SSRF-safe HTTP inspector (curl-like) -------------------------------------
const PRIVATE_V4 = [
  [/^127\./, 'loopback'],
  [/^10\./, 'private'],
  [/^192\.168\./, 'private'],
  [/^169\.254\./, 'link-local'],
  [/^0\./, 'reserved'],
];

function isPrivateIp(ip) {
  if (net.isIPv4(ip)) {
    if (PRIVATE_V4.some(([re]) => re.test(ip))) return true;
    const [a, b] = ip.split('.').map(Number);
    if (a === 172 && b >= 16 && b <= 31) return true; // 172.16/12
    return false;
  }
  if (net.isIPv6(ip)) {
    const low = ip.toLowerCase();
    return low === '::1' || low.startsWith('fc') || low.startsWith('fd') || low.startsWith('fe80');
  }
  return true; // unknown family -> treat as unsafe
}

export async function httpInspect(rawUrl, method = 'GET') {
  let url;
  try {
    url = new URL(rawUrl);
  } catch {
    return { ok: false, error: 'invalid_url' };
  }
  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    return { ok: false, error: 'unsupported_protocol' };
  }
  const allowedMethods = new Set(['GET', 'HEAD', 'OPTIONS']);
  const verb = allowedMethods.has(String(method).toUpperCase()) ? method.toUpperCase() : 'GET';

  // Resolve and block requests to private/internal addresses (SSRF guard).
  let addresses = [];
  try {
    addresses = await dns.lookup(url.hostname, { all: true });
  } catch {
    return { ok: false, error: 'dns_failure' };
  }
  if (addresses.length === 0 || addresses.some((a) => isPrivateIp(a.address))) {
    return { ok: false, error: 'blocked_private_address' };
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), EXEC_TIMEOUT_MS);
  const started = process.hrtime.bigint();
  try {
    const res = await fetch(url.toString(), {
      method: verb,
      redirect: 'manual',
      signal: controller.signal,
      headers: { 'User-Agent': 'DevTools-Khori/1.0 (+https://dev.tools.khori.com.br)' },
    });
    const elapsedMs = Number(process.hrtime.bigint() - started) / 1e6;
    const headers = Object.fromEntries(res.headers.entries());
    let body = '';
    if (verb === 'GET') {
      const reader = res.body?.getReader();
      if (reader) {
        const chunks = [];
        let total = 0;
        // Read at most 64 KiB of the body for the preview.
        while (total < 64 * 1024) {
          const { done, value } = await reader.read();
          if (done) break;
          chunks.push(value);
          total += value.length;
        }
        await reader.cancel().catch(() => {});
        body = Buffer.concat(chunks).toString('utf8').slice(0, 64 * 1024);
      }
    }
    return {
      ok: true,
      status: res.status,
      statusText: res.statusText,
      url: res.url || url.toString(),
      elapsedMs: Math.round(elapsedMs),
      headers,
      body,
    };
  } catch (err) {
    if (err?.name === 'AbortError') return { ok: false, error: 'timeout' };
    return { ok: false, error: 'request_failed', detail: String(err?.message || err) };
  } finally {
    clearTimeout(timer);
  }
}
