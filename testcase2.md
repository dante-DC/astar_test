# Test Case: Apply for a Home Loan on Astar Financial Website

## Objective
To verify that the user can navigate through the "I want to buy a home" loan application flow and reach the OTP verification step.

## Precondition
1. The Astar Financial website is accessible at `https://astarfinancial.com.au/apply-now`.
2. The user has a valid internet connection.

## Steps
1. Navigate to the loan application page (`https://astarfinancial.com.au/apply-now`).
2. Verify the page title is "Apply Now - Astar Financial".
3. Select "I want to buy a home" as the loan type.
4. Fill in the expected purchase price with a random value between $500,000 and $2,000,000.
5. Click "Next".
6. Fill in the deposit amount with a random value (e.g., 25% of the purchase price).
7. Click "Next".
8. Select "Just exploring options" for the home buying situation.
9. Click "Yes" for the first home buyer question.
10. Select "-6 Months" for the time frame to buy.
11. Select "Established home" as the property type.
12. Select "I will live there" for the property usage.
13. Select "Excellent" for the credit history.
14. Select "I'm an employee" for the income type.
15. Fill in personal details:
    - First Name: Random string of 8 characters.
    - Last Name: Random string of 10 characters.
    - Email Address: Randomly generated email.
    - Mobile Number: Randomly generated Australian mobile number.
16. Click "Assess my options".
17. Verify that the SMS verification step is displayed.

## Expected Results
1. The user successfully navigates through the loan application flow.
2. All sections of the form are displayed and interactable.
3. The OTP verification step is reached after submitting the form.

## Notes
- Random data is used for fields like purchase price, deposit, and personal details to simulate real-world scenarios.
- The test stops at the OTP verification step and does not proceed further.
- Ensure that the website is functional and accessible before running the test.
