import { expect, Locator, Page, test } from '@playwright/test';

async function getThumbnailButtons(gallery: Locator): Promise<Locator> {
  const buttons: Locator = gallery.getByRole('group', { name: 'Choose image' }).getByRole('button');
  await expect.poll(async (): Promise<number> => buttons.count()).toBeGreaterThan(1);
  return buttons;
}

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
  const thumbnailButtons: Locator = await getThumbnailButtons(gallery);
  const thumbnailCount: number = await thumbnailButtons.count();
  const lastThumbnail: Locator = thumbnailButtons.last();

  await expect
    .poll(async (): Promise<boolean> =>
      thumbnails.evaluate((element: HTMLElement): boolean => element.scrollWidth > element.clientWidth),
    )
    .toBe(true);
  await lastThumbnail.click();

  await expect(lastThumbnail).toHaveAttribute('aria-current', 'true');
  await expect
    .poll(async (): Promise<number> => thumbnails.evaluate((element: HTMLElement): number => element.scrollLeft))
    .toBeGreaterThan(0);
  await expect(thumbnails.locator('button[tabindex="0"]')).toHaveCount(1);
  await expect(thumbnails.locator('button[tabindex="-1"]')).toHaveCount(thumbnailCount - 1);
});

test('Gallery opens a grouped Lightbox, navigates images, and restores focus', async ({
  page,
}: {
  page: Page;
}): Promise<void> => {
  const gallery: Locator = page.getByRole('region', { name: 'Image gallery' });
  const thumbnailCount: number = await (await getThumbnailButtons(gallery)).count();
  const imageTrigger: Locator = gallery.locator('.sui-gallery__image');
  await imageTrigger.click();

  const lightbox: Locator = page.locator('.pswp[aria-label="Image viewer"]');
  await expect(lightbox).toBeVisible();
  await expect(lightbox.locator('.pswp__counter')).toHaveText(`1 / ${thumbnailCount}`);

  await lightbox.locator('.pswp__button--arrow--next').click();
  await expect(lightbox.locator('.pswp__counter')).toHaveText(`2 / ${thumbnailCount}`);
  await expect
    .poll(
      async (): Promise<boolean> =>
        (await gallery.locator('figcaption').innerText()) === (await lightbox.locator('.pswp__caption').innerText()),
    )
    .toBe(true);

  await expect(async (): Promise<void> => {
    await lightbox.getByRole('button', { name: 'Close' }).click();
    await expect(lightbox).toBeHidden({ timeout: 1_000 });
  }).toPass({ timeout: 5_000 });
  await expect(imageTrigger).toBeFocused();
});
