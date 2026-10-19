import { expect, type Locator, type Page, test } from '@playwright/test';
import { type Bounds, visibleBounds } from '../support/geometry';

async function touchAt(handle: Locator, type: string, x: number, y: number): Promise<void> {
  const scroll: Readonly<{ x: number; y: number }> = await handle.evaluate((): Readonly<{ x: number; y: number }> => ({
    x: window.scrollX,
    y: window.scrollY,
  }));
  const touch: Readonly<{ identifier: number; clientX: number; clientY: number; pageX: number; pageY: number }> = {
    identifier: 1,
    clientX: x,
    clientY: y,
    pageX: x + scroll.x,
    pageY: y + scroll.y,
  };
  await handle.dispatchEvent(type, {
    bubbles: true,
    cancelable: true,
    touches: type === 'touchend' ? [] : [touch],
    targetTouches: type === 'touchend' ? [] : [touch],
    changedTouches: [touch],
  });
}

async function startDrag(page: Page, handle: Locator, mobile: boolean): Promise<void> {
  await handle.scrollIntoViewIfNeeded();
  const rect: Bounds = await visibleBounds(handle, 'the reorder handle');
  const x: number = rect.x + rect.width / 2;
  const y: number = rect.y + rect.height / 2;
  if (mobile) {
    await touchAt(handle, 'touchstart', x, y);
    await page.clock.runFor(160);
    await touchAt(handle, 'touchmove', x, y + 12);
  } else {
    await page.mouse.move(x, y);
    await page.mouse.down();
    await page.mouse.move(x, y + 12, { steps: 3 });
  }
}

async function finishDrag(page: Page, handle: Locator, target: Bounds, mobile: boolean): Promise<void> {
  const x: number = target.x + target.width / 2;
  const y: number = target.y + target.height / 2;
  if (mobile) {
    await touchAt(handle, 'touchmove', x, y);
    await touchAt(handle, 'touchend', x, y);
    await page.clock.runFor(200);
  } else {
    await page.mouse.move(x, y, { steps: 12 });
    await page.mouse.up();
  }
}

test('OrderList drags the complete row without changing its preview or placeholder geometry', async ({
  page,
  isMobile,
}): Promise<void> => {
  await page.goto('/order-list');
  if (isMobile) await page.clock.install();
  const list: Locator = page.getByRole('list', { name: 'Watchlist', exact: true });
  const rows: Locator = list.getByRole('listitem');
  const source: Locator = list.getByRole('button', { name: 'Reorder The Shawshank Redemption', exact: true });
  await source.scrollIntoViewIfNeeded();
  const original: Bounds = await visibleBounds(rows.first(), 'the original row');
  const destination: Bounds = await visibleBounds(rows.nth(2), 'the destination row');

  await startDrag(page, source, isMobile);
  const preview: Locator = page.locator('.cdk-drag-preview');
  const placeholder: Locator = list.locator('.cdk-drag-placeholder');
  await expect(preview).toBeVisible();
  const moving: Bounds = await visibleBounds(preview, 'the full row preview');
  const reserved: Bounds = await visibleBounds(placeholder, 'the reserved row');
  expect(Math.abs(moving.width - original.width)).toBeLessThanOrEqual(1);
  expect(Math.abs(moving.height - original.height)).toBeLessThanOrEqual(1);
  expect(Math.abs(reserved.height - original.height)).toBeLessThanOrEqual(1);

  await finishDrag(page, source, destination, isMobile);
  await expect(list.getByTestId('movie-label')).toHaveText([
    'Inception',
    'Interstellar',
    'The Shawshank Redemption',
    'The Dark Knight',
    'Parasite',
  ]);
  await expect(page.getByRole('menu')).toBeHidden();
});

test('OrderList menu and repeated keyboard moves retain the moved handle focus @desktop', async ({ page }): Promise<void> => {
  await page.goto('/order-list');
  const list: Locator = page.getByRole('list', { name: 'Watchlist', exact: true });
  const handle: Locator = list.getByRole('button', { name: 'Reorder Inception', exact: true });
  await handle.click();
  await page.getByRole('menuitem', { name: 'Move to top', exact: true }).click();
  await expect(handle).toBeFocused();
  await handle.press('Alt+ArrowDown');
  await handle.press('Alt+ArrowDown');
  await expect(handle).toBeFocused();
  await expect(list.getByTestId('movie-label').nth(2)).toHaveText('Inception');
});

test('OrderList supports consumer-owned draft rollback and committed order', async ({ page }): Promise<void> => {
  await page.goto('/order-list');
  const list: Locator = page.getByRole('list', { name: 'Properties', exact: true });

  await page.getByRole('button', { name: 'Sort properties', exact: true }).click();
  await list.getByRole('button', { name: 'created verschieben', exact: true }).click();
  await page.getByRole('menuitem', { name: 'An den Anfang', exact: true }).click();
  await expect(list.getByRole('listitem').first()).toContainText('created');

  await page.getByRole('button', { name: 'Cancel', exact: true }).click();
  await expect(list.getByRole('listitem').first()).toContainText('mentions');

  await page.getByRole('button', { name: 'Sort properties', exact: true }).click();
  await list.getByRole('button', { name: 'created verschieben', exact: true }).click();
  await page.getByRole('menuitem', { name: 'An den Anfang', exact: true }).click();
  await page.getByRole('button', { name: 'Save order', exact: true }).click();
  await expect(list.getByRole('listitem').first()).toContainText('created');
  await page.getByRole('button', { name: 'Sort properties', exact: true }).click();
  await expect(list.getByRole('listitem').first()).toContainText('created');
});

