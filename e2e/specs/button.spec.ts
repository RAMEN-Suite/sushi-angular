import { expect, Locator, Page, test } from '@playwright/test';

interface ButtonEffects {
  readonly boxShadow: string;
  readonly textShadow: string;
}

const effectsOf: (button: Locator) => Promise<ButtonEffects> = async (button: Locator): Promise<ButtonEffects> =>
  button.evaluate((element: HTMLElement): ButtonEffects => {
    const styles: CSSStyleDeclaration = getComputedStyle(element);
    return { boxShadow: styles.boxShadow, textShadow: styles.textShadow };
  });

test('buttons remain flat across interaction states', async ({ page }: { page: Page }): Promise<void> => {
  await page.goto('/button');
  const button: Locator = page.getByRole('button', { name: 'Create project' });

  await expect(button).toBeVisible();
  expect(await effectsOf(button)).toEqual({ boxShadow: 'none', textShadow: 'none' });

  await button.hover();
  expect(await effectsOf(button)).toEqual({ boxShadow: 'none', textShadow: 'none' });

  await button.focus();
  expect(await effectsOf(button)).toEqual({ boxShadow: 'none', textShadow: 'none' });
  await expect(button).toBeFocused();
});
