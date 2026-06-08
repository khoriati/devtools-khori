import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// Tool ids mirror web/src/tools/registry.tsx
const TOOL_IDS = [
  'base-converter', 'ip-calculator', 'chmod', 'jwt', 'base64', 'url', 'hash', 'uuid',
  'timestamp', 'json', 'contrast', 'whois', 'ping', 'traceroute', 'dns', 'http',
  'linux', 'docker', 'kubernetes', 'ffmpeg', 'magick', 'cmd-compare', 'pkg', 'powershell', 'azure-cli', 'aws-cli',
  'cpf', 'cnpj', 'a11y-cli', 'glossary',
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
    // Groups are collapsible (accordion): expand the one containing Docker first.
    await page.getByRole('button', { name: /quick reference|referência/i }).click();
    const nav = page.getByRole('navigation', { name: /tools navigation|navegação de ferramentas/i });
    const dockerLink = nav.getByRole('link', { name: /Docker/ });
    await dockerLink.waitFor();
    await dockerLink.focus();
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
    // Expand the (collapsible) group containing the chmod calculator first.
    await page.getByRole('button', { name: /converters|conversores|konverter|convertisseurs/i }).click();
    const nav = page.getByRole('navigation', { name: /tools navigation|navegação de ferramentas/i });
    const chmodLink = nav.getByRole('link', { name: /chmod/i });
    await chmodLink.waitFor();
    await chmodLink.focus();
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

  test('interactive tool result regions are reachable by keyboard', async ({ page }) => {
    // The result of calculators must be focusable so keyboard users can reach it
    // (regression: the IP subnet calculator result was previously not reachable).
    for (const id of ['ip-calculator', 'timestamp', 'contrast', 'base-converter']) {
      await page.goto(`/tool/${id}`, { waitUntil: 'networkidle' });
      const region = page.getByRole('region', { name: /result|resultado/i }).first();
      await region.focus();
      await expect(region, `result region of ${id} should be focusable`).toBeFocused();
    }
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

  test('activating the Home menu item moves focus to the page heading', async ({ page }) => {
    await page.goto('/tool/jwt', { waitUntil: 'networkidle' });
    const nav = page.getByRole('navigation', { name: /tools navigation|navegação de ferramentas/i });
    await nav.getByRole('link', { name: /^home$/i }).focus();
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/dev\.tools\.khori\.com\.br\/$/);
    await expect.poll(() => page.evaluate(() => document.activeElement?.tagName)).toBe('H1');
    await expect
      .poll(() => page.evaluate(() => document.activeElement?.textContent))
      .toMatch(/choose a tool|escolha/i);
    // The focused heading must have a VISIBLE focus indicator (not outline:none).
    const outline = await page.evaluate(() => {
      const cs = getComputedStyle(document.activeElement as Element);
      return { style: cs.outlineStyle, width: cs.outlineWidth };
    });
    expect(outline.style).not.toBe('none');
    expect(parseFloat(outline.width)).toBeGreaterThanOrEqual(2);
  });

  test('activating Home while already on Home still moves focus to the heading', async ({ page }) => {
    // Same-route activation: pressing Enter on "Início" while already on "/" does
    // not change the route, so an effect/navType-based focus move never fires.
    // The nav onClick must still pull focus into the page heading.
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.getByRole('navigation', { name: /tools navigation|navegação de ferramentas/i })
      .getByRole('link', { name: /^home$/i })
      .focus();
    await page.keyboard.press('Enter');
    await expect.poll(() => page.evaluate(() => document.activeElement?.tagName)).toBe('H1');
  });

  test('the end-of-menu marker is focusable, announces the boundary and is visibly focused', async ({ page }) => {
    await page.goto('/tool/jwt', { waitUntil: 'networkidle' });
    const marker = page.getByText(/end of navigation menu|fim do menu/i);
    await expect(marker).toHaveCount(1);
    await marker.focus();
    await expect(marker).toBeFocused();
    // Focusing it must reveal it (un-clip) and show a visible focus ring.
    const info = await marker.evaluate((el) => {
      const cs = getComputedStyle(el);
      return { outlineStyle: cs.outlineStyle, outlineWidth: cs.outlineWidth, clip: cs.clip };
    });
    expect(info.outlineStyle).not.toBe('none');
    expect(parseFloat(info.outlineWidth)).toBeGreaterThanOrEqual(2);
    expect(info.clip).toBe('auto');
  });

  test('activating the skip link moves focus to main', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.keyboard.press('Tab'); // skip link
    await page.keyboard.press('Enter');
    const id = await page.evaluate(() => document.activeElement?.id);
    expect(id).toBe('main-content');
  });

  test('Tab order reaches the search field and the collapsible group headers', async ({ page }) => {
    // With the accordion nav, groups are collapsed by default, so the tab order
    // contains the search field and the group disclosure buttons (few stops),
    // not every tool — which is the whole point of the change.
    await page.goto('/', { waitUntil: 'networkidle' });
    const seen: string[] = [];
    for (let i = 0; i < 25; i++) {
      await page.keyboard.press('Tab');
      seen.push(
        await page.evaluate(() => {
          const el = document.activeElement as HTMLElement | null;
          if (!el) return '';
          return `${el.tagName.toLowerCase()}|${el.getAttribute('type') ?? ''}|${el.getAttribute('aria-controls') ?? ''}`;
        }),
      );
    }
    expect(seen.some((s) => s.includes('search'))).toBeTruthy();
    // A group disclosure button (aria-controls -> group panel) is reachable.
    expect(seen.some((s) => s.includes('group-panel'))).toBeTruthy();
  });
});

test.describe('Collapsible (accordion) navigation', () => {
  test('groups are collapsed by default on home and expand on demand', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
    // No tool links rendered while groups are collapsed (fewer tab stops).
    expect(await page.locator('nav a[href^="/tool/"]').count()).toBe(0);
    const header = page.getByRole('button', { name: /converters|conversores|konverter|convertisseurs/i });
    await expect(header).toHaveAttribute('aria-expanded', 'false');
    await header.click();
    await expect(header).toHaveAttribute('aria-expanded', 'true');
    await expect(page.getByRole('link', { name: /chmod/i }).first()).toBeVisible();
  });

  test('the group of the current tool is expanded automatically', async ({ page }) => {
    await page.goto('/tool/docker', { waitUntil: 'networkidle' });
    await expect(page.locator('nav a[aria-current="page"]')).toBeVisible();
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

test.describe('VLibras (Libras sign language) — pt-BR only', () => {
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
});
