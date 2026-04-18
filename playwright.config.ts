import { defineConfig } from "@playwright/test";

export default defineConfig({
  fullyParallel: true,
  workers: 10,
  timeout: 60_000,
  retries: 2,
  use: { baseURL: "http://localhost:3000" },
});