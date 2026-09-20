import { defineConfig, devices } from '@playwright/test';

const isCi: boolean = Boolean(process.env['CI']);

export default defineConfig({
  testDir: './specs',
  forbidOnly: isCi,
  retries: isCi ? 2 : 0,
  workers: 1,
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
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
  webServer: {
    command: 'npm run preview:playground',
    url: 'http://127.0.0.1:4201',
    reuseExistingServer: !isCi,
    timeout: 120_000,
  },
});
