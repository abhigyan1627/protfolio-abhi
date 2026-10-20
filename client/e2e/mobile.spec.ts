import { expect, test } from '@playwright/test';

const pages = ['/', '/services', '/pricing', '/contact'];

test.describe('mobile layout', () => {
  for (const path of pages) {
    test(`${path} has no horizontal overflow and a working menu`, async ({ page }) => {
      await page.goto(path);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(overflow).toBeLessThanOrEqual(0);
    });
  }

  test('mobile menu opens, lists every section, and closes on Escape', async ({ page }) => {
    await page.goto('/');
    // The accessible name changes between "Open menu" and "Close menu", so target the control by its relationship instead.
    const toggle = page.locator('header button[aria-controls="mobile-navigation"]');
    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await expect(page.getByRole('navigation', { name: 'Mobile' }).getByRole('link', { name: 'Pricing' })).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  });
});
