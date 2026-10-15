import { expect, Locator, Page, test } from '@playwright/test';
import { Bounds, visibleBounds } from '../support/geometry';

test('Accordion keyboard focus follows the shared focus tokens @css', async ({ page }: { page: Page }): Promise<void> => {
  await page.goto('/accordion');
  const trigger: Locator = page.getByRole('button', { name: 'When will my order arrive?' });
  await trigger.focus();
  await trigger.press('Home');

  const textColor: string = await trigger.evaluate((element: HTMLElement): string => getComputedStyle(element).color);
  await expect(trigger).toHaveCSS('outline-style', 'solid');
  await expect(trigger).toHaveCSS('outline-color', textColor);

  await page.evaluate((): void => {
    document.documentElement.style.setProperty('--sui-focus-ring-color', 'rgb(180, 20, 40)');
    document.documentElement.style.setProperty('--sui-focus-ring-width', '3px');
    document.documentElement.style.setProperty('--sui-focus-ring-offset', '4px');
  });

  await expect(trigger).toHaveCSS('outline-color', 'rgb(180, 20, 40)');
  await expect(trigger).toHaveCSS('outline-width', '3px');
  await expect(trigger).toHaveCSS('outline-offset', '4px');
});

test('Accordion moves focus between triggers and keeps one item expanded', async ({ page }: { page: Page }): Promise<void> => {
  await page.goto('/accordion');
  const shipping: Locator = page.getByRole('button', { name: 'When will my order arrive?' });
  const returns: Locator = page.getByRole('button', { name: 'How do returns work?' });

  await expect(shipping).toHaveAttribute('aria-expanded', 'true');

  await shipping.focus();
  await shipping.press('ArrowDown');

  await expect(returns).toBeFocused();

  await returns.press('Enter');

  await expect(returns).toHaveAttribute('aria-expanded', 'true');
  await expect(shipping).toHaveAttribute('aria-expanded', 'false');
});

test('Accordion hides preserved content and reveals it when reopened', async ({ page }: { page: Page }): Promise<void> => {
  await page.goto('/accordion');
  const trigger: Locator = page.getByRole('button', { name: 'When will my order arrive?' });
  const panel: Locator = page.getByRole('region', { name: 'When will my order arrive?', includeHidden: true });
  const content: string = 'Standard delivery takes three to five business days.';

  await expect(trigger).toHaveAttribute('aria-expanded', 'true');
  await expect(panel).toBeVisible();
  await expect(panel).toContainText(content);

  await trigger.click();

  await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  await expect(panel).toBeHidden();
  await expect(panel).toContainText(content);

  await trigger.click();

  await expect(trigger).toHaveAttribute('aria-expanded', 'true');
  await expect(panel).toBeVisible();
  await expect(panel).toContainText(content);
});

test('Accordion panel buttons retain native keyboard activation without toggling the header', async ({
  page,
}: {
  page: Page;
}): Promise<void> => {
  await page.goto('/accordion');
  const example: Locator = page.locator('pg-accordion-control-example');
  const header: Locator = example.getByRole('button', { name: 'Profile', exact: true });
  const save: Locator = example.getByRole('button', { name: 'Save profile' });

  await save.press('Enter');
  await save.press('Space');

  await expect(example.getByRole('status')).toHaveText('Saved 2 times');
  await expect(header).toHaveAttribute('aria-expanded', 'true');
  await expect(save).toBeFocused();

  const name: Locator = example.getByRole('textbox', { name: 'Display name' });
  await name.press('Home');
  await name.press('ArrowDown');

  await expect(name).toBeFocused();
  await expect(header).toHaveAttribute('aria-expanded', 'true');
});

