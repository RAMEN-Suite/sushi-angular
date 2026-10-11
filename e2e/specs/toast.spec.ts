import { expect, Locator, Page, test } from '@playwright/test';

test('Toast places actions below its message and completes the action flow', async ({ page }: { page: Page }): Promise<void> => {
  await page.goto('/toast');
  await page.getByRole('button', { name: 'Show action' }).click();

  const toast: Locator = page.getByRole('alert');
  const content: Locator = toast.locator('.sui-toast__content');
  const actions: Locator = toast.locator('.sui-toast__actions');

  await expect(content).not.toHaveText('');
  await expect(actions.getByRole('button')).toHaveCount(1);

  const contentBounds: { x: number; y: number; width: number; height: number } | null = await content.boundingBox();
  const actionBounds: { x: number; y: number; width: number; height: number } | null = await actions.boundingBox();
  if (!contentBounds || !actionBounds) throw new Error('Expected visible Toast content and actions.');

  const contentCenter: number = contentBounds.y + contentBounds.height / 2;
  const actionsCenter: number = actionBounds.y + actionBounds.height / 2;

  expect(actionsCenter).toBeGreaterThan(contentCenter);

  await actions.getByRole('button').click();

  await expect(toast).toBeHidden();
  await expect(page.getByRole('status')).toBeVisible();
  await expect(page.getByRole('status')).not.toHaveText('');
});
