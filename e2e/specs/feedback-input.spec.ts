import { expect, JSHandle, Locator, Page, test } from '@playwright/test';

test('File Drop accepts supported files and reports rejected files through a real drop event', async ({
  page,
}: {
  page: Page;
}): Promise<void> => {
  await page.goto('/file-drop');
  const zone: Locator = page.locator('pg-file-drop-basic-example .sui-file-drop__zone');
  const transfer: JSHandle<DataTransfer> = await page.evaluateHandle((): DataTransfer => {
    const dataTransfer: DataTransfer = new DataTransfer();
    dataTransfer.items.add(new File(['menu'], 'menu.txt', { type: 'text/plain' }));
    dataTransfer.items.add(new File(['binary'], 'menu.exe', { type: 'application/octet-stream' }));
    return dataTransfer;
  });

  await zone.dispatchEvent('drop', { dataTransfer: transfer });

  await expect(page.getByRole('list', { name: 'Selected files' }).getByText('menu.txt')).toBeVisible();
  await expect(page.getByText('Last drop: menu.txt', { exact: true })).toBeVisible();
  await expect(page.getByText('Rejected: menu.exe', { exact: true })).toBeVisible();
});

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
  expect(actionBounds.y).toBeGreaterThanOrEqual(contentBounds.y + contentBounds.height);
  expect(Math.abs(actionBounds.x - contentBounds.x)).toBeLessThanOrEqual(2);

  await actions.getByRole('button').click();
  await expect(toast).toBeHidden();
  await expect(page.getByRole('status')).toBeVisible();
  await expect(page.getByRole('status')).not.toHaveText('');
});
