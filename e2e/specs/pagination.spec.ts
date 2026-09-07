import { expect, Locator, Page, test } from '@playwright/test';

interface ActionAppearance {
  readonly backgroundColor: string;
  readonly borderRadius: string;
}

interface JoinedActionGeometry {
  readonly left: number;
  readonly right: number;
  readonly topLeftRadius: string;
  readonly topRightRadius: string;
}

const appearanceOf: (action: Locator) => Promise<ActionAppearance> = async (action: Locator): Promise<ActionAppearance> =>
  action.evaluate((element: HTMLElement): ActionAppearance => {
    const styles: CSSStyleDeclaration = getComputedStyle(element);
    return { backgroundColor: styles.backgroundColor, borderRadius: styles.borderRadius };
  });

test('plain pagination uses round actions with a soft semantic hover', async ({ page }: { page: Page }): Promise<void> => {
  await page.goto('/pagination');
  const pagination: Locator = page.getByRole('navigation', { name: 'Release pages' });
  const current: Locator = pagination.getByRole('button', { name: 'Edit current page' });
  const next: Locator = pagination.getByRole('button', { name: 'Next page' });
  const currentAppearance: ActionAppearance = await appearanceOf(current);
  const restingAppearance: ActionAppearance = await appearanceOf(next);

  expect(restingAppearance.borderRadius).toBe(currentAppearance.borderRadius);
  expect(restingAppearance.backgroundColor).not.toBe(currentAppearance.backgroundColor);

  await next.hover();
  const hoverAppearance: ActionAppearance = await appearanceOf(next);
  expect(hoverAppearance.backgroundColor).not.toBe(restingAppearance.backgroundColor);
});

test('joined pagination renders one contiguous button group', async ({ page }: { page: Page }): Promise<void> => {
  await page.goto('/pagination');
  const example: Locator = page.getByText('Connected primary actions', { exact: true }).locator('..');
  const actions: Locator = example.locator('.join').getByRole('button');
  const geometry: readonly JoinedActionGeometry[] = await actions.evaluateAll(
    (elements: readonly Element[]): readonly JoinedActionGeometry[] =>
      elements.map((element: Element): JoinedActionGeometry => {
        const bounds: DOMRect = element.getBoundingClientRect();
        const styles: CSSStyleDeclaration = getComputedStyle(element);
        return {
          left: bounds.left,
          right: bounds.right,
          topLeftRadius: styles.borderTopLeftRadius,
          topRightRadius: styles.borderTopRightRadius,
        };
      }),
  );

  expect(geometry).toHaveLength(7);
  for (let index: number = 1; index < geometry.length; index += 1) {
    expect(Math.abs((geometry[index]?.left ?? 0) - (geometry[index - 1]?.right ?? 0))).toBeLessThanOrEqual(1);
  }
  expect(geometry[0]?.topLeftRadius).not.toBe('0px');
  expect(geometry[0]?.topRightRadius).toBe('0px');
  expect(geometry.at(-1)?.topRightRadius).not.toBe('0px');
});
