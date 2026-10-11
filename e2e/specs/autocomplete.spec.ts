import { expect, Locator, Page, test } from '@playwright/test';

test('Autocomplete keeps keyboard focus while choosing a suggestion', async ({ page }: { page: Page }): Promise<void> => {
  await page.goto('/autocomplete');
  const input: Locator = page.getByRole('combobox', { name: 'City', exact: true });
  await input.fill('Ber');

  const option: Locator = page.getByRole('option', { name: 'Berlin' });

  await expect(option).toBeVisible();

  await input.press('ArrowDown');
  await input.press('Enter');

  await expect(input).toBeFocused();
  await expect(input).toHaveValue('Berlin');
  await expect(option).toBeHidden();
});
