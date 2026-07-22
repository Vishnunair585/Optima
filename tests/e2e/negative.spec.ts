import { test, expect } from '@playwright/test';

test.describe('Negative Tests', () => {
  test('Double clicking submit button', async ({ page }) => {
    await page.goto('/login');
    // Fast double click
    await page.dblclick('button[type="submit"]', { force: true });
    
    // Test passes if app doesn't crash (we just check it's still alive)
    await expect(page.locator('form')).toBeVisible();
  });
  
  test('Invalid query parameters', async ({ page }) => {
    await page.goto('/rankings?category=invalid-category-12345');
    // App should handle it gracefully, e.g. falling back to "All" or showing no results
    await expect(page.locator('h1')).toBeVisible();
  });
});
