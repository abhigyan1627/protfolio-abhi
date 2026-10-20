import { defineConfig, devices } from '@playwright/test';

// Run against a running stack: API on E2E_API_URL and the built site on E2E_BASE_URL.
// Admin tests need E2E_ADMIN_EMAIL and E2E_ADMIN_PASSWORD for an existing account. Nothing is hardcoded.
const chromiumPath = process.env['PLAYWRIGHT_CHROMIUM_PATH'];

export default defineConfig({
  testDir: './e2e',
  timeout: 45_000,
  fullyParallel: false,
  workers: 1,
  reporter: [['list']],
  use: {
    baseURL: process.env['E2E_BASE_URL'] ?? 'http://localhost:4173',
    trace: 'retain-on-failure',
    launchOptions: chromiumPath ? { executablePath: chromiumPath } : {},
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 900 } }, testIgnore: /mobile\.spec\.ts/ },
    { name: 'mobile', use: { ...devices['Pixel 7'] }, testMatch: /mobile\.spec\.ts/ },
  ],
});
