import { expect, Locator, Page, test } from '@playwright/test';

test.use({ viewport: { width: 390, height: 844 } });

test('navbar exposes and closes its mobile navigation', async ({ page }: { page: Page }): Promise<void> => {
  await page.goto('/navbar');
  const section: Locator = page.getByText('Link navigation', { exact: true }).locator('..');
  const toggle: Locator = section.getByRole('button', { name: 'Toggle navigation' });
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await section.getByRole('button', { name: 'Products' }).press('Escape');
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(toggle).toBeFocused();
});

test('responsive table remains contained by a narrow viewport', async ({ page }: { page: Page }): Promise<void> => {
  await page.goto('/table');
  const table: Locator = page.getByRole('table', { name: 'Release queue' });
  const scrollContainer: Locator = table.locator('..');
  await expect(table).toBeVisible();

  const fitsViewport: boolean = await scrollContainer.evaluate((element: HTMLElement): boolean => {
    const bounds: DOMRect = element.getBoundingClientRect();
    return bounds.left >= 0 && bounds.right <= document.documentElement.clientWidth;
  });
  expect(fitsViewport).toBe(true);
});
