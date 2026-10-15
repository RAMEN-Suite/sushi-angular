import { expect, type Locator, type Page, test } from '@playwright/test';

import { type Bounds, visibleBounds } from '../support/geometry';

test('Tooltip is exposed as the focused control description and honors top placement', async ({
  page,
  browserName,
}: {
  page: Page;
  browserName: string;
}): Promise<void> => {
  await page.goto('/tooltip');
  const trigger: Locator = page.getByRole('button', { name: 'Top' });
  await focusWithKeyboard(page, trigger, browserName);

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

async function focusWithKeyboard(page: Page, trigger: Locator, browserName: string): Promise<void> {
  const macWebkit: boolean = browserName === 'webkit' && process.platform === 'darwin';
  await trigger.focus();
  await page.keyboard.press(macWebkit ? 'Alt+Shift+Tab' : 'Shift+Tab');
  await page.keyboard.press(macWebkit ? 'Alt+Tab' : 'Tab');
}

for (const dismissal of ['Escape', 'selection', 'outside click'] as const) {
  test(`Tooltip stays dismissed after menu ${dismissal} until deliberate hover`, async ({
    page,
  }: {
    page: Page;
  }): Promise<void> => {
    await page.goto('/tooltip');
    await page.clock.install();
    const trigger: Locator = page.getByRole('button', { name: 'Open menu', exact: true });
    const help: Locator = page.getByRole('tooltip', { name: 'Menu help' });
    await trigger.click();
    await expect(page.getByRole('menu', { name: 'Tooltip commands' })).toBeVisible();

    if (dismissal === 'Escape') await page.keyboard.press('Escape');
    else if (dismissal === 'selection') await page.getByRole('menuitem', { name: 'Choose action' }).click();
    else {
      const menu: Bounds = await visibleBounds(page.getByRole('menu', { name: 'Tooltip commands' }), 'the open menu');
      await page.mouse.click(menu.x + menu.width + 16, menu.y + menu.height / 2);
    }

    await expect(trigger).toBeFocused();
    await page.clock.runFor(1_000);
    await expect(help).toBeHidden();

    await page.mouse.move(0, 0);
    await trigger.hover();
    await page.clock.runFor(1_000);
    await expect(help).toBeVisible();
  });
}

for (const surface of ['dialog', 'popover'] as const) {
  test(`Tooltip stays dismissed after ${surface} focus restoration`, async ({ page }: { page: Page }): Promise<void> => {
    await page.goto('/tooltip');
    await page.clock.install();
    const trigger: Locator = page.getByRole('button', { name: `Open ${surface}`, exact: true });
    await trigger.click();
    await expect(page.getByRole('dialog', { name: `Tooltip ${surface}`, exact: true })).toBeVisible();
    await page.getByRole('button', { name: `Close ${surface}`, exact: true }).click();

    await expect(trigger).toBeFocused();
    await page.clock.runFor(1_000);
    await expect(page.getByRole('tooltip', { name: `${surface === 'dialog' ? 'Dialog' : 'Popover'} help` })).toBeHidden();
  });
}

test('Tooltip still opens on deliberate keyboard focus after menu dismissal', async ({
  page,
  browserName,
}: {
  page: Page;
  browserName: string;
}): Promise<void> => {
  await page.goto('/tooltip');
  await page.clock.install();
  const trigger: Locator = page.getByRole('button', { name: 'Open menu', exact: true });
  const help: Locator = page.getByRole('tooltip', { name: 'Menu help' });
  await trigger.click();
  await expect(page.getByRole('menu', { name: 'Tooltip commands' })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(trigger).toBeFocused();
  await page.clock.runFor(1_000);
  await expect(help).toBeHidden();

  await focusWithKeyboard(page, trigger, browserName);
  await page.clock.runFor(1_000);

  await expect(trigger).toBeFocused();
  await expect(help).toBeVisible();
});

test('Tooltip ignores the hover and native focus return caused by dialog Escape', async ({
  page,
}: {
  page: Page;
}): Promise<void> => {
  await page.goto('/tooltip');
  await page.clock.install();
  const trigger: Locator = page.getByRole('button', { name: 'Open dialog', exact: true });
  await trigger.click();
  await expect(page.getByRole('dialog', { name: 'Tooltip dialog', exact: true })).toBeVisible();
  await page.keyboard.press('Escape');

  await expect(trigger).toBeFocused();
  await page.clock.runFor(1_000);
  await expect(page.getByRole('tooltip', { name: 'Dialog help' })).toBeHidden();
});
