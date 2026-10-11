import { expect, Locator, Page, test } from '@playwright/test';

import { Bounds, visibleBounds } from '../support/geometry';

test('Select popup follows its control and commits an option', async ({ page }: { page: Page }): Promise<void> => {
  await page.goto('/select');
  const select: Locator = page.getByRole('combobox', { name: 'Favorite color' });
  await select.press('ArrowDown');

  const listbox: Locator = page.getByRole('listbox').first();

  await expect(listbox).toBeVisible();

  const selectBounds: Bounds = await visibleBounds(select, 'the Select control');
  const popupBounds: Bounds = await visibleBounds(listbox.locator('..'), 'the Select popup');

  const horizontalTolerance: number = selectBounds.width * 0.02;

  expect(Math.abs(popupBounds.x - selectBounds.x)).toBeLessThan(horizontalTolerance);
  expect(Math.abs(popupBounds.width - selectBounds.width)).toBeLessThan(horizontalTolerance);

  await page.getByRole('option', { name: 'Emerald' }).click();

  await expect(listbox).toBeHidden();
  await expect(select).toContainText('Emerald');
});
