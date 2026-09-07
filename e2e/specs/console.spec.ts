import { ConsoleMessage, Page, test } from '@playwright/test';
import { apiNavigation, NavigationItem } from '../../playground/src/app/app.navigation';

const playgroundPaths: readonly string[] = [
  '/',
  '/icon',
  ...apiNavigation.flatMap((item: NavigationItem): readonly string[] => [item.path, `${item.path}/api`, `${item.path}/styling`]),
];

test('playground pages do not report browser errors', async ({ page }: { page: Page }): Promise<void> => {
  test.setTimeout(120_000);

  const errors: string[] = [];
  page.on('console', (message: ConsoleMessage): void => {
    if (message.type() !== 'error') return;
    errors.push(`${page.url()}: ${message.text()}`);
  });
  page.on('pageerror', (error: Error): void => {
    errors.push(`${page.url()}: ${error.message}`);
  });

  for (const path of playgroundPaths) {
    await page.goto(path);
    await page.locator('pg-root').waitFor({ state: 'visible' });
  }

  if (errors.length > 0) throw new Error(`Playground console errors:\n${errors.join('\n')}`);
});
