import { test, expect, Browser, BrowserContext, Page, Locator, APIResponse } from '@playwright/test';

test.describe('Astar Financial Website Link Tests', () => {
    const baseUrl = 'https://astarfinancial.com.au/';
    let browser: Browser;
    let context: BrowserContext;
    let page: Page;

    test.beforeAll(async ({ playwright }) => {
        const browserType = playwright.chromium; // Explicitly use the browser type
        browser = await browserType.launch(); // Ensure browser is launched
        context = await browser.newContext(); // Create a new browser context
        page = await context.newPage(); // Create a single page for the test suite
        try {
            await page.goto(baseUrl, { timeout: 20000, waitUntil: 'domcontentloaded' }); // Revert to waitUntil: 'domcontentloaded'
            console.log(`Navigated to homepage: ${baseUrl}`);
        } catch (error) {
            console.error(`Critical: Error navigating to homepage ${baseUrl}: ${error.message}`);
            throw error; // Fail the test suite if navigation fails
        }
    });

    test.afterAll(async () => {
        if (context) {
            await context.close(); // Ensure context is closed
        }
        if (browser) {
            await browser.close(); // Ensure browser is closed
        }
    });

    async function fetchLinkStructure(): Promise<Record<string, string>> {
        const response: APIResponse = await context.request.get(baseUrl);
        if (!response.ok()) {
            throw new Error(`Failed to fetch link structure from ${baseUrl}`);
        }
        const body = await response.text();
        const linkStructure: Record<string, string> = {};

        const dropdownRegex = /<li class="nav-item.*?dropdown">.*?<a class="nav-link dropdown-toggle".*?href="(.*?)".*?>.*?<\/a>.*?<ul class="dropdown-menu">(.*?)<\/ul>/gs;
        const linkRegex = /<a class="dropdown-item".*?href="(.*?)".*?>.*?<\/a>/g;

        let match;
        while ((match = dropdownRegex.exec(body)) !== null) {
            const parentLink = match[1];
            const dropdownContent = match[2];
            let subMatch;
            while ((subMatch = linkRegex.exec(dropdownContent)) !== null) {
                const childLink = subMatch[1];
                linkStructure[childLink] = parentLink; // Map child link to its parent dropdown link
            }
        }

        console.log('Link Structure:');
        for (const [child, parent] of Object.entries(linkStructure)) {
            console.log(`Child Link: ${child}, Parent Dropdown: ${parent}`);
        }

        return linkStructure;
    }

    async function findInteractableLink(page: Page, href: string): Promise<Locator | null> {
        const baseSelector = `a[href="${href}"]`;
        const locators = await page.locator(baseSelector).all();

        for (const locator of locators) {
            try {
                await locator.scrollIntoViewIfNeeded();
                if (await locator.isVisible() && await locator.isEnabled()) {
                    return locator;
                }
            } catch {
                // Ignore non-interactable locators
            }
        }
        return null;
    }

    test('Verify all links, handle dropdowns, and measure response times', async () => {
        test.setTimeout(120000); // Increase test timeout to 2 minutes

        const linkStructure = await fetchLinkStructure();

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

            const startTime = Date.now();
            try {
                await Promise.all([
                    page.waitForURL(childLink, { timeout: 20000 }),
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
    });
});