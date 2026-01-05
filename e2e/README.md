# E2E Tests

End-to-end tests for Cube Tutor using Playwright.

## Test Coverage

### Homepage Tests (`homepage.spec.ts`)
- Page loading and title verification
- Navigation component visibility
- Navigation between pages

### Methods Page Tests (`methods.spec.ts`)
- CFOP method display
- Navigation to method details
- CFOP stages display (OLL, PLL)

### OLL Tests (`oll.spec.ts`)
- OLL cases listing
- Case filtering by group
- Case detail page navigation
- Algorithm information display
- Back navigation

### PLL Tests (`pll.spec.ts`)
- PLL cases listing
- Case detail page navigation
- Algorithm information display

### Accessibility Tests (`accessibility.spec.ts`)
- Heading hierarchy
- Keyboard navigation
- Link accessibility
- SEO meta tags
- Open Graph tags

## Running Tests

### Option 1: Using Docker (Recommended if browser installation fails)

```bash
# Build the Docker image (first time only)
bun run test:e2e:docker:build

# Run tests with Docker (basic)
bun run test:e2e:docker

# Run with video recording (records all tests)
bun run test:e2e:docker:video

# Run with detailed tracing (for debugging)
bun run test:e2e:docker:trace
```

### Option 2: Local Installation

```bash
# Install Playwright browsers (if not already installed)
bunx playwright install chromium

# Run all tests
bun run test:e2e

# Run tests in UI mode (interactive)
bun run test:e2e:ui

# Run tests in debug mode
bun run test:e2e:debug

# Run in headed mode (see browser window)
bun run test:e2e:headed

# Run specific test file
bunx playwright test e2e/homepage.spec.ts

# Run tests in headed mode (see browser)
bunx playwright test --headed
```

## Debugging & Visibility

### Screenshots
Screenshots are automatically captured on test failures and saved to `test-results/`

### Videos
Videos are recorded when tests fail by default. To record all tests:
```bash
# With Docker
bun run test:e2e:docker:video

# Locally
PLAYWRIGHT_VIDEO=on bun run test:e2e
```

### Traces
Traces capture detailed information about test execution. View them in Playwright's trace viewer:
```bash
# Run with tracing
bun run test:e2e:docker:trace

# View traces
bunx playwright show-trace test-results/*/trace.zip
```

### Test Reports
After running tests, view the HTML report with screenshots and videos:
```bash
bunx playwright show-report
```

The report includes:
- Test results summary
- Screenshots of failures
- Videos of failed tests (or all tests if video recording enabled)
- Full test logs and errors

## Installation

### Docker Method (Recommended)
No browser installation needed! Just build the Docker image:
```bash
bun run test:e2e:docker:build
```

### Local Method
If you need to install or reinstall Playwright browsers:

```bash
bunx playwright install chromium
```

**Note:** If you encounter lock file errors during installation, use the Docker method instead.

## Debugging & Visibility

### Screenshots
Screenshots are automatically captured on test failures and saved to `test-results/`

### Videos
Videos are recorded when tests fail by default. To record all tests:
```bash
# With Docker
bun run test:e2e:docker:video

# Locally
PLAYWRIGHT_VIDEO=on bun run test:e2e
```

### Traces
Traces capture detailed information about test execution. View them in Playwright's trace viewer:
```bash
# Run with tracing
bun run test:e2e:docker:trace

# View traces
bunx playwright show-trace test-results/*/trace.zip
```

### Test Reports
After running tests, view the HTML report with screenshots and videos:
```bash
bunx playwright show-report
```

The report includes:
- Test results summary
- Screenshots of failures
- Videos of failed tests (or all tests if video recording enabled)
- Full test logs and errors

## Writing Tests

Tests follow Playwright's best practices:

1. Use `page.getByRole()` for better accessibility testing
2. Use `expect()` for assertions
3. Group related tests with `describe()` blocks
4. Keep tests independent and isolated

## CI/CD

The configuration is set up for CI environments:
- Retries failed tests 2 times in CI
- Runs with single worker in CI for stability
- Generates HTML reports for debugging
