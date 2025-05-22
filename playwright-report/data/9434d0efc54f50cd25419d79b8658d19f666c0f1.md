# Test info

- Name: hello world test
- Location: /app/tests/hello-world.spec.ts:3:5

# Error details

```
Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3000/
Call log:
  - navigating to "http://localhost:3000/", waiting until "load"

    at /app/tests/hello-world.spec.ts:4:16
```

# Test source

```ts
  1 | import { test, expect } from '@playwright/test';
  2 |
  3 | test('hello world test', async ({ page }) => {
> 4 |     await page.goto('http://localhost:3000'); // Adjust the URL as needed
    |                ^ Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3000/
  5 |     const title = await page.title();
  6 |     expect(title).toBe('Hello World'); // Adjust the expected title as needed
  7 | });
```