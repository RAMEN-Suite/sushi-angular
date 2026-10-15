import { expect, type Locator, type Page, test } from '@playwright/test';

import { type Bounds, visibleBounds } from '../support/geometry';

test('Tooltip is exposed as the focused control description and honors top placement', async ({
  page,
}: {
  page: Page;
}): Promise<void> => {
  await page.goto('/tooltip');
  const trigger: Locator = page.getByRole('button', { name: 'Top' });
  await trigger.focus();

  const tooltip: Locator = page.getByRole('tooltip', { name: 'Shown above' });

  await expect(tooltip).toBeVisible();

  const tooltipId: string | null = await tooltip.getAttribute('id');
  if (tooltipId === null) throw new Error('Expected the Tooltip to expose an ID.');

  await expect(trigger).toHaveAttribute('aria-describedby', tooltipId);

  await expect(async (): Promise<void> => {
    const triggerBounds: Bounds = await visibleBounds(trigger, 'the Tooltip trigger');
    const tooltipBounds: Bounds = await visibleBounds(tooltip, 'the Tooltip');

    expect(tooltipBounds.y + tooltipBounds.height).toBeLessThanOrEqual(triggerBounds.y);
  }).toPass({ timeout: 5_000 });

  await page.keyboard.press('Escape');

  await expect(tooltip).toBeHidden();
  await expect(trigger).not.toHaveAttribute('aria-describedby', tooltipId);
});
