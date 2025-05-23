import { Page, Locator, expect } from '@playwright/test';
import { config } from '../config/config';
import path from 'path';
import fs from 'fs';
import { NavigationError, ElementError,TestError } from '../utils/errors';
import { Logger } from '../utils/logger';

export class HomePage {
    private logger = Logger.create('HomePage');

    constructor(private page: Page) {}
  
    async navigate() {
        try {
            this.logger.info('Starting navigation', { url: config.baseUrl });
            await this.page.goto(config.baseUrl, { timeout: config.defaultTimeout });
            await expect(this.page).toHaveTitle(/Astar Financial/i);
            this.logger.info('Navigation successful');
            console.log(`Navigated to homepage: ${config.baseUrl}`);
        } catch (error) {
            this.logger.error('Navigation failed', error);
            throw new NavigationError(`Failed to navigate to homepage: ${error.message}`, {
                url: config.baseUrl,
                error
            });
        }
    }
  
    async getLinkStructure(): Promise<Record<string, string>> {
      const filePath = path.resolve(config.testDataPath, 'linkStructure.json');
      if (!fs.existsSync(filePath)) {
        throw new Error(`File not found: ${filePath}`);
      }
      const data = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(data);
    }
    // Function to find an interactable link on the page
    async  findInteractableLink(page: Page, href: string): Promise<Locator | null> {
        try {
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
        } catch (error) {
            throw new ElementError(`Failed to find interactable link: ${error.message}`, {
                href,
                error
            });
        }
    }
  
    async verifyLinks() {
        try {
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
        } catch (error) {
            if (error instanceof TestError) {
                throw error; // Re-throw custom errors
            }
            throw new TestError(`Failed to verify links: ${error.message}`, {
                error
            });
        }
    }
}
