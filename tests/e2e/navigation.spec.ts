import { test, expect } from '@playwright/test';
import inventory from './inventory';

test.describe('Navigation Tests', () => {
  for (const route of inventory.routes) {
    test(`Should navigate to ${route} successfully`, async ({ page }) => {
      const response = await page.goto(route);
      expect(response?.status()).toBeLessThan(400);
      
      // Verify no basic console errors (we can't catch all here, but we check title)
      const title = await page.title();
      expect(title).not.toBe('');
    });
  }

  test('Should handle 404 pages gracefully', async ({ page }) => {
    const response = await page.goto('/this-route-does-not-exist');
    // Check if the application catches the 404 or shows a not found page
    // Optima might return a 200 with a 404 React component, or a 404 status.
    const content = await page.textContent('body');
    expect(content?.toLowerCase()).toContain('not found');
  });

  test('Browser Back and Forward', async ({ page }) => {
    await page.goto('/');
    await page.goto('/finder');
    await page.goBack();
    expect(page.url()).toContain('/');
    await page.goForward();
    expect(page.url()).toContain('/finder');
  });
});
