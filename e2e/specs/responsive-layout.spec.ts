import { expect, Locator, Page, test } from '@playwright/test';

interface Bounds {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
}

test.use({ viewport: { width: 390, height: 844 } });

test('Input keeps its configured text size when focused', async ({
  page,
  isMobile,
}: {
  page: Page;
  isMobile: boolean;
}): Promise<void> => {
  await page.goto('/input');
  for (const placeholder of ['XS input', 'LG input']) {
    const input: Locator = page.getByPlaceholder(placeholder, { exact: true });
    await input.scrollIntoViewIfNeeded();
    const fontSize: string = await input.evaluate((element: HTMLElement): string => getComputedStyle(element).fontSize);
    if (isMobile) await input.tap();
    else await input.click();

    await expect(input).toBeFocused();
    await expect(input).toHaveCSS('font-size', fontSize);
  }
});

for (const width of [390, 1280]) {
  test(`Playground scrolls ${width < 1024 ? 'the document on mobile' : 'its content independently on desktop'}`, async ({
    page,
  }: {
    page: Page;
  }): Promise<void> => {
    await page.setViewportSize({ width, height: 700 });
    await page.goto('/input');
    const content: Locator = page.getByTestId('playground-content');
    await expect(page.getByRole('textbox', { name: 'Name', exact: true })).toBeVisible();

    await content.evaluate((element: HTMLElement): void => {
      element.scrollTo(0, 200);
      window.scrollTo(0, 200);
    });
    await expect
      .poll((): Promise<boolean> =>
        content.evaluate((element: HTMLElement): boolean => {
          const documentScroll: number = document.scrollingElement?.scrollTop ?? 0;
          return window.innerWidth < 1024
            ? documentScroll > 0 && element.scrollTop === 0
            : documentScroll === 0 && element.scrollTop > 0;
        }),
      )
      .toBe(true);
  });
}

async function boundsOf(locator: Locator): Promise<Bounds> {
  const bounds: Bounds | null = await locator.boundingBox();
  if (!bounds) throw new Error('Expected a visible layout surface.');
  return bounds;
}

test('collapsible Navbar exposes mobile navigation and restores toggle focus on Escape', async ({
  page,
}: {
  page: Page;
}): Promise<void> => {
  await page.goto('/navbar');
  const example: Locator = page.getByText('Link navigation', { exact: true }).locator('..');
  const toggle: Locator = example.getByRole('button', { name: 'Toggle navigation' });

  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');

  await example.getByRole('button', { name: 'Products' }).press('Escape');
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(toggle).toBeFocused();
});

test('Navbar switches at its configured breakpoint without hiding persistent actions', async ({
  page,
}: {
  page: Page;
}): Promise<void> => {
  await page.setViewportSize({ width: 1000, height: 844 });
  await page.goto('/navbar');
  const navbar: Locator = page.getByRole('navigation', { name: 'Operations console' });
  const toggle: Locator = navbar.getByRole('button', { name: 'Toggle navigation' });
  const action: Locator = navbar.getByRole('button', { name: 'New task' });

  await expect(toggle).toBeHidden();
  await expect(action).toBeVisible();

  await page.setViewportSize({ width: 600, height: 844 });
  await expect(toggle).toBeVisible();
  await expect(action).toBeVisible();
});

test('Table stays inside a narrow viewport and exposes horizontal scrolling', async ({ page }: { page: Page }): Promise<void> => {
  await page.goto('/table');
  const table: Locator = page.getByRole('table', { name: 'Release queue' });
  const viewport: Locator = table.locator('..');

  await expect(table).toBeVisible();
  await expect
    .poll(async (): Promise<boolean> =>
      viewport.evaluate((element: HTMLElement): boolean => {
        const bounds: DOMRect = element.getBoundingClientRect();
        const isContained: boolean = bounds.left >= 0 && bounds.right <= document.documentElement.clientWidth;
        const canScroll: boolean = element.scrollWidth > element.clientWidth;
        return isContained && canScroll;
      }),
    )
    .toBe(true);
});

test('Table keeps only its first column pinned and aligns the remaining headings with their cells', async ({
  page,
}: {
  page: Page;
}): Promise<void> => {
  await page.goto('/table');
  const table: Locator = page.getByRole('table', { name: 'Release queue' });
  const viewport: Locator = table.locator('..');
  await expect(table).toBeVisible();
  const pinnedHeading: Locator = table.getByRole('columnheader').first();
  const movingHeading: Locator = table.getByRole('columnheader').nth(1);
  const firstRow: Locator = table.locator('tbody tr').first();
  const pinnedBefore: Bounds = await boundsOf(pinnedHeading);
  const movingBefore: Bounds = await boundsOf(movingHeading);

  await viewport.evaluate((element: HTMLElement): void => {
    element.scrollLeft = element.scrollWidth - element.clientWidth;
  });

  await expect
    .poll(async (): Promise<boolean> => {
      const pinned: Bounds = await boundsOf(pinnedHeading);
      const rowHeading: Bounds = await boundsOf(firstRow.getByRole('rowheader'));
      const moving: Bounds = await boundsOf(movingHeading);
      const bodyCell: Bounds = await boundsOf(firstRow.getByRole('cell').first());
      const tolerance: number = pinned.width * 0.03;

      return (
        Math.abs(pinned.x - pinnedBefore.x) < tolerance &&
        Math.abs(rowHeading.x - pinned.x) < tolerance &&
        moving.x < movingBefore.x - moving.width / 2 &&
        Math.abs(moving.x - bodyCell.x) < tolerance
      );
    })
    .toBe(true);
});

