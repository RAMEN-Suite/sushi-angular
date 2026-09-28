import { expect, Locator, Page, test } from '@playwright/test';

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
    expect(Math.round(bounds.left), details).toBeGreaterThanOrEqual(0);
    expect(Math.round(bounds.top), details).toBeGreaterThanOrEqual(0);
    expect(Math.round(bounds.right), details).toBeLessThanOrEqual(bounds.viewportWidth);
    expect(Math.round(bounds.bottom), details).toBeLessThanOrEqual(bounds.viewportHeight);
    expect(bounds.documentWidth, details).toBeLessThanOrEqual(bounds.viewportWidth);
    if (centered) {
      expect(bounds.left + bounds.width / 2, details).toBeCloseTo(bounds.viewportWidth / 2, 0);
      expect(bounds.top + bounds.height / 2, details).toBeCloseTo(bounds.viewportHeight / 2, 0);
    } else {
      // The example explicitly requests these offsets; this is not a decoration measurement.
      expect(bounds.top, details).toBeCloseTo(80, 0);
      expect(bounds.viewportWidth - bounds.right, details).toBeCloseTo(1.5 * bounds.rem, 0);
    }
  }).toPass({ timeout: 5_000 });
}

for (const width of [360, 390]) {
  test(`custom and named Dialog positions stay contained at ${width}px`, async ({
    page,
    isMobile,
  }: {
    page: Page;
    isMobile: boolean;
  }): Promise<void> => {
    await page.setViewportSize({ width, height: 740 });
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
}
