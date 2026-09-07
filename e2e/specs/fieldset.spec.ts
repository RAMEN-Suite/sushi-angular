import { expect, Locator, Page, test } from '@playwright/test';

interface FieldsetFrame {
  readonly borderStyle: string;
  readonly borderWidth: string;
  readonly paddingInlineStart: string;
}

const frameOf: (fieldset: Locator) => Promise<FieldsetFrame> = async (fieldset: Locator): Promise<FieldsetFrame> =>
  fieldset.evaluate((element: HTMLElement): FieldsetFrame => {
    const styles: CSSStyleDeclaration = getComputedStyle(element);
    return {
      borderStyle: styles.borderTopStyle,
      borderWidth: styles.borderTopWidth,
      paddingInlineStart: styles.paddingInlineStart,
    };
  });

test('fieldsets are framed by default and support an explicit borderless variant', async ({
  page,
}: {
  page: Page;
}): Promise<void> => {
  await page.goto('/fieldset');

  const framed: Locator = page.getByRole('group', { name: 'Account notifications' });
  expect(await frameOf(framed)).toEqual({ borderStyle: 'solid', borderWidth: '1px', paddingInlineStart: '16px' });

  const borderless: Locator = page.getByRole('group', { name: 'Advanced settings' });
  expect(await frameOf(borderless)).toEqual({ borderStyle: 'none', borderWidth: '0px', paddingInlineStart: '0px' });
});
