# Test info

- Name: book an appointment
- Location: C:\Work\astar_test\tests\astar-bookappointment.spec.ts:3:1

# Error details

```
Error: page.fill: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('#name')

    at C:\Work\astar_test\tests\astar-bookappointment.spec.ts:55:14
```

# Page snapshot

```yaml
- banner:
  - link:
    - /url: /
    - img
  - navigation "Thirteenth navbar example":
    - list:
      - listitem:
        - link "Home Loans":
          - /url: /astar
      - listitem:
        - link "Talk to a broker":
          - /url: https://astarfinancial.com.au/book-appointment
      - listitem:
        - link "Financial":
          - /url: financial-products
      - listitem:
        - link "Contact":
          - /url: "#"
      - listitem:
        - link "Apply now":
          - /url: https://astarfinancial.com.au/apply-now
      - listitem: Login
- main:
  - heading "Book an appointment with one of our experts" [level=1]
  - paragraph: We’ll help you find the right home loan for your situation.
  - paragraph: Please provide an Australian mobile phone number, select a date and loan type.
  - text: Select Appointment Date
  - textbox "Select Appointment Date": 2025-05-23
  - text: Select Time Slot
  - combobox "Select Time Slot":
    - option "-- Select a Time Slot --" [selected]
    - option "09:00 AM" [disabled]
    - option "11:00 AM" [disabled]
    - option "01:00 PM" [disabled]
    - option "03:00 PM"
    - option "05:00 PM"
  - text: Select Loan Type
  - combobox "Select Loan Type":
    - option "-- Select Loan Type --" [selected]
    - option "Home Loan"
    - option "Commercial Loan"
    - option "Business Loan"
  - textbox "+61"
  - button "Get OTP"
  - paragraph: By clicking 'GET OTP', you consent to our Privacy Statement and Terms.
- img
- paragraph:
  - text: Back to Top
  - button "Back to Top":
    - img
- contentinfo:
  - heading "Home Loans" [level=3]
  - list:
    - listitem:
      - link "Buy a new home":
        - /url: https://astarfinancial.com.au/buy-new-home
    - listitem:
      - link "Refinance my home loan":
        - /url: https://astarfinancial.com.au/refinance-home-loan
    - listitem:
      - link "Buy an investment property":
        - /url: https://astarfinancial.com.au/buy-investment-property
    - listitem:
      - link "Compare Rates":
        - /url: https://astarfinancial.com.au/compare-rates
  - heading "Financial Products" [level=3]
  - list:
    - listitem:
      - link "Commercial Loan":
        - /url: https://astarfinancial.com.au/commercial-loan
    - listitem:
      - link "Business Loans":
        - /url: https://astarfinancial.com.au/business-loan
    - listitem:
      - link "Home loan":
        - /url: https://astarfinancial.com.au/home-loan
  - heading "Company" [level=3]
  - list:
    - listitem:
      - link "About us":
        - /url: https://astarfinancial.com.au/about-us
  - heading "Legal" [level=3]
  - list:
    - listitem:
      - link "Privacy":
        - /url: https://astarfinancial.com.au/privacy
  - heading "Contact" [level=3]
  - list:
    - listitem:
      - link "Contact us":
        - /url: https://astarfinancial.com.au/get-in-touch
    - listitem:
      - link "Book an appointment":
        - /url: https://astarfinancial.com.au/book-appointment
    - listitem:
      - link "Admin Login":
        - /url: https://astarfinancial.com.au/admin/login
  - list:
    - listitem:
      - link:
        - /url: "#"
    - listitem:
      - link:
        - /url: "#"
    - listitem:
      - link:
        - /url: "#"
    - listitem:
      - link:
        - /url: "#"
    - listitem:
      - link:
        - /url: "#"
- paragraph: We acknowledge the Traditional Owners of the many lands where we live and work and pay our respects to Elders past, present and emerging. We celebrate the stories, culture and traditions of Aboriginal and Torres Strait Islander Elders of all communities from the many lands where we live, work and gather.
```

# Test source

```ts
   1 | import { test, expect } from '@playwright/test';
   2 |
   3 | test('book an appointment', async ({ page }) => {
   4 |   await page.goto('https://astarfinancial.com.au/book-appointment');
   5 |
   6 |   // Select a service inside the iframe
   7 |   await page.evaluate(() => {
   8 |     const iframe = document.querySelector('iframe[name=" Calendly Inline Widget"]') as HTMLIFrameElement;
   9 |     if (iframe) {
  10 |       if (iframe.contentDocument) {
  11 |         const select = iframe.contentDocument.querySelector('#service') as HTMLSelectElement;
  12 |         if (select) {
  13 |           select.value = 'Initial Consultation';
  14 |           select.dispatchEvent(new Event('change', { bubbles: true }));
  15 |         }
  16 |       }
  17 |     }
  18 |   });
  19 |
  20 |   // Select a date
  21 |   // Navigate to the next month
  22 |   await page.evaluate(() => {
  23 |     const iframe = document.querySelector('iframe[name=" Calendly Inline Widget"]') as HTMLIFrameElement;
  24 |     if (iframe) {
  25 |       if (iframe.contentDocument) {
  26 |         const nextButton = iframe.contentDocument.querySelector('.DayPicker-NavButton--next') as HTMLButtonElement;
  27 |         if (nextButton) {
  28 |           nextButton.click();
  29 |         }
  30 |       }
  31 |     }
  32 |   });
  33 |   // Select a specific date (June 1, 2025)
  34 |   await page.evaluate(() => {
  35 |     const iframe = document.querySelector('iframe[name=" Calendly Inline Widget"]') as HTMLIFrameElement;
  36 |     if (iframe) {
  37 |       if (iframe.contentDocument) {
  38 |         const dateButton = iframe.contentDocument.querySelector('[aria-label="Choose Sunday, June 1, 2025 as your day."]') as HTMLButtonElement;
  39 |         if (dateButton) {
  40 |           dateButton.click();
  41 |         }
  42 |       }
  43 |     }
  44 |   });
  45 |
  46 |   // Select a time
  47 |   await page.evaluate(() => {
  48 |     const timeSlot = document.querySelector('.col-md-6 label') as HTMLLabelElement;
  49 |     if (timeSlot) {
  50 |       timeSlot.click();
  51 |     }
  52 |   });
  53 |
  54 |   // Fill in contact information
> 55 |   await page.fill('#name', 'John Doe');
     |              ^ Error: page.fill: Test timeout of 30000ms exceeded.
  56 |   await page.fill('#email', 'john.doe@example.com');
  57 |   await page.fill('#phone', '1234567890');
  58 |
  59 |   // Submit the appointment
  60 |   await page.click('input[type="submit"]');
  61 |
  62 |   // Verify the confirmation message
  63 |   await expect(page.locator('.alert.alert-success')).toContainText('Thank you! We will contact you to confirm your appointment. Please note that this is not a confirmation.');
  64 | });
  65 |
```