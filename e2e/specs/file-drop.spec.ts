import { expect, type JSHandle, type Locator, type Page, test } from '@playwright/test';

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
