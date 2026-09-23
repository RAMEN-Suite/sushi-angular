import { expect, Locator, Page, test } from '@playwright/test';

interface Bounds {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
}

async function boundsOf(locator: Locator): Promise<Bounds> {
  const bounds: Bounds | null = await locator.boundingBox();
  if (bounds === null) throw new Error('Expected the menu to have visible bounds.');
  return bounds;
}

test.describe('Menu browser behavior', (): void => {
  test.beforeEach(async ({ page }: { page: Page }): Promise<void> => {
    await page.goto('/menu');
  });

  test('opens from its trigger and restores focus with Escape', async ({ page }: { page: Page }): Promise<void> => {
    const trigger: Locator = page.getByRole('button', { name: 'More message actions' });
    await trigger.click();

    const menu: Locator = page.getByRole('menu', { name: 'Message actions' });
    const firstAction: Locator = menu.getByRole('menuitem').first();
    await expect(menu).toBeVisible();
    await expect(firstAction).toBeFocused();
    await firstAction.press('Escape');
    await expect(menu).toBeHidden();
    await expect(trigger).toBeFocused();
  });

  test('opens a context menu from the keyboard at the document surface', async ({ page }: { page: Page }): Promise<void> => {
    const surface: Locator = page.locator('pg-menu-context-example sui-card[tabindex="0"]');
    await surface.press('Shift+F10');

    const menu: Locator = page.getByRole('menu', { name: 'Draft actions' });
    await expect(menu).toBeVisible();
    await expect(menu.getByRole('menuitem', { name: 'Rename draft' })).toBeFocused();
    const before: Bounds = await boundsOf(menu);
    const scrollContainer: Locator = page.locator('[suiDrawerContent]').first();
    const scrollBefore: number = await scrollContainer.evaluate((element: HTMLElement): number => element.scrollTop);
    await scrollContainer.evaluate((element: HTMLElement): void => {
      element.scrollTop -= 240;
      element.dispatchEvent(new Event('scroll'));
    });
    await expect
      .poll(async (): Promise<number> => scrollContainer.evaluate((element: HTMLElement): number => element.scrollTop))
      .toBeLessThan(scrollBefore);
    const scrollAfter: number = await scrollContainer.evaluate((element: HTMLElement): number => element.scrollTop);
    const after: Bounds = await boundsOf(menu);
    await expect(menu).toBeVisible();
    expect(scrollAfter).toBeLessThan(scrollBefore);

    const scrollDistance: number = scrollBefore - scrollAfter;
    expect(Math.abs(after.x - before.x)).toBeLessThan(scrollDistance * 0.05);
    expect(Math.abs(after.y - before.y)).toBeLessThan(scrollDistance * 0.05);
  });
});
