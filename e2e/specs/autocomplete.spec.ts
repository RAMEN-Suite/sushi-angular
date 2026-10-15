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

test('Autocomplete opens all fixed choices, filters, cancels and reopens on click', async ({
  page,
}: {
  page: Page;
}): Promise<void> => {
  await page.goto('/autocomplete');
  const input: Locator = page.getByRole('combobox', { name: 'Destination', exact: true });
  await input.focus();

  await expect(input).toHaveValue('Lisbon');
  await expect(page.getByRole('option')).toHaveCount(5);
  await input.fill('Ber');
  await expect(page.getByRole('option')).toHaveCount(1);
  await input.press('Escape');

  await expect(input).toHaveValue('Lisbon');
  await expect(page.getByRole('option')).toHaveCount(0);
  await input.click();
  await expect(page.getByRole('option')).toHaveCount(5);
  await input.fill('Cop');
  await input.press('ArrowDown');
  await input.press('Enter');

  await expect(input).toHaveValue('Copenhagen');
  await expect(input).toBeFocused();
  await expect(page.getByRole('option')).toHaveCount(0);
});

test('Autocomplete public show action focuses the input and displays every choice', async ({
  page,
}: {
  page: Page;
}): Promise<void> => {
  await page.goto('/autocomplete');
  await page.getByRole('button', { name: 'Show destinations' }).click();

  await expect(page.getByRole('combobox', { name: 'Destination', exact: true })).toBeFocused();
  await expect(page.getByRole('option')).toHaveCount(5);
});
