import { test, expect } from '@playwright/test';

test.describe('Form Validation Tests', () => {
  test('Signup required validation', async ({ page }) => {
    await page.goto('/signup');
    await page.click('button[type="submit"]');
    
    // Check if HTML5 validation or custom toast shows up
    const isHtml5Validation = await page.evaluate(() => {
      const form = document.querySelector('form');
      return form ? !form.checkValidity() : false;
    });
    
    if (!isHtml5Validation) {
      const errorToast = page.locator('.sonner-toast, [role="alert"]');
      await expect(errorToast).toBeVisible();
    }
  });
  
  test('Invalid Email format', async ({ page }) => {
    await page.goto('/signup');
    await page.fill('input[type="email"]', 'not-an-email');
    await page.click('button[type="submit"]');
    
    const isHtml5Validation = await page.evaluate(() => {
      const email = document.querySelector('input[type="email"]') as HTMLInputElement;
      return email ? !email.validity.valid : false;
    });
    
    expect(isHtml5Validation).toBe(true);
  });
});
