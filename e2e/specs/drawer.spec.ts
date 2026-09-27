import { expect, Locator, Page, test } from '@playwright/test';

interface BoxGeometry {
  readonly height: number;
  readonly width: number;
  readonly x: number;
  readonly y: number;
}

interface DrawerGeometry {
  readonly left: number;
  readonly right: number;
  readonly width: number;
  readonly viewportWidth: number;
  readonly documentWidth: number;
}

test('modal Drawer closes with Escape and restores focus to its trigger', async ({ page }: { page: Page }): Promise<void> => {
  await page.goto('/drawer');
  const trigger: Locator = page.getByRole('button', { name: /Cart/ });
  await trigger.click();

  const drawer: Locator = page.getByRole('dialog', { name: 'Your cart' });
  await expect(drawer).toBeVisible();
  await expect(trigger).toHaveAttribute('aria-expanded', 'true');
  await expect(drawer).toHaveAttribute('aria-modal', 'true');
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

test('end placement anchors to the viewport edge and backdrop click dismisses it', async ({
  page,
}: {
  page: Page;
}): Promise<void> => {
  await page.goto('/drawer');
  await page.getByRole('button', { name: /Cart/ }).click();
  const panel: Locator = page.getByRole('dialog', { name: 'Your cart' });
  await expect(panel).toBeVisible();
  await expect
    .poll(async (): Promise<boolean> => {
      const box: BoxGeometry | null = await panel.boundingBox();
      if (box === null) return false;

      const viewportWidth: number = await page.evaluate((): number => innerWidth);
      const rightGap: number = Math.abs(box.x + box.width - viewportWidth);
      return rightGap < box.width * 0.02;
    })
    .toBe(true);

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

test('Drawers stay inside narrow viewports without horizontal overflow', async ({ page }: { page: Page }): Promise<void> => {
  await page.setViewportSize({ width: 360, height: 640 });
  await page.goto('/drawer');
  await page.getByRole('button', { name: /Cart/ }).click();
  const panel: Locator = page.getByRole('dialog', { name: 'Your cart' });
  await expect(panel).toBeVisible();
  await expect(async (): Promise<void> => {
    const geometry: DrawerGeometry = await panel.evaluate((element: HTMLElement): DrawerGeometry => {
      const bounds: DOMRect = element.getBoundingClientRect();
      return {
        left: bounds.left,
        right: bounds.right,
        width: bounds.width,
        viewportWidth: document.documentElement.clientWidth,
        documentWidth: document.documentElement.scrollWidth,
      };
    });
    const details: string = `Drawer geometry: ${JSON.stringify(geometry)}`;
    // Ignore subpixel rounding, not clipping or reserved scrollbar space.
    expect(Math.round(geometry.left), details).toBeGreaterThanOrEqual(0);
    expect(Math.round(geometry.right), details).toBeLessThanOrEqual(geometry.viewportWidth);
    expect(geometry.documentWidth, details).toBeLessThanOrEqual(geometry.viewportWidth);
  }).toPass({ timeout: 5_000 });
});
