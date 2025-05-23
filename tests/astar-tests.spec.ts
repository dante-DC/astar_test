import { test as baseTest, expect, Page,Locator } from '@playwright/test';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import fs from 'fs';

// Get the current file and directory paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// Base URL for the Astar Financial website
const baseUrl = "https://astarfinancial.com.au/";
// Helper functions for random data generation
function getRandomString(length: number): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  return Array.from({ length }, () => chars.charAt(Math.floor(Math.random() * chars.length))).join('');
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
  
    // Navigate to the homepage
    async navigate() {
      await this.page.goto(baseUrl, { timeout: 30000, waitUntil: 'load' });
      await expect(this.page).toHaveTitle(/Astar Financial/i);
      console.log(`Navigated to homepage: ${baseUrl}`);
    }
  
    // Read the link structure from linkStructure.json
    async getLinkStructure(): Promise<Record<string, string>> {
      const filePath = path.resolve(__dirname, 'linkStructure.json');
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
            } catch {
                // Ignore non-interactable locators
            }
        }
        return null;
    }
  
    // Verify the links from the link structure
    async verifyLinks() {
      const linkStructure = await this.getLinkStructure();
      for (const [childLink, parentDropdown] of Object.entries(linkStructure)) {
        console.log(`Testing child link: ${childLink}, Parent dropdown: ${parentDropdown}`);
  
        // Hover over the parent dropdown if applicable
        if (parentDropdown) {
        //   const parentLocator = this.page.locator(`a[href="${parentDropdown}"]`);
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
                if (this.page.url() !== baseUrl) {
                    try {
                        await this.page.goto(baseUrl, { timeout: 20000, waitUntil: 'domcontentloaded' }); // Revert to waitUntil: 'domcontentloaded'
                    } catch (error) {
                        console.error(`Failed to navigate back to ${baseUrl}: ${error.message}`);
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

  async navigate() {
    await this.page.goto('https://astarfinancial.com.au/apply-now');
    await expect(this.page).toHaveTitle(/Apply Now/i);
  }

  async fillLoanApplication() {
    await this.page.getByText('I want to buy a home').click();
    await this.page.getByRole('textbox', { name: 'Expected Purchase' }).fill(getRandomNumber(500000, 2000000).toString());
    await this.page.getByRole('button', { name: 'Next' }).click();
    await this.page.getByRole('textbox', { name: 'Deposits' }).fill(getRandomNumber(100000, 500000).toString());
    await this.page.getByRole('button', { name: 'Next' }).click();
    await this.page.getByRole('button', { name: 'Just exploring options' }).click();
    await this.page.getByRole('button', { name: 'Yes' }).click();
    await this.page.getByRole('button', { name: '-6 Months' }).click();
    await this.page.getByRole('button', { name: 'Established home' }).click();
    await this.page.getByRole('button', { name: 'I will live there' }).click();
    await this.page.getByRole('button', { name: 'Excellent' }).click();
    await this.page.getByRole('button', { name: "I'm an employee" }).click();
    await this.page.getByPlaceholder('First Name').fill(getRandomString(8));
    await this.page.getByPlaceholder('Last Name').fill(getRandomString(10));
    await this.page.getByPlaceholder('Email Address').fill(getRandomEmail());
    await this.page.getByPlaceholder('Mobile Number').fill(getRandomMobile());
    await this.page.getByRole('button', { name: 'Assess my options' }).click();
    await expect(this.page.getByRole('heading', { name: 'SMS Verification!' })).toBeVisible();
  }
}

class BookAppointmentPage {
  constructor(private page: Page) {}

  async navigate() {
    await this.page.goto('https://astarfinancial.com.au/book-appointment');
    await expect(this.page).toHaveTitle(/Book Appointment/i);
  }


  async bookAppointment() {
    await this.page.locator('input[type="date"]').fill('2025-06-01');
    await this.page.getByLabel('Select Time Slot').selectOption({ index: 1 });
    await this.page.getByLabel('Select Loan Type').selectOption({ index: 1 });
    await this.page.getByRole('textbox', { name: '+' }).fill(getRandomMobile());
    await this.page.getByRole('button', { name: 'Get OTP' }).click();
    await expect(this.page.getByRole('heading', { name: 'Verify Your OTP' })).toBeVisible();
    
  }
}

// Tests
test.describe('Astar Financial Tests', () => {
  test('Verify all links on the homepage', async ({ homePage }) => {
    await homePage.navigate();
    await homePage.verifyLinks();
  });

  test('Apply for a home loan', async ({ applyLoanPage }) => {
    await applyLoanPage.navigate();
    await applyLoanPage.fillLoanApplication();
  });

  test('Book an appointment', async ({ bookAppointmentPage }) => {
    await bookAppointmentPage.navigate();
    await bookAppointmentPage.bookAppointment();
  });
});
