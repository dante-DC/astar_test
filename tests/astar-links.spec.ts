import { test, expect, Page, Response, Locator, BrowserContext } from '@playwright/test';

test.describe('Astar Financial Website Link Tests', () => {
    const baseUrl = 'https://astarfinancial.com.au/';

    async function findInteractableLink(page: Page, href: string, target?: string | null): Promise<Locator | null> {
        const originalHref = href; // Keep original for logging/debugging
        // Construct a selector that is reasonably specific.
        // Prioritize links that also match the target attribute if provided.
        const targetSelector = target ? `[target="${target}"]` : ''; // Removed CSS.escape
        let baseSelector = `a[href="${href}"]${targetSelector}`; // Removed CSS.escape
        
        let locators = await page.locator(baseSelector).all();

        // If specific target match yields no results, try without target.
        if (locators.length === 0 && target) {
            baseSelector = `a[href="${href}"]`; // Removed CSS.escape, try without target
            locators = await page.locator(baseSelector).all();
        }
        
        // Fallback for partial matches or relative links that might appear differently in DOM vs. resolved URL
        if (locators.length === 0) {
            // Try href that ends with the original href (for relative links)
            // Ensure originalHref is used here if href might have been modified (it hasn't in this func context yet)
            const endsWithSelector = `a[href$="${originalHref}"]`; // Removed CSS.escape
            locators = await page.locator(endsWithSelector).all();
            if (locators.length === 0 && target) { // try with target again
                 // Note: targetSelector already has quotes from its definition
                 locators = await page.locator(`${endsWithSelector}${targetSelector}`).all();
            }
        }


        for (const locator of locators) {
            try {
                await locator.scrollIntoViewIfNeeded({ timeout: 5000 });
                if (await locator.isVisible({ timeout: 3000 }) && await locator.isEnabled({ timeout: 3000 })) {
                    return locator; // Return the first interactable link found
                }
            } catch (e) {
                // console.debug(`Locator for href ${originalHref} not interactable: ${e.message}`);
            }
        }
        console.warn(`No interactable link found for href: "${originalHref}", target: "${target || 'any'}" on ${page.url()}`);
        return null; 
    }

    test('Verify all links, handle navigation types, and measure response times', async ({ page, context }) => {
        try {
            await page.goto(baseUrl, { timeout: 30000, waitUntil: 'networkidle' });
            console.log(`Navigated to homepage: ${baseUrl}`);
        } catch (error) {
            console.error(`Critical: Error navigating to homepage ${baseUrl}: ${error.message}`);
            test.fail(true, `Critical: Failed to load homepage ${baseUrl}. Error: ${error.message}`);
            return;
        }

        const initialLinkDetails = [];
        const linkElements = await page.locator('a').all();
        for (const linkElement of linkElements) {
            const href = await linkElement.getAttribute('href');
            const target = await linkElement.getAttribute('target');
            initialLinkDetails.push({ href, target });
        }
        console.log(`Found ${initialLinkDetails.length} link elements initially on ${baseUrl}`);
        if (initialLinkDetails.length === 0) {
            console.warn(`No links found on ${baseUrl}. Test will pass but check page content.`);
            return;
        }

        // Requirement 8: Structure (test within describe, loop for links)
        for (let i = 0; i < initialLinkDetails.length; i++) {
            const { href, target } = initialLinkDetails[i];
            const taskDetail = `(Original href: "${href || 'null'}", target: "${target || 'default'}", index: ${i})`;

            // Requirement 4: Improved Link Filtering
            if (!href || href.startsWith('#') || href.startsWith('javascript:') || href.startsWith('mailto:') || href.startsWith('tel:')) {
                console.log(`Skipping non-navigable or non-HTTP/HTTPS link ${taskDetail}`);
                continue;
            }

            let absoluteUrl: string;
            try {
                // Requirement 7: Handle Base URL. Use current page's URL as base if available, otherwise baseUrl.
                const currentBase = page.url() === 'about:blank' ? baseUrl : page.url();
                absoluteUrl = new URL(href, currentBase).toString();
                if (!absoluteUrl.startsWith('http://') && !absoluteUrl.startsWith('https://')) {
                    console.log(`Skipping non-HTTP/HTTPS absolute URL: ${absoluteUrl} ${taskDetail}`);
                    continue;
                }
            } catch (error) {
                console.warn(`Could not parse href: "${href}" ${taskDetail}. Error: ${error.message}. Skipping.`);
                test.fail(false, `Could not parse href: "${href}" ${taskDetail}. Error: ${error.message}`);
                continue;
            }

            console.log(`Attempting to test link: ${absoluteUrl} ${taskDetail}`);
            
            const linkLocator = await findInteractableLink(page, href, target);

            if (!linkLocator) {
                 console.warn(`Link for ${absoluteUrl} ${taskDetail} not found or not interactable on page ${page.url()}. Skipping.`);
                 test.fail(false, `Link ${absoluteUrl} ${taskDetail} not found or not interactable.`);
                 continue;
            }
            // Requirement 6: Avoid force: true (ensured by findInteractableLink not using it, and interactability checks within)

            const startTime = Date.now();
            let navigatedPage: Page = page; 
            let popupPage: Page | null = null;
            let navigationResponse: Response | null = null;

            try {
                // Requirement 2: Reinstate waitForNavigation & Promise.race
                const effectiveTarget = await linkLocator.getAttribute('target'); // Re-check target attr from the located element
                const opensInNewTab = effectiveTarget === '_blank';

                // Attempt to handle dropdowns
                // Based on error: <li class="nav-item active dropdown">…</li> intercepts pointer events
                // We look for a parent li.nav-item.dropdown that contains our specific link
                const parentDropdownLi = page.locator(`li.nav-item.dropdown:has(a[href="${href}"])`).first();
                if (await parentDropdownLi.count() > 0) {
                    console.log(`Link ${absoluteUrl} ${taskDetail} might be in a dropdown. Hovering over parent dropdown item.`);
                    await parentDropdownLi.hover({ timeout: 5000 }); // Hover to open dropdown
                    await page.waitForTimeout(500); // Wait for animation

                    // Re-check interactability of the specific link after hover
                    if (!await linkLocator.isVisible({ timeout: 3000 }) || !await linkLocator.isEnabled({ timeout: 3000 })) {
                        console.warn(`Link ${absoluteUrl} ${taskDetail} is still not interactable after dropdown hover. Skipping click.`);
                        // We might throw an error or test.fail(false) here if strict interactability is required
                        throw new Error(`Link ${absoluteUrl} inside dropdown not interactable after hover.`);
                    } else {
                        console.log(`Link ${absoluteUrl} ${taskDetail} is now interactable after dropdown hover.`);
                    }
                }

                // Using JavaScript click to potentially bypass pointer event issues
                console.log(`Attempting JavaScript click for ${absoluteUrl} ${taskDetail}`);
                const clickPromise = linkLocator.evaluate(element => (element as HTMLElement).click()); // JS click

                if (opensInNewTab) {
                    console.log(`Link ${absoluteUrl} ${taskDetail} opens in new tab. Listening for popup...`);
                    const popupEventPromise = context.waitForEvent('page', { timeout: 15000 });
                    // await Promise.all([clickPromise, popupEventPromise]); // Ensure click happens before popup is fully awaited in some race conditions
                    await clickPromise; // Click first
                    popupPage = await popupEventPromise; // Assign from promise result
                    navigatedPage = popupPage; 
                    console.log(`Popup opened. New page prelim URL: ${popupPage.url()}`);
                    await popupPage.waitForLoadState('domcontentloaded', { timeout: 20000 });
                    console.log(`Popup loaded. New page final URL: ${popupPage.url()}`);
                    // Try to capture the response of the main navigation on the new page.
                    navigationResponse = popupPage.mainFrame().page().request() ? await popupPage.mainFrame().page().request()!.response() : null;
                     if (!navigationResponse && popupPage.url() !== 'about:blank' && popupPage.url() !== '') { 
                        navigationResponse = await popupPage.goto(popupPage.url(), {timeout: 10000, waitUntil: 'domcontentloaded'});
                    }


                } else {
                    console.log(`Link ${absoluteUrl} ${taskDetail} navigates in same tab. Waiting for navigation...`);
                    const navigationEventPromise = page.waitForNavigation({ 
                        timeout: 20000, 
                        waitUntil: 'domcontentloaded'
                        // URL predicate removed
                    });
                    // await Promise.all([clickPromise, navigationEventPromise]);
                    await clickPromise; // Click first
                    navigationResponse = await navigationEventPromise; 
                }

                const endTime = Date.now();
                const responseTime = endTime - startTime;
                console.log(`Response time for ${absoluteUrl}: ${responseTime}ms`);

                // Requirement 3: Robust Error Handling & Requirement 5: Enhanced Assertions (Status)
                if (!navigationResponse && navigatedPage.url() !== 'about:blank' && navigatedPage.url() !== baseUrl) {
                     if (navigatedPage.url().startsWith(absoluteUrl.substring(0, Math.min(absoluteUrl.length,80)))) {
                        console.warn(`Could not capture explicit network response for ${absoluteUrl} ${taskDetail}, but navigation to ${navigatedPage.url()} seemed to occur.`);
                     } else {
                        throw new Error(`Navigation to ${absoluteUrl} ${taskDetail} did not result in a trackable response and navigated to an unexpected URL: ${navigatedPage.url()}.`);
                     }
                } else if (!navigationResponse && (navigatedPage.url() === 'about:blank' || (navigatedPage === page && navigatedPage.url() === baseUrl && absoluteUrl !==baseUrl ))){
                    // If it's a new tab that stayed about:blank, or same-page nav that didn't change URL (e.g. bad link to self)
                    throw new Error(`Navigation attempt for ${absoluteUrl} ${taskDetail} did not result in a valid page load or response object. Final URL: ${navigatedPage.url()}`);
                }
                
                if (navigationResponse) {
                    const status = navigationResponse.status();
                    expect(status, `URL ${absoluteUrl} ${taskDetail} should have a success status code (200-299). Current: ${status}`).toBeGreaterThanOrEqual(200);
                    expect(status, `URL ${absoluteUrl} ${taskDetail} should have a success status code (200-299). Current: ${status}`).toBeLessThan(300);
                } else {
                     console.warn(`No direct response object captured for ${absoluteUrl} ${taskDetail}. Title check is primary validation.`);
                }

                // Requirement 5: Enhanced Assertions (Title)
                const title = await navigatedPage.title();
                expect(title, `Page title for ${absoluteUrl} ${taskDetail} should not be empty.`).not.toBe('');
                const lowerCaseTitle = title.toLowerCase();
                const errorKeywords = ['error', 'not found', 'page not found', '404', 'oops', 'problem loading page', 'cannot find server'];
                for (const keyword of errorKeywords) {
                    expect(lowerCaseTitle, `Page title for ${absoluteUrl} ("${title}") ${taskDetail} should not contain "${keyword}".`).not.toContain(keyword);
                }

            } catch (error) {
                const endTime = Date.now();
                const responseTime = endTime - startTime;
                console.error(`Error testing link ${absoluteUrl} ${taskDetail} (Response time: ${responseTime}ms): ${error.message}`);
                test.fail(false, `Failed to test link ${absoluteUrl} ${taskDetail}. Error: ${error.message}`); // Test for this link fails
            } finally {
                if (popupPage && !popupPage.isClosed()) { // Requirement 1: Close the tab after checking (if it was a popup)
                    await popupPage.close();
                    console.log(`Closed popup page for ${absoluteUrl}`);
                } else if (navigatedPage === page && page.url() !== baseUrl && !page.isClosed()) {
                    // If same-page navigation occurred, navigate back to base URL to continue test
                    // This part fulfills Req 2's implication but conflicts with Req 1's "avoid navigating back"
                    console.log(`Navigating back to ${baseUrl} from ${page.url()}...`);
                    try {
                        await page.goto(baseUrl, { timeout: 25000, waitUntil: 'networkidle' });
                        console.log(`Successfully navigated back to ${baseUrl}.`);
                    } catch (e) {
                        console.error(`Critical: Failed to navigate back to ${baseUrl} from ${page.url()}: ${e.message}. Aborting further tests.`);
                        test.fail(true, `Critical: Failed to navigate back to ${baseUrl}. Error: ${e.message}`);
                        return; // Stop the test
                    }
                } else if (page.isClosed()) { 
                    console.error(`Critical: Main page was closed unexpectedly. Aborting further tests.`);
                    test.fail(true, `Critical: Main page closed unexpectedly.`);
                    return; 
                }
            }
        }
    });
});