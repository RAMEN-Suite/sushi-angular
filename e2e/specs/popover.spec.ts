import { expect, Locator, Page, test } from '@playwright/test';

import { Bounds, visibleBounds } from '../support/geometry';

test('Popover opens outside its trigger and restores focus on Escape', async ({ page }: { page: Page }): Promise<void> => {
  await page.goto('/popover');
  const trigger: Locator = page.getByRole('button', { name: 'Share menu' });
  await trigger.click();

  const popover: Locator = page.getByRole('dialog', { name: 'Share this menu' });

  await expect(popover).toBeFocused();
  await expect(trigger).toHaveAttribute('aria-expanded', 'true');

  await expect(async (): Promise<void> => {
    const triggerBounds: Bounds = await visibleBounds(trigger, 'the Popover trigger');
    const popoverBounds: Bounds = await visibleBounds(popover, 'the Popover');
    const placement: string | null = await popover.getAttribute('data-placement');
    const gap: number =
      placement === 'top'
        ? triggerBounds.y - (popoverBounds.y + popoverBounds.height)
        : popoverBounds.y - (triggerBounds.y + triggerBounds.height);

    expect(gap).toBeGreaterThan(0);
  }).toPass({ timeout: 5_000 });

  await page.keyboard.press('Escape');

  await expect(popover).toBeHidden();
  await expect(trigger).toBeFocused();
});
