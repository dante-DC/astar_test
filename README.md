# Astar Financial Automation Tests

This repository contains automated test scripts for the Astar Financial website using Playwright, featuring enhanced error handling, structured logging, and a modular architecture.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Project Structure](#project-structure)
- [Features](#features)
- [Running Tests](#running-tests)
- [Error Handling](#error-handling)
- [Logging](#logging)
- [Test Cases](#test-cases)
- [Contributing](#contributing)
- [License](#license)

---

## Prerequisites
1. **Node.js**: Ensure you have Node.js installed (version 16 or higher is recommended).
2. **Playwright**: Install Playwright by following the [official documentation](https://playwright.dev/docs/intro).

---

## Installation
1. Clone this repository:
   ```bash
   git clone https://github.com/your-repo/astar_test.git
   cd astar_test
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Install Playwright browsers:
   ```bash
   npx playwright install
   ```

---

## Project Structure
```
astar_test/
├── config/
│   └── config.ts                  # Environment and configuration settings
├── fixtures/
│   └── test-fixtures.ts          # Shared test fixtures and setup
├── pages/
│   ├── HomePage.ts               # Homepage interactions
│   ├── ApplyLoanPage.ts         # Loan application page
│   └── BookAppointmentPage.ts    # Appointment booking page
├── test-data/
│   └── linkStructure.json       # Test data for link verification
├── tests/
│   ├── astar-tests.spec.ts      # Main test specifications
│   ├── astar-applyLoan.spec.ts
│   └── astar-bookappointment.spec.ts
├── utils/
│   ├── dataGenerators.ts        # Test data generation utilities
│   ├── errors.ts               # Custom error handling
│   └── logger.ts              # Structured logging utility
├── .env                        # Environment variables
└── README.md
```

---

## Features
### Enhanced Error Handling
- Custom error classes for different types of failures:
  - `NavigationError`: Navigation-related failures
  - `ElementError`: Element interaction issues
  - `NetworkError`: Network-related problems
  - `TestError`: Base error class

### Structured Logging
- Comprehensive logging system with different levels:
  ```typescript
  const logger = Logger.create('HomePage');
  logger.info('Starting navigation');
  logger.error('Navigation failed', error);
  logger.debug('Element state', { visible: true });
  ```

### Page Object Model
- Modular page objects with encapsulated functionality
- Shared fixtures for common operations
- Type-safe interactions

---

## Running Tests
1. Run all tests:
   ```bash
   npx playwright test
   ```

2. Run a specific test file:
   ```bash
   npx playwright test tests/astar-applyLoan.spec.ts
   ```

3. Run tests in headed mode:
   ```bash
   npx playwright test --headed
   ```

4. View test results:
   ```bash
   npx playwright show-report
   ```

---

## Error Handling
### Custom Error Classes
```typescript
// Example usage
try {
  await page.navigate();
} catch (error) {
  if (error instanceof NavigationError) {
    logger.error('Navigation failed', error);
  } else if (error instanceof ElementError) {
    logger.error('Element interaction failed', error);
  }
}
```

---

## Logging
### Log Levels
- `INFO`: General information
- `WARNING`: Potential issues
- `ERROR`: Failures and errors
- `DEBUG`: Detailed debugging information

### Example
```typescript
logger.info('Test started', { testName: 'Apply Loan' });
logger.error('Test failed', error, { step: 'form submission' });
```

---

## Test Cases
### 1. Verify Links on Homepage
- **File**: `astar-links.spec.ts`
- **Description**: Verifies that all links on the homepage are functional and lead to the correct pages.
- **Test Case**: [testcase1.md](testcase1.md)

### 2. Apply for a Home Loan
- **File**: `astar-applyLoan.spec.ts`
- **Description**: Tests the loan application flow up to the OTP verification step.
- **Test Case**: [testcase2.md](testcase2.md)

### 3. Book an Appointment
- **File**: `astar-bookappointment.spec.ts`
- **Description**: Tests the appointment booking flow up to the OTP request step.
- **Test Case**: [testcase3.md](testcase3.md)

---

## Contributing
Contributions are welcome! Please follow these steps:
1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Commit your changes and push them to your fork.
4. Submit a pull request.

---

## License
This project is licensed under the [Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0).
