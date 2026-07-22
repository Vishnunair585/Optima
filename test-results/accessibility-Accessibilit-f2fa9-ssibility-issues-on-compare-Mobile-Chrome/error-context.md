# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: accessibility.spec.ts >> Accessibility Tests >> Should not have any automatically detectable accessibility issues on /compare
- Location: tests\e2e\accessibility.spec.ts:7:5

# Error details

```
Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5173/compare
Call log:
  - navigating to "http://localhost:5173/compare", waiting until "load"

```