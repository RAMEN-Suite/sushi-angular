import { expect, Locator, Page, test } from '@playwright/test';

test.use({ viewport: { width: 390, height: 844 } });

test('collapsible Navbar exposes mobile navigation and restores toggle focus on Escape', async ({
  page,
}: {
  page: Page;
}): Promise<void> => {
  await page.goto('/navbar');
  const example: Locator = page.getByText('Link navigation', { exact: true }).locator('..');
  const toggle: Locator = example.getByRole('button', { name: 'Toggle navigation' });

  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');

  await example.getByRole('button', { name: 'Products' }).press('Escape');
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(toggle).toBeFocused();
});

test('Navbar switches at its configured breakpoint without hiding persistent actions', async ({
  page,
}: {
  page: Page;
}): Promise<void> => {
  await page.setViewportSize({ width: 1000, height: 844 });
  await page.goto('/navbar');
  const navbar: Locator = page.getByRole('navigation', { name: 'Operations console' });
  const toggle: Locator = navbar.getByRole('button', { name: 'Toggle navigation' });
  const action: Locator = navbar.getByRole('button', { name: 'New task' });

  await expect(toggle).toBeHidden();
  await expect(action).toBeVisible();

  await page.setViewportSize({ width: 600, height: 844 });
  await expect(toggle).toBeVisible();
  await expect(action).toBeVisible();
});

test('responsive Table remains inside a narrow viewport and exposes horizontal scrolling', async ({
  page,
}: {
  page: Page;
}): Promise<void> => {
  await page.goto('/table');
  const table: Locator = page.getByRole('table', { name: 'Release queue' });
  const viewport: Locator = table.locator('..');

  await expect(table).toBeVisible();
  await expect
    .poll(async (): Promise<boolean> =>
      viewport.evaluate((element: HTMLElement): boolean => {
        const bounds: DOMRect = element.getBoundingClientRect();
        const isContained: boolean = bounds.left >= 0 && bounds.right <= document.documentElement.clientWidth;
        const canScroll: boolean = element.scrollWidth > element.clientWidth;
        return isContained && canScroll;
      }),
    )
    .toBe(true);
});
