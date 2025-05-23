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
    await expect(page).toHaveTitle("Apply Now - Astar Financial"); // Updated assertion for actual title
    // What type of loan do you need?
    await expect(page.getByText('I want to buy a home')).toBeVisible();
    await page.getByText('I want to buy a home').click();
    await expect(page.getByText('What is your expected purchase price?')).toBeVisible();
    //What is your expected purchase price?
    const purchasePrice = getRandomNumber(500000, 2000000).toString();
    await page.getByRole('textbox', { name: 'Expected Purchase' }).fill(purchasePrice);
    await page.getByRole('button', { name: 'Next' }).click();
    await expect(page.getByText('How much deposit do you have?')).toBeVisible(); // Assertion for next section
    //How much deposit do you have?
    const deposit = purchasePrice as any * 0.25; // Example: 25% deposit
    await page.getByRole('textbox', { name: 'Deposits' }).fill(deposit.toString());
    await page.getByRole('button', { name: 'Next' }).click();
    await expect(page.getByRole('heading', { name: 'What best describes your home' })).toBeVisible(); // Assertion for next section
    //What best describes your home buying situation?
    await page.getByRole('button', { name: 'Just exploring options' }).click();
    await expect(page.getByRole('heading', { name: 'Are you a first home buyer?' })).toBeVisible(); // Assertion for next section
    //Are you a first home buyer?
    await page.getByRole('button', { name: 'Yes' }).click();
    await expect(page.getByRole('heading', { name: 'How soon are you looking to' })).toBeVisible(); // Assertion for next section
    //How soon are you looking to buy?
    await page.getByRole('button', { name: '-6 Months' }).click();
    await expect(page.getByRole('heading', { name: 'What kind of property are you' })).toBeVisible(); // Assertion for next section
    //What kind of property are you looking to buy?
    await page.getByRole('button', { name: 'Established home' }).click();
    await expect(page.getByRole('heading', { name: 'How will this property be' })).toBeVisible();
    //How will this property be used?
    await page.getByRole('button', { name: 'I will live there' }).click();
    await expect(page.getByRole('heading', { name: 'How’s your credit history?' })).toBeVisible();
    //How’s your credit history?
    await page.getByRole('button', { name: 'Excellent' }).click();
    await expect(page.getByRole('heading', { name: 'How do you earn your income?' })).toBeVisible();
    //How do you earn your income?
    await page.getByRole('button', { name: 'I\'m an employee' }).click();
    await expect(page.getByRole('heading', { name: 'Your home loan options await!' })).toBeVisible();
    //Your home loan options await!
    await page.getByPlaceholder('First Name').fill(getRandomString(8));
    await page.getByPlaceholder('Last Name').fill(getRandomString(10));
    await page.getByPlaceholder('Email Address').fill(getRandomEmail());
    await page.getByPlaceholder('Mobile Number').fill(getRandomMobile());
    await page.getByRole('button', { name: 'Assess my options' }).click();
    await expect(page.getByRole('heading', { name: 'SMS Verification!' })).toBeVisible();// Expect to be on the OTP verification page or a page leading to it
  
    // Test stops here, before interacting with OTP
    console.log('Reached OTP verification step. Test will stop here.');
  });
});
