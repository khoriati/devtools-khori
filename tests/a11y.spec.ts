import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// Tool ids mirror web/src/tools/registry.tsx
const TOOL_IDS = [
  'base-converter', 'ip-calculator', 'chmod', 'jwt', 'base64', 'url', 'hash', 'uuid',
  'timestamp', 'json', 'contrast', 'whois', 'ping', 'traceroute', 'dns', 'http',
  'linux', 'docker', 'kubernetes', 'ffmpeg', 'magick', 'pkg', 'powershell', 'azure-cli', 'aws-cli',
  'cpf', 'cnpj', 'a11y-cli',
];

const LANGUAGES: [name: string, code: string][] = [
  ['Português (Brasil)', 'pt-BR'],
  ['English (US)', 'en-US'],
  ['Español', 'es'],
  ['Deutsch', 'de'],
  ['Français', 'fr'],
];

const WCAG_TAGS = ['wcag2a', 'wcag2aa', 'wcag2aaa', 'wcag21a', 'wcag21aa', 'wcag21aaa'];

async function scan(page: Page, path: string) {
  await page.goto(path, { waitUntil: 'networkidle' });
  // Exclude the third-party VLibras widget DOM ([vw]) — we don't control its markup.
  const results = await new AxeBuilder({ page }).withTags(WCAG_TAGS).exclude('[vw]').analyze();
  return results;
}

test.describe('WCAG AAA automated audit', () => {
  test('home page has no axe violations (incl. AAA)', async ({ page }) => {
    const results = await scan(page, '/');
    expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([]);
  });

  for (const id of TOOL_IDS) {
    test(`tool "${id}" has no axe violations (incl. AAA)`, async ({ page }) => {
      const results = await scan(page, `/tool/${id}`);
      expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([]);
    });
  }

  test('all three themes pass enhanced contrast', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
    for (const mode of ['Claro', 'Escuro', 'Alto contraste', 'Light', 'Dark', 'High contrast']) {
      const settings = page.getByRole('button', { name: /settings|configurações/i });
      if (!(await settings.count())) break;
      await settings.click();
      const option = page.getByRole('menuitem', { name: new RegExp(mode, 'i') });
      if (await option.count()) {
        await option.first().click();
        const results = await new AxeBuilder({ page })
          .withTags(['wcag2aaa', 'wcag21aaa'])
          .include('body')
          .analyze();
        expect(results.violations, `${mode}: ${JSON.stringify(results.violations)}`).toEqual([]);
      } else {
        await page.keyboard.press('Escape');
      }
    }
  });
});

test.describe('Keyboard & structure', () => {
  test('skip link is the first focusable element and targets main', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.keyboard.press('Tab');
    const focused = page.locator(':focus');
    await expect(focused).toHaveAttribute('href', '#main-content');
  });

  test('Enter focuses the tool heading; Shift-Tab returns to the active menu item', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.getByRole('link', { name: /Docker/ }).first().focus();
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/\/tool\/docker/);
    // Enter "enters" the tool: focus lands on the H1 heading.
    await expect.poll(() => page.evaluate(() => document.activeElement?.tagName)).toBe('H1');
    // Shift-Tab from the heading returns to the activated sidebar link.
    await page.keyboard.press('Shift+Tab');
    const info = await page.evaluate(() => ({
      href: document.activeElement?.getAttribute('href'),
      aria: document.activeElement?.getAttribute('aria-current'),
    }));
    expect(info.href).toContain('/tool/docker');
    expect(info.aria).toBe('page');
  });

  test('Shift-Tab while exploring the body returns to the active menu item via the breadcrumb', async ({ page }) => {
    // Reproduces: Tab to "chmod calculator" → Enter → Tab to the Copy button →
    // Shift-Tab back; after the "Home" breadcrumb, focus must land on the active
    // sidebar item (aria-current), not on the last menu item.
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.getByRole('link', { name: /chmod/i }).first().focus();
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/\/tool\/chmod/);
    await expect.poll(() => page.evaluate(() => document.activeElement?.tagName)).toBe('H1');

    // Tab forward into the body until we reach a Copy button.
    let reachedCopy = false;
    for (let i = 0; i < 12 && !reachedCopy; i++) {
      await page.keyboard.press('Tab');
      reachedCopy = await page.evaluate(() => /copy|copiar/i.test(document.activeElement?.textContent || ''));
    }
    expect(reachedCopy).toBeTruthy();

    // Shift-Tab back until we land on a sidebar tool link (href starts /tool/);
    // it must be the active one, not the last menu item.
    let landed: { href: string | null; aria: string | null } | null = null;
    for (let i = 0; i < 12; i++) {
      await page.keyboard.press('Shift+Tab');
      const el = await page.evaluate(() => {
        const a = document.activeElement as HTMLElement | null;
        const href = a?.getAttribute('href') || '';
        return a?.tagName === 'A' && href.startsWith('/tool/')
          ? { href, aria: a.getAttribute('aria-current') }
          : null;
      });
      if (el) {
        landed = el;
        break;
      }
    }
    expect(landed?.href).toContain('/tool/chmod');
    expect(landed?.aria).toBe('page');
  });

  test('exactly one h1 and a main landmark per page', async ({ page }) => {
    await page.goto('/tool/jwt', { waitUntil: 'networkidle' });
    await expect(page.locator('main#main-content')).toHaveCount(1);
    await expect(page.locator('h1')).toHaveCount(1);
  });

  test('language can be switched to English', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
    const settings = page.getByRole('button', { name: /settings|configurações/i });
    await settings.click();
    await page.getByRole('menu').waitFor();
    await page.getByRole('menuitem').filter({ hasText: 'English' }).first().click();
    await expect(page.locator('html')).toHaveAttribute('lang', 'en-US');
  });

  test('activating the skip link moves focus to main', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.keyboard.press('Tab'); // skip link
    await page.keyboard.press('Enter');
    const id = await page.evaluate(() => document.activeElement?.id);
    expect(id).toBe('main-content');
  });

  test('Tab order reaches the search field and a tool link', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
    const seen: string[] = [];
    for (let i = 0; i < 25; i++) {
      await page.keyboard.press('Tab');
      seen.push(
        await page.evaluate(() => {
          const el = document.activeElement as HTMLElement | null;
          if (!el) return '';
          return `${el.tagName.toLowerCase()}|${el.getAttribute('type') ?? ''}|${el.getAttribute('href') ?? ''}`;
        }),
      );
    }
    expect(seen.some((s) => s.includes('search'))).toBeTruthy();
    expect(seen.some((s) => s.includes('/tool/'))).toBeTruthy();
  });
});

