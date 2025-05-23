export function getRandomString(length: number): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function getRandomEmail(): string {
  return `${getRandomString(10)}@example.com`;
}

export function getRandomMobile(): string {
  return `04${Math.floor(Math.random() * 100000000).toString().padStart(8, '0')}`;
}

export function getRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getRandomDateOfBirth(): string {
  const year = getRandomNumber(1970, 2000);
  const month = getRandomNumber(1, 12).toString().padStart(2, '0');
  const day = getRandomNumber(1, 28).toString().padStart(2, '0');
  return `${day}/${month}/${year}`;
}

export interface LoanApplicationData {
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  dateOfBirth: string;
}

export class TestDataFactory {
  static createRandomLoanApplication(): LoanApplicationData {
    return {
      firstName: getRandomString(8),
      lastName: getRandomString(10),
      email: getRandomEmail(),
      mobile: getRandomMobile(),
      dateOfBirth: getRandomDateOfBirth(),
    };
  }
}