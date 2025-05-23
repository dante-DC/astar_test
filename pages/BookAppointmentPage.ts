import { Page, expect } from '@playwright/test';
import { getRandomMobile } from '../utils/dataGenerators';

export class BookAppointmentPage {
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