test('OrderList auto-scrolls the containing panel during dragging @desktop', async ({ page }): Promise<void> => {
  await page.goto('/order-list');
  await page.getByRole('button', { name: 'Sort properties', exact: true }).click();
  const panel: Locator = page.getByLabel('Property panel', { exact: true });
  const list: Locator = page.getByRole('list', { name: 'Properties', exact: true });
  const handle: Locator = list.getByRole('button', { name: 'created verschieben', exact: true });
  await handle.scrollIntoViewIfNeeded();
  await panel.evaluate((element: HTMLElement): void => element.scrollIntoView({ block: 'center' }));
  await startDrag(page, handle, false);
  const rect: Bounds = await visibleBounds(panel, 'the application scroll container');
  await page.mouse.move(rect.x + rect.width / 2, rect.y + rect.height - 4, { steps: 8 });
  try {
    await expect
      .poll(async (): Promise<number> => panel.evaluate((element: HTMLElement): number => element.scrollTop))
      .toBeGreaterThan(0);
  } finally {
    await page.mouse.up();
  }
  await expect(list.getByRole('button', { name: 'created verschieben', exact: true })).toBeFocused();
});

test('OrderList stays within a narrow panel with wrapping row content', async ({ page }): Promise<void> => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto('/order-list');
  const list: Locator = page.getByRole('list', { name: 'Watchlist', exact: true });
  const rows: Locator = list.getByRole('listitem');
  await list.scrollIntoViewIfNeeded();
  await expect(async (): Promise<void> => {
    const bounds: Bounds = await visibleBounds(list, 'the narrow list');
    expect(bounds.x).toBeGreaterThanOrEqual(0);
    expect(bounds.x + bounds.width).toBeLessThanOrEqual(360);
    for (const row of await rows.all()) {
      const fits: boolean = await row.evaluate((element: HTMLElement): boolean => element.scrollWidth <= element.clientWidth);
      expect(fits).toBe(true);
    }
  }).toPass();
});

test('OrderList cancels an outside drop without changing order or losing handle focus @desktop', async ({
  page,
}): Promise<void> => {
  await page.goto('/order-list');
  const list: Locator = page.getByRole('list', { name: 'Watchlist', exact: true });
  const handle: Locator = list.getByRole('button', { name: 'Reorder Inception', exact: true });
  await handle.scrollIntoViewIfNeeded();
  const initial: readonly string[] = await list.getByTestId('movie-label').allInnerTexts();
  const bounds: Bounds = await visibleBounds(list, 'the list before cancellation');
  await startDrag(page, handle, false);
  await page.mouse.move(bounds.x + bounds.width / 2, bounds.y - 20, { steps: 8 });
  await page.mouse.up();

  await expect(page.locator('.cdk-drag-preview')).toBeHidden();
  await expect(list.getByTestId('movie-label')).toHaveText(initial);
  await expect(handle).toBeFocused();
});

test('OrderList commits the drop without moving rows away from their destination slots @desktop', async ({
  page,
}): Promise<void> => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/order-list');
  const list: Locator = page.getByRole('list', { name: 'Workflow', exact: true });
  await list.scrollIntoViewIfNeeded();
  const rows: Locator = list.getByRole('listitem');
  const handle: Locator = list.getByRole('button', { name: 'Reorder Collect requirements', exact: true });
  const slots: readonly number[] = await rows.evaluateAll((elements: Element[]): number[] =>
    elements.map((element: Element): number => element.getBoundingClientRect().y),
  );
  const firstSlot: Bounds = await visibleBounds(rows.first(), 'the first workflow row');

  const destination: Bounds = await visibleBounds(rows.nth(2), 'the target row');
  await startDrag(page, handle, false);
  await page.mouse.move(destination.x + 20, destination.y + destination.height / 2, { steps: 12 });
  await expect
    .poll(async (): Promise<number> => Math.abs((await visibleBounds(rows.nth(1), 'the shifted row')).y - firstSlot.y))
    .toBeLessThanOrEqual(1);

  // Inspect the first committed layout; a settled assertion misses the drop jump.
  const [committed] = await Promise.all([
    list.evaluate(
      (element: HTMLElement): Promise<readonly number[]> =>
        new Promise((resolve): void => {
          const observer: MutationObserver = new MutationObserver((): void => {
            if (element.querySelector('button')?.getAttribute('aria-label') !== 'Reorder Create prototype') return;
            observer.disconnect();
            resolve(Array.from(element.children, (row: Element): number => row.getBoundingClientRect().y));
          });
          observer.observe(element, { childList: true });
        }),
    ),
    page.mouse.up(),
  ]);
  expect(committed).toHaveLength(slots.length);
  committed.forEach((position: number, index: number): void => {
    const slot: number | undefined = slots[index];
    if (slot === undefined) throw new Error('Expected a destination slot for each committed row.');
    expect(Math.abs(position - slot)).toBeLessThanOrEqual(1);
  });
});

test('OrderList shows a disabled cursor over its inert collection @css', async ({ page }): Promise<void> => {
  await page.goto('/order-list');
  const disabled: Locator = page.locator('pg-order-list-states-example sui-order-list');
  await disabled.scrollIntoViewIfNeeded();
  const bounds: Bounds = await visibleBounds(disabled, 'the disabled collection');
  const cursor: string = await page.evaluate(
    (point: { x: number; y: number }): string => {
      const target: Element | null = document.elementFromPoint(point.x, point.y);
      return target ? getComputedStyle(target).cursor : '';
    },
    { x: bounds.x + bounds.width / 2, y: bounds.y + bounds.height / 2 },
  );
  expect(cursor).toBe('not-allowed');
});
