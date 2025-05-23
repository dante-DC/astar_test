// Import required modules and types from Playwright and Node.js
import { test, expect, Browser, BrowserContext, Page, Locator, APIResponse } from '@playwright/test';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import fs from 'fs';

// Get the current file and directory paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Base URL for the Astar Financial website
const baseUrl = "https://astarfinancial.com.au/";
console.log(__dirname); // Log the directory path for debugging

// Define the test suite
test.describe('Astar Financial Website Link Tests', () => {
    // File to store the link structure
    const linkStructureFile = path.resolve(__dirname, 'linkStructure.json');
    // Flag to determine whether to fetch the link structure or use the saved file
    const fetchLinkStructureRequired = false;

    // Variables for the browser, context, and page
    let browser: Browser;
    let context: BrowserContext;
    let page: Page;

    // Before all tests, set up the browser and navigate to the base URL
    test.beforeAll(async ({ playwright }) => {
        const browserType = playwright.chromium; // Use Chromium browser
        browser = await browserType.launch(); // Launch the browser
        context = await browser.newContext(); // Create a new browser context
        page = await context.newPage(); // Create a new page
        try {
            await page.goto(baseUrl, { timeout: 30000, waitUntil: 'load' }); // Navigate to the base URL
            console.log(`Navigated to homepage: ${baseUrl}`);
        } catch (error) {
            console.error(`Critical: Error navigating to homepage ${baseUrl}: ${error.message}`);
            throw error; // Fail the test suite if navigation fails
        }
    });

    // After all tests, close the browser and context
    test.afterAll(async () => {
        if (context) {
            await context.close(); // Close the browser context
        }
        if (browser) {
            await browser.close(); // Close the browser
        }
    });

    // Function to fetch the link structure from the website
    async function fetchLinkStructure(): Promise<Record<string, string>> {
        const startTime = Date.now(); // Start timing

        // Fetch the HTML content of the base URL
        const response: APIResponse = await context.request.get(baseUrl);
        if (!response.ok()) {
            throw new Error(`Failed to fetch link structure from ${baseUrl}`);
        }
        const body = await response.text();
        const linkStructure: Record<string, string> = {};

        // Regex to extract dropdown menus and their links
        const dropdownRegex = /<li class="nav-item.*?dropdown">.*?<a class="nav-link dropdown-toggle".*?href="(.*?)".*?>.*?<\/a>.*?<ul class="dropdown-menu">(.*?)<\/ul>/gs;
        const linkRegex = /<a class="dropdown-item".*?href="(.*?)".*?>.*?<\/a>/g;

        let match;
        while ((match = dropdownRegex.exec(body)) !== null) {
            const parentLink = match[1];
            const dropdownContent = match[2];

            let subMatch;
            while ((subMatch = linkRegex.exec(dropdownContent)) !== null) {
                const childLink = subMatch[1];

                if (!childLink || childLink === '#') {
                    console.warn(`Skipping invalid child link: ${childLink}`);
                    continue;
                }

                linkStructure[childLink] = parentLink; // Map child links to their parent dropdowns
            }
        }

        const endTime = Date.now(); // End timing
        console.log(`Time taken to build link structure: ${endTime - startTime}ms`);

        // Log and save the link structure to a file
        console.log('Link Structure:');
        for (const [child, parent] of Object.entries(linkStructure)) {
            console.log(`Child Link: ${child}, Parent Dropdown: ${parent}`);
        }
        fs.writeFileSync(linkStructureFile, JSON.stringify(linkStructure, null, 2), 'utf-8');
        console.log(`Link structure saved to ${linkStructureFile}`);

        return linkStructure;
    }

    // Function to get the link structure (fetch or read from file)
    async function getLinkStructure(): Promise<Record<string, string>> {
        if (!fetchLinkStructureRequired && fs.existsSync(linkStructureFile)) {
            console.log(`Reading link structure from ${linkStructureFile}`);
            const data = fs.readFileSync(linkStructureFile, 'utf-8');
            return JSON.parse(data);
        }
        return await fetchLinkStructure();
    }

    // Function to find an interactable link on the page
    async function findInteractableLink(page: Page, href: string): Promise<Locator | null> {
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

    // Main test to verify all links, handle dropdowns, and measure response times
    test('Verify all links, handle dropdowns, and measure response times', async () => {
        test.setTimeout(120000); // Increase test timeout to 2 minutes

        const linkStructure = await getLinkStructure(); // Get the link structure

        for (const [childLink, parentDropdown] of Object.entries(linkStructure)) {
            console.log(`Testing child link: ${childLink}, Parent dropdown: ${parentDropdown}`);

            // Hover over the parent dropdown
            const parentLocator = await findInteractableLink(page, parentDropdown);
            if (parentLocator) {
                console.log(`Hovering over parent dropdown: ${parentDropdown}`);
                await parentLocator.hover(); // Only hover, do not click
            } else {
                console.warn(`Parent dropdown not interactable: ${parentDropdown}`);
                continue;
            }

            // Find and interact with the child link
            const childLocator = await findInteractableLink(page, childLink);
            if (!childLocator) {
                console.warn(`Child link not interactable: ${childLink}`);
                continue;
            }
            if (childLink !== '#') {
                console.log(`Child link is interactable: ${childLink}`);
                const startTime = Date.now();
                try {
                    await Promise.all([
                        page.waitForURL(childLink, { timeout: 20000, waitUntil: 'domcontentloaded' }), // Wait for the URL to change
                        childLocator.click({ force: true }), // Click the child link
                    ]);

                    await page.waitForTimeout(500); // Add a 500ms wait after the click

                    const endTime = Date.now();
                    console.log(`Response time for ${childLink}: ${endTime - startTime}ms`);

                    const title = await page.title();
                    expect(title).not.toBe('');
                    console.log(`Page title for ${childLink}: ${title}`);
                } catch (error) {
                    console.error(`Error testing link ${childLink}: ${error.message}`);
                } finally {
                    if (page.url() !== baseUrl) {
                        try {
                            await page.goto(baseUrl, { timeout: 20000, waitUntil: 'domcontentloaded' }); // Revert to waitUntil: 'domcontentloaded'
                        } catch (error) {
                            console.error(`Failed to navigate back to ${baseUrl}: ${error.message}`);
                            return;
                        }
                    }
                }
            }
        }
    });
});