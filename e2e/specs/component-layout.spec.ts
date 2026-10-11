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

async function sampleToggle(trigger: Locator): Promise<readonly number[]> {
  return trigger.evaluate(async (element: HTMLElement): Promise<readonly number[]> => {
    const panel: HTMLElement | null = document.getElementById(element.getAttribute('aria-controls') ?? '');
    const host: Element | null = element.closest('sui-accordion');
    if (!panel || !host) throw new Error('Expected an Accordion trigger with its panel.');
    // Capture and pause at transitionrun so runner delays cannot miss the animation window.
    const animations: Animation[] = await new Promise<Animation[]>((resolve, reject): void => {
      const onTransitionRun: (event: Event) => void = (event: Event): void => {
        if (!(event.target instanceof Element) || !event.target.contains(panel)) return;
        if ((event as TransitionEvent).propertyName !== 'grid-template-rows') return;
        const running: Animation[] = host.getAnimations({ subtree: true }).filter((animation: Animation): boolean => {
          const effectTarget: Element | null = (animation.effect as KeyframeEffect).target;
          return effectTarget instanceof Element && (effectTarget.contains(panel) || panel.contains(effectTarget));
        });
        running.forEach((animation: Animation): void => animation.pause());
        clearTimeout(timer);
        host.removeEventListener('transitionrun', onTransitionRun);
        resolve(running);
      };
      const timer: number = window.setTimeout((): void => {
        host.removeEventListener('transitionrun', onTransitionRun);
        reject(new Error('Expected the Accordion height transition to run.'));
      }, 5_000);
      host.addEventListener('transitionrun', onTransitionRun);
      element.click();
    });
    const duration: number = Math.max(
      ...animations.map((animation: Animation): number => Number(animation.effect?.getComputedTiming().endTime ?? 0)),
    );
    const heights: number[] = Array.from({ length: 19 }, (_value: unknown, index: number): number => (index + 1) / 20).map(
      (progress: number): number => {
        animations.forEach((animation: Animation): void => {
          animation.currentTime = duration * progress;
        });
        return panel.getBoundingClientRect().height;
      },
    );
    animations.forEach((animation: Animation): void => animation.finish());
    return heights;
  });
}

test('preserved Accordion content collapses and expands through intermediate heights', async ({
  page,
}: {
  page: Page;
}): Promise<void> => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/accordion');
  const trigger: Locator = page.getByRole('button', { name: 'When will my order arrive?' });
  const panel: Locator = page.getByRole('region', { name: 'When will my order arrive?', includeHidden: true });
  const expanded: number = await panel.evaluate((element: HTMLElement): number => element.getBoundingClientRect().height);
  const closing: readonly number[] = await sampleToggle(trigger);
  expect(
    Math.max(...closing.slice(1).map((height: number, index: number): number => Math.abs(height - closing[index]))),
  ).toBeLessThan(expanded * 0.3);
  expect(closing.some((height: number): boolean => height > 0 && height < expanded - 1)).toBe(true);
  await expect(panel).toHaveCSS('height', '0px');
  const opening: readonly number[] = await sampleToggle(trigger);
  expect(
    Math.max(...opening.slice(1).map((height: number, index: number): number => Math.abs(height - opening[index]))),
  ).toBeLessThan(expanded * 0.3);
  expect(opening.some((height: number): boolean => height > 0 && height < expanded - 1)).toBe(true);
  await expect(async (): Promise<void> => {
    const height: number = await panel.evaluate((element: HTMLElement): number => element.getBoundingClientRect().height);
    expect(height).toBeCloseTo(expanded, 0);
  }).toPass({ timeout: 5_000 });
});
