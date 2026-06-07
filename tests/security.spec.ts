import { test, expect } from '@playwright/test';

// Security tests run against the deployed app (BASE_URL). They exercise the
// application WAF (server/waf.js), the security headers, input validation and
// the SSRF guard.

test.describe('Security headers', () => {
  test('sets the expected hardening headers', async ({ request }) => {
    const res = await request.get('/');
    const h = res.headers();
    expect(h['content-security-policy']).toBeTruthy();
    expect(h['strict-transport-security']).toContain('max-age=');
    expect(h['x-content-type-options']).toBe('nosniff');
    expect(h['x-frame-options']).toBeTruthy();
    expect(h['x-powered-by']).toBeUndefined();
  });
});

test.describe('WAF blocks common attacks', () => {
  const attacks: [name: string, path: string, headers?: Record<string, string>][] = [
    ['path traversal / LFI', '/api/dns?host=..%2f..%2f..%2fetc%2fpasswd'],
    ['SQL injection', "/api/whois?host=1'%20OR%201=1--"],
    ['XSS', '/?q=%3Cscript%3Ealert(1)%3C%2Fscript%3E'],
    ['sensitive file (.git)', '/.git/config'],
    ['template injection', '/?x=%7B%7B7*7%7D%7D'],
    ['shellshock user-agent', '/', { 'User-Agent': '() { :; }; cat /etc/passwd' }],
  ];

  for (const [name, path, headers] of attacks) {
    test(`blocks ${name}`, async ({ request }) => {
      const res = await request.get(path, { headers, maxRedirects: 0 });
      expect(res.status(), `${name} should be blocked`).toBe(403);
    });
  }

  test('rejects disallowed HTTP methods', async ({ request }) => {
    const res = await request.delete('/api/health');
    expect(res.status()).toBe(405);
  });
});

test.describe('Backend input validation & SSRF guard', () => {
  test('health endpoint works', async ({ request }) => {
    const res = await request.get('/api/health');
    expect(res.ok()).toBeTruthy();
    expect((await res.json()).ok).toBe(true);
  });

  test('rejects command-injection-style host without executing', async ({ request }) => {
    const res = await request.get('/api/whois?host=' + encodeURIComponent('google.com;id'));
    const body = await res.json();
    // Either the WAF blocks it (403) or the validator rejects it as invalid_host.
    if (res.status() === 200) expect(body.error).toBe('invalid_host');
    else expect(res.status()).toBe(403);
  });

  test('SSRF guard blocks requests to private addresses', async ({ request }) => {
    const res = await request.post('/api/http', { data: { url: 'http://127.0.0.1/' } });
    const body = await res.json();
    expect(body.ok).toBe(false);
    expect(body.error).toBe('blocked_private_address');
  });

  test('a legitimate DNS lookup still succeeds', async ({ request }) => {
    const res = await request.get('/api/dns?host=example.com&type=A');
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(body.output).toContain('example.com');
  });
});

test.describe('Network tools & origin masking', () => {
  test('ping works (unprivileged ICMP, no raw-socket error)', async ({ request }) => {
    const res = await request.get('/api/ping?host=1.1.1.1');
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(body.output).toContain('1.1.1.1');
    expect(body.output).not.toContain('Operation not permitted');
  });

  test('traceroute masks the real origin address (no private/internal IPs)', async ({ request }) => {
    const res = await request.get('/api/traceroute?host=1.1.1.1');
    const body = await res.json();
    expect(body.ok).toBe(true);
    // RFC1918 / loopback / link-local must have been redacted to [oculto].
    const leaked = /\b(?:10|127)\.\d+\.\d+\.\d+\b|\b192\.168\.\d+\.\d+\b|\b172\.(?:1[6-9]|2\d|3[01])\.\d+\.\d+\b|\b169\.254\.\d+\.\d+\b/;
    expect(body.output).not.toMatch(leaked);
  });
});
