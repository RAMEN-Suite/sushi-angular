import { expect, Locator, Page, test } from '@playwright/test';

interface Bounds {
  readonly height: number;
  readonly width: number;
  readonly x: number;
  readonly y: number;
}

async function visibleBounds(locator: Locator, description: string): Promise<Bounds> {
  const bounds: Bounds | null = await locator.boundingBox();
  if (bounds === null) throw new Error(`Expected visible bounds for ${description}.`);
  return bounds;
}

test('Popover moves focus, preserves its offset, and restores the trigger on Escape', async ({
  page,
}: {
  page: Page;
}): Promise<void> => {
  await page.goto('/popover');
  const trigger: Locator = page.getByRole('button', { name: 'Share menu' });
  await trigger.click();

  const popover: Locator = page.getByRole('dialog', { name: 'Share this menu' });
  await expect(popover).toBeFocused();
  await expect(trigger).toHaveAttribute('aria-expanded', 'true');

  const triggerBounds: Bounds = await visibleBounds(trigger, 'the Popover trigger');
  const popoverBounds: Bounds = await visibleBounds(popover, 'the Popover');
  const placement: string | null = await popover.getAttribute('data-placement');
  const gap: number =
    placement === 'top'
      ? triggerBounds.y - (popoverBounds.y + popoverBounds.height)
      : popoverBounds.y - (triggerBounds.y + triggerBounds.height);
  expect(gap).toBeGreaterThanOrEqual(8);

  await page.keyboard.press('Escape');
  await expect(popover).toBeHidden();
  await expect(trigger).toBeFocused();
});

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

  const triggerBounds: Bounds = await visibleBounds(trigger, 'the Tooltip trigger');
  const tooltipBounds: Bounds = await visibleBounds(tooltip, 'the Tooltip');
  expect(triggerBounds.y - (tooltipBounds.y + tooltipBounds.height)).toBeGreaterThanOrEqual(10);

  await page.keyboard.press('Escape');
  await expect(tooltip).toBeHidden();
  await expect(trigger).not.toHaveAttribute('aria-describedby', tooltipId);
});

test('Select popup follows its control and commits an option', async ({ page }: { page: Page }): Promise<void> => {
  await page.goto('/select');
  const select: Locator = page.getByRole('combobox', { name: 'Favorite color' });
  await select.press('ArrowDown');

  const listbox: Locator = page.getByRole('listbox').first();
  await expect(listbox).toBeVisible();
  const selectBounds: Bounds = await visibleBounds(select, 'the Select control');
  const popupBounds: Bounds = await visibleBounds(listbox.locator('..'), 'the Select popup');
  expect(popupBounds.x).toBeCloseTo(selectBounds.x, 0);
  expect(popupBounds.width).toBeCloseTo(selectBounds.width, 0);

  await page.getByRole('option', { name: 'Emerald' }).click();
  await expect(listbox).toBeHidden();
  await expect(select).toContainText('Emerald');
});

test('Autocomplete keeps keyboard focus while choosing a suggestion', async ({ page }: { page: Page }): Promise<void> => {
  await page.goto('/autocomplete');
  const input: Locator = page.getByRole('combobox', { name: 'City', exact: true });
  await input.fill('Ber');

  const option: Locator = page.getByRole('option', { name: 'Berlin' });
  await expect(option).toBeVisible();
  await input.press('ArrowDown');
  await input.press('Enter');

  await expect(input).toBeFocused();
  await expect(input).toHaveValue('Berlin');
  await expect(option).toBeHidden();
});

test('Multi-Select remains open while adding multiple options', async ({ page }: { page: Page }): Promise<void> => {
  await page.goto('/multi-select');
  const select: Locator = page.getByRole('combobox', { name: 'Message labels' });
  await select.click();

  const listbox: Locator = page.getByRole('listbox').first();
  await expect(listbox).toBeVisible();
  await page.getByRole('option', { name: 'Important' }).click();
  await expect(listbox).toBeVisible();
  await page.getByRole('option', { name: 'Personal' }).click();
  await expect(listbox).toBeVisible();
  await expect(page.getByText('Selected: 2 labels', { exact: true })).toBeVisible();
});
