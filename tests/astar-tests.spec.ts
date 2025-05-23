import { test as baseTest, expect, Page, Locator } from '@playwright/test';
import { config } from '../config/config';
import { getRandomEmail, getRandomMobile, getRandomString,getRandomNumber } from '../utils/dataGenerators';
import path from 'path';
import fs from 'fs';

// Custom Test Fixtures
type TestFixtures = {
  homePage: HomePage;
  applyLoanPage: ApplyLoanPage;
  bookAppointmentPage: BookAppointmentPage;
};

const test = baseTest.extend<TestFixtures>({
  homePage: async ({ page }, use) => {
    const homePage = new HomePage(page);
    await use(homePage);
  },
  applyLoanPage: async ({ page }, use) => {
    const applyLoanPage = new ApplyLoanPage(page);
    await use(applyLoanPage);
  },
  bookAppointmentPage: async ({ page }, use) => {
    const bookAppointmentPage = new BookAppointmentPage(page);
    await use(bookAppointmentPage);
  },
});

// Page Object Model for HomePage
class HomePage {
  constructor(private page: Page) {}

  async navigate() {
    await this.page.goto(config.baseUrl, { timeout: config.defaultTimeout });
    await expect(this.page).toHaveTitle(/Astar Financial/i);
    console.log(`Navigated to homepage: ${config.baseUrl}`);
  }

  async getLinkStructure(): Promise<Record<string, string>> {
    const filePath = path.resolve(config.dirPath, '../data/linkStructure.json');
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  }
  // Function to find an interactable link on the page
  async  findInteractableLink(page: Page, href: string): Promise<Locator | null> {
    const baseSelector = `a[href="${href}"]`;
    const locators = await page.locator(baseSelector).all();

    for (const locator of locators) {
        try {
            await locator.scrollIntoViewIfNeeded(); // Scroll to the element if needed
            if (await locator.isVisible() && await locator.isEnabled()) {
                return locator; // Return the first interactable link
            }
        } catch (error) {
            console.error(`Error finding interactable link for href: ${href}`, error);
        }
    }
    return null;
}

  async verifyLinks() {
    const linkStructure = await this.getLinkStructure();
    for (const [childLink, parentDropdown] of Object.entries(linkStructure)) {
      console.log(`Testing child link: ${childLink}, Parent dropdown: ${parentDropdown}`);

      if (parentDropdown) {
       
        const parentLocator = await this.findInteractableLink(this.page, parentDropdown);
        if (parentLocator) { // Check if parentLocator is not null
              console.log(`Hovering over parent dropdown: ${parentDropdown}`);
              await parentLocator.hover();
          } else {
              console.warn(`Parent dropdown not found or not interactable: ${parentDropdown}`);
              continue;
          }
      }

      // Verify the child link
      const childLocator = await this.findInteractableLink(this.page, childLink);
      if (!childLocator) {
          console.warn(`Child link not interactable: ${childLink}`);
          continue;
      }
      if (childLink !== '#') {
          console.log(`Child link is interactable: ${childLink}`);
          const startTime = Date.now();
          try {
              await Promise.all([
                  this.page.waitForURL(childLink, { timeout: 20000, waitUntil: 'domcontentloaded' }), // Wait for the URL to change
                  childLocator.click({ force: true }), // Click the child link
              ]);

              await this.page.waitForTimeout(500); // Add a 500ms wait after the click

              const endTime = Date.now();
              console.log(`Response time for ${childLink}: ${endTime - startTime}ms`);

              const title = await this.page.title();
              expect(title).not.toBe('');
              console.log(`Page title for ${childLink}: ${title}`);
          } catch (error) {
              console.error(`Error testing link ${childLink}: ${error.message}`);
          } finally {
              if (this.page.url() !== config.baseUrl) {
                  try {
                      await this.page.goto(config.baseUrl, { timeout: 20000, waitUntil: 'domcontentloaded' }); // Revert to waitUntil: 'domcontentloaded'
                  } catch (error) {
                      console.error(`Failed to navigate back to ${config.baseUrl}: ${error.message}`);
                      return;
                  }
              }
          }
      }
    }
  }
}

class ApplyLoanPage {
  constructor(private page: Page) {}

  // Navigate to the loan application page
  async navigate() {
    console.log('Navigating to the loan application page...');
    await this.page.goto('https://astarfinancial.com.au/apply-now');
    await expect(this.page).toHaveTitle(/Apply Now/i); // Verify the page title
    console.log('Successfully navigated to the loan application page.');
  }

