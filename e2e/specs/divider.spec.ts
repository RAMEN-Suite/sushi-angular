import { expect, Locator, Page, test } from '@playwright/test';

test('empty vertical Dividers respect explicit height and flex stretching', async ({ page }: { page: Page }): Promise<void> => {
  await page.goto('/divider');
  const toolbar: Locator = page.getByTestId('toolbar-divider');
  const stretched: Locator = page.getByTestId('stretch-divider');
  const rem: number = await page.evaluate((): number => Number.parseFloat(getComputedStyle(document.documentElement).fontSize));

  await expect(toolbar).toHaveCSS('height', `${1.5 * rem}px`);
  await expect(async (): Promise<void> => {
    const layout: { height: number; available: number } = await stretched.evaluate((element: HTMLElement) => {
      const parent: HTMLElement | null = element.parentElement;
      if (!parent) throw new Error('Expected the vertical Divider in its flex container.');
      const style: CSSStyleDeclaration = getComputedStyle(element);
      return {
        height: element.getBoundingClientRect().height,
        available:
          parent.getBoundingClientRect().height - Number.parseFloat(style.marginTop) - Number.parseFloat(style.marginBottom),
      };
    });
    expect(layout.height).toBeCloseTo(layout.available, 0);
  }).toPass({ timeout: 5_000 });
});
