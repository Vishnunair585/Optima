# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: navigation.spec.ts >> Navigation Tests >> Should handle 404 pages gracefully
- Location: tests\e2e\navigation.spec.ts:16:3

# Error details

```
Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5173/this-route-does-not-exist
Call log:
  - navigating to "http://localhost:5173/this-route-does-not-exist", waiting until "load"

```