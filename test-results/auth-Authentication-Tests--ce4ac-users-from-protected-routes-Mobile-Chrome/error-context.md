# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: auth.spec.ts >> Authentication Tests >> Should redirect unauthenticated users from protected routes
- Location: tests\e2e\auth.spec.ts:5:3

# Error details

```
Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5173/settings
Call log:
  - navigating to "http://localhost:5173/settings", waiting until "load"

```