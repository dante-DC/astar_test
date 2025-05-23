# Test Case: Book an Appointment on Astar Financial Website

## Objective
To verify that the user can book an appointment on the Astar Financial website and reach the OTP request step.

## Precondition
1. The Astar Financial website is accessible at `https://astarfinancial.com.au/book-appointment`.
2. The user has a valid internet connection.

## Steps
1. Navigate to the appointment booking page (`https://astarfinancial.com.au/book-appointment`).
2. Verify the page title is "Book Appointment - Astar Financial".
3. Fill in the appointment date with a valid future date (e.g., `2025-06-01`).
4. Select a time slot from the available options.
5. Select a loan type from the available options.
6. Fill in the mobile phone number with a valid Australian mobile number (e.g., `0412345678`).
7. Click the "Get OTP" button.
8. Verify that the OTP input field or a relevant message (e.g., "OTP has been sent") is displayed.

## Expected Results
1. The user successfully navigates to the appointment booking page.
2. All fields in the appointment booking form are displayed and interactable.
3. The OTP request step is reached after submitting the form.

## Notes
- Ensure that the website is functional and accessible before running the test.
- The test stops at the OTP request step and does not proceed further.
