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
        
        // Click and wait for page update
        await nextButton.click();
        await this.page.waitForTimeout(1000);
    }

    async goto() {
        await this.page.goto('https://astarfinancial.com.au/refinance-home-loan', {
            waitUntil: 'domcontentloaded',
            timeout: 45000
        });
        
        // Wait for page to be interactive
        await this.page.waitForLoadState('domcontentloaded');
        
        // Wait for specific content to verify page load
        await expect(this.page
            .locator('h1,h2,h3')
            .filter({ hasText: /refinance|loan/i })
            .first()
        ).toBeVisible({ timeout: 10000 });
    }

    async startRefinanceApplication() {
        // Click on "I want to refinance" link which will navigate to the actual form
        const refinanceStartLink = this.page.locator('a, button').filter({ hasText: /I want to refinance|Start refinancing/i }).first();
        await refinanceStartLink.waitFor({ state: 'visible', timeout: 10000 });
        await refinanceStartLink.click();
        
        // Wait for the form page to load
        await this.page.waitForTimeout(2000);
    }

    async fillLoanAmount(amount: string) {
        // The first input field is for "Loan Balance"
        const loanBalanceInput = this.page.getByRole('textbox', { name: /loan balance|current loan/i }).first();
        await loanBalanceInput.waitFor({ state: 'visible', timeout: 10000 });
        await loanBalanceInput.fill(amount);
        
        // Click Next button
        await this.page.getByRole('button', { name: /next|continue/i }).first().click();
        await this.page.waitForTimeout(1000);
    }

    async fillPropertyValue(value: string) {
        // Look for property value or home value input
        const propertyValueInput = this.page.getByRole('textbox', { name: /property value|home value|current property/i }).first();
        await propertyValueInput.waitFor({ state: 'visible', timeout: 10000 });
        await propertyValueInput.fill(value);
        
        // Click Next button
        await this.page.getByRole('button', { name: /next|continue/i }).first().click();
        await this.page.waitForTimeout(1000);
    }

    async selectRefinanceSituation(option: string) {
        const optionButton = this.page.getByRole('button', { name: new RegExp(option, 'i') }).first();
        await optionButton.waitFor({ state: 'visible', timeout: 10000 });
        await optionButton.click();
        await this.page.waitForTimeout(1000);
    }

    async selectFirstHomeBuyer(isFirst: boolean) {
        const answer = isFirst ? 'Yes' : 'No';
        const button = this.page.getByRole('button', { name: new RegExp(`^${answer}$`, 'i') }).first();
        await button.waitFor({ state: 'visible', timeout: 10000 });
        await button.click();
        await this.page.waitForTimeout(1000);
    }

    async selectTimeline(months: string) {
        const button = this.page.getByRole('button', { name: new RegExp(months, 'i') }).first();
        await button.waitFor({ state: 'visible', timeout: 10000 });
        await button.click();
        await this.page.waitForTimeout(1000);
    }

    async selectCreditHistory(rating: string) {
        const button = this.page.getByRole('button', { name: new RegExp(rating, 'i') }).first();
        await button.waitFor({ state: 'visible', timeout: 10000 });
        await button.click();
        await this.page.waitForTimeout(1000);
    }

    async selectIncomeSource(source: string) {
        const button = this.page.getByRole('button', { name: new RegExp(source, 'i') }).first();
        await button.waitFor({ state: 'visible', timeout: 10000 });
        await button.click();
        await this.page.waitForTimeout(1000);
    }

    async fillPersonalDetails(firstName: string, lastName: string, email: string, mobile: string) {
        // Fill in first name
        const firstNameInput = this.page.getByRole('textbox', { name: /first name|first/i }).first();
        await firstNameInput.waitFor({ state: 'visible', timeout: 10000 });
        await firstNameInput.fill(firstName);

        // Fill in last name
        const lastNameInput = this.page.getByRole('textbox', { name: /last name|last/i }).first();
        await lastNameInput.waitFor({ state: 'visible', timeout: 10000 });
        await lastNameInput.fill(lastName);

        // Fill in email
        const emailInput = this.page.getByRole('textbox', { name: /email/i }).first();
        await emailInput.waitFor({ state: 'visible', timeout: 10000 });
        await emailInput.fill(email);

        // Fill in mobile
        const mobileInput = this.page.getByRole('textbox', { name: /mobile|phone/i }).first();
        await mobileInput.waitFor({ state: 'visible', timeout: 10000 });
        await mobileInput.fill(mobile);

        // Click Next or Assess button
        const submitButton = this.page.getByRole('button', { name: /next|continue|assess|submit/i }).first();
        await submitButton.waitFor({ state: 'visible', timeout: 10000 });
        await submitButton.click();
        await this.page.waitForTimeout(1000);
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
