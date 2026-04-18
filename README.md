<div align="center">
  <h1>FreeCustom.Email</h1>
  <p><strong>Next Auth Example Application & Playwright Tests</strong></p>
</div>

## About

This repository contains the `fce-example-next-auth` project, which serves as a comprehensive example repository for developers looking to test and integrate their **NextAuth.js**-based applications with **FreeCustom.Email's SDK**. 

This example demonstrates how to seamlessly integrate our temporary, privacy-focused email service into a Next.js application, enabling smooth, reliable authentication flows (such as magic links, OTPs, and credential validations) in testing environments using **Playwright**.

## Features

- **Next Auth Integration**: A fully functional Next.js application utilizing `next-auth` for authentication.
- **SDK Example**: Clear, structured examples showing how to interact with the FreeCustom.Email SDK to retrieve, parse, and verify emails automatically during tests.
- **Modern UI/UX**: Includes a beautifully styled sign-in and authentication flow inspired by NextAuth's default minimalist and accessible design.
- **Playwright Testing Ready**: Easily integrate your automated end-to-end tests using this boilerplate as a starting point.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/en/) (v16 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- A FreeCustom.Email account / API keys

### Environment Variables setup

You need to set up environment variables for both the main Playwright tests and the NextAuth application. 

1. **Main Playwright Tests Environment (`/.env`):**
   Copy the `/.env.example` to `/.env`:
   ```bash
   cp .env.example .env
   ```
   **Required Variables:**
   - `FCE_API_KEY`: Your FreeCustom.Email API key. 
     - **Get it here:** [API Dashboard - Keys](https://www.freecustom.email/api/dashboard?tab=keys) *(Requires Auth on FreeCustom.Email)*

2. **Next Auth App Environment (`/next-auth-example/.env`):**
   Navigate to the Next Auth app directory and copy the `.env.example`:
   ```bash
   cd next-auth-example
   cp .env.example .env
   ```
   **Required Variables:**
   - `AUTH_RESEND_KEY`: Your Resend API key for sending emails.
   - `EMAIL_FROM`: Sender email address (e.g., auth@freecustom.email).
   - `AUTH_SECRET`: Secret for NextAuth.

### Running the Project & Tests

1. **Start the Next.js development server:**
   In the `next-auth-example` folder, run:
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:3000`.

2. **Run Playwright tests:**
   In the root folder of this repository, run:
   ```bash
   npx playwright test --ui
   ```

## Using FreeCustom.Email SDK in Playwright Tests

Below is an example of our testing script from `tests/auth.spec.ts`.

```typescript
import { test, expect } from "@playwright/test";
import { FreecustomEmailClient } from "freecustom-email";

const apiKey = process.env.FCE_API_KEY;

if (!apiKey) {
  throw new Error("FCE_API_KEY environment variable is missing.");
}

const fce = new FreecustomEmailClient({
  apiKey: apiKey,
});

for (let i = 0; i < 10; i++) {
  test(`signup with email verification ${i}`, async ({ page }) => {
    // Stagger requests to avoid rate limiting
    await new Promise(r => setTimeout(r, i * 100));

    const inbox = `pw-test-${Date.now() + Math.random()}@ditapi.info`;

    await fce.inboxes.register(inbox, true);
    await fce.inboxes.startTest(inbox, "e2e-signup-1");

    await page.goto("http://localhost:3000/auth/signin");
    await page.fill('[name="email"]', inbox);
    await page.fill('[name="password"]', "Str0ng!Pass#99");
    await page.click('[type="submit"]');

    // NOTE: waitForOtp functionality requires a paid plan!
    const otp = await fce.otp.waitFor(inbox, { timeoutMs: 30_000 });

    await page.fill('[name="otp"]', otp);
    await page.click('[data-testid="verify-btn"]');

    await expect(page).toHaveURL("http://localhost:3000/dashboard");

    // YOU CAN CUSTOMIZE THIS BEHAVIOR:
    // It's a good practice to unregister the used inbox at the end of the test.
    // await fce.inboxes.unregister(inbox);
    // Alternatively, using the client: await fce.inboxes.unregister(inbox);
  });
}
```

**Important Notes for Testing:**
- **Debugging:** If you are having issues receiving emails or tracking requests, visit the [Debugging Events Dashboard](https://www.freecustom.email/api/dashboard?tab=events) *(Requires Auth on FreeCustom.Email)*.
- **Paid Feature:** The `waitForOtp` function shown in the example requires a paid plan to work. Check pricing here: [FreeCustom.Email Pricing](https://www.freecustom.email/api/pricing).

## Support & Contact

- **Contact Page:** [https://www.freecustom.email/contact](https://www.freecustom.email/contact)
- **Support Email:** dishant@dishs.tech

## License

This project is licensed under the Apache License 2.0. See the [LICENSE](LICENSE) file for details.
