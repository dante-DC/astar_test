import { test, expect, BrowserContext, chromium } from '@playwright/test';
import { RefinanceLoanPage } from '../pages/RefinanceLoanPage';
import { getRandomString, getRandomNumber, getRandomEmail, getRandomMobile } from '../utils/dataGenerators';

test.describe('Refinance Home Loan Flow', () => {
  let context: BrowserContext;

  test.beforeEach(async ({ }) => {
    // Launch browser with more realistic settings
    const browser = await chromium.launch({
      headless: false, // Run in non-headless mode for better stability
      args: [
        '--disable-blink-features=AutomationControlled',
        '--disable-features=IsolateOrigins,site-per-process'
      ]
    });

    // Create a context with more realistic browser settings
    context = await browser.newContext({
      ignoreHTTPSErrors: true,
      bypassCSP: true,
      viewport: { width: 1280, height: 720 },
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36',
      permissions: ['geolocation'],
      serviceWorkers: 'allow',
      // Add common headers
      extraHTTPHeaders: {
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8'
      }
    });
  });

  test.afterEach(async () => {
    if (context) {
      await context.close();
    }
  });

  test('should complete refinance application up to OTP verification', async () => {
    const page = await context.newPage();
    const refinancePage = new RefinanceLoanPage(page);
    
    try {
      console.log('Starting refinance application test...');
      
      // Navigate to refinance page with retry logic
      let retries = 3;
      while (retries > 0) {
        try {
          await refinancePage.goto();
          // Add additional wait for page stability
          await page.waitForLoadState('networkidle').catch(() => {});
          await page.waitForTimeout(2000); // Give extra time for JS to initialize
          break;
        } catch (error) {
          console.log(`Navigation attempt failed (${retries} retries left):`, error);
          retries--;
          if (retries === 0) throw error;
          await page.waitForTimeout(5000); // Increased wait time between retries
        }
      }
      
      // Start refinance application
      await test.step('Start application', async () => {
        await refinancePage.startRefinanceApplication();
      });
      
      // Fill loan details
      await test.step('Fill loan details', async () => {
        const loanAmount = getRandomNumber(200000, 1500000).toString();
        await refinancePage.fillLoanAmount(loanAmount);
        
        const propertyValue = getRandomNumber(300000, 2000000).toString();
        await refinancePage.fillPropertyValue(propertyValue);
      });
      
      // Answer qualification questions
      await test.step('Answer qualification questions', async () => {
        await refinancePage.selectRefinanceSituation('Just exploring options');
        await refinancePage.selectFirstHomeBuyer(false);
        await refinancePage.selectTimeline('-6 Months');
        await refinancePage.selectCreditHistory('Excellent');
        await refinancePage.selectIncomeSource('employee');
      });
      
      // Fill personal details
      await test.step('Fill personal details', async () => {
        await refinancePage.fillPersonalDetails(
          getRandomString(8),
          getRandomString(10),
          getRandomEmail(),
          getRandomMobile()
        );
      });
      
      // Verify OTP screen
      await test.step('Verify OTP screen', async () => {
        await refinancePage.verifyOTPScreen();
      });
      
      console.log('Test completed successfully');
      
    } catch (error) {
      console.error('Test failed:', error);
      
      // Take a screenshot and save page content for debugging
      try {
        if (!page.isClosed()) {
          const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
          await page.screenshot({ 
            path: `test-results/refinance-error-${timestamp}.png`, 
            fullPage: true 
          });
          
          const html = await page.content();
          await require('fs').promises.writeFile(
            `test-results/refinance-error-${timestamp}.html`,
            html
          );
        }
      } catch (screenshotError) {
        console.error('Failed to save error artifacts:', screenshotError);
      }
      
      throw error;
    }
  });
});
