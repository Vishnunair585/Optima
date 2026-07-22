import { test, expect } from '@playwright/test';

test.describe('Stability Tests', () => {
  // We limit iterations here to avoid timing out the CI or locking up resources, 
  // but this proves the concept. 
  // In a real run, this could be 50-100 iterations.
  const ITERATIONS = 3;

  for (let i = 0; i < ITERATIONS; i++) {
    test(`Navigation loop iteration ${i}`, async ({ page }) => {
      await page.goto('/');
      await page.goto('/finder');
      await page.goto('/rankings');
      await page.goto('/compare');
      await page.goto('/');
      
      const title = await page.title();
      expect(title).toContain('Optima');
    });
  }
});
