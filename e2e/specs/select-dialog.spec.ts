import { expect, Locator, Page, test } from '@playwright/test';

async function activate(control: Locator, isMobile: boolean): Promise<void> {
  if (isMobile) await control.tap();
  else await control.click();
}

test.beforeEach(async ({ page }: { page: Page }): Promise<void> => {
  await page.goto('/dialog');
  await page.getByRole('button', { name: 'Reserve a table', exact: true }).click();
});

test('Select options accept pointer selection inside a native modal without activating controls underneath', async ({
  page,
  isMobile,
}: {
  page: Page;
  isMobile: boolean;
}): Promise<void> => {
  const dialog: Locator = page.getByRole('dialog', { name: 'Table reservation' });
  const select: Locator = dialog.getByRole('combobox', { name: 'Confirmation language' });
  const checkbox: Locator = dialog.getByRole('checkbox', { name: 'Counter seating is okay' });
  await activate(select, isMobile);
  await activate(page.getByRole('option', { name: 'Deutsch', exact: true }), isMobile);

  await expect(select).toContainText('Deutsch');
  await expect(page.getByRole('listbox')).toBeHidden();
  await expect(checkbox).not.toBeChecked();
  await expect(dialog).toBeVisible();
  await expect(select).toBeFocused();
});

test('Select options remain keyboard accessible inside a native modal', async ({ page }: { page: Page }): Promise<void> => {
  const dialog: Locator = page.getByRole('dialog', { name: 'Table reservation' });
  const select: Locator = dialog.getByRole('combobox', { name: 'Confirmation language' });
  await select.press('ArrowDown');
  await expect(page.getByRole('listbox')).toBeVisible();
  await select.press('ArrowDown');
  const optionId: string | null = await page.getByRole('option', { name: 'Deutsch', exact: true }).getAttribute('id');
  await expect(select).toHaveAttribute('aria-activedescendant', optionId ?? '');
  await select.press('Enter');

  await expect(select).toContainText('Deutsch');
  await expect(page.getByRole('listbox')).toBeHidden();
  await expect(dialog).toBeVisible();
  await expect(select).toBeFocused();
});

test('Escape dismisses the Select popup before the enclosing modal', async ({ page }: { page: Page }): Promise<void> => {
  const dialog: Locator = page.getByRole('dialog', { name: 'Table reservation' });
  const select: Locator = dialog.getByRole('combobox', { name: 'Confirmation language' });
  await select.press('ArrowDown');
  await expect(page.getByRole('listbox')).toBeVisible();
  await select.press('Escape');

  await expect(page.getByRole('listbox')).toBeHidden();
  await expect(dialog).toBeVisible();
  await expect(select).toContainText('English');
  await select.press('Escape');
  await expect(dialog).toBeHidden();
});
