import { expect, test } from '@playwright/test';

test.describe('public site', () => {
  test('contact form validates, then submits and shows a server reference', async ({ page }) => {
    await page.goto('/contact', { waitUntil: 'networkidle' });
    await page.getByRole('button', { name: 'Send enquiry' }).click();
    await expect(page.getByText('Please enter your name.')).toBeVisible();
    await expect(page.getByText('Thank you. Your enquiry is with us.')).toHaveCount(0);

    await page.getByLabel('Full name').fill('E2E Visitor');
    await page.getByLabel('Mobile number').fill('62990 33454');
    await page.getByLabel(/I have read the/).check();
    await page.waitForTimeout(1200);
    await page.getByRole('button', { name: 'Send enquiry' }).click();

    await expect(page.getByText('Thank you. Your enquiry is with us.')).toBeVisible();
    await expect(page.locator('strong[translate="no"]')).toHaveText(/^CMA-\d{4}-[A-Z2-9]{6}$/);
  });

  test('services filter narrows to one category', async ({ page }) => {
    await page.goto('/services');
    await page.getByRole('button', { name: 'GST', exact: true }).click();
    await expect(page).toHaveURL(/category=GST/);
    await expect(page.locator('ul li article h3')).toHaveCount(4);
  });

  test('pricing tabs switch audience and comparison appears for two plans', async ({ page }) => {
    await page.goto('/pricing');
    await page.getByRole('tab', { name: 'Business', exact: true }).click();
    await expect(page).toHaveURL(/audience=BUSINESS/);
    await expect(page.locator('[role=tabpanel] article')).toHaveCount(3);

    await page.locator('[role=tabpanel] input[type=checkbox]').nth(0).check();
    await page.locator('[role=tabpanel] input[type=checkbox]').nth(1).check();
    await expect(page.getByRole('table')).toBeVisible();
  });

  test('service finder reaches a WhatsApp link with the chosen service', async ({ page }) => {
    await page.goto('/services#finder');
    await page.getByRole('button', { name: 'Next' }).click();
    await expect(page.getByText('Choose who needs assistance to continue.')).toBeVisible();

    await page.getByRole('radio', { name: /^Business/ }).check({ force: true });
    await page.getByRole('button', { name: 'Next' }).click();
    await page.getByRole('radio', { name: /^GST Registration Assistance/ }).check({ force: true });
    await page.getByRole('button', { name: 'Next' }).click();
    await page.getByRole('radio', { name: /^Request a custom quotation/ }).check({ force: true });
    await page.getByRole('button', { name: 'Next' }).click();

    const link = page.getByRole('link', { name: /Continue on WhatsApp/ });
    await expect(link).toHaveAttribute('href', /^https:\/\/wa\.me\/916299033454\?text=/);
    await expect(link).toHaveAttribute('href', /GST%20Registration%20Assistance/);
  });

  test('unknown routes show the not-found page', async ({ page }) => {
    await page.goto('/this-page-does-not-exist');
    await expect(page.getByRole('heading', { name: 'Page not found' })).toBeVisible();
  });
});

test.describe('admin area', () => {
  test.skip(!process.env['E2E_ADMIN_EMAIL'] || !process.env['E2E_ADMIN_PASSWORD'], 'Set E2E_ADMIN_EMAIL and E2E_ADMIN_PASSWORD to run admin tests.');

  test('redirects anonymous visitors to sign-in, then signs in and updates an enquiry', async ({ page }) => {
    await page.goto('/admin/dashboard');
    await expect(page).toHaveURL(/\/admin\/login/);

    await page.getByLabel('Email').fill(process.env['E2E_ADMIN_EMAIL'] ?? '');
    await page.getByLabel('Password').fill(process.env['E2E_ADMIN_PASSWORD'] ?? '');
    await page.getByRole('button', { name: 'Sign in' }).click();
    await expect(page).toHaveURL(/\/admin\/dashboard/);

    await page.getByRole('navigation', { name: 'Admin' }).getByRole('link', { name: 'Enquiries' }).click();
    await page.getByRole('button', { name: /^Open/ }).first().click();
    const dialog = page.getByRole('dialog', { name: 'Enquiry details' });
    await expect(dialog).toBeVisible();
    await dialog.getByLabel('Status').selectOption('CONTACTED');
    await dialog.getByRole('button', { name: 'Save update' }).click();
    await expect(dialog.getByText('Enquiry updated.')).toBeVisible();
  });
});
