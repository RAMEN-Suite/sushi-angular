import { defineConfig, devices } from '@playwright/test';

const isCi: boolean = Boolean(process.env['CI']);

export default defineConfig({
  testDir: './specs',
  fullyParallel: true,
  forbidOnly: isCi,
  retries: isCi ? 2 : 0,
  workers: isCi ? 1 : undefined,
  reporter: [['list'], ['html', { outputFolder: '../playwright-report', open: 'never' }]],
  use: {
    baseURL: 'http://127.0.0.1:4201',
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'npm run build:playground && npm run preview:playground',
    url: 'http://127.0.0.1:4201',
    reuseExistingServer: !isCi,
    timeout: 120_000,
  },
});
