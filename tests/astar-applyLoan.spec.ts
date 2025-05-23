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

function getRandomDateOfBirth(): string {
  const year = getRandomNumber(1970, 2000);
  const month = getRandomNumber(1, 12).toString().padStart(2, '0');
  const day = getRandomNumber(1, 28).toString().padStart(2, '0'); // Keep day simple to avoid month-specific logic
  return `${day}/${month}/${year}`;
}

function getRandomPastDate(): string {
  const year = getRandomNumber(2018, 2022); // For start dates like employment
  const month = getRandomNumber(1, 12).toString().padStart(2, '0');
  const day = getRandomNumber(1, 28).toString().padStart(2, '0');
  return `${day}/${month}/${year}`;
}

test.describe('Apply for Home Loan with Random Data and Assertions', () => {
  test('should navigate the "I want to buy a home" flow and stop at OTP', async ({ page }) => {
    await page.goto('https://astarfinancial.com.au/apply-now');
    await expect(page).toHaveTitle(/Astar Financial - Apply Now/); // Updated assertion for actual title

    // What type of loan do you need?
    await expect(page.getByText('I want to buy a home')).toBeVisible();
    await page.getByText('I want to buy a home').click();
    await page.getByRole('button', { name: 'Next' }).click();
    await expect(page.getByText('Have you found a property?')).toBeVisible(); // Assertion for next section

    // Have you found a property?
    await page.locator('label').filter({ hasText: 'No' }).click();
    await page.getByRole('button', { name: 'Next' }).click();
    await expect(page.getByText('What type of property are you purchasing?')).toBeVisible();

    // What type of property are you purchasing?
    await page.getByText('An Investment Property').click();
    await page.getByRole('button', { name: 'Next' }).click();
    await expect(page.getByText('Is this an existing property or off-plan?')).toBeVisible();

    // Is this an existing property or off-plan?
    await page.getByText('Existing Property').click();
    await page.getByRole('button', { name: 'Next' }).click();
    await expect(page.getByText('Tell us about your property')).toBeVisible();

    // Tell us about your property
    const propertyValue = getRandomNumber(500000, 2000000).toString();
    const loanAmount = getRandomNumber(200000, propertyValue as any * 0.8).toString(); // Example: 80% LVR
    await page.locator('div:nth-child(2) > div > div > .form-control').first().fill(propertyValue);
    await page.locator('div:nth-child(3) > div > div > .form-control').fill(loanAmount);
    await page.getByRole('button', { name: 'Next' }).click();
    await expect(page.getByText('About You', { exact: true })).toBeVisible();


    // About You - Marital Status
    await page.locator('label').filter({ hasText: 'Single' }).click();
    await page.getByRole('button', { name: 'Next' }).click();
    await expect(page.getByText('Tell us more about you')).toBeVisible();

    // Tell us more about you
    await page.locator('.date-input').fill(getRandomDateOfBirth());
    await page.getByText('Male', { exact: true }).click();
    await page.locator('input[name="dependents"]').fill(getRandomNumber(0, 5).toString());
    await page.getByRole('button', { name: 'Next' }).click();
    await expect(page.getByText('Your Contact Details')).toBeVisible();

    // Your Contact Details
    await page.getByPlaceholder('First Name').fill(getRandomString(8));
    await page.getByPlaceholder('Last Name').fill(getRandomString(10));
    await page.getByPlaceholder('Email Address').fill(getRandomEmail());
    await page.getByPlaceholder('Mobile Number').fill(getRandomMobile());
    await page.getByRole('button', { name: 'Next' }).click();
    await expect(page.getByText('Your Employment Details')).toBeVisible();

    // Your Employment Details
    await page.getByText('Employed').click();
    await page.getByRole('button', { name: 'Next' }).click();
    await expect(page.getByText('Tell us about your employment')).toBeVisible();

    // Tell us about your employment
    await page.getByPlaceholder('Company Name').fill(getRandomString(10) + ' Pty Ltd');
    await page.getByPlaceholder('Job Title').fill(getRandomString(8));
    await page.locator('input[name="startDate"]').fill(getRandomPastDate());
    await page.getByRole('button', { name: 'Next' }).click();
    await expect(page.getByText('Your Income Details')).toBeVisible();

    // Your Income Details
    await page.locator('input[name="annualBaseSalary"]').fill(getRandomNumber(60000, 250000).toString());
    await page.getByRole('button', { name: 'Next' }).click();
    await expect(page.getByText('Your Assets')).toBeVisible();

    // Your Assets
    await page.locator('label').filter({ hasText: 'No' }).click(); // Assuming no for simplicity
    await page.getByRole('button', { name: 'Next' }).click();
    await expect(page.getByText('Your Liabilities')).toBeVisible();

    // Your Liabilities
    await page.locator('label').filter({ hasText: 'No' }).click(); // Assuming no for simplicity
    await page.getByRole('button', { name: 'Next' }).click();
    await expect(page.getByText('Your Expenses')).toBeVisible();

    // Your Expenses
    await page.locator('label').filter({ hasText: 'No' }).click(); // Assuming no for simplicity
    await page.getByRole('button', { name: 'Next' }).click();

    // Expect to be on the OTP verification page or a page leading to it.
    // This assertion might need adjustment based on the actual content of the OTP page.
    // For now, we assume a button or text indicating "Send Code", "Verify OTP", or similar is present.
    await expect(page.getByRole('button', { name: /Send Code|Verify|Submit/i })).toBeVisible({ timeout: 10000 }); // Increased timeout for page load
    
    // Test stops here, before interacting with OTP.
    console.log('Reached OTP verification step. Test will stop here.');
  });
});
