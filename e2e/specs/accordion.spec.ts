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
