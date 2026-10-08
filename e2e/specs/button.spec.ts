import { expect, Locator, Page, test } from '@playwright/test';

test('enabled Button actions use a pointer while disabled and loading actions do not', async ({
  page,
}: {
  page: Page;
}): Promise<void> => {
  await page.goto('/button');
  await expect(page.getByRole('button', { name: 'Create project' })).toHaveCSS('cursor', 'pointer');
  await expect(page.getByRole('link', { name: 'Angular documentation', exact: true })).toHaveCSS('cursor', 'pointer');
  await expect(page.getByRole('button', { name: 'Unavailable', exact: true })).toHaveCSS('cursor', 'not-allowed');
  const save: Locator = page.getByRole('button', { name: 'Save changes', exact: true });
  await save.click();
  await expect(page.getByRole('button', { name: 'Saving', exact: true })).toHaveCSS('cursor', 'not-allowed');
});
