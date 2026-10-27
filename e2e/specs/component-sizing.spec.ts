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

test('Accordion keeps readable heading and body roles with public token overrides @css', async ({
  page,
}: {
  page: Page;
}): Promise<void> => {
  await page.goto('/accordion');
  const accordion: Locator = page.locator('pg-accordion-basic-example sui-accordion');
  const trigger: Locator = accordion.getByRole('button').first();
  const panel: Locator = accordion.locator('.sui-accordion__panel').first();
  await expect(trigger).toHaveCSS('font-size', '14px');
  await expect(panel).toHaveCSS('font-size', '16px');

  await page.evaluate((): void => {
    document.documentElement.style.setProperty('--sui-font-size-md', '19px');
    document.documentElement.style.setProperty('--sui-font-size-body', '21px');
  });
  await expect(trigger).toHaveCSS('font-size', '19px');
  await expect(panel).toHaveCSS('font-size', '21px');
});

for (const example of [
  { path: '/listbox', host: 'pg-listbox-templates-example sui-listbox', content: '[role="option"] strong' },
  { path: '/data-view', host: 'pg-data-view-layout-example sui-data-view', content: 'header strong' },
  { path: '/file-drop', host: 'pg-file-drop-custom-example sui-file-drop', content: 'strong' },
]) {
  test(`${example.path} consumer templates retain the surrounding text size @css`, async ({
    page,
  }: {
    page: Page;
  }): Promise<void> => {
    await page.goto(example.path);
    const component: Locator = page.locator(example.host);
    await page.evaluate((): void => document.documentElement.style.setProperty('--sui-font-size-body', '21px'));
    await component.locator('..').evaluate((element: HTMLElement): void => {
      element.style.fontSize = '14px';
    });
    await expect(component).toHaveCSS('font-size', '14px');
    await expect(component.locator(example.content).first()).toHaveCSS('font-size', '14px');
  });
}

test('Table typography overrides reach rows and cells at each density @css', async ({ page }: { page: Page }): Promise<void> => {
  await page.goto('/table');
  await page.evaluate((): void => {
    document.documentElement.style.setProperty('--sui-font-size-md', '19px');
    document.documentElement.style.setProperty('--sui-font-size-sm', '17px');
  });
  const cases: readonly (readonly [string, string])[] = [
    ['Recent invoices', '19px'],
    ['Compact team directory', '17px'],
  ];
  for (const [name, fontSize] of cases) {
    const table: Locator = page.getByRole('table', { name, exact: true });
    await expect(table.locator('tbody tr').first()).toHaveCSS('font-size', fontSize);
    await expect(table.getByRole('cell').first()).toHaveCSS('font-size', fontSize);
  }
});

test('Chip sizes follow field density and keep an explicit height override @css', async ({
  page,
}: {
  page: Page;
}): Promise<void> => {
  await page.goto('/chip');
  const chips: Locator = page.locator('pg-chip-appearance-example sui-chip');
  await expect(chips).toHaveCount(5);
  for (const [index, fontSize] of ['12px', '12px', '14px', '16px', '18px'].entries()) {
    await expect(chips.nth(index)).toHaveCSS('font-size', fontSize);
  }
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
