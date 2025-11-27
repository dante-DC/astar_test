import { test, expect } from '@playwright/test';

// Helper functions for random data generation
function getRandomString(length: number): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function getRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomEmail(): string {
  return `${getRandomString(10)}@example.com`;
}

function getRandomMobile(): string {
  return `04${Math.floor(Math.random() * 100000000).toString().padStart(8, '0')}`;
}

test.describe('Refinance Home Loan Flow', () => {
  test('should complete refinance application up to OTP verification', async ({ page }) => {
    // Navigate directly to the refinance basics page
    // This page already has the refinance form pre-loaded
    await page.goto('https://astarfinancial.com.au/home-loans/basics/refinancing');
    await page.waitForTimeout(1000);
    
    // Step 1: Fill in current loan balance
    await test.step('Fill current loan balance', async () => {
      const loanBalanceField = page.getByRole('textbox', { name: 'Loan Balance' });
      await loanBalanceField.fill(getRandomNumber(200000, 1500000).toString());
      await page.getByRole('button', { name: 'Next' }).click();
    });
    
    // Step 2: Fill in interest rate and rate type
    await test.step('Fill interest rate and rate type', async () => {
      await page.waitForTimeout(800);
      const interestRateField = page.getByRole('textbox', { name: 'Interest Rate' });
      await interestRateField.fill((getRandomNumber(35, 75) / 10).toString());
      // "No" is typically pre-selected for "fixed rate", just click Next
      await page.getByRole('button', { name: 'Next' }).click();
    });
    
    // Step 3: Fill in current lender
    await test.step('Fill in current lender', async () => {
      await page.waitForTimeout(800);
      const lenderField = page.getByRole('textbox', { name: 'Search for your lender' });
      await lenderField.fill('Commonwealth Bank');
      await page.getByRole('button', { name: 'Next' }).click();
    });
    
    // Step 4: Fill in property worth
    await test.step('Fill property worth', async () => {
      await page.waitForTimeout(800);
      const propertyWorthField = page.getByRole('textbox', { name: '$' });
      await propertyWorthField.fill(getRandomNumber(300000, 2000000).toString());
      await page.getByRole('button', { name: 'Next' }).click();
    });
    
    // Step 5: Select refinancing goal - "Decrease repayments"
    await test.step('Select refinancing goal', async () => {
      await page.waitForTimeout(1000);
      const decreaseBtn = page.getByRole('button', { name: 'Decrease repayments' });
      await decreaseBtn.click();
    });
    
    // Step 6: Select refinance timeline
    await test.step('Select refinance timeline', async () => {
      await page.waitForTimeout(800);
      const timelineBtn = page.getByRole('button', { name: /-6 Months/ });
      await timelineBtn.click();
    });
    
    // Step 7: Select property usage
    await test.step('Select property usage', async () => {
      await page.waitForTimeout(800);
      const usageBtn = page.getByRole('button', { name: 'I will live there' });
      await usageBtn.click();
    });
    
    // Step 8: Select credit history
    await test.step('Select credit history', async () => {
      await page.waitForTimeout(800);
      const creditBtn = page.getByRole('button', { name: 'Excellent' });
      await creditBtn.click();
    });
    
    // Step 9: Select income type
    await test.step('Select income type', async () => {
      await page.waitForTimeout(800);
      const incomeBtn = page.getByRole('button', { name: /I'm an employee/ });
      await incomeBtn.click();
    });
    
    // Step 10: Fill personal details
    await test.step('Fill personal details', async () => {
      await page.waitForTimeout(1000);
      
      const fullNameField = page.getByRole('textbox', { name: 'Full name' });
      await fullNameField.fill(getRandomString(8) + ' ' + getRandomString(8));
      
      const emailField = page.getByRole('textbox', { name: 'Email Address' });
      await emailField.fill(getRandomEmail());
      
      const mobileField = page.getByRole('textbox', { name: 'Mobile number' });
      await mobileField.fill(getRandomMobile());
      
      // Submit the application
      const assessBtn = page.getByRole('button', { name: 'Assess my options' });
      await assessBtn.click();
    });
    
    // Step 11: Verify OTP verification screen
    await test.step('Verify OTP verification', async () => {
      await page.waitForTimeout(2000);
      
      // Check for OTP-related elements
      const otpHeading = page.getByRole('heading', { name: /SMS Verification|Verification/i });
      const otpInput = page.getByRole('textbox', { name: /OTP|Code/i });
      
      await expect(otpHeading).toBeVisible();
      await expect(otpInput).toBeVisible();
      
      console.log('✅ Successfully reached OTP verification step');
    });
  });
});