test('Accordion density tokens reach triggers, panels, and separated item spacing', async ({
  page,
}: {
  page: Page;
}): Promise<void> => {
  await page.goto('/accordion');
  const example: Locator = page.locator('pg-accordion-control-example');
  const host: Locator = example.locator('sui-accordion');
  await host.evaluate((element: HTMLElement): void => {
    element.style.setProperty('--sui-accordion-trigger-min-height', '0px');
    element.style.setProperty('--sui-accordion-trigger-padding-block', '4px');
    element.style.setProperty('--sui-accordion-trigger-padding-inline', '8px');
    element.style.setProperty('--sui-accordion-panel-padding-inline', '8px');
    element.style.setProperty('--sui-accordion-panel-padding-bottom', '0px');
    element.style.setProperty('--sui-accordion-gap', '4px');
    element.style.setProperty('--sui-accordion-motion-duration', '0ms');
  });
  const header: Locator = example.getByRole('button', { name: 'Profile', exact: true });
  const panel: Locator = example.getByRole('region', { name: 'Profile', exact: true });

  await expect(header).toHaveCSS('min-height', '0px');
  await expect(header).toHaveCSS('padding-block', '4px');
  await expect(header).toHaveCSS('padding-inline', '8px');
  await expect(panel).toHaveCSS('padding-inline', '8px');
  await expect(panel).toHaveCSS('padding-bottom', '0px');
  await expect(host.locator('.sui-accordion__group')).toHaveCSS('gap', '4px');
  await expect(host.locator('.sui-accordion__item').first()).toHaveCSS('transition-duration', '0s');
});

test('Accordion actions follow triggers in Tab order and keep their own keyboard activation', async ({
  page,
  browserName,
}: {
  page: Page;
  browserName: 'chromium' | 'firefox' | 'webkit';
}): Promise<void> => {
  await page.goto('/accordion');
  const example: Locator = page.locator('pg-accordion-actions-example');
  const bowls: Locator = example.getByRole('button', { name: 'Bowls', exact: true });
  const add: Locator = example.getByRole('button', { name: 'Add to Bowls' });
  const desserts: Locator = example.getByRole('button', { name: 'Desserts', exact: true });
  const tabKey: string = browserName === 'webkit' && process.platform === 'darwin' ? 'Alt+Tab' : 'Tab';
  await bowls.focus();
  await bowls.press(tabKey);

  await expect(add).toBeFocused();
  await add.press('Enter');
  await expect(example.getByRole('status')).toHaveText('Added an entry to Bowls.');
  await expect(bowls).toHaveAttribute('aria-expanded', 'true');
  await add.press('ArrowDown');
  await expect(add).toBeFocused();
  await add.press(tabKey);

  await expect(desserts).toBeFocused();
  await desserts.press('ArrowUp');
  await expect(bowls).toBeFocused();
});

test('Accordion keeps its header and sibling action within a narrow clipped container', async ({
  page,
}: {
  page: Page;
}): Promise<void> => {
  await page.setViewportSize({ width: 360, height: 740 });
  await page.goto('/accordion');
  const example: Locator = page.locator('pg-accordion-actions-example');
  const header: Locator = example.getByRole('button', { name: 'Desserts', exact: true });
  const add: Locator = example.getByRole('button', { name: 'Add to Desserts' });
  const first: Locator = example.getByRole('button', { name: 'Bowls', exact: true });
  await first.focus();
  await first.press('Home');
  await expect(first).toHaveCSS('outline-offset', '-3px');
  await first.press('Enter');
  await expect(first).toHaveAttribute('aria-expanded', 'false');
  await first.press('End');
  await expect(header).toBeFocused();
  await header.press('Enter');

  await expect(header).toHaveAttribute('aria-expanded', 'true');
  await expect(add).toBeVisible();
  await expect(header).toHaveCSS('outline-offset', '-3px');
  await expect(async (): Promise<void> => {
    const trigger: Bounds = await visibleBounds(header, 'the last Accordion trigger');
    const action: Bounds = await visibleBounds(add, 'the last Accordion action');
    expect(trigger.x + trigger.width).toBeLessThanOrEqual(action.x);
    expect(action.x + action.width).toBeLessThanOrEqual(360);
  }).toPass();

  await header.press('Enter');

  await expect(header).toHaveAttribute('aria-expanded', 'false');
  await expect(header).toBeFocused();
});
