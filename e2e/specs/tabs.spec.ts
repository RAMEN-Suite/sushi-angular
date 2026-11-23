import { expect, type Locator, type Page, test } from '@playwright/test';

test('Tabs display only the active panel while preserving inactive content @css', async ({
  page,
}: {
  page: Page;
}): Promise<void> => {
  await page.goto('/tabs');
  const tabs: Locator = page.locator('pg-tabs-behavior-example sui-tabs');
  const advanced: Locator = tabs.getByRole('tabpanel', { name: 'Advanced', includeHidden: true });

  await tabs.getByRole('tab', { name: 'Advanced' }).click();

  await expect(advanced).toBeVisible();
  await expect(tabs.locator('[role="tabpanel"]:visible')).toHaveCount(1);

  await tabs.getByRole('tab', { name: 'General' }).click();

  await expect(tabs.getByRole('tabpanel', { name: 'General' })).toBeVisible();
  await expect(advanced.getByRole('heading', { name: 'Advanced settings', includeHidden: true })).toBeAttached();
  await expect(advanced).toBeHidden();
  await expect(tabs.locator('[role="tabpanel"]:visible')).toHaveCount(1);
});
