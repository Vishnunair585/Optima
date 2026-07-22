# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: negative.spec.ts >> Negative Tests >> Invalid query parameters
- Location: tests\e2e\negative.spec.ts:13:3

# Error details

```
Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5173/rankings?category=invalid-category-12345
Call log:
  - navigating to "http://localhost:5173/rankings?category=invalid-category-12345", waiting until "load"

```