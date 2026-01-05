# Playwright E2E Testing - Quick Start

## Problem
Cannot install Playwright browsers locally due to lock file errors.

## Solution
Use Docker to run tests in a containerized environment with pre-installed browsers.

## Quick Commands

```bash
# First time setup - Build Docker image
bun run test:e2e:docker:build

# Run tests with Docker (basic)
bun run test:e2e:docker

# Run with video recording (see what's happening!)
bun run test:e2e:docker:video

# Run with detailed tracing (for debugging)
bun run test:e2e:docker:trace

# View test report (after running tests)
bunx playwright show-report
```

## Seeing What's Happening

### Video Recording
Videos are automatically saved for failed tests. To record ALL tests:
```bash
bun run test:e2e:docker:video
```
Videos are saved to `test-results/` directory.

### Screenshots
Screenshots are automatically captured when tests fail.

### Traces
For detailed debugging with step-by-step execution:
```bash
bun run test:e2e:docker:trace
bunx playwright show-trace test-results/*/trace.zip
```

### HTML Report
After tests run, view the interactive report:
```bash
bunx playwright show-report
```
Shows test results, screenshots, videos, and logs.

## What's Included

- **5 test files** with **21 tests** covering:
  - Homepage navigation
  - Methods and CFOP pages
  - OLL algorithm pages (listing, filtering, details)
  - PLL algorithm pages
  - Accessibility and SEO

## Test Files

- `e2e/homepage.spec.ts` - Homepage tests
- `e2e/methods.spec.ts` - Methods page tests  
- `e2e/oll.spec.ts` - OLL algorithm tests
- `e2e/pll.spec.ts` - PLL algorithm tests
- `e2e/accessibility.spec.ts` - A11y and SEO tests

## Configuration Files

- `playwright.config.ts` - Playwright configuration
- `Dockerfile.playwright` - Docker image for running tests
- `docker-compose.playwright.yml` - Docker Compose configuration

## More Info

See `e2e/README.md` for detailed documentation.
