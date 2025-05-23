import { test as base, TestInfo, TestInfoError } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { ApplyLoanPage } from '../pages/ApplyLoanPage';
import { BookAppointmentPage } from '../pages/BookAppointmentPage';
import { TestError } from '../utils/errors';
import { Logger } from '../utils/logger';

const logger = Logger.create('TestFixtures');

// Define custom fixtures
export type TestFixtures = {
  homePage: HomePage;
  applyLoanPage: ApplyLoanPage;
  bookAppointmentPage: BookAppointmentPage;
};

// Create the test object with fixtures
export const test = base.extend<TestFixtures>({
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  applyLoanPage: async ({ page }, use) => {
    await use(new ApplyLoanPage(page));
  },
  bookAppointmentPage: async ({ page }, use) => {
    await use(new BookAppointmentPage(page));
  },
});

// Add error categorization helper
const categorizeError = (error: Error): string => {
  if (error.message.includes('net::')) return 'network';
  if (error.message.includes('timeout')) return 'timeout';
  if (error.message.includes('ERR_CONNECTION')) return 'connection';
  return 'unknown';
};

// Update the createTestInfoError function
const createTestInfoError = (error: Error): TestInfoError => ({
  message: error.message,
  stack: error.stack,
  value: `[${categorizeError(error)}] ${error.toString()}`,
  cause: undefined
});

// Add global error handler
test.beforeEach(async ({ page }, testInfo) => {
    page.on('pageerror', (error: Error) => {
        logger.error('Page error occurred', error);
        testInfo.error = createTestInfoError(error);
    });

    page.on('console', (msg) => {
        if (msg.type() === 'error') {
            logger.error('Console error', undefined, { message: msg.text() });
        }
    });
});

// Add error retry logic
test.afterEach(async ({ }, testInfo) => {
    if (testInfo.status === 'failed') {
        console.log(`Test "${testInfo.title}" failed. Error:`, testInfo.error);
        
         // Check if we should retry (assuming max 2 retries)
         if (testInfo.retry < 2) {
            console.log(`Retrying test "${testInfo.title}" (Attempt ${testInfo.retry + 1}/2)`);
            // Note: Don't set testInfo.retry manually - Playwright handles this
        }
    }
});
