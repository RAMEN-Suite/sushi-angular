import { expect, type Locator, type Page, test } from '@playwright/test';

import { type Bounds, visibleBounds } from '../support/geometry';

test('Chip sizes produce different surface dimensions and accept a public radius override', async ({
  page,
}: {
  page: Page;
}): Promise<void> => {
  await page.goto('/chip');
  const small: Locator = page.getByText('Extra small', { exact: true }).locator('..');
  const large: Locator = page.getByText('Large', { exact: true }).locator('..');

  await expect(small).toBeVisible();
  await expect(async (): Promise<void> => {
    const smallBounds: Bounds = await visibleBounds(small, 'the extra-small Chip');
    const largeBounds: Bounds = await visibleBounds(large, 'the large Chip');
    expect(smallBounds.height).toBeLessThan(largeBounds.height);
  }).toPass({ timeout: 5_000 });

  await small.evaluate((element: HTMLElement): void => element.style.setProperty('--sui-chip-radius', '4px'));

  await expect(small).toHaveCSS('border-radius', '4px');
});
