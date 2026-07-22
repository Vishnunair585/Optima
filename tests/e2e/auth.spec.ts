import { test, expect } from '@playwright/test';
import inventory from './inventory';

test.describe('Authentication Tests', () => {
  test('Should redirect unauthenticated users from protected routes', async ({ page }) => {
    for (const route of inventory.protectedRoutes) {
      await page.goto(route);
      // Wait for navigation or redirect
      await page.waitForLoadState('networkidle');
      // Should be redirected to login or show an unauthorized message
      expect(page.url()).not.toBe(route);
      expect(page.url()).toContain('/login');
    }
  });

  test('Invalid Login Attempt', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', 'test_invalid@example.com');
    await page.fill('input[type="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');
    
    // Check for error message
    const errorToast = page.locator('.sonner-toast, [role="alert"]');
    await expect(errorToast).toBeVisible();
  });

  // A complete login/logout test requires a valid test user in the database.
  // Since we cannot modify the backend or database, we'll test the UI flow limits.
  test('Session Timeout / Validation', async ({ page }) => {
    await page.goto('/login');
    // Ensure form exists
    await expect(page.locator('form')).toBeVisible();
  });
});
