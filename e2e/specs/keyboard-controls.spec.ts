import { expect, Locator, Page, test } from '@playwright/test';

test('Tabs follow arrow focus, activate the focused tab, and skip disabled tabs', async ({
  page,
}: {
  page: Page;
}): Promise<void> => {
  await page.goto('/tabs');
  const tablist: Locator = page.getByRole('tablist', { name: 'Account sections' });
  const profile: Locator = tablist.getByRole('tab', { name: 'Profile' });
  const security: Locator = tablist.getByRole('tab', { name: 'Security' });

  await profile.focus();
  await profile.press('ArrowRight');
  await expect(security).toBeFocused();
  await expect(security).toHaveAttribute('aria-selected', 'true');
  await expect(page.getByRole('tabpanel', { name: 'Security' })).toBeVisible();

  await security.press('ArrowRight');
  await expect(profile).toBeFocused();
  await expect(profile).toHaveAttribute('aria-selected', 'true');
});

test('Accordion moves focus between triggers and keeps one item expanded', async ({ page }: { page: Page }): Promise<void> => {
  await page.goto('/accordion');
  const shipping: Locator = page.getByRole('button', { name: 'When will my order arrive?' });
  const returns: Locator = page.getByRole('button', { name: 'How do returns work?' });

  await expect(shipping).toHaveAttribute('aria-expanded', 'true');
  await shipping.focus();
  await shipping.press('ArrowDown');
  await expect(returns).toBeFocused();

  await returns.press('Enter');
  await expect(returns).toHaveAttribute('aria-expanded', 'true');
  await expect(shipping).toHaveAttribute('aria-expanded', 'false');
});

test('Listbox exposes one keyboard selection through its active descendant', async ({ page }: { page: Page }): Promise<void> => {
  await page.goto('/listbox');
  const listbox: Locator = page.getByRole('listbox', { name: 'Active workspace' });
  const engineering: Locator = page.getByRole('option', { name: 'Engineering' }).first();

  await listbox.focus();
  await listbox.press('ArrowDown');
  await listbox.press('Space');

  await expect(engineering).toHaveAttribute('aria-selected', 'true');
  await expect(page.getByText('Selected: engineering', { exact: true })).toBeVisible();
});
