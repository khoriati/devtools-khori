// Lightweight application-level WAF. Inspects the request line (decoded path +
// query string) and a few headers for the most common attack classes and
// rejects them with 403. Deliberately does NOT inspect request bodies: the
// only body endpoint (/api/http) is already guarded by strict validation and
// an SSRF check, and body inspection would risk false positives on legitimate
// URL-inspection input.

const ALLOWED_METHODS = new Set(['GET', 'HEAD', 'POST', 'OPTIONS']);
const MAX_URL_LENGTH = 2048;
const MAX_HEADER_COUNT = 60;

// Attack signatures. Kept narrow enough not to match the app's own traffic
// (SPA routes /tool/<id> and /api/* host/type params).
const SIGNATURES = [
  { id: 'path-traversal', re: /(?:\.\.[\/\\]|%2e%2e[\/\\]|%2e%2e%2f|\.\.%2f)/i },
  { id: 'lfi', re: /(?:\/etc\/passwd|\/proc\/self\/|boot\.ini|win\.ini|\/etc\/shadow)/i },
  { id: 'sqli', re: /(\bunion\b[\s\S]{0,20}\bselect\b|\bselect\b[\s\S]{0,40}\bfrom\b|\binsert\b\s+into\b|\bdrop\b\s+table\b|\bor\b\s+1\s*=\s*1|'\s*or\s*'|--\s|\bsleep\s*\(|\bbenchmark\s*\()/i },
  { id: 'xss', re: /(<script\b|%3cscript|javascript:|onerror\s*=|onload\s*=|<svg\b|<img[^>]*\bonerror)/i },
  { id: 'cmd-injection', re: /(?:[;`]|\|\||&&|\$\(|%60|%24%28)\s*(?:cat|ls|id|whoami|wget|curl|nc|bash|sh|powershell|cmd|ping)\b/i },
  { id: 'null-byte', re: /%00|\x00/ },
  { id: 'sensitive-files', re: /(?:^|\/)\.(?:git|env|aws|ssh)(?:\/|$)/i },
  { id: 'template-injection', re: /(\$\{[\s\S]*\}|\{\{[\s\S]*\}\}|<%[\s\S]*%>)/ },
];

const HEADERS_TO_SCAN = ['user-agent', 'referer', 'x-forwarded-for', 'cookie'];

export function waf() {
  return (req, res, next) => {
    if (!ALLOWED_METHODS.has(req.method)) {
      return res.status(405).json({ ok: false, error: 'method_not_allowed' });
    }
    if (req.originalUrl.length > MAX_URL_LENGTH || Object.keys(req.headers).length > MAX_HEADER_COUNT) {
      return res.status(400).json({ ok: false, error: 'request_too_large' });
    }

    // Decode the URL up to twice to catch single/double percent-encoded payloads.
    let url = req.originalUrl;
    for (let i = 0; i < 2; i++) {
      try {
        const dec = decodeURIComponent(url);
        if (dec === url) break;
        url = dec;
      } catch {
        // Malformed percent-encoding is itself suspicious.
        return res.status(400).json({ ok: false, error: 'malformed_request' });
      }
    }

    const haystacks = [req.originalUrl, url];
    for (const h of HEADERS_TO_SCAN) {
      const v = req.headers[h];
      if (typeof v === 'string') haystacks.push(v);
    }

    for (const sig of SIGNATURES) {
      if (haystacks.some((s) => sig.re.test(s))) {
        res.setHeader('X-WAF-Block', sig.id);
        return res.status(403).json({ ok: false, error: 'blocked_by_waf' });
      }
    }

    return next();
  };
}
