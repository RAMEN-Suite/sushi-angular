import { expect, type Locator, type Page, test } from '@playwright/test';
import { type Bounds, visibleBounds } from '../support/geometry';

interface DialogBounds {
  readonly top: number;
  readonly height: number;
  readonly centerX: number;
  readonly centerY: number;
  readonly viewportCenterX: number;
  readonly viewportCenterY: number;
}

async function bounds(dialog: Locator): Promise<DialogBounds> {
  return dialog.evaluate((element: HTMLElement): DialogBounds => {
    const rect: DOMRect = element.getBoundingClientRect();
    return {
      top: rect.top,
      height: rect.height,
      centerX: rect.left + rect.width / 2,
      centerY: rect.top + rect.height / 2,
      viewportCenterX: window.innerWidth / 2,
      viewportCenterY: window.innerHeight / 2,
    };
  });
}

async function expectCentered(dialog: Locator): Promise<void> {
  await expect(async (): Promise<void> => {
    const current: DialogBounds = await bounds(dialog);
    expect(Math.abs(current.centerX - current.viewportCenterX)).toBeLessThanOrEqual(1);
    expect(Math.abs(current.centerY - current.viewportCenterY)).toBeLessThanOrEqual(1);
  }).toPass();
}

test.use({ viewport: { width: 1280, height: 900 } });

test.beforeEach(async ({ page, isMobile }: { page: Page; isMobile: boolean }): Promise<void> => {
  if (isMobile) await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/dialog');
  await page.getByRole('button', { name: 'Open adaptive dialog' }).click();
});

test('Dialog explicitly repositions after content changes while preserving inputs and focus', async ({
  page,
}: {
  page: Page;
}): Promise<void> => {
  const dialog: Locator = page.getByRole('dialog', { name: 'Adaptive details' });
  const initial: DialogBounds = await bounds(dialog);
  await dialog.getByRole('button', { name: 'Show detailed form' }).press('Enter');

  await expect.poll(async (): Promise<number> => (await bounds(dialog)).height).toBeGreaterThan(initial.height);
  await expect.poll(async (): Promise<number> => (await bounds(dialog)).top).toBeCloseTo(initial.top, 0);
  await dialog.getByRole('textbox', { name: 'Name', exact: true }).fill('Annotation type');
  await dialog.getByRole('button', { name: 'Reposition dialog' }).press('Enter');

  await expectCentered(dialog);
  await expect(dialog.getByRole('textbox', { name: 'Name', exact: true })).toHaveValue('Annotation type');
  await expect(dialog.getByRole('button', { name: 'Reposition dialog' })).toBeFocused();

  await dialog.getByRole('button', { name: 'Show short summary' }).click();
  await expect(dialog.getByRole('textbox', { name: 'Description' })).toHaveCount(0);
  await dialog.getByRole('button', { name: 'Reposition dialog' }).press('Enter');

  await expectCentered(dialog);
});

test('Dialog preserves dragging during content changes and explicitly repositions without reopening @desktop', async ({
  page,
}: {
  page: Page;
}): Promise<void> => {
  const dialog: Locator = page.getByRole('dialog', { name: 'Adaptive details' });
  const heading: Locator = dialog.getByRole('heading', { name: 'Adaptive details' });
  const header: Bounds = await visibleBounds(heading, 'the adaptive Dialog drag heading');
  await page.mouse.move(header.x + header.width / 2, header.y + header.height / 2);
  await page.mouse.down();
  await page.mouse.move(header.x + header.width / 2 + 80, header.y + header.height / 2 + 50, { steps: 8 });
  await page.mouse.up();
  const moved: DialogBounds = await bounds(dialog);

  await dialog.getByRole('button', { name: 'Show detailed form' }).press('Enter');
  await expect.poll(async (): Promise<number> => (await bounds(dialog)).height).toBeGreaterThan(moved.height);
  await expect.poll(async (): Promise<number> => (await bounds(dialog)).top).toBeCloseTo(moved.top, 0);
  await dialog.getByRole('button', { name: 'Reposition dialog' }).press('Enter');

  await expectCentered(dialog);
  await expect(dialog.getByRole('button', { name: 'Reposition dialog' })).toBeFocused();
  await expect(dialog.getByRole('textbox', { name: 'Description' })).toBeVisible();
});

test('Dialog keeps native resizing in place until explicitly repositioned @desktop', async ({
  page,
  browserName,
}: {
  page: Page;
  browserName: 'chromium' | 'firefox' | 'webkit';
}): Promise<void> => {
  test.skip(
    browserName === 'webkit' && process.platform === 'linux',
    'Linux WebKit does not expose a native mouse resize target.',
  );
  const dialog: Locator = page.getByRole('dialog', { name: 'Adaptive details' });
  const initial: Bounds = await visibleBounds(dialog, 'the resizable Dialog');
  await page.mouse.move(initial.x + initial.width - 2, initial.y + initial.height - 2);
  await page.mouse.down();
  await page.mouse.move(initial.x + initial.width + 60, initial.y + initial.height + 40, { steps: 5 });
  await page.mouse.up();

  await expect(async (): Promise<void> => {
    const resized: Bounds = await visibleBounds(dialog, 'the resized Dialog');
    expect(resized.width).toBeGreaterThan(initial.width);
    expect(Math.abs(resized.x - initial.x)).toBeLessThan(6);
    expect(Math.abs(resized.y - initial.y)).toBeLessThan(6);
  }).toPass();

  const resized: Bounds = await visibleBounds(dialog, 'the resized Dialog');
  await dialog.getByRole('button', { name: 'Reposition dialog' }).press('Enter');

  await expectCentered(dialog);
  await expect(async (): Promise<void> => {
    const repositioned: Bounds = await visibleBounds(dialog, 'the repositioned Dialog');
    expect(repositioned.width).toBeCloseTo(resized.width, 0);
    expect(repositioned.height).toBeCloseTo(resized.height, 0);
  }).toPass();
});
