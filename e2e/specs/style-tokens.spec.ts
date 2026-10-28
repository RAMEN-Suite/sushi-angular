import { expect, type Locator, type Page, test } from '@playwright/test';

async function configureTokens(page: Page, theme: string): Promise<void> {
  await page.evaluate((name: string): void => {
    document.documentElement.setAttribute('data-theme', name);
    document.documentElement.style.setProperty('--sui-color-overlay', 'rgb(30, 40, 50)');
    document.documentElement.style.setProperty('--sui-color-border', 'rgb(80, 90, 100)');
    document.documentElement.style.setProperty('--sui-shadow-overlay', 'rgb(0, 0, 0) 0px 3px 9px');
    document.documentElement.style.setProperty('--sui-color-hover', 'rgb(110, 120, 130)');
    document.documentElement.style.setProperty('--sui-disabled-opacity', '0.25');
  }, theme);
}

interface SurfaceStyles {
  readonly background: string;
  readonly border: string;
  readonly shadow: string;
  readonly hover: string;
}

async function themeStyles(page: Page, theme: string): Promise<SurfaceStyles> {
  return page.evaluate((name: string): SurfaceStyles => {
    document.documentElement.setAttribute('data-theme', name);
    const probe: HTMLDivElement = document.createElement('div');
    probe.style.cssText =
      'background: var(--sui-color-overlay); color: var(--sui-color-border); box-shadow: var(--sui-shadow-overlay)';
    document.body.append(probe);
    const style: CSSStyleDeclaration = getComputedStyle(probe);
    const background: string = style.backgroundColor;
    const border: string = style.color;
    const shadow: string = style.boxShadow;
    probe.style.backgroundColor = 'var(--sui-color-hover)';
    const hover: string = getComputedStyle(probe).backgroundColor;
    probe.remove();
    return { background, border, shadow, hover };
  }, theme);
}

async function expectOverlayTokens(surface: Locator, expected?: SurfaceStyles): Promise<void> {
  await expect(surface).toHaveCSS('background-color', expected?.background ?? 'rgb(30, 40, 50)');
  await expect(surface).toHaveCSS('border-top-color', expected?.border ?? 'rgb(80, 90, 100)');
  await expect(surface).toHaveCSS('box-shadow', expected?.shadow ?? 'rgb(0, 0, 0) 0px 3px 9px 0px');
}

for (const theme of ['sushi', 'sushi-dark']) {
  test(`popup and striped Table hover defaults follow ${theme} without token overrides @css`, async ({
    page,
  }: {
    page: Page;
  }): Promise<void> => {
    await page.goto('/select');
    const expected: SurfaceStyles = await themeStyles(page, theme);
    await expect(page.locator('html')).toHaveCSS('color-scheme', theme === 'sushi-dark' ? 'dark' : 'light');
    await page.getByRole('combobox', { name: 'Favorite color', exact: true }).click();
    await expectOverlayTokens(page.getByRole('listbox').locator('..'), expected);

    await page.goto('/menu');
    await themeStyles(page, theme);
    await page.getByRole('button', { name: 'More message actions', exact: true }).click();
    await expectOverlayTokens(page.locator('sui-menu-surface > .sui-internal-overlay-surface'), expected);

    await page.goto('/table');
    await themeStyles(page, theme);
    const row: Locator = page.getByRole('table', { name: 'Compact team directory', exact: true }).locator('tbody tr').nth(1);
    await row.hover();
    await expect(row).toHaveCSS('background-color', expected.hover);
  });

  test(`selection and menu popups honor shared surface and hover tokens in ${theme} @css`, async ({
    page,
  }: {
    page: Page;
  }): Promise<void> => {
    await page.goto('/select');
    await configureTokens(page, theme);
    await page.getByRole('combobox', { name: 'Favorite color', exact: true }).click();
    const option: Locator = page.getByRole('option', { name: 'Emerald', exact: true });
    await expectOverlayTokens(page.getByRole('listbox').locator('..'));
    await option.hover();
    await expect(option).toHaveCSS('background-color', 'rgb(110, 120, 130)');

    await page.goto('/menu');
    await configureTokens(page, theme);
    await page.getByRole('button', { name: 'More message actions', exact: true }).click();
    await expectOverlayTokens(page.locator('sui-menu-surface > .sui-internal-overlay-surface'));
  });
}

