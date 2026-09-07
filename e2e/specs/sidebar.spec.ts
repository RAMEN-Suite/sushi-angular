import { expect, Locator, Page, test } from '@playwright/test';

interface ItemGeometry {
  readonly justifyContent: string;
  readonly width: number;
  readonly x: number;
}

interface SidebarFrame {
  readonly bottom: string;
  readonly left: string;
  readonly right: string;
  readonly top: string;
}

test('vertical sidebar destinations fill the menu and visibly retain selection', async ({
  page,
}: {
  page: Page;
}): Promise<void> => {
  await page.goto('/sidebar');
  const sidebar: Locator = page.locator('sui-sidebar[aria-label="Small sidebar"]');
  const frame: SidebarFrame = await sidebar.evaluate((element: HTMLElement): SidebarFrame => {
    const styles: CSSStyleDeclaration = getComputedStyle(element);
    return {
      bottom: styles.borderBottomWidth,
      left: styles.borderLeftWidth,
      right: styles.borderRightWidth,
      top: styles.borderTopWidth,
    };
  });
  const items: Locator = sidebar.getByRole('button');
  const geometry: readonly ItemGeometry[] = await items.evaluateAll((elements: readonly Element[]): readonly ItemGeometry[] =>
    elements.map((element: Element): ItemGeometry => {
      const bounds: DOMRect = element.getBoundingClientRect();
      return {
        justifyContent: getComputedStyle(element).justifyContent,
        width: bounds.width,
        x: bounds.x,
      };
    }),
  );

  expect(frame).toEqual({ bottom: '0px', left: '0px', right: '0px', top: '0px' });
  expect(geometry).toHaveLength(3);
  expect(new Set(geometry.map((item: ItemGeometry): number => item.x)).size).toBe(1);
  expect(new Set(geometry.map((item: ItemGeometry): number => item.width)).size).toBe(1);
  expect(geometry.every((item: ItemGeometry): boolean => item.justifyContent === 'flex-start')).toBe(true);

  const projects: Locator = sidebar.getByRole('button', { name: 'Projects' });
  await projects.click();
  await expect(projects).toHaveAttribute('aria-current', 'page');
  await expect(sidebar.getByRole('button', { name: 'Overview' })).not.toHaveAttribute('aria-current', 'page');
});

test('consumer width utilities override the Sidebar size default', async ({ page }: { page: Page }): Promise<void> => {
  await page.goto('/sidebar');
  const sidebar: Locator = page.locator('sui-sidebar[aria-label="Northstar workspace"]');

  await expect(sidebar).toHaveCSS('width', '288px');
});
