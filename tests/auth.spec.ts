import { test, expect } from "@playwright/test";
import { FreecustomEmailClient } from "freecustom-email";

const fce = new FreecustomEmailClient({
  apiKey: process.env.FCE_API_KEY || "fce_87d4fe140cb1e12d51a3ef91a337390d732b07bb7acdf678db115089b2adc2e0",
});

for (let i = 0; i < 10; i++) {
  test(`signup with email verification ${i}`, async ({ page }) => {
    // Stagger requests to avoid rate limiting
    await new Promise(r => setTimeout(r, i * 100));
    
    const inbox = `pw-test-${Date.now() + Math.random()}@ditapi.info`;
    
    await fce.inboxes.register(inbox);

    await page.goto("http://localhost:3000/auth/signin");
    await page.fill('[name="email"]', inbox);
    await page.fill('[name="password"]', "Str0ng!Pass#99");
    await page.click('[type="submit"]');

    const otp = await fce.otp.waitFor(inbox, { timeoutMs: 30_000 });

    await page.fill('[name="otp"]', otp);
    await page.click('[data-testid="verify-btn"]');

    await expect(page).toHaveURL("http://localhost:3000/dashboard");
    
    await fce.inboxes.unregister(inbox);
  });
}