# Astar Financial Automation Tests

This repository contains automated test scripts for the Astar Financial website using Playwright. The tests cover various functionalities such as verifying links, applying for a home loan, and booking an appointment.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Test Structure](#test-structure)
- [Running Tests](#running-tests)
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

## Test Structure
The repository is organized as follows:

```
astar_test/
├── tests/
│   ├── astar-links.spec.ts          # Tests for verifying links on the homepage
│   ├── astar-applyLoan.spec.ts      # Tests for applying for a home loan
│   ├── astar-bookappointment.spec.ts # Tests for booking an appointment
│   ├── astar-tests.spec.ts          # Consolidated tests using Page Object Model
├── testcase1.md                     # Test case for verifying links
├── testcase2.md                     # Test case for applying for a home loan
├── testcase3.md                     # Test case for booking an appointment
└── README.md                        # Documentation for the repository
```

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
