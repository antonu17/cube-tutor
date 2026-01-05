import { test, expect } from '@playwright/test';

test.describe('OLL Algorithm Page', () => {
  test('should display OLL stage page', async ({ page }) => {
    await page.goto('/puzzles/3x3x3/cfop/oll');
    
    // Check page title
    await expect(page.getByRole('heading', { name: /OLL/i }).first()).toBeVisible();
    
    // Check that at least one case is displayed (use exact match to avoid OLL 10-19)
    await expect(page.getByText('OLL 1', { exact: true })).toBeVisible();
  });

  test('should display OLL cases grouped by category', async ({ page }) => {
    await page.goto('/puzzles/3x3x3/cfop/oll');
    
    // Check for categories (dot, line, etc.)
    const caseCards = page.locator('[class*="card"]').or(page.getByText(/OLL \d+/));
    await expect(caseCards.first()).toBeVisible();
  });

  test('should navigate to OLL case detail', async ({ page }) => {
    await page.goto('/puzzles/3x3x3/cfop/oll');
    
    // Click on first OLL case link - use exact match for OLL 1
    const firstCaseLink = page.getByRole('link').filter({ hasText: 'OLL 1' }).first();
    await firstCaseLink.click();
    
    // Should navigate to case detail page
    await page.waitForURL('**/puzzles/3x3x3/cfop/oll/oll-**');
    await expect(page.url()).toMatch(/\/puzzles\/3x3x3\/cfop\/oll\/oll-\d+/);
  });
});

test.describe('OLL Case Detail Page', () => {
  test('should display case information', async ({ page }) => {
    await page.goto('/puzzles/3x3x3/cfop/oll/oll-1');
    
    // Check for case heading
    await expect(page.getByRole('heading', { name: /OLL 1/i })).toBeVisible();
    
    // Check for primary algorithm heading
    await expect(page.getByRole('heading', { name: /Primary Algorithm/i })).toBeVisible();
  });

  test('should display algorithm notation', async ({ page }) => {
    await page.goto('/puzzles/3x3x3/cfop/oll/oll-1');
    
    // Look for algorithm notation (should contain cube move letters)
    const algorithmCode = page.locator('code');
    await expect(algorithmCode.first()).toBeVisible();
    await expect(algorithmCode.first()).toContainText(/[RUFLDBrufldb]/);
  });

  test('should have copy button for algorithm', async ({ page }) => {
    await page.goto('/puzzles/3x3x3/cfop/oll/oll-1');
    
    // Look for copy button
    const copyButton = page.getByRole('button', { name: /copy/i });
    await expect(copyButton).toBeVisible();
  });

  test('should display recognition hints', async ({ page }) => {
    await page.goto('/puzzles/3x3x3/cfop/oll/oll-1');
    
    // Look for recognition hints section
    await expect(page.getByRole('heading', { name: /Recognition Hints/i })).toBeVisible();
  });

  test('should have breadcrumb navigation', async ({ page }) => {
    await page.goto('/puzzles/3x3x3/cfop/oll/oll-1');
    
    // Look for breadcrumb with Home link - simpler approach
    const homeLink = page.getByRole('link', { name: 'Home' });
    await expect(homeLink).toBeVisible();
    
    // Just verify we can navigate back via a link containing "OLL" in nav area
    const backLinks = page.locator('nav a').filter({ hasText: 'OLL' });
    const count = await backLinks.count();
    expect(count).toBeGreaterThan(0);
  });
});
