# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests/auth.spec.ts >> signup with email verification 2
- Location: tests/auth.spec.ts:9:7

# Error details

```
RateLimitError: Rate limit exceeded. Upgrade to Pro for higher limits. Retry in 1s.
```

# Test source

```ts
  1  | import { test, expect } from "@playwright/test";
  2  | import { FreecustomEmailClient } from "freecustom-email";
  3  | 
  4  | const fce = new FreecustomEmailClient({
  5  |   apiKey: process.env.FCE_API_KEY || "fce_87d4fe140cb1e12d51a3ef91a337390d732b07bb7acdf678db115089b2adc2e0",
  6  | });
  7  | 
  8  | for (let i = 0; i < 10; i++) {
  9  |   test(`signup with email verification ${i}`, async ({ page }) => {
  10 |     const inbox = `pw-test-${Date.now() + Math.random()}@ditapi.info`;
  11 |     
> 12 |     await fce.inboxes.register(inbox);
     |     ^ RateLimitError: Rate limit exceeded. Upgrade to Pro for higher limits. Retry in 1s.
  13 | 
  14 |     await page.goto("http://localhost:3000/auth/signin");
  15 |     await page.fill('[name="email"]', inbox);
  16 |     await page.fill('[name="password"]', "Str0ng!Pass#99");
  17 |     await page.click('[type="submit"]');
  18 | 
  19 |     const otp = await fce.otp.waitFor(inbox, { timeoutMs: 30_000 });
  20 | 
  21 |     await page.fill('[name="otp"]', otp);
  22 |     await page.click('[data-testid="verify-btn"]');
  23 | 
  24 |     await expect(page).toHaveURL("http://localhost:3000/dashboard");
  25 |     
  26 |     await fce.inboxes.unregister(inbox);
  27 |   });
  28 | }
```