test.describe('Semantics follow the selected language', () => {
  for (const [name, code] of LANGUAGES) {
    test(`switching to ${code} sets <html lang> and translates the heading`, async ({ page }) => {
      await page.goto('/', { waitUntil: 'networkidle' });
      await page.getByRole('button', { name: /settings|configurações|ajustes|einstellungen|paramètres/i }).click();
      await page.getByRole('menu').waitFor();
      await page.getByRole('menuitem').filter({ hasText: name }).first().click();
      await expect(page.locator('html')).toHaveAttribute('lang', code);
      // Heading must not be a raw i18n key (translation actually resolved).
      await expect(page.locator('h1')).not.toHaveText(/home\.heading/);
    });
  }
});

test.describe('Sign language — VLibras (pt-BR) & sign.mt (others)', () => {
  test('VLibras loads and its access button is visible WITHIN the viewport in pt-BR', async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('devtools-lang', 'pt-BR'));
    // Not 'networkidle': VLibras keeps connections open, so the network never idles.
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('[vw]')).toBeVisible();
    await expect
      .poll(() => page.evaluate(() => Boolean((window as unknown as { VLibras?: unknown }).VLibras)), {
        timeout: 25000,
      })
      .toBe(true);
    const button = page.locator('[vw-access-button]');
    await expect(button).toBeVisible();
    // Regression: the button must be on-screen (it was previously pushed far below).
    const box = await button.boundingBox();
    const viewport = page.viewportSize();
    expect(box, 'access button should have a box').not.toBeNull();
    expect(box!.y).toBeLessThan(viewport!.height);
    expect(box!.y).toBeGreaterThanOrEqual(0);
    // Regression: the button must actually render its icon (it was an empty,
    // invisible box when the plugin's assets failed to load).
    await expect(page.locator('[vw-access-button] img').first()).toBeVisible({ timeout: 20000 });
  });

  test('VLibras is not shown for other languages', async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('devtools-lang', 'en-US'));
    await page.goto('/', { waitUntil: 'networkidle' });
    await expect(page.locator('[vw]')).toBeHidden();
  });

  test('sign.mt button opens the translator dialog for non-pt-BR languages', async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('devtools-lang', 'en-US'));
    await page.goto('/', { waitUntil: 'networkidle' });
    const button = page.getByRole('button', { name: /sign language/i });
    await expect(button).toBeVisible();
    await button.click();
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await expect(dialog.locator('iframe')).toHaveAttribute('src', /sign\.mt/);
    // Dismissable via the keyboard-accessible Close button (reliable even when
    // focus is inside the cross-origin iframe, where Esc would be captured).
    await dialog.getByRole('button', { name: /close|fechar/i }).click();
    await expect(dialog).toBeHidden();
  });

  test('sign.mt button is not shown in pt-BR (VLibras is used instead)', async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('devtools-lang', 'pt-BR'));
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await expect(page.getByRole('button', { name: /sign language|língua de sinais/i })).toHaveCount(0);
  });
});
