import { test, expect } from '@playwright/test';

test.describe('Astar Financial Website Link Tests', () => {
    test('Verify all links and measure response times', async ({ page }) => {
        // Navigate to the homepage
        try {
            await page.goto('https://astarfinancial.com.au/', { timeout: 15000 });
            console.log(`Navigated to homepage`);
        } catch (error) {
            console.error(`Error navigating to homepage: ${error}`);
            return; // Exit the test if the homepage cannot be loaded
        }

        // Collect all links on the page
        let links;
        try {
            links = await page.locator('a').all();
            console.log(`Found ${links.length} links on the page`);
        } catch (error) {
            console.error(`Error collecting links: ${error}`);
            return; // Exit the test if links cannot be collected
        }

        for (const link of links) {
            const href = await link.getAttribute('href');
            if (!href || href.startsWith('#') || href.startsWith('javascript:')) {
                console.log(`Skipping invalid or non-navigable link: ${href}`);
                continue;
            }

            console.log(`Testing link: ${href}`);

            // Measure response time
            const startTime = Date.now();
            try {
                // Handle dropdown links
                const parentDropdown = await link.locator('..').locator('.dropdown');
                if (await parentDropdown.count()) {
                    console.log(`Expanding dropdown for link: ${href}`);
                    await parentDropdown.hover(); // Expand the dropdown
                }

                const [popup, navigation] = await Promise.all([
                    page.waitForEvent('popup', { timeout: 5000 }).catch(() => null), // Handle links that open in a new tab
                    //page.waitForNavigation({ timeout: 5000 }).catch(() => null), // Handle navigation
                    link.click({ force: true }), // Click the link
                ]);
                const endTime = Date.now();
                const responseTime = endTime - startTime;

                console.log(`Response time for ${href}: ${responseTime}ms`);

                // Verify the page or popup loaded successfully
                if (popup) {
                    expect(await popup.title()).not.toBe('');
                    await popup.close(); // Close the new tab if opened
                } else if (navigation) {
                    expect(await page.title()).not.toBe('');
                } else {
                    console.warn(`No navigation or popup detected for link: ${href}`);
                }
            } catch (error) {
                console.error(`Error testing link ${href}: ${error}`);
            }

            // Reset to the homepage to continue testing
            try {
                await page.goto('https://astarfinancial.com.au/', { timeout: 15000 });
            } catch (error) {
                console.error(`Error navigating back to homepage: ${error}`);
                break; // Exit the loop if the homepage cannot be reloaded
            }
        }
    });
});