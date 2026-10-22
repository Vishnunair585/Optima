import { test as base, Page, expect } from '@playwright/test';

export interface TestUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

export type AuthFixtures = {
  authenticatedPage: Page;
  testUser: TestUser;
};

export const test = base.extend<AuthFixtures>({
  testUser: async ({}, use) => {
    const user: TestUser = {
      id: 'e2e-user-' + Date.now(),
      email: `e2e.tester.${Date.now()}@example.com`,
      name: 'E2E Tester',
      role: 'user',
    };
    await use(user);
  },

  authenticatedPage: async ({ page, baseURL, testUser }, use) => {
    // 1. Establish backend session cookie via test-session endpoint
    const url = (baseURL || 'http://localhost:8080') + '/api/test-session';
    await page.request.post(url, {
      data: {
        action: 'create',
        email: testUser.email,
        name: testUser.name,
        role: testUser.role,
      },
    });

    // 2. Pre-seed mock auth user in localStorage for frontend AuthContext
    await page.addInitScript((mockUser) => {
      localStorage.setItem('__e2e_mock_auth_user', JSON.stringify({
        id: mockUser.id,
        email: mockUser.email,
        name: mockUser.name,
        role: mockUser.role,
        email_verified: true,
        onboarded: true,
      }));
    }, testUser);

    await use(page);

    // Teardown: clear test session
    try {
      await page.request.post(url, { data: { action: 'destroy' } });
    } catch {
      // ignore cleanup errors
    }
  },
});

export { expect };
