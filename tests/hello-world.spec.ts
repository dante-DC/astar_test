import { test, expect } from '@playwright/test';

test('hello world test', async ({ page }) => {
    await page.goto('http://localhost:3000'); // Adjust the URL as needed
    const title = await page.title();
    expect(title).toBe('Hello World'); // Adjust the expected title as needed
});