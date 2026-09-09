import { expect, Locator, Page, test } from '@playwright/test';

interface BoxGeometry {
  readonly height: number;
  readonly width: number;
  readonly x: number;
  readonly y: number;
}

test('Drawer behaves as a modal and restores focus after Escape', async ({ page }: { page: Page }): Promise<void> => {
  await page.goto('/drawer');
  const trigger: Locator = page.getByRole('button', { name: /Cart/ });
  await trigger.click();

  const drawer: Locator = page.getByRole('dialog', { name: 'Your cart' });
  await expect(drawer).toBeVisible();
  await expect(trigger).toHaveAttribute('aria-expanded', 'true');
  await expect(drawer).toHaveAttribute('aria-modal', 'true');
  await expect(drawer).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
  await expect(drawer).toHaveCSS('border-width', '0px');
  await expect(drawer).toHaveCSS('padding', '0px');
  await expect
    .poll(async (): Promise<boolean> =>
      drawer.evaluate((element: HTMLElement): boolean => element.contains(document.activeElement)),
    )
    .toBe(true);

  await page.keyboard.press('Escape');
  await expect(drawer).toBeHidden();
  await expect(trigger).toBeFocused();

  await trigger.click();
  await expect(drawer).toBeVisible();
  await drawer.getByRole('button', { name: 'Close cart' }).click();
  await expect(drawer).toBeHidden();
  await expect(trigger).toBeFocused();
});

test('end placement keeps the panel at the viewport edge and backdrop dismisses it', async ({
  page,
}: {
  page: Page;
}): Promise<void> => {
  await page.goto('/drawer');
  await page.getByRole('button', { name: /Cart/ }).click();
  const panel: Locator = page.getByRole('dialog', { name: 'Your cart' });
  await expect(panel).toBeVisible();
  await expect
    .poll(async (): Promise<number | null> => {
      const box: BoxGeometry | null = await panel.boundingBox();
      return box === null ? null : Math.abs(box.x + box.width - (await page.evaluate((): number => innerWidth)));
    })
    .toBeLessThanOrEqual(1);

  await page.locator('sui-drawer.drawer-end .drawer-overlay').click({ position: { x: 20, y: 20 } });
  await expect(panel).toBeHidden();
});

test('responsive Drawers use one Sidebar as an overlay and persistent desktop layout', async ({
  page,
}: {
  page: Page;
}): Promise<void> => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('/sidebar');
  const responsiveDrawer: Locator = page.locator('pg-sidebar-workspace-example sui-drawer.lg\\:drawer-open');
  await expect(responsiveDrawer.getByRole('complementary', { name: 'SUSHI workspace' })).toBeVisible();
  await expect(responsiveDrawer.locator('[role="dialog"]')).toHaveCount(0);

  await page.setViewportSize({ width: 360, height: 640 });
  await expect(responsiveDrawer.getByRole('complementary', { name: 'SUSHI workspace' })).toBeHidden();
  const mobileTrigger: Locator = page.getByRole('button', { name: 'Open workspace navigation' });
  await mobileTrigger.click();

  const modalPanel: Locator = responsiveDrawer.getByRole('dialog', { name: 'Workspace navigation' });
  await expect(modalPanel).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(modalPanel).toBeHidden();
  await expect(mobileTrigger).toBeFocused();
});

test('small Drawers fill narrow viewports without horizontal overflow', async ({ page }: { page: Page }): Promise<void> => {
  await page.setViewportSize({ width: 360, height: 640 });
  await page.goto('/drawer');
  await page.getByRole('button', { name: /Cart/ }).click();
  const panel: Locator = page.getByRole('dialog', { name: 'Your cart' });
  await expect
    .poll(async (): Promise<{ readonly width: number; readonly x: number } | null> => {
      const box: BoxGeometry | null = await panel.boundingBox();
      return box === null ? null : { width: box.width, x: box.x };
    })
    .toEqual({ width: 360, x: 0 });
  expect(await page.evaluate((): boolean => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
