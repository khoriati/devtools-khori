import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// Tool ids mirror web/src/tools/registry.tsx
const TOOL_IDS = [
  'base-converter', 'jwt', 'base64', 'url', 'hash', 'uuid', 'timestamp', 'json',
  'contrast', 'whois', 'ping', 'traceroute', 'dns', 'http',
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
});
