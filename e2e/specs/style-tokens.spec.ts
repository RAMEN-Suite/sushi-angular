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

async function expectOverlayTokens(surface: Locator): Promise<void> {
  await expect(surface).toHaveCSS('background-color', 'rgb(30, 40, 50)');
  await expect(surface).toHaveCSS('border-top-color', 'rgb(80, 90, 100)');
  await expect(surface).toHaveCSS('box-shadow', 'rgb(0, 0, 0) 0px 3px 9px 0px');
}

for (const theme of ['sushi', 'sushi-dark']) {
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
    await expectOverlayTokens(page.locator('sui-menu-surface > .sui-overlay-surface'));
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
