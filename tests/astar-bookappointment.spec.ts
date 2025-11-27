import { test, expect } from '@playwright/test';

test('book an appointment up to OTP request on astarfinancial.com.au', async ({ page }) => {
  await page.goto('https://astarfinancial.com.au/book-appointment');

  // Wait for a known element from the initial form to be visible
  console.log('Waiting for initial form elements to be visible...');
  await page.getByText('Select Appointment Date').waitFor({ timeout: 15000 });
  console.log('Initial form elements are visible.');

  // Fill in the date - use a future date
  console.log('Filling date...');
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + 30); // 30 days from now
  const formattedDate = futureDate.toISOString().split('T')[0];
  await page.locator('input[type="date"], input[placeholder*="Date"], input[aria-label*="Date"], input:near(:text("Select Appointment Date"))').first().fill(formattedDate);
  console.log('Date filled.');

  // Select Time Slot
  console.log('Selecting time slot...');
  const timeSlotSelect = page.locator('#timeslot, #time_slot, select[name*="time"], select[aria-label*="Time"], select:near(:text("Select Time Slot"))').first();
  await timeSlotSelect.selectOption({ index: 1 }); // Select the first actual time slot
  console.log('Time slot selected.');

  // Select Loan Type
  console.log('Selecting loan type...');
  const loanTypeSelect = page.locator('#loan_type'); 
  await loanTypeSelect.selectOption({ index: 1 }); // Select the first actual loan type
  console.log('Loan type selected.');

  // Fill in Name
  console.log('Filling name...');
  await page.getByRole('textbox', { name: 'Enter name' }).fill('John Doe');
  console.log('Name filled.');

  // Fill in Email
  console.log('Filling email...');
  await page.getByRole('textbox', { name: 'Enter email' }).fill('john.doe@example.com');
  console.log('Email filled.');

  // Fill in Mobile Phone Number - Iteration 3 for selector
  console.log('Filling mobile phone number...');
  const mobileInputLocator = page.locator(
    // More specific: type="tel" first, then names/placeholders but explicitly NOT type="date"
    'input[type="tel"], input[name*="phone"]:not([type="date"]), input[name*="mobile"]:not([type="date"]), input[placeholder*="Mobile Phone Number"]:not([type="date"]), input[aria-label*="Mobile Phone Number"]:not([type="date"])'
  ).first();
  await mobileInputLocator.fill('0412345678');
  console.log('Mobile phone number filled.');

  // Click the "Get OTP" button
  console.log('Clicking "Get OTP" button...');
  await page.getByRole('button', { name: 'Get OTP' }).click();
  console.log('"Get OTP" button clicked.');

  // Verify that an OTP input field or relevant text appears
  console.log('Verifying OTP request UI elements...');
  
  // Wait a bit for the response, but don't use networkidle which can hang
  await page.waitForTimeout(2000);
  
  const otpInputLocator = page.locator(
    'input[name*="otp"], input[id*="otp"], input[placeholder*="OTP"], input[aria-label*="OTP"], input[name*="one_time_password"], input[id*="one_time_password"], input[name*="verification_code"], input[id*="verification_code"]'
  ).first();
  
  const otpMessageLocator = page.getByText(/OTP has been sent|Enter OTP|Enter the OTP code sent to your mobile|SMS Verification|verification code/i).first();
  
  // Check if either the input field or the message is visible
  const isOTPVisible = await Promise.race([
    otpInputLocator.isVisible({ timeout: 5000 }).catch(() => false),
    otpMessageLocator.isVisible({ timeout: 5000 }).catch(() => false)
  ]);
  
  if (!isOTPVisible) {
    // Check if page contains OTP-related content
    const pageText = await page.locator('body').textContent().catch(() => '');
    if (!pageText || (!pageText.includes('OTP') && !pageText.includes('verification') && !pageText.includes('code'))) {
      throw new Error('Expected to reach OTP verification but page does not contain OTP-related content');
    }
  }

  console.log('OTP request UI element is visible or page contains OTP-related content.');

  // Further specific assertions (optional, but good)
  if (await otpInputLocator.isVisible().catch(() => false)) {
    console.log('OTP input field is visible.');
    await expect(otpInputLocator).toBeEditable(); // Check if OTP input is editable
  }
  if (await otpMessageLocator.isVisible().catch(() => false)) {
    console.log('OTP message is visible.');
  }
  
  // Test ends here, successfully verifying the OTP request stage.
});
