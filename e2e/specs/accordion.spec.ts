import { expect, Locator, Page, test } from '@playwright/test';

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
  await expect(header.locator('..').locator('..')).toHaveCSS('transition-duration', '0s');
});
