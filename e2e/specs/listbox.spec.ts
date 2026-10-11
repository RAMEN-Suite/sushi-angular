import { expect, Locator, Page, test } from '@playwright/test';

test('Listbox selects the focused option with Space', async ({ page }: { page: Page }): Promise<void> => {
  await page.goto('/listbox');
  const listbox: Locator = page.getByRole('listbox', { name: 'Active workspace' });
  const engineering: Locator = page.getByRole('option', { name: 'Engineering' }).first();

  await listbox.focus();
  await listbox.press('ArrowDown');
  await listbox.press('Space');

  await expect(engineering).toHaveAttribute('aria-selected', 'true');
  await expect(page.getByText('Selected: engineering', { exact: true })).toBeVisible();
});
