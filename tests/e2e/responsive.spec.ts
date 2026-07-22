import { test, expect } from '@playwright/test';
import inventory from './inventory';

const viewports = [
  { width: 320, height: 568 },
  { width: 375, height: 667 },
  { width: 768, height: 1024 },
  { width: 1440, height: 900 }
];

test.describe('Responsive Tests', () => {
  for (const v of viewports) {
    test.describe(`Viewport ${v.width}x${v.height}`, () => {
      test.use({ viewport: v });
      
      test('Home Page renders correctly', async ({ page }) => {
        await page.goto('/');
        
        // Assert no horizontal scroll (except what we explicitly allow)
        const overflow = await page.evaluate(() => {
          return document.documentElement.scrollWidth > window.innerWidth;
        });
        
        // In this phase we don't fix bugs, just test and report
        expect(overflow).toBe(false);
      });
    });
  }
});