test('Table keeps its heading visible while its rows scroll vertically', async ({ page }: { page: Page }): Promise<void> => {
  await page.goto('/table');
  const table: Locator = page.getByRole('table', { name: 'Scrollable team directory' });
  const viewport: Locator = table.locator('..');
  await viewport.scrollIntoViewIfNeeded();

  const heading: Locator = table.getByRole('columnheader').first();
  const row: Locator = table.locator('tbody tr').first();
  const headingBefore: Bounds = await boundsOf(heading);
  const rowBefore: Bounds = await boundsOf(row);

  await viewport.evaluate((element: HTMLElement): void => {
    element.scrollTop = element.scrollHeight - element.clientHeight;
  });

  await expect
    .poll(async (): Promise<boolean> => {
      const headingAfter: Bounds = await boundsOf(heading);
      const rowAfter: Bounds = await boundsOf(row);
      return (
        Math.abs(headingAfter.y - headingBefore.y) < headingBefore.height * 0.05 &&
        rowAfter.y < rowBefore.y - rowBefore.height / 2
      );
    })
    .toBe(true);
});

for (const route of ['input', 'file-input', 'fieldset', 'range']) {
  test(`${route} controls stay inside their labels and fieldsets on narrow screens`, async ({
    page,
  }: {
    page: Page;
  }): Promise<void> => {
    await page.goto(`/${route}`);
    const controls: Locator = page.locator(
      'input[suiInput], input[suiInputSurfaceControl], input[suiFileInput], input[suiRange]',
    );
    await expect(controls.first()).toBeVisible();

    for (const width of [320, 390]) {
      await page.setViewportSize({ width, height: 844 });
      await expect
        .poll(async () =>
          controls.evaluateAll((elements: Element[]) =>
            elements
              .filter((element: Element): boolean => element.getBoundingClientRect().width > 0)
              .flatMap((element: Element) => {
                const bounds: DOMRect = element.getBoundingClientRect();
                const parentElement: HTMLElement | null = element.parentElement;
                if (!parentElement) throw new Error('Expected a form control inside a layout container.');
                const parent: DOMRect = parentElement.getBoundingClientRect();
                const fieldset: DOMRect | undefined = element.closest('fieldset')?.getBoundingClientRect();
                const right: number = Math.min(parent.right, fieldset?.right ?? innerWidth, innerWidth);
                if (bounds.left >= parent.left - 2 && bounds.right <= right + 2) return [];
                return [
                  {
                    name: element.getAttribute('aria-label') ?? element.getAttribute('type'),
                    left: bounds.left,
                    right: bounds.right,
                    availableRight: right,
                  },
                ];
              }),
          ),
        )
        .toEqual([]);
    }
  });
}

test('Budget controls stack on mobile and remain usable', async ({
  page,
  isMobile,
}: {
  page: Page;
  isMobile: boolean;
}): Promise<void> => {
  await page.goto('/input-group');
  const amount: Locator = page.getByRole('spinbutton', { name: 'Budget amount' });
  const period: Locator = page.getByRole('combobox', { name: 'Billing period' });
  const action: Locator = page.getByRole('button', { name: 'Apply', exact: true });
  const group: Locator = amount.locator('../..');

  await expect
    .poll(async (): Promise<boolean> => {
      const input: Bounds = await boundsOf(amount);
      const select: Bounds = await boundsOf(period);
      const button: Bounds = await boundsOf(action);
      const container: Bounds = await boundsOf(group);
      const tolerance: number = container.width * 0.03;
      return (
        select.y >= input.y + input.height - tolerance &&
        button.y >= select.y + select.height - tolerance &&
        input.height >= button.height * 0.9 &&
        Math.abs(select.width - container.width) < tolerance
      );
    })
    .toBe(true);

  await amount.fill('25');
  if (isMobile) await period.tap();
  else await period.click();
  const option: Locator = page.getByRole('option', { name: 'Monthly', exact: true });
  await expect(option).toBeVisible();
  if (isMobile) await option.tap();
  else await option.click();
  await expect(period).toContainText('Monthly');
  await expect(amount).toHaveValue('25');
});

test('Budget controls fit on one row above the desktop breakpoint', async ({ page }: { page: Page }): Promise<void> => {
  await page.setViewportSize({ width: 800, height: 844 });
  await page.goto('/input-group');
  const amount: Locator = page.getByRole('spinbutton', { name: 'Budget amount' });
  const period: Locator = page.getByRole('combobox', { name: 'Billing period' });
  const action: Locator = page.getByRole('button', { name: 'Apply', exact: true });
  const group: Locator = amount.locator('../..');

  await expect
    .poll(async (): Promise<boolean> => {
      const input: Bounds = await boundsOf(amount);
      const select: Bounds = await boundsOf(period);
      const button: Bounds = await boundsOf(action);
      const container: Bounds = await boundsOf(group);
      const tolerance: number = input.height * 0.05;
      return (
        Math.abs(input.y - select.y) < tolerance &&
        Math.abs(input.y - button.y) < tolerance &&
        select.x >= input.x + input.width - tolerance &&
        button.x + button.width <= container.x + container.width + tolerance
      );
    })
    .toBe(true);
});
