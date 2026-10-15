import { expect, type Locator, type Page, test } from '@playwright/test';

test('Multi-Select remains open while adding multiple options', async ({ page }: { page: Page }): Promise<void> => {
  await page.goto('/multi-select');
  const select: Locator = page.getByRole('combobox', { name: 'Message labels' });
  await select.click();

  const listbox: Locator = page.getByRole('listbox').first();

  await expect(listbox).toBeVisible();

  await page.getByRole('option', { name: 'Important' }).click();

  await expect(listbox).toBeVisible();

  await page.getByRole('option', { name: 'Personal' }).click();

  await expect(listbox).toBeVisible();
  await expect(page.getByText('Selected: 2 labels', { exact: true })).toBeVisible();
});
