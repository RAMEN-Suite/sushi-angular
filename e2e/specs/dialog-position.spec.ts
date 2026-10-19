import { expect, type Locator, type Page, test } from '@playwright/test';

interface Geometry {
  readonly left: number;
  readonly top: number;
  readonly right: number;
  readonly bottom: number;
  readonly width: number;
  readonly height: number;
  readonly viewportWidth: number;
  readonly viewportHeight: number;
  readonly documentWidth: number;
  readonly rem: number;
}

async function geometry(dialog: Locator): Promise<Geometry> {
  return dialog.evaluate((element: HTMLElement): Geometry => {
    const bounds: DOMRect = element.getBoundingClientRect();
    const root: HTMLElement = document.documentElement;
    return {
      left: bounds.left,
      top: bounds.top,
      right: bounds.right,
      bottom: bounds.bottom,
      width: bounds.width,
      height: bounds.height,
      viewportWidth: root.clientWidth,
      viewportHeight: root.clientHeight,
      documentWidth: root.scrollWidth,
      rem: Number.parseFloat(getComputedStyle(root).fontSize),
    };
  });
}

async function activate(control: Locator, isMobile: boolean): Promise<void> {
  if (isMobile) await control.tap();
  else await control.click();
}

async function expectPosition(dialog: Locator, centered: boolean): Promise<void> {
  await expect(async (): Promise<void> => {
    const bounds: Geometry = await geometry(dialog);
    const details: string = `Dialog geometry: ${JSON.stringify(bounds)}`;
    expect(bounds.left, details).toBeGreaterThanOrEqual(-1);
    expect(bounds.top, details).toBeGreaterThanOrEqual(-1);
    expect(bounds.right, details).toBeLessThanOrEqual(bounds.viewportWidth + 1);
    expect(bounds.bottom, details).toBeLessThanOrEqual(bounds.viewportHeight + 1);
    expect(bounds.documentWidth, details).toBeLessThanOrEqual(bounds.viewportWidth);
    if (centered) {
      expect(Math.abs(bounds.left + bounds.width / 2 - bounds.viewportWidth / 2), details).toBeLessThanOrEqual(1);
      expect(Math.abs(bounds.top + bounds.height / 2 - bounds.viewportHeight / 2), details).toBeLessThanOrEqual(1);
    } else {
      expect(Math.abs(bounds.top - 80), details).toBeLessThanOrEqual(1);
      expect(Math.abs(bounds.viewportWidth - bounds.right - 1.5 * bounds.rem), details).toBeLessThanOrEqual(1);
    }
  }).toPass({ timeout: 5_000 });
}

for (const example of [
  { trigger: 'View today’s menu', name: 'Today’s menu', centered: true },
  { trigger: 'Open prep board', name: 'Prep board', centered: false },
  { trigger: 'Open positioned dialog', name: 'Custom position', centered: false },
]) {
  test(`${example.name} remains visible when an open Dialog crosses viewport sizes`, async ({
    page,
    isMobile,
  }: {
    page: Page;
    isMobile: boolean;
  }): Promise<void> => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('/dialog');
    await activate(page.getByRole('button', { name: example.trigger }), isMobile);
    const dialog: Locator = page.getByRole('dialog', { name: example.name });

    await expect(dialog).toBeVisible();

    for (const viewport of [
      { width: 390, height: 844 },
      { width: 1280, height: 600 },
    ]) {
      await page.setViewportSize(viewport);
      await expect(async (): Promise<void> => {
        const bounds: Geometry = await geometry(dialog);
        expect(bounds.left).toBeGreaterThanOrEqual(-1);
        expect(bounds.top).toBeGreaterThanOrEqual(-1);
        expect(bounds.right).toBeLessThanOrEqual(bounds.viewportWidth + 1);
        expect(bounds.bottom).toBeLessThanOrEqual(bounds.viewportHeight + 1);
        if (example.centered) {
          expect(Math.abs(bounds.left + bounds.width / 2 - bounds.viewportWidth / 2)).toBeLessThanOrEqual(1);
          expect(Math.abs(bounds.top + bounds.height / 2 - bounds.viewportHeight / 2)).toBeLessThanOrEqual(1);
        }
      }).toPass({ timeout: 5_000 });
      await expect(dialog.getByRole('button', { name: 'Close', exact: true })).toBeInViewport();
    }
  });
}

test('custom and named Dialog positions stay contained at 360px', async ({
  page,
  isMobile,
}: {
  page: Page;
  isMobile: boolean;
}): Promise<void> => {
  await page.setViewportSize({ width: 360, height: 740 });
  await page.goto('/dialog');
  const trigger: Locator = page.getByRole('button', { name: 'Open positioned dialog' });
  const dialog: Locator = page.getByRole('dialog', { name: 'Custom position' });
  await activate(trigger, isMobile);

  await expect(dialog).toBeVisible();

  await expectPosition(dialog, false);

  await activate(dialog.getByRole('button', { name: 'Center dialog' }), isMobile);
  await expectPosition(dialog, true);
  await activate(dialog.getByRole('button', { name: 'Restore offsets' }), isMobile);
  await expectPosition(dialog, false);

  await activate(dialog.getByRole('button', { name: 'Close', exact: true }), isMobile);

  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();

  await activate(trigger, isMobile);
  await expectPosition(dialog, false);
});
