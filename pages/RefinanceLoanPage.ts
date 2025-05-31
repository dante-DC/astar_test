import { Page, Locator, expect } from '@playwright/test';

export class RefinanceLoanPage {
    readonly page: Page;
    
    // UI Elements
    private readonly refinanceLink: Locator;
    private readonly loanAmountInput: Locator;
    private readonly propertyValueInput: Locator;
    
    constructor(page: Page) {
        this.page = page;
        
        // Initialize locators with more specific selectors
        this.refinanceLink = page.locator('a[href*="refinance" i]').filter({ hasText: /refinance|refi/i }).first();
        this.loanAmountInput = page.locator('[id*="loan" i][type="text"], [data-testid*="loan" i], input[placeholder*="loan" i]').first();
        this.propertyValueInput = page.locator('[id*="property" i][type="text"], [data-testid*="property" i], input[placeholder*="property" i]').first();
    }

    private async ensureFormSectionVisible(sectionIdentifier: string) {
        // Wait for the section to be visible and wait for any animations
        await this.page.waitForSelector(sectionIdentifier, { state: 'visible', timeout: 10000 });
        await this.page.waitForTimeout(500); // Wait for any animations
    }

    private async clickNextInSection(sectionIdentifier: string) {
        // Wait for the section to be visible
        await this.ensureFormSectionVisible(sectionIdentifier);
        
        // Find the next button within the visible section
        const nextButton = this.page.locator(`${sectionIdentifier} button, ${sectionIdentifier} a.btn`).filter({ hasText: /next|continue|proceed/i }).first();
        
        // Wait for the button to be visible and enabled
        await nextButton.waitFor({ state: 'visible', timeout: 10000 });
        await expect(nextButton).toBeEnabled();
        
        // Click and wait for navigation
        await Promise.all([
            nextButton.click(),
            this.page.waitForLoadState('networkidle').catch(() => {})
        ]);
        
        // Additional wait for form transitions
        await this.page.waitForTimeout(1000);
    }

    async goto() {
        await this.page.goto('https://astarfinancial.com.au/refinance-home-loan', {
            waitUntil: 'domcontentloaded',
            timeout: 45000
        });
        
        // Wait for page to be interactive
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForLoadState('networkidle').catch(() => {});
        
        // Wait for specific content to verify page load
        await expect(this.page
            .locator('h1,h2,h3', { hasText: /refinance|loan/i })
            .first()
        ).toBeVisible({ timeout: 10000 });
    }

    async startRefinanceApplication() {
        // Wait for and click the refinance link
        await this.refinanceLink.waitFor({ state: 'visible', timeout: 10000 });
        await this.refinanceLink.click();
        
        // Handle possible overlay or welcome screen
        const startButtons = this.page.locator('button,a.btn').filter({ hasText: /start|begin|apply|continue/i });
        if (await startButtons.count() > 0) {
            await startButtons.first().click();
        }
        
        // Wait for form to be ready
        await this.page.waitForLoadState('networkidle').catch(() => {});
    }

    async fillLoanAmount(amount: string) {
        await this.loanAmountInput.waitFor({ state: 'visible', timeout: 10000 });
        await this.loanAmountInput.fill(amount);
        await this.clickNextInSection('form, div[role="form"]');
    }

    async fillPropertyValue(value: string) {
        await this.propertyValueInput.waitFor({ state: 'visible', timeout: 10000 });
        await this.propertyValueInput.fill(value);
        await this.clickNextInSection('form, div[role="form"]');
    }

    async selectRefinanceSituation(option: string) {
        const optionButton = this.page.locator('button,div[role="button"]').filter({ hasText: new RegExp(option, 'i') }).first();
        await optionButton.waitFor({ state: 'visible', timeout: 10000 });
        await optionButton.click();
        await this.clickNextInSection('form, div[role="form"]');
    }

    async selectFirstHomeBuyer(isFirst: boolean) {
        const answer = isFirst ? 'Yes' : 'No';
        const button = this.page.locator('button,div[role="button"]').filter({ hasText: new RegExp(`^${answer}$`, 'i') }).first();
        await button.waitFor({ state: 'visible', timeout: 10000 });
        await button.click();
        await this.clickNextInSection('form, div[role="form"]');
    }

    async selectTimeline(months: string) {
        const button = this.page.locator('button,div[role="button"]').filter({ hasText: new RegExp(months, 'i') }).first();
        await button.waitFor({ state: 'visible', timeout: 10000 });
        await button.click();
        await this.clickNextInSection('form, div[role="form"]');
    }

    async selectCreditHistory(rating: string) {
        const button = this.page.locator('button,div[role="button"]').filter({ hasText: new RegExp(rating, 'i') }).first();
        await button.waitFor({ state: 'visible', timeout: 10000 });
        await button.click();
        await this.clickNextInSection('form, div[role="form"]');
    }

    async selectIncomeSource(source: string) {
        const button = this.page.locator('button,div[role="button"]').filter({ hasText: new RegExp(source, 'i') }).first();
        await button.waitFor({ state: 'visible', timeout: 10000 });
        await button.click();
        await this.clickNextInSection('form, div[role="form"]');
    }

    async fillPersonalDetails(firstName: string, lastName: string, email: string, mobile: string) {
        // Wait for form to be ready
        await this.ensureFormSectionVisible('form, div[role="form"]');
        
        // Fill in first name
        const firstNameInput = this.page.locator('input[name*="first" i], input[placeholder*="first" i], input[aria-label*="first" i]').first();
        await firstNameInput.waitFor({ state: 'visible', timeout: 10000 });
        await firstNameInput.fill(firstName);

        // Fill in last name
        const lastNameInput = this.page.locator('input[name*="last" i], input[placeholder*="last" i], input[aria-label*="last" i]').first();
        await lastNameInput.waitFor({ state: 'visible', timeout: 10000 });
        await lastNameInput.fill(lastName);

        // Fill in email
        const emailInput = this.page.locator('input[type="email"], input[name*="email" i], input[placeholder*="email" i]').first();
        await emailInput.waitFor({ state: 'visible', timeout: 10000 });
        await emailInput.fill(email);

        // Fill in mobile
        const mobileInput = this.page.locator('input[type="tel"], input[name*="phone" i], input[placeholder*="mobile" i], input[placeholder*="phone" i]').first();
        await mobileInput.waitFor({ state: 'visible', timeout: 10000 });
        await mobileInput.fill(mobile);

        await this.clickNextInSection('form, div[role="form"]');
    }

    async verifyOTPScreen() {
        // Wait for OTP input or verification text
        const otpElements = [
            this.page.locator('input[type="number"], input[placeholder*="code" i], input[placeholder*="verification" i], input[placeholder*="otp" i]'),
            this.page.locator('text=/verification code|one-time code|OTP|verify your/i'),
        ];
        
        // Wait for any of the OTP elements to be visible
        await expect.poll(
            async () => {
                for (const element of otpElements) {
                    if (await element.isVisible()) {
                        return true;
                    }
                }
                return false;
            },
            {
                message: 'Waiting for OTP verification screen',
                timeout: 20000
            }
        ).toBeTruthy();
    }
}
