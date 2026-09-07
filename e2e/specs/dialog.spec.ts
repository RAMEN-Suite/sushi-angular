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
  const trigger: Locator = page.getByRole('button', { name: 'Archive project' });
  await trigger.click();
  const dialog: Locator = page.getByRole('dialog', { name: 'Archive Atlas?' });

  await expect(dialog).toBeVisible();
  await expect(trigger).toHaveAttribute('aria-expanded', 'true');
  await expect
    .poll(async (): Promise<boolean> => dialog.evaluate((node: HTMLElement) => node.contains(document.activeElement)))
    .toBe(true);

  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
});

test('can require an explicit action', async ({ page }: { page: Page }): Promise<void> => {
  await page.getByRole('button', { name: 'Open required task' }).click();
  const dialog: Locator = page.getByRole('dialog', { name: 'Finish importing' });

  await page.keyboard.press('Escape');
  await expect(dialog).toBeVisible();
  await dialog.getByRole('button', { name: 'Finish' }).click();
  await expect(dialog).toBeHidden();
});

test('supports opt-in position, resize, dragging, and maximization', async ({ page }: { page: Page }): Promise<void> => {
  await page.getByRole('button', { name: 'Open movable dialog' }).click();
  const dialog: Locator = page.getByRole('dialog', { name: 'Workspace settings' });
  const handle: Locator = dialog.locator('[suiDialogDragHandle]');
  const initialBox: Bounds | null = await dialog.boundingBox();
  const handleBox: Bounds | null = await handle.boundingBox();
  if (initialBox === null) throw new Error('Expected an open Dialog.');
  if (handleBox === null) throw new Error('Expected a visible Dialog drag handle.');

  await expect(dialog).toHaveAttribute('data-position', 'top');
  await expect(dialog).toHaveCSS('resize', 'both');
  await page.mouse.move(handleBox.x + handleBox.width / 2, handleBox.y + handleBox.height / 2);
  await page.mouse.down();
  await page.mouse.move(handleBox.x + handleBox.width / 2 + 80, handleBox.y + handleBox.height / 2 + 40, { steps: 5 });
  await page.mouse.up();
  const movedBox: Bounds | null = await dialog.boundingBox();
  expect(movedBox?.x).not.toBeCloseTo(initialBox.x, 0);

  await dialog.getByRole('button', { name: 'Toggle maximized dialog' }).click();
  await expect(dialog).toHaveClass(/sui-dialog--maximized/);
  await expect(dialog).toHaveCSS('resize', 'none');
});
