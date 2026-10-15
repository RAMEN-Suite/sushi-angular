import { expect, type Locator, type Page, test } from '@playwright/test';

import { type Bounds, visibleBounds } from '../support/geometry';

test('Toast places actions below its message and completes the action flow', async ({ page }: { page: Page }): Promise<void> => {
  await page.goto('/toast');
  await page.getByRole('button', { name: 'Show action' }).click();

  const toast: Locator = page.getByRole('alert');
  const content: Locator = toast.locator('.sui-toast__content');
  const actions: Locator = toast.locator('.sui-toast__actions');

  await expect(content).not.toHaveText('');
  await expect(actions.getByRole('button')).toHaveCount(1);

  await expect(async (): Promise<void> => {
    const contentBounds: Bounds = await visibleBounds(content, 'the Toast content');
    const actionBounds: Bounds = await visibleBounds(actions, 'the Toast actions');

    const contentCenter: number = contentBounds.y + contentBounds.height / 2;
    const actionsCenter: number = actionBounds.y + actionBounds.height / 2;

    expect(actionsCenter).toBeGreaterThan(contentCenter);
  }).toPass({ timeout: 5_000 });

  await actions.getByRole('button').click();

  await expect(toast).toBeHidden();
  await expect(page.getByRole('status')).toBeVisible();
  await expect(page.getByRole('status')).not.toHaveText('');
});

test('Toast honours its placement offset and completes translated close dismissal', async ({
  page,
}: {
  page: Page;
}): Promise<void> => {
  await page.goto('/toast');
  await page.getByRole('button', { name: 'Show persistent', exact: true }).click();
  const toast: Locator = page.getByRole('status').filter({ hasText: 'You are working offline.' });
  const outlet: Locator = toast.locator('..');
  await outlet.locator('..').evaluate((host: HTMLElement): void => {
    host.style.setProperty('--sui-toast-offset-block', '96px');
    host.style.setProperty('--sui-toast-offset-inline', '24px');
  });

  await expect(outlet).toHaveCSS('top', '96px');
  await expect(outlet).toHaveCSS('inset-inline-end', '24px');
  await toast.getByRole('button', { name: 'Close notification' }).click();

  await expect(toast).toBeHidden();
});
