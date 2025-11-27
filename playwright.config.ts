import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: 'tests',
  use: {
    browserName: 'chromium',
    headless: false,
  },
  reporter: [['html', { open: 'never', outputFolder: 'playwright-report' }]],
});