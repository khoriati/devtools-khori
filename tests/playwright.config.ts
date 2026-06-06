import { defineConfig, devices } from '@playwright/test';

const baseURL = process.env.BASE_URL || 'https://dev.tools.khori.com.br';

export default defineConfig({
  testDir: '.',
  timeout: 30000,
  fullyParallel: true,
  reporter: [['list'], ['html', { open: 'never', outputFolder: 'playwright-report' }]],
  use: {
    baseURL,
    trace: 'on-first-retry',
    ignoreHTTPSErrors: true,
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
  ],
});