  // Fill out the loan application form
  async fillLoanApplication() {
    console.log('Starting to fill out the loan application form...');
    
    console.log('Selecting "I want to buy a home"...');
    await this.page.getByText('I want to buy a home').click();

    console.log('Filling expected purchase price...');
    await this.page.getByRole('textbox', { name: 'Expected Purchase' }).fill(getRandomNumber(500000, 2000000).toString());
    await this.page.getByRole('button', { name: 'Next' }).click();

    console.log('Filling deposit amount...');
    await this.page.getByRole('textbox', { name: 'Deposits' }).fill(getRandomNumber(100000, 500000).toString());
    await this.page.getByRole('button', { name: 'Next' }).click();

    console.log('Selecting "Just exploring options"...');
    await this.page.getByRole('button', { name: 'Just exploring options' }).click();

    console.log('Answering "Yes" to the question...');
    await this.page.getByRole('button', { name: 'Yes' }).click();

    console.log('Selecting "-6 Months" for the duration...');
    await this.page.getByRole('button', { name: '-6 Months' }).click();

    console.log('Selecting "Established home"...');
    await this.page.getByRole('button', { name: 'Established home' }).click();

    console.log('Selecting "I will live there"...');
    await this.page.getByRole('button', { name: 'I will live there' }).click();

    console.log('Selecting "Excellent" credit rating...');
    await this.page.getByRole('button', { name: 'Excellent' }).click();

    console.log('Selecting "I\'m an employee"...');
    await this.page.getByRole('button', { name: "I'm an employee" }).click();

    console.log('Filling personal details...');
    await this.page.getByPlaceholder('First Name').fill(getRandomString(8));
    await this.page.getByPlaceholder('Last Name').fill(getRandomString(10));
    await this.page.getByPlaceholder('Email Address').fill(getRandomEmail());
    await this.page.getByPlaceholder('Mobile Number').fill(getRandomMobile());

    console.log('Submitting the loan application...');
    await this.page.getByRole('button', { name: 'Assess my options' }).click();

    console.log('Verifying SMS verification step...');
    await expect(this.page.getByRole('heading', { name: 'SMS Verification!' })).toBeVisible();
    console.log('Loan application form successfully submitted and SMS verification step reached.');
  }
}

class BookAppointmentPage {
  constructor(private page: Page) {}

  // Navigate to the appointment booking page
  async navigate() {
    console.log('Navigating to the appointment booking page...');
    await this.page.goto('https://astarfinancial.com.au/book-appointment');
    await expect(this.page).toHaveTitle(/Book Appointment/i); // Verify the page title
    console.log('Successfully navigated to the appointment booking page.');
  }

  // Book an appointment
  async bookAppointment() {
    console.log('Starting to book an appointment...');

    console.log('Filling in the appointment date...');
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const formattedDate = tomorrow.toISOString().split('T')[0]; // Format as YYYY-MM-DD
    await this.page.locator('input[type="date"]').fill(formattedDate); // Select a date
    console.log('Appointment date filled.');

    console.log('Selecting a time slot...');
    await this.page.getByLabel('Select Time Slot').selectOption({ index: 1 }); // Select a time slot
    console.log('Time slot selected.');

    console.log('Selecting a loan type...');
    await this.page.getByLabel('Select Loan Type').selectOption({ index: 1 }); // Select a loan type
    console.log('Loan type selected.');

    console.log('Filling in the mobile phone number...');
    await this.page.getByRole('textbox', { name: '+' }).fill(getRandomMobile()); // Fill in the mobile number
    console.log('Mobile phone number filled.');

    console.log('Clicking the "Get OTP" button...');
    await this.page.getByRole('button', { name: 'Get OTP' }).click(); // Click the "Get OTP" button
    console.log('"Get OTP" button clicked.');

    console.log('Verifying the OTP step...');
    await expect(this.page.getByRole('heading', { name: 'Verify Your OTP' })).toBeVisible(); // Verify the OTP step
    console.log('OTP verification step reached successfully.');
  }
}

// Tests
test.describe('Astar Financial Tests', () => {
  test('Verify all links on the homepage', async ({ homePage }) => {
    await homePage.navigate(); // Navigate to the homepage
    await homePage.verifyLinks(); // Verify all links on the homepage
  });

  test('Apply for a home loan', async ({ applyLoanPage }) => {
    console.log('Starting test: Apply for a home loan');
    await applyLoanPage.navigate(); // Navigate to the loan application page
    await applyLoanPage.fillLoanApplication(); // Fill out the loan application form
    console.log('Test completed: Apply for a home loan');
  });

  test('Book an appointment', async ({ bookAppointmentPage }) => {
    console.log('Starting test: Book an appointment');
    await bookAppointmentPage.navigate(); // Navigate to the appointment booking page
    await bookAppointmentPage.bookAppointment(); // Book an appointment
    console.log('Test completed: Book an appointment');
  });
});
