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
