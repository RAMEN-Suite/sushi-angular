import { expect, Locator, Page, test } from '@playwright/test';

interface Bounds {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
}

async function scrollContainer(trigger: Locator, distance: number): Promise<void> {
  await trigger.evaluate((element: HTMLElement, amount: number): void => {
    let parent: HTMLElement | null = element.parentElement;
    while (parent) {
      const overflow: string = getComputedStyle(parent).overflowY;
      if (/(auto|scroll)/.test(overflow) && parent.scrollHeight > parent.clientHeight) {
        parent.scrollBy(0, amount);
        return;
      }
      parent = parent.parentElement;
    }
    window.scrollBy(0, amount);
  }, distance);
}

async function expectAnchoredAbove(popup: Locator, trigger: Locator): Promise<void> {
  await expect
    .poll(
      async (): Promise<boolean> => {
        const control: Bounds | null = await trigger.boundingBox();
        const panel: Bounds | null = await popup.boundingBox();
        if (!control || !panel) return false;

        const gap: number = control.y - panel.y - panel.height;
        return panel.y >= 0 && gap >= 0 && gap < control.height / 2;
      },
      { message: 'The popup should stay above and beside its trigger without clipping.' },
    )
    .toBe(true);
}

test('large Popover stays within a short viewport when opened at the bottom', async ({ page }: { page: Page }): Promise<void> => {
  await page.setViewportSize({ width: 390, height: 360 });
  await page.goto('/popover');
  const trigger: Locator = page.getByRole('button', { name: 'Assign chef', exact: true });
  await trigger.evaluate((element: HTMLElement): void => element.scrollIntoView({ block: 'end' }));
  await trigger.click();
  const popup: Locator = page.getByRole('dialog', { name: 'Select a chef' });
  await expect(popup).toBeVisible();
  await expect
    .poll(async (): Promise<boolean> => {
      const panel: Bounds | null = await popup.boundingBox();
      return !!panel && panel.y >= 0 && panel.y + panel.height <= 360;
    })
    .toBe(true);
});

test('Popover stays above its separate target near the bottom edge', async ({ page }: { page: Page }): Promise<void> => {
  await page.setViewportSize({ width: 390, height: 740 });
  await page.goto('/popover');
  const trigger: Locator = page.getByRole('button', { name: 'Show details', exact: true });
  const target: Locator = page.getByRole('button', { name: 'Salmon nigiri €12', exact: true });
  await target.evaluate((element: HTMLElement): void => element.scrollIntoView({ block: 'end' }));
  await trigger.click();
  const popup: Locator = page.getByRole('dialog', { name: 'Product details' });
  await expect(popup).toBeVisible();
  await expectAnchoredAbove(popup, target);
  await scrollContainer(target, 80);
  await expectAnchoredAbove(popup, target);
});

for (const [route, role, name, popupRole, popupName] of [
  ['select', 'combobox', 'Favorite color', 'listbox', ''],
  ['multi-select', 'combobox', 'Message labels', 'listbox', ''],
  ['popover', 'button', 'Share menu', 'dialog', 'Share this menu'],
  ['popover', 'button', 'Assign chef', 'dialog', 'Select a chef'],
] as const) {
  test(`${name} popup stays anchored above its trigger while scrolling a narrow page`, async ({
    page,
    isMobile,
  }: {
    page: Page;
    isMobile: boolean;
  }): Promise<void> => {
    await page.setViewportSize({ width: 390, height: 600 });
    await page.goto(`/${route}`);
    const trigger: Locator = page.getByRole(role, { name, exact: true });
    await trigger.evaluate((element: HTMLElement): void => element.scrollIntoView({ block: 'end' }));
    if (isMobile) await trigger.tap();
    else await trigger.click();

    const popup: Locator = popupName ? page.getByRole(popupRole, { name: popupName }) : page.getByRole(popupRole).first();
    await expect(popup).toBeVisible();
    await expectAnchoredAbove(popup, trigger);

    const initial: Bounds | null = await trigger.boundingBox();
    if (!initial) throw new Error('Expected a visible overlay trigger.');
    await scrollContainer(trigger, initial.height * 2);
    await expect
      .poll(async (): Promise<number> => (await trigger.boundingBox())?.y ?? initial.y)
      .toBeLessThan(initial.y - initial.height);
    await expectAnchoredAbove(popup, trigger);
  });
}
