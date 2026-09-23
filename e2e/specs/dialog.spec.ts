import { expect, Locator, Page, test } from '@playwright/test';

interface Bounds {
  readonly height: number;
  readonly width: number;
  readonly x: number;
  readonly y: number;
}

test.beforeEach(async ({ page }: { page: Page }): Promise<void> => {
  await page.goto('/dialog');
});

test('opens modally, closes with Escape, and restores trigger focus', async ({ page }: { page: Page }): Promise<void> => {
  const trigger: Locator = page.getByRole('button', { name: 'View today’s menu' });
  await trigger.click();
  const dialog: Locator = page.getByRole('dialog', { name: 'Today’s menu' });

  await expect(dialog).toBeVisible();
  await expect(trigger).toHaveAttribute('aria-expanded', 'true');
  await expect
    .poll(async (): Promise<boolean> => dialog.evaluate((node: HTMLElement) => node.contains(document.activeElement)))
    .toBe(true);

  await dialog.click({ position: { x: 4, y: 4 } });
  await expect(dialog).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
});

test('non-dismissible Dialog ignores Escape and honors its configured start position', async ({
  page,
}: {
  page: Page;
}): Promise<void> => {
  await page.getByRole('button', { name: 'Open prep board' }).click();
  const dialog: Locator = page.getByRole('dialog', { name: 'Prep board' });

  await page.keyboard.press('Escape');
  await expect(dialog).toBeVisible();
  const viewport: { readonly height: number; readonly width: number } | null = page.viewportSize();
  const bounds: Bounds | null = await dialog.boundingBox();
  if (viewport === null || bounds === null) throw new Error('Expected a visible right-positioned Dialog.');
  const rightGap: number = viewport.width - (bounds.x + bounds.width);
  expect(rightGap).toBeGreaterThanOrEqual(0);
  expect(rightGap).toBeLessThan(viewport.width * 0.05);
  await dialog.getByRole('button', { name: 'Close' }).click();
  await expect(dialog).toBeHidden();
});

test('non-modal Dialog keeps its background page scrollable', async ({ page }: { page: Page }): Promise<void> => {
  await page.getByRole('button', { name: 'Open prep board' }).click();
  const dialog: Locator = page.getByRole('dialog', { name: 'Prep board' });
  const content: Locator = page.locator('[suiDrawerContent]').first();
  const initialScroll: number = await content.evaluate((element: HTMLElement): number => element.scrollTop);

  await expect(dialog).toBeVisible();
  await page.mouse.move(500, 700);
  await page.mouse.wheel(0, 500);
  await expect
    .poll(async (): Promise<number> => content.evaluate((element: HTMLElement): number => element.scrollTop))
    .toBeGreaterThan(initialScroll);
});

test('drags only from the header and stays inside the viewport', async ({ page }: { page: Page }): Promise<void> => {
  await page.getByRole('button', { name: 'Open prep board' }).click();
  const dialog: Locator = page.getByRole('dialog', { name: 'Prep board' });
  const host: Locator = dialog.locator('..');
  const header: Locator = dialog.locator('[suiDialogHeader]');
  const body: Locator = dialog.locator('[suiDialogBody]');
  const initial: Bounds | null = await dialog.boundingBox();
  const handle: Bounds | null = await header.boundingBox();
  const bodyBounds: Bounds | null = await body.boundingBox();
  if (initial === null || handle === null || bodyBounds === null) throw new Error('Expected a visible draggable Dialog.');

  await expect(host).not.toHaveAttribute('draggable', 'true');
  await page.mouse.move(bodyBounds.x + bodyBounds.width / 2, bodyBounds.y + bodyBounds.height / 2);
  await page.mouse.down();
  await page.mouse.move(bodyBounds.x - 100, bodyBounds.y + bodyBounds.height / 2, { steps: 5 });
  await page.mouse.up();
  const afterBodyDrag: Bounds | null = await dialog.boundingBox();
  if (afterBodyDrag === null) throw new Error('Expected the Dialog to remain visible after dragging its body.');
  expect(Math.abs(afterBodyDrag.x - initial.x)).toBeLessThan(10);
  expect(Math.abs(afterBodyDrag.y - initial.y)).toBeLessThan(10);

  await page.mouse.move(handle.x + handle.width / 2, handle.y + handle.height / 2);
  await page.mouse.down();
  await page.mouse.move(handle.x - 100, handle.y + handle.height / 2, { steps: 5 });
  await page.mouse.up();

  const moved: Bounds | null = await dialog.boundingBox();
  expect(moved?.x).toBeLessThan(initial.x);
  expect(moved?.x).toBeGreaterThanOrEqual(0);
  expect(moved?.y).toBeGreaterThanOrEqual(0);
});

test('only an enabled drag handle exposes a move cursor', async ({ page }: { page: Page }): Promise<void> => {
  await page.getByRole('button', { name: 'View today’s menu' }).click();
  const staticHeader: Locator = page.getByRole('dialog', { name: 'Today’s menu' }).locator('[suiDialogHeader]');
  await expect(staticHeader).toHaveCSS('cursor', 'auto');
  await page.getByRole('dialog', { name: 'Today’s menu' }).getByRole('button', { name: 'Close' }).click();

  await page.getByRole('button', { name: 'Open prep board' }).click();
  const draggableHeader: Locator = page.getByRole('dialog', { name: 'Prep board' }).locator('[suiDialogHeader]');
  await expect(draggableHeader).toHaveCSS('cursor', 'move');
});

test('enables native bidirectional resizing', async ({ page }: { page: Page }): Promise<void> => {
  await page.getByRole('button', { name: 'Open prep board' }).click();
  const dialog: Locator = page.getByRole('dialog', { name: 'Prep board' });

  await expect(dialog).toHaveCSS('resize', 'both');
});

test('resizes in place without moving the Dialog origin', async ({
  page,
  browserName,
}: {
  page: Page;
  browserName: 'chromium' | 'firefox' | 'webkit';
}): Promise<void> => {
  test.skip(
    browserName === 'webkit' && process.platform === 'linux',
    'Linux WebKit has no mouse target when its native resize control uses zero-width overlay scrollbars.',
  );

  await page.getByRole('button', { name: 'Open prep board' }).click();
  const dialog: Locator = page.getByRole('dialog', { name: 'Prep board' });
  const header: Locator = dialog.locator('[suiDialogHeader]');
  const initialHeader: Bounds | null = await header.boundingBox();
  if (initialHeader === null) throw new Error('Expected a visible draggable Dialog header.');
  await page.mouse.move(initialHeader.x + initialHeader.width / 2, initialHeader.y + initialHeader.height / 2);
  await page.mouse.down();
  await page.mouse.move(initialHeader.x + initialHeader.width / 2 - 100, initialHeader.y + initialHeader.height / 2, {
    steps: 5,
  });
  await page.mouse.up();

  const initial: Bounds | null = await dialog.boundingBox();
  if (initial === null) throw new Error('Expected a visible resizable Dialog.');

  await page.mouse.move(initial.x + initial.width - 2, initial.y + initial.height - 2);
  await page.mouse.down();
  await page.mouse.move(initial.x + initial.width + 60, initial.y + initial.height + 40, { steps: 5 });
  await page.mouse.up();

  const resized: Bounds | null = await dialog.boundingBox();
  if (resized === null) throw new Error('Expected the Dialog to remain visible after resizing.');
  expect(Math.abs(resized.x - initial.x)).toBeLessThan(6);
  expect(Math.abs(resized.y - initial.y)).toBeLessThan(6);
  expect(resized.width).toBeGreaterThan(initial.width);
});
