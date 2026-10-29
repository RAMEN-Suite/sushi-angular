import { expect, type Locator, test } from '@playwright/test';

interface FocusOutline {
  readonly width: string;
  readonly offset: string;
  readonly color: string;
  readonly style: string;
}

async function outlines(input: Locator): Promise<readonly FocusOutline[]> {
  return input.evaluate((element: HTMLInputElement): readonly FocusOutline[] => {
    const surface: HTMLElement | null = element.parentElement;
    if (!surface) throw new Error('Expected an OTP input inside its visual surface.');
    const valid: boolean = element.validity.valid;
    const joined: boolean = surface.classList.contains('otp-joined');
    const targets: readonly Element[] = valid && !joined ? Array.from(surface.querySelectorAll('span')) : [surface];
    return targets.map((target: Element): FocusOutline => {
      const style: CSSStyleDeclaration = getComputedStyle(target, valid ? null : '::after');
      return { width: style.outlineWidth, offset: style.outlineOffset, color: style.outlineColor, style: style.outlineStyle };
    });
  });
}

test('OTP uses the same default focus width and offset as a text field at every size @css', async ({ page }): Promise<void> => {
  await page.goto('/input');
  const field: Locator = page.getByRole('textbox', { name: 'Name', exact: true });
  await field.focus();
  const expected: Pick<FocusOutline, 'width' | 'offset'> = await field.evaluate(
    (element: HTMLElement): Pick<FocusOutline, 'width' | 'offset'> => {
      const style: CSSStyleDeclaration = getComputedStyle(element);
      return { width: style.outlineWidth, offset: style.outlineOffset };
    },
  );

  await page.goto('/input-otp');
  await expect(page.getByLabel('Verification code', { exact: true })).toBeVisible();
  for (const input of await page.locator('sui-input-otp input').all()) {
    if (await input.isDisabled()) continue;
    await input.focus();
    for (const outline of await outlines(input)) {
      expect(outline.width).toBe(expected.width);
      expect(outline.offset).toBe(expected.offset);
    }
  }
});

test('OTP preserves configured focus rings and clipping clearance throughout code entry @css', async ({
  page,
}): Promise<void> => {
  await page.goto('/input-otp');
  await page.evaluate((): void => {
    document.documentElement.style.setProperty('--sui-focus-ring-width', '4px');
    document.documentElement.style.setProperty('--sui-focus-ring-offset', '6px');
    document.documentElement.style.setProperty('--sui-focus-ring-color', 'rgb(110, 120, 130)');
  });

  const cases: readonly (readonly [string, string])[] = [
    ['Verification code', '123456'],
    ['Masked PIN', '1234'],
  ];
  for (const [name, code] of cases) {
    const input: Locator = page.getByLabel(name, { exact: true });
    for (const value of ['', code.slice(0, 2), code.slice(0, -1), code]) {
      await input.fill(value);
      const rings: readonly FocusOutline[] = await outlines(input);
      expect(rings.length).toBeGreaterThan(0);
      for (const ring of rings) {
        expect(ring).toEqual({ width: '4px', offset: '6px', color: 'rgb(110, 120, 130)', style: 'solid' });
      }
      const clip: string = await input.evaluate(
        (element: HTMLElement): string => getComputedStyle(element.parentElement ?? element).clipPath,
      );
      expect(clip).toMatch(/^inset\(/u);
      const insets: readonly number[] = Array.from(clip.matchAll(/-?[\d.]+(?=px)/gu), (match): number => Number(match[0]));
      expect(insets.length).toBeGreaterThan(0);
      for (const inset of insets) expect(inset).toBeLessThanOrEqual(-10);
    }
  }
});
