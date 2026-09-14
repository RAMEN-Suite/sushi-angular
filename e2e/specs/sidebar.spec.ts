import { expect, Locator, Page, test } from '@playwright/test';

test.use({ viewport: { width: 1280, height: 800 } });

test('collapsed Sidebar becomes an icon rail and exposes child destinations in a flyout', async ({
  page,
}: {
  page: Page;
}): Promise<void> => {
  await page.goto('/sidebar');
  const sidebar: Locator = page.getByRole('complementary', { name: 'SUSHI workspace' });
  const expandedWidth: number = await sidebar.evaluate((element: HTMLElement): number => element.getBoundingClientRect().width);

  await page.getByRole('button', { name: 'Collapse workspace navigation' }).click();
  await expect(sidebar).toHaveAttribute('data-collapsed', '');
  await expect
    .poll(async (): Promise<number> => sidebar.evaluate((element: HTMLElement): number => element.getBoundingClientRect().width))
    .toBeLessThan(expandedWidth);

  await sidebar.getByRole('button', { name: 'Projects' }).click();
  const flyout: Locator = page.getByRole('menu', { name: 'Projects' });
  await expect(flyout).toBeVisible();

  await flyout.getByRole('menuitem', { name: 'All projects' }).click();
  await expect(page.getByRole('heading', { name: 'All projects' })).toBeVisible();
  await expect(flyout).toBeHidden();
});