test('disabled Chip and Listbox honor the shared opacity token @css', async ({ page }: { page: Page }): Promise<void> => {
  await page.goto('/chip');
  await configureTokens(page, 'sushi');
  await expect(page.locator('sui-chip').filter({ hasText: 'Removal disabled' })).toHaveCSS('opacity', '0.25');

  await page.goto('/listbox');
  await configureTokens(page, 'sushi');
  const listbox: Locator = page.getByRole('listbox', { name: 'Disabled listbox', exact: true });
  await expect(listbox.locator('..')).toHaveCSS('opacity', '0.25');
});

for (const example of [
  { path: '/select', label: 'Workspace team' },
  { path: '/multi-select', label: 'Workspace teams' },
]) {
  test(`${example.path} popup header and footer share the border token @css`, async ({ page }: { page: Page }): Promise<void> => {
    await page.goto(example.path);
    await configureTokens(page, 'sushi');
    await page.getByRole('combobox', { name: example.label, exact: true }).click();
    const surface: Locator = page.locator('.sui-internal-overlay-surface');
    await expect(surface.locator(':scope > .border-b')).toHaveCSS('border-bottom-color', 'rgb(80, 90, 100)');
    await expect(surface.locator(':scope > .border-t')).toHaveCSS('border-top-color', 'rgb(80, 90, 100)');
  });
}

test('Table hover overrides reach ordinary, striped and pinned rows @css', async ({ page }: { page: Page }): Promise<void> => {
  await page.goto('/table');
  await configureTokens(page, 'sushi');
  for (const name of ['Recent invoices', 'Compact team directory', 'Release queue']) {
    const row: Locator = page.getByRole('table', { name, exact: true }).locator('tbody tr').nth(1);
    await row.hover();
    await expect(row).toHaveCSS('background-color', 'rgb(110, 120, 130)');
    if (name === 'Release queue') {
      await expect(row.locator('th, td').first()).toHaveCSS(
        'background-image',
        'linear-gradient(rgb(110, 120, 130), rgb(110, 120, 130))',
      );
    }
  }
});

test('neutral component borders share the configured public border token @css', async ({
  page,
}: {
  page: Page;
}): Promise<void> => {
  const cases: readonly (readonly [string, string])[] = [
    ['/table', 'sui-table > div'],
    ['/fieldset', 'fieldset[suiFieldset]'],
    ['/listbox', 'sui-listbox > div'],
    ['/menu', 'pg-menu-basic-example sui-menu-surface > div'],
    ['/dialog', 'sui-dialog dialog'],
    ['/gallery', '.sui-gallery__stage'],
    ['/input-group', '[suiInputGroupAddon]'],
  ];
  for (const [path, selector] of cases) {
    await page.goto(path);
    await page.evaluate((): void => document.documentElement.style.setProperty('--sui-color-border', 'rgb(80, 90, 100)'));
    await expect(page.locator(selector).first()).toHaveCSS('border-top-color', 'rgb(80, 90, 100)');
  }
});

test('OTP and disabled color presets derive text opacity from the shared token @css', async ({
  page,
}: {
  page: Page;
}): Promise<void> => {
  const cases: readonly (readonly [string, string])[] = [
    ['/input-otp', 'sui-input-otp .sui-input-otp--disabled > input'],
    ['/color-picker', 'sui-color-picker [role="radio"][aria-disabled="true"]'],
  ];
  for (const [path, selector] of cases) {
    await page.goto(path);
    await configureTokens(page, 'sushi');
    const expected: string = await page.evaluate((): string => {
      const probe: HTMLSpanElement = document.createElement('span');
      probe.style.color = 'color-mix(in oklab, var(--color-base-content) calc(var(--sui-disabled-opacity) * 100%), transparent)';
      document.body.append(probe);
      const color: string = getComputedStyle(probe).color;
      probe.remove();
      return color;
    });
    await expect(page.locator(selector).first()).toHaveCSS('color', expected);
  }
});
