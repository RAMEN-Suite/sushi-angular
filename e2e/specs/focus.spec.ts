import { expect, type Locator, type Page, test } from '@playwright/test';

interface FocusCase {
  readonly name: string;
  readonly path: string;
  readonly control: (page: Page) => Locator;
  readonly surface: (control: Locator) => Locator;
  readonly property: 'outline-color' | 'box-shadow';
}

const cases: readonly FocusCase[] = [
  {
    name: 'Breadcrumb outline',
    path: '/breadcrumb',
    control: (page: Page): Locator =>
      page.getByRole('navigation', { name: 'Store location' }).getByRole('link', { name: 'Shop' }),
    surface: (control: Locator): Locator => control,
    property: 'outline-color',
  },
  {
    name: 'Tabs inset ring',
    path: '/tabs',
    control: (page: Page): Locator =>
      page.getByRole('tablist', { name: 'Account sections' }).getByRole('tab', { name: 'Profile' }),
    surface: (control: Locator): Locator => control,
    property: 'box-shadow',
  },
  {
    name: 'Listbox container ring',
    path: '/listbox',
    control: (page: Page): Locator => page.getByRole('listbox', { name: 'Active workspace' }),
    surface: (control: Locator): Locator => control.locator('..'),
    property: 'outline-color',
  },
  {
    name: 'Color Picker preset ring',
    path: '/color-picker',
    control: (page: Page): Locator => page.getByRole('radiogroup', { name: 'Quick palette' }).getByRole('radio').first(),
    surface: (control: Locator): Locator => control,
    property: 'outline-color',
  },
];

for (const focusCase of cases) {
  test(`${focusCase.name} honors the global focus color @css`, async ({ page }: { page: Page }): Promise<void> => {
    await page.goto(focusCase.path);
    await page.evaluate((): void => document.documentElement.style.setProperty('--sui-focus-ring-color', 'rgb(180, 20, 40)'));
    await page.keyboard.press('Tab');
    const control: Locator = focusCase.control(page);
    await control.focus();

    await expect(control).toBeFocused();
    await expect(focusCase.surface(control)).toHaveCSS(focusCase.property, /rgb\(180, 20, 40\)/);
  });
}

test('OTP digit ring honors the global focus color @css', async ({ page }: { page: Page }): Promise<void> => {
  await page.goto('/input-otp');
  await page.evaluate((): void => document.documentElement.style.setProperty('--sui-focus-ring-color', 'rgb(180, 20, 40)'));
  const input: Locator = page.getByRole('textbox', { name: 'Verification code' });
  await input.focus();

  await expect(input).toBeFocused();
  const digitSurface: Locator = input.locator('..');
  await expect
    .poll(async (): Promise<string> =>
      digitSurface.evaluate((element: HTMLElement): string => getComputedStyle(element, '::after').outlineColor),
    )
    .toBe('rgb(180, 20, 40)');
});
