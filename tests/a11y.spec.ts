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
  const results = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze();
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
