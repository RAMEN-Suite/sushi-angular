import { expect, type Locator, type Page, test } from '@playwright/test';

test('Select options use the trigger text size across the public size scale @css', async ({
  page,
}: {
  page: Page;
}): Promise<void> => {
  await page.goto('/select');

  for (const name of ['Extra compact', 'Compact', 'Default', 'Large', 'Extra large']) {
    const control: Locator = page.getByRole('combobox', { name, exact: true });
    const fontSize: string = await control.evaluate((element: HTMLElement): string => getComputedStyle(element).fontSize);
    await control.click();
    await expect(page.getByRole('option').first()).toHaveCSS('font-size', fontSize);
    await control.press('Escape');
  }
});

test('shared typography overrides reach a control, its popup and empty collection text @css', async ({
  page,
}: {
  page: Page;
}): Promise<void> => {
  await page.goto('/select');
  await page.evaluate((): void => document.documentElement.style.setProperty('--sui-font-size-md', '19px'));
  const control: Locator = page.getByRole('combobox', { name: 'Favorite color', exact: true });
  await expect(control).toHaveCSS('font-size', '19px');
  await control.click();
  await expect(page.getByRole('option').first()).toHaveCSS('font-size', '19px');

  await page.goto('/listbox');
  await page.evaluate((): void => document.documentElement.style.setProperty('--sui-font-size-md', '19px'));
  await expect(page.getByText('No matching environments are available.', { exact: true })).toHaveCSS('font-size', '19px');
});

test('Accordion headers and panels use the same size token @css', async ({ page }: { page: Page }): Promise<void> => {
  await page.goto('/accordion');
  await page.evaluate((): void => document.documentElement.style.setProperty('--sui-font-size-sm', '19px'));
  const accordion: Locator = page.locator('pg-accordion-basic-example sui-accordion');
  await expect(accordion.getByRole('button').first()).toHaveCSS('font-size', '19px');
  await expect(accordion.locator('.sui-accordion__panel').first()).toHaveCSS('font-size', '19px');
});

test('Chip sizes follow field density and keep an explicit height override @css', async ({
  page,
}: {
  page: Page;
}): Promise<void> => {
  await page.goto('/chip');
  const chips: Locator = page.locator('pg-chip-appearance-example sui-chip');
  await expect(chips).toHaveCount(5);
  const heights: readonly number[] = await chips.evaluateAll((elements: Element[]): number[] =>
    elements.map((element: Element): number => Number.parseFloat(getComputedStyle(element).height)),
  );

  await page.evaluate((): void => document.documentElement.style.setProperty('--size-field', '0.375rem'));
  for (const [index, chip] of (await chips.all()).entries()) {
    const initial: number | undefined = heights[index];
    if (initial === undefined) throw new Error('Expected the initial height for each Chip size.');
    await expect(chip).toHaveCSS('height', `${initial * 1.5}px`);
  }

  await chips.evaluateAll((elements: HTMLElement[]): void => {
    for (const element of elements) element.style.setProperty('--sui-chip-height', '52px');
  });
  for (const chip of await chips.all()) await expect(chip).toHaveCSS('height', '52px');
});
