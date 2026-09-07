import { expect, Locator, Page, test } from '@playwright/test';

test.use({ viewport: { width: 390, height: 844 } });

interface NavbarAlignment {
  readonly actionCenter: number;
  readonly bottom: number;
  readonly brandCenter: number;
  readonly end: number;
  readonly searchEnd: number;
  readonly searchStart: number;
  readonly start: number;
  readonly top: number;
}

test('navbar exposes and closes its mobile navigation', async ({ page }: { page: Page }): Promise<void> => {
  await page.goto('/navbar');
  const section: Locator = page.getByText('Link navigation', { exact: true }).locator('..');
  const toggle: Locator = section.getByRole('button', { name: 'Toggle navigation' });
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await section.getByRole('button', { name: 'Products' }).press('Escape');
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(toggle).toBeFocused();
});

test('wrapped navbar content keeps equal edge alignment', async ({ page }: { page: Page }): Promise<void> => {
  await page.goto('/navbar');
  const navbar: Locator = page.getByRole('navigation', { name: 'Arcwell workspace' });

  const alignment: NavbarAlignment = await navbar.evaluate((element: HTMLElement): NavbarAlignment => {
    const boundsOf: (selector: string) => DOMRect = (selector: string): DOMRect => {
      const target: HTMLElement | null = element.querySelector<HTMLElement>(selector);
      if (target === null) throw new Error(`Expected ${selector} in the responsive Navbar example.`);
      return target.getBoundingClientRect();
    };

    const navbarBounds: DOMRect = element.getBoundingClientRect();
    const brandBounds: DOMRect = boundsOf('.sui-navbar__brand');
    const actionBounds: DOMRect = boundsOf('.navbar-end');
    const searchBounds: DOMRect = boundsOf('.input');

    return {
      actionCenter: actionBounds.y + actionBounds.height / 2,
      bottom: navbarBounds.bottom - searchBounds.bottom,
      brandCenter: brandBounds.y + brandBounds.height / 2,
      end: navbarBounds.right - actionBounds.right,
      searchEnd: navbarBounds.right - searchBounds.right,
      searchStart: searchBounds.left - navbarBounds.left,
      start: brandBounds.left - navbarBounds.left,
      top: brandBounds.top - navbarBounds.top,
    };
  });

  expect(alignment.brandCenter).toBeCloseTo(alignment.actionCenter, 0);
  expect(alignment.top).toBeCloseTo(alignment.bottom, 0);
  expect(alignment.start).toBeCloseTo(alignment.end, 0);
  expect(alignment.searchStart).toBeCloseTo(alignment.start, 0);
  expect(alignment.searchEnd).toBeCloseTo(alignment.end, 0);
});

test('responsive table remains contained by a narrow viewport', async ({ page }: { page: Page }): Promise<void> => {
  await page.goto('/table');
  const table: Locator = page.getByRole('table', { name: 'Release queue' });
  const scrollContainer: Locator = table.locator('..');
  await expect(table).toBeVisible();

  const fitsViewport: boolean = await scrollContainer.evaluate((element: HTMLElement): boolean => {
    const bounds: DOMRect = element.getBoundingClientRect();
    return bounds.left >= 0 && bounds.right <= document.documentElement.clientWidth;
  });
  expect(fitsViewport).toBe(true);
});
