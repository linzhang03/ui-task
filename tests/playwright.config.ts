import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig, devices } from "@playwright/test";

const currentDir = dirname(fileURLToPath(import.meta.url));
const appDir = existsSync("/app/index.html") ? "/app" : resolve(currentDir, "..");

/**
 * E2E tests run against the app at /app (served by webServer).
 */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: true,
  retries: 0,
  workers: 1,
  reporter: "list",
  use: {
    baseURL: "http://localhost:3000",
    trace: "off",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  // Serve the sandbox app in the verifier and the workspace root during local runs.
  webServer: {
    command: `npx serve "${appDir}" -p 3000`,
    url: "http://localhost:3000",
    reuseExistingServer: false,
    timeout: 15_000,
  },
});
