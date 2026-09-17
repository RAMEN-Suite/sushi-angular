import { expect, Locator, Page, test } from '@playwright/test';

interface Bounds {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
}

test.describe('Order List browser behavior', (): void => {
  test.beforeEach(async ({ page }: { page: Page }): Promise<void> => {
    await page.goto('/order-list');
  });

  test('keeps the grabbing cursor while a row is dragged', async ({ page }: { page: Page }): Promise<void> => {
    const list: Locator = page.locator('pg-order-list-drag-drop-example .cdk-drop-list');
    const row: Locator = list.locator('.cdk-drag').first();
    await row.scrollIntoViewIfNeeded();

    await expect(row).toHaveCSS('cursor', 'grab');
    const bounds: Bounds | null = await row.boundingBox();
    if (bounds === null) throw new Error('Expected the draggable row to have visible bounds.');

    const x: number = bounds.x + bounds.width / 2;
    const y: number = bounds.y + bounds.height / 2;
    await page.mouse.move(x, y);
    await page.mouse.down();

    try {
      await page.mouse.move(x, y + 20, { steps: 8 });
      await expect(list).toHaveClass(/cdk-drop-list-dragging/);
      await expect(list).toHaveCSS('cursor', 'grabbing');
      await expect(page.locator('.cdk-drag-preview')).toHaveCSS('cursor', 'grabbing');
    } finally {
      await page.mouse.up();
    }
  });
});
