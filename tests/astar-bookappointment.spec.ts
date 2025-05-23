import { test, expect } from '@playwright/test';

test('book an appointment', async ({ page }) => {
  await page.goto('https://astarfinancial.com.au/book-appointment');

  // Select a service inside the iframe
  await page.evaluate(() => {
    const iframe = document.querySelector('iframe[name=" Calendly Inline Widget"]') as HTMLIFrameElement;
    if (iframe) {
      if (iframe.contentDocument) {
        const select = iframe.contentDocument.querySelector('#service') as HTMLSelectElement;
        if (select) {
          select.value = 'Initial Consultation';
          select.dispatchEvent(new Event('change', { bubbles: true }));
        }
      }
    }
  });

  // Select a date
  // Navigate to the next month
  await page.evaluate(() => {
    const iframe = document.querySelector('iframe[name=" Calendly Inline Widget"]') as HTMLIFrameElement;
    if (iframe) {
      if (iframe.contentDocument) {
        const nextButton = iframe.contentDocument.querySelector('.DayPicker-NavButton--next') as HTMLButtonElement;
        if (nextButton) {
          nextButton.click();
        }
      }
    }
  });
  // Select a specific date (June 1, 2025)
  await page.evaluate(() => {
    const iframe = document.querySelector('iframe[name=" Calendly Inline Widget"]') as HTMLIFrameElement;
    if (iframe) {
      if (iframe.contentDocument) {
        const dateButton = iframe.contentDocument.querySelector('[aria-label="Choose Sunday, June 1, 2025 as your day."]') as HTMLButtonElement;
        if (dateButton) {
          dateButton.click();
        }
      }
    }
  });

  // Select a time
  await page.evaluate(() => {
    const timeSlot = document.querySelector('.col-md-6 label') as HTMLLabelElement;
    if (timeSlot) {
      timeSlot.click();
    }
  });

  // Fill in contact information
  await page.fill('#name', 'John Doe');
  await page.fill('#email', 'john.doe@example.com');
  await page.fill('#phone', '1234567890');

  // Submit the appointment
  await page.click('input[type="submit"]');

  // Verify the confirmation message
  await expect(page.locator('.alert.alert-success')).toContainText('Thank you! We will contact you to confirm your appointment. Please note that this is not a confirmation.');
});
