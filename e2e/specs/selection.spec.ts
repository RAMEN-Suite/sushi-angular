import { expect, Locator, Page, test } from '@playwright/test';

test('select chooses one option and closes its overlay', async ({ page }: { page: Page }): Promise<void> => {
  await page.goto('/select');
  const select: Locator = page.getByRole('combobox', { name: 'Favorite color' });
  await select.click();

  const option: Locator = page.getByRole('option', { name: 'Indigo', exact: true });
  await expect(option).toBeVisible();
  await option.click();
  await expect(select).toHaveAttribute('aria-expanded', 'false');
  await expect(page.getByText('Selected: indigo', { exact: true })).toBeVisible();
});

test('order list reorders its selected option from the keyboard', async ({ page }: { page: Page }): Promise<void> => {
  await page.goto('/order-list');
  const list: Locator = page.getByRole('listbox', { name: 'Release workflow' });
  const item: Locator = list.getByRole('option', { name: 'Collect requirements' });
  await item.click();
  await item.press('Alt+End');

  await expect(item).toHaveAttribute('aria-selected', 'true');
  await expect(list.getByRole('option').last()).toHaveText(/Collect requirements/);
  await expect(list).toBeFocused();
});
