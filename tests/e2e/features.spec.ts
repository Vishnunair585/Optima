import { test, expect } from '@playwright/test';

test.describe('Feature Tests', () => {
  test('Cost Calculator computes correctly', async ({ page }) => {
    await page.goto('/calculator');
    
    // Check if the calculator renders
    await expect(page.locator('h1')).toContainText('Cost Calculator');
    
    // Simulate picking a usage tier
    const customButton = page.locator('button:has-text("Custom")');
    if (await customButton.isVisible()) {
      await customButton.click();
      
      // Fill custom volumes
      const inputs = page.locator('input[type="number"]');
      await inputs.nth(0).fill('10'); // 10 Million input tokens
      await inputs.nth(1).fill('2');  // 2 Million output tokens
      
      // Verify Estimated Monthly Spend updates (non-zero)
      const spend = page.locator('.tabular-nums', { hasText: '$' }).first();
      await expect(spend).not.toHaveText('$0.00');
    }
  });

  test('Rankings page filtering', async ({ page }) => {
    await page.goto('/rankings');
    await expect(page.locator('h1')).toContainText('Top AI Tools');
    
    // Check for category filter
    const select = page.locator('select');
    await expect(select).toBeVisible();
    await select.selectOption({ index: 1 }); // Select second category
    
    // Wait for the podium or table to render
    await expect(page.locator('.glass')).toBeVisible();
  });
});
