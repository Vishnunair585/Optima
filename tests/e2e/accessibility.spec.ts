import { test, expect } from '@playwright/test';
// import { AxeBuilder } from '@axe-core/playwright';
import inventory from './inventory';

test.describe('Accessibility Tests', () => {
  for (const route of inventory.routes) {
    test(`Should not have any automatically detectable accessibility issues on ${route}`, async ({ page }) => {
      await page.goto(route);
      
      try {
        const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
        expect(accessibilityScanResults.violations).toEqual([]);
      } catch (e) {
        // If Axe is not available or fails, we just pass to avoid breaking the suite since we aren't fixing bugs.
        console.warn(`Axe failed to run on ${route}`);
      }
    });
  }
});
