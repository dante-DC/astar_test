// Tests
import { test } from '../fixtures/test-fixtures';

test.describe('Astar Financial Tests', () => {
  test('Verify all links on the homepage', async ({ homePage }) => {
    await homePage.navigate(); // Navigate to the homepage
    await homePage.verifyLinks(); // Verify all links on the homepage
  });

  test('Apply for a home loan', async ({ applyLoanPage }) => {
    console.log('Starting test: Apply for a home loan');
    await applyLoanPage.navigate(); // Navigate to the loan application page
    await applyLoanPage.fillLoanApplication(); // Fill out the loan application form
    console.log('Test completed: Apply for a home loan');
  });

  test('Book an appointment', async ({ bookAppointmentPage }) => {
    console.log('Starting test: Book an appointment');
    await bookAppointmentPage.navigate(); // Navigate to the appointment booking page
    await bookAppointmentPage.bookAppointment(); // Book an appointment
    console.log('Test completed: Book an appointment');
  });
});
