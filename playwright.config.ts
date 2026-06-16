import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests', // папка со всеми тестами (UI + API)
  timeout: 30000,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html'],
    ['list'],
    ['json', { outputFile: 'test-results.json' }]
  ],
  use: {
    baseURL: 'http://localhost:3000',
    headless: true,
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'UI',
      testDir: './tests/ui',
      use: { baseURL: 'http://localhost:3000' },
    },
    {
      name: 'API',
      testDir: './tests/api',
      use: { baseURL: 'https://jsonplaceholder.typicode.com' },
    },
  ],
});
