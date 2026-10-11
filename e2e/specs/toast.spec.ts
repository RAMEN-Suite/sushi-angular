import { expect, Locator, Page, test } from '@playwright/test';

import { Bounds, visibleBounds } from '../support/geometry';

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
