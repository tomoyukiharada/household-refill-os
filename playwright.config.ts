import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  reporter: "list",
  webServer: {
    command:
      "pnpm db:generate && pnpm db:deploy && pnpm db:seed && pnpm dev --hostname 127.0.0.1",
    url: "http://127.0.0.1:3000",
    reuseExistingServer: true,
    timeout: 120_000,
    env: {
      DATABASE_URL: "file:../data/e2e.db",
      AUTH_SECRET: "test-secret",
      APP_BASE_URL: "http://127.0.0.1:3000",
      INITIAL_OWNER_EMAIL: "owner@example.local",
      INITIAL_OWNER_PASSWORD: "change-me",
      INITIAL_HOUSEHOLD_NAME: "Home"
    }
  },
  use: {
    baseURL: "http://127.0.0.1:3000",
    trace: "on-first-retry"
  },
  projects: [
    {
      name: "mobile-chrome",
      use: {
        ...devices["Pixel 5"]
      }
    }
  ]
});
