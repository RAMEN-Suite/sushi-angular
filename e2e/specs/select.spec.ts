import { expect, type Locator, type Page, test } from '@playwright/test';

import { type Bounds, visibleBounds } from '../support/geometry';

test('Select popup follows its control and commits an option', async ({ page }: { page: Page }): Promise<void> => {
  await page.goto('/select');
  const select: Locator = page.getByRole('combobox', { name: 'Favorite color' });
  await select.press('ArrowDown');

  const listbox: Locator = page.getByRole('listbox').first();

  await expect(listbox).toBeVisible();

  await expect(async (): Promise<void> => {
    const selectBounds: Bounds = await visibleBounds(select, 'the Select control');
    const popupBounds: Bounds = await visibleBounds(listbox.locator('..'), 'the Select popup');

    const horizontalTolerance: number = selectBounds.width * 0.02;

    expect(Math.abs(popupBounds.x - selectBounds.x)).toBeLessThan(horizontalTolerance);
    expect(Math.abs(popupBounds.width - selectBounds.width)).toBeLessThan(horizontalTolerance);
  }).toPass({ timeout: 5_000 });

  await page.getByRole('option', { name: 'Emerald' }).click();

  await expect(listbox).toBeHidden();
  await expect(select).toContainText('Emerald');
});

test('Select filters choices and commits from the focused search field', async ({ page }: { page: Page }): Promise<void> => {
  await page.goto('/select');

  const control: Locator = page.getByRole('combobox', { name: 'Workflow', exact: true });

  await control.click();

  const search: Locator = page.getByRole('searchbox', { name: 'Filter workflows' });

  await expect(search).toBeFocused();

  await search.fill('Workflow 12');
  await expect(page.getByRole('option')).toHaveCount(1);

  await search.press('ArrowDown');
  await search.press('Enter');

  await expect(control).toContainText('Workflow 12');
  await expect(control).toBeFocused();
  await expect(search).toBeHidden();
});

test('Select header inputs retain focus and Escape returns to the control', async ({ page }: { page: Page }): Promise<void> => {
  await page.goto('/select');

  const control: Locator = page.getByRole('combobox', { name: 'Workspace team' });

  await control.click();

  const note: Locator = page.getByRole('textbox', { name: 'Team note' });
  await note.click();
  await note.fill('Design review');

  await expect(note).toBeFocused();
  await expect(page.getByRole('option', { name: 'Engineering', exact: true })).toBeVisible();

  await note.press('Escape');

  await expect(control).toBeFocused();
  await expect(control).toContainText('Product design');
  await expect(note).toBeHidden();
});

test('Select header input can Tab into the list and select by keyboard', async ({ page }: { page: Page }): Promise<void> => {
  await page.goto('/select');

  const control: Locator = page.getByRole('combobox', { name: 'Workspace team' });

  await control.click();

  const note: Locator = page.getByRole('textbox', { name: 'Team note' });
  await note.focus();
  await note.press('Tab');

  const options: Locator = page.getByRole('listbox', { name: 'Workspace team' });

  await expect(options).toBeFocused();

  await options.press('ArrowDown');
  await options.press('Enter');

  await expect(control).toContainText('Engineering');
  await expect(control).toBeFocused();
  await expect(note).toBeHidden();
});
