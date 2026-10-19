import { defineConfig, devices } from '@playwright/test';

const isCi: boolean = Boolean(process.env['CI']);

export default defineConfig({
  testDir: './specs',
  failOnFlakyTests: isCi,
  forbidOnly: isCi,
  retries: isCi ? 2 : 0,
  workers: 1,
  reporter: [['list'], ['html', { outputFolder: '../playwright-report', open: 'never' }]],
  use: {
    baseURL: 'http://127.0.0.1:4201',
    reducedMotion: 'reduce',
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
      grepInvert: /@css\b/,
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      grepInvert: /@css\b/,
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'mobile-webkit',
      grepInvert: /@(css|desktop)\b/,
      testMatch: [
        '**/responsive-layout.spec.ts',
        '**/mobile-overlay.spec.ts',
        '**/dialog-position.spec.ts',
        '**/dialog-content-resize.spec.ts',
        '**/select-dialog.spec.ts',
        '**/order-list.spec.ts',
      ],
      use: { ...devices['iPhone 13'] },
    },
  ],
  webServer: {
    command: 'npm run preview:playground',
    url: 'http://127.0.0.1:4201',
    reuseExistingServer: !isCi,
    timeout: 120_000,
  },
});
