# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests/auth.spec.ts >> signup with email verification 0
- Location: tests/auth.spec.ts:15:7

# Error details

```
Error: Timed out waiting for OTP in pw-test-1776493837010.2446@ditapi.info after 30000ms
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e2]:
    - banner [ref=e3]:
      - generic [ref=e4]:
        - generic [ref=e5]:
          - link "Home" [ref=e6] [cursor=pointer]:
            - /url: /
            - button "Home" [ref=e7]:
              - img "Home" [ref=e8]
          - navigation "Main" [ref=e9]:
            - list [ref=e11]:
              - listitem [ref=e12]:
                - button "Server Side" [ref=e13] [cursor=pointer]:
                  - text: Server Side
                  - img [ref=e14]
              - listitem [ref=e16]:
                - link "Client Side" [ref=e17] [cursor=pointer]:
                  - /url: /client-example
        - button "Sign In" [ref=e19] [cursor=pointer]
    - main [ref=e20]:
      - generic [ref=e21]:
        - heading "Sign in to your account" [level=2] [ref=e23]
        - generic [ref=e26]:
          - generic [ref=e27]:
            - generic [ref=e28]: One-Time Password (OTP)
            - textbox "One-Time Password (OTP)" [ref=e30]
            - paragraph [ref=e31]: Please enter the verification code sent to your email.
          - button "Verify OTP" [ref=e33] [cursor=pointer]
    - contentinfo [ref=e34]:
      - generic [ref=e35]:
        - link "Documentation" [ref=e36] [cursor=pointer]:
          - /url: https://nextjs.authjs.dev
          - generic [ref=e37]: Documentation
          - img [ref=e38]
        - link "NPM" [ref=e42] [cursor=pointer]:
          - /url: https://www.npmjs.com/package/next-auth
          - generic [ref=e43]: NPM
          - img [ref=e44]
        - link "Source on GitHub" [ref=e48] [cursor=pointer]:
          - /url: https://github.com/nextauthjs/next-auth/tree/main/apps/examples/nextjs
          - generic [ref=e49]: Source on GitHub
          - img [ref=e50]
        - link "Policy" [ref=e54] [cursor=pointer]:
          - /url: /policy
      - generic [ref=e55]:
        - img "Auth.js Logo" [ref=e56]
        - link "5.0.0-beta.30" [ref=e57] [cursor=pointer]:
          - /url: https://npmjs.org/package/next-auth
          - generic [ref=e58]: 5.0.0-beta.30
          - img [ref=e59]
  - button "Open Next.js Dev Tools" [ref=e68] [cursor=pointer]:
    - img [ref=e69]
  - alert [ref=e72]
```

# Test source

```ts
  1  | import { test, expect } from "@playwright/test";
  2  | import { FreecustomEmailClient } from "freecustom-email";
  3  | 
  4  | const apiKey = process.env.FCE_API_KEY;
  5  | 
  6  | if (!apiKey) {
  7  |   throw new Error("FCE_API_KEY environment variable is missing.");
  8  | }
  9  | 
  10 | const fce = new FreecustomEmailClient({
  11 |   apiKey: apiKey,
  12 | });
  13 | 
  14 | for (let i = 0; i < 10; i++) {
  15 |   test(`signup with email verification ${i}`, async ({ page }) => {
  16 |     // Stagger requests to avoid rate limiting
  17 |     await new Promise(r => setTimeout(r, i * 100));
  18 | 
  19 |     const inbox = `pw-test-${Date.now() + Math.random()}@ditapi.info`;
  20 | 
  21 |     await fce.inboxes.register(inbox, true);
  22 |     await fce.inboxes.startTest(inbox, "e2e-signup-1");
  23 | 
  24 |     await page.goto("http://localhost:3000/auth/signin");
  25 |     await page.fill('[name="email"]', inbox);
  26 |     await page.fill('[name="password"]', "Str0ng!Pass#99");
  27 |     await page.click('[type="submit"]');
  28 | 
> 29 |     const otp = await fce.otp.waitFor(inbox, { timeoutMs: 30_000 });
     |                 ^ Error: Timed out waiting for OTP in pw-test-1776493837010.2446@ditapi.info after 30000ms
  30 | 
  31 |     await page.fill('[name="otp"]', otp);
  32 |     await page.click('[data-testid="verify-btn"]');
  33 | 
  34 |     await expect(page).toHaveURL("http://localhost:3000/dashboard");
  35 | 
  36 |   });
  37 | }
  38 | 
```