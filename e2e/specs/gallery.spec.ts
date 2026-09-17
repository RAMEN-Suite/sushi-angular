import { expect, Locator, Page, test } from '@playwright/test';

test.beforeEach(async ({ page }: { page: Page }): Promise<void> => {
  await page.setViewportSize({ width: 720, height: 900 });
  await page.goto('/gallery');
});

test('Gallery scrolls overflowing thumbnails and keeps a single roving tab stop', async ({
  page,
}: {
  page: Page;
}): Promise<void> => {
  const gallery: Locator = page.getByRole('region', { name: 'Image gallery' });
  const thumbnails: Locator = gallery.getByRole('group', { name: 'Choose image' });
  const lastThumbnail: Locator = thumbnails.getByRole('button', { name: 'Vegetarian maki with avocado, cucumber, and radish' });

  expect(await thumbnails.evaluate((element: HTMLElement): boolean => element.scrollWidth > element.clientWidth)).toBe(true);
  await lastThumbnail.click();

  await expect(lastThumbnail).toHaveAttribute('aria-current', 'true');
  await expect
    .poll(async (): Promise<number> => thumbnails.evaluate((element: HTMLElement): number => element.scrollLeft))
    .toBeGreaterThan(0);
  await expect(thumbnails.locator('button[tabindex="0"]')).toHaveCount(1);
  await expect(thumbnails.locator('button[tabindex="-1"]')).toHaveCount(7);
});

test('Gallery opens a grouped Lightbox, navigates images, and restores focus', async ({
  page,
}: {
  page: Page;
}): Promise<void> => {
  const gallery: Locator = page.getByRole('region', { name: 'Image gallery' });
  const imageTrigger: Locator = gallery.locator('.sui-gallery__image');
  await imageTrigger.click();

  const lightbox: Locator = page.locator('.pswp[aria-label="Image viewer"]');
  await expect(lightbox).toBeVisible();
  await expect(lightbox.locator('.pswp__counter')).toHaveText('1 / 8');

  await lightbox.locator('.pswp__button--arrow--next').click();
  await expect(lightbox.locator('.pswp__counter')).toHaveText('2 / 8');
  await expect(lightbox.locator('.pswp__caption')).toContainText('Seasonal maki rolls');

  await expect(async (): Promise<void> => {
    await lightbox.getByRole('button', { name: 'Close' }).click();
    await expect(lightbox).toBeHidden({ timeout: 1_000 });
  }).toPass({ timeout: 5_000 });
  await expect(imageTrigger).toBeFocused();
});
