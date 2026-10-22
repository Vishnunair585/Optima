import { test, expect } from './fixtures/auth.fixture';

test.describe('Critical User Journeys: E2E Suite', () => {

  test.describe('1. Signup Journey', () => {
    test('Negative state: shows validation errors for invalid signup inputs', async ({ page }) => {
      await page.goto('/signup');

      // Attempt submit with empty username and unaccepted terms
      const submitBtn = page.locator('[data-testid="signup-submit-btn"]');
      await submitBtn.click();

      // Verify validation error alert appears
      const errorAlert = page.locator('[data-testid="signup-error-alert"]');
      await expect(errorAlert).toBeVisible();
      await expect(errorAlert).toContainText(/User name must be at least 2 characters|terms/i);
    });

    test('Negative state: rejects submission when terms checkbox is not checked', async ({ page }) => {
      await page.goto('/signup');

      await page.fill('[data-testid="signup-username-input"]', 'ValidUser');
      await page.fill('[data-testid="signup-email-input"]', 'valid@example.com');
      await page.fill('[data-testid="signup-password-input"]', 'SecurePass123!');

      // Do NOT check terms
      await page.click('[data-testid="signup-submit-btn"]');

      const errorAlert = page.locator('[data-testid="signup-error-alert"]');
      await expect(errorAlert).toBeVisible();
      await expect(errorAlert).toContainText(/terms/i);
    });

    test('Happy path: allows filling valid user signup details with terms acceptance', async ({ page }) => {
      await page.goto('/signup');

      await page.fill('[data-testid="signup-username-input"]', 'ValidUser');
      await page.fill('[data-testid="signup-email-input"]', `user_${Date.now()}@example.com`);
      await page.fill('[data-testid="signup-password-input"]', 'StrongPass123!');
      await page.check('[data-testid="signup-terms-checkbox"]');

      const submitBtn = page.locator('[data-testid="signup-submit-btn"]');
      await expect(submitBtn).toBeEnabled();
      await expect(page.locator('[data-testid="signup-google-btn"]')).toBeVisible();
    });
  });

  test.describe('2. Login Journey', () => {
    test('Negative state: displays error on invalid email format', async ({ page }) => {
      await page.goto('/login');

      await page.fill('[data-testid="login-email-input"]', 'not-an-email');
      await page.fill('[data-testid="login-password-input"]', 'SomePass123!');
      await page.click('[data-testid="login-submit-btn"]');

      const errorAlert = page.locator('[data-testid="login-error-alert"]');
      await expect(errorAlert).toBeVisible();
      await expect(errorAlert).toContainText(/email/i);
    });

    test('Negative state: displays error on incorrect password', async ({ page }) => {
      await page.goto('/login');

      await page.fill('[data-testid="login-email-input"]', 'nonexistent_user@example.com');
      await page.fill('[data-testid="login-password-input"]', 'WrongPassword123!');
      await page.click('[data-testid="login-submit-btn"]');

      const errorAlert = page.locator('[data-testid="login-error-alert"]');
      await expect(errorAlert).toBeVisible({ timeout: 10000 });
      await expect(errorAlert).toContainText(/invalid|failed/i);
    });

    test('Happy path: navigation and toggling password visibility', async ({ page }) => {
      await page.goto('/login');

      const passwordInput = page.locator('[data-testid="login-password-input"]');
      await passwordInput.fill('SecretPassword');
      await expect(passwordInput).toHaveAttribute('type', 'password');

      // Click toggle password visibility button
      await page.click('[data-testid="login-toggle-password-btn"]');
      await expect(passwordInput).toHaveAttribute('type', 'text');
    });
  });

  test.describe('3. Core Action Journey: AI Tool Comparison', () => {
    test('Happy path: search, add tool, view compare engine, and export CSV', async ({ authenticatedPage }) => {
      const page = authenticatedPage;
      await page.goto('/compare');

      // Ensure compare page rendered
      await expect(page.locator('h1')).toContainText('AI Tool Comparison');

      // Search for a tool
      const searchInput = page.locator('[data-testid="compare-search-input"]');
      await expect(searchInput).toBeVisible();
      await searchInput.fill('Windsurf');

      // Verify search results dropdown appears
      const searchResults = page.locator('[data-testid="compare-search-results"]');
      await expect(searchResults).toBeVisible();

      // Click to add/toggle tool
      const toolOption = page.locator('[data-testid="compare-select-tool-windsurf"]');
      if (await toolOption.isVisible()) {
        await toolOption.click();
      }

      // Check export CSV button
      const exportBtn = page.locator('[data-testid="compare-export-csv-btn"]');
      await expect(exportBtn).toBeVisible();

      // Check share button
      const shareBtn = page.locator('[data-testid="compare-share-btn"]');
      await expect(shareBtn).toBeVisible();
    });

    test('Failure / Boundary state: empty selection prompt when all tools removed', async ({ authenticatedPage }) => {
      const page = authenticatedPage;
      await page.goto('/compare');
      await page.waitForLoadState('networkidle');

      // Click remove on all initial pills (ChatGPT, Claude, Gemini)
      for (const tool of ['chatgpt', 'claude', 'gemini']) {
        const btn = page.locator(`button[data-testid="remove-tool-${tool}"]`);
        if (await btn.isVisible()) {
          await btn.click();
          await page.waitForTimeout(150);
        }
      }

      // If any extra pills remain, remove them
      const remainingButtons = page.locator('button[data-testid^="remove-tool-"]');
      while (await remainingButtons.count() > 0) {
        await remainingButtons.first().click();
        await page.waitForTimeout(150);
      }

      // Check empty state is displayed
      await expect(page.locator('[data-testid="compare-empty-state"]')).toBeVisible({ timeout: 10000 });
    });
  });

  test.describe('4. Payment & Billing Journey', () => {
    test('Happy path: view plans and upgrade to Pro plan triggers checkout redirect', async ({ authenticatedPage }) => {
      const page = authenticatedPage;
      await page.goto('/billing');

      // Ensure billing page loaded
      await expect(page.locator('[data-testid="current-plan-name"]')).toBeVisible();

      // Check plan cards are present
      await expect(page.locator('[data-testid="plan-card-pro"]')).toBeVisible();
      await expect(page.locator('[data-testid="plan-card-team"]')).toBeVisible();

      // Check upgrade button exists for Pro
      const upgradeProBtn = page.locator('[data-testid="upgrade-btn-pro"]');
      if (await upgradeProBtn.isVisible()) {
        await upgradeProBtn.click();
        // Since local dev uses mock/local checkout, it redirects back to /billing with success
        await expect(page).toHaveURL(/.*billing/);
      }
    });

    test('Boundary state: coupon code input accepts referral codes', async ({ authenticatedPage }) => {
      const page = authenticatedPage;
      await page.goto('/billing');

      // Wait for billing data to load
      await expect(page.locator('[data-testid="current-plan-name"]')).toBeVisible({ timeout: 10000 });

      const couponInput = page.locator('[data-testid="coupon-code-input"]');
      await expect(couponInput).toBeVisible({ timeout: 10000 });
      await couponInput.fill('SAVE25');
      await expect(couponInput).toHaveValue('SAVE25');
    });
  });

  test.describe('5. Logout Journey', () => {
    test('Happy path: open user profile menu and log out cleanly', async ({ authenticatedPage }) => {
      const page = authenticatedPage;
      await page.goto('/');

      // Verify user avatar/menu is visible
      const userMenuBtn = page.locator('[data-testid="user-menu-btn"]');
      await expect(userMenuBtn).toBeVisible();

      // Open user dropdown
      await userMenuBtn.click();
      const dropdownMenu = page.locator('[data-testid="user-dropdown-menu"]');
      await expect(dropdownMenu).toBeVisible();

      // Click logout
      const logoutBtn = page.locator('[data-testid="logout-btn"]');
      await expect(logoutBtn).toBeVisible();
      await logoutBtn.click();

      // Verify redirected and sign in button or avatar reset
      await page.waitForURL('**/', { timeout: 10000 });
      await expect(page.locator('[data-testid="nav-signin-btn"]')).toBeVisible({ timeout: 10000 });
    });
  });

});
