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

test('Select option spacing increases from extra compact to default @css', async ({ page }: { page: Page }): Promise<void> => {
  await page.goto('/select');
  let previousPadding: number = 0;
  for (const name of ['Extra compact', 'Compact', 'Default']) {
    const control: Locator = page.getByRole('combobox', { name, exact: true });
    await control.click();
    const padding: number = await page
      .getByRole('option')
      .first()
      .evaluate((element: HTMLElement): number => Number.parseFloat(getComputedStyle(element).paddingBlockStart));
    expect(padding).toBeGreaterThan(previousPadding);
    previousPadding = padding;
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

test('field and action components share the configured md typography token @css', async ({
  page,
}: {
  page: Page;
}): Promise<void> => {
  const cases: readonly (readonly [string, string])[] = [
    ['/input', '#input-name'],
    ['/textarea', '#textarea-message'],
    ['/input-number', 'sui-input-number input'],
    ['/input-surface', 'input[suiInputSurfaceControl]'],
    ['/button', 'button[suiButton][data-size="md"]'],
    ['/badge', '[suiBadge][data-size="md"]'],
    ['/menu', '[role="menu"][aria-labelledby="document-menu-label"]'],
    ['/tabs', 'pg-tabs-basic-example sui-tabs .sui-tab'],
    ['/navbar', 'pg-navbar-basic-example .sui-navbar__label'],
    ['/list', 'sui-list .list'],
    ['/toggle-button', 'sui-toggle-button button[data-size="md"]'],
    ['/select-button', 'sui-select-button button[data-size="md"]'],
  ];
  for (const [path, selector] of cases) {
    await page.goto(path);
    await page.evaluate((): void => document.documentElement.style.setProperty('--sui-font-size-md', '19px'));
    await expect(page.locator(selector).first()).toHaveCSS('font-size', '19px');
  }
});

test('OTP digit typography responds to the shared token without losing its larger role @css', async ({
  page,
}: {
  page: Page;
}): Promise<void> => {
  await page.goto('/input-otp');
  const digits: Locator = page.locator('sui-input-otp .otp').first();
  const before: string = await digits.evaluate((element: HTMLElement): string => getComputedStyle(element).fontSize);
  await page.evaluate((): void => document.documentElement.style.setProperty('--sui-font-size-md', '19px'));
  await expect(digits).not.toHaveCSS('font-size', before);
});

test('consumer text utilities override shared typography defaults @css', async ({ page }): Promise<void> => {
  const cases: readonly (readonly [string, string])[] = [
    ['/button', 'button[suiButton][data-size="md"]'],
    ['/button', 'a[suiButton]'],
    ['/input', '#input-name'],
    ['/textarea', '#textarea-message'],
    ['/badge', '[suiBadge][data-size="md"]'],
    ['/input-surface', '[suiInputSurface]'],
    ['/input-surface', 'input[suiInputSurfaceControl]'],
    ['/select', 'sui-select'],
    ['/multi-select', 'sui-multi-select'],
    ['/autocomplete', 'sui-autocomplete'],
    ['/table', 'sui-table'],
    ['/table', 'sui-table tbody tr'],
    ['/pagination', 'sui-pagination'],
    ['/color-picker', 'sui-color-picker'],
  ];
  for (const [path, selector] of cases) {
    await page.goto(path);
    await page.evaluate((): void => document.documentElement.style.setProperty('--sui-font-size-md', '19px'));
    const control: Locator = page.locator(selector).first();
    for (const utility of ['text-lg', 'text-xs']) {
      const expected: string = await control.evaluate((element: HTMLElement, className: string): string => {
        element.classList.remove('text-lg', 'text-xs');
        element.classList.add(className);
        const reference: HTMLSpanElement = document.createElement('span');
        reference.className = className;
        document.body.append(reference);
        const fontSize: string = getComputedStyle(reference).fontSize;
        reference.remove();
        return fontSize;
      }, utility);
      await expect(control).toHaveCSS('font-size', expected);
    }
  }
});

test('Navbar projection and custom item templates retain surrounding typography @css', async ({ page }): Promise<void> => {
  await page.goto('/navbar');
  const navbar: Locator = page.locator('pg-navbar-custom-example sui-navbar');
  await navbar.evaluate((element: HTMLElement): void => {
    element.style.fontSize = '23px';
    element.style.setProperty('--sui-font-size-md', '19px');
    element.style.setProperty('--sui-font-size-sm', '17px');
  });
  await expect(navbar.locator('[suiNavbarBrand]')).toHaveCSS('font-size', '23px');
  await expect(navbar.locator('.sui-navbar__link > span').first()).toHaveCSS('font-size', '23px');
});

test('List row density does not change the medium text role @css', async ({ page }): Promise<void> => {
  await page.goto('/list');
  await page.evaluate((): void => {
    document.documentElement.style.setProperty('--sui-font-size-md', '19px');
    document.documentElement.style.setProperty('--sui-font-size-sm', '17px');
  });
  for (const name of ['Project members', 'Release tasks']) {
    const list: Locator = page.getByRole('list', { name, exact: true });
    await expect(list.getByRole('listitem').first().locator('strong')).toHaveCSS('font-size', '19px');
  }
});

test('large Badge and Chip labels remain independent of body typography @css', async ({ page }): Promise<void> => {
  const cases: readonly (readonly [string, string])[] = [
    ['/badge', '[suiBadge][data-size="lg"]'],
    ['/chip', 'sui-chip.sui-chip--lg'],
  ];
  for (const [path, selector] of cases) {
    await page.goto(path);
    const label: Locator = page.locator(selector).first();
    const before: string = await label.evaluate((element: HTMLElement): string => getComputedStyle(element).fontSize);
    await page.evaluate((): void => document.documentElement.style.setProperty('--sui-font-size-body', '27px'));
    await expect(label).toHaveCSS('font-size', before);
    await page.evaluate((): void => document.documentElement.style.setProperty('--sui-font-size-lg', '27px'));
    await expect(label).toHaveCSS('font-size', '24px');
  }
});
