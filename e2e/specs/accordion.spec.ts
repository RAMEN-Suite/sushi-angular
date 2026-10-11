import { expect, JSHandle, Locator, Page, test } from '@playwright/test';

interface AccordionTransition {
  readonly animations: readonly Animation[];
  readonly panel: HTMLElement;
}

async function pauseAccordionTransition(element: HTMLElement): Promise<AccordionTransition> {
  const panel: HTMLElement | null = document.getElementById(element.getAttribute('aria-controls') ?? '');
  const host: Element | null = element.closest('sui-accordion');
  if (!panel || !host) throw new Error('Expected an Accordion trigger with its panel.');

  // Capture during DOM updates, before a delayed transition event can arrive after completion.
  return new Promise<AccordionTransition>((resolve, reject): void => {
    const observer: MutationObserver = new MutationObserver((): void => {
      const running: Animation[] = host.getAnimations({ subtree: true }).filter((animation: Animation): boolean => {
        const target: Element | null = (animation.effect as KeyframeEffect).target;
        return target instanceof Element && (target.contains(panel) || panel.contains(target));
      });
      if (
        !running.some(
          (animation: Animation): boolean =>
            animation instanceof CSSTransition && animation.transitionProperty === 'grid-template-rows',
        )
      )
        return;
      running.forEach((animation: Animation): void => animation.pause());
      clearTimeout(timer);
      observer.disconnect();
      resolve({ animations: running, panel });
    });
    const timer: number = window.setTimeout((): void => {
      observer.disconnect();
      reject(new Error('Expected the Accordion height transition to run.'));
    }, 5_000);
    observer.observe(host, { attributes: true, subtree: true, attributeFilter: ['class', 'aria-expanded'] });
    element.click();
  });
}

async function sampleTransitionHeights(trigger: Locator): Promise<readonly number[]> {
  const transition: JSHandle<AccordionTransition> = await trigger.evaluateHandle(pauseAccordionTransition);
  try {
    return await transition.evaluate(async ({ animations, panel }: AccordionTransition): Promise<readonly number[]> => {
      await Promise.all(animations.map((animation: Animation): Promise<Animation> => animation.ready));
      const duration: number = Math.max(
        ...animations.map((animation: Animation): number => Number(animation.effect?.getComputedTiming().endTime ?? 0)),
      );
      if (!Number.isFinite(duration) || duration <= 0) throw new Error('Expected a finite Accordion transition duration.');

      const heights: number[] = [];
      for (let step: number = 1; step < 20; step += 1) {
        animations.forEach((animation: Animation): void => {
          animation.currentTime = (duration * step) / 20;
        });
        // Seeking updates timing immediately; read geometry after the browser applies it for rendering.
        await new Promise<number>((resolve): number => requestAnimationFrame(resolve));
        heights.push(panel.getBoundingClientRect().height);
      }
      animations.forEach((animation: Animation): void => animation.finish());
      return heights;
    });
  } finally {
    await transition.dispose();
  }
}

test('Accordion moves focus between triggers and keeps one item expanded', async ({ page }: { page: Page }): Promise<void> => {
  await page.goto('/accordion');
  const shipping: Locator = page.getByRole('button', { name: 'When will my order arrive?' });
  const returns: Locator = page.getByRole('button', { name: 'How do returns work?' });

  await expect(shipping).toHaveAttribute('aria-expanded', 'true');

  await shipping.focus();
  await shipping.press('ArrowDown');

  await expect(returns).toBeFocused();

  await returns.press('Enter');

  await expect(returns).toHaveAttribute('aria-expanded', 'true');
  await expect(shipping).toHaveAttribute('aria-expanded', 'false');
});

test('preserved Accordion content expands and collapses without height jumps', async ({
  page,
}: {
  page: Page;
}): Promise<void> => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/accordion');
  const trigger: Locator = page.getByRole('button', { name: 'When will my order arrive?' });
  const panel: Locator = page.getByRole('region', { name: 'When will my order arrive?', includeHidden: true });
  const expanded: number = await panel.evaluate((element: HTMLElement): number => element.getBoundingClientRect().height);
  const closing: readonly number[] = [expanded, ...(await sampleTransitionHeights(trigger)), 0];

  expect(
    Math.max(...closing.slice(1).map((height: number, index: number): number => Math.abs(height - closing[index]))),
  ).toBeLessThan(expanded * 0.3);
  expect(
    closing.some((height: number): boolean => height > 0 && height < expanded - 1),
    `Closing heights: ${JSON.stringify(closing)}; expanded height: ${expanded}`,
  ).toBe(true);
  await expect(panel).toHaveCSS('height', '0px');

  const opening: readonly number[] = [0, ...(await sampleTransitionHeights(trigger)), expanded];

  expect(
    Math.max(...opening.slice(1).map((height: number, index: number): number => Math.abs(height - opening[index]))),
  ).toBeLessThan(expanded * 0.3);
  expect(
    opening.some((height: number): boolean => height > 0 && height < expanded - 1),
    `Opening heights: ${JSON.stringify(opening)}; expanded height: ${expanded}`,
  ).toBe(true);
  await expect(async (): Promise<void> => {
    const height: number = await panel.evaluate((element: HTMLElement): number => element.getBoundingClientRect().height);
    expect(height).toBeCloseTo(expanded, 0);
  }).toPass({ timeout: 5_000 });
});
