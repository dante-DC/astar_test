import { Page, expect } from '@playwright/test';
import { getRandomNumber, getRandomString, getRandomEmail, getRandomMobile } from '../utils/dataGenerators';

export class ApplyLoanPage {
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
